// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
// import { navigate } from 'gatsby'
// import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import ResourceForm from './ResourceForm'
import { EditStages, SaveStages } from '../../types'

const ResourceState = ({ uuid, payload, flags }: any) => {
  // const apiBase = process.env.DRUPAL_APIBASE
  // const [lastSavedState, setLastSavedState] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.state)
  const [slugCollision, setSlugCollision] = useState(false)
  // const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  console.log(toggleCheck)
  // const deepEqual = require(`deep-equal`)
  // const [updateTractStackPayload, setUpdateTractStackPayload ]: any =
  //  useState([])
  // const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const allResources = useDrupalStore((state) => state.allResources)
  const thisResource = allResources[uuid]
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
      }}
    />
  )
}

export default ResourceState
