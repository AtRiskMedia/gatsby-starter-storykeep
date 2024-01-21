// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../../stores/drupal'
import { useAuthStore } from '../../../stores/authStore'
import DrupalApi from '../../../components/DrupalApi'
import ConciergeApi from '../../../components/ConciergeApi'
import Layout from '../../../components/Layout'
import TractStackState from '../../../components/edit/TractStackState'
import {
  Stages,
  EditStages,
  IEditPayload,
  IEditTractStackInitialFlags,
} from '../../../types'

export default function EditTractStack({
  params,
}: {
  params: { uuid: string }
}) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL_BACK || ``,
  }
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const validToken = useAuthStore((state) => state.validToken)
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
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const thisTractStack = allTractStacks[uuid]
  const [payload, setPayload] = useState<IEditPayload>({
    initialState: {},
  })
  const [flags, setFlags] = useState<IEditTractStackInitialFlags>({
    isAuthor: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    isEmpty:
      !!thisTractStack?.contextPanes?.length &&
      !!thisTractStack?.storyFragments?.length,
    hasStoryFragments: !!thisTractStack?.storyFragments?.length,
    hasContextPanes: !!thisTractStack?.contextPanes?.length,
    storyFragmentDaysSinceData: undefined,
    panesDaysSinceData: undefined,
  })
  const [isSSR, setIsSSR] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // AuthorCheck
  useEffect(() => {
    if (
      thisTractStack &&
      editStage === EditStages.AuthorCheck &&
      !openDemoEnabled
    ) {
      setEditStage(EditStages.AuthorChecking)
      const payload = {
        endpoint: `uuid-by-node/${thisTractStack.drupalNid}`,
        method: `GET`,
      }
      setDrupalQueue(thisTractStack.drupalNid, payload)
    }
  }, [editStage, setEditStage, openDemoEnabled, setDrupalQueue, thisTractStack])
  // AuthorCheck (cont.)
  useEffect(() => {
    if (
      thisTractStack &&
      editStage === EditStages.AuthorChecking &&
      drupalResponse &&
      Object.keys(drupalResponse).length &&
      drupalResponse[thisTractStack.drupalNid]
    ) {
      const data = drupalResponse[thisTractStack.drupalNid]
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
        removeDrupalResponse(thisTractStack.drupalNid)
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
    thisTractStack,
  ])

  // set initial state
  useEffect(() => {
    if (editStage === EditStages.SetInitialState) {
      setEditStage(EditStages.SettingInitialState)
      const initialState = {
        title: thisTractStack?.title,
        slug: thisTractStack?.slug,
        socialImagePath: thisTractStack?.socialImagePath || ``,
        storyFragments: thisTractStack?.storyFragments || [],
        contextPanes: thisTractStack?.contextPanes || [],
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
    thisTractStack?.slug,
    thisTractStack?.title,
    thisTractStack?.contextPanes,
    thisTractStack?.storyFragments,
    thisTractStack?.socialImagePath,
    uuid,
  ])

  // handle Stage
  useEffect(() => {
    if (thisTractStack)
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
    else if (editStage === EditStages.Deleted) navigate(`/storykeep`)
  }, [
    thisTractStack,
    editStage,
    setEditStage,
    openDemoEnabled,
    setNavLocked,
    uuid,
  ])

  // Concierge API check
  useEffect(() => {
    if (
      process.env.NODE_ENV === `production` &&
      !validToken &&
      stage === Stages.Activated
    )
      setStage(Stages.Initialize)
    if (stage < Stages.Initialize) navigate(`/login`)
  }, [stage, validToken, setStage])

  // SSR + valid data check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      if (thisTractStack) setIsSSR(false)
      else navigate(`/storykeep`)
    }
  }, [thisTractStack, isSSR])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <Layout current="storykeep">
          <ConciergeApi>
            {isLoaded ? (
              <TractStackState
                uuid={uuid}
                payload={payload}
                flags={{ ...flags, editStage }}
                fn={{ setEditStage }}
              />
            ) : (
              <></>
            )}
          </ConciergeApi>
        </Layout>
      </DrupalApi>
    </DrupalProvider>
  )
}
