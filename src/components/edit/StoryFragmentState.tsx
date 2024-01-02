// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import StoryFragmentForm from './StoryFragmentForm'
import { EditStages, SaveStages } from '../../types'

const StoryFragmentState = ({ uuid, payload, flags }: any) => {
  // const apiBase = process.env.DRUPAL_APIBASE
  const [lastSavedState /* setLastSavedState */] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.state)
  const [slugCollision, setSlugCollision] = useState(false)
  // const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  // const allPanes = useDrupalStore((state) => state.allPanes)
  // const allFiles = useDrupalStore((state) => state.allFiles)
  // const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  // const drupalPreSaveQueue = useDrupalStore((state) => state.drupalPreSaveQueue)
  // const removeDrupalPreSaveQueue = useDrupalStore(
  //  (state) => state.removeDrupalPreSaveQueue,
  // )
  // const setDrupalPreSaveQueue = useDrupalStore(
  //  (state) => state.setDrupalPreSaveQueue,
  // )
  // const setDrupalSaveNode = useDrupalStore((state) => state.setDrupalSaveNode)
  // const removeDrupalResponse = useDrupalStore(
  //  (state) => state.removeDrupalResponse,
  // )
  // const setCleanerQueue = useDrupalStore((state) => state.setCleanerQueue)
  // const cleanerQueue = useDrupalStore((state) => state.cleanerQueue)
  // const removeCleanerQueue = useDrupalStore((state) => state.removeCleanerQueue)
  // const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  // const setStoryFragment = useDrupalStore((state) => state.setStoryFragment)
  // const updateStoryFragments = useDrupalStore(
  //  (state) => state.updateStoryFragments,
  // )
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisStoryFragment = allStoryFragments[uuid]
  // const thisTractStack = useDrupalStore(
  //  (state) => state.allTractStacks[thisStoryFragment.tractstack],
  // )
  const allStoryFragmentSlugs = Object.keys(allStoryFragments).map((e) => {
    return allStoryFragments[e].slug
  })
  const isEmpty = false // must configure; todo

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

  /*
  const handleReplacePane = (oldPaneId: string, paneId: string) => {
    let offset = 0
    state.panes.forEach((e: string, idx: number) => {
      if (e === oldPaneId) offset = idx
    })
    const newPanes = [...state.panes]
    newPanes[offset] = paneId
    setState((prev: any) => {
      return { ...prev, panes: newPanes }
    })
  }
*/

  const handleInsertPane = (offset: number, paneId?: string) => {
    // FIX
    let uuid = ``
    if (!paneId) {
      uuid = uuidv4()
      const newPane = {
        id: uuid,
        drupalNid: -1,
        title: `Untitled`,
        slug: ``,
      }
      updatePanes(newPane)
    } else uuid = paneId
    setState((prev: any) => {
      return {
        ...prev,
        panes: [
          ...state.panes.slice(0, offset),
          uuid,
          ...state.panes.slice(offset),
        ],
      }
    })
    console.log(`handleInsertPane, goto edit`, uuid)
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
      if (hasChanges && saveStage === SaveStages.NoChanges)
        setSaveStage(SaveStages.UnsavedChanges)
      else if (!hasChanges && saveStage === SaveStages.UnsavedChanges)
        setSaveStage(SaveStages.NoChanges)
    }
  }, [
    toggleCheck,
    deepEqual,
    payload.initialState,
    saveStage,
    state,
    lastSavedState.initialState,
  ])

  // handle stages
  useEffect(() => {
    console.log(`--saveStage`, SaveStages[saveStage])

    switch (saveStage) {
      case SaveStages.NoChanges:
        break
    }
  }, [saveStage])

  // useEffects for saving to drupal go here

  useEffect(() => {
    if (
      flags?.editStage === EditStages.Booting &&
      (!state || Object.keys(state).length === 0)
    ) {
      setState(payload.initialState)
    }
    if (
      flags.editStage === EditStages.Booting &&
      state &&
      Object.keys(state).length &&
      saveStage === SaveStages.Booting
    ) {
      setSaveStage(SaveStages.NoChanges)
    }
  }, [flags.editStage, saveStage, setSaveStage, payload.initialState, state])

  if (saveStage < SaveStages.NoChanges)
    return <div className="h-6 bg-myblue w-full" />

  return (
    <StoryFragmentForm
      uuid={uuid}
      payload={{
        state,
      }}
      flags={{ ...flags, saveStage, saved, isEmpty, slugCollision }}
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
