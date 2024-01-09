// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { navigate } from 'gatsby'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { v4 as uuidv4 } from 'uuid'
import { classNames } from '@tractstack/helpers'

import { useDrupalStore } from '../stores/drupal'

const StoryKeep = () => {
  const [state, setState] = useState({ title: `Untitled`, slug: `` })
  const [slugCollision, setSlugCollision] = useState(false)
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const setTractStackTriggerSave = useDrupalStore(
    (state) => state.setTractStackTriggerSave,
  )
  const tractStackSelected = useDrupalStore((state) => state.tractStackSelected)
  const updateTractStacks = useDrupalStore((state) => state.updateTractStacks)
  const setTractStackSelected = useDrupalStore(
    (state) => state.setTractStackSelected,
  )
  const setTractStackSelect = useDrupalStore(
    (state) => state.setTractStackSelect,
  )
  const allTractStacksSlugs = Object.keys(allTractStacks)
    .map((e) => {
      if (e && typeof allTractStacks[e] !== `undefined`)
        return allTractStacks[e].slug
      return null
    })
    .filter((e) => e)

  const handleAdd = () => {
    const newUuid = uuidv4()
    const newTractStack = {
      id: newUuid,
      drupalNid: -1,
      title: state.title,
      slug: state.slug,
      socialImagePath: ``,
      contextPanes: [],
      storyFragments: [],
    }
    updateTractStacks(newTractStack)
    setTractStackTriggerSave(true)
    setTractStackSelected(newUuid)
    navigate(`/storykeep/tractstacks/${newUuid}`)
  }

  const handleChange = (e: any) => {
    // FIX
    const { name, value } = e.target
    if (value !== state.slug && allTractStacksSlugs.includes(value))
      setSlugCollision(true)
    else setSlugCollision(false)
    setState((prev: any) => {
      return { ...prev, [name]: value }
    })
  }

  return (
    <>
      <section className="relative bg-slate-50">
        <div className="text-xl my-4 xl:max-w-screen-2xl px-4 xl:px-8">
          <h2 className="text-3xl font-action font-bold text-black my-6">
            Select a Tract Stack
          </h2>
          <div className="-mx-4">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3"
            >
              {Object.keys(allTractStacks).map((record: string) => (
                <li key={allTractStacks[record].slug} className="col-span-1">
                  <button
                    type="button"
                    className={classNames(
                      record === tractStackSelected
                        ? `bg-myorange/5`
                        : `bg-slate-50`,
                      `group relative block w-full max-w-md rounded-lg shadow-md hover:shadow-none hover:border-dashed border-2 border-dotted border-mylightgrey/20 p-6 text-center hover:border-myblue/20 hover:bg-myorange/10 focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                    )}
                    onClick={() => {
                      setTractStackSelected(record)
                      setTractStackSelect(false)
                    }}
                  >
                    <ChatBubbleLeftRightIcon
                      aria-hidden="true"
                      className="mx-auto h-8 w-8 text-myblue/10 group-hover:text-myblue/20"
                    />
                    <span className="group-hover:text-myblue mt-2 block text-md text-myblue">
                      {allTractStacks[record].title}
                    </span>
                    <span className="group-hover:text-myblue mt-2 block text-xs font-main text-mydarkgrey">
                      {allTractStacks[record].slug}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="relative bg-slate-50 mt-24">
        <div className="text-xl my-4 xl:max-w-screen-2xl px-4 xl:px-8">
          <h2 className="text-xl font-action font-bold text-black my-6">
            Or, make a new Tract Stack
          </h2>
          <div className="inline-flex">
            <div className="px-3">
              <label
                htmlFor="title"
                className="text-sm leading-6 text-black inline-block"
              >
                Title
              </label>
              {state.title.length === 0 ? (
                <span
                  className="text-myorange ml-1 inline-block text-xs"
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

            <div className="px-3">
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
                    className="text-myorange ml-1 inline-block text-xs"
                    title="required"
                  >
                    *required
                  </span>
                </>
              ) : null}
              {slugCollision ? (
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

            <div className="flex flex-row justify-center items-center mx-6">
              {!(state.slug === `` || slugCollision || state.title === ``) ? (
                <button
                  type="button"
                  className="inline-flex items-center rounded-md bg-myblue px-3 py-2 text-sm font-bold text-white shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-myorange"
                  onClick={handleAdd}
                >
                  Create
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default StoryKeep
