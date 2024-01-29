// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../../stores/drupal'
import MenuForm from './MenuForm'
import { menuPayload } from '../../helpers/generateDrupalPayload'
import { EditStages, SaveStages, IEditResourceFlags } from '../../types'

const MenuState = ({
  uuid,
  payload,
  flags,
  fn,
}: {
  uuid: string
  payload: any
  flags: IEditResourceFlags
  fn: { setEditStage: Function }
}) => {
  const apiBase = process.env.DRUPAL_APIBASE
  const { setEditStage } = fn
  const [lastSavedState, setLastSavedState] = useState(payload)
  const [saved, setSaved] = useState(false)
  const [state, setState] = useState(payload.initialState)
  const [newUuid, setNewUuid] = useState(``)
  const [saveStage, setSaveStage] = useState(SaveStages.Booting)
  const [toggleCheck, setToggleCheck] = useState(false)
  const deepEqual = require(`deep-equal`)
  const [updateMenuPayload, setUpdateMenuPayload]: any = useState([])
  const setNavLocked = useDrupalStore((state) => state.setNavLocked)
  const allMenus = useDrupalStore((state) => state.allMenus)
  const setMenu = useDrupalStore((state) => state.setMenu)
  const thisMenu = allMenus[uuid]
  const drupalPreSaveQueue = useDrupalStore((state) => state.drupalPreSaveQueue)
  const removeDrupalPreSaveQueue = useDrupalStore(
    (state) => state.removeDrupalPreSaveQueue,
  )
  const setDrupalPreSaveQueue = useDrupalStore(
    (state) => state.setDrupalPreSaveQueue,
  )
  const setDrupalDeleteNode = useDrupalStore(
    (state) => state.setDrupalDeleteNode,
  )
  const setDrupalSaveNode = useDrupalStore((state) => state.setDrupalSaveNode)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const setCleanerQueue = useDrupalStore((state) => state.setCleanerQueue)
  const cleanerQueue = useDrupalStore((state) => state.cleanerQueue)
  const removeCleanerQueue = useDrupalStore((state) => state.removeCleanerQueue)
  const removeMenu = useDrupalStore((state) => state.removeMenu)
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)

  const handleChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name, value } = e.target as HTMLInputElement
    if (value !== null) {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setToggleCheck(true)
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSaveStage(SaveStages.PrepareSave)
  }

  const handleDelete = () => {
    setEditStage(EditStages.Delete)
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
    console.log(SaveStages[saveStage])
    switch (saveStage) {
      case SaveStages.NoChanges:
        Object.keys(cleanerQueue).forEach((e: string) => {
          if (cleanerQueue[e] === `menu` && e !== uuid) {
            removeMenu(e)
            removeCleanerQueue(e)
          }
        })
        break

      case SaveStages.PrepareSave: {
        setSaveStage(SaveStages.PrepareNodes)
        break
      }

      case SaveStages.PrepareNodes: {
        const newMenu = {
          drupalNid: thisMenu.drupalNid,
          title: state.title,
          theme: state?.theme,
          optionsPayload: state?.optionsPayload,
        }
        setUpdateMenuPayload([{ id: uuid, payload: newMenu }])
        if (!flags.isOpenDemo) {
          const menu = menuPayload(state, uuid)
          setDrupalPreSaveQueue(menu, `menu`, uuid, thisMenu.drupalNid)
        }
        setSaveStage(SaveStages.SaveMenu)
        break
      }

      case SaveStages.SaveMenu: {
        if (!flags.isOpenDemo) setSaveStage(SaveStages.PreSavingMenu)
        else setSaveStage(SaveStages.SavingMenu)
        break
      }

      case SaveStages.SavedMenu:
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
          navigate(`/storykeep/menus/${goto}`)
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
    removeMenu,
    setDrupalPreSaveQueue,
    uuid,
    newUuid,
    apiBase,
    flags.isOpenDemo,
    state,
    thisMenu,
  ])

  // delete from from drupal
  useEffect(() => {
    if (flags.editStage === EditStages.Delete) {
      setDrupalDeleteNode(`menu`, uuid)
      setEditStage(EditStages.Deleting)
    } else if (
      flags.editStage === EditStages.Deleting &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      setEditStage(EditStages.Deleted)
    }
  }, [flags.editStage, uuid, drupalResponse, setDrupalDeleteNode, setEditStage])

  // save menu for drupal
  useEffect(() => {
    // first pass save to drupal
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavingMenu &&
      typeof drupalPreSaveQueue?.menu !== `undefined` &&
      Object.keys(drupalPreSaveQueue?.menu).length
    ) {
      setDrupalSaveNode(
        drupalPreSaveQueue.menu[uuid].payload,
        `menu`,
        uuid,
        thisMenu.drupalNid,
      )
      removeDrupalPreSaveQueue(uuid, `menu`)
      setSaveStage(SaveStages.PreSavedMenu)
    }
    // second pass, intercept / process response, get uuid from Drupal for new node
    if (
      !flags.isOpenDemo &&
      saveStage === SaveStages.PreSavedMenu &&
      typeof drupalResponse[uuid] !== `undefined`
    ) {
      if (thisMenu.drupalNid === -1) {
        const newMenuId = drupalResponse[uuid].data.id
        const newMenu = {
          drupalNid: drupalResponse[uuid].data.attributes.drupal_internal__nid,
          title: drupalResponse[uuid].data.attributes?.title,
          optionsPayload: drupalResponse[uuid].data.attributes?.field_options,
          theme: drupalResponse[uuid].data.attributes?.field_theme,
        }
        setUpdateMenuPayload([{ id: newMenuId, payload: newMenu }])
        setCleanerQueue(uuid, `menu`)
        setNewUuid(newMenuId)
      }
      removeDrupalResponse(uuid)
      setSaveStage(SaveStages.SavingMenu)
    }
  }, [
    flags.isOpenDemo,
    saveStage,
    uuid,
    drupalPreSaveQueue?.menu,
    drupalResponse,
    removeDrupalPreSaveQueue,
    removeDrupalResponse,
    setCleanerQueue,
    setDrupalSaveNode,
    thisMenu,
  ])

  // update menu on save
  useEffect(() => {
    if (saveStage === SaveStages.SavingMenu && updateMenuPayload.length) {
      updateMenuPayload.forEach((e: any) => {
        setMenu(e.id, e.payload)
      })
      setUpdateMenuPayload([])
      setSaveStage(SaveStages.SavedMenu)
    }
  }, [saveStage, updateMenuPayload, setMenu])

  // set initial state
  useEffect(() => {
    if (
      flags.editStage === EditStages.Activated &&
      saveStage === SaveStages.Booting
    ) {
      setSaveStage(SaveStages.NoChanges)
    }
  }, [flags.editStage, saveStage, setSaveStage])

  if (saveStage < SaveStages.NoChanges) return null

  return (
    <MenuForm
      payload={{
        state,
      }}
      flags={{
        ...flags,
        saveStage,
        saved,
      }}
      fn={{
        handleChange,
        handleSubmit,
        handleDelete,
        setSaved,
      }}
    />
  )
}

export default MenuState
