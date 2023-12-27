// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useMemo } from 'react'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { IEdit } from '../types'
import { useDrupalStore } from '../stores/drupal'
import Message from './Message'

const EditResource = ({ uuid }: IEdit) => {
  const setLocked = useDrupalStore((state) => state.setLocked)
  const isAuthenticated = useAuthenticated()
  const deepEqual = require(`deep-equal`)
  const apiBase = process.env.DRUPAL_APIBASE
  const [checked, setChecked] = useState(false)
  const [isAuthor, setIsAuthor] = useState(false)
  const [isAuthorSoftLock, setIsAuthorSoftLock] = useState(false)
  const [toggleCheck, setToggleCheck] = useState(false)
  const oauthDrupalUuid = useDrupalStore((state) => state.oauthDrupalUuid)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const allResources = useDrupalStore((state) => state.allResources)
  const updateResources = useDrupalStore((state) => state.updateResources)
  const thisResource = allResources[uuid]
  //  const thisResourceOptions = ParseOptions(thisResource.optionsPayload)
  const allResourceSlugs = Object.keys(allResources).map((e) => {
    return allResources[e].slug
  })
  const setSelected = useDrupalStore((state) => state.setSelected)
  const initialState = useMemo(() => {
    return {
      title: thisResource.title,
      slug: thisResource.slug,
      categorySlug: thisResource.categorySlug,
      actionLisp: thisResource.actionLisp,
      drupalNid: thisResource.drupalNid,
      oneliner: thisResource.oneliner,
      optionsPayload: thisResource.optionsPayload,
    }
  }, [
    thisResource.title,
    thisResource.slug,
    thisResource.categorySlug,
    thisResource.actionLisp,
    thisResource.drupalNid,
    thisResource.oneliner,
    thisResource.optionsPayload,
  ])
  const initialFormState = {
    submitted: false,
    success: false,
    slugCollision: false,
    changes: false,
  }
  const [state, setState] = useState({ ...initialState })
  const [formState, setFormState] = useState({ ...initialFormState })

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (value !== thisResource.slug && allResourceSlugs.includes(value)) {
      setState((prev) => {
        return { ...prev, [name]: thisResource.slug }
      })
      setFormState((prev: any) => {
        return { ...prev, slugCollision: true }
      })
    } else {
      setState((prev) => {
        return { ...prev, [name]: value }
      })
      setFormState((prev: any) => {
        return { ...prev, slugCollision: false }
      })
    }
    setToggleCheck(true)
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    // FIX
    let success = false
    if (!deepEqual(state, initialState)) {
      const resource = {
        type: `node--resource`,
        id: uuid,
        attributes: {
          title: state.title,
          field_slug: state.slug,
          field_action_lisp: state.actionLisp,
          field_oneliner: state.oneliner,
          field_options: state.optionsPayload,
        },
      }
      const payload = {
        endpoint: `${apiBase}/node/resource/${uuid}`,
        method: `PATCH`,
        body: {
          data: resource,
        },
      }
      const newResource = {
        ...thisResource,
        id: uuid,
      }
      if (state.title !== thisResource.title) newResource.title = state.title
      if (state.slug !== thisResource.slug) newResource.slug = state.slug
      if (state.actionLisp !== thisResource.actionLisp)
        newResource.actionLisp = state.actionLisp
      if (state.oneliner !== thisResource.oneliner)
        newResource.oneliner = state.oneliner
      if (state.optionsPayload !== thisResource.optionsPayload)
        newResource.optionsPayload = state.optionsPayload
      isAuthenticated && setDrupalQueue(uuid, payload)
      updateResources(newResource)
      setLocked(false)
      success = true
    }
    setFormState((prev: any) => {
      return { ...prev, submitted: true, success }
    })
  }

  useEffect(() => {
    let showMessage = false
    drupalResponse &&
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
        endpoint: `uuid-by-node/${thisResource.drupalNid}`,
        method: `GET`,
      }
      if (isAuthenticated) setDrupalQueue(thisResource.drupalNid, payload)
      setIsAuthorSoftLock(true)
      return true
    }
    return false
  }, [
    isAuthenticated,
    checked,
    thisResource.drupalNid,
    setDrupalQueue,
    setIsAuthorSoftLock,
  ])

  useEffect(() => {
    if (!checked && isAuthorSoftLock && isAuthorCheck && drupalResponse) {
      if (
        Object.keys(drupalResponse).length &&
        drupalResponse[thisResource.drupalNid]
      ) {
        const data = drupalResponse[thisResource.drupalNid]
        if (data) {
          data?.forEach((e: any) => {
            if (e?.uuid === oauthDrupalUuid) setIsAuthor(true)
          })
          removeDrupalResponse(thisResource.drupalNid)
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
    thisResource.drupalNid,
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
      <div className="text-xl font-action mb-12">
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
        <form className="max-w-3xl" id="editResource" onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-black/10 pb-12">
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
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
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black focus:ring-0 sm:text-sm sm:leading-6"
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
                    htmlFor="categorySlug"
                    className="block text-sm leading-6 text-black"
                  >
                    Category Slug
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                      <input
                        type="text"
                        name="categorySlug"
                        id="categorySlug"
                        pattern="[a-zA-Z\-]+"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                        value={state.categorySlug}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full max-w-xl">
                  <label
                    htmlFor="oneliner"
                    className="block text-sm leading-6 text-black"
                  >
                    Oneliner
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                      <input
                        type="text"
                        name="oneliner"
                        id="oneliner"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                        value={state.oneliner}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="actionLisp"
                    className="block text-sm leading-6 text-black"
                  >
                    Action Lisp
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                      <input
                        type="text"
                        name="actionLisp"
                        id="actionLisp"
                        pattern="[a-zA-Z0-9\(\)\- ]+"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                        value={state.actionLisp}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="optionsPayload"
                    className="block text-sm leading-6 text-black"
                  >
                    Options Payload
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="optionsPayload"
                      name="optionsPayload"
                      rows={7}
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={state.optionsPayload}
                      onChange={handleChange}
                    />
                  </div>
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

export default EditResource
