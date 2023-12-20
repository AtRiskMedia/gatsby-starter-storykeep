// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useMemo } from 'react'
import { ParseOptions, ParseImpressions } from '@tractstack/helpers'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../stores/drupal'
import { IEdit } from '../types'
import EditFormPane from './EditFormPane'
import { generateLivePreviewInitialState } from '../helpers/generateLivePreviewInitialState'

const EditPane = ({ uuid, handleToggle, handleReplacePane }: IEdit) => {
  const [thisUuid, setThisUuid] = useState(uuid)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const thisPane = allPanes[thisUuid]
  const thisPaneOptions = useMemo(
    () => ParseOptions(thisPane.optionsPayload),
    [thisPane.optionsPayload],
  )
  const {
    initialStateLivePreview,
    initialStateLivePreviewMarkdown,
    initialStatePaneFragments,
  } = useMemo(
    () =>
      generateLivePreviewInitialState({
        payload: thisPaneOptions?.paneFragmentsPayload,
        allMarkdown,
        allFiles,
      }),
    [thisPaneOptions?.paneFragmentsPayload, allMarkdown, allFiles],
  )
  const initialStateImpressionsRaw =
    thisUuid &&
    thisPaneOptions?.impressions &&
    ParseImpressions(thisPaneOptions.impressions, thisUuid)
  const initialStateImpressions =
    initialStateImpressionsRaw?.payload &&
    Object.keys(initialStateImpressionsRaw.payload).length
      ? initialStateImpressionsRaw.payload[0]
      : {
          id: uuidv4(),
          parentId: thisUuid,
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
      else initialStateHeldBeliefs[e] = thisPaneOptions.heldBeliefs[e].join(`,`)
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
    if (e?.internal?.type === `bgColour` && typeof e?.bgColour === `string`) {
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
      thisPaneOptions?.codeHook && thisPaneOptions?.codeHook?.target === `h5p`
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
  const fn = () => {}

  return (
    <EditFormPane
      uuid={thisUuid}
      handleToggle={handleToggle}
      handleReplacePane={handleReplacePane || fn}
      setThisUuid={setThisUuid}
      payload={{
        initialState,
        initialFormState,
        initialStatePaneFragments,
        initialStateImpressions,
        initialStateHeldBeliefs,
        initialStateWithheldBeliefs,
        initialStateLivePreview,
        initialStateLivePreviewMarkdown,
      }}
    />
  )
}
export default EditPane
