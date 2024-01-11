// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../stores/drupal'
import StoryFragmentForm from './StoryFragmentForm'
import {
  storyFragmentPayload,
  tractStackPayload,
} from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages, IEditFlags } from '../../types'

const StoryFragmentState = ({
  uuid,
  payload,
  flags,
  fn,
}: {
  uuid: string
  payload: any
  flags: IEditFlags
  fn: { setEditStage: Function }
}) => {
  const apiBase = process.env.DRUPAL_APIBASE
  const { setEditStage } = fn
  const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const setEmbeddedEdit = useDrupalStore((state) => state.setEmbeddedEdit)
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [insertNewPane, setInsertNewPane] = useState(``)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.initialState)
  const [slugCollision, setSlugCollision] = useState(false)
  const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  const [updateStoryFragmentPayload, setUpdateStoryFragmentPayload]: any =
    useState([])
  const [updateTractStackPayload, setUpdateTractStackPayload]: any = useState(
    [],
  )
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  const removeStoryFragment = useDrupalStore(
    (state) => state.removeStoryFragment,
  )
  const setStoryFragment = useDrupalStore((state) => state.setStoryFragment)
  const setTractStack = useDrupalStore((state) => state.setTractStack)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisStoryFragment = allStoryFragments[uuid]
  const thisTractStack = useDrupalStore(
    (state) => state.allTractStacks[thisStoryFragment?.tractstack],
  )
  const drupalPreSaveQueue = useDrupalStore((state) => state.drupalPreSaveQueue)
  const removeDrupalPreSaveQueue = useDrupalStore(
    (state) => state.removeDrupalPreSaveQueue,
  )
  const setDrupalDeleteNode = useDrupalStore(
    (state) => state.setDrupalDeleteNode,
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
  const storyFragmentId = {
    id: uuid,
    title: thisStoryFragment?.title,
    slug: thisStoryFragment?.slug,
    tractStackId: thisStoryFragment?.tractstack,
    tractStackTitle: thisTractStack?.title,
    tractStackSlug: thisTractStack?.slug,
  }
  const allStoryFragmentSlugs = Object.keys(allStoryFragments)
    .map((e) => {
      if (e && typeof allStoryFragments[e] !== `undefined`)
        return allStoryFragments[e].slug
      return null
    })
    .filter((e) => e)
  const hasContextPanes = thisStoryFragment?.contextPanes
    ? Object.keys(thisStoryFragment?.contextPanes).length > 0
    : false

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name, value } = e.target as HTMLInputElement
    if (
      value !== thisStoryFragment.slug &&
      allStoryFragmentSlugs.includes(value)
    )
      setSlugCollision(true)
    else setSlugCollision(false)
    const validateSlug = (v: string) => {
      const re1 = /^[a-z]/
      const re2 = /^[a-z][a-z0-9-]+$/
      if (v.length === 0) return ``
      const match = v.length === 1 ? re1.test(v) : re2.test(v)
      if (match) return v
      return state.slug
    }
    const thisValue =
      name !== `slug` ? value : validateSlug(value.toLowerCase())
    if (thisValue !== null) {
      setState((prev: any) => {
        return { ...prev, [name]: thisValue }
      })
      setToggleCheck(true)
    }
  }

  const handleInsertPane = (offset: number, paneId?: string) => {
    // FIX
    const newPaneId = !paneId ? uuidv4() : paneId
    const newPanes = [
      ...state.panes.slice(0, offset),
      newPaneId,
      ...state.panes.slice(offset),
    ]
    setState((prev: any) => {
      return {
        ...prev,
        panes: newPanes,
      }
    })
    if (!paneId) {
      const newPane = {
        id: newPaneId,
        drupalNid: -1,
        title: `Untitled`,
        slug: ``,
      }
      updatePanes(newPane)
      setInsertNewPane(newPaneId)
    }
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

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setSaveStage(SaveStages.PrepareSave)
  }

  const handleDelete = () => {
    setEditStage(EditStages.PreDeleteUpdateAffectedNode)
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
          drupalNid: thisStoryFragment?.drupalNid,
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
            thisStoryFragment?.drupalNid,
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
        setSaveStage(SaveStages.StoryFragmentUpdateAffectedNodes)
        break

      case SaveStages.StoryFragmentUpdateAffectedNodes: {
        const thisUuid = newUuid === `` ? uuid : newUuid
        const newStoryFragments =
          thisTractStack.storyFragments.length === 0
            ? [thisUuid]
            : [...thisTractStack?.storyFragments, thisUuid]
        const newTractStack = {
          ...thisTractStack,
          storyFragments: newStoryFragments,
        }
        setUpdateTractStackPayload([
          { id: thisStoryFragment?.tractstack, payload: newTractStack },
        ])
        if (!flags.isOpenDemo) {
          const tractStack = tractStackPayload(
            newTractStack,
            thisStoryFragment?.tractstack,
          )
          setDrupalPreSaveQueue(
            tractStack,
            `tractstack`,
            thisStoryFragment?.tractstack,
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
        setNavLocked(false)
        if (newUuid) {
          const goto = newUuid
          setNewUuid(``)
          navigate(`/storykeep/storyfragments/${goto}`)
        } else {
          setToggleCheck(true)
        }
        break
    }
  }, [
    saveStage,
    setNavLocked,
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
    thisTractStack,
  ])

  // on delete, update tract stack, remove storyFragment
  useEffect(() => {
    if (flags.editStage === EditStages.PreDeleteUpdateAffectedNode) {
      const newStoryFragments = thisTractStack.storyFragments
        .map((e: string) => (e !== uuid ? e : null))
        .filter((n: string | null) => n)
      const newTractStack = {
        ...thisTractStack,
        storyFragments: newStoryFragments,
      }
      setUpdateTractStackPayload([
        { id: thisStoryFragment?.tractstack, payload: newTractStack },
      ])
      const tractStack = tractStackPayload(
        newTractStack,
        thisStoryFragment?.tractstack,
      )
      setDrupalPreSaveQueue(
        tractStack,
        `tractstack`,
        thisStoryFragment?.tractstack,
        thisTractStack.drupalNid,
      )
      setEditStage(EditStages.PreDeleteUpdatingAffectedNode)
    }
  }, [
    flags.editStage,
    setEditStage,
    setDrupalPreSaveQueue,
    thisStoryFragment?.tractstack,
    thisTractStack,
    uuid,
  ])

  // delete from from drupal
  useEffect(() => {
    if (flags.editStage === EditStages.Delete) {
      setDrupalDeleteNode(`story_fragment`, uuid)
      setEditStage(EditStages.Deleting)
    } else if (
      flags.editStage === EditStages.Deleting &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      setEditStage(EditStages.Deleted)
    }
  }, [flags.editStage, uuid, drupalResponse, setDrupalDeleteNode, setEditStage])

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
        thisStoryFragment?.drupalNid,
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
      if (thisStoryFragment?.drupalNid === -1) {
        const newStoryFragmentId = drupalResponse[uuid].data.id
        const newStoryFragment = {
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
          title: state.title,
          socialImagePath: state?.socialImagePath || ``,
          slug: state.slug,
          contextPanes: state.contextPanes,
          tailwindBgColour: state?.tailwindBgColour || ``,
          tractstack: state.tractstack,
          panes: state.panes,
          menu: state.menu,
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
    state?.contextPanes,
    state?.menu,
    state?.panes,
    state?.slug,
    state?.socialImagePath,
    state?.tailwindBgColour,
    state?.title,
    state?.tractstack,
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

  // save tractstack for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      (saveStage === SaveStages.PreSavingTractStack ||
        flags.editStage === EditStages.PreDeleteUpdatingAffectedNode) &&
      typeof drupalPreSaveQueue?.tractstack !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.tractstack).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.tractstack[thisStoryFragment?.tractstack].payload,
        `tractstack`,
        thisStoryFragment?.tractstack,
        thisTractStack.drupalNid,
      )
      removeDrupalPreSaveQueue(thisStoryFragment?.tractstack, `tractstack`)
      if (saveStage === SaveStages.PreSavingTractStack)
        setSaveStage(SaveStages.PreSavedTractStack)
      else setEditStage(EditStages.PreDeleteUpdatedAffectedNode)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      (saveStage === SaveStages.PreSavedTractStack ||
        flags.editStage === EditStages.PreDeleteUpdatedAffectedNode) &&
      typeof drupalResponse[thisStoryFragment?.tractstack] !== `undefined`
    ) {
      removeDrupalResponse(thisStoryFragment?.tractstack)
      if (saveStage === SaveStages.PreSavedTractStack)
        setSaveStage(SaveStages.SavingTractStack)
      else setEditStage(EditStages.Delete)
    }
    // on delete
    if (
      !flags.isOpenDemo &&
      flags.editStage === EditStages.PreDeleteUpdateAffectedNode &&
      typeof drupalResponse[thisStoryFragment?.tractstack] !== `undefined`
    ) {
      removeDrupalResponse(thisStoryFragment?.tractstack)
      setEditStage(EditStages.Delete)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    setEditStage,
    flags.editStage,
    drupalPreSaveQueue?.tractstack,
    thisStoryFragment?.tractstack,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    thisTractStack,
  ])

  // update tractstack on save or delete
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
    } else if (
      flags.editStage === EditStages.PreDeleteUpdateAffectedNode &&
      updateTractStackPayload.length
    ) {
      updateTractStackPayload.forEach((e: any) => {
        setTractStack(e.id, e.payload)
      })
      setUpdateTractStackPayload([])
      setEditStage(EditStages.Delete)
    }
  }, [
    saveStage,
    flags.editStage,
    setEditStage,
    updateTractStackPayload,
    setTractStack,
  ])

  // handle insert new pane
  useEffect(() => {
    if (insertNewPane !== ``) {
      const newPaneId = insertNewPane
      setInsertNewPane(``)
      setEmbeddedEdit(newPaneId, `panes`, uuid, `storyfragments`, state)
      navigate(`/storykeep/panes/${newPaneId}`)
    }
  }, [insertNewPane, setEmbeddedEdit, uuid, state])

  // set initial state
  useEffect(() => {
    if (
      flags.editStage === EditStages.Activated &&
      saveStage === SaveStages.Booting
    ) {
      if (typeof embeddedEdit?.parentState !== `undefined`) {
        setState(embeddedEdit.parentState)
        setEmbeddedEdit(null, null, null, undefined, undefined, undefined)
        setToggleCheck(true)
      } else setSaveStage(SaveStages.NoChanges)
    }
  }, [
    flags.editStage,
    saveStage,
    setSaveStage,
    setEmbeddedEdit,
    embeddedEdit.parentState,
  ])

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
        hasContextPanes,
        slugCollision,
        storyFragmentId,
        drupalNid: thisStoryFragment?.drupalNid,
      }}
      fn={{
        handleChange,
        handleInsertPane,
        handleReorderPane,
        handleSubmit,
        setSaved,
        handleDelete,
      }}
    />
  )
}

export default StoryFragmentState
