// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../../stores/drupal'
import DrupalApi from '../../../components/DrupalApi'
import Layout from '../../../components/Layout'
import TractStackState from '../../../components/edit/TractStackState'
import {
  getPanesDaysSince,
  getStoryFragmentDaysSince,
} from '../../../api/services'
import {
  SaveStages,
  EditStages,
  IEditPayload,
  IActivityDetails,
  IEditTractStackFlags,
} from '../../../types'

const goGetStoryFragmentDaysSince = async () => {
  try {
    const response = await getStoryFragmentDaysSince()
    const data = response?.data
    if (data) {
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const goGetPanesDaysSince = async () => {
  try {
    const response = await getPanesDaysSince()
    const data = response?.data
    if (data) {
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const daysSinceDataPayload = (data: any) => {
  const maxSince =
    data.length === 0
      ? 0
      : data.reduce((a: any, b: any) =>
          a.hours_since_activity > b.hours_since_activity ? a : b,
        ).hours_since_activity
  const payload: IActivityDetails = {}
  data
    .map((e: any) => {
      if (!e || !e.title) return null
      let colorOffset =
        maxSince === 0
          ? 0
          : 10 *
            Math.round((10 * (maxSince - e.hours_since_activity)) / maxSince)
      if (colorOffset < 20) colorOffset = 20
      if (colorOffset > 95) colorOffset = 95
      return {
        id: e.storyFragmentId || e.paneId,
        engagement: Math.max(
          1,
          Math.min(
            95,
            Math.round((100 * (maxSince - e.hours_since_activity)) / maxSince),
          ),
        ),
        daysSince: Math.round((e.hours_since_activity / 24) * 10) / 10,
        colorOffset: colorOffset.toString(),
        read: parseInt(e.red),
        glossed: parseInt(e.glossed),
        clicked: parseInt(e.clicked),
        entered: parseInt(e.entered),
        discovered: parseInt(e.discovered),
      }
    })
    .filter((n: any) => n)
    .forEach((e: any) => {
      payload[e.id] = {
        engagement: e.engagement,
        daysSince: e.daysSince,
        colorOffset: e.colorOffset,
        read: e.read,
        glossed: e.glossed,
        clicked: e.clicked,
        entered: e.entered,
        discovered: e.discovered,
      }
    })
  return payload
}

export default function EditTractStack({
  params,
}: {
  params: { uuid: string }
}) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const [editStage, setEditStage] = useState(EditStages.Booting)
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const selectedCollection = useDrupalStore((state) => state.selectedCollection)
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
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
  const [flags, setFlags] = useState<IEditTractStackFlags>({
    isAuthor: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    isEmpty:
      !!thisTractStack?.contextPanes?.length &&
      !!thisTractStack?.storyFragments?.length,
    hasStoryFragments: !!thisTractStack?.storyFragments?.length,
    hasContextPanes: !!thisTractStack?.contextPanes?.length,
    editStage,
    saveStage: SaveStages.Booting,
    storyFragmentDaysSinceData: undefined,
    panesDaysSinceData: undefined,
  })
  const [isSSR, setIsSSR] = useState(true)
  const [storyFragmentDaysSinceData, setStoryFragmentDaysSinceData] =
    useState<IActivityDetails>({})
  const [loadingStoryFragmentDaysSince, setLoadingStoryFragmentDaysSince] =
    useState(false)
  const [loadedStoryFragmentDaysSince, setLoadedStoryFragmentDaysSince] =
    useState(false)
  const [panesDaysSinceData, setPanesDaysSinceData] =
    useState<IActivityDetails>({})
  const [loadingPanesDaysSince, setLoadingPanesDaysSince] = useState(false)
  const [loadedPanesDaysSince, setLoadedPanesDaysSince] = useState(false)
  const [maxRetryPanes, setMaxRetryPanes] = useState<undefined | boolean>(
    undefined,
  )
  const [maxRetryStoryFragments, setMaxRetryStoryFragments] = useState<
    undefined | boolean
  >(undefined)

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
        storyfragments: thisTractStack?.storyfragments || {},
        contextPanes: thisTractStack?.contextPanes || {},
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
    thisTractStack?.slug,
    thisTractStack?.title,
    thisTractStack?.contextPanes,
    thisTractStack?.storyfragments,
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
          setEditStage(EditStages.CheckEmbedded)
          break

        case EditStages.CheckEmbedded:
          if (embeddedEdit.child === uuid)
            setFlags((prev) => ({ ...prev, isEmbeddedEdit: true }))
          setEditStage(EditStages.SetInitialState)
          break

        case EditStages.InitialStateSet:
          setNavLocked(false)
          setEditStage(EditStages.Activated)
          break
      }
  }, [
    thisTractStack,
    editStage,
    setEditStage,
    openDemoEnabled,
    setNavLocked,
    embeddedEdit.child,
    uuid,
  ])

  // SSR check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      setIsSSR(false)
    }
  }, [isSSR])

  // load chart data for storyfragments
  useEffect(() => {
    if (
      selectedCollection === `storyfragment` &&
      storyFragmentDaysSinceData &&
      Object.keys(storyFragmentDaysSinceData).length === 0 &&
      !loadingStoryFragmentDaysSince &&
      !loadedStoryFragmentDaysSince &&
      !maxRetryStoryFragments
    ) {
      setLoadingStoryFragmentDaysSince(true)
      goGetStoryFragmentDaysSince()
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            const payload = daysSinceDataPayload(JSON.parse(res.data.data))
            setStoryFragmentDaysSinceData(payload)
            setFlags((prev) => ({
              ...prev,
              storyFragmentDaysSinceData: payload,
            }))
            setLoadedStoryFragmentDaysSince(true)
          } else {
            if (typeof maxRetryStoryFragments === `undefined`) {
              setMaxRetryStoryFragments(false)
              setLoadingStoryFragmentDaysSince(false)
            } else if (typeof maxRetryStoryFragments === `undefined`) {
              setMaxRetryStoryFragments(true)
              setLoadingStoryFragmentDaysSince(false)
            }
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
    }
  }, [
    storyFragmentDaysSinceData,
    loadedStoryFragmentDaysSince,
    loadingStoryFragmentDaysSince,
    selectedCollection,
    maxRetryStoryFragments,
  ])

  // load chart data for panes
  useEffect(() => {
    if (
      selectedCollection === `pane` &&
      panesDaysSinceData &&
      Object.keys(panesDaysSinceData).length === 0 &&
      !loadingPanesDaysSince &&
      !loadedPanesDaysSince &&
      !maxRetryPanes
    ) {
      setLoadingPanesDaysSince(true)
      goGetPanesDaysSince()
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            const payload = daysSinceDataPayload(JSON.parse(res.data.data))
            setPanesDaysSinceData(payload)
            setFlags((prev) => ({ ...prev, panesDaysSinceData: payload }))
            setLoadedPanesDaysSince(true)
          } else {
            if (typeof maxRetryPanes === `undefined`) {
              setMaxRetryPanes(false)
              setLoadingPanesDaysSince(false)
            } else if (typeof maxRetryPanes === `undefined`) {
              setMaxRetryPanes(true)
              setLoadingPanesDaysSince(false)
            }
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
    }
  }, [
    panesDaysSinceData,
    loadedPanesDaysSince,
    loadingPanesDaysSince,
    selectedCollection,
    maxRetryPanes,
  ])

  if (isSSR) return null
  if (!thisTractStack) navigate(`/storykeep`)

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <Layout current="storykeep">
          {editStage < EditStages.Activated ? (
            <></>
          ) : (
            <TractStackState uuid={uuid} payload={payload} flags={flags} />
          )}
        </Layout>
      </DrupalApi>
    </DrupalProvider>
  )
}
