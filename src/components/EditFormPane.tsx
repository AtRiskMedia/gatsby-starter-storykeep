// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { ParseOptions, classNames } from '@tractstack/helpers'
import { Switch } from '@headlessui/react'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { v4 as uuidv4 } from 'uuid'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { useDrupalStore } from '../stores/drupal'
import Message from './Message'
import EditBelief from './EditBelief'
import RenderPaneLive from './RenderPaneLive'
import { IEditFormInner } from '../types'
import EditFormPaneFragment from './EditFormPaneFragment'
import { panePayload, markdownPayload } from '../helpers/generateDrupalPayload'
import { reduceTailwindClasses } from '../helpers/reduceTailwindClasses'
import { generateLivePreviewInitialState } from '../helpers/generateLivePreviewInitialState'
import {
  shapesMobileHeightRatio,
  artpackCollectionImages,
} from '../helpers/allowedShapeNames'
import { starterTemplate } from '../helpers/starterTemplates'

const EditFormPane = ({
  uuid,
  handleToggle,
  handleReplacePane,
  setThisUuid,
  payload,
}: IEditFormInner) => {
  const [payloadLast, setPayloadLast] = useState(payload)
  const [hasProcessedMarkdownResponse, setHasProcessedMarkdownResponse] =
    useState(false)
  const setLocked = useDrupalStore((state) => state.setLocked)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const viewportKey = useDrupalStore((state) => state.viewportKey)
  const setViewportKey = useDrupalStore((state) => state.setViewportKey)
  const isAuthenticated = useAuthenticated()
  const [toggleAdvOpt, setToggleAdvOpt] = useState(false)
  const [checked, setChecked] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [isAuthorSoftLock, setIsAuthorSoftLock] = useState(false)
  const [toggleCheck, setToggleCheck] = useState(false)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const drupalPreSaveQueue = useDrupalStore((state) => state.drupalPreSaveQueue)
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
  const removePane = useDrupalStore((state) => state.removePane)
  const removeMarkdown = useDrupalStore((state) => state.removeMarkdown)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const thisPane = allPanes[uuid]
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const updateMarkdown = useDrupalStore((state) => state.updateMarkdown)
  const setPane = useDrupalStore((state) => state.setPane)
  const [settingPane, setSettingPane] = useState(false)
  const allPanesSlugs = Object.keys(allPanes).map((e) => {
    return allPanes[e].slug
  })
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
  const [state, setState] = useState(payload.initialState)
  const [formState, setFormState] = useState(payload.initialFormState)
  const deepEqual = require(`deep-equal`)

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
          ...(paneExtra || {}),
        }
      })
      setToggleCheck(true)
    },
    [
      allFiles,
      allMarkdown,
      state.hiddenPane,
      stateHeldBeliefs,
      stateImpressions,
      stateLivePreviewMarkdown?.markdownArray,
      stateLivePreviewMarkdown?.markdownId,
      stateLivePreviewMarkdown.paneFragmentId,
      statePaneFragments,
      stateWithheldBeliefs,
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
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: [statePaneFragments],
      hiddenPane: state.hiddenPane,
    }
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
  }

  const toggleBelief = (mode: string) => {
    if (
      (mode === `held` && !Object.keys(stateHeldBeliefs).length) ||
      (mode === `withheld` && !Object.keys(stateWithheldBeliefs).length)
    )
      addBelief(mode)
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
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: Object.values(statePaneFragments),
      hiddenPane: state.hiddenPane,
    }
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
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
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: Object.values(statePaneFragments),
      hiddenPane: state.hiddenPane,
    }
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
  }

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
      setToggleCheck(true)
    }
  }

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (
      name === `slug` &&
      value !== thisPane.slug &&
      allPanesSlugs.includes(value)
    ) {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setFormState((prev: any) => {
        return { ...prev, slugCollision: true }
      })
    } else {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setFormState((prev: any) => {
        return {
          ...prev,
          slugCollision: false,
        }
      })
    }
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: Object.values(statePaneFragments),
      hiddenPane: name === `hiddenPane` ? value : state?.hiddenPane,
    }
    setState((prev: any) => {
      return {
        ...prev,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
    })
    setToggleCheck(true)
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
    })
    setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
    setStateLivePreview(initialStateLivePreview)
    setStatePaneFragments(initialStatePaneFragments)
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: Object.values(initialStatePaneFragments),
      hiddenPane: state.hiddenPane,
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
    })
    setStateLivePreviewMarkdown(initialStateLivePreviewMarkdown)
    setStateLivePreview(initialStateLivePreview)
    setStatePaneFragments(initialStatePaneFragments)
    const impressionsPayload = stateImpressions?.title
      ? {
          [stateImpressions.id]: stateImpressions,
        }
      : null
    const newOptionsPayload = {
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: Object.values(initialStatePaneFragments),
      hiddenPane: state.hiddenPane,
    }
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
      /^(\d+)(?:(?:-(\d+))?)--(ul|li|p|h1|h2|h3|h4|h5|h6|code|img|parent)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpOverride =
      /^override---(\d+)(?:(?:-(\d+))?)--(li|p|h1|h2|h3|h4|h5|h6|code|img|parent)--([^-]+)(?:-)?(mobile|tablet|desktop)?/
    const regexpModal = /^(modal)--([^-]+)(?:-)?(mobile|tablet|desktop|remove)?/
    const regexpBgColour = /^(bgColour)--(.*)/
    const regexpImage = /^(image)-(\d+)--(.*)/
    const regexpAdd =
      /^(add)---(\d+)(?:(?:-(\d+))?)--(ul|li|p|h1|h2|h3|h4|h5|h6|code|img|parent)$/
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
        : [`img`, `ul`, `ol`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(
              tag,
            )
          ? tagsCount.filter((e: string) => e === tag).length
          : tag === `li`
            ? stateLivePreviewMarkdown.listItemsLookup[nth][childNth]
            : null
    const thisNth =
      tag === null
        ? null
        : [`img`, `ul`, `ol`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(
              tag,
            )
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
          classNames: reduced.classNames,
        }
        regenerateState(newOptionsPayload)
        break
      }

      case `addStyle`: {
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
        const hasOverride =
          stateLivePreview.childClasses[tag][thisNth][selector][3]
        const hasOverridePayload =
          typeof statePaneFragments[paneFragmentId].optionsPayload
            .classNamesPayload[tag].override !== `undefined`
        const hasOverrideSelectorPayload =
          hasOverridePayload &&
          typeof statePaneFragments[paneFragmentId].optionsPayload
            .classNamesPayload[tag].override[selector] !== `undefined`
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
              .classNamesPayload[tag],
          }
          delete current.override[selector][childGlobalNth]
          if (Object.keys(current.override[selector]).length === 0) {
            delete current.override
            delete current.count
          }
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            [tag]: current,
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
              .classNamesPayload[tag].classes,
          }
          delete current[selector]
          const newClassNamesPayload = {
            ...statePaneFragments[paneFragmentId].optionsPayload
              .classNamesPayload,
            [tag]: {
              ...statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[tag],
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
          const newValue = value === `=` ? null : value
          const tuple = !hasOverride
            ? [
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag].classes[selector],
              ]
            : hasOverrideSelectorPayload &&
                typeof statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag].override[selector][childGlobalNth] !==
                  `undefined`
              ? [
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload[tag].override[selector][childGlobalNth],
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
                .classNamesPayload[tag] !== `undefined` &&
              statePaneFragments[paneFragmentId].optionsPayload
                .classNamesPayload[tag].override === `undefined`
            const alreadyExists = noPayload
              ? false
              : !noPayload &&
                typeof statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag].override !== `undefined` &&
                statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag].override[selector] !== `undefined`
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
            ].includes(tag)
              ? stateLivePreviewMarkdown.markdownTags.filter(
                  (n: string) => n === tag,
                ).length
              : tag === `li`
                ? Object.keys(stateLivePreviewMarkdown.listItems).length
                : tag === `img`
                  ? Object.keys(stateLivePreviewMarkdown.images).length
                  : tag === `code`
                    ? Object.keys(stateLivePreviewMarkdown.codeItems).length
                    : 1
            const newClassNamesPayload = alreadyExists
              ? {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload,
                  [tag]: {
                    ...statePaneFragments[paneFragmentId].optionsPayload
                      .classNamesPayload[tag],
                    override: {
                      ...statePaneFragments[paneFragmentId].optionsPayload
                        .classNamesPayload[tag].override,
                      [selector]: {
                        ...statePaneFragments[paneFragmentId].optionsPayload
                          .classNamesPayload[tag].override[selector],
                        [childGlobalNth]: thisTuple,
                      },
                    },
                  },
                }
              : {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload,
                  [tag]: {
                    ...statePaneFragments[paneFragmentId].optionsPayload
                      .classNamesPayload[tag],
                    count: overrideCount,
                    override: {
                      ...statePaneFragments[paneFragmentId].optionsPayload
                        .classNamesPayload[tag].override,
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
              [tag]: {
                ...statePaneFragments[paneFragmentId].optionsPayload
                  .classNamesPayload[tag],
                classes: {
                  ...statePaneFragments[paneFragmentId].optionsPayload
                    .classNamesPayload[tag].classes,
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
        // toggle override
        const hasOverride =
          stateLivePreview.childClasses[tag][thisNth][selector][3]
        if (!hasOverride) {
          const newStateLivePreview = {
            ...stateLivePreview,
            childClasses: {
              ...stateLivePreview.childClasses,
              [tag]: {
                ...stateLivePreview.childClasses[tag],
                [thisNth]: {
                  ...stateLivePreview.childClasses[tag][thisNth],
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
            classNames: reduced.classNames,
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
            classNames: reduced.classNames,
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
                hasBgColour: value,
                optionsPayloadString: JSON.stringify(newOptionsPayload),
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
                hasBgColour: `#ffffff`,
                hasBgColourId: newPaneFragmentId,
                optionsPayloadString: JSON.stringify(newOptionsPayload),
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
        setToggleCheck(true)
        break
      }

      case `updateLinkPayload`: {
        const thisNth = result[1]
        const thisChildNth = result[4]
        const thisGlobalNth =
          stateLivePreviewMarkdown.linksLookup[thisNth][thisChildNth]
        const thisLink = stateLivePreviewMarkdown.links[thisGlobalNth]
        const markdown = stateLivePreviewMarkdown.markdownArray[thisNth]
        const regexpLink = `(.*?)[(${thisLink.value})]((${thisLink.target}))(.*)`
        if (selector === `title`) {
          const prematch = markdown.match(regexpLink)
          const postmatch = prematch[1].replace(
            `[${thisLink.value}]`,
            `[${value}](${thisLink.target}`,
          )
          const newValue = `${postmatch}${prematch[4]}`
          const newMarkdownArray = [...stateLivePreviewMarkdown.markdownArray]
          newMarkdownArray[thisNth] = `${newValue}\n`
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
          setToggleCheck(true)
        } else if (selector === `callback`) {
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
              newOptionsPayload.classNamesPayload = newClassNamesPayload
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

  const handleEditMarkdown = (markdownArray: any) => {
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
            if (stateLivePreviewMarkdown.links[g].target === f.url) found = true
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
    setToggleCheck(true)
  }

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
                [`parentpre`, `parentpost`].includes(mode))
            ? insertTag
            : [`ul`, `ol`].includes(stateLivePreviewMarkdown.markdownTags[nth])
              ? `li`
              : stateLivePreviewMarkdown.markdownTags[nth]
    const actualTag = stateLivePreviewMarkdown.markdownTags[nth]
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
    const overrideTag = [`ul`, `ol`].includes(thisTag) ? `li` : thisTag
    const thisClassNamesPayload =
      typeof classNamesPayload[overrideTag] !== `undefined`
        ? classNamesPayload[overrideTag]
        : null
    const hasOverride = typeof thisClassNamesPayload?.override !== `undefined`
    // must update paneFragment optionsPayload classNamesPayload and regenerate classNames [all]
    let thisOverride = {}

    if (hasOverride) {
      let overrideNth = 0
      Object.keys(stateLivePreviewMarkdown.listItems).forEach((e) => {
        const checkVal = stateLivePreviewMarkdown.listItems[e]
        if (
          overrideTag === `li` &&
          [`ul`, `ol`].includes(thisTag) &&
          [`pre`, `parentpre`].includes(mode) &&
          checkVal.parentNth < nth
        )
          overrideNth++
        if (
          overrideTag === `li` &&
          [`ul`, `ol`].includes(thisTag) &&
          [`post`, `parentpost`].includes(mode) &&
          checkVal.parentNth <= nth
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
    const newClassNamesPayload = {
      ...classNamesPayload,
      [overrideTag]: newThisClassNamesPayload,
    }
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
    }
    const markdownBody = newMarkdownArray?.join(`\n`)

    // then pass through original generateState fn
    const thisMarkdown = {
      [markdownId]: {
        ...allMarkdown[markdownId],
        markdownBody,
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
    setToggleCheck(true)
  }

  const handleSubmit = (e: any) => {
    // FIX
    e.preventDefault()
    if (
      !deepEqual(state, payloadLast.initialState) ||
      !deepEqual(statePaneFragments, payloadLast.initialStatePaneFragments) ||
      !deepEqual(stateImpressions, payloadLast.initialStateImpressions) ||
      !deepEqual(stateHeldBeliefs, payloadLast.initialStateHeldBeliefs) ||
      !deepEqual(stateWithheldBeliefs, payloadLast.initialStateWithheldBeliefs)
    ) {
      const thisMarkdownId = stateLivePreviewMarkdown?.markdownId
      let wait = false
      if (thisMarkdownId) {
        const thisMarkdown = allMarkdown[thisMarkdownId]
        const markdown = markdownPayload(statePaneFragments, allMarkdown)
        if (typeof markdown[0] !== `undefined`) {
          setDrupalPreSaveQueue(
            markdown[0],
            `markdown`,
            thisMarkdownId,
            thisMarkdown.drupalNid,
          )
          wait = true
        }
      }
      const pane = panePayload(
        state,
        uuid,
        statePaneFragments,
        stateImpressions,
        stateHeldBeliefs,
        stateWithheldBeliefs,
      )
      setDrupalPreSaveQueue(pane, `pane`, uuid, thisPane.drupalNid, wait)
      setLocked(false)
      setHasProcessedMarkdownResponse(false)
      setFormState((prev: any) => {
        return { ...prev, submitted: true, saving: true }
      })
    }
  }

  useEffect(() => {
    let showMessage = false
    Object.keys(drupalResponse).forEach((e) => {
      if (e === uuid) {
        removeDrupalResponse(e)
        showMessage = true
        // setToggleCheck(true)
      }
    })
    if (showMessage)
      document?.getElementById(`message`)?.scrollIntoView({
        behavior: `auto`,
        block: `end`,
      })
  }, [drupalResponse, uuid, removeDrupalResponse])

  useEffect(() => {
    if (formState.saving && !settingPane) {
      const markdownId = stateLivePreviewMarkdown?.markdownId
      let success = false
      if (process.env.NODE_ENV === `development` || openDemoEnabled) {
        setSettingPane(true)
        // bypass drupal save; update pane in state
        if (markdownId) {
          const newMarkdown = {
            ...allMarkdown[markdownId],
            id: markdownId,
            markdownBody: stateLivePreviewMarkdown.markdownArray.join(`\n`),
            title: `Copy for ${state.title}`,
            slug: state.slug,
          }
          setTimeout(() => updateMarkdown(newMarkdown), 0)
        }
        const newPane = {
          id: uuid,
          drupalNid: thisPane.drupalNid,
          heightOffsetDesktop: state.heightOffsetDesktop,
          heightOffsetMobile: state.heightOffsetMobile,
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
        if (state.markdown) newPane.relationships.markdown = state.markdown
        setTimeout(() => setPane(uuid, newPane), 0)
        setSettingPane(false)
        success = true
        setFormState((prev: any) => {
          return { ...prev, submitted: true, saving: false, success }
        })
        setPayloadLast({
          initialState: state,
          initialStatePaneFragments: statePaneFragments,
          initialStateImpressions: stateImpressions,
          initialStateHeldBeliefs: stateHeldBeliefs,
          initialStateWithheldBeliefs: stateWithheldBeliefs,
        })
        setToggleCheck(true)
      } else {
        // save to Drupal
        if (
          typeof drupalPreSaveQueue?.markdown !== `undefined` &&
          Object.keys(drupalPreSaveQueue?.markdown).length
        ) {
          setDrupalSaveNode(
            drupalPreSaveQueue.markdown[markdownId].payload,
            `markdown`,
            markdownId,
            drupalPreSaveQueue.markdown[markdownId].drupalNid,
          )
          removeDrupalPreSaveQueue(markdownId, `markdown`)
        }

        if (
          !hasProcessedMarkdownResponse &&
          markdownId &&
          typeof drupalResponse[markdownId] !== `undefined`
        ) {
          if (allMarkdown[markdownId].drupalNid === -1) {
            // this is a new markdown; replace initial uuid with one from Drupal
            const newMarkdown = { ...allMarkdown[markdownId] }
            newMarkdown.id = drupalResponse[markdownId].data.id
            newMarkdown.drupalNid =
              drupalResponse[markdownId].data.attributes.drupal_internal__nid
            setTimeout(() => updateMarkdown(newMarkdown), 0)
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
              thisPane.drupalNid,
              true,
              newMarkdown.id,
              markdownId,
            )
          }
          removeDrupalResponse(markdownId)
          setHasProcessedMarkdownResponse(true)
        }

        if (
          typeof drupalPreSaveQueue?.pane !== `undefined` &&
          Object.keys(drupalPreSaveQueue?.pane).length &&
          (!drupalPreSaveQueue.pane[uuid].wait ||
            (hasProcessedMarkdownResponse &&
              drupalPreSaveQueue.pane[uuid].wait))
        ) {
          const newMarkdownId = drupalPreSaveQueue.pane[uuid].markdownId
          if (newMarkdownId !== thisPane.relationships.markdown[0]) {
            const fullOptionsPayload = ParseOptions(state.optionsPayloadString)
            const currentOptionsPayload =
              fullOptionsPayload.paneFragmentsPayload
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
              drupalNid: thisPane.drupalNid,
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
                ...thisPane.relationships,
                markdown: [newMarkdownId],
              },
              slug: state.slug,
              title: state.title,
            }
            setPane(uuid, newPane)
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
          setDrupalSaveNode(
            drupalPreSaveQueue.pane[uuid].payload,
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
            setTimeout(() => removeMarkdown(thisUuid), 500)
          }
          removeDrupalPreSaveQueue(uuid, `pane`)
        }

        if (typeof drupalResponse[uuid] !== `undefined`) {
          if (thisPane.drupalNid === -1) {
            const newPaneId = drupalResponse[uuid].data.id
            const newPane = {
              ...thisPane,
              drupalNid:
                drupalResponse[uuid].data.attributes.drupal_internal__nid,
            }
            setPane(newPaneId, newPane)
            setTimeout(() => setThisUuid(newPaneId), 0)
            handleReplacePane(uuid, newPaneId)
            setTimeout(() => removePane(uuid), 500)
          }
          success = true
          removeDrupalResponse(uuid)
          setFormState((prev: any) => {
            return { ...prev, submitted: true, saving: false, success }
          })
          setPayloadLast({
            initialState: state,
            initialStatePaneFragments: statePaneFragments,
            initialStateImpressions: stateImpressions,
            initialStateHeldBeliefs: stateHeldBeliefs,
            initialStateWithheldBeliefs: stateWithheldBeliefs,
          })
          setToggleCheck(true)
        }
      }
    }
  }, [
    uuid,
    setThisUuid,
    thisPane,
    allMarkdown,
    stateLivePreviewMarkdown,
    formState.saving,
    hasProcessedMarkdownResponse,
    drupalResponse,
    drupalPreSaveQueue,
    setDrupalPreSaveQueue,
    setDrupalSaveNode,
    setPane,
    updateMarkdown,
    settingPane,
    removePane,
    removeMarkdown,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    regenerateState,
    handleReplacePane,
    stateLivePreviewMarkdown.paneFragmentId,
    payloadLast,
    state,
    stateHeldBeliefs,
    stateImpressions,
    statePaneFragments,
    stateWithheldBeliefs,
    openDemoEnabled,
  ])

  const isAuthorCheck = useMemo(() => {
    if (
      process.env.NODE_ENV !== `development` &&
      !openDemoEnabled &&
      !checked
    ) {
      const payload = {
        endpoint: `uuid-by-node/${thisPane.drupalNid}`,
        method: `GET`,
      }
      if (isAuthenticated) setDrupalQueue(thisPane.drupalNid, payload)
      setIsAuthorSoftLock(true)
      return true
    }
    return false
  }, [
    isAuthenticated,
    checked,
    thisPane.drupalNid,
    setDrupalQueue,
    setIsAuthorSoftLock,
    openDemoEnabled,
  ])

  useEffect(() => {
    if (!checked && isAuthorSoftLock && isAuthorCheck && drupalResponse) {
      if (
        Object.keys(drupalResponse).length &&
        drupalResponse[thisPane.drupalNid]
      ) {
        const data = drupalResponse[thisPane.drupalNid]
        if (data) {
          data.forEach((e: any) => {
            if (e?.uuid === oauthDrupalUuid) setIsAuthor(true)
          })
          removeDrupalResponse(thisPane.drupalNid)
          setChecked(true)
        }
      }
    }
  }, [
    checked,
    isAuthorCheck,
    isAuthorSoftLock,
    oauthDrupalUuid,
    drupalResponse,
    thisPane.drupalNid,
    removeDrupalResponse,
  ])

  useEffect(() => {
    if (toggleCheck) {
      const hasChanges =
        !deepEqual(state, payloadLast.initialState) ||
        !deepEqual(statePaneFragments, payloadLast.initialStatePaneFragments) ||
        //! deepEqual(stateImpressions, payload.initialStateImpressions) ||
        !deepEqual(stateHeldBeliefs, payloadLast.initialStateHeldBeliefs) ||
        !deepEqual(
          stateWithheldBeliefs,
          payloadLast.initialStateWithheldBeliefs,
        )
      setLocked(hasChanges)
      setFormState((prev: any) => {
        return {
          ...prev,
          changes: hasChanges,
        }
      })
    }
    setToggleCheck(false)
  }, [
    setLocked,
    isAuthor,
    formState,
    deepEqual,
    state,
    payload,
    stateImpressions,
    stateHeldBeliefs,
    stateWithheldBeliefs,
    statePaneFragments,
    toggleCheck,
    payloadLast.initialState,
    payloadLast.initialStateHeldBeliefs,
    payloadLast.initialStatePaneFragments,
    payloadLast.initialStateWithheldBeliefs,
    openDemoEnabled,
  ])

  /* aaa bbb ccc ddd
  console.log(`state`, state)
  console.log(`stateLivePreview`, stateLivePreview)
  console.log(`stateLivePreviewMarkdown`, stateLivePreviewMarkdown)
  console.log(`statePaneFragments`, statePaneFragments)
  console.log(`payload`, JSON.parse(state.optionsPayloadString))
  console.log(`pane`, uuid, allPanes[uuid])
  if (stateLivePreviewMarkdown?.markdownId)
    console.log(
      `markdown`,
      stateLivePreviewMarkdown.markdownId,
      allMarkdown[stateLivePreviewMarkdown.markdownId],
    )
   */

  return (
    <>
      <section className="relative bg-slate-50">
        <div className="w-full xl:max-w-screen-2xl flex justify-between">
          <div className="font-bold text-xl font-action">
            {state.title}
            {isAuthor ? (
              <span title="You have edit privileges" className="ml-3">
                <LockOpenIcon className="w-4 h-4 inline" />
              </span>
            ) : null}
            {formState.changes ? (
              <span className="pl-2 text-sm font-main font-normal text-myblue">
                [unsaved changes]
              </span>
            ) : null}
          </div>
          <button
            className="block text-sm leading-6 text-black font-bold underline underline-offset-2 hover:text-myorange"
            onClick={() => setToggleAdvOpt(!toggleAdvOpt)}
          >
            {toggleAdvOpt ? `Hide Advanced Options` : `Show Advanced Options`}
          </button>
        </div>
      </section>
      {toggleAdvOpt ? (
        <section className="relative bg-slate-50">
          <div className="w-full px-6 pt-2 max-w-screen-2xl mt-2 ml-2">
            <form className="max-w-3xl" id="editPane">
              <div className="space-y-12">
                <div className="border-b border-black/10 pb-12">
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="title"
                        className="text-sm leading-6 text-black inline-block"
                      >
                        Title
                      </label>
                      {state.title.length === 0 ? (
                        <span
                          className="text-myorange ml-1 inline-block"
                          title="required"
                        >
                          {` `}
                          *required
                        </span>
                      ) : null}
                      <div className="mt-2">
                        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                          <input
                            type="text"
                            name="title"
                            id="title"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                            value={state.title}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="slug"
                        className="text-sm leading-6 text-black inline-block"
                      >
                        Slug{` `}
                      </label>
                      {state.slug.length === 0 ? (
                        <>
                          {` `}
                          <span
                            className="text-myorange ml-1 inline-block"
                            title="required"
                          >
                            *required
                          </span>
                        </>
                      ) : null}
                      {formState.slugCollision ? (
                        <span className="text-myorange ml-2 inline-block">
                          {` `} (that slug is already taken)
                        </span>
                      ) : null}
                      <div className="mt-2">
                        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                          <input
                            type="text"
                            name="slug"
                            id="slug"
                            pattern="[a-zA-Z\-]+"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                            value={state.slug}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-full">
                      <p className="block text-sm leading-6 text-black font-bold">
                        Options Payload
                      </p>
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.hasCodeHook}
                            onChange={() =>
                              handleChange({
                                target: {
                                  name: `hasCodeHook`,
                                  value: !state.hasCodeHook,
                                },
                              })
                            }
                            className={classNames(
                              state.hasCodeHook
                                ? `bg-myorange`
                                : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.hasCodeHook
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Code Hook
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              Deploy custom code to your story fragments
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      {state.hasCodeHook ? (
                        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="codeHookTarget"
                              className="block text-sm leading-6 text-black"
                            >
                              Target (allowed: a-z, A-Z, or h5p)
                            </label>
                            <div>
                              <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                <input
                                  type="text"
                                  name="codeHookTarget"
                                  id="codeHookTarget"
                                  pattern="([A-Za-z]|h5p)+"
                                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                  value={state.codeHookTarget}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          {state.codeHookTarget === `h5p` ? (
                            <>
                              <div className="sm:col-span-4">
                                <label
                                  htmlFor="codeHookTarget"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Target Url
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="text"
                                      name="codeHookTargetUrl"
                                      id="codeHookTargetUrl"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                      value={state.codeHookTargetUrl}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="codeHookHeight"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Height (number only, of pixels)
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="number"
                                      name="codeHookHeight"
                                      id="codeHookHeight"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                      value={state.codeHookHeight}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="codeHookWidth"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Width (number only, of pixels)
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="number"
                                      name="codeHookWidth"
                                      id="codeHookWidth"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                      value={state.codeHookWidth}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.overflowHidden}
                            onChange={() =>
                              handleChange({
                                target: {
                                  name: `overflowHidden`,
                                  value: !state.overflowHidden,
                                },
                              })
                            }
                            className={classNames(
                              state.hiddenPane ? `bg-myorange` : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.overflowHidden
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Overflow Hidden
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              CSS property to avoid horizontal scroll
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.hiddenPane}
                            onChange={() =>
                              handleChange({
                                target: {
                                  name: `hiddenPane`,
                                  value: !state.hiddenPane,
                                },
                              })
                            }
                            className={classNames(
                              state.hiddenPane ? `bg-myorange` : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.hiddenPane
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Hidden Pane
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              Engagement with this pane is <strong>not</strong>
                              {` `}
                              stored in knowledge graph
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.hasHeldBeliefsPayload}
                            onChange={() => toggleBelief(`held`)}
                            className={classNames(
                              state.hasHeldBeliefsPayload
                                ? `bg-myorange`
                                : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.hasHeldBeliefsPayload
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Display on Matching Belief
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              This pane will only display to visitors if the
                              hold a matching belief
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      {state.hasHeldBeliefsPayload
                        ? Object.keys(stateHeldBeliefs).map((e, index) => (
                            <EditBelief
                              key={`${e}-${index}`}
                              selector={e}
                              value={stateHeldBeliefs[e]}
                              index={index}
                              mode="held"
                              handleChangeBelief={handleChangeBelief}
                            />
                          ))
                        : null}
                      {state.hasHeldBeliefsPayload ? (
                        <div className="pl-4 mb-6">
                          <button
                            type="button"
                            className="text-xs"
                            onClick={() => addBelief(`held`)}
                          >
                            Add
                          </button>
                        </div>
                      ) : null}
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.hasWithheldBeliefsPayload}
                            onChange={() => toggleBelief(`withheld`)}
                            className={classNames(
                              state.hasWithheldBeliefsPayload
                                ? `bg-myorange`
                                : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.hasWithheldBeliefsPayload
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Exclude on Matching Belief
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              This pane will only display to visitors{` `}
                              <strong>who do not hold</strong> the matching
                              belief
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      {state.hasWithheldBeliefsPayload
                        ? Object.keys(stateWithheldBeliefs).map((e, index) => (
                            <EditBelief
                              selector={e}
                              key={`${e}-${index}`}
                              value={stateWithheldBeliefs[e]}
                              index={index}
                              mode="withheld"
                              handleChangeBelief={handleChangeBelief}
                            />
                          ))
                        : null}
                      {state.hasWithheldBeliefsPayload ? (
                        <div className="pl-4 mb-6">
                          <button
                            type="button"
                            className="text-xs"
                            onClick={() => addBelief(`withheld`)}
                          >
                            Add
                          </button>
                        </div>
                      ) : null}
                      <div className="mt-2 sm:col-span-full">
                        <Switch.Group
                          as="div"
                          className="flex items-center justify-between"
                        >
                          <Switch
                            checked={state.hasImpressions}
                            onChange={() => {
                              if (!state.hasImpressions)
                                handleChange({
                                  target: {
                                    name: `hasImpressions`,
                                    value: !state.hasImpressions,
                                  },
                                })
                            }}
                            className={classNames(
                              state.hasImpressions
                                ? `bg-myorange`
                                : `bg-slate-300`,
                              `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                state.hasImpressions
                                  ? `translate-x-5`
                                  : `translate-x-0`,
                                `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                              )}
                            />
                          </Switch>
                          <span className="ml-4 flex flex-grow flex-col">
                            <Switch.Label
                              as="span"
                              className="text-sm leading-6 text-black"
                              passive
                            >
                              Impression
                            </Switch.Label>
                            <Switch.Description
                              as="span"
                              className="text-sm text-slate-500"
                            >
                              Place a call-to-action on this pane
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                        {state.hasImpressions ? (
                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                            <div className="sm:col-span-4">
                              <label
                                htmlFor="title"
                                className="block text-sm leading-6 text-black"
                              >
                                Title
                              </label>
                              <div>
                                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                  <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.title}
                                    onChange={handleChangeImpression}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-2">
                              <label
                                htmlFor="buttonText"
                                className="block text-sm leading-6 text-black"
                              >
                                Title (32 chars)
                              </label>
                              <div>
                                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                  <input
                                    type="text"
                                    name="buttonText"
                                    id="buttonText"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.buttonText}
                                    onChange={handleChangeImpression}
                                    maxLength={32}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-6">
                              <label
                                htmlFor="actionsLisp"
                                className="block text-sm leading-6 text-black"
                              >
                                Action Lisp
                              </label>
                              <div>
                                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                  <input
                                    type="text"
                                    name="actionsLisp"
                                    id="actionsLisp"
                                    pattern="[A-Za-z\(\) ]+"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.actionsLisp}
                                    onChange={handleChangeImpression}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-6">
                              <label
                                htmlFor="body"
                                className="block text-sm leading-6 text-black"
                              >
                                Body Text (142 chars)
                              </label>
                              <div>
                                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                  <input
                                    type="text"
                                    name="body"
                                    id="body"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.body}
                                    onChange={handleChangeImpression}
                                    maxLength={140}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="hidden">
                              <label htmlFor="id">ID (autogenerated)</label>
                              <input
                                type="text"
                                name="id"
                                id="id"
                                value={stateImpressions.id}
                                readOnly
                              />
                              <label htmlFor="parentId">
                                ID of parent pane
                              </label>
                              <input
                                type="text"
                                name="parentId"
                                id="parentId"
                                value={stateImpressions.parentId}
                                readOnly
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleChangeImpression({
                                  target: { name: `title`, value: `` },
                                })
                                handleChangeImpression({
                                  target: { name: `body`, value: `` },
                                })
                                handleChangeImpression({
                                  target: { name: `buttonText`, value: `` },
                                })
                                handleChangeImpression({
                                  target: { name: `actionsLisp`, value: `` },
                                })
                                handleChange({
                                  target: {
                                    name: `hasImpressions`,
                                    value: false,
                                  },
                                })
                              }}
                            >
                              {` `}
                              REMOVE
                            </button>
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                        <div className="sm:col-span-1 sm:col-start-1">
                          <p className="block text-sm leading-6 text-black font-bold">
                            Height Ratio
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioDesktop"
                            className="block text-sm leading-6 text-black"
                          >
                            Desktop
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioDesktop"
                              id="heightRatioDesktop"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioDesktop}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioTablet"
                            className="block text-sm leading-6 text-black"
                          >
                            Tablet
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioTablet"
                              id="heightRatioTablet"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioTablet}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioMobile"
                            className="block text-sm leading-6 text-black"
                          >
                            Mobile
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioMobile"
                              id="heightRatioMobile"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioMobile}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1 sm:col-start-1">
                          <p className="block text-sm leading-6 text-black font-bold">
                            Height Offset (number of pixels)
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetDesktop"
                            className="block text-sm leading-6 text-black"
                          >
                            Desktop
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetDesktop"
                              id="heightOffsetDesktop"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetDesktop}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetTablet"
                            className="block text-sm leading-6 text-black"
                          >
                            Tablet
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetTablet"
                              id="heightOffsetTablet"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetTablet}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetMobile"
                            className="block text-sm leading-6 text-black"
                          >
                            Mobile
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetMobile"
                              id="heightOffsetMobile"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetMobile}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-start-1 sm:col-span-full">
                      <p className="block text-sm leading-6 text-black font-bold">
                        Pane Fragments
                      </p>
                      {statePaneFragments &&
                      Object.keys(statePaneFragments).length !== 0 ? (
                        Object.keys(statePaneFragments).map((e) => {
                          return (
                            <EditFormPaneFragment
                              key={e}
                              state={statePaneFragments[e]}
                              handleChange={handleChangePaneFragment}
                            />
                          )
                        })
                      ) : (
                        <span className="text-xs font-action">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      <div className="mt-6 flex items-center justify-start gap-x-6">
        <button
          type="button"
          className={
            formState.changes
              ? `rounded-md bg-mydarkgrey px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange`
              : `text-sm font-bold leading-6 text-black`
          }
          onClick={() => {
            setLocked(false)
            handleToggle(``)
          }}
        >
          {formState.changes ? <span>Cancel</span> : <span>Close</span>}
        </button>
        {!formState.slugCollision &&
        state.title.length &&
        state.slug.length &&
        formState.changes ? (
          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-md bg-myorange px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-myblue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
          >
            Save
          </button>
        ) : null}
      </div>
      <div id="message" className="mt-6 flex items-center justify-end gap-x-6">
        {formState.success ? (
          <Message className="text-xl text-myorange pb-12">
            <p>Changes have been saved</p>
          </Message>
        ) : null}
      </div>

      <section className="relative my-12">
        <RenderPaneLive
          uuid={uuid}
          handlers={{
            handleEditMarkdown,
            handleMutateMarkdown,
            handleChangeEditInPlace,
            handleChange,
          }}
          previewPayload={{
            state,
            statePaneFragments,
            stateImpressions,
            stateLivePreview,
            stateLivePreviewMarkdown,
            stateHeldBeliefs,
            stateWithheldBeliefs,
            allMarkdown,
            viewportKey,
            setViewportKey,
          }}
          toggleCheck={toggleCheck}
        />
      </section>
    </>
  )
}

export default EditFormPane
