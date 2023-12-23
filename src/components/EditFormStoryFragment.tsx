// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useMemo } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '@tractstack/helpers'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'
import { LockOpenIcon, BoltSlashIcon } from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid'

import { IEditForm } from '../types'
import { useDrupalStore } from '../stores/drupal'
import Message from './Message'
import RenderStoryFragment from './RenderStoryFragment'
import EditPane from './EditPane'

const EditFormStoryFragment = ({
  uuid,
  handleToggle,
  /* setThisUuid, */
  payload,
}: IEditForm) => {
  const [state, setState] = useState(payload.initialState)
  const [formState, setFormState] = useState(payload.initialFormState)
  const deepEqual = require(`deep-equal`)
  const setLocked = useDrupalStore((state) => state.setLocked)
  const isAuthenticated = useAuthenticated()
  const apiBase = process.env.DRUPAL_APIBASE
  const [checked, setChecked] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [isAuthorSoftLock, setIsAuthorSoftLock] = useState(false)
  const [editEnabled, setEditEnabled] = useState(false)
  const [editPaneEnabled, setEditPaneEnabled] = useState(``)
  const [toggleCheck, setToggleCheck] = useState(false)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const updatePanes = useDrupalStore((state) => state.updatePanes)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  // const setStoryFragment = useDrupalStore((state) => state.setStoryFragment)
  const updateStoryFragments = useDrupalStore(
    (state) => state.updateStoryFragments,
  )
  const thisStoryFragment = allStoryFragments[uuid]
  const thisTractStack = useDrupalStore(
    (state) => state.allTractStacks[thisStoryFragment.tractstack],
  )
  const allStoryFragmentSlugs = Object.keys(allStoryFragments).map((e) => {
    return allStoryFragments[e].slug
  })
  const setSelected = useDrupalStore((state) => state.setSelected)
  const setSelectedCollection = useDrupalStore(
    (state) => state.setSelectedCollection,
  )
  const hasContextPanes = Object.keys(thisStoryFragment.contextPanes).length > 0
  const hasPanes = Object.keys(thisStoryFragment.panes).length > 0

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
    setToggleCheck(true)
  }

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
    if (!paneId) setEditPaneEnabled(uuid)
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
    // FIX
    let success = false
    if (!deepEqual(state, payload.initialState)) {
      const relationships = (panes: string[]) => {
        if (!panes.length) return {}
        return {
          relationships: {
            field_panes: {
              data: panes.map((p: string) => {
                return {
                  type: `node--pane`,
                  id: p,
                }
              }),
            },
          },
        }
      }
      const storyFragment = {
        type: `node--story_fragment`,
        id: uuid,
        attributes: {
          title: state.title,
          field_slug: state.slug,
          field_social_image_path: state.socialImagePath,
          field_tailwind_background_colour: state?.tailwindBgColour || ``,
        },
        ...relationships(state.panes),
      }
      const payload = {
        endpoint: `${apiBase}/node/story_fragment/${uuid}`,
        method: `PATCH`,
        body: {
          data: storyFragment,
        },
      }
      if (process.env.NODE_ENV === `development` || openDemoEnabled)
        console.log(`skip setDrupalQueue`, uuid, payload)
      else isAuthenticated && setDrupalQueue(uuid, payload)
      const newStoryFragment = {
        ...thisStoryFragment,
        id: uuid,
        contextPanes: thisStoryFragment.contextPanes,
        tractstack: thisStoryFragment.tractstack,
        panes: thisStoryFragment.panes,
        menu: thisStoryFragment.menu,
      }
      if (state.title !== thisStoryFragment.title)
        newStoryFragment.title = state.title
      if (state.slug !== thisStoryFragment.slug)
        newStoryFragment.slug = state.slug
      if (state.tailwindBgColour !== thisStoryFragment.tailwindBgColour)
        newStoryFragment.tailwindBgColour = state.tailwindBgColour
      if (state.socialImagePath !== thisStoryFragment.socialImagePath)
        newStoryFragment.socialImagePath = state.socialImagePath
      updateStoryFragments(newStoryFragment)
      setLocked(false)
      success = true
    }
    setFormState((prev: any) => {
      return { ...prev, submitted: true, success }
    })
  }

  useEffect(() => {
    let showMessage = false
    Object.keys(drupalResponse).forEach((e) => {
      if (e === uuid) {
        removeDrupalResponse(e)
        showMessage = true
        setToggleCheck(true)
      }
    })
    if (showMessage)
      document?.getElementById(`message`)?.scrollIntoView({
        behavior: `auto`,
        block: `end`,
      })
  }, [drupalResponse, uuid, removeDrupalResponse])

  const isAuthorCheck = useMemo(() => {
    if (
      process.env.NODE_ENV !== `development` &&
      !openDemoEnabled &&
      !checked
    ) {
      const payload = {
        endpoint: `uuid-by-node/${thisStoryFragment.drupalNid}`,
        method: `GET`,
      }
      isAuthenticated && setDrupalQueue(thisStoryFragment.drupalNid, payload)
      setTimeout(() => setIsAuthorSoftLock(true), 0)
      return true
    }
    return false
  }, [
    isAuthenticated,
    checked,
    thisStoryFragment.drupalNid,
    setDrupalQueue,
    setIsAuthorSoftLock,
    openDemoEnabled,
  ])

  useEffect(() => {
    if (!checked && isAuthorSoftLock && isAuthorCheck && drupalResponse) {
      if (
        Object.keys(drupalResponse).length &&
        drupalResponse[thisStoryFragment.drupalNid]
      ) {
        const data = drupalResponse[thisStoryFragment.drupalNid]
        if (data) {
          data.forEach((e: any) => {
            if (e?.uuid === oauthDrupalUuid) setIsAuthor(true)
          })
          removeDrupalResponse(thisStoryFragment.drupalNid)
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
    thisStoryFragment.drupalNid,
    removeDrupalResponse,
  ])

  useEffect(() => {
    if (toggleCheck) {
      const hasChanges = !deepEqual(state, payload.initialState)
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
    state,
    deepEqual,
    payload.initialState,
    toggleCheck,
  ])

  return (
    <>
      <section className="relative">
        <div className="text-xl font-action mb-12 w-full xl:max-w-screen-2xl">
          <div className="font-bold">
            {state.title}
            {isAuthor ? (
              <span title="You have edit privileges" className="ml-3">
                <LockOpenIcon className="w-4 h-4 inline" />
              </span>
            ) : openDemoEnabled ? (
              <span
                title="Safe mode: saved changes cleared on reload"
                className="ml-3"
              >
                <BoltSlashIcon className="w-4 h-4 inline" />
              </span>
            ) : null}
            {formState.changes ? (
              <span className="pl-2 text-sm font-main font-normal text-myblue">
                [unsaved changes]
              </span>
            ) : null}
          </div>
          <div className="text-mydarkgrey font-main text-xs mt-2">
            part of tract stack:{` `}
            <span className="font-bold">{thisTractStack.title}</span>
          </div>
        </div>
        {!editPaneEnabled ? (
          <>
            <div className="mt-6 flex items-center justify-start gap-x-6">
              <span className="text-sm font-main text-myblue font-bold">
                Actions:{` `}
              </span>
              <button
                type="button"
                className={
                  formState.changes
                    ? `rounded-md bg-mydarkgrey px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange`
                    : `text-sm font-bold leading-6 text-black`
                }
                onClick={() => {
                  setLocked(false)
                  setSelected(``)
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
            <div
              id="message"
              className="mt-6 flex items-center justify-end gap-x-6"
            >
              {formState.success ? (
                <Message className="text-xl text-myorange pb-12">
                  <p>Changes have been saved</p>
                </Message>
              ) : null}
            </div>
            <div className="relative max-w-screen-2xl">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-slate-200" />
              </div>
            </div>

            <div className="relative flex items-center justify-between mt-2 py-2 max-w-screen-2xl">
              <span className="font-action pr-3 text-base font-bold leading-6 text-black">
                toggle advanced settings
              </span>
              <Switch
                checked={editEnabled}
                onChange={setEditEnabled}
                className={classNames(
                  editEnabled ? `bg-myorange` : `bg-slate-300`,
                  `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                )}
              >
                <span className="sr-only">Reveal edit form</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    editEnabled ? `translate-x-5` : `translate-x-0`,
                    `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                  )}
                />
              </Switch>
            </div>
            <div
              className={classNames(
                editEnabled ? `` : `hidden`,
                `bg-slate-50 w-full px-6 pt-2 max-w-screen-2xl mt-2 ml-2`,
              )}
            >
              <form
                className="max-w-3xl"
                id="editStoryFragment"
                onSubmit={handleSubmit}
              >
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
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="tailwindBgColour"
                          className="block text-sm leading-6 text-black"
                        >
                          Tailwind Background Colour
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="text"
                              name="tailwindBgColour"
                              id="tailwindBgColour"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              value={state.tailwindBgColour}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label
                          htmlFor="socialImagePath"
                          className="block text-sm leading-6 text-black"
                        >
                          Social Image Path{` `}
                          <span
                            className="text-myorange ml-1"
                            title="Optional. Must be manually added to /static in frontend."
                          >
                            *
                          </span>
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="text"
                              name="socialImagePath"
                              id="socialImagePath"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              value={state.socialImagePath}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-full">
                        <p className="block text-sm leading-6 text-black">
                          Panes
                        </p>
                        {hasPanes ? (
                          state.panes?.map((e: any) => (
                            <div
                              key={e}
                              className="mt-2 flex items-center gap-x-3"
                            >
                              {typeof allPanes[e] !== `undefined`
                                ? allPanes[e].title
                                : e}
                              <button
                                type="button"
                                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                                onClick={() => {
                                  setSelected(e)
                                  setSelectedCollection(`pane`)
                                }}
                              >
                                edit
                              </button>
                            </div>
                          ))
                        ) : (
                          <p>none</p>
                        )}
                      </div>

                      <div className="sm:col-span-full">
                        <p className="block text-sm leading-6 text-black">
                          Context Panes
                        </p>
                        {hasContextPanes ? (
                          state.contextPanes?.map((e: any) => {
                            return (
                              <div
                                key={e}
                                className="mt-2 flex items-center gap-x-3"
                              >
                                {allPanes[e].title}
                                <button
                                  type="button"
                                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                                  onClick={() => {
                                    setSelected(e)
                                    setSelectedCollection(`pane`)
                                  }}
                                >
                                  edit
                                </button>
                              </div>
                            )
                          })
                        ) : (
                          <p>none</p>
                        )}
                      </div>

                      <div className="sm:col-span-full">
                        <p className="block text-sm leading-6 text-black">
                          Menu
                        </p>
                        {state.menu ? (
                          <div
                            key={state.menu.id}
                            className="mt-2 flex items-center gap-x-3"
                          >
                            {state.menu.title}
                            <button
                              type="button"
                              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                              onClick={() => {
                                setSelected(state.menu)
                                setSelectedCollection(`menu`)
                              }}
                            >
                              edit
                            </button>
                          </div>
                        ) : (
                          <p>none</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <RenderStoryFragment
              uuid={uuid}
              state={state}
              tailwindBgColour={state.tailwindBgColour}
              setEditPaneEnabled={setEditPaneEnabled}
              editPaneEnabled={editPaneEnabled}
              handleInsertPane={handleInsertPane}
              handleReorderPane={handleReorderPane}
            />
          </>
        ) : (
          <>
            <div className="text-xs font-main mb-2">
              you are now editing this pane:
            </div>
            <EditPane
              uuid={editPaneEnabled}
              handleToggle={setEditPaneEnabled}
              handleReplacePane={handleReplacePane}
            />
          </>
        )}
      </section>
    </>
  )
}

export default EditFormStoryFragment
