// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { classNames } from '@tractstack/helpers'
import { navigate } from 'gatsby'
import {
  LockOpenIcon,
  LockClosedIcon,
  BoltSlashIcon,
  RectangleGroupIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import {
  CheckIcon,
  LinkIcon,
  TrashIcon,
  CogIcon,
} from '@heroicons/react/20/solid'

import { useDrupalStore } from '../../stores/drupal'
import { config } from '../../../data/SiteConfig'
import SlideOver from './SlideOver'
import StoryFragmentRender from './StoryFragmentRender'
import { SaveStages } from '../../types'

const StoryFragmentForm = ({ uuid, payload, flags, fn }: any) => {
  const { state } = payload
  const {
    handleChange,
    handleInsertPane,
    handleReorderPane,
    handleSubmit,
    setSaved,
  } = fn
  const [toggleAdvOpt, setToggleAdvOpt] = useState(false)
  const viewportKey = useDrupalStore((state) => state.viewportKey)
  const innerViewportMobile = Math.min(
    typeof window !== `undefined` ? window.innerWidth * 0.5 : 400,
    400,
  )
  const innerViewportTablet = Math.min(
    typeof window !== `undefined` ? window.innerWidth * 0.6 : 500,
    500,
  )
  const innerViewportDesktop = Math.max(
    typeof window !== `undefined` ? window.innerWidth * 0.6 : 700,
    700,
  )
  const innerViewport =
    viewportKey === `mobile`
      ? innerViewportMobile
      : viewportKey === `tablet`
        ? innerViewportTablet
        : innerViewportDesktop
  const [width, setWidth] = useState(innerViewport)
  // const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const setViewportKey = useDrupalStore((state) => state.setViewportKey)
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
  const passFn = {
    handleInsertPane,
    handleReorderPane,
  }
  const passFlags = {
    width,
    slugCollision: flags.slugCollision,
    viewportKey,
  }

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
              <form className="max-w-3xl" id="editPane">
                <div className="space-y-12">
                  <div className="my-6">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6">
                      <div className="xs:col-span-3">
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
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
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
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </SlideOver>
      ) : null}
      <>
        <div className="z-50 fixed bg-myblue inset-y-0 right-0 max-w-full flex xs:hidden justify-center items-center">
          <div>
            <h3 className="font-action text-mygreen text-3xl px-12 max-w-xl">
              The visual editor has not been optimized for small screens.
            </h3>
            <p className="pt-12 font-main text-mywhite text-xl px-12 max-w-xl">
              A mobile-first &lsquo;storykeep experience&rsquo; is on our
              roadmap. In the meantime, try requesting the &quot;Desktop
              Site&quot; in your mobile browser. We apologize for this
              limitation.
            </p>
          </div>
        </div>

        <div className="h-6 bg-myblue w-full" />
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
                      title="You are editing a Pane"
                    >
                      <RectangleGroupIcon
                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-mylightgrey"
                        aria-hidden="true"
                      />
                      Story Fragment
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
                        <span className="inline-flex items-center rounded-md bg-myorange/10 px-2 py-1 text-sm text-black ring-1 ring-inset ring-mydarkgrey/10">
                          Saved!
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
                  <span className="hidden xs:block">
                    <button
                      type="button"
                      disabled={flags.saveStage >= SaveStages.PrepareSave}
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
                      Story Fragment Settings
                    </button>
                  </span>

                  {flags.isAuthor || flags.isAdmin ? (
                    <span className="ml-3 hidden xs:block">
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
                        disabled={flags.saveStage >= SaveStages.PrepareSave}
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

                  <span className="ml-3">
                    {flags.saveStage === SaveStages.NoChanges ? (
                      <button
                        type="button"
                        disabled={flags.saveStage >= SaveStages.PrepareSave}
                        onClick={() => navigate(`/storykeep`)}
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
                        Close
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={flags.saveStage >= SaveStages.PrepareSave}
                        onClick={() => {
                          if (
                            window.confirm(
                              `There are Unsaved Changes. Proceed?`,
                            )
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
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mt-1 flex flex-col xs:mt-0 xs:flex-row xs:flex-wrap xs:space-x-8">
              <div className="flex items-center mt-2">
                <span className="mr-2 text-sm text-mydarkgrey">
                  Set Viewport:
                </span>
                <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    type="button"
                    title="Mobile or small screens"
                    disabled={flags.saveStage >= SaveStages.PrepareSave}
                    className={classNames(
                      flags.saveStage >= SaveStages.PrepareSave
                        ? ``
                        : `hover:bg-myorange hover:text-white`,
                      viewportKey === `mobile`
                        ? `bg-white text-allblack`
                        : `bg-mylightgrey/50 text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10`,
                      `relative inline-flex items-center rounded-l-md px-3 py-2`,
                    )}
                    onClick={() => {
                      setViewportKey(`mobile`)
                      setWidth(innerViewportMobile)
                    }}
                  >
                    <span className="sr-only">Edit</span>
                    <DevicePhoneMobileIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    title="Tablet or medium screens"
                    disabled={flags.saveStage >= SaveStages.PrepareSave}
                    className={classNames(
                      flags.saveStage >= SaveStages.PrepareSave
                        ? ``
                        : `hover:bg-myorange hover:text-white`,
                      viewportKey === `tablet`
                        ? `bg-white text-allblack`
                        : `bg-mylightgrey/50 text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10`,
                      `relative inline-flex items-center px-3 py-2`,
                    )}
                    onClick={() => {
                      setViewportKey(`tablet`)
                      setWidth(innerViewportTablet)
                    }}
                  >
                    <span className="sr-only">Edit</span>
                    <DeviceTabletIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    title="Desktop or large screens"
                    disabled={flags.saveStage >= SaveStages.PrepareSave}
                    className={classNames(
                      flags.saveStage >= SaveStages.PrepareSave
                        ? ``
                        : `hover:bg-myorange hover:text-white`,
                      viewportKey === `desktop`
                        ? `bg-white text-allblack`
                        : `bg-mylightgrey/50 text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10`,
                      `relative inline-flex items-center rounded-r-md px-3 py-2`,
                    )}
                    onClick={() => {
                      setViewportKey(`desktop`)
                      setWidth(innerViewportDesktop)
                    }}
                  >
                    <span className="sr-only">Edit</span>
                    <ComputerDesktopIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </span>
              </div>
              <div className="mt-2 flex items-center" title={authorTitle}>
                <span className="mr-2 text-sm text-mydarkgrey">
                  Currently designing for:
                </span>
                <span className="font-bold text-xl text-myblue">
                  {viewportKey}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-4 bg-slate-100">
          <>
            {flags.saveStage >= SaveStages.PrepareSave ? (
              <div className="z-50 absolute top-0 bg-transparent inset-y-0 right-0 w-full h-screen"></div>
            ) : null}
            {flags.isEmpty ? (
              <p>what to put here?</p>
            ) : (
              <StoryFragmentRender
                uuid={uuid}
                previewPayload={{
                  state,
                }}
                fn={passFn}
                flags={passFlags}
              />
            )}
          </>
        </section>
      </>
    </>
  )
}

export default StoryFragmentForm
