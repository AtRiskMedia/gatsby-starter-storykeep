// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../stores/drupal'
import ResourceForm from './ResourceForm'
import { resourcePayload } from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages } from '../../types'

const ResourceState = ({ uuid, payload, flags }: any) => {
  const apiBase = process.env.DRUPAL_APIBASE
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.state)
  const [slugCollision, setSlugCollision] = useState(false)
  const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  const [updateResourcePayload, setUpdateResourcePayload]: any = useState([])
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const allResources = useDrupalStore((state) => state.allResources)
  const setResource = useDrupalStore((state) => state.allResources)
  const thisResource = allResources[uuid]
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
  const allResourceSlugs = Object.keys(allResources)
    .map((e) => {
      if (e && typeof allResources[e] !== `undefined`)
        return allResources[e].slug
      return null
    })
    .filter((e) => e)

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (value !== thisResource.slug && allResourceSlugs.includes(value)) {
      setState((prev: any) => {
        return { ...prev, [name]: thisResource.slug }
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
          if (cleanerQueue[e] === `resource` && e !== uuid) {
            // removeStoryFragment(e)
            console.log(`remove resource e`)
            removeCleanerQueue(e)
          }
        })
        break

      case SaveStages.PrepareSave: {
        setSaveStage(SaveStages.PrepareNodes)
        break
      }

      case SaveStages.PrepareNodes: {
        const newResource = {
          drupalNid: thisResource.drupalNid,
          title: state.title,
          slug: state.slug,
          actionLisp: state?.actionLisp,
          categorySlug: state?.categorySlug,
          oneliner: state?.oneliner,
          optionsPayload: state?.optionsPayload,
        }
        setUpdateResourcePayload([{ id: uuid, payload: newResource }])
        if (!flags.isOpenDemo) {
          const resource = resourcePayload(state, uuid)
          setDrupalPreSaveQueue(
            resource,
            `resource`,
            uuid,
            thisResource.drupalNid,
          )
        }
        setSaveStage(SaveStages.SaveResource)
        break
      }

      case SaveStages.SaveResource: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingResource)
        else setSaveStage(SaveStages.SavingResource)
        break
      }

      case SaveStages.SavedResource:
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
          navigate(`/storykeep/resources/${goto}`)
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
    thisResource,
  ])

  // save storyfragment for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingResource &&
      typeof drupalPreSaveQueue?.resource !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.resource).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.resource[uuid].payload,
        `resource`,
        uuid,
        thisResource.drupalNid,
      )
      removeDrupalPreSaveQueue(uuid, `resource`)
      setSaveStage(SaveStages.PreSavedResource)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedResource &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      if (thisResource.drupalNid === -1) {
        const newResourceId = drupalResponse[uuid].data.id
        const newResource = {
          ...thisResource,
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
        }
        setUpdateResourcePayload([{ id: newResourceId, payload: newResource }])
        setCleanerQueue(uuid, `resource`)
        setNewUuid(newResourceId)
      }
      removeDrupalResponse(uuid)
      setSaveStage(SaveStages.SavingResource)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    uuid,
    drupalPreSaveQueue?.resource,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    thisResource,
  ])

  // update tractstack on save
  useEffect(() => {
    if (
      saveStage === SaveStages.SavingResource &&
      updateResourcePayload.length
    ) {
      updateResourcePayload.forEach((e: any) => {
        setResource(e.id, e.payload)
      })
      setUpdateResourcePayload([])
      setSaveStage(SaveStages.SavedResource)
    }
  }, [saveStage, updateResourcePayload, setResource])

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

  if (saveStage < SaveStages.NoChanges) return <p>Loading...</p>

  return (
    <ResourceForm
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
      }}
    />
  )
}

export default ResourceState
