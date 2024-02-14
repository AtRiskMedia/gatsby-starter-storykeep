// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../../stores/drupal'
import DrupalApi from '../../../components/DrupalApi'
import Layout from '../../../components/Layout'
import MenuState from '../../../components/edit/MenuState'
import {
  EditStages,
  IEditPayload,
  IEditResourceInitialFlags,
} from '../../../types'

export default function EditMenu({ params }: { params: { uuid: string } }) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL_BACK || ``,
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
  const thisMenu = useDrupalStore((state) => state.allMenus[uuid])
  const [payload, setPayload] = useState<IEditPayload>({
    initialState: {},
  })
  const [flags, setFlags] = useState<IEditResourceInitialFlags>({
    isAuthor: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
  })
  const [isSSR, setIsSSR] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // AuthorCheck
  useEffect(() => {
    if (thisMenu && editStage === EditStages.AuthorCheck && !openDemoEnabled) {
      setEditStage(EditStages.AuthorChecking)
      const payload = {
        endpoint: `uuid-by-node/${thisMenu.drupalNid}`,
        method: `GET`,
      }
      setDrupalQueue(thisMenu.drupalNid, payload)
    }
  }, [editStage, setEditStage, openDemoEnabled, setDrupalQueue, thisMenu])
  // AuthorCheck (cont.)
  useEffect(() => {
    if (
      thisMenu &&
      editStage === EditStages.AuthorChecking &&
      drupalResponse &&
      Object.keys(drupalResponse).length &&
      drupalResponse[thisMenu.drupalNid]
    ) {
      const data = drupalResponse[thisMenu.drupalNid]
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
        removeDrupalResponse(thisMenu.drupalNid)
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
    thisMenu,
  ])

  // set initial state
  useEffect(() => {
    if (editStage === EditStages.SetInitialState) {
      setEditStage(EditStages.SettingInitialState)
      const initialState = {
        title: thisMenu.title,
        theme: thisMenu.theme,
        optionsPayload: thisMenu.optionsPayload,
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
    thisMenu?.title,
    thisMenu?.theme,
    thisMenu?.optionsPayload,
    uuid,
  ])

  // handle Stage
  useEffect(() => {
    if (thisMenu)
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
    else if (editStage === EditStages.Deleted)
      navigate(`/storykeep`, { replace: true })
  }, [thisMenu, editStage, setEditStage, openDemoEnabled, setNavLocked, uuid])

  // SSR + valid data check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      if (thisMenu) setIsSSR(false)
      else navigate(`/storykeep`, { replace: true })
    }
  }, [thisMenu, isSSR])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <Layout current="storykeepInner">
          {isLoaded ? (
            <MenuState
              uuid={uuid}
              payload={payload}
              fn={{ setEditStage }}
              flags={{ ...flags, editStage }}
            />
          ) : (
            <></>
          )}
        </Layout>
      </DrupalApi>
    </DrupalProvider>
  )
}
