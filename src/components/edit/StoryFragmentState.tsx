// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import StoryFragmentForm from './StoryFragmentForm'
import { storyFragmentPayload } from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages } from '../../types'

const StoryFragmentState = ({ uuid, payload, flags }: any) => {
  const apiBase = process.env.DRUPAL_APIBASE
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [insertNewPane, setInsertNewPane] = useState(``)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.state)
  const [slugCollision, setSlugCollision] = useState(false)
  const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  const [updateStoryFragmentPayload, setUpdateStoryFragmentPayload]: any =
    useState([])
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  const removeStoryFragment = useDrupalStore(
    (state) => state.removeStoryFragment,
  )
  const setStoryFragment = useDrupalStore((state) => state.setStoryFragment)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisStoryFragment = allStoryFragments[uuid]
  const thisTractStack = useDrupalStore(
    (state) => state.allTractStacks[thisStoryFragment.tractstack],
  )
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
  const setCleanerQueue = useDrupalStore((state) => state.setCleanerQueue)
  const cleanerQueue = useDrupalStore((state) => state.cleanerQueue)
  const removeCleanerQueue = useDrupalStore((state) => state.removeCleanerQueue)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const setEmbeddedEdit = useDrupalStore((state) => state.setEmbeddedEdit)
  const storyFragmentId = {
    id: uuid,
    title: thisStoryFragment.title,
    slug: thisStoryFragment.slug,
    tractStackId: thisStoryFragment.tractstack,
    tractStackTitle: thisTractStack.title,
    tractStackSlug: thisTractStack.slug,
  }
  const allStoryFragmentSlugs = Object.keys(allStoryFragments)
    .map((e) => {
      if (e && typeof allStoryFragments[e] !== `undefined`)
        return allStoryFragments[e].slug
      return null
    })
    .filter((e) => e)
  const isEmpty = thisStoryFragment.panes.length === 0
  const hasContextPanes = Object.keys(thisStoryFragment.contextPanes).length > 0

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (
      value !== thisStoryFragment.slug &&
      allStoryFragmentSlugs.includes(value)
    ) {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setSlugCollision(true)
    } else {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setSlugCollision(false)
    }
    setToggleCheck(true)
  }

  const handleInsertPane = (offset: number, paneId?: string) => {
    // FIX
    const newPaneId = !paneId ? uuidv4() : paneId
    const newPanes = [
      ...state.panes.slice(0, offset),
      newPaneId,
      ...state.panes.slice(offset),
    ]
    if (!paneId) {
      const newPane = {
        id: newPaneId,
        drupalNid: -1,
        title: `Untitled`,
        slug: ``,
      }
      updatePanes(newPane)
      setEmbeddedEdit(newPaneId, `panes`, uuid, `storyfragments`, newPanes)
      setInsertNewPane(newPaneId)
    }
    setState((prev: any) => {
      return {
        ...prev,
        panes: newPanes,
      }
    })
    setToggleCheck(true)
  }

  const handleReorderPane = (idx: number, direction: boolean | undefined) => {
    const newPanes = [...state.panes]
    if (typeof direction === `undefined`) {
      delete newPanes[idx]
    } else if (direction) {
      const pane = newPanes[idx]
      const otherPane = newPanes[idx + 1]
      newPanes[idx] = otherPane
      newPanes[idx + 1] = pane
    } else if (!direction) {
      const pane = newPanes[idx]
      const otherPane = newPanes[idx - 1]
      newPanes[idx] = otherPane
      newPanes[idx - 1] = pane
    }
    setState((prev: any) => {
      return {
        ...prev,
        panes: newPanes.filter((n) => n),
      }
    })
    setToggleCheck(true)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSaveStage(SaveStages.PrepareSave)
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
    payload.initialState,
    saveStage,
    state,
    setNavLocked,
    lastSavedState.initialState,
  ])

  // handle stages
  useEffect(() => {
    switch (saveStage) {
      case SaveStages.NoChanges:
        Object.keys(cleanerQueue).forEach((e: string) => {
          if (cleanerQueue[e] === `storyfragment` && e !== uuid) {
            removeStoryFragment(e)
            removeCleanerQueue(e)
          }
        })
        break

      case SaveStages.PrepareSave: {
        setSaveStage(SaveStages.PrepareNodes)
        break
      }

      case SaveStages.PrepareNodes: {
        const newStoryFragment = {
          drupalNid: thisStoryFragment.drupalNid,
          title: state.title,
          socialImagePath: state?.socialImagePath || ``,
          slug: state.slug,
          contextPanes: state.contextPanes,
          tailwindBgColour: state?.tailwindBgColour || ``,
          tractstack: state.tractstack,
          panes: state.panes,
          menu: state.menu,
        }
        setUpdateStoryFragmentPayload([{ id: uuid, payload: newStoryFragment }])
        if (!flags.isOpenDemo) {
          const storyFragment = storyFragmentPayload(state, uuid)
          setDrupalPreSaveQueue(
            storyFragment,
            `storyfragment`,
            uuid,
            thisStoryFragment.drupalNid,
          )
        }
        setSaveStage(SaveStages.SaveStoryFragment)
        break
      }

      case SaveStages.SaveStoryFragment: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingStoryFragment)
        else setSaveStage(SaveStages.SavingStoryFragment)
        break
      }

      case SaveStages.SavedStoryFragment:
        if (!flags.isOpenDemo)
          setSaveStage(SaveStages.StoryFragmentUpdateAffectedNodes)
        else setSaveStage(SaveStages.Success)
        break

      case SaveStages.StoryFragmentUpdateAffectedNodes:
        console.log(`todo StoryFragmentUpdateAffectedNodes`)
        setSaveStage(SaveStages.Success)
        break

      case SaveStages.Error:
        break

      case SaveStages.Success:
        setSaved(true)
        setLastSavedState({
          initialState: state,
        })
        setSaveStage(SaveStages.NoChanges)
        if (newUuid) {
          const goto = newUuid
          setNewUuid(``)
          navigate(`/storykeep/storyfragment/${goto}`)
        } else {
          setToggleCheck(true)
        }
        break
    }
  }, [
    saveStage,
    cleanerQueue,
    removeCleanerQueue,
    removeStoryFragment,
    setDrupalPreSaveQueue,
    uuid,
    newUuid,
    apiBase,
    flags.isOpenDemo,
    state,
    thisStoryFragment,
  ])

  // save storyfragment for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingStoryFragment &&
      typeof drupalPreSaveQueue?.storyfragment !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.storyfragment).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.storyfragment[uuid].payload,
        `story_fragment`,
        uuid,
        thisStoryFragment.drupalNid,
      )
      removeDrupalPreSaveQueue(uuid, `storyfragment`)
      setSaveStage(SaveStages.PreSavedStoryFragment)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedStoryFragment &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      if (thisStoryFragment.drupalNid === -1) {
        const newStoryFragmentId = drupalResponse[uuid].data.id
        const newStoryFragment = {
          ...thisStoryFragment,
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
        }
        setUpdateStoryFragmentPayload([
          { id: newStoryFragmentId, payload: newStoryFragment },
        ])
        setCleanerQueue(uuid, `storyfragment`)
        setNewUuid(newStoryFragmentId)
      }
      removeDrupalResponse(uuid)
      setSaveStage(SaveStages.SavingStoryFragment)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    uuid,
    drupalPreSaveQueue?.storyfragment,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    thisStoryFragment,
  ])

  // update storyFragment on save
  useEffect(() => {
    if (
      saveStage === SaveStages.SavingStoryFragment &&
      updateStoryFragmentPayload.length
    ) {
      updateStoryFragmentPayload.forEach((e: any) => {
        setStoryFragment(e.id, e.payload)
      })
      setUpdateStoryFragmentPayload([])
      setSaveStage(SaveStages.SavedStoryFragment)
    }
  }, [saveStage, updateStoryFragmentPayload, setStoryFragment])

  // handle insert new pane
  useEffect(() => {
    if (insertNewPane) {
      const newPaneId = insertNewPane
      setInsertNewPane(``)
      setEmbeddedEdit(newPaneId, `panes`, uuid, `storyfragments`, state.panes)
      navigate(`/storykeep/panes/${newPaneId}`)
    }
  }, [insertNewPane, setEmbeddedEdit, uuid, state?.panes])

  // set initial state
  useEffect(() => {
    if (
      Object.keys(payload.initialState).length > 0 &&
      flags?.editStage === EditStages.Booting &&
      (!state || Object.keys(state).length === 0)
    ) {
      if (embeddedEdit.parentPanes)
        setState({ ...payload.initialState, panes: embeddedEdit.parentPanes })
      else setState(payload.initialState)
    }
  }, [flags.editStage, payload.initialState, state, embeddedEdit?.parentPanes])
  useEffect(() => {
    if (
      flags.editStage === EditStages.Booting &&
      state &&
      Object.keys(state).length &&
      saveStage === SaveStages.Booting
    ) {
      setEmbeddedEdit(null, null, null, undefined, undefined, undefined)
      setSaveStage(SaveStages.NoChanges)
    }
  }, [flags.editStage, saveStage, setSaveStage, state, setEmbeddedEdit])

  if (saveStage < SaveStages.NoChanges) return null

  return (
    <StoryFragmentForm
      uuid={uuid}
      payload={{
        state,
      }}
      flags={{
        ...flags,
        saveStage,
        saved,
        isEmpty,
        hasContextPanes,
        slugCollision,
        storyFragmentId,
      }}
      fn={{
        handleChange,
        handleInsertPane,
        handleReorderPane,
        handleSubmit,
        setSaved,
      }}
    />
  )
}

export default StoryFragmentState
