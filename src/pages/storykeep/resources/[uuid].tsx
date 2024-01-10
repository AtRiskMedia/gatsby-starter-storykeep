// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../../stores/drupal'
import DrupalApi from '../../../components/DrupalApi'
import Layout from '../../../components/Layout'
import ResourceState from '../../../components/edit/ResourceState'
import {
  SaveStages,
  EditStages,
  IEditPayload,
  IEditResourceFlags,
} from '../../../types'

export default function EditResource({ params }: { params: { uuid: string } }) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const [editStage, setEditStage] = useState(EditStages.Booting)
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const oauthDrupalRoles = useDrupalStore((state) => state.oauthDrupalRoles)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const thisResource = useDrupalStore((state) => state.allResources[uuid])
  const [payload, setPayload] = useState<IEditPayload>({
    initialState: {},
  })
  const [flags, setFlags] = useState<IEditResourceFlags>({
    isAuthor: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    editStage,
    saveStage: SaveStages.Booting,
  })
  const [isSSR, setIsSSR] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // AuthorCheck
  useEffect(() => {
    if (
      thisResource &&
      editStage === EditStages.AuthorCheck &&
      !openDemoEnabled
    ) {
      setEditStage(EditStages.AuthorChecking)
      const payload = {
        endpoint: `uuid-by-node/${thisResource.drupalNid}`,
        method: `GET`,
      }
      setDrupalQueue(thisResource.drupalNid, payload)
    }
  }, [editStage, setEditStage, openDemoEnabled, setDrupalQueue, thisResource])
  // AuthorCheck (cont.)
  useEffect(() => {
    if (
      thisResource &&
      editStage === EditStages.AuthorChecking &&
      drupalResponse &&
      Object.keys(drupalResponse).length &&
      drupalResponse[thisResource.drupalNid]
    ) {
      const data = drupalResponse[thisResource.drupalNid]
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
        removeDrupalResponse(thisResource.drupalNid)
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
    thisResource,
  ])

  // set initial state
  useEffect(() => {
    if (editStage === EditStages.SetInitialState) {
      setEditStage(EditStages.SettingInitialState)
      const initialState = {
        title: thisResource?.title,
        slug: thisResource?.slug,
        categorySlug: thisResource.categorySlug,
        actionLisp: thisResource.actionLisp,
        drupalNid: thisResource.drupalNid,
        oneliner: thisResource.oneliner,
        optionsPayload: thisResource.optionsPayload,
      }
      const payload = {
        initialState,
      }
      setPayload(payload)
      setIsLoaded(true)
      setEditStage(EditStages.InitialStateSet)
    }
  }, [
    editStage,
    setEditStage,
    thisResource?.slug,
    thisResource?.title,
    thisResource?.actionLisp,
    thisResource?.categorySlug,
    thisResource?.drupalNid,
    thisResource?.oneliner,
    thisResource?.optionsPayload,
    uuid,
  ])

  // handle Stage
  useEffect(() => {
    if (thisResource)
      switch (editStage) {
        case EditStages.Booting:
          if (!openDemoEnabled) setEditStage(EditStages.AuthorCheck)
          else setEditStage(EditStages.AuthorChecked)
          break

        case EditStages.AuthorChecked:
          setEditStage(EditStages.SetInitialState)
          break

        case EditStages.InitialStateSet:
          setNavLocked(false)
          setEditStage(EditStages.Activated)
          break
      }
  }, [
    thisResource,
    editStage,
    setEditStage,
    openDemoEnabled,
    setNavLocked,
    uuid,
  ])

  // SSR + valid data check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      if (thisResource) setIsSSR(false)
      else navigate(`/storykeep`)
    }
  }, [thisResource, isSSR])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <Layout current="storykeepInner">
          {isLoaded ? (
            <ResourceState uuid={uuid} payload={payload} flags={flags} />
          ) : (
            <></>
          )}
        </Layout>
      </DrupalApi>
    </DrupalProvider>
  )
}
