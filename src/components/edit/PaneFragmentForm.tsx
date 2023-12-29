// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from '@tractstack/helpers'

import { IEditFormPaneFragment, IFormHandler } from '../../types'

const BackgroundPane = ({ state, handleChange }: IFormHandler) => (
  <>
    <div className="sm:col-span-1">Background Pane</div>
    <div className="sm:col-span-2 sm:col-start-2">
      <label
        htmlFor={`shapeDesktop--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Shape on Desktop
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`shapeDesktop--${state.id}`}
            id={`shapeDesktop--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.shapeDesktop}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2">
      <label
        htmlFor={`shapeTablet--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Shape on Tablet
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`shapeTablet--${state.id}`}
            id={`shapeTablet--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.shapeTablet}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-start-2 sm:col-span-2">
      <label
        htmlFor={`shapeMobile--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Shape on Mobile
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`shapeMobile--${state.id}`}
            id={`shapeMobile--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.shapeMobile}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2">
      <label
        htmlFor={`hiddenViewports--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Hidden Viewports
      </label>
      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green sm:max-w-md">
        <input
          type="text"
          name={`hiddenViewports--${state.id}`}
          id={`hiddenViewports--${state.id}`}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
          value={state.hiddenViewports}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
    <div className="sm:col-start-2 sm:col-span-5">
      <label
        htmlFor={`optionsPayloadString--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Options Payload
      </label>
      <div className="mt-2">
        <textarea
          name={`optionsPayloadString--${state.id}`}
          id={`optionsPayloadString--${state.id}`}
          rows={5}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6"
          value={state.optionsPayloadString}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  </>
)

const Markdown = ({ state, handleChange }: IFormHandler) => (
  <>
    <div className="sm:col-span-1">Markdown Copy</div>
    <div className="sm:col-start-2 sm:col-span-5">
      <label
        htmlFor={`markdownBody--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Body text in Markdown format
      </label>
      <div className="mt-2">
        <textarea
          id={`markdownBody--${state.id}`}
          name={`markdownBody--${state.id}`}
          rows={5}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6"
          value={state.markdownBody}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
    <div className="sm:col-start-2 sm:col-span-5">
      <label
        htmlFor={`optionsPayloadString--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Options Payload
      </label>
      <div className="mt-2">
        <textarea
          id={`optionsPayloadString--${state.id}`}
          name={`optionsPayloadString--${state.id}`}
          rows={7}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-green sm:text-sm sm:leading-6"
          value={state.optionsPayloadString}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
    <div className="sm:col-span-2 sm:col-start-2">
      <label
        htmlFor={`imageMaskShapeDesktop--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Image Mask Shape on Desktop
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`imageMaskShapeDesktop--${state.id}`}
            id={`imageMaskShapeDesktop--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.imageMaskShapeDesktop}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2">
      <label
        htmlFor={`imageMaskShapeTablet--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Image Mask Shape on Tablet
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`imageMaskShapeTablet--${state.id}`}
            id={`imageMaskShapeTablet--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.imageMaskShapeTablet}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-start-2 sm:col-span-2">
      <label
        htmlFor={`imageMaskShapeMobile--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Image Mask Shape on Mobile
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`imageMaskShapeMobile--${state.id}`}
            id={`imageMaskShapeMobile--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.imageMaskShapeMobile}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2 sm:col-start-2">
      <label
        htmlFor={`textShapeOutsideDesktop--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Text Shape Outside on Desktop
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`textShapeOutsideDesktop--${state.id}`}
            id={`textShapeOutsideDesktop--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.textShapeOutsideDesktop}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2">
      <label
        htmlFor={`textShapeOutsideTablet--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Text Shape Outside on Tablet
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`textShapeOutsideTablet--${state.id}`}
            id={`textShapeOutsideTablet--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.textShapeOutsideTablet}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-start-2 sm:col-span-2">
      <label
        htmlFor={`textShapeOutsideMobile--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Text Shape Outside on Mobile
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="text"
            name={`textShapeOutsideMobile--${state.id}`}
            id={`textShapeOutsideMobile--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.textShapeOutsideMobile}
            pattern="[a-z0-9\-]+"
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2 sm:col-start-2">
      <label
        htmlFor={`hiddenViewports--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Hidden Viewports
      </label>
      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green sm:max-w-md">
        <input
          type="text"
          name={`hiddenViewports--${state.id}`}
          id={`hiddenViewports--${state.id}`}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
          value={state.hiddenViewports}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
    <div className="sm:col-span-5 sm:col-start-2">
      <Switch.Group as="div" className="flex items-center justify-between">
        <Switch
          checked={state.isContextPane}
          onChange={(e) =>
            handleChange({
              target: { value: e, id: `isContextPane--${state.id}` },
            })
          }
          className={classNames(
            state.isContextPane ? `bg-myorange` : `bg-slate-300`,
            `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2`,
          )}
        >
          <span
            aria-hidden="true"
            className={classNames(
              state.isContextPane ? `translate-x-5` : `translate-x-0`,
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
            Context Pane
          </Switch.Label>
          <Switch.Description as="span" className="text-sm text-slate-500">
            Special case (only renders markdown body)
          </Switch.Description>
        </span>
      </Switch.Group>
    </div>
  </>
)

const BgColour = ({ state, handleChange }: IFormHandler) => (
  <>
    <div className="sm:col-span-1">Background Colour</div>
    <div className="sm:col-span-1">
      <label
        htmlFor={`bgColour--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Colour
      </label>
      <div>
        <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green">
          <input
            type="color"
            name={`bgColour--${state.id}`}
            id={`bgColour--${state.id}`}
            className="block flex-1 border-0 bg-transparent focus:ring-0"
            value={state.bgColour}
            onChange={(e) => handleChange(e)}
          />
        </div>
      </div>
    </div>
    <div className="sm:col-span-2">
      <label
        htmlFor={`hiddenViewports--${state.id}`}
        className="block text-sm leading-6 text-black"
      >
        Hidden Viewports
      </label>
      <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green sm:max-w-md">
        <input
          type="text"
          name={`hiddenViewports--${state.id}`}
          id={`hiddenViewports--${state.id}`}
          className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 sm:text-sm sm:leading-6"
          value={state.hiddenViewports}
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
  </>
)

const EditFormPaneFragment = ({
  state,
  handleChange,
}: IEditFormPaneFragment) => {
  const FormHandler =
    state?.internal?.type === `bgPane`
      ? BackgroundPane
      : state?.internal?.type === `markdown`
        ? Markdown
        : state?.internal?.type === `bgColour`
          ? BgColour
          : null
  if (!FormHandler) return <div>Missed on {state.type}</div>
  return (
    <div
      key={`EditFormPaneFragment-${state.id}`}
      className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 p-4 shadow bg-white mb-4"
    >
      <FormHandler state={state} handleChange={handleChange} />
    </div>
  )
}

export default EditFormPaneFragment
