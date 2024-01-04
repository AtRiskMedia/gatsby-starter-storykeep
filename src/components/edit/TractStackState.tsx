// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import TractStackForm from './TractStackForm'
import { tractStackPayload } from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages } from '../../types'

const TractStackState = ({ uuid, payload, flags }: any) => {
  const apiBase = process.env.DRUPAL_APIBASE
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.state)
  const [slugCollision, setSlugCollision] = useState(false)
  const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  const [updateTractStackPayload, setUpdateTractStackPayload]: any = useState(
    [],
  )
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  const setTractStack = useDrupalStore((state) => state.setTractStack)
  const updateStoryFragments = useDrupalStore(
    (state) => state.updateStoryFragments,
  )
  const thisTractStack = allTractStacks[uuid]
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
  const allTractStacksSlugs = Object.keys(allTractStacks)
    .map((e) => {
      if (e && typeof allTractStacks[e] !== `undefined`)
        return allTractStacks[e].slug
      return null
    })
    .filter((e) => e)

  const handleAdd = (e: any) => {
    switch (e) {
      case `pane`: {
        const newUuid = uuidv4()
        const newPane = {
          id: newUuid,
          drupalNid: -1,
          title: `Untitled`,
          slug: ``,
        }
        updatePanes(newPane)
        navigate(`/storykeep/panes/${newUuid}`)
        break
      }

      case `storyfragment`: {
        alert(`won't work yet; must ask for tractstackId and link on creation`)
        const newUuid = uuidv4()
        const newStoryFragment = {
          id: newUuid,
          drupalNid: -1,
          title: `Untitled`,
          slug: ``,
        }
        updateStoryFragments(newStoryFragment)
        navigate(`/storykeep/storyfragments/${newUuid}`)
        break
      }

      case `tractstack`:
        break

      case `resource`:
        break
    }
  }

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (value !== thisTractStack.slug && allTractStacksSlugs.includes(value))
      setSlugCollision(true)
    else setSlugCollision(false)
    setState((prev: any) => {
      return { ...prev, [name]: value }
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
    console.log(`--saveStage`, SaveStages[saveStage])
    switch (saveStage) {
      case SaveStages.NoChanges:
        Object.keys(cleanerQueue).forEach((e: string) => {
          if (cleanerQueue[e] === `tractstack` && e !== uuid) {
            // removeStoryFragment(e)
            console.log(`remove tractstack e`)
            removeCleanerQueue(e)
          }
        })
        break

      case SaveStages.PrepareSave: {
        setSaveStage(SaveStages.PrepareNodes)
        break
      }

      case SaveStages.PrepareNodes: {
        const newTractStack = {
          drupalNid: thisTractStack.drupalNid,
          title: state.title,
          socialImagePath: state?.socialImagePath || ``,
          slug: state.slug,
          storyfragments: state.storyfragments,
          contextPanes: state.contextPanes,
        }
        setUpdateTractStackPayload([{ id: uuid, payload: newTractStack }])
        if (!flags.isOpenDemo) {
          const tractStack = tractStackPayload(state, uuid)
          setDrupalPreSaveQueue(
            tractStack,
            `tractstack`,
            uuid,
            thisTractStack.drupalNid,
          )
        }
        setSaveStage(SaveStages.SaveTractStack)
        break
      }

      case SaveStages.SaveTractStack: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingTractStack)
        else setSaveStage(SaveStages.SavingTractStack)
        break
      }

      case SaveStages.SavedTractStack:
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
          navigate(`/storykeep/tractstacks/${goto}`)
        } else {
          setToggleCheck(true)
        }
        break
    }
  }, [
    saveStage,
    cleanerQueue,
    removeCleanerQueue,
    setDrupalPreSaveQueue,
    uuid,
    newUuid,
    apiBase,
    flags.isOpenDemo,
    state,
    thisTractStack,
  ])

  // save storyfragment for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingTractStack &&
      typeof drupalPreSaveQueue?.tractstack !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.tractstack).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.tractstack[uuid].payload,
        `tractstack`,
        uuid,
        thisTractStack.drupalNid,
      )
      removeDrupalPreSaveQueue(uuid, `tractstack`)
      setSaveStage(SaveStages.PreSavedTractStack)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedTractStack &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      if (thisTractStack.drupalNid === -1) {
        const newTractStackId = drupalResponse[uuid].data.id
        const newTractStack = {
          ...thisTractStack,
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
        }
        setUpdateTractStackPayload([
          { id: newTractStackId, payload: newTractStack },
        ])
        setCleanerQueue(uuid, `tractstack`)
        setNewUuid(newTractStackId)
      }
      removeDrupalResponse(uuid)
      setSaveStage(SaveStages.SavingTractStack)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    uuid,
    drupalPreSaveQueue?.tractstack,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    thisTractStack,
  ])

  // update tractstack on save
  useEffect(() => {
    if (
      saveStage === SaveStages.SavingTractStack &&
      updateTractStackPayload.length
    ) {
      updateTractStackPayload.forEach((e: any) => {
        setTractStack(e.id, e.payload)
      })
      setUpdateTractStackPayload([])
      setSaveStage(SaveStages.SavedTractStack)
    }
  }, [saveStage, updateTractStackPayload, setTractStack])

  // set initial state
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

  if (saveStage < SaveStages.NoChanges) return null

  return (
    <TractStackForm
      uuid={uuid}
      payload={{
        state,
      }}
      flags={{
        ...flags,
        saveStage,
        saved,
        slugCollision,
      }}
      fn={{
        setSaved,
        handleChange,
        handleSubmit,
        handleAdd,
      }}
    />
  )
}

export default TractStackState
