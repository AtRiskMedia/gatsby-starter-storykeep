// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useMemo } from 'react'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { IEdit } from '../types'
import { useDrupalStore } from '../stores/drupal'
import Message from './Message'

const EditMarkdown = ({ uuid }: IEdit) => {
  const setLocked = useDrupalStore((state) => state.setLocked)
  const isAuthenticated = useAuthenticated()
  const deepEqual = require(`deep-equal`)
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
  const allFiles = useDrupalStore((state) => state.allFiles)
  const thisMarkdown = useDrupalStore((state) => state.allMarkdown[uuid])
  const updateMarkdown = useDrupalStore((state) => state.updateMarkdown)
  const setSelected = useDrupalStore((state) => state.setSelected)
  const initialState = useMemo(() => {
    return {
      title: thisMarkdown.title,
      slug: thisMarkdown.slug,
      categorySlug: thisMarkdown.categorySlug,
      drupalNid: thisMarkdown.drupalNid,
      markdownBody: thisMarkdown.markdownBody,
      images: thisMarkdown.images,
      hasImages: thisMarkdown?.images?.length > 0,
      svgs: thisMarkdown.svgs,
      hasSvgs: thisMarkdown?.svgs?.length > 0,
    }
  }, [
    thisMarkdown.title,
    thisMarkdown.slug,
    thisMarkdown.categorySlug,
    thisMarkdown.drupalNid,
    thisMarkdown.markdownBody,
    thisMarkdown.images,
    thisMarkdown.svgs,
  ])
  const initialFormState = {
    submitted: false,
    success: false,
    changes: false,
    slugCollision: false,
  }
  const [state, setState] = useState({ ...initialState })
  const [formState, setFormState] = useState({ ...initialFormState })

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target

    // must change for slug collision
    //
    setState((prev) => {
      return { ...prev, [name]: value }
    })
    setToggleCheck(true)
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // FIX
    let success = false
    if (!deepEqual(state, initialState)) {
      const markdown = {
        type: `node--markdown`,
        id: uuid,
        attributes: {
          title: state.title,
          field_slug: state.slug,
          field_category_slug: state.categorySlug,
          field_markdown_body: state.markdownBody,
        },
      }
      const payload = {
        endpoint: `${apiBase}/node/markdown/${uuid}`,
        method: `PATCH`,
        body: {
          data: markdown,
        },
      }
      isAuthenticated && setDrupalQueue(uuid, payload)
      const newMarkdown = {
        ...thisMarkdown,
        id: uuid,
        images: thisMarkdown.relationships.images || [],
        svgs: thisMarkdown.relationships.imagesSvg || [],
      }
      if (state.title !== thisMarkdown.title) newMarkdown.title = state.title
      if (state.markdownBody !== thisMarkdown.markdownBody)
        newMarkdown.markdownBody = state.markdownBody
      if (state.slug !== thisMarkdown.slug) newMarkdown.slug = state.slug
      if (state.categorySlug !== thisMarkdown.categorySlug)
        newMarkdown.categorySlug = state.categorySlug
      updateMarkdown(newMarkdown)
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
        endpoint: `uuid-by-node/${thisMarkdown.drupalNid}`,
        method: `GET`,
      }
      isAuthenticated && setDrupalQueue(thisMarkdown.drupalNid, payload)
      setTimeout(() => setIsAuthorSoftLock(true), 0)
      return true
    }
    return false
  }, [
    isAuthenticated,
    thisMarkdown.drupalNid,
    setDrupalQueue,
    checked,
    setIsAuthorSoftLock,
  ])

  useEffect(() => {
    if (!checked && isAuthorSoftLock && isAuthorCheck && drupalResponse) {
      if (
        Object.keys(drupalResponse).length &&
        drupalResponse[thisMarkdown.drupalNid]
      ) {
        const data = drupalResponse[thisMarkdown.drupalNid]
        if (data) {
          data?.forEach((e: any) => {
            if (e?.uuid === oauthDrupalUuid) setIsAuthor(true)
          })
          removeDrupalResponse(thisMarkdown.drupalNid)
          setChecked(true)
        }
      }
    }
  }, [
    checked,
    isAuthorCheck,
    oauthDrupalUuid,
    drupalResponse,
    thisMarkdown.drupalNid,
    removeDrupalResponse,
    isAuthorSoftLock,
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
        <form className="max-w-3xl" id="editMarkdown" onSubmit={handleSubmit}>
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
                        pattern="[a-zA-Z0-9\-]+"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                        value={state.categorySlug}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="markdownBody"
                    className="block text-sm leading-6 text-black"
                  >
                    Markdown
                  </label>
                  <div className="mt-2">
                    <textarea
                      id="markdownBody"
                      name="markdownBody"
                      rows={13}
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-myorange sm:text-sm sm:leading-6"
                      value={state.markdownBody}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <p className="block text-sm leading-6 text-black">Images</p>
                  {state.hasImages ? (
                    state.images?.map((e: any) => {
                      return (
                        <div key={e}>
                          <img
                            className="h-16 w-auto"
                            src={allFiles[e].localFile.publicURL}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <p>none</p>
                  )}
                </div>
                <div className="sm:col-span-full">
                  <p className="block text-sm leading-6 text-black">
                    Svg Images
                  </p>
                  {state.hasSvgs ? (
                    state.svgs?.map((e: any) => {
                      return (
                        <div key={e}>
                          <img
                            className="h-16 w-auto"
                            src={allFiles[e].localFile.publicURL}
                          />
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
                  setLocked(false)
                  setSelected(``)
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

export default EditMarkdown
