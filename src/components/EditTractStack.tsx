// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useMemo } from 'react'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { IEdit } from '../types'
import { useDrupalStore } from '../stores/drupal'
import Message from './Message'

const EditTractStack = ({ uuid }: IEdit) => {
  const setLocked = useDrupalStore((state) => state.setLocked)
  const isAuthenticated = useAuthenticated()
  const apiBase = process.env.DRUPAL_APIBASE
  const [checked, setChecked] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [isAuthorSoftLock, setIsAuthorSoftLock] = useState(false)
  const [toggleCheck, setToggleCheck] = useState(false)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const updateTractStacks = useDrupalStore((state) => state.updateTractStacks)
  const thisTractStack = allTractStacks[uuid]
  const allTractStacksSlugs = Object.keys(allTractStacks).map((e) => {
    return allTractStacks[e].slug
  })
  const setSelected = useDrupalStore((state) => state.setSelected)
  const setSelectedCollection = useDrupalStore(
    (state) => state.setSelectedCollection,
  )
  const hasStoryFragments =
    Object.keys(thisTractStack.storyFragments).length > 0
  const hasContextPanes = Object.keys(thisTractStack.contextPanes).length > 0
  const initialState = useMemo(() => {
    return {
      title: thisTractStack.title,
      slug: thisTractStack.slug,
      socialImagePath: thisTractStack?.socialImagePath || ``,
    }
  }, [
    thisTractStack.title,
    thisTractStack.slug,
    thisTractStack.socialImagePath,
  ])
  const initialFormState = {
    submitted: false,
    success: false,
    changes: false,
    slugCollision: false,
  }
  const [state, setState] = useState({ ...initialState })
  const [formState, setFormState] = useState({ ...initialFormState })
  const deepEqual = require(`deep-equal`)
  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (value !== thisTractStack.slug && allTractStacksSlugs.includes(value)) {
      setState((prev: any) => {
        return { ...prev, [name]: value }
      })
      setFormState((prev: any) => {
        return { ...prev, slugCollision: true }
      })
    } else {
      setState((prev) => {
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
  const handleSubmit = (e: any) => {
    e.preventDefault()
    let success = false
    if (!deepEqual(state, initialState)) {
      const tractStack = {
        type: `node--tractstack`,
        id: uuid,
        attributes: {
          title: state.title,
          field_slug: state.slug,
          field_social_image_path: state.socialImagePath,
        },
      }
      const payload = {
        endpoint: `${apiBase}/node/tractstack/${uuid}`,
        method: `PATCH`,
        body: {
          data: tractStack,
        },
      }
      isAuthenticated && setDrupalQueue(uuid, payload)
      const newTractStack = {
        ...thisTractStack,
        id: uuid,
      }
      if (state.title !== thisTractStack.title)
        newTractStack.title = state.title
      if (state.slug !== thisTractStack.slug) newTractStack.slug = state.slug
      if (state.socialImagePath !== thisTractStack.socialImagePath)
        newTractStack.socialImagePath = state.socialImagePath
      updateTractStacks(newTractStack)
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
    if (process.env.NODE_ENV !== `development` && !checked) {
      const payload = {
        endpoint: `uuid-by-node/${thisTractStack.drupalNid}`,
        method: `GET`,
      }
      if (isAuthenticated) setDrupalQueue(thisTractStack.drupalNid, payload)
      setIsAuthorSoftLock(true)
      return true
    }
    return false
  }, [
    isAuthenticated,
    checked,
    thisTractStack.drupalNid,
    setDrupalQueue,
    setIsAuthorSoftLock,
  ])

  useEffect(() => {
    if (!checked && isAuthorSoftLock && isAuthorCheck && drupalResponse) {
      if (
        Object.keys(drupalResponse).length &&
        drupalResponse[thisTractStack.drupalNid]
      ) {
        const data = drupalResponse[thisTractStack.drupalNid]
        if (data) {
          data.forEach((e: any) => {
            if (e?.uuid === oauthDrupalUuid) setIsAuthor(true)
          })
          removeDrupalResponse(thisTractStack.drupalNid)
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
    thisTractStack.drupalNid,
    removeDrupalResponse,
  ])

  useEffect(() => {
    if (toggleCheck) {
      const hasChanges = !deepEqual(state, initialState)
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
    initialState,
    toggleCheck,
  ])

  return (
    <section className="relative">
      <div className="text-xl font-action mb-12 w-full xl:max-w-screen-2xl">
        <span className="font-bold">{state.title}</span>
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
      <div className="bg-slate-50 w-full p-6 max-w-screen-2xl mt-2 ml-2">
        <form className="max-w-3xl" id="editTractStack" onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-black/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6">
                <div className="xs:col-span-full">
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
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black focus:ring-0 xs:text-sm xs:leading-6"
                        value={state.title}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="xs:col-span-2">
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
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        pattern="[a-zA-Z\-]+"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                        value={state.slug}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="xs:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm leading-6 text-black"
                  >
                    Social Image Path
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                      <input
                        type="text"
                        name="socialImagePath"
                        id="socialImagePath"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black focus:ring-0 xs:text-sm xs:leading-6"
                        value={state.socialImagePath}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="xs:col-span-full">
                  <p className="block text-sm leading-6 text-black">
                    Story Fragments
                  </p>
                  {hasStoryFragments ? (
                    thisTractStack.storyFragments?.map((e: any) => {
                      return (
                        <div key={e} className="mt-2 flex items-center gap-x-3">
                          {allStoryFragments[e].title}
                          <button
                            type="button"
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                            onClick={() => {
                              setSelected(e)
                              setSelectedCollection(`storyfragment`)
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

                <div className="xs:col-span-full">
                  <p className="block text-sm leading-6 text-black">
                    Context Panes
                  </p>
                  {hasContextPanes ? (
                    thisTractStack.contextPanes?.map((e: any) => {
                      return (
                        <div key={e} className="mt-2 flex items-center gap-x-3">
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
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                className={
                  formState.changes
                    ? `rounded-md bg-mydarkgrey px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange`
                    : `text-sm font-bold leading-6 text-black`
                }
                onClick={() => {
                  if (
                    process.env.NODE_ENV === `development` ||
                    !formState.changes ||
                    window.confirm(`You have unsaved changes. Proceed?`) ===
                      true
                  ) {
                    setLocked(false)
                    setSelected(``)
                  }
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
          </div>
        </form>
      </div>
    </section>
  )
}

export default EditTractStack
