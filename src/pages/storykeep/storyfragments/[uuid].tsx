// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../../stores/drupal'
import DrupalApi from '../../../components/DrupalApi'
import StoryFragmentState from '../../../components/edit/StoryFragmentState'
import {
  SaveStages,
  EditStages,
  IEditStoryFragmentPayload,
  IEditFlags,
} from '../../../types'

export default function EditStoryFragment({
  params,
}: {
  params: { uuid: string }
}) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const [editStage, setEditStage] = useState(EditStages.Booting)
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const oauthDrupalRoles = useDrupalStore((state) => state.oauthDrupalRoles)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisStoryFragment = allStoryFragments[uuid]
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const allMenus = useDrupalStore(
    (state) => state.allMenus[thisStoryFragment?.menu],
  )
  const thisMenu = thisStoryFragment?.menu
    ? allMenus[thisStoryFragment.menu]
    : null
  const [payload, setPayload] = useState<IEditStoryFragmentPayload>({
    initialState: {},
  })
  const [flags, setFlags] = useState<IEditFlags>({
    isAuthor: false,
    isEmbeddedEdit: !!embeddedEdit,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    isEmpty: false,
    editStage,
    saveStage: SaveStages.Booting,
  })
  const [isSSR, setIsSSR] = useState(true)

  // AuthorCheck
  useEffect(() => {
    if (
      thisStoryFragment &&
      editStage === EditStages.AuthorCheck &&
      !openDemoEnabled
    ) {
      setEditStage(EditStages.AuthorChecking)
      const payload = {
        endpoint: `uuid-by-node/${thisStoryFragment.drupalNid}`,
        method: `GET`,
      }
      setDrupalQueue(thisStoryFragment.drupalNid, payload)
    }
  }, [
    editStage,
    setEditStage,
    openDemoEnabled,
    setDrupalQueue,
    thisStoryFragment,
  ])
  // AuthorCheck (cont.)
  useEffect(() => {
    if (
      thisStoryFragment &&
      editStage === EditStages.AuthorChecking &&
      drupalResponse &&
      Object.keys(drupalResponse).length &&
      drupalResponse[thisStoryFragment.drupalNid]
    ) {
      const data = drupalResponse[thisStoryFragment.drupalNid]
      if (data) {
        data.forEach((e: any) => {
          if (e?.uuid === oauthDrupalUuid)
            setFlags((prev) => ({ ...prev, isAuthor: true }))
        })
        oauthDrupalRoles.split(`, `).forEach((e: any) => {
          if (e === `Administrator`)
            setFlags((prev) => ({ ...prev, isAdmin: true }))
          if (e === `Builder`)
            setFlags((prev) => ({ ...prev, isBuilder: true }))
        })
        removeDrupalResponse(thisStoryFragment.drupalNid)
        setEditStage(EditStages.AuthorChecked)
      }
    }
  }, [
    oauthDrupalRoles,
    oauthDrupalUuid,
    drupalResponse,
    removeDrupalResponse,
    editStage,
    setEditStage,
    thisStoryFragment,
  ])

  // set initial state
  useEffect(() => {
    if (editStage === EditStages.SetInitialState) {
      setEditStage(EditStages.SettingInitialState)
      const initialState = {
        title: thisStoryFragment?.title,
        slug: thisStoryFragment?.slug,
        socialImagePath: thisStoryFragment?.socialImagePath || ``,
        tailwindBgColour: thisStoryFragment?.tailwindBgColour || ``,
        panes: thisStoryFragment?.panes || {},
        contextPanes: thisStoryFragment?.contextPanes || {},
        menu: thisMenu,
        tractstack: thisStoryFragment?.tractstack,
      }
      const payload = {
        initialState,
      }
      setPayload(payload)
      setEditStage(EditStages.InitialStateSet)
    }
  }, [
    editStage,
    setEditStage,
    allFiles,
    allMarkdown,
    thisStoryFragment?.slug,
    thisStoryFragment?.title,
    uuid,
    thisMenu,
    thisStoryFragment?.contextPanes,
    thisStoryFragment?.panes,
    thisStoryFragment?.socialImagePath,
    thisStoryFragment?.tailwindBgColour,
    thisStoryFragment?.tractstack,
  ])

  // handle Stage
  useEffect(() => {
    console.log(`-editStage`, EditStages[editStage])
    if (thisStoryFragment)
      switch (editStage) {
        case EditStages.Booting:
          if (!openDemoEnabled) setEditStage(EditStages.AuthorCheck)
          else setEditStage(EditStages.AuthorChecked)
          break

        case EditStages.AuthorChecked:
          setEditStage(EditStages.CheckEmbedded)
          break

        case EditStages.CheckEmbedded:
          if (embeddedEdit.child === uuid)
            setFlags((prev) => ({ ...prev, isEmbeddedEdit: true }))
          setEditStage(EditStages.SetInitialState)
          break

        case EditStages.InitialStateSet:
          setEditStage(EditStages.Activated)
          break
      }
  }, [
    thisStoryFragment,
    editStage,
    setEditStage,
    openDemoEnabled,
    embeddedEdit.child,
    uuid,
  ])

  // SSR check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      setIsSSR(false)
    }
  }, [isSSR])

  if (isSSR) return null
  if (!thisStoryFragment) navigate(`/storykeep`)

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        {editStage < EditStages.Activated ? (
          <></>
        ) : (
          <StoryFragmentState uuid={uuid} payload={payload} flags={flags} />
        )}
      </DrupalApi>
    </DrupalProvider>
  )
}
