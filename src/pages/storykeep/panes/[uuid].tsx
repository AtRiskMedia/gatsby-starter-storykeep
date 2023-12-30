// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { ParseOptions, ParseImpressions } from '@tractstack/helpers'
import { navigate } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../../stores/drupal'
import { generateLivePreviewInitialState } from '../../../helpers/generateLivePreviewInitialState'
import DrupalApi from '../../../components/DrupalApi'
import PaneState from '../../../components/edit/PaneState'
import {
  EditStages,
  SaveStages,
  IEditPanePayload,
  IEditPaneFlags,
  ICleanerNode,
} from '../../../types'

export default function EditPane({ params }: { params: { uuid: string } }) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const cleanerQueue = useDrupalStore((state) => state.cleanerQueue)
  const removeCleanerQueue = useDrupalStore((state) => state.removeCleanerQueue)
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const [editStage, setEditStage] = useState(EditStages.Booting)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const oauthDrupalRoles = useDrupalStore((state) => state.oauthDrupalRoles)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const thisPane = typeof allPanes[uuid] !== `undefined` ? allPanes[uuid] : null
  const [payload, setPayload] = useState<IEditPanePayload>({
    initialState: {},
    initialFormState: {},
    initialStatePaneFragments: {},
    initialStateImpressions: {},
    initialStateHeldBeliefs: {},
    initialStateWithheldBeliefs: {},
    initialStateLivePreview: {},
    initialStateLivePreviewMarkdown: {},
  })
  const [flags, setFlags] = useState<IEditPaneFlags>({
    isAuthor: false,
    isEmbeddedEdit: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    editStage: EditStages.Booting,
  })
  const [isSSR, setIsSSR] = useState(true)

  // SSR check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      setIsSSR(false)
    }
  }, [isSSR])

  // AuthorCheck
  useEffect(() => {
    if (thisPane && editStage === EditStages.AuthorCheck && !openDemoEnabled) {
      setEditStage(EditStages.AuthorChecking)
      const payload = {
        endpoint: `uuid-by-node/${thisPane.drupalNid}`,
        method: `GET`,
      }
      setDrupalQueue(thisPane.drupalNid, payload)
    }
  }, [editStage, setEditStage, openDemoEnabled, setDrupalQueue, thisPane])
  // AuthorCheck (cont.)
  useEffect(() => {
    if (
      thisPane &&
      editStage === EditStages.AuthorChecking &&
      drupalResponse &&
      Object.keys(drupalResponse).length &&
      drupalResponse[thisPane.drupalNid]
    ) {
      const data = drupalResponse[thisPane.drupalNid]
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
        removeDrupalResponse(thisPane.drupalNid)
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
    thisPane,
  ])

  // set initial state
  useEffect(() => {
    if (editStage === EditStages.SetInitialState) {
      setEditStage(EditStages.SettingInitialState)
      const thisPaneOptions = ParseOptions(thisPane.optionsPayload)
      const {
        initialStateLivePreview,
        initialStateLivePreviewMarkdown,
        initialStatePaneFragments,
      } = generateLivePreviewInitialState({
        payload: thisPaneOptions?.paneFragmentsPayload,
        allMarkdown,
        allFiles,
      })
      const initialStateImpressionsRaw =
        uuid &&
        thisPaneOptions?.impressions &&
        ParseImpressions(thisPaneOptions.impressions, uuid)
      const initialStateImpressions =
        initialStateImpressionsRaw?.payload &&
        Object.keys(initialStateImpressionsRaw.payload).length
          ? initialStateImpressionsRaw.payload[0]
          : {
              id: uuidv4(),
              parentId: uuid,
              title: ``,
              body: ``,
              actionLisp: ``,
              buttonText: ``,
            }
      const initialStateHeldBeliefs: any = {}
      thisPaneOptions?.heldBeliefs &&
        Object.keys(thisPaneOptions.heldBeliefs).forEach((e: any) => {
          if (typeof thisPaneOptions.heldBeliefs[e] === `string`)
            initialStateHeldBeliefs[e] = thisPaneOptions.heldBeliefs[e]
          else
            initialStateHeldBeliefs[e] =
              thisPaneOptions.heldBeliefs[e].join(`,`)
        })
      const initialStateWithheldBeliefs: any = {}
      thisPaneOptions?.withheldBeliefs &&
        Object.keys(thisPaneOptions.withheldBeliefs).forEach((e: any) => {
          if (typeof thisPaneOptions.withheldBeliefs[e] === `string`)
            initialStateWithheldBeliefs[e] = thisPaneOptions.withheldBeliefs[e]
          else
            initialStateWithheldBeliefs[e] =
              thisPaneOptions.withheldBeliefs[e].join(`,`)
        })
      let hasBgColourId = ``
      let hasBgColour = ``
      let hasBreaks = false
      thisPaneOptions?.paneFragmentsPayload?.forEach((e: any) => {
        if (
          e?.internal?.type === `bgColour` &&
          typeof e?.bgColour === `string`
        ) {
          hasBgColourId = e.id
          hasBgColour = e.bgColour
        }
        if (
          e?.internal?.type === `bgPane` &&
          (e?.optionsPayload?.artpack?.desktop?.mode === `break` ||
            e?.optionsPayload?.artpack?.tablet?.mode === `break` ||
            e?.optionsPayload?.artpack?.mobile?.mode === `break`)
        )
          hasBreaks = true
      })
      const initialState = {
        title: thisPane.title,
        slug: thisPane.slug,
        heightOffsetDesktop: thisPane.heightOffsetDesktop,
        heightOffsetTablet: thisPane.heightOffsetTablet,
        heightOffsetMobile: thisPane.heightOffsetMobile,
        heightRatioDesktop: thisPane.heightRatioDesktop,
        heightRatioTablet: thisPane.heightRatioTablet,
        heightRatioMobile: thisPane.heightRatioMobile,
        isContextPane: thisPane.isContextPane,
        optionsPayloadString: thisPane.optionsPayload,
        hasCodeHook:
          typeof thisPaneOptions?.codeHook === `object`
            ? thisPaneOptions.codeHook
            : false,
        hasH5P: !!(
          thisPaneOptions?.codeHook &&
          thisPaneOptions?.codeHook?.target === `h5p`
        ),
        codeHookTarget:
          typeof thisPaneOptions?.codeHook?.target === `string`
            ? thisPaneOptions.codeHook.target
            : false,
        codeHookTargetUrl:
          typeof thisPaneOptions?.codeHook?.url === `string`
            ? thisPaneOptions.codeHook.url
            : false,
        codeHookHeight:
          typeof thisPaneOptions?.codeHook?.height === `string`
            ? thisPaneOptions.codeHook.height
            : false,
        codeHookWidth:
          typeof thisPaneOptions?.codeHook?.width === `string`
            ? thisPaneOptions.codeHook.width
            : false,
        hiddenPane:
          typeof thisPaneOptions?.hiddenPane === `boolean`
            ? thisPaneOptions.hiddenPane
            : false,
        overflowHidden:
          typeof thisPaneOptions?.overflowHidden === `boolean`
            ? thisPaneOptions.overflowHidden
            : false,
        maxHeightScreen: !!(
          thisPaneOptions &&
          thisPaneOptions[`max-h-screen`] &&
          thisPaneOptions[`max-h-screen`] === true
        ),
        hasHeldBeliefsPayload: !!(
          thisPaneOptions?.heldBeliefs &&
          Object.keys(thisPaneOptions?.heldBeliefs).length
        ),
        hasWithheldBeliefsPayload: !!(
          thisPaneOptions?.withheldBeliefs &&
          Object.keys(thisPaneOptions?.withheldBeliefs).length
        ),
        hasImpressions: typeof initialStateImpressionsRaw !== `undefined`,
        hasBgColourId,
        hasBgColour,
        hasBreaks,
      }
      const initialFormState = {
        submitted: false,
        saving: false,
        success: false,
        changes: false,
        slugCollision: false,
      }
      const payload = {
        initialState,
        initialFormState,
        initialStatePaneFragments,
        initialStateImpressions,
        initialStateHeldBeliefs,
        initialStateWithheldBeliefs,
        initialStateLivePreview,
        initialStateLivePreviewMarkdown,
      }
      setPayload(payload)
      setEditStage(EditStages.InitialStateSet)
    }
  }, [
    editStage,
    setEditStage,
    allFiles,
    allMarkdown,
    thisPane?.heightOffsetDesktop,
    thisPane?.heightOffsetMobile,
    thisPane?.heightOffsetTablet,
    thisPane?.heightRatioDesktop,
    thisPane?.heightRatioMobile,
    thisPane?.heightRatioTablet,
    thisPane?.isContextPane,
    thisPane?.optionsPayload,
    thisPane?.slug,
    thisPane?.title,
    uuid,
  ])

  // handle Stage
  useEffect(() => {
    if (thisPane)
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
          setEditStage(EditStages.Cleanup)
          break

        case EditStages.Cleanup:
          cleanerQueue.forEach((e: ICleanerNode) => {
            console.log(e)
            // must delete from allPanes, etc.
            removeCleanerQueue(Object.keys(e)[0])
          })
          setEditStage(EditStages.SetInitialState)
          break

        case EditStages.InitialStateSet:
          setEditStage(EditStages.Activated)
          break
      }
  }, [
    thisPane,
    editStage,
    setEditStage,
    openDemoEnabled,
    cleanerQueue,
    embeddedEdit.child,
    removeCleanerQueue,
    uuid,
  ])

  if (isSSR) return null
  if (!thisPane) navigate(`/storykeep`)

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        {editStage < EditStages.Activated ? (
          <></>
        ) : (
          <PaneState
            uuid={uuid}
            payload={payload}
            flags={{ ...flags, editStage }}
          />
        )}
      </DrupalApi>
    </DrupalProvider>
  )
}
