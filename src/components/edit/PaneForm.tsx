// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '@tractstack/helpers'
import { LockOpenIcon } from '@heroicons/react/24/outline'

import { useDrupalStore } from '../../stores/drupal'
import Message from '../Message'
import EditBelief from '../EditBelief'
import PaneRender from './PaneRender'
import EditFormPaneFragment from './PaneFragmentForm'

const PaneForm = ({ uuid, payload, flags, fn }: any) => {
  console.log(payload, flags)
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
    handleChangePaneFragment,
    handleChange,
  } = fn
  const [toggleAdvOpt, setToggleAdvOpt] = useState(false)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const viewportKey = useDrupalStore((state) => state.viewportKey)
  const setViewportKey = useDrupalStore((state) => state.setViewportKey)

  return (
    <>
      <section className="relative bg-slate-50">
        <div className="w-full xl:max-w-screen-2xl flex justify-between">
          <div className="font-bold text-xl font-action">
            {state.title}
            {flags.isAuthor ? (
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
          <button
            className="block text-sm leading-6 text-black font-bold underline underline-offset-2 hover:text-myorange"
            onClick={() => setToggleAdvOpt(!toggleAdvOpt)}
          >
            {toggleAdvOpt ? `Hide Advanced Options` : `Show Advanced Options`}
          </button>
        </div>
      </section>
      {toggleAdvOpt ? (
        <section className="relative bg-slate-50">
          <div className="w-full px-6 pt-2 max-w-screen-2xl mt-2 ml-2">
            <form className="max-w-3xl" id="editPane">
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

                    <div className="sm:col-span-full">
                      <p className="block text-sm leading-6 text-black font-bold">
                        Options Payload
                      </p>
                      <div className="mt-2 sm:col-span-full">
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
                        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                          <div className="sm:col-span-2">
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
                                  className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                  value={state.codeHookTarget}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          {state.codeHookTarget === `h5p` ? (
                            <>
                              <div className="sm:col-span-4">
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
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                      value={state.codeHookTargetUrl}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="sm:col-span-2">
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
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                      value={state.codeHookHeight}
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="sm:col-span-2">
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
                                      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
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
                      <div className="mt-2 sm:col-span-full">
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
                              state.hiddenPane ? `bg-myorange` : `bg-slate-300`,
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
                      <div className="mt-2 sm:col-span-full">
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
                              state.hiddenPane ? `bg-myorange` : `bg-slate-300`,
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
                              Engagement with this pane is <strong>not</strong>
                              {` `}
                              stored in knowledge graph
                            </Switch.Description>
                          </span>
                        </Switch.Group>
                      </div>
                      <div className="mt-2 sm:col-span-full">
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
                      <div className="mt-2 sm:col-span-full">
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
                        ? Object.keys(stateWithheldBeliefs).map((e, index) => (
                            <EditBelief
                              selector={e}
                              key={`${e}-${index}`}
                              value={stateWithheldBeliefs[e]}
                              index={index}
                              mode="withheld"
                              handleChangeBelief={handleChangeBelief}
                            />
                          ))
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
                      <div className="mt-2 sm:col-span-full">
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
                          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                            <div className="sm:col-span-4">
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
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.title}
                                    onChange={handleChangeImpression}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-2">
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
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.buttonText}
                                    onChange={handleChangeImpression}
                                    maxLength={32}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-6">
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
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                                    value={stateImpressions.actionsLisp}
                                    onChange={handleChangeImpression}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="sm:col-span-6">
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
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
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
                                  target: { name: `actionsLisp`, value: `` },
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

                      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4">
                        <div className="sm:col-span-1 sm:col-start-1">
                          <p className="block text-sm leading-6 text-black font-bold">
                            Height Ratio
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioDesktop"
                            className="block text-sm leading-6 text-black"
                          >
                            Desktop
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioDesktop"
                              id="heightRatioDesktop"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioDesktop}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioTablet"
                            className="block text-sm leading-6 text-black"
                          >
                            Tablet
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioTablet"
                              id="heightRatioTablet"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioTablet}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightRatioMobile"
                            className="block text-sm leading-6 text-black"
                          >
                            Mobile
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              step=".01"
                              name="heightRatioMobile"
                              id="heightRatioMobile"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightRatioMobile}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1 sm:col-start-1">
                          <p className="block text-sm leading-6 text-black font-bold">
                            Height Offset (number of pixels)
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetDesktop"
                            className="block text-sm leading-6 text-black"
                          >
                            Desktop
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetDesktop"
                              id="heightOffsetDesktop"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetDesktop}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetTablet"
                            className="block text-sm leading-6 text-black"
                          >
                            Tablet
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetTablet"
                              id="heightOffsetTablet"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetTablet}
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-1">
                          <label
                            htmlFor="heightOffsetMobile"
                            className="block text-sm leading-6 text-black"
                          >
                            Mobile
                          </label>
                          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange sm:max-w-md">
                            <input
                              type="number"
                              name="heightOffsetMobile"
                              id="heightOffsetMobile"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
                              onChange={handleChange}
                              value={state.heightOffsetMobile}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-start-1 sm:col-span-full">
                      <p className="block text-sm leading-6 text-black font-bold">
                        Pane Fragments
                      </p>
                      {statePaneFragments &&
                      Object.keys(statePaneFragments).length !== 0 ? (
                        Object.keys(statePaneFragments).map((e) => {
                          return (
                            <EditFormPaneFragment
                              key={e}
                              state={statePaneFragments[e]}
                              handleChange={handleChangePaneFragment}
                            />
                          )
                        })
                      ) : (
                        <span className="text-xs font-action">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      <div className="mt-6 flex items-center justify-start gap-x-6">
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
              window.confirm(`You have unsaved changes. Proceed?`) === true
            ) {
              // setLocked(false)
              // handleToggle(``)
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
            onClick={handleSubmit}
            className="rounded-md bg-myorange px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-myblue hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
          >
            Save
          </button>
        ) : null}
      </div>
      <div id="message" className="mt-6 flex items-center justify-end gap-x-6">
        {formState.success ? (
          <Message className="text-xl text-myorange pb-12">
            <p>Changes have been saved</p>
          </Message>
        ) : null}
      </div>

      <section className="relative my-12">
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
        />
      </section>
    </>
  )
}

export default PaneForm
