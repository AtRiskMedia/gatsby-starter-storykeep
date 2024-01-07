// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '@tractstack/helpers'
import { navigate } from 'gatsby'
import {
  LockOpenIcon,
  LockClosedIcon,
  BoltSlashIcon,
  ChevronDownIcon,
  RectangleGroupIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  CursorArrowRaysIcon,
  BookOpenIcon,
  XMarkIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import {
  CheckIcon,
  LinkIcon,
  TrashIcon,
  CogIcon,
  FireIcon,
} from '@heroicons/react/20/solid'

import { useDrupalStore } from '../../stores/drupal'
import SlideOver from './SlideOver'
import { config } from '../../../data/SiteConfig'
import { SaveStages } from '../../types'

const TractStackForm = ({ uuid, payload, flags, fn }: any) => {
  const { state } = payload
  const { setSaved, handleChange, handleSubmit, handleAdd } = fn
  const [toggleAdvOpt, setToggleAdvOpt] = useState(false)
  const selectedCollection = useDrupalStore((state) => state.selectedCollection)
  const setTractStackSelect = useDrupalStore(
    (state) => state.setTractStackSelect,
  )
  const setSelectedCollection = useDrupalStore(
    (state) => state.setSelectedCollection,
  )
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allResources = useDrupalStore((state) => state.allResources)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisTractStack = useDrupalStore((state) => state.allTractStacks[uuid])
  const thisAllStoryFragments = Object.keys(allStoryFragments)
    .map((e: any) => {
      if (allStoryFragments[e].tractstack === uuid)
        return { id: e, ...allStoryFragments[e] }
      return null
    })
    .filter((e) => e)
    .reduce((acc, cur): any => {
      return { ...acc, [cur.id]: cur }
    }, {})
  const nodes =
    selectedCollection === `storyfragment`
      ? thisAllStoryFragments
      : selectedCollection === `pane`
        ? allPanes
        : selectedCollection === `resource`
          ? allResources
          : // : selectedCollection === `files`
            //  ? allFiles
            // : selectedCollection === `markdown`
            //  ? allMarkdown
            //  : selectedCollection === `menu`
            //    ? allMenus
            {}
  const AuthorIcon =
    flags.isAuthor || flags.isAdmin || flags.isBuilder
      ? LockOpenIcon
      : !flags.isOpenDemo
        ? LockClosedIcon
        : BoltSlashIcon
  const authorTitle = flags.isAuthor
    ? `You are the author`
    : flags.isAdmin
      ? `You have administrator privileges`
      : flags.isBuilder
        ? `You have builder privileges`
        : !flags.isOpenDemo
          ? `You do not have edit privileges`
          : `Open demo 'safe' mode. Edits apply only during this session.`
  const authorDescription =
    flags.isAuthor || flags.isAdmin || flags.isBuilder
      ? `You may edit`
      : !flags.isOpenDemo
        ? `No edit privileges`
        : `Safe mode enabled`
  const addButtons = [
    {
      id: `resource`,
      name: `Resource`,
      enabled: selectedCollection === `resource`,
    },
    {
      id: `tractstack`,
      name: `Track Stack`,
      enabled: selectedCollection === `tractstack`,
    },
    {
      id: `pane`,
      name: `Content Pane`,
      enabled: selectedCollection === `pane`,
    },
    {
      id: `storyfragment`,
      name: `Story Fragment`,
      enabled: selectedCollection === `storyfragment`,
    },
  ]
  const rowOneHeading =
    selectedCollection === `storyfragment`
      ? `web page`
      : selectedCollection === `pane`
        ? `content pane`
        : `title`
  const tags = [
    {
      id: `storyfragment`,
      name: `Story Fragments`,
      count: Object.keys(thisAllStoryFragments).length,
      current: selectedCollection === `storyfragment`,
    },
    {
      id: `pane`,
      name: `All Panes`,
      count: Object.keys(allPanes).length,
      current: selectedCollection === `pane`,
    },
    {
      id: `resource`,
      name: `All Resources`,
      count: Object.keys(allResources).length,
      current: selectedCollection === `resource`,
    },
    // {
    //  id: `markdown`,
    //  name: `Markdown`,
    //  count: Object.keys(allMarkdown).length,
    //  current: selectedCollection === `markdown`,
    // },
    // {
    //  id: `file`,
    //  name: `Files`,
    //  count: Object.keys(allFiles).length,
    //  current: selectedCollection === `file`,
    // },
    // {
    //  id: `menu`,
    //  name: `Menus`,
    //  count: Object.keys(allMenus).length,
    //  current: selectedCollection === `menu`,
    // },
  ]
  const noTags = tags.filter((t) => t.count).length === 0
  const filterKeys = Object.keys(nodes).map((e: any) => {
    // console.log(nodes[e])
    return e
  })

  useEffect(() => {
    if (flags.saved) {
      setTimeout(() => setSaved(false), config.messageDelay)
    }
  }, [flags.saved, setSaved])

  return (
    <>
      {toggleAdvOpt ? (
        <SlideOver
          setToggle={setToggleAdvOpt}
          locked={
            state.title.length === 0 ||
            state.slug.length === 0 ||
            flags.slugCollision
          }
        >
          <section className="relative bg-slate-50">
            <div className="w-full px-6 pt-2 max-w-screen-2xl mt-2 ml-2">
              <form
                className="max-w-3xl"
                id="editTractStack"
                onSubmit={handleSubmit}
              >
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
                        {flags.slugCollision ? (
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
                        {flags.hasStoryFragments ? (
                          thisTractStack.storyFragments?.map((e: any) => {
                            return (
                              <div
                                key={e}
                                className="mt-2 flex items-center gap-x-3"
                              >
                                {allStoryFragments[e].title}
                                <button
                                  type="button"
                                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                                  onClick={() => {
                                    if (
                                      flags.saveStage ===
                                        SaveStages.NoChanges ||
                                      (flags.saveStage ===
                                        SaveStages.UnsavedChanges &&
                                        window.confirm(
                                          `There are Unsaved Changes. Proceed?`,
                                        ))
                                    ) {
                                      setSelectedCollection(`storyfragment`)
                                      navigate(`/storykeep/storyfragments/${e}`)
                                    }
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
                        {flags.hasContextPanes ? (
                          thisTractStack.contextPanes?.map((e: any) => {
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
                                    if (
                                      flags.saveStage ===
                                        SaveStages.NoChanges ||
                                      (flags.saveStage ===
                                        SaveStages.UnsavedChanges &&
                                        window.confirm(
                                          `There are Unsaved Changes. Proceed?`,
                                        ))
                                    ) {
                                      setSelectedCollection(`pane`)
                                      navigate(`/storykeep/panes/${e}`)
                                    }
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
                </div>
              </form>
            </div>
          </section>
        </SlideOver>
      ) : null}
      <section className="relative bg-slate-50">
        <div className="p-6">
          <div className="w-full xl:max-w-screen-2xl flex justify-between">
            <div className="w-full lg:flex lg:items-center lg:justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-black xs:truncate xs:text-3xl xs:tracking-tight">
                  {state.title}
                </h2>
                <div className="h-12 mx-auto mt-1 flex flex-col xs:mt-0 xs:flex-row xs:flex-wrap xs:space-x-6">
                  <div
                    className="mt-2 flex items-center text-sm text-mydarkgrey"
                    title="You are editing a Tract Stack"
                  >
                    <RectangleGroupIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-mylightgrey"
                      aria-hidden="true"
                    />
                    Tract Stack
                  </div>
                  <div
                    className="mt-2 flex items-center text-sm text-mydarkgrey"
                    title={authorTitle}
                  >
                    <AuthorIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-mylightgrey"
                      aria-hidden="true"
                    />
                    {authorDescription}
                  </div>
                  <div
                    className="mt-2 flex items-center text-sm text-mydarkgrey"
                    title="Slug"
                  >
                    <LinkIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-mylightgrey"
                      aria-hidden="true"
                    />
                    {state.slug}
                  </div>
                  <div className="mt-2 flex items-center">
                    {flags.saved ? (
                      <span className="inline-flex items-center rounded-md bg-red-500 px-2 py-1 text-sm text-white ring-1 ring-inset ring-mydarkgrey/10">
                        SAVED
                      </span>
                    ) : flags.saveStage > SaveStages.NoChanges &&
                      flags.saveStage < SaveStages.Success ? (
                      <span className="inline-flex items-center rounded-md bg-yellow-300/20 px-2 py-1 text-sm text-black ring-1 ring-inset ring-mydarkgrey/10">
                        Unsaved changes
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex lg:ml-4 lg:mt-0">
                <span>
                  <button
                    type="button"
                    disabled={
                      flags.saveStage >= SaveStages.PrepareSave ||
                      flags.slugCollision ||
                      state.slug === ``
                    }
                    onClick={() => setToggleAdvOpt(!toggleAdvOpt)}
                    className={classNames(
                      flags.saveStage >= SaveStages.PrepareSave
                        ? ``
                        : `hover:bg-slate-100`,
                      `inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200`,
                    )}
                  >
                    <CogIcon
                      className="-ml-0.5 mr-1.5 h-5 w-5 text-mydarkgrey"
                      aria-hidden="true"
                    />
                    Tract Stack Settings
                  </button>
                </span>

                {flags.isAuthor || flags.isAdmin ? (
                  <span className="ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                      onClick={() => alert(`todo`)}
                    >
                      <TrashIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5 text-mydarkgrey"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  </span>
                ) : null}

                {flags.saveStage >= SaveStages.UnsavedChanges ? (
                  <span className="xs:ml-3">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={
                        flags.saveStage >= SaveStages.PrepareSave ||
                        flags.slugCollision ||
                        state.slug === ``
                      }
                      className={classNames(
                        flags.saveStage === SaveStages.UnsavedChanges
                          ? `bg-myblue hover:bg-myorange/20 text-white hover:text-myblue`
                          : flags.saveStage < SaveStages.Error
                            ? `bg-myorange/5 hover:bg-myorange/5 text-myorange hover:text-myorange`
                            : flags.saveStage === SaveStages.Error
                              ? `bg-red-300 hover:bg-red-300 text-white hover:text-white`
                              : `bg-mygreen hover:bg-mygreen text-black hover:text-white`,
                        `inline-flex items-center rounded-md bg-myblue px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange`,
                      )}
                    >
                      <>
                        {flags.saveStage < SaveStages.PrepareSave ||
                        flags.saveStage === SaveStages.Success ? (
                          <CheckIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : flags.saveStage < SaveStages.Error ? (
                          <SunIcon
                            className="text-myorange/50 motion-safe:animate-ping -ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : flags.saveStage === SaveStages.Error ? (
                          <XMarkIcon
                            className="-ml-0.5 mr-1.5 h-5 w-5"
                            aria-hidden="true"
                          />
                        ) : null}
                        {flags.saveStage < SaveStages.PrepareSave
                          ? `Save`
                          : flags.saveStage < SaveStages.Error
                            ? `Saving`
                            : flags.saveStage === SaveStages.Error
                              ? `Error`
                              : `Saved`}
                      </>
                    </button>
                  </span>
                ) : null}

                {flags.saveStage === SaveStages.NoChanges ? null : (
                  <span className="ml-3">
                    <button
                      type="button"
                      disabled={
                        flags.saveStage >= SaveStages.PrepareSave ||
                        flags.slugCollision ||
                        state.slug === ``
                      }
                      onClick={() => {
                        if (
                          window.confirm(`There are Unsaved Changes. Proceed?`)
                        )
                          navigate(`/storykeep`)
                      }}
                      className={classNames(
                        flags.saveStage >= SaveStages.PrepareSave
                          ? ``
                          : `hover:bg-slate-100`,
                        `inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200`,
                      )}
                    >
                      <XMarkIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      Cancel
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50">
        <div className="mx-6 mb-8 bg-white/50 px-4 py-4 shadow xs:rounded-md xs:px-6">
          <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
            <span className="isolate inline-flex rounded-md shadow-sm">
              {tags
                .filter((tag) => tag.count)
                .map((tag, idx) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedCollection(tag.id)}
                    className={classNames(
                      tag.current
                        ? `bg-myorange/10 text-black`
                        : `bg-black/10 text-mydarkgrey`,
                      idx === 0 ? `rounded-l-md` : ``,
                      idx + 1 === tags.filter((tag) => tag.count).length
                        ? `rounded-r-md`
                        : ``,
                      `relative inline-flex items-center px-3 py-2 text-sm font-bold ring-1 ring-inset ring-myorange/20 hover:text-black hover:bg-myorange/20`,
                    )}
                  >
                    {`${tag.name} (${tag.count})`}
                  </button>
                ))}
              {noTags ? (
                <div className="relative inline-flex items-center rounded-l-md bg-mywhite px-3 py-2 text-sm font-bold text-black">
                  No content found.
                </div>
              ) : null}
              <button
                className="relative inline-flex items-center rounded-l-md bg-mywhite px-3 py-2 text-sm text-black font-main underline hover:font-myorange"
                disabled={
                  flags.saveStage >= SaveStages.PrepareSave ||
                  flags.slugCollision ||
                  state.slug === ``
                }
                onClick={() => {
                  if (
                    flags.saveStage === SaveStages.NoChanges ||
                    (flags.saveStage === SaveStages.UnsavedChanges &&
                      window.confirm(`There are Unsaved Changes. Proceed?`))
                  ) {
                    setTractStackSelect(true)
                    navigate(`/storykeep`)
                  }
                }}
              >
                change Tract Stack
              </button>
            </span>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-mywhite px-3 py-2 text-sm text-myblack shadow-sm ring-1 ring-inset ring-myorange/20 hover:bg-myorange/10">
                  +&nbsp;Add
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-mydarkgrey"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="z-1 absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-mywhite shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {addButtons.map((e) => (
                      <span key={e.id}>
                        {e.enabled ? (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleAdd(e.id)}
                                className={classNames(
                                  active
                                    ? `bg-myorange/10 text-black`
                                    : `text-mydarkgrey`,
                                  `block px-4 py-2 text-sm w-full`,
                                )}
                              >
                                {e.name}
                              </button>
                            )}
                          </Menu.Item>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="mt-4">
            <p className="text-mydarkgrey text-xl">
              {selectedCollection === `storyfragment` ? (
                <>
                  Each <span className="font-bold">story fragment</span> maps to
                  {` `}
                  <span className="font-bold">one web page</span> or URL. It
                  contains one or more content panes.{` `}
                </>
              ) : selectedCollection === `pane` ? (
                <>
                  Each <span className="font-bold">pane</span> is{` `}
                  <span className="font-bold">one section</span> of a web page.
                  Panes can be re-used multiple times! (As visitors engage with
                  your site activities such as reading or clicking in this pane
                  get collected.)
                </>
              ) : selectedCollection === `resource` ? (
                <>
                  A <span className="font-bold">resource</span> is used in
                  special cases such as embedding a YouTube video.
                </>
              ) : selectedCollection === `tractstack` ? (
                <>
                  Each <span className="font-bold">tract stack</span> contains a
                  collection of story fragments. Your website will have one or
                  more tract stacks. Think of each as having specific content to
                  address a particular issue. This will drive analytics and help
                  to tailor your insight discovery.
                </>
              ) : null}
            </p>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50">
        <div className="text-xl font-action mb-12 xl:max-w-screen-2xl mt-4 px-4 xl:px-8">
          <div className="-mx-4">
            <table className="w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-black"
                  >
                    {rowOneHeading}
                  </th>
                  {(selectedCollection === `pane` &&
                    typeof flags?.panesDaysSinceData !== `undefined`) ||
                  (selectedCollection === `storyfragment` &&
                    typeof flags?.storyFragmentDaysSinceData !==
                      `undefined`) ? (
                    <th
                      scope="col"
                      className="hidden whitespace-nowrap px-3 py-4 text-left text-sm text-mydarkgrey xs:table-cell"
                    >
                      Activity
                    </th>
                  ) : null}
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-4 text-left text-sm text-mydarkgrey md:table-cell"
                  >
                    Slug
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-mywhite font-main">
                {filterKeys.map(
                  (
                    record: string, // FIX
                  ) => (
                    <tr key={record}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-black">
                        {(selectedCollection === `storyfragment` &&
                          typeof flags?.storyFragmentDaysSinceData !==
                            `undefined`) ||
                        (selectedCollection === `pane` &&
                          typeof flags?.panesDaysSinceData !== `undefined`) ? (
                          <span
                            className="mr-1"
                            title={`Recent activity score | ${
                              selectedCollection === `storyfragment` &&
                              typeof flags?.storyFragmentDaysSinceData[
                                record
                              ] !== `undefined` &&
                              typeof flags?.storyFragmentDaysSinceData[record]
                                .engagement !== `undefined`
                                ? `${flags.storyFragmentDaysSinceData[record].engagement}%`
                                : selectedCollection === `pane` &&
                                    typeof flags?.panesDaysSinceData[record] !==
                                      `undefined` &&
                                    typeof flags?.panesDaysSinceData[record]
                                      .engagement !== `undefined`
                                  ? `${flags.panesDaysSinceData[record].engagement}%`
                                  : `no activity`
                            }`}
                          >
                            <FireIcon
                              className={classNames(
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined`
                                  ? `opacity-${flags.storyFragmentDaysSinceData[record].colorOffset}`
                                  : typeof flags?.panesDaysSinceData[record] !==
                                      `undefined`
                                    ? `opacity-${flags.panesDaysSinceData[record].colorOffset}`
                                    : `opacity-5`,
                                `w-4 h-4 text-myorange inline`,
                              )}
                            />
                          </span>
                        ) : (
                          <span className="mr-5"></span>
                        )}
                        <button
                          className="truncate text-md font-main"
                          onClick={() => {
                            if (selectedCollection === `pane`)
                              navigate(`/storykeep/panes/${record}`)
                            if (selectedCollection === `storyfragment`)
                              navigate(`/storykeep/storyfragments/${record}`)
                            if (selectedCollection === `resource`)
                              navigate(`/storykeep/resources/${record}`)
                            else
                              console.log(`miss on collection`, [
                                selectedCollection,
                              ])
                            // else {
                            // setSelectedCollection(current)
                            // setSelected(record)
                            // }
                          }}
                        >
                          {nodes[record].title}
                        </button>
                      </td>

                      {(selectedCollection === `pane` &&
                        typeof flags?.panesDaysSinceData !== `undefined`) ||
                      (selectedCollection === `storyfragment` &&
                        typeof flags?.storyFragmentDaysSinceData !==
                          `undefined`) ? (
                        <td className="hidden whitespace-nowrap pt-4 pb-2 text-sm text-mydarkgrey xs:table-cell">
                          <div
                            className={classNames(
                              `grid`,
                              selectedCollection === `storyfragment` &&
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined` &&
                                (flags.storyFragmentDaysSinceData[record]
                                  .entered ||
                                  flags.storyFragmentDaysSinceData[record]
                                    .discovered)
                                ? `grid-rows-2`
                                : `grid-rows-1`,
                            )}
                          >
                            <div className="flex flex-row flex-nowrap">
                              {(selectedCollection === `storyfragment` &&
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined` &&
                                ((typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ].read === `number` &&
                                  flags.storyFragmentDaysSinceData[record]
                                    .read > 0) ||
                                  (typeof flags?.storyFragmentDaysSinceData[
                                    record
                                  ].glossed === `number` &&
                                    flags.storyFragmentDaysSinceData[record]
                                      .glossed > 0))) ||
                              (selectedCollection === `pane` &&
                                typeof flags?.panesDaysSinceData[record] !==
                                  `undefined`) ? (
                                <>
                                  <div title="Glossed | Read">
                                    <span
                                      title="Glossed | Read"
                                      className="sr-only"
                                    >
                                      Glossed | Read
                                    </span>
                                    <DocumentTextIcon
                                      className="h-4 w-4 text-mydarkgrey"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div
                                    className="text-xs leading-6 text-black ml-1 mr-2"
                                    title="Glossed | Read"
                                  >
                                    {selectedCollection === `storyfragment` &&
                                    flags.storyFragmentDaysSinceData[record]
                                      .glossed > 0
                                      ? flags.storyFragmentDaysSinceData[record]
                                          .glossed
                                      : selectedCollection === `pane` &&
                                          flags.panesDaysSinceData[record]
                                            .glossed > 0
                                        ? flags.panesDaysSinceData[record]
                                            .glossed
                                        : null}
                                    {(selectedCollection === `storyfragment` &&
                                      flags.storyFragmentDaysSinceData[record]
                                        .read > 0 &&
                                      flags.storyFragmentDaysSinceData[record]
                                        .glossed > 0) ||
                                    (selectedCollection === `pane` &&
                                      flags.panesDaysSinceData[record].read >
                                        0 &&
                                      flags.panesDaysSinceData[record].glossed >
                                        0)
                                      ? `, `
                                      : null}
                                    {selectedCollection === `storyfragment` &&
                                    flags.storyFragmentDaysSinceData[record]
                                      .read > 0
                                      ? flags.storyFragmentDaysSinceData[record]
                                          .read
                                      : selectedCollection === `pane` &&
                                          flags.panesDaysSinceData[record]
                                            .read > 0
                                        ? flags.panesDaysSinceData[record].read
                                        : null}
                                  </div>
                                </>
                              ) : null}

                              {(selectedCollection === `storyfragment` &&
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined` &&
                                flags.storyFragmentDaysSinceData[record]
                                  .clicked > 0) ||
                              (selectedCollection === `pane` &&
                                typeof flags?.panesDaysSinceData[record] !==
                                  `undefined` &&
                                flags.panesDaysSinceData[record].clicked >
                                  0) ? (
                                <>
                                  <div title="Clicked">
                                    <span className="sr-only">Clicked</span>
                                    <CursorArrowRaysIcon
                                      className="h-4 w-4 text-mydarkgrey"
                                      aria-hidden="true"
                                    />
                                  </div>

                                  {selectedCollection === `storyfragment` ? (
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Clicked"
                                    >
                                      <span>
                                        {
                                          flags.storyFragmentDaysSinceData[
                                            record
                                          ].clicked
                                        }
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Clicked"
                                    >
                                      <span>
                                        {
                                          flags.panesDaysSinceData[record]
                                            .clicked
                                        }
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </div>

                            {selectedCollection === `storyfragment` &&
                            typeof flags?.storyFragmentDaysSinceData[record] !==
                              `undefined` &&
                            (flags.storyFragmentDaysSinceData[record].entered ||
                              flags.storyFragmentDaysSinceData[record]
                                .discovered) ? (
                              <div className="flex flex-row flex-nowrap">
                                {selectedCollection === `storyfragment` &&
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined` &&
                                flags.storyFragmentDaysSinceData[record]
                                  .entered > 0 ? (
                                  <>
                                    <div title="Entered">
                                      <span className="sr-only">Entered</span>
                                      <FingerPrintIcon
                                        className="h-4 w-4 text-mydarkgrey"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Entered"
                                    >
                                      <span>
                                        {
                                          flags.storyFragmentDaysSinceData[
                                            record
                                          ].entered
                                        }
                                      </span>
                                    </div>
                                  </>
                                ) : null}

                                {selectedCollection === `storyfragment` &&
                                typeof flags?.storyFragmentDaysSinceData[
                                  record
                                ] !== `undefined` &&
                                flags.storyFragmentDaysSinceData[record]
                                  .discovered > 0 ? (
                                  <>
                                    <div title="Discovered">
                                      <span className="sr-only">
                                        Discovered
                                      </span>
                                      <BookOpenIcon
                                        className="h-4 w-4 text-mydarkgrey"
                                        aria-hidden="true"
                                      />
                                    </div>

                                    {selectedCollection === `storyfragment` ? (
                                      <div
                                        className="text-xs leading-6 text-black ml-1 mr-2"
                                        title="Discovered"
                                      >
                                        <span>
                                          {
                                            flags.storyFragmentDaysSinceData[
                                              record
                                            ].discovered
                                          }
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        className="text-xs leading-6 text-black ml-1 mr-2"
                                        title="Discovered"
                                      >
                                        <span>
                                          {
                                            flags.panesDaysSinceData[record]
                                              .discovered
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                      ) : null}

                      <td className="hidden whitespace-nowrap px-3 py-4 text-xs font-main text-mydarkgrey md:table-cell">
                        {nodes[record].slug || nodes[record].categorySlug}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
                        <button
                          onClick={() => {
                            if (selectedCollection === `pane`)
                              navigate(`/storykeep/panes/${record}`)
                            else if (selectedCollection === `storyfragment`)
                              navigate(`/storykeep/storyfragments/${record}`)
                            else if (selectedCollection === `resource`)
                              navigate(`/storykeep/resources/${record}`)
                            else console.log(`goto`, selectedCollection)
                          }}
                          className="text-myblue underline underline-offset-2 text-sm hover:text-myorange"
                        >
                          Edit
                          <span className="sr-only">
                            , {nodes[record].title}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            {(selectedCollection === `pane` &&
              typeof flags?.panesDaysSinceData !== `undefined`) ||
            (selectedCollection === `storyfragment` &&
              typeof flags?.storyFragmentDaysSinceData !== `undefined`) ? (
              <div className="my-6">
                <FireIcon
                  className={classNames(`w-4 h-4 text-myorange inline`)}
                />
                <span className="ml-1 text-black font-main text-sm">
                  Recent activity score | between 0 and 100%, a value of 100%
                  means very recent activity.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  )
}

export default TractStackForm
