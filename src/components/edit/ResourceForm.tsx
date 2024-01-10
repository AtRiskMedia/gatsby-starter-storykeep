// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { classNames } from '@tractstack/helpers'
import { navigate } from 'gatsby'
import {
  LockOpenIcon,
  LockClosedIcon,
  BoltSlashIcon,
  RectangleGroupIcon,
  XMarkIcon,
  SunIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon, LinkIcon, TrashIcon } from '@heroicons/react/20/solid'

import { SaveStages, IFlags } from '../../types'

const ResourceForm = ({
  payload,
  flags,
  fn,
}: {
  payload: any
  flags: IFlags
  fn: { handleChange: Function; handleSubmit: Function; handleDelete: Function }
}) => {
  const { state } = payload
  const { handleChange, handleSubmit, handleDelete } = fn
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

  return (
    <>
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
                    title="You are editing a Resource Node"
                  >
                    <RectangleGroupIcon
                      className="mr-1.5 h-5 w-5 flex-shrink-0 text-mylightgrey"
                      aria-hidden="true"
                    />
                    Resource Node
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
                {flags.isAuthor || flags.isAdmin ? (
                  <span className="ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete this Resource? This cannot be undone.`,
                          )
                        )
                          handleDelete()
                      }}
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
                      onClick={(e) => handleSubmit(e)}
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

                {flags.saveStage === SaveStages.NoChanges ? (
                  <span className="ml-3">
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
                  </span>
                ) : (
                  <span className="ml-3">
                    <button
                      type="button"
                      disabled={flags.saveStage >= SaveStages.PrepareSave}
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
          <p className="text-xl text-myblue">
            Please be careful when making any direct edits. (No data protections
            are currently enforced on resources.)
          </p>
          <p className="text-xl text-myblue mt-2 font-bold">
            A guided wizard is coming soon.
          </p>
        </div>
      </section>
      <section className="relative bg-slate-50">
        <div className="p-6">
          <form
            className="max-w-3xl"
            id="editResource"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="space-y-12">
              <div className="border-b border-black/10 pb-12">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6">
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
                          onChange={(e) => handleChange(e)}
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
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xs:col-span-2">
                    <label
                      htmlFor="categorySlug"
                      className="block text-sm leading-6 text-black"
                    >
                      Category Slug
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                        <input
                          type="text"
                          name="categorySlug"
                          id="categorySlug"
                          pattern="[a-zA-Z\-]+"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                          value={state.categorySlug}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xs:col-span-full max-w-xl">
                    <label
                      htmlFor="oneliner"
                      className="block text-sm leading-6 text-black"
                    >
                      Oneliner
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                        <input
                          type="text"
                          name="oneliner"
                          id="oneliner"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                          value={state.oneliner}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xs:col-span-full">
                    <label
                      htmlFor="actionLisp"
                      className="block text-sm leading-6 text-black"
                    >
                      Action Lisp
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                        <input
                          type="text"
                          name="actionLisp"
                          id="actionLisp"
                          pattern="[a-zA-Z0-9\(\)\- ]+"
                          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                          value={state.actionLisp}
                          onChange={(e) => handleChange(e)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xs:col-span-full">
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
                        className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
                        value={state.optionsPayload}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default ResourceForm
