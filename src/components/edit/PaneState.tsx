// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect, useCallback, MouseEvent } from 'react'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { ParseOptions } from '@tractstack/helpers'
import { v4 as uuidv4 } from 'uuid'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../stores/drupal'
import { reduceTailwindClasses } from '../../helpers/reduceTailwindClasses'
import { generateLivePreviewInitialState } from '../../helpers/generateLivePreviewInitialState'
import {
  panePayload,
  markdownPayload,
} from '../../helpers/generateDrupalPayload'
import {
  shapesMobileHeightRatio,
  artpackCollectionImages,
} from '../../helpers/allowedShapeNames'
import { starterTemplate } from '../../helpers/starterTemplates'
import PaneForm from './PaneForm'
import { IPaneState, IEmbeddedEdit, EditStages, SaveStages } from '../../types'

const PaneState = ({ uuid, payload, flags, fn }: IPaneState) => {
  // const apiBase = process.env.DRUPAL_APIBASE
  const { setEditStage } = fn
  const [stateHeldBeliefs, setStateHeldBeliefs] = useState(
    payload.initialStateHeldBeliefs,
  )
  const [stateWithheldBeliefs, setStateWithheldBeliefs] = useState(
    payload.initialStateWithheldBeliefs,
  )
  const [stateImpressions, setStateImpressions] = useState(
    payload.initialStateImpressions,
  )
  const [stateLivePreview, setStateLivePreview] = useState(
    payload.initialStateLivePreview,
  )
  const [stateLivePreviewMarkdown, setStateLivePreviewMarkdown] = useState(
    payload.initialStateLivePreviewMarkdown,
  )
  const [statePaneFragments, setStatePaneFragments] = useState(
    payload.initialStatePaneFragments,
  )
  const [unremovedMarkdownImages, setUnremovedMarkdownImages] = useState({})
  const [unsavedMarkdownImages, setUnsavedMarkdownImages] = useState({})
  const [unsavedMarkdownImageSvgs, setUnsavedMarkdownImageSvgs] = useState({})
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.initialState)
  const [slugCollision, setSlugCollision] = useState(false)
  const [newUuid, setNewUuid] = useState(``)
  const [newEmbeddedPayload, setNewEmbeddedPayload] = useState<IEmbeddedEdit>({
    child: null,
    childType: null,
    parent: null,
    parentType: null,
    parentState: undefined,
    grandChild: undefined,
    grandChildType: undefined,
  })
  const [updateMarkdownPayload, setUpdateMarkdownPayload]: any = useState([])
  const [updatePanePayload, setUpdatePanePayload]: any = useState([])
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const [imageUpdatedMarkdown, setImageUpdatedMarkdown]: any = useState([])
  const [locked, setLocked] = useState(false)
  const [showImageLibrary, setShowImageLibrary] = useState(false)
  const [newImage, setNewImage]: any = useState(null)
  const [newImagePos, setNewImagePos]: any = useState(null)
  const deepEqual = require(`deep-equal`)
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const setEmbeddedEdit = useDrupalStore((state) => state.setEmbeddedEdit)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const thisPane = typeof allPanes[uuid] !== `undefined` ? allPanes[uuid] : null
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const updateMarkdown = useDrupalStore((state) => state.updateMarkdown)
  const updateFiles = useDrupalStore((state) => state.updateFiles)
  const drupalPreSaveQueue = useDrupalStore((state) => state.drupalPreSaveQueue)
  const setDrupalDeleteNode = useDrupalStore(
    (state) => state.setDrupalDeleteNode,
  )
  const removeDrupalPreSaveQueue = useDrupalStore(
    (state) => state.removeDrupalPreSaveQueue,
  )
  const setDrupalPreSaveQueue = useDrupalStore(
    (state) => state.setDrupalPreSaveQueue,
  )
  const setDrupalSaveNode = useDrupalStore((state) => state.setDrupalSaveNode)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const setPane = useDrupalStore((state) => state.setPane)
  const removePane = useDrupalStore((state) => state.removePane)
  const removeMarkdown = useDrupalStore((state) => state.removeMarkdown)
  const setCleanerQueue = useDrupalStore((state) => state.setCleanerQueue)
  const cleanerQueue = useDrupalStore((state) => state.cleanerQueue)
  const removeCleanerQueue = useDrupalStore((state) => state.removeCleanerQueue)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const allPanesSlugs = Object.keys(allPanes).map((e) => {
    return allPanes[e].slug
  })
  const isEmpty =
    statePaneFragments &&
    Object.keys(statePaneFragments).length === 0 &&
    !state?.hasCodeHook
  const isUsed =
    allTractStacks &&
    Object.keys(allTractStacks)
      .map((e: string) => {
        if (allTractStacks[e].storyFragments.includes(uuid)) return true
        return null
      })
      .filter((n: boolean | null) => n).length + allStoryFragments &&
    Object.keys(allStoryFragments)
      .map((e: string) => {
        if (allStoryFragments[e].panes.includes(uuid)) return true
        return null
      })
      .filter((n: boolean | null) => n).length

  const regenerateState = useCallback(
    (
      payload?: any,
      id?: string | null,
      extra?: any,
      paneExtra?: any,
      newMarkdownId?: string,
    ) => {
      const paneFragmentId = id || stateLivePreviewMarkdown.paneFragmentId
      const markdownPaneFragmentId = stateLivePreviewMarkdown?.paneFragmentId
      const isMarkdown = paneFragmentId === markdownPaneFragmentId
      const markdownId = newMarkdownId || stateLivePreviewMarkdown?.markdownId
      const markdownBody = stateLivePreviewMarkdown?.markdownArray?.join(`\n`)
      const extras = extra || {}
      const thisMarkdown = markdownId
        ? {
            [markdownId]: {
              ...allMarkdown[markdownId],
              markdownBody,
            },
          }
        : {}
      const paneFragmentsPayload =
        payload && isMarkdown
          ? {
              ...statePaneFragments,
              [paneFragmentId]: {
                ...statePaneFragments[paneFragmentId],
                ...extras,
                markdownBody,
                optionsPayload: payload,
              },
            }
          : payload && markdownId
            ? {
                ...statePaneFragments,
                [paneFragmentId]: {
                  ...statePaneFragments[paneFragmentId],
                  ...extras,
                  optionsPayload: payload,
                },
                [markdownPaneFragmentId]: {
                  ...statePaneFragments[markdownPaneFragmentId],
                  markdownBody,
                },
              }
            : payload
              ? {
                  ...statePaneFragments,
                  [paneFragmentId]: {
                    ...statePaneFragments[paneFragmentId],
                    ...extras,
                    optionsPayload: payload,
                  },
                }
              : extras && newMarkdownId
                ? {
                    ...statePaneFragments,
                    [paneFragmentId]: {
                      ...statePaneFragments[paneFragmentId],
                      ...extras,
                      markdownId: newMarkdownId,
                    },
                  }
                : { ...statePaneFragments }
      const {
        initialStateLivePreviewMarkdown,
        initialStateLivePreview,
        initialStatePaneFragments,
      } = generateLivePreviewInitialState({
        payload: Object.values(paneFragmentsPayload),
        allMarkdown: thisMarkdown,
        allFiles,
        unsavedMarkdownImages,
        unsavedMarkdownImageSvgs,
      })
      setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
      setStateLivePreview(initialStateLivePreview)
      const newStatePaneFragments = {
        ...statePaneFragments,
        [paneFragmentId]: initialStatePaneFragments[paneFragmentId],
      }
      setStatePaneFragments(newStatePaneFragments)
      const impressionsPayload = stateImpressions?.title
        ? {
            [stateImpressions.id]: stateImpressions,
          }
        : null
      const newOptionsPayload: any = {}
      if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
      if (Object.keys(stateHeldBeliefs).length)
        newOptionsPayload.heldBeliefs = stateHeldBeliefs
      if (Object.keys(stateWithheldBeliefs).length)
        newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
      if (newStatePaneFragments)
        newOptionsPayload.paneFragmentsPayload = Object.values(
          newStatePaneFragments,
        )
      if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
      if (state.hasCodeHook) {
        newOptionsPayload.codeHook = {}
        if (state.codeHookTarget)
          newOptionsPayload.codeHook.target = state.codeHookTarget
        if (state.codeHookTargetUrl)
          newOptionsPayload.codeHook.url = state.codeHookTargetUrl
        if (state.codeHookHeight)
          newOptionsPayload.codeHook.height = state.codeHookHeight
        if (state.codeHookWidth)
          newOptionsPayload.codeHook.width = state.codeHookWidth
      }
      if (state.overflowHidden)
        newOptionsPayload.overflowHidden = state.overflowHidden
      setState((prev: any) => {
        return {
          ...prev,
          optionsPayloadString: JSON.stringify(newOptionsPayload),
          ...(paneExtra || {}),
        }
      })
      setToggleCheck(true)
    },
    [
      allFiles,
      allMarkdown,
      state?.hiddenPane,
      state?.overflowHidden,
      state?.codeHookTarget,
      state?.codeHookTargetUrl,
      state?.codeHookHeight,
      state?.codeHookWidth,
      state?.hasCodeHook,
      stateHeldBeliefs,
      stateImpressions,
      stateLivePreviewMarkdown?.markdownArray,
      stateLivePreviewMarkdown?.markdownId,
      stateLivePreviewMarkdown?.paneFragmentId,
      statePaneFragments,
      stateWithheldBeliefs,
      unsavedMarkdownImageSvgs,
      unsavedMarkdownImages,
    ],
  )

  const handleChangeImpression = (e: any) => {
    // FIX
    const { name, value } = e.target
    setStateImpressions((prev: any) => {
      return { ...prev, [name]: value }
    })
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload: any = {}
    if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
    if (Object.keys(stateHeldBeliefs).length)
      newOptionsPayload.heldBeliefs = stateHeldBeliefs
    if (Object.keys(stateWithheldBeliefs).length)
      newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
    newOptionsPayload.paneFragmentsPayload = Object.values(statePaneFragments)
    if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
    if (state.hasCodeHook) {
      newOptionsPayload.codeHook = {}
      if (state.codeHookTarget)
        newOptionsPayload.codeHook.target = state.codeHookTarget
      if (state.codeHookTargetUrl)
        newOptionsPayload.codeHook.url = state.codeHookTargetUrl
      if (state.codeHookHeight)
        newOptionsPayload.codeHook.height = state.codeHookHeight
      if (state.codeHookWidth)
        newOptionsPayload.codeHook.width = state.codeHookWidth
    }
    if (state.overflowHidden)
      newOptionsPayload.overflowHidden = state.overflowHidden
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
  }

  const toggleBelief = (mode: string) => {
    if (
      (mode === `held` && !Object.keys(stateHeldBeliefs).length) ||
      (mode === `withheld` && !Object.keys(stateWithheldBeliefs).length)
    )
      addBelief(mode)
    setToggleCheck(true)
  }

  const addBelief = (mode: string) => {
    if (mode === `held`) {
      setStateHeldBeliefs({ ...stateHeldBeliefs, selector: `VALUE` })
      setState({ ...state, hasHeldBeliefsPayload: true })
    }
    if (mode === `withheld`) {
      setStateWithheldBeliefs({ ...stateWithheldBeliefs, selector: `VALUE` })
      setState({ ...state, hasWithheldBeliefsPayload: true })
    }
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload: any = {}
    if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
    if (Object.keys(stateHeldBeliefs).length)
      newOptionsPayload.heldBeliefs = stateHeldBeliefs
    if (Object.keys(stateWithheldBeliefs).length)
      newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
    newOptionsPayload.paneFragmentsPayload = Object.values(statePaneFragments)
    if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
    if (state.hasCodeHook) {
      newOptionsPayload.codeHook = {}
      if (state.codeHookTarget)
        newOptionsPayload.codeHook.target = state.codeHookTarget
      if (state.codeHookTargetUrl)
        newOptionsPayload.codeHook.url = state.codeHookTargetUrl
      if (state.codeHookHeight)
        newOptionsPayload.codeHook.height = state.codeHookHeight
      if (state.codeHookWidth)
        newOptionsPayload.codeHook.width = state.codeHookWidth
    }
    if (state.overflowHidden)
      newOptionsPayload.overflowHidden = state.overflowHidden
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
  }

  const handleChangeBelief = (e: any) => {
    // FIX
    const value = e?.event?.target?.value
    const oldName = e?.selector
    const oldValue = e?.value
    const mode = e?.mode
    const action = e?.action
    const selector = e?.selector
    if (selector && action === `remove`) {
      if (mode === `held`) {
        const processedBeliefs: any = {}
        Object.keys(stateHeldBeliefs).forEach((f) => {
          if (f !== selector) processedBeliefs[f] = stateHeldBeliefs[f]
        })
        setStateHeldBeliefs(processedBeliefs)
        if (!Object.keys(processedBeliefs).length)
          setState({ ...state, hasHeldBeliefsPayload: false })
      }
      if (mode === `withheld`) {
        const processedBeliefs: any = {}
        Object.keys(stateWithheldBeliefs).forEach((f) => {
          if (f !== selector) processedBeliefs[f] = stateWithheldBeliefs[f]
        })
        setStateWithheldBeliefs(processedBeliefs)
        if (!Object.keys(processedBeliefs).length)
          setState({ ...state, hasWithheldBeliefsPayload: false })
      }
    } else {
      if (!value && mode === `held`) {
        const processedBeliefs: any = {}
        Object.keys(stateHeldBeliefs).forEach((f) => {
          if (!(f === oldName && stateHeldBeliefs[f] === oldValue))
            processedBeliefs[f] = stateHeldBeliefs[f]
        })
        setStateHeldBeliefs(processedBeliefs)
        if (!Object.keys(processedBeliefs).length)
          setState({ ...state, hasHeldBeliefsPayload: false })
      } else if (!value && mode === `withheld`) {
        const processedBeliefs: any = {}
        Object.keys(stateWithheldBeliefs).forEach((f) => {
          if (!(f === oldName && stateWithheldBeliefs[f] === oldValue))
            processedBeliefs[f] = stateWithheldBeliefs[f]
        })
        setStateWithheldBeliefs(processedBeliefs)
        if (!Object.keys(processedBeliefs).length)
          setState({ ...state, hasWithheldBeliefsPayload: false })
      }
      // selector unchanged, update viewportKey value
      else if (action === `value` && mode === `held`) {
        setStateHeldBeliefs((prev: any) => {
          return { ...prev, [oldName]: value }
        })
      } else if (action === `value` && mode === `withheld`) {
        setStateWithheldBeliefs((prev: any) => {
          return { ...prev, [oldName]: value }
        })
      }
      // selector changed, remove old; add new
      else if (action === `selector` && mode === `held`) {
        const processedBeliefs: any = {}
        Object.keys(stateHeldBeliefs).forEach((f) => {
          if (!(f === oldName && stateHeldBeliefs[f] === oldValue))
            processedBeliefs[f] = stateHeldBeliefs[f]
        })
        processedBeliefs[value] = oldValue
        setStateHeldBeliefs(processedBeliefs)
      } else if (action === `selector` && mode === `withheld`) {
        const processedBeliefs: any = {}
        Object.keys(stateWithheldBeliefs).forEach((f) => {
          if (!(f === oldName && stateWithheldBeliefs[f] === oldValue))
            processedBeliefs[f] = stateWithheldBeliefs[f]
        })
        processedBeliefs[value] = oldValue
        setStateWithheldBeliefs(processedBeliefs)
      }
    }
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload: any = {}
    if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
    if (Object.keys(stateHeldBeliefs).length)
      newOptionsPayload.heldBeliefs = stateHeldBeliefs
    if (Object.keys(stateWithheldBeliefs).length)
      newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
    newOptionsPayload.paneFragmentsPayload = Object.values(statePaneFragments)
    if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
    if (state.hasCodeHook) {
      newOptionsPayload.codeHook = {}
      if (state.codeHookTarget)
        newOptionsPayload.codeHook.target = state.codeHookTarget
      if (state.codeHookTargetUrl)
        newOptionsPayload.codeHook.url = state.codeHookTargetUrl
      if (state.codeHookHeight)
        newOptionsPayload.codeHook.height = state.codeHookHeight
      if (state.codeHookWidth)
        newOptionsPayload.codeHook.width = state.codeHookWidth
    }
    if (state.overflowHidden)
      newOptionsPayload.overflowHidden = state.overflowHidden
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
  }

  /*
  const handleChangePaneFragment = (e: any) => {
    const value = e.target.value
    const target = e.target.id
    const result = target.split(`--`)
    if (result && result[0] && result[1]) {
      const newStatePaneFragments = {
        ...statePaneFragments,
        [result[1]]: { ...statePaneFragments[result[1]], [result[0]]: value },
      }
      setStatePaneFragments(newStatePaneFragments)
      const impressionsPayload = stateImpressions?.title
        ? {
            [stateImpressions.id]: stateImpressions,
          }
        : null
      const newOptionsPayload = {
        heldBeliefs: stateHeldBeliefs,
        withheldBeliefs: stateWithheldBeliefs,
        impressions: impressionsPayload,
        paneFragmentsPayload: Object.values(newStatePaneFragments),
        hiddenPane: state.hiddenPane,
      }
      setState((prev: any) => {
        return {
          ...prev,
          optionsPayloadString: JSON.stringify(newOptionsPayload),
        }
      })
      // setToggleCheck(true)
    }
  }
  */

  const handleUnsavedImage = useCallback(
    (
      fileId: string,
      nth: number,
      childNth: number,
      childGlobalNth: number,
      isSvg?: boolean,
      filename?: string,
      alreadyUnsaved: boolean = false,
    ) => {
      if (!isSvg && !alreadyUnsaved)
        setUnsavedMarkdownImages((prev: any) => {
          return { ...prev, [fileId]: allFiles[fileId] }
        })
      else if (!alreadyUnsaved)
        setUnsavedMarkdownImageSvgs((prev: any) => {
          return { ...prev, [fileId]: allFiles[fileId] }
        })
      const oldArray = stateLivePreviewMarkdown.markdownArray
      const newArray = [...oldArray]
      const pre =
        stateLivePreviewMarkdown.markdownTags[nth] === `ol` ? `1.` : `*`
      const oldValue = `${pre} ![Descriptive title for this image](${
        filename || allFiles[fileId].filename
      })`
      const override = oldArray[nth].split(/\n/).filter((n: any) => n)
      override[childNth] = oldValue
      newArray[nth] = `${override.join(`\n`)}\n`
      setImageUpdatedMarkdown(newArray)
    },
    [
      allFiles,
      stateLivePreviewMarkdown?.markdownArray,
      stateLivePreviewMarkdown?.markdownTags,
    ],
  )

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name, value } = e.target as HTMLInputElement
    if (value !== thisPane.slug && allPanesSlugs.includes(value))
      setSlugCollision(true)
    else setSlugCollision(false)
    const validateSlug = (v: string) => {
      const re1 = /^[a-z]/
      const re2 = /^[a-z][a-zA-Z0-9-]+$/
      if (v.length === 0) return ``
      const match = v.length === 1 ? re1.test(v) : re2.test(v)
      if (match) return v
      return state.slug
    }
    const thisValue =
      name !== `slug` ? value : validateSlug(value.toLowerCase())
    if (thisValue !== null) {
      const impressionsPayload = stateImpressions?.title
        ? {
            [stateImpressions.id]: stateImpressions,
          }
        : null
      const newOptionsPayload: any = {}
      if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
      if (Object.keys(stateHeldBeliefs).length)
        newOptionsPayload.heldBeliefs = stateHeldBeliefs
      if (Object.keys(stateWithheldBeliefs).length)
        newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
      newOptionsPayload.paneFragmentsPayload = Object.values(statePaneFragments)
      if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
      if (state.hasCodeHook) {
        newOptionsPayload.codeHook = {}
        if (state.codeHookTarget)
          newOptionsPayload.codeHook.target = state.codeHookTarget
        if (state.codeHookTargetUrl)
          newOptionsPayload.codeHook.url = state.codeHookTargetUrl
        if (state.codeHookHeight)
          newOptionsPayload.codeHook.height = state.codeHookHeight
        if (state.codeHookWidth)
          newOptionsPayload.codeHook.width = state.codeHookWidth
        if (name === `codeHookTarget`)
          newOptionsPayload.codeHook.target = thisValue
        if (name === `codeHookTargetUrl`)
          newOptionsPayload.codeHook.url = thisValue
        if (name === `codeHookWidth`)
          newOptionsPayload.codeHook.width = thisValue
        if (name === `codeHookHeight`)
          newOptionsPayload.codeHook.height = thisValue
      }
      if (state.overflowHidden)
        newOptionsPayload.overflowHidden = state.overflowHidden
      setState((prev: any) => {
        return {
          ...prev,
          optionsPayloadString: JSON.stringify(newOptionsPayload),
          [name]: thisValue,
        }
      })
      setToggleCheck(true)
    }
  }

  function insertPaneFragmentsRegenerateState(
    payload: any,
    markdown?: any,
    paneExtra?: any,
  ) {
    const markdownPaneFragmentId = stateLivePreviewMarkdown?.paneFragmentId
    const markdownId = stateLivePreviewMarkdown?.markdownId
    const markdownBody = stateLivePreviewMarkdown?.markdownArray?.join(`\n`)
    // only needed if markdownBody exists in form state, inject; otherwise pull from drupal store
    const thisMarkdown =
      markdownId && markdownBody
        ? {
            [markdownId]: {
              ...allMarkdown[markdownId],
              markdownBody,
            },
          }
        : markdown || {}
    const paneFragmentsPayload = markdownBody
      ? {
          ...statePaneFragments,
          ...payload,
          [markdownPaneFragmentId]: {
            ...statePaneFragments[markdownPaneFragmentId],
            markdownBody,
          },
        }
      : {
          ...statePaneFragments,
          ...payload,
        }
    let hasBgColourId = ``
    let hasBgColour = ``
    let hasBreaks = false
    Object.keys(paneFragmentsPayload).forEach((e: any) => {
      if (
        paneFragmentsPayload[e].internal.type === `bgColour` &&
        typeof paneFragmentsPayload[e].bgColour === `string`
      ) {
        hasBgColourId = paneFragmentsPayload[e].id
        hasBgColour = paneFragmentsPayload[e].bgColour
      }
      if (
        paneFragmentsPayload[e].internal?.type === `bgPane` &&
        (paneFragmentsPayload[e].optionsPayload?.artpack?.desktop?.mode ===
          `break` ||
          paneFragmentsPayload[e].optionsPayload?.artpack?.tablet?.mode ===
            `break` ||
          paneFragmentsPayload[e].optionsPayload?.artpack?.mobile?.mode ===
            `break`)
      )
        hasBreaks = true
    })
    const {
      initialStateLivePreviewMarkdown,
      initialStateLivePreview,
      initialStatePaneFragments,
    } = generateLivePreviewInitialState({
      payload: Object.values(paneFragmentsPayload),
      allMarkdown: thisMarkdown,
      allFiles,
      unsavedMarkdownImages,
      unsavedMarkdownImageSvgs,
    })
    setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
    setStateLivePreview(initialStateLivePreview)
    setStatePaneFragments(initialStatePaneFragments)
    const newOptionsPayload: any = {
      paneFragmentsPayload: Object.values(initialStatePaneFragments),
    }
    setState((prev: any) => {
      return {
        ...prev,
        hasBgColour,
        hasBgColourId,
        hasBreaks,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        ...(paneExtra || {}),
      }
    })
    setToggleCheck(true)
  }

  function deletePaneFragmentRegenerateState(paneFragmentId: string) {
    const markdownPaneFragmentId = stateLivePreviewMarkdown?.paneFragmentId
    const isMarkdown = paneFragmentId === markdownPaneFragmentId
    const markdownId = stateLivePreviewMarkdown?.markdownId
    const markdownBody = stateLivePreviewMarkdown?.markdownArray?.join(`\n`)
    const thisMarkdown = markdownId
      ? {
          [markdownId]: {
            ...allMarkdown[markdownId],
            markdownBody,
          },
        }
      : {}
    const paneFragmentsPayload = isMarkdown
      ? {
          ...statePaneFragments,
          [markdownPaneFragmentId]: {
            ...statePaneFragments[markdownPaneFragmentId],
            markdownBody,
            textShapeOutsideMobile: `none`,
            textShapeOutsideTablet: `none`,
            textShapeOutsideDesktop: `none`,
          },
        }
      : typeof markdownBody !== `undefined`
        ? {
            ...statePaneFragments,
            [markdownPaneFragmentId]: {
              ...statePaneFragments[markdownPaneFragmentId],
              markdownBody,
            },
          }
        : {
            ...statePaneFragments,
          }
    const isBgColour =
      paneFragmentsPayload[paneFragmentId].internal?.type === `bgColour`
    if (!isMarkdown) delete paneFragmentsPayload[paneFragmentId]
    else {
      delete paneFragmentsPayload[paneFragmentId].optionsPayload.classNamesModal
      delete paneFragmentsPayload[paneFragmentId].optionsPayload
        .classNamesPayload.modal
      delete paneFragmentsPayload[paneFragmentId].optionsPayload.modal
      paneFragmentsPayload[paneFragmentId].optionsPayloadString =
        JSON.stringify(paneFragmentsPayload[paneFragmentId].optionsPayload)
    }
    const {
      initialStateLivePreviewMarkdown,
      initialStateLivePreview,
      initialStatePaneFragments,
    } = generateLivePreviewInitialState({
      payload: Object.values(paneFragmentsPayload),
      allMarkdown: thisMarkdown,
      allFiles,
      unsavedMarkdownImages,
      unsavedMarkdownImageSvgs,
    })
    setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
    setStateLivePreview(initialStateLivePreview)
    setStatePaneFragments(initialStatePaneFragments)
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload: any = {}
    if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
    if (Object.keys(stateHeldBeliefs).length)
      newOptionsPayload.heldBeliefs = stateHeldBeliefs
    if (Object.keys(stateWithheldBeliefs).length)
      newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
    newOptionsPayload.paneFragmentsPayload = Object.values(statePaneFragments)
    if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
    if (state.hasCodeHook) {
      newOptionsPayload.codeHook = {}
      if (state.codeHookTarget)
        newOptionsPayload.codeHook.target = state.codeHookTarget
      if (state.codeHookTargetUrl)
        newOptionsPayload.codeHook.url = state.codeHookTargetUrl
      if (state.codeHookHeight)
        newOptionsPayload.codeHook.height = state.codeHookHeight
      if (state.codeHookWidth)
        newOptionsPayload.codeHook.width = state.codeHookWidth
    }
    if (state.overflowHidden)
      newOptionsPayload.overflowHidden = state.overflowHidden
    setState((prev: any) => {
      if (isBgColour)
        return {
          ...prev,
          hasBgColour: null,
          hasBgColourId: null,
          optionsPayloadString: JSON.stringify(newOptionsPayload),
        }
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
  }

  const handleChangeEditInPlace = (e: any) => {
    let { name, value } = e.target
    if (name === `add---special`) {
      name = value
      value = null
    }
    const paneFragmentId = stateLivePreviewMarkdown.paneFragmentId
    const regexpShapes =
      /^(paneShape|paneShapeClasses|paneShapeArtpackPayload|paneShapeBreaksPayload|modalShape|textShapeOutside)---(.*)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpLink =
      /^(\d+)(?:(?:-(\d+))?)--(li|p)---link-(\d+)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpLinkHover =
      /^hover---(\d+)(?:(?:-(\d+))?)--(li|p)---link-(\d+)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexp =
      /^(\d+)(?:(?:-(\d+))?)--(ol|ul|li|p|h1|h2|h3|h4|h5|h6|code|img|parent)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpOverride =
      /^override---(\d+)(?:(?:-(\d+))?)--(li|p|h1|h2|h3|h4|h5|h6|code|img|parent)--([^-]+)(?:-)?(mobile|tablet|desktop)?/
    const regexpModal = /^(modal)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpBgColour = /^(bgColour)--(.*)/
    const regexpImage = /^(image)-(\d+)--(.*)/
    const regexpAdd =
      /^(add)---(\d+)(?:(?:-(\d+))?)--(ul|ol|li|p|h1|h2|h3|h4|h5|h6|code|img|parent)$/
    const regexpAddPane =
      /^(paneShape|paneShapeClasses|paneShapeArtpackPayload|paneShapeBreaksPayload|modalShape|textShapeOutside|modal)---(.*)-(add)/
    const regexpAddLink = /^(add)---(\d+)(?:(?:-(\d+))?)--(li|p)---link-(\d+)$/
    const regexpAddLinkHover =
      /^(add)---(hover)---(\d+)(?:(?:-(\d+))?)--(li|p)---link-(\d+)$/
    const regexpAddBgPane = /^(bgPane|bgPaneShapeOutside|bgPaneArtPack)--(.*)/
    const regexpStarter = /^(starter)--(0)/
    const result =
      name.match(regexpModal) ||
      name.match(regexpOverride) ||
      name.match(regexpLinkHover) ||
      name.match(regexpLink) ||
      name.match(regexpBgColour) ||
      name.match(regexpImage) ||
      name.match(regexpShapes) ||
      name.match(regexpAdd) ||
      name.match(regexpAddPane) ||
      name.match(regexpAddLink) ||
      name.match(regexpAddLinkHover) ||
      name.match(regexpAddBgPane) ||
      name.match(regexpStarter) ||
      name.match(regexp)
    const specialMode = name.match(regexpOverride)
      ? `override`
      : name.match(regexpLinkHover)
        ? `linkhover`
        : name.match(regexpLink)
          ? `link`
          : null
    const nth = result && result[1] !== `modal` ? result[1] : null
    const tag =
      result && result[1] === `modal`
        ? `modal`
        : result && typeof result[3] === `string`
          ? result[3]
          : `unknown`
    const specialModeIdx =
      (result && specialMode === `link`) || specialMode === `linkhover`
        ? result[4]
        : 0
    const selector =
      result && [`shape`, `modalShape`, `textShapeOutside`].includes(result[1])
        ? result[3]
        : result && result[1] === `modal`
          ? result[2]
          : (result && specialMode === `link`) || specialMode === `linkhover`
            ? result[5]
            : result
              ? result[4]
              : null
    const childNth = result && result[2] !== `modal` ? result[2] : null
    const viewport =
      result && result[1] === `modal`
        ? result[3]
        : (result && specialMode === `link`) ||
            (specialMode === `linkhover` && typeof result[6] === `string`)
          ? result[6]
          : (result && specialMode === `link`) || specialMode === `linkhover`
            ? null
            : result
              ? result[5]
              : null
    const viewportOffset =
      viewport === `mobile` ? 0 : viewport === `tablet` ? 1 : 2
    const tagsCount = stateLivePreviewMarkdown?.markdownTags?.slice(0, nth) || 0
    const childGlobalNth =
      tag === null
        ? null
        : [`ul`, `ol`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(tag)
          ? tagsCount.filter((e: string) => e === tag).length
          : tag === `img`
            ? stateLivePreviewMarkdown.imagesLookup[nth][childNth]
            : tag === `li`
              ? stateLivePreviewMarkdown.listItemsLookup[nth][childNth]
              : null
    const thisNth =
      tag === null
        ? null
        : [`ul`, `ol`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(tag)
          ? nth
          : childGlobalNth
    const mode =
      result && result[1] === `starter`
        ? `starter`
        : result &&
            [`bgPane`, `bgPaneShapeOutside`, `bgPaneArtPack`].includes(
              result[1],
            )
          ? `addPaneShape`
          : result &&
              result[1] === `add` &&
              result[2] === `hover` &&
              typeof +result[6] === `number`
            ? `addStyleLinkHover`
            : result &&
                result[1] === `add` &&
                typeof result[5] !== `undefined` &&
                typeof +result[5] === `number`
              ? `addStyleLink`
              : result && result[1] === `add` && result[4] === `parent`
                ? `addParentStyle`
                : result && result[1] === `add`
                  ? `addStyle`
                  : result &&
                      [
                        `paneShapeClasses`,
                        `paneShapeArtpackPayload`,
                        `paneShapeBreaksPayload`,
                        `paneShape`,
                        `modalShape`,
                        `textShapeOutside`,
                      ].includes(result[1]) &&
                      result[3] === `add`
                    ? `addShapeStyle`
                    : result &&
                        [
                          `paneShapeClasses`,
                          `paneShapeArtpackPayload`,
                          `paneShapeBreaksPayload`,
                          `paneShape`,
                          `modalShape`,
                          `textShapeOutside`,
                        ].includes(result[1]) &&
                        typeof result[3] === `string`
                      ? `updateShapePayload`
                      : result &&
                          result[1] === `image` &&
                          typeof result[2] === `string` &&
                          typeof result[3] === `string` &&
                          result[3] === `alt`
                        ? `updateImagePayload`
                        : result && result[1] === `bgColour`
                          ? `updateBgColour`
                          : tag === `code` && nth > -1 && selector
                            ? `updateCodePayload`
                            : specialMode === `link` &&
                                tag &&
                                nth > -1 &&
                                selector &&
                                viewport &&
                                (value || viewport === `remove`)
                              ? `updateLinkSelector`
                              : specialMode === `linkhover` &&
                                  tag &&
                                  nth > -1 &&
                                  selector &&
                                  viewport &&
                                  (value || viewport === `remove`)
                                ? `updateLinkHoverSelector`
                                : specialMode === `link` &&
                                    tag &&
                                    nth > -1 &&
                                    selector &&
                                    value
                                  ? `updateLinkPayload`
                                  : tag === `parent` &&
                                      nth > -1 &&
                                      selector &&
                                      (value || viewport === `remove`)
                                    ? `updateSelectorParent`
                                    : tag === `modal` &&
                                        selector &&
                                        (value || viewport === `remove`)
                                      ? `updateSelectorModal`
                                      : [
                                            `img`,
                                            `ul`,
                                            `li`,
                                            `p`,
                                            `h1`,
                                            `h2`,
                                            `h3`,
                                            `h4`,
                                            `h5`,
                                            `h6`,
                                          ].includes(tag) &&
                                          nth > -1 &&
                                          selector &&
                                          specialMode === `override` &&
                                          value
                                        ? `updateSelectorOverride`
                                        : childGlobalNth > -1 &&
                                            selector &&
                                            viewport &&
                                            (value || viewport === `remove`)
                                          ? `updateSelector`
                                          : null

    // console.log(result, mode, name, value)
    switch (mode) {
      case `starter`: {
        if ([`titleText`, `text`, `borderedText`].includes(value)) {
          const starterPayload = starterTemplate(value, state.title, state.slug)
          if (starterPayload) {
            const paneExtra = {
              markdown: [starterPayload.newMarkdownId],
            }
            updateMarkdown(starterPayload.newMarkdownPayload)
            insertPaneFragmentsRegenerateState(
              starterPayload.paneFragmentsPayload,
              starterPayload.newMarkdown,
              paneExtra,
            )
          }
        } else if (value === `fancy`) {
          const starterPayload = starterTemplate(value, state.title, state.slug)
          if (starterPayload) {
            const paneExtra = {
              heightRatioDesktop: `58.39`,
              heightRatioTablet: `92.22`,
              heightRatioMobile: `120.83`,
              markdown: [starterPayload.newMarkdownId],
            }
            updateMarkdown(starterPayload.newMarkdownPayload)
            insertPaneFragmentsRegenerateState(
              starterPayload.paneFragmentsPayload,
              starterPayload.newMarkdown,
              paneExtra,
            )
          }
        } else if (value === `modal`) {
          const starterPayload = starterTemplate(value, state.title, state.slug)
          if (starterPayload) {
            const paneExtra = {
              heightRatioDesktop: `15.89`,
              heightRatioTablet: `26.00`,
              heightRatioMobile: `32.67`,
              markdown: [starterPayload.newMarkdownId],
            }
            updateMarkdown(starterPayload.newMarkdownPayload)
            insertPaneFragmentsRegenerateState(
              starterPayload.paneFragmentsPayload,
              starterPayload.newMarkdown,
              paneExtra,
            )
          }
        } else if (value === `breaks`) {
          const starterPayload = starterTemplate(value, state.title, state.slug)
          if (starterPayload) {
            insertPaneFragmentsRegenerateState(
              starterPayload.paneFragmentsPayload,
            )
          }
        }
        break
      }

      case `addParentStyle`: {
        const thisNth = result[2]
        if (!value) {
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            parent: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload?.parent,
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload.parent?.classes,
                [thisNth]: {},
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesParent: reduced.classNamesParent,
          }
          regenerateState(newOptionsPayload)
        } else {
          const current = {
            ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
              .optionsPayload?.classNamesPayload.parent.classes[thisNth],
          }
          current[value] = [``]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            parent: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload.parent,
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload.parent.classes,
                [thisNth]: current,
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesParent: reduced.classNamesParent,
          }
          regenerateState(newOptionsPayload)
        }
        break
      }

      case `addStyle`: {
        // applies to all of same element, no override by default
        const thisTag = result[4]
        const current =
          typeof statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload?.classNamesPayload[thisTag] !== `undefined` &&
          typeof statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload?.classNamesPayload[thisTag].classes !== `undefined`
            ? {
                ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
                  .optionsPayload?.classNamesPayload[thisTag].classes,
              }
            : {}
        current[value] = [``]
        const newClassNamesPayload = {
          ...statePaneFragments[paneFragmentId].optionsPayload
            .classNamesPayload,
          [thisTag]: {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[thisTag],
            classes: current,
          },
        }
        const reduced = reduceTailwindClasses(newClassNamesPayload)
        const newOptionsPayload = {
          ...statePaneFragments[paneFragmentId].optionsPayload,
          classNamesPayload: newClassNamesPayload,
          classNames: reduced.classNames,
        }
        regenerateState(newOptionsPayload)
        break
      }

      case `addShapeStyle`: {
        const thisType = result[1]
        const paneFragmentId =
          result[2] !== `0`
            ? result[2]
            : stateLivePreviewMarkdown.paneFragmentId
        if (thisType === `modalShape`) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              ?.classNamesPayload?.modal?.classes[0],
          }
          current[value] = [``]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            modal: {
              classes: {
                0: current,
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesModal: reduced.classNamesModal,
          }
          regenerateState(newOptionsPayload)
        } else if (thisType === `paneShapeClasses`) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              ?.classNamesPayload?.parent?.classes[0],
          }
          current[value] = [``]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            parent: {
              classes: {
                0: current,
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesParent: reduced.classNamesParent,
          }
          regenerateState(newOptionsPayload, paneFragmentId)
        }
        break
      }

      case `addStyleLink`: {
        const thisNth = result[2]
        const thisChildNth = result[5]
        const thisLink =
          stateLivePreviewMarkdown.links[
            stateLivePreviewMarkdown.linksLookup[thisNth][thisChildNth]
          ]
        const current = { ...thisLink?.classNamesPayload?.button?.classes }
        current[value] = [``]
        const newButtonClassNamesPayload = {
          ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload.buttons[thisLink.target].classNamesPayload,
          button: {
            classes: current,
          },
        }
        const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
        const newOptionsPayload = {
          ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload,
          buttons: {
            ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
              .optionsPayload.buttons,
            [thisLink.target]: {
              ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
                .optionsPayload.buttons[thisLink.target],
              className: reduced.button || ``,
              classNamesPayload: newButtonClassNamesPayload,
            },
          },
        }
        regenerateState(newOptionsPayload)
        break
      }

      case `addStyleLinkHover`: {
        const thisNth = result[3]
        const thisChildNth = result[6]
        const thisLink =
          stateLivePreviewMarkdown.links[
            stateLivePreviewMarkdown.linksLookup[thisNth][thisChildNth]
          ]
        const current = { ...thisLink?.classNamesPayload?.hover?.classes }
        current[value] = [``]
        const newButtonClassNamesPayload = {
          ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload.buttons[thisLink.target].classNamesPayload,
          hover: {
            classes: current,
          },
        }
        const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
        const newOptionsPayload = {
          ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
            .optionsPayload,
          buttons: {
            ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
              .optionsPayload.buttons,
            [thisLink.target]: {
              ...statePaneFragments[stateLivePreviewMarkdown.paneFragmentId]
                .optionsPayload.buttons[thisLink.target],
              className: reduced.button || ``,
              classNamesPayload: newButtonClassNamesPayload,
            },
          },
        }
        regenerateState(newOptionsPayload)
        break
      }

      case `updateSelector`: {
        const thisTag =
          typeof stateLivePreviewMarkdown.codeItemsLookup[nth] === `undefined`
            ? tag
            : `code`
        const thisLookup = [`li`, `img`].includes(tag)
          ? childGlobalNth
          : thisTag === `code`
            ? stateLivePreviewMarkdown.codeItemsLookup[nth][0]
            : thisNth
        const hasOverride =
          stateLivePreview.childClasses[thisTag][thisLookup][selector][3]
        const hasOverridePayload =
          typeof statePaneFragments[paneFragmentId].optionsPayload
            .classNamesPayload[thisTag].override !== `undefined`
        const hasOverrideSelectorPayload =
          hasOverridePayload &&
          typeof statePaneFragments[paneFragmentId].optionsPayload
            .classNamesPayload[thisTag].override[selector] !== `undefined`
        if (
          viewport === `remove` &&
          hasOverride &&
          !hasOverrideSelectorPayload
        ) {
          // override was toggled on but never set; simply regenerate state
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNames: reduced.classNames,
          }
          regenerateState(newOptionsPayload)
        } else if (
          viewport === `remove` &&
          hasOverride &&
          hasOverrideSelectorPayload
        ) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[thisTag],
          }
          delete current.override[selector][childGlobalNth]
          if (Object.keys(current.override[selector]).length === 0) {
            delete current.override
            delete current.count
          }
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            [thisTag]: current,
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNames: reduced.classNames,
          }
          regenerateState(newOptionsPayload)
        } else if (viewport === `remove`) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[thisTag].classes,
          }
          delete current[selector]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            [thisTag]: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[thisTag],
              classes: current,
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNames: reduced.classNames,
          }
          regenerateState(newOptionsPayload)
        } else {
          // add selector to payload
          const newValue = value === `=` ? null : value
          const tuple = !hasOverride
            ? [
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[thisTag].classes[selector],
              ]
            : hasOverrideSelectorPayload &&
                typeof statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[thisTag].override[selector][
                  childGlobalNth
                ] !== `undefined`
              ? [
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload[thisTag].override[selector][
                    childGlobalNth
                  ],
                ]
              : []
          tuple[viewportOffset] = newValue
          const thisTuple = tuple[2]
            ? tuple
            : tuple[1]
              ? [tuple[0], tuple[1]]
              : [tuple[0]]
          if (hasOverride) {
            const noPayload =
              typeof statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[thisTag] !== `undefined` &&
              statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[thisTag].override === `undefined`
            const alreadyExists = noPayload
              ? false
              : !noPayload &&
                typeof statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[thisTag].override !== `undefined` &&
                statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[thisTag].override[selector] !== `undefined`
            const overrideCount = [
              `ul`,
              `ol`,
              `p`,
              `h1`,
              `h2`,
              `h3`,
              `h4`,
              `h5`,
              `h6`,
            ].includes(thisTag)
              ? stateLivePreviewMarkdown.markdownTags.filter(
                  (n: string) => n === thisTag,
                ).length
              : thisTag === `li`
                ? Object.keys(stateLivePreviewMarkdown.listItems).length
                : thisTag === `img`
                  ? Object.keys(stateLivePreviewMarkdown.images).length
                  : thisTag === `code`
                    ? Object.keys(stateLivePreviewMarkdown.codeItems).length
                    : 1
            const newClassNamesPayload = alreadyExists
              ? {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload,
                  [thisTag]: {
                    ...statePaneFragments[paneFragmentId].optionsPayload
                      .classNamesPayload[thisTag],
                    override: {
                      ...statePaneFragments[paneFragmentId].optionsPayload
                        .classNamesPayload[thisTag].override,
                      [selector]: {
                        ...statePaneFragments[paneFragmentId].optionsPayload
                          .classNamesPayload[thisTag].override[selector],
                        [childGlobalNth]: thisTuple,
                      },
                    },
                  },
                }
              : {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload,
                  [thisTag]: {
                    ...statePaneFragments[paneFragmentId].optionsPayload
                      .classNamesPayload[thisTag],
                    count: overrideCount,
                    override: {
                      ...statePaneFragments[paneFragmentId].optionsPayload
                        .classNamesPayload[thisTag].override,
                      [selector]: {
                        [childGlobalNth]: thisTuple,
                      },
                    },
                  },
                }
            const reduced = reduceTailwindClasses(newClassNamesPayload)
            const newOptionsPayload = {
              ...statePaneFragments[paneFragmentId].optionsPayload,
              classNamesPayload: newClassNamesPayload,
              classNames: reduced.classNames,
            }
            regenerateState(newOptionsPayload)
          } else {
            const newClassNamesPayload = {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload,
              [thisTag]: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[thisTag],
                classes: {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload[thisTag].classes,
                  [selector]: thisTuple,
                },
              },
            }
            const reduced = reduceTailwindClasses(newClassNamesPayload)
            const newOptionsPayload = {
              ...statePaneFragments[paneFragmentId].optionsPayload,
              classNamesPayload: newClassNamesPayload,
              classNames: reduced.classNames,
            }
            regenerateState(newOptionsPayload)
          }
        }
        break
      }

      case `updateSelectorOverride`: {
        const thisLookup = [`li`, `img`].includes(tag)
          ? childGlobalNth
          : thisNth
        // toggle override
        const hasOverride =
          stateLivePreview.childClasses[tag][thisLookup][selector][3]
        if (!hasOverride) {
          const newStateLivePreview = {
            ...stateLivePreview,
            childClasses: {
              ...stateLivePreview.childClasses,
              [tag]: {
                ...stateLivePreview.childClasses[tag],
                [thisLookup]: {
                  ...stateLivePreview.childClasses[tag][thisLookup],
                  [selector]: [`=`, `=`, `=`, true],
                },
              },
            },
          }
          setStateLivePreview(newStateLivePreview)
        } else {
          // currently enabled; must remove override from classNamesPayload
          // must remove classNamesPayload[tag].override[selector][thisNth]
          // may need to remove classNamesPayload[tag].override[selector] entirely if this is last element
          const hasOverride =
            typeof stateLivePreview.childClasses[tag] !== `undefined` &&
            typeof stateLivePreview.childClasses[tag][thisNth] !==
              `undefined` &&
            typeof stateLivePreview.childClasses[tag][thisNth][selector] !==
              `undefined`
              ? stateLivePreview.childClasses[tag][thisNth][selector][3]
              : null
          const hasOverridePayload =
            hasOverride &&
            typeof statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[tag].override !== `undefined`
          const hasOverrideSelectorPayload =
            hasOverridePayload &&
            typeof statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[tag].override[selector] !== `undefined`
          const hasOverrideNthSelectorPayload =
            hasOverridePayload &&
            hasOverrideSelectorPayload &&
            typeof statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[tag].override[selector][childGlobalNth] !==
              `undefined`
          const newOverride = hasOverridePayload
            ? {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag].override,
              }
            : null
          if (hasOverrideNthSelectorPayload)
            delete newOverride[selector][childGlobalNth]
          if (
            hasOverrideSelectorPayload &&
            Object.keys(
              statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[tag].override[selector],
            ).length === 0
          )
            delete newOverride[selector]
          const newPayload = newOverride
            ? {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag],
                override: newOverride,
              }
            : null
          if (newOverride && Object.keys(newOverride).length === 0) {
            delete newPayload.override
            delete newPayload.count
          }
          const newClassNamesPayload = newOverride
            ? {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload,
                [tag]: {
                  ...newPayload,
                },
              }
            : null
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = newPayload
            ? {
                ...statePaneFragments[paneFragmentId].optionsPayload,
                classNamesPayload: newClassNamesPayload,
                classNames: reduced.classNames,
              }
            : null
          if (newOptionsPayload) regenerateState(newOptionsPayload)
        }
        break
      }

      case `updateSelectorParent`: {
        if (viewport === `remove`) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload.parent.classes[nth],
          }
          delete current[selector]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            parent: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload.parent,
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload.parent.classes,
                [nth]: current,
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesParent: reduced.classNamesParent,
          }
          regenerateState(newOptionsPayload)
        } else {
          const newValue = value === `=` ? null : value
          const tuple = [
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[tag].classes[nth][selector],
          ]
          tuple[viewportOffset] = newValue
          const thisTuple = tuple[2]
            ? tuple
            : tuple[1]
              ? [tuple[0], tuple[1]]
              : [tuple[0]]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            parent: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload.parent,
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload.parent.classes,
                [nth]: {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload.parent.classes[nth],
                  [selector]: thisTuple,
                },
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesParent: reduced.classNamesParent,
          }
          regenerateState(newOptionsPayload)
        }
        break
      }

      case `updateSelectorModal`: {
        if (viewport === `remove`) {
          const current = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload.modal.classes[0],
          }
          delete current[selector]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            modal: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload.modal,
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload.modal.classes,
                0: current,
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNamesModal: reduced.classNamesModal,
          }
          regenerateState(newOptionsPayload)
        } else {
          const newValue = value === `=` ? null : value
          const tuple = [
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload[tag].classes[0][selector],
          ]
          tuple[viewportOffset] = newValue
          const thisTuple = tuple[2]
            ? tuple
            : tuple[1]
              ? [tuple[0], tuple[1]]
              : [tuple[0]]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            modal: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload.modal,
              classes: {
                0: {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload.modal.classes[0],
                  [selector]: thisTuple,
                },
              },
            },
          }
          const reduced = reduceTailwindClasses(newClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            classNamesPayload: newClassNamesPayload,
            classNames: reduced.classNames,
            classNamesModal: reduced?.classNamesModal || ``,
          }
          regenerateState(newOptionsPayload)
        }
        break
      }

      case `updateLinkSelector`: {
        const thisNth = result[1]
        // links payload is derived from statePaneFragments[paneFragmentId].optionsPayload.buttons[thisLink.target]
        const buttons =
          statePaneFragments[paneFragmentId].optionsPayload?.buttons
        const thisLink =
          stateLivePreviewMarkdown.links[
            stateLivePreviewMarkdown.linksLookup[thisNth][specialModeIdx]
          ]
        const buttonPayload =
          typeof buttons[thisLink.target].classNamesPayload.button.classes !==
          `undefined`
            ? { ...buttons[thisLink.target].classNamesPayload.button.classes }
            : {}

        if (viewport === `remove`) {
          delete buttonPayload[selector]
          const newButtonClassNamesPayload = {
            button: {
              classes: buttonPayload,
            },
            hover: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.hover.classes,
              },
            },
          }
          const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            buttons: {
              ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
              [thisLink.target]: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ],
                className: reduced.button || ``,
                classNamesPayload: newButtonClassNamesPayload,
              },
            },
          }
          regenerateState(newOptionsPayload)
        } else {
          const newValue = value === `=` ? null : value
          const tuple = [...buttonPayload[selector]]
          tuple[viewportOffset] = newValue
          const thisTuple = tuple[2]
            ? tuple
            : tuple[1]
              ? [tuple[0], tuple[1]]
              : [tuple[0]]
          const newButtonClassNamesPayload = {
            button: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.button.classes,
                [selector]: thisTuple,
              },
            },
            hover: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.hover.classes,
              },
            },
          }
          const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            buttons: {
              ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
              [thisLink.target]: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ],
                className: reduced.button || ``,
                classNamesPayload: newButtonClassNamesPayload,
              },
            },
          }
          regenerateState(newOptionsPayload)
        }
        break
      }

      case `updateLinkHoverSelector`: {
        // links payload is derived from statePaneFragments[paneFragmentId].optionsPayload.buttons[thisLink.target]
        const thisNth = result[1]
        const buttons =
          statePaneFragments[paneFragmentId].optionsPayload?.buttons
        const thisLink =
          stateLivePreviewMarkdown.links[
            stateLivePreviewMarkdown.linksLookup[thisNth][specialModeIdx]
          ]
        const buttonPayload =
          typeof buttons[thisLink.target].classNamesPayload.hover.classes !==
          `undefined`
            ? { ...buttons[thisLink.target].classNamesPayload.hover.classes }
            : {}
        if (viewport === `remove`) {
          delete buttonPayload[selector]
          const newButtonClassNamesPayload = {
            button: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.button.classes,
              },
            },
            hover: {
              classes: buttonPayload,
            },
          }
          const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            buttons: {
              ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
              [thisLink.target]: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ],
                className: reduced.button || ``,
                classNamesPayload: newButtonClassNamesPayload,
              },
            },
          }
          regenerateState(newOptionsPayload)
        } else {
          const newValue = value === `=` ? null : value
          const tuple = [...buttonPayload[selector]]
          tuple[viewportOffset] = newValue
          const thisTuple = tuple[2]
            ? tuple
            : tuple[1]
              ? [tuple[0], tuple[1]]
              : [tuple[0]]
          const newButtonClassNamesPayload = {
            button: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.button.classes,
              },
            },
            hover: {
              classes: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ].classNamesPayload.hover.classes,
                [selector]: thisTuple,
              },
            },
          }
          const reduced = reduceTailwindClasses(newButtonClassNamesPayload)
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            buttons: {
              ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
              [thisLink.target]: {
                ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
                  thisLink.target
                ],
                className: reduced.button || ``,
                classNamesPayload: newButtonClassNamesPayload,
              },
            },
          }
          regenerateState(newOptionsPayload)
        }
        break
      }

      case `addPaneShape`: {
        const thisMode = result[1]
        if (thisMode === `bgPane`) {
          const newPaneFragmentId = uuidv4()
          const newOptionsPayload = {
            classNames: {},
            classNamesParent: {},
            classNamesPayload: {
              parent: {
                classes: {
                  0: {
                    fill: [``],
                    strokeCOLOR: [``],
                    strokeSIZE: [``],
                  },
                },
              },
            },
          }
          const payload = {
            hiddenViewports: `none`,
            id: newPaneFragmentId,
            internal: {
              type: `bgPane`,
            },
            optionsPayload: newOptionsPayload,
            optionsPayloadString: JSON.stringify(newOptionsPayload),
            shapeMobile: `none`,
            shapeTablet: `none`,
            shapeDesktop: `none`,
          }
          insertPaneFragmentsRegenerateState({ [newPaneFragmentId]: payload })
        } else if (thisMode === `bgPaneArtPack`) {
          const newPaneFragmentId = uuidv4()
          const newOptionsPayload = {
            artpack: {
              all: {
                collection: `custom`,
                mode: `mask`,
                filetype: ``,
                image: ``,
                objectFit: `cover`,
              },
            },
          }
          const payload = {
            hiddenViewports: `none`,
            id: newPaneFragmentId,
            internal: {
              type: `bgPane`,
            },
            optionsPayload: newOptionsPayload,
            optionsPayloadString: JSON.stringify(newOptionsPayload),
            shapeMobile: `none`,
            shapeTablet: `none`,
            shapeDesktop: `none`,
          }
          insertPaneFragmentsRegenerateState({ [newPaneFragmentId]: payload })
        } else if (thisMode === `bgPaneShapeOutside`) {
          const thisPaneFragmentId = stateLivePreviewMarkdown.paneFragmentId
          const newOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
          }
          const extra = {
            textShapeOutsideMobile: `comic600r3inner`,
            textShapeOutsideTablet: `comic1080r3inner`,
            textShapeOutsideDesktop: `comic1920r3main1inner`,
          }
          const paneExtra = {
            heightRatioDesktop: `58.39`,
            heightRatioTablet: `92.22`,
            heightRatioMobile: `120.83`,
          }
          regenerateState(
            newOptionsPayload,
            thisPaneFragmentId,
            extra,
            paneExtra,
          )
        }
        break
      }

      case `updateBgColour`:
        if (!value && result[2] !== `0`) {
          deletePaneFragmentRegenerateState(result[2])
        } else {
          if (result[2] === state.hasBgColourId) {
            const newStatePaneFragments = {
              ...statePaneFragments,
              [result[2]]: {
                ...statePaneFragments[result[2]],
                bgColour: value,
              },
            }
            setStatePaneFragments(newStatePaneFragments)
            const impressionsPayload = stateImpressions?.title
              ? {
                  [stateImpressions.id]: stateImpressions,
                }
              : null
            const newOptionsPayload: any = {}
            if (impressionsPayload)
              newOptionsPayload.impressions = impressionsPayload
            if (Object.keys(stateHeldBeliefs).length)
              newOptionsPayload.heldBeliefs = stateHeldBeliefs
            if (Object.keys(stateWithheldBeliefs).length)
              newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
            if (newStatePaneFragments)
              newOptionsPayload.paneFragmentsPayload = Object.values(
                newStatePaneFragments,
              )
            if (state.hiddenPane)
              newOptionsPayload.hiddenPane = state.hiddenPane
            if (state.hasCodeHook) {
              newOptionsPayload.codeHook = {}
              if (state.codeHookTarget)
                newOptionsPayload.codeHook.target = state.codeHookTarget
              if (state.codeHookTargetUrl)
                newOptionsPayload.codeHook.targetUrl = state.codeHookTargetUrl
              if (state.codeHookHeight)
                newOptionsPayload.codeHook.height = state.codeHookHeight
              if (state.codeHookWidth)
                newOptionsPayload.codeHook.width = state.codeHookWidth
            }
            if (state.overflowHidden)
              newOptionsPayload.overflowHidden = state.overflowHidden
            setState((prev: any) => {
              return {
                ...prev,
                optionsPayloadString: JSON.stringify(newOptionsPayload),
                hasBgColour: value,
              }
            })
            setToggleCheck(true)
          } else if (result[2] === `0`) {
            const newPaneFragmentId = uuidv4()
            const newStatePaneFragments = {
              ...statePaneFragments,
              [newPaneFragmentId]: {
                bgColour: `#ffffff`,
                hiddenViewports: `none`,
                id: newPaneFragmentId,
                internal: {
                  type: `bgColour`,
                },
              },
            }
            setStatePaneFragments(newStatePaneFragments)
            const impressionsPayload = stateImpressions?.title
              ? {
                  [stateImpressions.id]: stateImpressions,
                }
              : null
            const newOptionsPayload: any = {}
            if (impressionsPayload)
              newOptionsPayload.impressions = impressionsPayload
            if (Object.keys(stateHeldBeliefs).length)
              newOptionsPayload.heldBeliefs = stateHeldBeliefs
            if (Object.keys(stateWithheldBeliefs).length)
              newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
            if (newStatePaneFragments)
              newOptionsPayload.paneFragmentsPayload = Object.values(
                newStatePaneFragments,
              )
            if (state.hiddenPane)
              newOptionsPayload.hiddenPane = state.hiddenPane
            if (state.hasCodeHook) {
              newOptionsPayload.codeHook = {}
              if (state.codeHookTarget)
                newOptionsPayload.codeHook.target = state.codeHookTarget
              if (state.codeHookTargetUrl)
                newOptionsPayload.codeHook.url = state.codeHookTargetUrl
              if (state.codeHookHeight)
                newOptionsPayload.codeHook.height = state.codeHookHeight
              if (state.codeHookWidth)
                newOptionsPayload.codeHook.width = state.codeHookWidth
            }
            if (state.overflowHidden)
              newOptionsPayload.overflowHidden = state.overflowHidden
            setState((prev: any) => {
              return {
                ...prev,
                optionsPayloadString: JSON.stringify(newOptionsPayload),
                hasBgColour: `#ffffff`,
                hasBgColourId: newPaneFragmentId,
              }
            })
            setToggleCheck(true)
          }
        }
        break

      case `updateImagePayload`: {
        const thisGlobalNth = result[2]
        const thisImage = stateLivePreviewMarkdown.images[thisGlobalNth]
        const thisNth = thisImage.parentNth
        const thisChildNth = thisImage.childNth
        const markdown = stateLivePreviewMarkdown.markdownArray[thisNth]
        const current = markdown.split(`\n`).filter((n: any) => n)
        const newCurrent = [
          ...current.slice(0, thisChildNth),
          `* ![${value}](${thisImage.url})`,
          ...current.slice(thisChildNth + 1),
        ]
        const newMarkdownArray = [...stateLivePreviewMarkdown.markdownArray]
        newMarkdownArray[thisNth] = `${newCurrent.join(`\n`)}\n`
        const markdownBody = newMarkdownArray.join(`\n`)
        const mdAst = fromMarkdown(markdownBody)
        setStateLivePreviewMarkdown((prev: any) => {
          return {
            ...prev,
            markdownArray: newMarkdownArray,
            markdownAst: mdAst,
            images: {
              ...stateLivePreviewMarkdown.images,
              [thisGlobalNth]: {
                ...stateLivePreviewMarkdown.images[thisGlobalNth],
                alt: value,
              },
            },
          }
        })
        const newStatePaneFragments = {
          ...statePaneFragments,
          [paneFragmentId]: {
            ...statePaneFragments[paneFragmentId],
            markdownBody,
          },
        }
        setStatePaneFragments(newStatePaneFragments)
        const impressionsPayload = stateImpressions?.title
          ? {
              [stateImpressions.id]: stateImpressions,
            }
          : null
        const newOptionsPayload: any = {}
        if (impressionsPayload)
          newOptionsPayload.impressions = impressionsPayload
        if (Object.keys(stateHeldBeliefs).length)
          newOptionsPayload.heldBeliefs = stateHeldBeliefs
        if (Object.keys(stateWithheldBeliefs).length)
          newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
        if (newStatePaneFragments)
          newOptionsPayload.paneFragmentsPayload = Object.values(
            newStatePaneFragments,
          )
        if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
        if (state.hasCodeHook) {
          newOptionsPayload.codeHook = {}
          if (state.codeHookTarget)
            newOptionsPayload.codeHook.target = state.codeHookTarget
          if (state.codeHookTargetUrl)
            newOptionsPayload.codeHook.url = state.codeHookTargetUrl
          if (state.codeHookHeight)
            newOptionsPayload.codeHook.height = state.codeHookHeight
          if (state.codeHookWidth)
            newOptionsPayload.codeHook.width = state.codeHookWidth
        }
        if (state.overflowHidden)
          newOptionsPayload.overflowHidden = state.overflowHidden
        setState((prev: any) => {
          return {
            ...prev,
            optionsPayloadString: JSON.stringify(newOptionsPayload),
          }
        })
        setToggleCheck(true)
        break
      }

      case `updateLinkPayload`: {
        const thisNth = result[1]
        const thisChildNth = result[4]
        const thisGlobalNth =
          stateLivePreviewMarkdown.linksLookup[thisNth][thisChildNth]
        const thisLink = stateLivePreviewMarkdown.links[thisGlobalNth]
        const current = [`ol`, `ul`].includes(
          stateLivePreviewMarkdown.markdownTags[thisNth],
        )
          ? [...stateLivePreviewMarkdown.markdownArray][nth]
              .split(`\n`)
              .filter((n: any) => n)
          : null
        const markdown = !current
          ? stateLivePreviewMarkdown.markdownArray[thisNth]
          : current[thisChildNth]
        // eslint-disable-next-line no-useless-escape
        const regexpLink = `^(.*?)(${thisLink.value})\]\(([^)]*)\)(.*)?`
        if (selector === `title`) {
          const prematch = markdown.match(regexpLink)
          const newValue = `${prematch[1] || `[`}${value}](${thisLink.target}${
            prematch[5] || `)`
          }`
          const newMarkdownArray = [...stateLivePreviewMarkdown.markdownArray]
          if (stateLivePreviewMarkdown.markdownTags[thisNth] === `p`)
            newMarkdownArray[thisNth] = `${newValue}\n`
          else {
            const newCurrent = [
              ...current.slice(0, thisChildNth),
              newValue,
              ...current.slice(thisChildNth + 1),
            ]
            newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
          }
          const markdownBody = newMarkdownArray.join(`\n`)
          const mdAst = fromMarkdown(markdownBody)
          setStateLivePreviewMarkdown((prev: any) => {
            return {
              ...prev,
              markdownArray: newMarkdownArray,
              markdownAst: mdAst,
              links: {
                ...stateLivePreviewMarkdown.links,
                [thisGlobalNth]: {
                  ...stateLivePreviewMarkdown.links[thisGlobalNth],
                  value,
                },
              },
            }
          })
          const newStatePaneFragments = {
            ...statePaneFragments,
            [paneFragmentId]: {
              ...statePaneFragments[paneFragmentId],
              markdownBody,
            },
          }
          setStatePaneFragments(newStatePaneFragments)
          const impressionsPayload = stateImpressions?.title
            ? {
                [stateImpressions.id]: stateImpressions,
              }
            : null
          const newOptionsPayload: any = {}
          if (impressionsPayload)
            newOptionsPayload.impressions = impressionsPayload
          if (Object.keys(stateHeldBeliefs).length)
            newOptionsPayload.heldBeliefs = stateHeldBeliefs
          if (Object.keys(stateWithheldBeliefs).length)
            newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
          if (newStatePaneFragments)
            newOptionsPayload.paneFragmentsPayload = Object.values(
              newStatePaneFragments,
            )
          if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
          if (state.hasCodeHook) {
            newOptionsPayload.codeHook = {}
            if (state.codeHookTarget)
              newOptionsPayload.codeHook.target = state.codeHookTarget
            if (state.codeHookTargetUrl)
              newOptionsPayload.codeHook.url = state.codeHookTargetUrl
            if (state.codeHookHeight)
              newOptionsPayload.codeHook.height = state.codeHookHeight
            if (state.codeHookWidth)
              newOptionsPayload.codeHook.width = state.codeHookWidth
          }
          if (state.overflowHidden)
            newOptionsPayload.overflowHidden = state.overflowHidden
          setState((prev: any) => {
            return {
              ...prev,
              optionsPayloadString: JSON.stringify(newOptionsPayload),
            }
          })
          setToggleCheck(true)
        } else if (selector === `callback`) {
          const newButtonPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload.buttons[
              thisLink.target
            ],
          }
          newButtonPayload.callbackPayload = value
          const newPaneFragmentOptionsPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload,
            buttons: {
              ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
              [thisLink.target]: newButtonPayload,
            },
          }
          const newStatePaneFragments = {
            ...statePaneFragments,
            [paneFragmentId]: {
              ...statePaneFragments[paneFragmentId],
              optionsPayload: newPaneFragmentOptionsPayload,
              optionsPayloadString: JSON.stringify(
                newPaneFragmentOptionsPayload,
              ),
            },
          }
          const impressionsPayload = stateImpressions?.title
            ? {
                [stateImpressions.id]: stateImpressions,
              }
            : null
          const newOptionsPayload: any = {}
          if (impressionsPayload)
            newOptionsPayload.impressions = impressionsPayload
          if (Object.keys(stateHeldBeliefs).length)
            newOptionsPayload.heldBeliefs = stateHeldBeliefs
          if (Object.keys(stateWithheldBeliefs).length)
            newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
          if (newStatePaneFragments)
            newOptionsPayload.paneFragmentsPayload = Object.values(
              newStatePaneFragments,
            )
          if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
          if (state.hasCodeHook) {
            newOptionsPayload.codeHook = {}
            if (state.codeHookTarget)
              newOptionsPayload.codeHook.target = state.codeHookTarget
            if (state.codeHookTargetUrl)
              newOptionsPayload.codeHook.url = state.codeHookTargetUrl
            if (state.codeHookHeight)
              newOptionsPayload.codeHook.height = state.codeHookHeight
            if (state.codeHookWidth)
              newOptionsPayload.codeHook.width = state.codeHookWidth
          }
          if (state.overflowHidden)
            newOptionsPayload.overflowHidden = state.overflowHidden
          setState((prev: any) => {
            return {
              ...prev,
              optionsPayloadString: JSON.stringify(newOptionsPayload),
            }
          })
          setStatePaneFragments(newStatePaneFragments)
          setStateLivePreviewMarkdown((prev: any) => {
            return {
              ...prev,
              links: {
                ...stateLivePreviewMarkdown.links,
                [thisGlobalNth]: {
                  ...stateLivePreviewMarkdown.links[thisGlobalNth],
                  callbackPayload: value,
                },
              },
            }
          })
          setToggleCheck(true)
        }
        break
      }

      case `updateCodePayload`: {
        const thisNth = result[1]
        const thisGlobalNth = stateLivePreviewMarkdown.codeItemsLookup[nth][0]
        const thisCodeItem = stateLivePreviewMarkdown.codeItems[thisGlobalNth]
        const thisHook = selector === `title` ? value : thisCodeItem.hook
        const thisVal1 = selector === `val1` ? value : thisCodeItem.values[0]
        const thisVal2 = selector === `val2` ? value : thisCodeItem.values[1]
        const thisVal3 = selector === `val3` ? value : thisCodeItem.values[2]
        const newValue = `* \`${thisHook}(${
          typeof thisVal1 === `string` ? thisVal1 : ``
        }${typeof thisVal2 === `string` ? `|${thisVal2}` : ``}${
          typeof thisVal3 === `string` ? `|${thisVal3}` : ``
        })\``
        const newMarkdownArray = [...stateLivePreviewMarkdown.markdownArray]
        newMarkdownArray[thisNth] = `${newValue}\n`
        const markdownBody = newMarkdownArray.join(`\n`)
        const mdAst = fromMarkdown(markdownBody)
        setStateLivePreviewMarkdown((prev: any) => {
          return {
            ...prev,
            markdownArray: newMarkdownArray,
            markdownAst: mdAst,
            codeItems: {
              ...stateLivePreviewMarkdown.codeItems,
              [thisGlobalNth]: {
                ...stateLivePreviewMarkdown.codeItems[thisGlobalNth],
                hook: thisHook,
                values: [thisVal1, thisVal2, thisVal3],
              },
            },
          }
        })
        const newStatePaneFragments = {
          ...statePaneFragments,
          [paneFragmentId]: {
            ...statePaneFragments[paneFragmentId],
            markdownBody,
          },
        }
        setStatePaneFragments(newStatePaneFragments)
        const impressionsPayload = stateImpressions?.title
          ? {
              [stateImpressions.id]: stateImpressions,
            }
          : null
        const newOptionsPayload: any = {}
        if (impressionsPayload)
          newOptionsPayload.impressions = impressionsPayload
        if (Object.keys(stateHeldBeliefs).length)
          newOptionsPayload.heldBeliefs = stateHeldBeliefs
        if (Object.keys(stateWithheldBeliefs).length)
          newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
        if (newStatePaneFragments)
          newOptionsPayload.paneFragmentsPayload = Object.values(
            newStatePaneFragments,
          )
        if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
        if (state.hasCodeHook) {
          newOptionsPayload.codeHook = {}
          if (state.codeHookTarget)
            newOptionsPayload.codeHook.target = state.codeHookTarget
          if (state.codeHookTargetUrl)
            newOptionsPayload.codeHook.url = state.codeHookTargetUrl
          if (state.codeHookHeight)
            newOptionsPayload.codeHook.height = state.codeHookHeight
          if (state.codeHookWidth)
            newOptionsPayload.codeHook.width = state.codeHookWidth
        }
        if (state.overflowHidden)
          newOptionsPayload.overflowHidden = state.overflowHidden
        setState((prev: any) => {
          return {
            ...prev,
            optionsPayloadString: JSON.stringify(newOptionsPayload),
          }
        })
        setToggleCheck(true)
        break
      }

      case `updateShapePayload`: {
        const thisPaneFragmentId = result[2]
        const thisSelector = result[3]
        const thisViewport = result[4]
        const newOptionsPayload = {
          ...statePaneFragments[thisPaneFragmentId].optionsPayload,
        }
        if (thisViewport === `remove` && thisSelector === `name`)
          deletePaneFragmentRegenerateState(thisPaneFragmentId)
        else if (thisViewport === `remove`) {
          delete newOptionsPayload.classNamesPayload.parent.classes[0][
            thisSelector
          ]
          regenerateState(newOptionsPayload, thisPaneFragmentId)
        } else
          switch (result[1]) {
            case `textShapeOutside`: {
              const extra = {
                textShapeOutsideMobile:
                  statePaneFragments[thisPaneFragmentId].textShapeOutsideMobile,
                textShapeOutsideTablet:
                  statePaneFragments[thisPaneFragmentId].textShapeOutsideTablet,
                textShapeOutsideDesktop:
                  statePaneFragments[thisPaneFragmentId]
                    .textShapeOutsideDesktop,
              }
              if (thisViewport === `mobile`)
                extra.textShapeOutsideMobile = value
              if (thisViewport === `tablet`)
                extra.textShapeOutsideTablet = value
              if (thisViewport === `desktop`)
                extra.textShapeOutsideDesktop = value
              const paneExtra =
                thisViewport === `mobile`
                  ? {
                      heightRatioMobile: shapesMobileHeightRatio(
                        `mobile`,
                        value,
                      ),
                    }
                  : thisViewport === `tablet`
                    ? {
                        heightRatioTablet: shapesMobileHeightRatio(
                          `tablet`,
                          value,
                        ),
                      }
                    : thisViewport === `desktop`
                      ? {
                          heightRatioDesktop: shapesMobileHeightRatio(
                            `desktop`,
                            value,
                          ),
                        }
                      : {}
              regenerateState(
                newOptionsPayload,
                thisPaneFragmentId,
                extra,
                paneExtra,
              )
              break
            }

            case `paneShape`:
              if (thisSelector === `name`) {
                // is this an artpack break
                if (
                  statePaneFragments[thisPaneFragmentId].optionsPayload
                    ?.artpack &&
                  typeof statePaneFragments[thisPaneFragmentId].optionsPayload
                    ?.artpack[thisViewport] !== `undefined` &&
                  statePaneFragments[thisPaneFragmentId].optionsPayload
                    ?.artpack[thisViewport].mode === `break`
                ) {
                  newOptionsPayload.artpack[thisViewport].collection =
                    value.substring(0, 3)
                  newOptionsPayload.artpack[thisViewport].image =
                    value.substring(3)
                  regenerateState(newOptionsPayload, thisPaneFragmentId)
                } else if (
                  // or mask with artpack
                  statePaneFragments[thisPaneFragmentId].optionsPayload?.artpack
                    ?.all?.mode === `mask` ||
                  !statePaneFragments[thisPaneFragmentId].optionsPayload
                    ?.artpack
                ) {
                  const extra = {
                    shapeMobile:
                      statePaneFragments[thisPaneFragmentId].shapeMobile,
                    shapeTablet:
                      statePaneFragments[thisPaneFragmentId].shapeTablet,
                    shapeDesktop:
                      statePaneFragments[thisPaneFragmentId].shapeDesktop,
                  }
                  if (thisViewport === `mobile`) extra.shapeMobile = value
                  if (thisViewport === `tablet`) extra.shapeTablet = value
                  if (thisViewport === `desktop`) extra.shapeDesktop = value
                  const paneExtra = stateLivePreviewMarkdown.hasTextShapeOutside
                    ? {}
                    : thisViewport === `mobile`
                      ? {
                          heightRatioMobile: shapesMobileHeightRatio(
                            `mobile`,
                            value,
                          ),
                        }
                      : thisViewport === `tablet`
                        ? {
                            heightRatioTablet: shapesMobileHeightRatio(
                              `tablet`,
                              value,
                            ),
                          }
                        : thisViewport === `desktop`
                          ? {
                              heightRatioDesktop: shapesMobileHeightRatio(
                                `desktop`,
                                value,
                              ),
                            }
                          : {}
                  regenerateState(
                    newOptionsPayload,
                    thisPaneFragmentId,
                    extra,
                    paneExtra,
                  )
                }
              }
              break

            case `modalShape`: {
              if (thisSelector === `name`) {
                const extra = {
                  textShapeOutsideMobile:
                    statePaneFragments[thisPaneFragmentId]
                      .textShapeOutsideMobile,
                  textShapeOutsideTablet:
                    statePaneFragments[thisPaneFragmentId]
                      .textShapeOutsideTablet,
                  textShapeOutsideDesktop:
                    statePaneFragments[thisPaneFragmentId]
                      .textShapeOutsideDesktop,
                }
                if (thisViewport === `mobile`)
                  extra.textShapeOutsideMobile = value
                if (thisViewport === `tablet`)
                  extra.textShapeOutsideTablet = value
                if (thisViewport === `desktop`)
                  extra.textShapeOutsideDesktop = value
                regenerateState(newOptionsPayload, thisPaneFragmentId, extra)
              } else if (
                [`paddingLeft`, `paddingTop`, `zoomFactor`].includes(
                  thisSelector,
                )
              ) {
                newOptionsPayload.modal = {
                  ...newOptionsPayload.modal,
                  [thisViewport]: {
                    ...newOptionsPayload.modal[thisViewport],
                    [thisSelector]: +value,
                  },
                }
                regenerateState(newOptionsPayload, thisPaneFragmentId)
              }
              break
            }

            case `paneShapeBreaksPayload`: {
              newOptionsPayload.artpack = {
                ...statePaneFragments[thisPaneFragmentId].optionsPayload
                  .artpack,
                [thisViewport]: {
                  ...statePaneFragments[thisPaneFragmentId].optionsPayload
                    .artpack[thisViewport],
                  svgFill: value,
                },
              }
              regenerateState(newOptionsPayload, thisPaneFragmentId)
              break
            }

            case `paneShapeClasses`: {
              const thisViewportOffset =
                thisViewport === `mobile`
                  ? 0
                  : thisViewport === `tablet`
                    ? 1
                    : 2
              const tuple = [
                ...statePaneFragments[thisPaneFragmentId].optionsPayload
                  .classNamesPayload.parent.classes[0][thisSelector],
              ]
              tuple[thisViewportOffset] = value
              const thisTuple = tuple[2]
                ? tuple
                : tuple[1]
                  ? [tuple[0], tuple[1]]
                  : [tuple[0]]
              const newClassNamesPayload = {
                ...statePaneFragments[thisPaneFragmentId].optionsPayload
                  .classNamesPayload,
                parent: {
                  classes: {
                    0: {
                      ...statePaneFragments[thisPaneFragmentId].optionsPayload
                        .classNamesPayload.parent.classes[0],
                      [thisSelector]: thisTuple,
                    },
                  },
                },
              }
              const reduced = reduceTailwindClasses(newClassNamesPayload)
              const newOptionsPayload = {
                ...statePaneFragments[paneFragmentId].optionsPayload,
                classNamesPayload: newClassNamesPayload,
                classNamesParent: reduced.classNamesParent,
              }
              regenerateState(newOptionsPayload, thisPaneFragmentId)
              break
            }

            case `paneShapeArtpackPayload`: {
              if (
                statePaneFragments[thisPaneFragmentId].optionsPayload?.artpack
                  ?.all?.mode === `mask` &&
                thisSelector === `image`
              ) {
                const thisCollection = artpackCollectionImages(
                  statePaneFragments[thisPaneFragmentId].optionsPayload.artpack
                    .all.collection,
                )
                const newImageFileType =
                  thisCollection.imageTypeLookup[
                    value as keyof typeof thisCollection.imageTypeLookup
                  ]
                newOptionsPayload.artpack.all.image = value
                newOptionsPayload.artpack.all.filetype = newImageFileType
                regenerateState(newOptionsPayload, thisPaneFragmentId)
              } else if (
                statePaneFragments[thisPaneFragmentId].optionsPayload?.artpack
                  ?.all?.mode === `mask` &&
                thisSelector === `collection`
              ) {
                const currentImage =
                  statePaneFragments[thisPaneFragmentId].optionsPayload.artpack
                    .all.image
                const thisCollection = artpackCollectionImages(value)
                const thisCollectionImages = Object.values(
                  thisCollection.images,
                )
                const newImage = thisCollectionImages.includes(currentImage)
                  ? currentImage
                  : thisCollectionImages[0 as keyof typeof thisCollectionImages]
                const newImageFileType =
                  thisCollection.imageTypeLookup[
                    newImage as keyof typeof thisCollection.imageTypeLookup
                  ]
                newOptionsPayload.artpack.all.collection = value
                newOptionsPayload.artpack.all.image = newImage
                newOptionsPayload.artpack.all.filetype = newImageFileType
                regenerateState(newOptionsPayload, thisPaneFragmentId)
              } else if (
                statePaneFragments[thisPaneFragmentId].optionsPayload?.artpack
                  ?.all?.mode === `mask` &&
                thisSelector === `objectFit`
              ) {
                newOptionsPayload.artpack.all.objectFit = value
                regenerateState(newOptionsPayload, thisPaneFragmentId)
              }
              break
            }
          }

        break
      }
    }
  }

  const handleEditMarkdown = useCallback(
    (markdownArray: string[]) => {
      const paneFragmentId = stateLivePreviewMarkdown.paneFragmentId
      const markdownId = stateLivePreviewMarkdown.markdownId
      const markdownBody = markdownArray.join(`\n`)
      const currentButtonsPayload = {
        ...statePaneFragments[paneFragmentId].optionsPayload.buttons,
      }
      const mdAst = fromMarkdown(markdownBody)
      // scan for any new links; add to payload
      mdAst?.children.forEach((e: any) => {
        e?.children.forEach((f: any) => {
          if (f.type === `link`) {
            let found = false
            Object.keys(stateLivePreviewMarkdown.links).forEach((g) => {
              if (stateLivePreviewMarkdown.links[g].target === f.url)
                found = true
            })
            if (!found) {
              currentButtonsPayload[f.url] = {
                callbackPayload: ``,
                className: ``,
                classNamesPayload: {
                  button: {
                    classes: {},
                  },
                  hover: {
                    classes: {},
                  },
                },
                urlTarget: ``,
              }
            }
          }
          f?.children?.forEach((h: any) => {
            if (h.type === `link`) {
              let found = false
              Object.keys(stateLivePreviewMarkdown.links).forEach((g) => {
                if (stateLivePreviewMarkdown.links[g].target === h.url)
                  found = true
              })
              if (!found) {
                currentButtonsPayload[h.url] = {
                  callbackPayload: ``,
                  className: ``,
                  classNamesPayload: {
                    button: {
                      classes: {},
                    },
                    hover: {
                      classes: {},
                    },
                  },
                  urlTarget: ``,
                }
              }
            }
            h?.children?.forEach((i: any) => {
              if (i.type === `link`) {
                let found = false
                Object.keys(stateLivePreviewMarkdown.links).forEach((g) => {
                  if (stateLivePreviewMarkdown.links[g].target === i.url)
                    found = true
                })
                if (!found) {
                  currentButtonsPayload[i.url] = {
                    callbackPayload: ``,
                    className: ``,
                    classNamesPayload: {
                      button: {
                        classes: {},
                      },
                      hover: {
                        classes: {},
                      },
                    },
                    urlTarget: ``,
                  }
                }
              }
            })
          })
        })
      })
      // must override payload in paneFragment optionsPayload
      const thisOptionsPayload = {
        ...statePaneFragments[paneFragmentId].optionsPayload,
        buttons: currentButtonsPayload,
      }
      const currentStatePaneFragments = {
        ...statePaneFragments,
        [paneFragmentId]: {
          ...statePaneFragments[paneFragmentId],
          optionsPayload: thisOptionsPayload,
        },
      }
      const thisMarkdown = {
        [markdownId]: {
          ...allMarkdown[markdownId],
          markdownBody,
        },
      }
      const {
        initialStateLivePreviewMarkdown,
        initialStateLivePreview,
        initialStatePaneFragments,
      } = generateLivePreviewInitialState({
        payload: Object.values(currentStatePaneFragments),
        allMarkdown: thisMarkdown,
        allFiles,
        unsavedMarkdownImages,
        unsavedMarkdownImageSvgs,
      })
      setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
      setStateLivePreview(initialStateLivePreview)
      const newStatePaneFragments = {
        ...statePaneFragments,
        [paneFragmentId]: initialStatePaneFragments[paneFragmentId],
      }
      setStatePaneFragments(newStatePaneFragments)
      const impressionsPayload = stateImpressions?.title
        ? {
            [stateImpressions.id]: stateImpressions,
          }
        : null
      const newOptionsPayload: any = {}
      if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
      if (Object.keys(stateHeldBeliefs).length)
        newOptionsPayload.heldBeliefs = stateHeldBeliefs
      if (Object.keys(stateWithheldBeliefs).length)
        newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
      if (newStatePaneFragments)
        newOptionsPayload.paneFragmentsPayload = Object.values(
          newStatePaneFragments,
        )
      if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
      if (state.hasCodeHook) {
        newOptionsPayload.codeHook = {}
        if (state.codeHookTarget)
          newOptionsPayload.codeHook.target = state.codeHookTarget
        if (state.codeHookTargetUrl)
          newOptionsPayload.codeHook.url = state.codeHookTargetUrl
        if (state.codeHookHeight)
          newOptionsPayload.codeHook.height = state.codeHookHeight
        if (state.codeHookWidth)
          newOptionsPayload.codeHook.width = state.codeHookWidth
      }
      if (state.overflowHidden)
        newOptionsPayload.overflowHidden = state.overflowHidden
      setState((prev: any) => {
        return {
          ...prev,
          optionsPayloadString: JSON.stringify(newOptionsPayload),
        }
      })
      setToggleCheck(true)
    },
    [
      allFiles,
      allMarkdown,
      state?.hiddenPane,
      state?.overflowHidden,
      state?.codeHookTarget,
      state?.codeHookTargetUrl,
      state?.codeHookWidth,
      state?.codeHookHeight,
      state?.hasCodeHook,
      stateHeldBeliefs,
      stateImpressions,
      stateLivePreviewMarkdown.links,
      stateLivePreviewMarkdown.markdownId,
      stateLivePreviewMarkdown.paneFragmentId,
      statePaneFragments,
      stateWithheldBeliefs,
      unsavedMarkdownImageSvgs,
      unsavedMarkdownImages,
    ],
  )

  const handleMutateMarkdown = (
    nth: any,
    childNth: any,
    mode: string,
    tag?: string,
  ) => {
    const insertTag = tag || `p`
    const prefixes = {
      p: ``,
      h1: `# `,
      h2: `## `,
      h3: `### `,
      h4: `#### `,
      h5: `##### `,
      h6: `###### `,
      ul: `* `,
      ol: `1. `,
      li: `1. `,
    }
    const prefix = prefixes[insertTag as keyof typeof prefixes]
    const paneFragmentId = stateLivePreviewMarkdown.paneFragmentId
    const markdownId = stateLivePreviewMarkdown.markdownId
    const thisTag =
      mode === `delete` && childNth === -1
        ? stateLivePreviewMarkdown.markdownTags[nth]
        : mode === `delete` && childNth > -1
          ? `li`
          : [`p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(
                stateLivePreviewMarkdown.markdownTags[nth],
              ) ||
              ([`ul`, `ol`].includes(
                stateLivePreviewMarkdown.markdownTags[nth],
              ) &&
                [`pre`, `post`, `parentpre`, `parentpost`].includes(mode))
            ? insertTag
            : [`imagePre`, `imagePost`].includes(mode)
              ? `img`
              : [`ul`, `ol`].includes(
                    stateLivePreviewMarkdown.markdownTags[nth],
                  )
                ? `li`
                : stateLivePreviewMarkdown.markdownTags[nth]
    const actualTag = [
      `imageContainer`,
      `youtube`,
      `bunny`,
      `bunnyContext`,
      `resource`,
      `toggle`,
      `belief`,
      `identifyAs`,
    ].includes(thisTag)
      ? `ul`
      : stateLivePreviewMarkdown.markdownTags[nth]
    const listPrefix = actualTag === `ul` ? `*` : actualTag === `ol` ? `1.` : ``
    const sliceOffset = [`parentpost`, `post`].includes(mode) ? nth + 1 : nth
    const tagsCount = stateLivePreviewMarkdown.markdownTags.slice(
      0,
      sliceOffset,
    )
    const childGlobalNth = tagsCount.filter(
      (e: string) => e === insertTag,
    ).length
    const optionsPayload =
      typeof statePaneFragments[paneFragmentId].optionsPayload !== `undefined`
        ? statePaneFragments[paneFragmentId].optionsPayload
        : null
    const classNamesPayload =
      typeof optionsPayload?.classNamesPayload !== `undefined`
        ? optionsPayload?.classNamesPayload
        : {}
    const overrideTag =
      [`ul`, `ol`].includes(thisTag) && ![`pre`, `post`].includes(mode)
        ? `li`
        : thisTag
    const thisClassNamesPayload =
      typeof classNamesPayload[overrideTag] !== `undefined`
        ? classNamesPayload[overrideTag]
        : null
    const hasOverride = typeof thisClassNamesPayload?.override !== `undefined`
    const thisClassNamesPayloadInner =
      [`pre`, `post`, `imagePre`, `imagePost`].includes(mode) &&
      [
        `ul`,
        `ol`,
        `imageContainer`,
        `youtube`,
        `bunny`,
        `bunnyContext`,
        `resource`,
        `toggle`,
        `belief`,
        `identifyAs`,
        `img`,
      ].includes(thisTag) &&
      typeof classNamesPayload.li !== `undefined`
        ? classNamesPayload.li
        : null
    const hasOverrideInner =
      typeof thisClassNamesPayloadInner?.override !== `undefined`
    // must update paneFragment optionsPayload classNamesPayload and regenerate classNames [all]
    let thisOverride = {}
    let thisOverrideInner = {}

    // console.log(
    //  `handleMutateMarkdown mode:${mode} nth:${nth} childNth:${childNth} tag:${thisTag} thisTag:${thisTag} overrideTag:${overrideTag} childGlobalNth:${childGlobalNth}`,
    // )

    if (
      [`pre`, `post`, `imagePre`, `imagePost`].includes(mode) &&
      [
        `ol`,
        `ul`,
        `imageContainer`,
        `youtube`,
        `bunny`,
        `bunnyContext`,
        `resource`,
        `toggle`,
        `belief`,
        `identifyAs`,
        `img`,
      ].includes(thisTag) &&
      hasOverrideInner
    ) {
      let listItemNth = 0
      Object.keys(stateLivePreviewMarkdown.listItems).forEach((e: string) => {
        if (
          ([`pre`, `imagePre`].includes(mode) &&
            stateLivePreviewMarkdown.listItems[e].parentNth <= nth &&
            stateLivePreviewMarkdown.listItems[e].childNth < childNth) ||
          ([`post`, `imagePost`].includes(mode) &&
            stateLivePreviewMarkdown.listItems[e].parentNth <= nth &&
            stateLivePreviewMarkdown.listItems[e].childNth <= childNth)
        ) {
          listItemNth++
        }
      })
      // insert ul|ol or img in li, must account for +1 li
      Object.keys(thisClassNamesPayloadInner.override).forEach((e: any) => {
        let thatOverrideInner = {}
        Object.keys(thisClassNamesPayloadInner.override[e]).forEach(
          (f: any) => {
            const thisVal = thisClassNamesPayloadInner.override[e][f]
            if (
              ([`pre`, `imagePre`].includes(mode) && +f >= listItemNth) ||
              ([`post`, `imagePost`].includes(mode) && +f >= listItemNth)
            ) {
              thatOverrideInner = {
                ...thatOverrideInner,
                [`${+f + 1}`]: thisVal,
              }
            } else {
              thatOverrideInner = { ...thatOverrideInner, [f]: thisVal }
            }
          },
        )
        thisOverrideInner = { ...thisOverrideInner, [e]: thatOverrideInner }
      })
    }

    if (hasOverride) {
      let overrideNth = 0
      Object.keys(stateLivePreviewMarkdown.listItems).forEach((e) => {
        const checkVal = stateLivePreviewMarkdown.listItems[e]
        if (
          (overrideTag === `li` &&
            [`ul`, `ol`].includes(thisTag) &&
            [`pre`, `parentpre`].includes(mode) &&
            checkVal.parentNth < nth) ||
          (overrideTag === `li` &&
            [`ul`, `ol`].includes(thisTag) &&
            [`post`, `parentpost`].includes(mode) &&
            checkVal.parentNth <= nth)
        )
          overrideNth++
      })
      Object.keys(thisClassNamesPayload.override).forEach((e: any) => {
        let thatOverride = {}
        Object.keys(thisClassNamesPayload.override[e]).forEach((f: any) => {
          const thisVal = thisClassNamesPayload.override[e][f]
          const thisGlobalNth =
            [`pre`, `post`, `delete`].includes(mode) &&
            childNth > -1 &&
            [`ol`, `ul`].includes(actualTag)
              ? stateLivePreviewMarkdown.listItemsLookup[nth][childNth]
              : childGlobalNth
          if (mode === `delete` && +f < thisGlobalNth)
            thatOverride = { ...thatOverride, [f]: thisVal }
          else if (mode === `delete` && +f === thisGlobalNth) {
            // skip
          } else if (mode === `delete`)
            thatOverride = { ...thatOverride, [`${+f - 1}`]: thisVal }
          else if (
            (+f < thisGlobalNth && [`pre`, `parentpre`].includes(mode)) ||
            (+f < thisGlobalNth && [`post`, `parentpost`].includes(mode)) ||
            (+f <= thisGlobalNth && [`post`].includes(mode) && childNth > -1)
          )
            thatOverride = { ...thatOverride, [f]: thisVal }
          else if (overrideTag === `li`) {
            // detect case where overrideTag === `li` ... must determine thisGlobalNth from lookups
            if (f >= overrideNth)
              thatOverride = { ...thatOverride, [`${+f + 1}`]: thisVal }
            else thatOverride = { ...thatOverride, [f]: thisVal }
          } else thatOverride = { ...thatOverride, [`${+f + 1}`]: thisVal }
        })
        thisOverride = { ...thisOverride, [e]: thatOverride }
      })
    }
    const countOffset = mode === `delete` ? -1 : 1
    const newThisClassNamesPayload = hasOverride
      ? {
          ...classNamesPayload[overrideTag],
          count: classNamesPayload[overrideTag].count + countOffset,
          override: {
            ...classNamesPayload[overrideTag].override,
            ...thisOverride,
          },
        }
      : !thisClassNamesPayload
        ? {
            classes: {},
          }
        : classNamesPayload[overrideTag]
    const newThisClassNamesPayloadInner = hasOverrideInner
      ? {
          ...classNamesPayload.li,
          count: classNamesPayload.li.count + countOffset,
          override: {
            ...classNamesPayload.li.override,
            ...thisOverrideInner,
          },
        }
      : null
    const newClassNamesPayload = {
      ...classNamesPayload,
      [overrideTag]: newThisClassNamesPayload,
    }
    if (newThisClassNamesPayloadInner)
      newClassNamesPayload.li = newThisClassNamesPayloadInner
    const reduced = reduceTailwindClasses(newClassNamesPayload)
    const thisOptionsPayload = {
      ...optionsPayload,
      classNames: reduced.classNames,
      classNamesModal: reduced?.classNamesModal || ``,
      classNamesPayload: newClassNamesPayload,
    }

    // mutate markdown
    const oldMarkdownArray = [...stateLivePreviewMarkdown.markdownArray]
    let newMarkdownArray: any
    if (mode === `delete` && childNth === -1) {
      newMarkdownArray =
        oldMarkdownArray.length === 1
          ? [`...\n`]
          : [
              ...oldMarkdownArray.slice(0, nth),
              ...oldMarkdownArray.slice(nth + 1),
            ]
    } else if (mode === `delete`) {
      const current = oldMarkdownArray[nth].split(`\n`).filter((n: any) => n)
      if (current.length === 1 && oldMarkdownArray.length === 1) {
        newMarkdownArray = [`...\n`]
      } else {
        const newCurrent = [
          ...current.slice(0, childNth),
          ...current.slice(childNth + 1),
        ]
        newMarkdownArray = [...oldMarkdownArray]
        newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
      }
    } else if (
      childNth === -1 &&
      mode === `pre` &&
      thisTag === `imageContainer`
    ) {
      newMarkdownArray = [
        ...oldMarkdownArray.slice(0, nth),
        `* ![ImagePlaceholder](ImagePlaceholder)\n`,
        ...oldMarkdownArray.slice(nth),
      ]
    } else if (
      childNth === -1 &&
      mode === `post` &&
      thisTag === `imageContainer`
    ) {
      newMarkdownArray = [
        ...oldMarkdownArray.slice(0, nth + 1),
        `* ![ImagePlaceholder](ImagePlaceholder)\n`,
        ...oldMarkdownArray.slice(nth + 1),
      ]
    } else if (
      childNth === -1 &&
      [`pre`, `post`].includes(mode) &&
      typeof tag === `string` &&
      [
        `youtube`,
        `bunny`,
        `bunnyContext`,
        `resource`,
        `toggle`,
        `identifyAs`,
        `belief`,
      ].includes(tag)
    ) {
      let hook = ``
      switch (tag) {
        case `bunny`:
          hook = `bunny(url|Title)`
          break
        case `bunnyContext`:
          hook = `bunnyContext(url|Title)`
          break
        case `youtube`:
          hook = `youtube(tag|Title)`
          break
        case `resource`:
          hook = `resource(type|variation)`
          break
        case `toggle`:
          hook = `toggle(BeliefTag|question prompt?)`
          break
        case `identifyAs`:
          hook = `identifyAs(BeliefTag|TARGET_VALUE|question)`
          break
        case `belief`:
          hook = `belief(BeliefTag|likert|question)`
          break
      }
      if (tag && mode === `pre`)
        newMarkdownArray = [
          ...oldMarkdownArray.slice(0, nth),
          `* \`${hook}\`\n`,
          ...oldMarkdownArray.slice(nth),
        ]
      else if (tag)
        newMarkdownArray = [
          ...oldMarkdownArray.slice(0, nth + 1),
          `* \`${hook}\`\n`,
          ...oldMarkdownArray.slice(nth + 1),
        ]
    } else if (
      (childNth === -1 && mode === `pre`) ||
      (childNth > -1 && mode === `parentpre`)
    ) {
      newMarkdownArray = [
        ...oldMarkdownArray.slice(0, nth),
        `${prefix}...\n`,
        ...oldMarkdownArray.slice(nth),
      ]
    } else if (
      (childNth === -1 && mode === `post`) ||
      (childNth > -1 && mode === `parentpost`)
    ) {
      newMarkdownArray = [
        ...oldMarkdownArray.slice(0, nth + 1),
        `${prefix}...\n`,
        ...oldMarkdownArray.slice(nth + 1),
      ]
    } else if (childNth > -1 && mode === `pre`) {
      const current = oldMarkdownArray[nth].split(`\n`).filter((n: any) => n)
      const newCurrent = [
        ...current.slice(0, childNth),
        `${listPrefix} ...`,
        ...current.slice(childNth),
      ]
      newMarkdownArray = [...oldMarkdownArray]
      newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
    } else if (childNth > -1 && mode === `post`) {
      const current = oldMarkdownArray[nth].split(`\n`).filter((n: any) => n)
      const newCurrent = [
        ...current.slice(0, childNth + 1),
        `${listPrefix} ...`,
        ...current.slice(childNth + 1),
      ]
      newMarkdownArray = [...oldMarkdownArray]
      newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
    } else if (childNth > -1 && mode === `imagePre`) {
      const current = oldMarkdownArray[nth].split(`\n`).filter((n: any) => n)
      const newCurrent = [
        ...current.slice(0, childNth),
        `${listPrefix} ![ImagePlaceholder](ImagePlaceholder)`,
        ...current.slice(childNth),
      ]
      newMarkdownArray = [...oldMarkdownArray]
      newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
    } else if (childNth > -1 && mode === `imagePost`) {
      const current = oldMarkdownArray[nth].split(`\n`).filter((n: any) => n)
      const newCurrent = [
        ...current.slice(0, childNth + 1),
        `${listPrefix} ![ImagePlaceholder](ImagePlaceholder)`,
        ...current.slice(childNth + 1),
      ]
      newMarkdownArray = [...oldMarkdownArray]
      newMarkdownArray[nth] = `${newCurrent.join(`\n`)}\n`
    } else {
      console.log(`missed on insert`)
      return null
    }
    const markdownBody = newMarkdownArray?.join(`\n`)

    // handle deleted image
    const removeImage =
      (mode === `delete` &&
        !!stateLivePreviewMarkdown?.images &&
        Object.keys(stateLivePreviewMarkdown.images)
          .map((e) => {
            return stateLivePreviewMarkdown.images[e].parentNth === nth &&
              stateLivePreviewMarkdown.images[e].childNth === childNth
              ? stateLivePreviewMarkdown.images[e].id
              : null
          })
          .filter((n) => n)) ||
      []
    const removeImageId = removeImage.length ? removeImage.at(0) : null
    if (removeImageId)
      setUnremovedMarkdownImages({
        ...unremovedMarkdownImages,
        [removeImageId]: true,
      })

    // override images
    const relationships = removeImageId
      ? {
          images: [...allMarkdown[markdownId].relationships.images].filter(
            (e) =>
              e !== removeImageId &&
              typeof unremovedMarkdownImages[e] === `undefined`,
          ),
          imagesSvg: [
            ...allMarkdown[markdownId].relationships.imagesSvg,
          ].filter(
            (e) =>
              e !== removeImageId &&
              typeof unremovedMarkdownImages[e] === `undefined`,
          ),
        }
      : allMarkdown[markdownId].relationships

    // then pass through original generateState fn
    const thisMarkdown = {
      [markdownId]: {
        ...allMarkdown[markdownId],
        markdownBody,
        relationships,
      },
    }

    const {
      initialStateLivePreview,
      initialStateLivePreviewMarkdown,
      initialStatePaneFragments,
    } = generateLivePreviewInitialState({
      payload: [
        {
          ...statePaneFragments[paneFragmentId],
          markdownBody,
          optionsPayload: thisOptionsPayload,
          optionsPayloadString: JSON.stringify(thisOptionsPayload),
        },
      ],
      allMarkdown: thisMarkdown,
      allFiles,
      unsavedMarkdownImages,
      unsavedMarkdownImageSvgs,
    })
    setStateLivePreview(initialStateLivePreview)
    setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
    const newStatePaneFragments = {
      ...statePaneFragments,
      [paneFragmentId]: {
        ...initialStatePaneFragments[paneFragmentId],
      },
    }
    setStatePaneFragments(newStatePaneFragments)
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload: any = {}
    if (impressionsPayload) newOptionsPayload.impressions = impressionsPayload
    if (Object.keys(stateHeldBeliefs).length)
      newOptionsPayload.heldBeliefs = stateHeldBeliefs
    if (Object.keys(stateWithheldBeliefs).length)
      newOptionsPayload.withheldBeliefs = stateWithheldBeliefs
    if (newStatePaneFragments)
      newOptionsPayload.paneFragmentsPayload = Object.values(
        newStatePaneFragments,
      )
    if (state.hiddenPane) newOptionsPayload.hiddenPane = state.hiddenPane
    if (state.hasCodeHook) {
      newOptionsPayload.codeHook = {}
      if (state.codeHookTarget)
        newOptionsPayload.codeHook.target = state.codeHookTarget
      if (state.codeHookTargetUrl)
        newOptionsPayload.codeHook.url = state.codeHookTargetUrl
      if (state.codeHookHeight)
        newOptionsPayload.codeHook.height = state.codeHookHeight
      if (state.codeHookWidth)
        newOptionsPayload.codeHook.width = state.codeHookWidth
    }
    if (state.overflowHidden)
      newOptionsPayload.overflowHidden = state.overflowHidden
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
  }

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setSaveStage(SaveStages.PrepareSave)
  }

  const handleDelete = () => {
    if (stateLivePreviewMarkdown.markdownId)
      setEditStage(EditStages.PreDeleteUpdatingAffectedNode)
    else setEditStage(EditStages.Delete)
  }

  useEffect(() => {
    if (toggleCheck) {
      const hasChanges = !deepEqual(state, lastSavedState.initialState)
      if (hasChanges && saveStage === SaveStages.NoChanges) {
        setSaveStage(SaveStages.UnsavedChanges)
        setNavLocked(true)
      } else if (!hasChanges && saveStage === SaveStages.UnsavedChanges) {
        setSaveStage(SaveStages.NoChanges)
        setNavLocked(false)
      }
    }
  }, [
    toggleCheck,
    deepEqual,
    saveStage,
    state,
    setNavLocked,
    lastSavedState.initialState,
  ])

  // handle stages
  useEffect(() => {
    const hasMarkdown =
      typeof stateLivePreviewMarkdown?.markdownId !== `undefined` &&
      typeof allMarkdown[stateLivePreviewMarkdown.markdownId] !== `undefined`
    const thisMarkdown = hasMarkdown
      ? allMarkdown[stateLivePreviewMarkdown.markdownId]
      : null

    switch (saveStage) {
      case SaveStages.NoChanges:
        Object.keys(cleanerQueue).forEach((e: string) => {
          if (cleanerQueue[e] === `pane` && e !== uuid) {
            removePane(e)
            removeCleanerQueue(e)
          }
          if (cleanerQueue[e] === `markdown`) {
            removeMarkdown(e)
            removeCleanerQueue(e)
          }
        })
        break

      case SaveStages.PrepareSave: {
        setSaveStage(SaveStages.PrepareNodes)
        break
      }

      case SaveStages.PrepareNodes: {
        if (stateLivePreviewMarkdown?.markdownId) {
          const addUnsavedImages =
            unsavedMarkdownImages &&
            Object.keys(unsavedMarkdownImages)
              .map((e) => {
                return e
              })
              .concat(
                allMarkdown[stateLivePreviewMarkdown.markdownId].relationships
                  .images,
              )
          const addUnsavedImageSvgs =
            unsavedMarkdownImageSvgs &&
            Object.keys(unsavedMarkdownImageSvgs)
              .map((e) => {
                return e
              })
              .concat(
                allMarkdown[stateLivePreviewMarkdown.markdownId].relationships
                  .imageSvgs,
              )
          const newMarkdown = {
            ...allMarkdown[stateLivePreviewMarkdown.markdownId],
            id: stateLivePreviewMarkdown.markdownId,
            markdownBody: stateLivePreviewMarkdown.markdownArray.join(`\n`),
            title: `Copy for ${state.title}`,
            slug: state.slug,
          }
          if (addUnsavedImages.length)
            newMarkdown.relationships = {
              ...newMarkdown.relationships,
              images: addUnsavedImages,
            }
          if (addUnsavedImageSvgs.length)
            newMarkdown.relationships = {
              ...newMarkdown.relationships,
              imageSvgs: addUnsavedImageSvgs,
            }
          // filter out any deleted images
          if (Object.keys(unremovedMarkdownImages).length) {
            Object.keys(unremovedMarkdownImages).forEach((e) => {
              if (newMarkdown.relationships.images.includes(e))
                newMarkdown.relationships.images =
                  newMarkdown.relationships.images.filter((f) => f !== e)
              if (newMarkdown.relationships.imagesSvg.includes(e))
                newMarkdown.relationships.imagesSvg =
                  newMarkdown.relationships.imagesSvg.filter((f) => f !== e)
            })
          }
          setUpdateMarkdownPayload([newMarkdown])
          if (!flags.isOpenDemo) {
            const markdown = markdownPayload(
              statePaneFragments,
              { [stateLivePreviewMarkdown.markdownId]: newMarkdown },
              unsavedMarkdownImages,
              unsavedMarkdownImageSvgs,
            )
            if (typeof markdown[0] !== `undefined`)
              setDrupalPreSaveQueue(
                markdown[0],
                `markdown`,
                stateLivePreviewMarkdown.markdownId,
                thisMarkdown.drupalNid,
              )
          }
        }
        const newPane = {
          id: uuid,
          drupalNid: thisPane.drupalNid,
          heightOffsetDesktop: state.heightOffsetDesktop,
          heightOffketMobile: state.heightOffsetMobile,
          heightOffsetTablet: state.heightOffsetTablet,
          heightRatioDesktop: state.heightRatioDesktop,
          heightRatioMobile: state.heightRatioMobile,
          heightRatioTablet: state.heightRatioTablet,
          isContextPane: state.isContextPane,
          optionsPayload: state.optionsPayloadString,
          relationships: {
            // FIX --- should pull all from state
            ...thisPane.relationships,
          },
          slug: state.slug,
          title: state.title,
        }
        if (stateLivePreviewMarkdown?.markdownId)
          newPane.relationships.markdown = [stateLivePreviewMarkdown.markdownId]
        setUpdatePanePayload([{ id: uuid, payload: newPane }])
        if (!flags.isOpenDemo) {
          const pane = panePayload(
            state,
            uuid,
            statePaneFragments,
            stateImpressions,
            stateHeldBeliefs,
            stateWithheldBeliefs,
          )
          setDrupalPreSaveQueue(pane, `pane`, uuid, thisPane.drupalNid)
        }
        if (hasMarkdown) setSaveStage(SaveStages.SaveMarkdown)
        else setSaveStage(SaveStages.SavePane)
        break
      }

      // drupal api save image; see https://www.drupal.org/node/3024331
      case SaveStages.SavedNewFile:
        setSaveStage(SaveStages.UnsavedChanges)
        setToggleCheck(true)
        break

      case SaveStages.FilesUpdateAffectedNodes:
        break

      case SaveStages.SaveMarkdown: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingMarkdown)
        else setSaveStage(SaveStages.SavingMarkdown)
        break
      }

      case SaveStages.SavedMarkdown:
        setSaveStage(SaveStages.SavePane)
        break

      case SaveStages.SavePane: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingPane)
        else setSaveStage(SaveStages.SavingPane)
        break
      }

      case SaveStages.SavedPane:
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PaneUpdateAffectedNodes)
        else setSaveStage(SaveStages.Success)
        break

      case SaveStages.PaneUpdateAffectedNodes:
        if (embeddedEdit?.parentState) {
          const newPanes = embeddedEdit.parentState.panes.map((e: string) => {
            if (e === uuid) return newUuid
            return e
          })
          setNewEmbeddedPayload({
            ...embeddedEdit,
            parentState: { ...embeddedEdit.parentState, panes: newPanes },
          })
        }
        setSaveStage(SaveStages.Success)
        break

      case SaveStages.Error:
        break

      case SaveStages.Success:
        setSaved(true)
        setLastSavedState({
          initialState: state,
          initialStatePaneFragments: statePaneFragments,
          initialStateImpressions: stateImpressions,
          initialStateHeldBeliefs: stateHeldBeliefs,
          initialStateWithheldBeliefs: stateWithheldBeliefs,
          initialStateLivePreview: stateLivePreview,
          initialStateLivePreviewMarkdown: stateLivePreviewMarkdown,
        })
        setSaveStage(SaveStages.NoChanges)
        setNavLocked(false)
        if (newUuid) {
          const goto = newUuid
          setNewUuid(``)
          navigate(`/storykeep/panes/${goto}`)
        } else {
          setToggleCheck(true)
        }
        break
    }
  }, [
    flags.isOpenDemo,
    newImage,
    saveStage,
    setNavLocked,
    uuid,
    newUuid,
    thisPane?.drupalNid,
    thisPane?.relationships,
    allMarkdown,
    setDrupalPreSaveQueue,
    state,
    stateLivePreviewMarkdown?.markdownArray,
    stateLivePreviewMarkdown?.drupalNid,
    stateLivePreviewMarkdown?.markdownId,
    stateImpressions,
    stateHeldBeliefs,
    stateWithheldBeliefs,
    statePaneFragments,
    stateLivePreview,
    stateLivePreviewMarkdown,
    cleanerQueue,
    removeCleanerQueue,
    removePane,
    removeMarkdown,
    embeddedEdit,
    setNewEmbeddedPayload,
    unsavedMarkdownImageSvgs,
    unsavedMarkdownImages,
    unremovedMarkdownImages,
  ])

  useEffect(() => {
    // re-used image from allFiles; must update markdown node (unsaved changes)
    if (!newImage && imageUpdatedMarkdown && imageUpdatedMarkdown.length) {
      handleEditMarkdown(imageUpdatedMarkdown)
      setLocked(false)
      setShowImageLibrary(false)
      setImageUpdatedMarkdown([])
    }
  }, [
    newImage,
    handleEditMarkdown,
    imageUpdatedMarkdown,
    unsavedMarkdownImageSvgs,
    unsavedMarkdownImages,
  ])

  // toggle SaveNewFile to save this file to Drupal
  useEffect(() => {
    if (newImage && saveStage < SaveStages.SaveNewFile) {
      if (!flags.isOpenDemo) {
        const endpoint =
          newImage.filetype === `image/svg+xml`
            ? `${stateLivePreviewMarkdown.markdownId}/field_image_svg`
            : `${stateLivePreviewMarkdown.markdownId}/field_image`
        setDrupalPreSaveQueue(
          {
            filename: newImage.filename,
            binary: newImage.binary,
            nth: newImage.nth,
            childNth: newImage.childNth,
            childGlobalNth: newImage.childGlobalNth,
          },
          `markdown`,
          endpoint,
          -1,
        )
      }
      setNewImage(null)
      setSaveStage(SaveStages.SaveNewFile)
    }
  }, [
    newImage,
    saveStage,
    flags.isOpenDemo,
    setDrupalPreSaveQueue,
    uuid,
    stateLivePreviewMarkdown?.markdownId,
  ])

  // save file to drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.SaveNewFile &&
      typeof drupalPreSaveQueue?.markdown !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.markdown).length
    ) {
      Object.keys(drupalPreSaveQueue.markdown).forEach((endpoint: string) => {
        setNewImagePos({
          nth: drupalPreSaveQueue.markdown[endpoint].payload.nth,
          childNth: drupalPreSaveQueue.markdown[endpoint].payload.childNth,
          childGlobalNth:
            drupalPreSaveQueue.markdown[endpoint].payload.childGlobalNth,
          isSvg:
            drupalPreSaveQueue.markdown[endpoint].payload.filename.includes(
              `svg`,
            ),
          filename: drupalPreSaveQueue.markdown[endpoint].payload.filename,
        })
        setDrupalSaveNode(
          drupalPreSaveQueue.markdown[endpoint].payload,
          `markdown`,
          endpoint,
          -1,
        )
        removeDrupalPreSaveQueue(endpoint, `markdown`)
      })
      setSaveStage(SaveStages.SavingNewFile)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.SavingNewFile &&
      Object.keys(newImagePos).length &&
      drupalResponse &&
      Object.keys(drupalResponse).length
    ) {
      Object.keys(drupalResponse).forEach((endpoint: string) => {
        drupalResponse[endpoint].data.forEach((newFile: any) => {
          if (newFile.attributes.filename === newImagePos.filename) {
            const newFileDatum = {
              title: newFile.attributes.filename,
              filemime: newFile.attributes.filemime,
              filename: newFile.attributes.filename,
              localFile: {
                publicURL: newFile.attributes.uri.url,
              },
            }
            if (!newFile.attributes.filename.includes(`svg`))
              setUnsavedMarkdownImages((prev: any) => {
                return { ...prev, [newFile.id]: newFileDatum }
              })
            else
              setUnsavedMarkdownImageSvgs((prev: any) => {
                return { ...prev, [newFile.id]: newFileDatum }
              })
            updateFiles(newFile)
            handleUnsavedImage(
              newFile.id,
              newImagePos.nth,
              newImagePos.childNth,
              newImagePos.childGlobalNth,
              newImagePos.isSvg,
              newImagePos.filename,
              true,
            )
          }
        })
        setCleanerQueue(endpoint)
        removeDrupalResponse(endpoint)
      })
      setSaveStage(SaveStages.SavedNewFile)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    uuid,
    handleUnsavedImage,
    drupalPreSaveQueue?.markdown,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    updateFiles,
    newImagePos,
  ])

  // delete from from drupal
  useEffect(() => {
    // markdown
    if (flags.editStage === EditStages.PreDeleteUpdatingAffectedNode) {
      setDrupalDeleteNode(`markdown`, stateLivePreviewMarkdown.markdownId)
      setEditStage(EditStages.PreDeleteUpdatedAffectedNode)
    } else if (
      flags.editStage === EditStages.PreDeleteUpdatedAffectedNode &&
      typeof drupalResponse[stateLivePreviewMarkdown.markdownId] !== `undefined`
    ) {
      setEditStage(EditStages.Delete)
    }
    // pane
    if (flags.editStage === EditStages.Delete) {
      setDrupalDeleteNode(`pane`, uuid)
      setEditStage(EditStages.Deleting)
    } else if (
      flags.editStage === EditStages.Deleting &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      setEditStage(EditStages.Deleted)
    }
  }, [
    flags.editStage,
    uuid,
    drupalResponse,
    setDrupalDeleteNode,
    setEditStage,
    stateLivePreviewMarkdown.markdownId,
  ])

  // save markdown for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingMarkdown &&
      typeof drupalPreSaveQueue?.markdown !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.markdown).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.markdown[stateLivePreviewMarkdown.markdownId]
          .payload,
        `markdown`,
        stateLivePreviewMarkdown.markdownId,
        drupalPreSaveQueue.markdown[stateLivePreviewMarkdown.markdownId]
          .drupalNid,
      )
      removeDrupalPreSaveQueue(stateLivePreviewMarkdown.markdownId, `markdown`)
      setSaveStage(SaveStages.PreSavedMarkdown)
    }
    // second pass, intercept / process response, get uuid from Drupal if new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedMarkdown &&
      stateLivePreviewMarkdown?.markdownId &&
      typeof drupalResponse[stateLivePreviewMarkdown.markdownId] !== `undefined`
    ) {
      if (
        allMarkdown[stateLivePreviewMarkdown.markdownId].drupalNid === -1 &&
        typeof drupalPreSaveQueue.pane[uuid] !== `undefined`
      ) {
        // this is a new markdown; replace initial uuid with one from Drupal
        const newMarkdown = {
          ...allMarkdown[stateLivePreviewMarkdown.markdownId],
        }
        newMarkdown.id =
          drupalResponse[stateLivePreviewMarkdown.markdownId].data.id
        newMarkdown.drupalNid =
          drupalResponse[
            stateLivePreviewMarkdown.markdownId
          ].data.attributes.drupal_internal__nid
        setUpdateMarkdownPayload([newMarkdown])

        const newPreSavePayload = {
          ...drupalPreSaveQueue.pane[uuid].payload,
        }
        const currentOptionsPayload = ParseOptions(
          newPreSavePayload.attributes.field_options,
        )
        let offset = 0
        Object.keys(currentOptionsPayload).forEach((e: any) => {
          if (currentOptionsPayload[e].markdownId) offset = e
        })
        const newPaneFragments = {
          ...currentOptionsPayload.paneFragmentsPayload,
          [offset]: {
            ...currentOptionsPayload.paneFragmentsPayload[offset],
            markdownId: newMarkdown.id,
          },
        }
        const newOptionsPayload = {
          ...currentOptionsPayload,
          paneFragmentsPayload: Object.values(newPaneFragments),
        }
        newPreSavePayload.attributes.field_options =
          JSON.stringify(newOptionsPayload)
        setDrupalPreSaveQueue(
          newPreSavePayload,
          `pane`,
          uuid,
          thisPane?.drupalNid,
          newMarkdown.id,
          stateLivePreviewMarkdown.markdownId,
        )
      }
      removeDrupalResponse(stateLivePreviewMarkdown.markdownId)
      setSaveStage(SaveStages.SavingMarkdown)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    drupalPreSaveQueue?.markdown,
    removeDrupalPreSaveQueue,
    setDrupalSaveNode,
    stateLivePreviewMarkdown?.markdownId,
    allMarkdown,
    drupalPreSaveQueue?.pane,
    setDrupalPreSaveQueue,
    drupalResponse,
    removeDrupalResponse,
    thisPane?.drupalNid,
    uuid,
  ])

  // update markdown on save
  useEffect(() => {
    if (
      saveStage === SaveStages.SavingMarkdown &&
      updateMarkdownPayload.length
    ) {
      updateMarkdownPayload.forEach((e: any) => {
        updateMarkdown(e)
      })
      setUpdateMarkdownPayload([])
      setSaveStage(SaveStages.SavedMarkdown)
    }
  }, [saveStage, updateMarkdownPayload, updateMarkdown])

  // save pane for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingPane &&
      typeof drupalPreSaveQueue?.pane !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.pane).length
    ) {
      const newMarkdownId = drupalPreSaveQueue.pane[uuid].markdownId
      if (
        newMarkdownId &&
        newMarkdownId !== thisPane?.relationships.markdown[0]
      ) {
        const fullOptionsPayload = ParseOptions(state.optionsPayloadString)
        const currentOptionsPayload = fullOptionsPayload.paneFragmentsPayload
        let offset = 0
        Object.keys(currentOptionsPayload).forEach((e: any) => {
          if (currentOptionsPayload[e].markdownId) offset = e
        })
        const newPaneFragments = {
          ...currentOptionsPayload,
          [offset]: {
            ...currentOptionsPayload[offset],
            markdownId: newMarkdownId,
          },
        }
        const newOptionsPayload = {
          ...fullOptionsPayload,
          paneFragmentsPayload: Object.values(newPaneFragments),
        }
        const newPane = {
          id: uuid,
          drupalNid: thisPane?.drupalNid,
          heightOffsetDesktop: state.heightOffsetDesktop,
          heightOffketMobile: state.heightOffsetMobile,
          heightOffsetTablet: state.heightOffsetTablet,
          heightRatioDesktop: state.heightRatioDesktop,
          heightRatioMobile: state.heightRatioMobile,
          heightRatioTablet: state.heightRatioTablet,
          isContextPane: state.isContextPane,
          optionsPayload: JSON.stringify(newOptionsPayload),
          relationships: {
            // FIX --- should pull all from state
            ...thisPane?.relationships,
            markdown: [newMarkdownId],
          },
          slug: state.slug,
          title: state.title,
        }
        setUpdatePanePayload([{ id: uuid, payload: newPane }])
        setStateLivePreviewMarkdown((prev: any) => {
          return {
            ...prev,
            markdownId: newMarkdownId,
          }
        })
        regenerateState(
          null,
          stateLivePreviewMarkdown.paneFragmentId,
          { markdownId: newMarkdownId },
          null,
          newMarkdownId,
        )
      }
      const drupalNode = { ...drupalPreSaveQueue.pane[uuid].payload }
      if (newMarkdownId)
        drupalNode.relationships.field_markdown.data.id = newMarkdownId
      setDrupalSaveNode(
        drupalNode,
        `pane`,
        uuid,
        drupalPreSaveQueue.pane[uuid].drupalNid,
      )
      if (
        typeof drupalPreSaveQueue.pane[uuid] !== `undefined` &&
        drupalPreSaveQueue.pane[uuid].markdownId &&
        drupalPreSaveQueue.pane[uuid].oldMarkdownId
      ) {
        const thisUuid = drupalPreSaveQueue.pane[uuid].oldMarkdownId
        setCleanerQueue(thisUuid, `markdown`)
      }
      removeDrupalPreSaveQueue(uuid, `pane`)
      setSaveStage(SaveStages.PreSavedPane)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedPane &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      if (thisPane?.drupalNid === -1) {
        const newPaneId = drupalResponse[uuid].data.id
        const newPane = {
          ...thisPane,
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
          relationships: {
            ...thisPane?.relationships,
            markdown: [stateLivePreviewMarkdown.markdownId],
          },
        }
        setUpdatePanePayload([{ id: newPaneId, payload: newPane }])
        setCleanerQueue(uuid, `pane`)
        setNewUuid(newPaneId)
      }
      removeDrupalResponse(uuid)
      setSaveStage(SaveStages.SavingPane)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    drupalPreSaveQueue?.pane,
    regenerateState,
    removeDrupalPreSaveQueue,
    setDrupalSaveNode,
    drupalResponse,
    setCleanerQueue,
    removeDrupalResponse,
    thisPane,
    state?.heightOffsetDesktop,
    state?.heightOffsetMobile,
    state?.heightOffsetTablet,
    state?.heightRatioDesktop,
    state?.heightRatioMobile,
    state?.heightRatioTablet,
    state?.isContextPane,
    state?.optionsPayloadString,
    state?.slug,
    state?.title,
    stateLivePreviewMarkdown?.paneFragmentId,
    stateLivePreviewMarkdown?.markdownId,
    uuid,
  ])

  // update pane on save
  useEffect(() => {
    if (saveStage === SaveStages.SavingPane && updatePanePayload.length) {
      updatePanePayload.forEach((e: any) => {
        setPane(e.id, e.payload)
      })
      setUpdatePanePayload([])
      setSaveStage(SaveStages.SavedPane)
    }
  }, [saveStage, updatePanePayload, setPane])

  // handle new embeddedEdit payload
  useEffect(() => {
    if (newEmbeddedPayload.parentState) {
      setEmbeddedEdit(
        newEmbeddedPayload.child,
        newEmbeddedPayload.childType,
        newEmbeddedPayload.parent,
        newEmbeddedPayload.parentType,
        newEmbeddedPayload.parentState,
        newEmbeddedPayload.grandChild,
        newEmbeddedPayload.grandChildType,
      )
    }
  }, [setEmbeddedEdit, newEmbeddedPayload, setNewEmbeddedPayload])

  // set initial state
  useEffect(() => {
    if (
      flags.editStage === EditStages.Activated &&
      saveStage === SaveStages.Booting
    ) {
      setSaveStage(SaveStages.NoChanges)
    }
  }, [state, flags.editStage, saveStage, setSaveStage])

  if (saveStage < SaveStages.NoChanges) return null

  // console.log(statePaneFragments)
  // console.log(
  //   statePaneFragments[stateLivePreviewMarkdown.paneFragmentId].optionsPayload,
  // )
  // console.log(stateLivePreview)
  // console.log(stateLivePreviewMarkdown)
  // console.log(state)

  return (
    <PaneForm
      uuid={uuid}
      payload={{
        state,
        statePaneFragments,
        stateImpressions,
        stateHeldBeliefs,
        stateWithheldBeliefs,
        stateLivePreview,
        stateLivePreviewMarkdown,
      }}
      flags={{
        ...flags,
        saveStage,
        saved,
        isEmpty,
        slugCollision,
        drupalNid: thisPane?.drupalNid,
        isUsed,
        unsavedMarkdownImages,
        unsavedMarkdownImageSvgs,
        locked,
        showImageLibrary,
        isOpenDemo: flags.isOpenDemo,
      }}
      fn={{
        toggleBelief,
        handleChangeBelief,
        addBelief,
        handleChangeImpression,
        handleSubmit,
        handleEditMarkdown,
        handleMutateMarkdown,
        handleChangeEditInPlace,
        handleChange,
        setSaved,
        handleDelete,
        handleUnsavedImage,
        setLocked,
        setShowImageLibrary,
        setNewImage,
      }}
    />
  )
}

export default PaneState
