// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect, Fragment } from 'react'
import { Switch, Menu, Transition } from '@headlessui/react'
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
  PlusCircleIcon,
  XMarkIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import {
  CheckIcon,
  ChevronDownIcon,
  LinkIcon,
  TrashIcon,
  PencilIcon,
  CogIcon,
} from '@heroicons/react/20/solid'

import { useDrupalStore } from '../../stores/drupal'
import { config } from '../../../data/SiteConfig'
import PaneStarter from './PaneStarter'
import EditBelief from '../EditBelief'
import PaneRender from './PaneRender'
import SlideOver from './SlideOver'
import { SaveStages } from '../../types'

const insertModeTags = [
  { name: `p`, title: `Paragraph` },
  { name: `li`, title: `List Item` },
  { name: `h2`, title: `Heading 2` },
  { name: `h3`, title: `Heading 3` },
  { name: `h4`, title: `Heading 4` },
  { name: `h5`, title: `Heading 5` },
  { name: `h6`, title: `Heading 6` },
  { name: `ul`, title: `List` },
  { name: `ol`, title: `Ordered List` },
]

const PaneForm = ({ uuid, payload, flags, fn }: any) => {
  const {
    state,
    formState,
    statePaneFragments,
    stateImpressions,
    stateHeldBeliefs,
    stateWithheldBeliefs,
    stateLivePreview,
    stateLivePreviewMarkdown,
  } = payload
  const {
    toggleBelief,
    handleChangeBelief,
    addBelief,
    handleChangeImpression,
    handleSubmit,
    handleEditMarkdown,
    handleMutateMarkdown,
    handleChangeEditInPlace,
    handleChange,
    setSaved,
  } = fn
  const [toggleAdvOpt, setToggleAdvOpt] = useState(false)
  const [interceptMode, setInterceptMode] = useState(`edit`)
  const [interceptModeTag, setInterceptModeTag] = useState(`p`)
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
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
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
    setInterceptMode,
  }
  const passFlags = {
    interceptMode,
    interceptModeTag,
    width,
    slugCollision: formState.slugCollision,
  }

  useEffect(() => {
    if (flags.saved) {
      setTimeout(() => setSaved(false), config.messageDelay)
    }
  }, [flags.saved, setSaved])

  return (
    <>
      {toggleAdvOpt ? (
        <SlideOver setToggle={setToggleAdvOpt}>
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

                      <div className="xs:col-span-full">
                        <p className="block text-sm leading-6 text-black font-bold">
                          Options Payload
                        </p>
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.hasCodeHook}
                              onChange={() =>
                                handleChange({
                                  target: {
                                    name: `hasCodeHook`,
                                    value: !state.hasCodeHook,
                                  },
                                })
                              }
                              className={classNames(
                                state.hasCodeHook
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.hasCodeHook
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Code Hook
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                Deploy custom code to your story fragments
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                        </div>
                        {state.hasCodeHook ? (
                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6 p-4 shadow bg-white mb-4">
                            <div className="xs:col-span-2">
                              <label
                                htmlFor="codeHookTarget"
                                className="block text-sm leading-6 text-black"
                              >
                                Target (allowed: a-z, A-Z, or h5p)
                              </label>
                              <div>
                                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                  <input
                                    type="text"
                                    name="codeHookTarget"
                                    id="codeHookTarget"
                                    pattern="([A-Za-z]|h5p)+"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                    value={state.codeHookTarget}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                            {state.codeHookTarget === `h5p` ? (
                              <>
                                <div className="xs:col-span-4">
                                  <label
                                    htmlFor="codeHookTarget"
                                    className="block text-sm leading-6 text-black"
                                  >
                                    Target Url
                                  </label>
                                  <div>
                                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                      <input
                                        type="text"
                                        name="codeHookTargetUrl"
                                        id="codeHookTargetUrl"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                        value={state.codeHookTargetUrl}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="xs:col-span-2">
                                  <label
                                    htmlFor="codeHookHeight"
                                    className="block text-sm leading-6 text-black"
                                  >
                                    Height (number only, of pixels)
                                  </label>
                                  <div>
                                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                      <input
                                        type="number"
                                        name="codeHookHeight"
                                        id="codeHookHeight"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                        value={state.codeHookHeight}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="xs:col-span-2">
                                  <label
                                    htmlFor="codeHookWidth"
                                    className="block text-sm leading-6 text-black"
                                  >
                                    Width (number only, of pixels)
                                  </label>
                                  <div>
                                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                      <input
                                        type="number"
                                        name="codeHookWidth"
                                        id="codeHookWidth"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                        value={state.codeHookWidth}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.overflowHidden}
                              onChange={() =>
                                handleChange({
                                  target: {
                                    name: `overflowHidden`,
                                    value: !state.overflowHidden,
                                  },
                                })
                              }
                              className={classNames(
                                state.overflowHidden
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.overflowHidden
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Overflow Hidden
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                CSS property to avoid horizontal scroll
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                        </div>
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.hiddenPane}
                              onChange={() =>
                                handleChange({
                                  target: {
                                    name: `hiddenPane`,
                                    value: !state.hiddenPane,
                                  },
                                })
                              }
                              className={classNames(
                                state.hiddenPane
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.hiddenPane
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Hidden Pane
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                Engagement with this pane is{` `}
                                <strong>not</strong>
                                {` `}
                                stored in knowledge graph
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                        </div>
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.hasHeldBeliefsPayload}
                              onChange={() => toggleBelief(`held`)}
                              className={classNames(
                                state.hasHeldBeliefsPayload
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.hasHeldBeliefsPayload
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Display on Matching Belief
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                This pane will only display to visitors if the
                                hold a matching belief
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                        </div>
                        {state.hasHeldBeliefsPayload
                          ? Object.keys(stateHeldBeliefs).map((e, index) => (
                              <EditBelief
                                key={`${e}-${index}`}
                                selector={e}
                                value={stateHeldBeliefs[e]}
                                index={index}
                                mode="held"
                                handleChangeBelief={handleChangeBelief}
                              />
                            ))
                          : null}
                        {state.hasHeldBeliefsPayload ? (
                          <div className="pl-4 mb-6">
                            <button
                              type="button"
                              className="text-xs"
                              onClick={() => addBelief(`held`)}
                            >
                              Add
                            </button>
                          </div>
                        ) : null}
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.hasWithheldBeliefsPayload}
                              onChange={() => toggleBelief(`withheld`)}
                              className={classNames(
                                state.hasWithheldBeliefsPayload
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.hasWithheldBeliefsPayload
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Exclude on Matching Belief
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                This pane will only display to visitors{` `}
                                <strong>who do not hold</strong> the matching
                                belief
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                        </div>
                        {state.hasWithheldBeliefsPayload
                          ? Object.keys(stateWithheldBeliefs).map(
                              (e, index) => (
                                <EditBelief
                                  selector={e}
                                  key={`${e}-${index}`}
                                  value={stateWithheldBeliefs[e]}
                                  index={index}
                                  mode="withheld"
                                  handleChangeBelief={handleChangeBelief}
                                />
                              ),
                            )
                          : null}
                        {state.hasWithheldBeliefsPayload ? (
                          <div className="pl-4 mb-6">
                            <button
                              type="button"
                              className="text-xs"
                              onClick={() => addBelief(`withheld`)}
                            >
                              Add
                            </button>
                          </div>
                        ) : null}
                        <div className="mt-2 xs:col-span-full">
                          <Switch.Group
                            as="div"
                            className="flex items-center justify-between"
                          >
                            <Switch
                              checked={state.hasImpressions}
                              onChange={() => {
                                if (!state.hasImpressions)
                                  handleChange({
                                    target: {
                                      name: `hasImpressions`,
                                      value: !state.hasImpressions,
                                    },
                                  })
                              }}
                              className={classNames(
                                state.hasImpressions
                                  ? `bg-myorange`
                                  : `bg-slate-300`,
                                `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2`,
                              )}
                            >
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  state.hasImpressions
                                    ? `translate-x-5`
                                    : `translate-x-0`,
                                  `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
                                )}
                              />
                            </Switch>
                            <span className="ml-4 flex flex-grow flex-col">
                              <Switch.Label
                                as="span"
                                className="text-sm leading-6 text-black"
                                passive
                              >
                                Impression
                              </Switch.Label>
                              <Switch.Description
                                as="span"
                                className="text-sm text-slate-500"
                              >
                                Place a call-to-action on this pane
                              </Switch.Description>
                            </span>
                          </Switch.Group>
                          {state.hasImpressions ? (
                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6 p-4 shadow bg-white mb-4">
                              <div className="xs:col-span-4">
                                <label
                                  htmlFor="title"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Title
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="text"
                                      name="title"
                                      id="title"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                      value={stateImpressions.title}
                                      onChange={handleChangeImpression}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="xs:col-span-2">
                                <label
                                  htmlFor="buttonText"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Title (32 chars)
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="text"
                                      name="buttonText"
                                      id="buttonText"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                      value={stateImpressions.buttonText}
                                      onChange={handleChangeImpression}
                                      maxLength={32}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="xs:col-span-6">
                                <label
                                  htmlFor="actionsLisp"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Action Lisp
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="text"
                                      name="actionsLisp"
                                      id="actionsLisp"
                                      pattern="[A-Za-z\(\) ]+"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                      value={stateImpressions.actionsLisp}
                                      onChange={handleChangeImpression}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="xs:col-span-6">
                                <label
                                  htmlFor="body"
                                  className="block text-sm leading-6 text-black"
                                >
                                  Body Text (142 chars)
                                </label>
                                <div>
                                  <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange">
                                    <input
                                      type="text"
                                      name="body"
                                      id="body"
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                      value={stateImpressions.body}
                                      onChange={handleChangeImpression}
                                      maxLength={140}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="hidden">
                                <label htmlFor="id">ID (autogenerated)</label>
                                <input
                                  type="text"
                                  name="id"
                                  id="id"
                                  value={stateImpressions.id}
                                  readOnly
                                />
                                <label htmlFor="parentId">
                                  ID of parent pane
                                </label>
                                <input
                                  type="text"
                                  name="parentId"
                                  id="parentId"
                                  value={stateImpressions.parentId}
                                  readOnly
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  handleChangeImpression({
                                    target: { name: `title`, value: `` },
                                  })
                                  handleChangeImpression({
                                    target: { name: `body`, value: `` },
                                  })
                                  handleChangeImpression({
                                    target: { name: `buttonText`, value: `` },
                                  })
                                  handleChangeImpression({
                                    target: {
                                      name: `actionsLisp`,
                                      value: ``,
                                    },
                                  })
                                  handleChange({
                                    target: {
                                      name: `hasImpressions`,
                                      value: false,
                                    },
                                  })
                                }}
                              >
                                {` `}
                                REMOVE
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6 p-4 shadow bg-white mb-4">
                          <div className="xs:col-span-1 xs:col-start-1">
                            <p className="block text-sm leading-6 text-black font-bold">
                              Height Ratio
                            </p>
                          </div>
                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightRatioDesktop"
                              className="block text-sm leading-6 text-black"
                            >
                              Desktop
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                step=".01"
                                name="heightRatioDesktop"
                                id="heightRatioDesktop"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightRatioDesktop}
                              />
                            </div>
                          </div>

                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightRatioTablet"
                              className="block text-sm leading-6 text-black"
                            >
                              Tablet
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                step=".01"
                                name="heightRatioTablet"
                                id="heightRatioTablet"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightRatioTablet}
                              />
                            </div>
                          </div>

                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightRatioMobile"
                              className="block text-sm leading-6 text-black"
                            >
                              Mobile
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                step=".01"
                                name="heightRatioMobile"
                                id="heightRatioMobile"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightRatioMobile}
                              />
                            </div>
                          </div>

                          <div className="xs:col-span-1 xs:col-start-1">
                            <p className="block text-sm leading-6 text-black font-bold">
                              Height Offset (number of pixels)
                            </p>
                          </div>
                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightOffsetDesktop"
                              className="block text-sm leading-6 text-black"
                            >
                              Desktop
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                name="heightOffsetDesktop"
                                id="heightOffsetDesktop"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightOffsetDesktop}
                              />
                            </div>
                          </div>

                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightOffsetTablet"
                              className="block text-sm leading-6 text-black"
                            >
                              Tablet
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                name="heightOffsetTablet"
                                id="heightOffsetTablet"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightOffsetTablet}
                              />
                            </div>
                          </div>

                          <div className="xs:col-span-1">
                            <label
                              htmlFor="heightOffsetMobile"
                              className="block text-sm leading-6 text-black"
                            >
                              Mobile
                            </label>
                            <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                              <input
                                type="number"
                                name="heightOffsetMobile"
                                id="heightOffsetMobile"
                                className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                                onChange={handleChange}
                                value={state.heightOffsetMobile}
                              />
                            </div>
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
                      Pane
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
                      Pane Settings
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

                  {/* Dropdown */}
                  <Menu as="div" className="relative ml-3 xs:hidden">
                    <Menu.Button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:ring--mydarkgrey">
                      More
                      <ChevronDownIcon
                        className="-mr-1 ml-1.5 h-5 w-5 text-mydarkgrey"
                        aria-hidden="true"
                      />
                    </Menu.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 -mr-1 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? `bg-slate-100` : ``,
                                `block px-4 py-2 text-sm text-mydarkgrey`,
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? `bg-slate-100` : ``,
                                `block px-4 py-2 text-sm text-mydarkgrey`,
                              )}
                            >
                              Delete
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
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
              <div className="mt-2 flex items-center">
                <span className="mr-2 text-sm text-mydarkgrey">Set Mode:</span>
                <span className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    type="button"
                    disabled={flags.saveStage >= SaveStages.PrepareSave}
                    className={classNames(
                      flags.saveStage >= SaveStages.PrepareSave
                        ? ``
                        : `hover:bg-myorange hover:text-white`,
                      interceptMode === `edit`
                        ? `bg-myorange/20 text-allblack`
                        : `bg-white text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10`,
                      `relative inline-flex items-center rounded-l-md px-3 py-2`,
                    )}
                    title="Edit in Place"
                    onClick={() => setInterceptMode(`edit`)}
                  >
                    <span className="sr-only">Toggle Edit in Place Mode</span>
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {Object.keys(stateLivePreviewMarkdown).length ? (
                    <>
                      <button
                        type="button"
                        disabled={flags.saveStage >= SaveStages.PrepareSave}
                        className={classNames(
                          flags.saveStage >= SaveStages.PrepareSave
                            ? ``
                            : `hover:bg-myorange hover:text-white`,
                          interceptMode === `delete`
                            ? `bg-myorange/20 text-allblack`
                            : `bg-white text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10`,
                          `relative inline-flex items-center px-3 py-2`,
                        )}
                        title="Delete Mode"
                        onClick={() => setInterceptMode(`delete`)}
                      >
                        <span className="sr-only">Toggle Delete Mode</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {interceptMode !== `insert` ? (
                        <button
                          type="button"
                          disabled={flags.saveStage >= SaveStages.PrepareSave}
                          className={classNames(
                            flags.saveStage >= SaveStages.PrepareSave
                              ? ``
                              : `hover:bg-myorange hover:text-white`,
                            `bg-white text-mydarkgrey ring-1 ring-inset ring-slate-200 focus:z-10 relative inline-flex items-center rounded-l-md px-3 py-2`,
                          )}
                          title="Insert Mode"
                          onClick={() => setInterceptMode(`insert`)}
                        >
                          <span className="sr-only">Toggle Insert Mode</span>
                          <PlusCircleIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <>
                          <span className="relative inline-flex items-center pl-3 pr-2 py-2 bg-myorange/20">
                            <PlusCircleIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="w-4" />
                          <select
                            id="interceptModeEdit"
                            name="interceptModeEdit"
                            disabled={flags.saveStage >= SaveStages.PrepareSave}
                            className="block w-full bg-white rounded-r-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-myorange xs:text-sm xs:leading-6"
                            value={interceptModeTag}
                            onChange={(e) =>
                              setInterceptModeTag(e.target.value)
                            }
                          >
                            {insertModeTags.map((e) => (
                              <option key={e.name} value={e.name}>
                                {e.title}
                              </option>
                            ))}
                          </select>
                        </>
                      )}
                    </>
                  ) : null}
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
            {flags.isEmptyPane ? (
              <PaneStarter
                state={state}
                fn={{ handleChange, handleChangeEditInPlace }}
                flags={{ slugCollision: flags.slugCollision }}
              />
            ) : (
              <PaneRender
                uuid={uuid}
                handlers={{
                  handleEditMarkdown,
                  handleMutateMarkdown,
                  handleChangeEditInPlace,
                  handleChange,
                }}
                previewPayload={{
                  state,
                  statePaneFragments,
                  stateImpressions,
                  stateLivePreview,
                  stateLivePreviewMarkdown,
                  stateHeldBeliefs,
                  stateWithheldBeliefs,
                  allMarkdown,
                  viewportKey,
                  setViewportKey,
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

export default PaneForm
