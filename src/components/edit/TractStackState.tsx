// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import TractStackForm from './TractStackForm'
// import { storyFragmentPayload } from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages } from '../../types'

const TractStackState = ({ uuid, payload, flags }: any) => {
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
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  const updateStoryFragments = useDrupalStore(
    (state) => state.updateStoryFragments,
  )
  const thisTractStack = allTractStacks[uuid]
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
