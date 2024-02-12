// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { ChangeEvent, useState } from 'react'
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { heldBeliefsScales, classNames } from '@tractstack/helpers'

import { useDrupalStore } from '../../stores/drupal'
import { IEditInPlaceControls } from '../../types'
import {
  tailwindSpecialTitle,
  getValidation,
  tailwindAllowedClasses,
} from '../../helpers/allowedTailwindValues'
import {
  paneShapesMobile,
  paneShapesTablet,
  paneShapesDesktop,
  modalShapes,
  shapesMobile,
  shapesTablet,
  shapesDesktop,
  breaksShapes,
  artpackCollections,
  artpackCollectionImages,
} from '../../helpers/allowedShapeNames'

const EditCodeHook = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--title`}
          className="block text-sm leading-6 text-black"
        >
          Code Hook
        </label>
        <input
          type="text"
          name={`${id}--title`}
          id={`${id}--title`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={payload.hook}
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Value 1
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="block text-sm leading-6 text-black"
        >
          Value 2
        </label>
        <input
          type="text"
          name={`${id}--val2`}
          id={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val3`}
          className="block text-sm leading-6 text-black"
        >
          Value 3
        </label>
        <input
          type="text"
          name={`${id}--val3`}
          id={`${id}--val3`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[2] !== `undefined` ? payload.values[2] : ``
          }
        />
      </div>
    </div>
  )
}

const EditCodeHookIdentifyAs = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Belief Tag
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="block text-sm leading-6 text-black"
        >
          Identify As target
        </label>
        <input
          type="text"
          name={`${id}--val2`}
          id={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val3`}
          className="block text-sm leading-6 text-black"
        >
          Question Prompt
        </label>
        <input
          type="text"
          name={`${id}--val3`}
          id={`${id}--val3`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[2] !== `undefined` ? payload.values[2] : ``
          }
        />
      </div>
    </div>
  )
}

const EditCodeHookBelief = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Belief Slug
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="pr-2 block text-sm leading-6 text-black"
        >
          Scale
        </label>
        <select
          id={`${id}--val2`}
          name={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        >
          {Object.keys(heldBeliefsScales).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val3`}
          className="block text-sm leading-6 text-black"
        >
          Question Prompt
        </label>
        <input
          type="text"
          name={`${id}--val3`}
          id={`${id}--val3`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[2] !== `undefined` ? payload.values[2] : ``
          }
        />
      </div>
    </div>
  )
}

const EditCodeHookToggleBelief = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  const lookup: keyof typeof heldBeliefsScales = payload.values[1]
  const scales = heldBeliefsScales[lookup]
  const possibleValues = scales.map((e: any) => {
    return e.slug
  })
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Belief Slug
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="pr-2 block text-sm leading-6 text-black"
        >
          Scale
        </label>
        <select
          id={`${id}--val2`}
          name={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        >
          {Object.keys(heldBeliefsScales).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="pr-2 block text-sm leading-6 text-black"
        >
          Target Value
        </label>
        <select
          id={`${id}--val2`}
          name={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[2] !== `undefined` ? payload.values[2] : ``
          }
        >
          {possibleValues.map((e: string) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val4`}
          className="block text-sm leading-6 text-black"
        >
          Question Prompt
        </label>
        <input
          type="text"
          name={`${id}--val4`}
          id={`${id}--val4`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[3] !== `undefined` ? payload.values[3] : ``
          }
        />
      </div>
    </div>
  )
}

const EditCodeHookYouTube = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Embed Code
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="block text-sm leading-6 text-black"
        >
          Title
        </label>
        <input
          type="text"
          name={`${id}--val2`}
          id={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        />
      </div>
    </div>
  )
}

const EditCodeHookResource = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--val1`}
          className="block text-sm leading-6 text-black"
        >
          Slug
        </label>
        <input
          type="text"
          name={`${id}--val1`}
          id={`${id}--val1`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[0] !== `undefined` ? payload.values[0] : ``
          }
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--val2`}
          className="block text-sm leading-6 text-black"
        >
          Template
        </label>
        <input
          type="text"
          name={`${id}--val2`}
          id={`${id}--val2`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={
            typeof payload.values[1] !== `undefined` ? payload.values[1] : ``
          }
        />
      </div>
    </div>
  )
}

const EditLink = ({
  id,
  payload,
  viewportKey,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  viewportKey: string
  handleChangeEditInPlace: Function
}) => {
  return (
    <div key={id}>
      <div className="my-2">
        <label
          htmlFor={`${id}--title`}
          className="block text-sm leading-6 text-black"
        >
          Title
        </label>
        <input
          type="text"
          name={`${id}--title`}
          id={`${id}--title`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={payload.value}
        />
      </div>
      <div className="my-2">
        <label
          htmlFor={`${id}--callback`}
          className="block text-sm leading-6 text-black"
        >
          Callback Payload
        </label>
        <input
          type="text"
          name={`${id}--callback`}
          id={`${id}--callback`}
          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-mylightgrey placeholder:text-mydarkgrey focus:ring-2 focus:ring-inset focus:ring-myorange xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={payload.callbackPayload}
        />
      </div>
      <span className="block mt-6 font-bold">Link styles</span>
      {!payload?.classNamesPayload?.button?.classes ||
      !Object.keys(payload.classNamesPayload.button.classes).length ? (
        <span className="block my-2">No styles</span>
      ) : (
        Object.keys(payload.classNamesPayload.button.classes).map((e: any) => {
          const thisPayload =
            typeof payload.classNamesPayload.button.classes[e] !== `undefined`
              ? payload.classNamesPayload.button.classes[e]
              : null
          if (thisPayload)
            return (
              <InputTailwindClass
                id={id}
                key={`${id}-${e}-link-${viewportKey}`}
                payload={{
                  [e]: thisPayload,
                }}
                viewportKey={viewportKey}
                allowOverride={false}
                handleChangeEditInPlace={handleChangeEditInPlace}
              />
            )
          return null
        })
      )}
      <div className="mt-2 inline-flex items-center">
        <label
          htmlFor={`add---${id}`}
          className="pr-2 block text-sm leading-6 text-black"
        >
          Add&nbsp;Style
        </label>
        <select
          id={`add---${id}`}
          name={`add---${id}`}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={` `}
        >
          <option>{` `}</option>
          {tailwindAllowedClasses.map((e) => (
            <option key={e} value={e}>
              {tailwindSpecialTitle[e]}
            </option>
          ))}
        </select>
      </div>
      <span className="block mt-6 font-bold">Link hover styles</span>
      {!payload?.classNamesPayload?.hover?.classes ||
      !Object.keys(payload.classNamesPayload.hover.classes).length ? (
        <span className="block my-2">No styles</span>
      ) : (
        Object.keys(payload.classNamesPayload.hover.classes).map((e: any) => {
          const thisPayload =
            typeof payload.classNamesPayload.hover.classes[e] !== `undefined`
              ? payload.classNamesPayload.hover.classes[e]
              : null
          if (thisPayload)
            return (
              <InputTailwindClass
                id={`hover---${id}`}
                key={`${id}-${e}-hover-${viewportKey}`}
                payload={{
                  [e]: thisPayload,
                }}
                viewportKey={viewportKey}
                allowOverride={false}
                handleChangeEditInPlace={handleChangeEditInPlace}
              />
            )
          return null
        })
      )}
      <div className="mt-2 inline-flex items-center">
        <label
          htmlFor={`add---${id}`}
          className="pr-2 block text-sm leading-6 text-black"
        >
          Add&nbsp;Style
        </label>
        <select
          id={`add---hover---${id}`}
          name={`add---hover---${id}`}
          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
          onChange={(e) => handleChangeEditInPlace(e)}
          value={` `}
        >
          <option>{` `}</option>
          {tailwindAllowedClasses.map((e) => (
            <option key={e} value={e}>
              {tailwindSpecialTitle[e]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

const EditShape = ({
  id,
  payload,
  viewportKey,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  viewportKey: string
  handleChangeEditInPlace: Function
}) => {
  const isBreaks = payload.type === `breaksShape`
  const isModal = payload.type === `modalShape`
  const isArtpackImage =
    payload.type === `paneShape` &&
    typeof payload?.artpackPayload?.all?.image === `string`
  return (
    <>
      <div>
        <div className="inline-flex border border-myblue/20 border-dashed bg-black/10">
          <div
            className={classNames(
              viewportKey === `mobile` ? `bg-myorange/20` : `bg-black/20`,
              `w-16 my-auto h-fit fill-white stroke stroke-black text-xs text-white text-center`,
            )}
            title="Shape on small screens"
          >
            {payload.mobile.svg}
          </div>
          <span className="w-1 bg-slate-100"></span>
          <div
            className={classNames(
              viewportKey === `tablet` ? `bg-myorange/20` : `bg-black/20`,
              `w-24 my-auto h-fit fill-white stroke stroke-black text-xs text-white text-center`,
            )}
            title="Shape on medium screens"
          >
            {payload.tablet.svg}
          </div>
          <span className="w-1 bg-slate-100"></span>
          <div
            className={classNames(
              viewportKey === `desktop` ? `bg-myorange/20` : `bg-black/20`,
              `w-32 my-auto h-fit fill-white stroke stroke-black text-xs text-white text-center`,
            )}
            title="Shape on large screens"
          >
            {payload.desktop.svg}
          </div>
        </div>
      </div>

      <InputShapeName
        id={id}
        payload={payload}
        viewportKey={viewportKey}
        handleChangeEditInPlace={handleChangeEditInPlace}
      />

      {isModal ? (
        <InputModalPayload
          id={id}
          payload={payload}
          viewportKey={viewportKey}
          handleChangeEditInPlace={handleChangeEditInPlace}
        />
      ) : null}

      {isArtpackImage ? (
        <InputArtpackImagePayload
          id={`paneShapeArtpackPayload---${id.substring(12)}`}
          payload={payload}
          handleChangeEditInPlace={handleChangeEditInPlace}
        />
      ) : null}

      {isBreaks ? (
        <InputBreaksShapePayload
          id={`paneShapeBreaksPayload---${id.substring(12)}`}
          payload={payload}
          handleChangeEditInPlace={handleChangeEditInPlace}
        />
      ) : null}
    </>
  )
}

const InputTailwindClass = ({
  id,
  payload,
  viewportKey,
  allowOverride,
  handleChangeEditInPlace,
}: {
  id: string | null
  payload: any
  viewportKey: string
  allowOverride: boolean
  handleChangeEditInPlace: Function
}) => {
  if (Object.keys(payload).length === 0) return null
  if (!id) console.log(`why isn't id set?`, payload)
  const selector = Object.keys(payload)[0]
  const thisId = `${id}--${selector}`
  const hasOverrideTemp = [...payload[selector]]
  const hasOverride = hasOverrideTemp[3]
  const title =
    typeof tailwindSpecialTitle[selector] === `string`
      ? tailwindSpecialTitle[selector]
      : selector
  const values = getValidation(payload)
  return (
    <div className="my-3">
      <fieldset>
        <div className="flex justify-between flex-row">
          <div className="inline-flex">
            <legend
              className="block text-sm leading-6 text-myblack"
              title={`Apply styles to ${title}`}
            >
              {title}
              {` `}
              {hasOverride ? (
                <span className="text-myorange">(override)</span>
              ) : null}
            </legend>
            {allowOverride ? (
              <>
                <span className="w-3"></span>
                <input
                  // workaround to allow dynamic update of override state
                  key={Math.random()}
                  id={`override---${thisId}`}
                  name={`override---${thisId}`}
                  type="checkbox"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className="my-auto h-4 w-4 rounded border-mylightgrey text-myorange focus:ring-myorange"
                  title="When checked this style applies only to the selected element."
                  defaultChecked={hasOverride}
                />
                <span className="w-1"></span>
                <InformationCircleIcon
                  className="my-auto w-5 h-5 text-myblue hover:text-myorange"
                  title="When checked this style applies only to the selected element."
                />
              </>
            ) : null}
          </div>
          <div className="inline-flex">
            <button
              onClick={() =>
                handleChangeEditInPlace({
                  target: {
                    name: `${thisId}-remove`,
                    value: null,
                  },
                })
              }
            >
              <XMarkIcon
                className="my-auto w-3 h-3 text-myorange hover:text-black"
                title={hasOverride ? `Remove override` : `Remove style`}
              />
            </button>
          </div>
        </div>
        <div className="-space-y-px rounded-md bg-white shadow-sm">
          <div className="flex -space-x-px">
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-mobile`} className="sr-only">
                Editing {selector} value on small screens
              </label>
              <select
                name={`${thisId}-mobile`}
                title="Editing {selector} value on small screens"
                id={`${thisId}-mobile`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `mobile` ? `bg-myorange/20` : `bg-black/20`,
                  `font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={
                  typeof payload[selector] !== `undefined` &&
                  typeof payload[selector][0] !== `undefined` &&
                  payload[selector][0]
                    ? payload[selector][0]
                    : `=`
                }
              >
                <option>=</option>
                {values &&
                  values.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-tablet`} className="sr-only">
                Editing {selector} value on medium screens
              </label>
              <select
                name={`${thisId}-tablet`}
                title="Editing {selector} value on medium screens"
                id={`${thisId}-tablet`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `tablet` ? `bg-myorange/20` : `bg-black/20`,
                  `font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={
                  typeof payload[selector] !== `undefined` &&
                  typeof payload[selector][1] !== `undefined` &&
                  payload[selector][1]
                    ? payload[selector][1]
                    : `=`
                }
              >
                <option>=</option>
                {values &&
                  values.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-desktop`} className="sr-only">
                Editing {selector} value on large screens
              </label>
              <select
                name={`${thisId}-desktop`}
                title="Editing {selector} value on large screens"
                id={`${thisId}-desktop`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `desktop` ? `bg-myorange/20` : `bg-black/20`,
                  `font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={
                  typeof payload[selector] !== `undefined` &&
                  typeof payload[selector][2] !== `undefined` &&
                  payload[selector][2]
                    ? payload[selector][2]
                    : `=`
                }
              >
                <option>=</option>
                {values &&
                  values.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

const InputShapeName = ({
  id,
  payload,
  viewportKey,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  viewportKey: string
  handleChangeEditInPlace: Function
}) => {
  const thisId = `${id}--name`
  const mobileValue = [`paneShape`, `modalShape`, `textShapeOutside`].includes(
    payload.type,
  )
    ? payload.mobile.name
    : `${payload.artpackPayload.mobile.collection}${payload.artpackPayload.mobile.image}`
  const tabletValue = [`paneShape`, `modalShape`, `textShapeOutside`].includes(
    payload.type,
  )
    ? payload.tablet.name
    : `${payload.artpackPayload.tablet.collection}${payload.artpackPayload.tablet.image}`
  const desktopValue = [`paneShape`, `modalShape`, `textShapeOutside`].includes(
    payload.type,
  )
    ? payload.desktop.name
    : `${payload.artpackPayload.desktop.collection}${payload.artpackPayload.desktop.image}`
  const valuesMobile =
    payload.type === `paneShape`
      ? paneShapesMobile
      : payload.type === `modalShape`
        ? modalShapes
        : payload.type === `breaksShape`
          ? breaksShapes
          : payload.type === `textShapeOutside`
            ? shapesMobile
            : []
  const valuesTablet =
    payload.type === `paneShape`
      ? paneShapesTablet
      : payload.type === `modalShape`
        ? modalShapes
        : payload.type === `breaksShape`
          ? breaksShapes
          : payload.type === `textShapeOutside`
            ? shapesTablet
            : []
  const valuesDesktop =
    payload.type === `paneShape`
      ? paneShapesDesktop
      : payload.type === `modalShape`
        ? modalShapes
        : payload.type === `breaksShape`
          ? breaksShapes
          : payload.type === `textShapeOutside`
            ? shapesDesktop
            : []

  return (
    <div className="my-3">
      <fieldset>
        <div className="flex justify-between flex-row">
          <div className="inline-flex">
            <legend
              className="block text-sm leading-6 text-myblack"
              title="Shape Name"
            >
              Shape Name
            </legend>
          </div>
          <div className="inline-flex">
            <button
              onClick={() =>
                handleChangeEditInPlace({
                  target: {
                    name: `${thisId}-remove`,
                    value: null,
                  },
                })
              }
            >
              <XMarkIcon
                className="my-auto w-3 h-3 text-myorange hover:text-black"
                title="Remove"
              />
            </button>
          </div>
        </div>
        <div className="-space-y-px rounded-md bg-white shadow-sm">
          <div className="flex -space-x-px">
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-mobile`} className="sr-only">
                Select shape for small screens
              </label>
              <select
                name={`${thisId}-mobile`}
                id={`${thisId}-mobile`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `mobile`
                    ? `bg-myorange/5`
                    : `bg-mylightgrey/50`,
                  `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={mobileValue}
              >
                {valuesMobile &&
                  valuesMobile.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-tablet`} className="sr-only">
                Select shape for medium screens
              </label>
              <select
                name={`${thisId}-tablet`}
                id={`${thisId}-tablet`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `tablet`
                    ? `bg-myorange/5`
                    : `bg-mylightgrey/50`,
                  `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={tabletValue}
              >
                {valuesTablet &&
                  valuesTablet.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <label htmlFor={`${thisId}-desktop`} className="sr-only">
                Select shape for large screens
              </label>
              <select
                name={`${thisId}-desktop`}
                id={`${thisId}-desktop`}
                onChange={(e) => handleChangeEditInPlace(e)}
                className={classNames(
                  viewportKey === `desktop`
                    ? `bg-myorange/5`
                    : `bg-mylightgrey/50`,
                  `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                )}
                value={desktopValue}
              >
                {valuesDesktop &&
                  valuesDesktop.map((o, idx) => <option key={idx}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

const InputModalPayload = ({
  id,
  payload,
  viewportKey,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  viewportKey: string
  handleChangeEditInPlace: Function
}) => {
  return (
    <>
      <div className="my-3">
        <fieldset>
          <div className="flex justify-between flex-row">
            <div className="inline-flex">
              <legend
                className="block text-sm leading-6 text-myblack"
                title="Modal - Padding Left"
              >
                Modal - Padding Left
              </legend>
            </div>
          </div>
          <div className="-space-y-px rounded-md bg-white shadow-sm">
            <div className="flex -space-x-px">
              <div className="w-1/3 min-w-0 flex-1">
                <label
                  htmlFor={`${id}--paddingLeft-mobile`}
                  className="sr-only"
                >
                  Padding Left on small screens
                </label>
                <input
                  name={`${id}--paddingLeft-mobile`}
                  id={`${id}--paddingLeft-mobile`}
                  type="number"
                  step="1"
                  min="0"
                  max="600"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `mobile`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.mobile.paddingLeft}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label
                  htmlFor={`${id}--paddingLeft-tablet`}
                  className="sr-only"
                >
                  Padding Left on medium screens
                </label>
                <input
                  name={`${id}--paddingLeft-tablet`}
                  id={`${id}--paddingLeft-tablet`}
                  type="number"
                  step="1"
                  min="0"
                  max="1080"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `tablet`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.tablet.paddingLeft}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label
                  htmlFor={`${id}--paddingLeft-desktop`}
                  className="sr-only"
                >
                  Padding Left on large screens
                </label>
                <input
                  name={`${id}--paddingLeft-desktop`}
                  id={`${id}--paddingLeft-desktop`}
                  type="number"
                  step="1"
                  min="0"
                  max="1920"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `desktop`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.desktop.paddingLeft}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="my-3">
        <fieldset>
          <div className="flex justify-between flex-row">
            <div className="inline-flex">
              <legend
                className="block text-sm leading-6 text-myblack"
                title="Modal - Padding Top"
              >
                Modal - Padding Top
              </legend>
            </div>
          </div>
          <div className="-space-y-px rounded-md bg-white shadow-sm">
            <div className="flex -space-x-px">
              <div className="w-1/3 min-w-0 flex-1">
                <label htmlFor={`${id}--paddingTop-mobile`} className="sr-only">
                  Padding Top on small screens
                </label>
                <input
                  name={`${id}--paddingTop-mobile`}
                  id={`${id}--paddingTop-mobile`}
                  type="number"
                  step="1"
                  min="0"
                  max="300"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `mobile`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.mobile.paddingTop}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label htmlFor={`${id}--paddingTop-tablet`} className="sr-only">
                  Padding Top on medium screens
                </label>
                <input
                  name={`${id}--paddingTop-tablet`}
                  id={`${id}--paddingTop-tablet`}
                  type="number"
                  step="1"
                  min="0"
                  max="540"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `tablet`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.tablet.paddingTop}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label
                  htmlFor={`${id}--paddingTop-desktop`}
                  className="sr-only"
                >
                  Padding Top on large screens
                </label>
                <input
                  name={`${id}--paddingTop-desktop`}
                  id={`${id}--paddingTop-desktop`}
                  type="number"
                  step="1"
                  min="0"
                  max="960"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `desktop`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.desktop.paddingTop}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="my-3">
        <fieldset>
          <div className="flex justify-between flex-row">
            <div className="inline-flex">
              <legend
                className="block text-sm leading-6 text-myblack"
                title="Modal - Zoom Factor"
              >
                Modal - Zoom Factor
              </legend>
            </div>
          </div>
          <div className="-space-y-px rounded-md bg-white shadow-sm">
            <div className="flex -space-x-px">
              <div className="w-1/3 min-w-0 flex-1">
                <label htmlFor={`${id}--zoomFactor-mobile`} className="sr-only">
                  Zoom Factor on small screens
                </label>
                <input
                  name={`${id}--zoomFactor-mobile`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  id={`${id}--zoomFactor-mobile`}
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `mobile`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.mobile.zoomFactor}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label htmlFor={`${id}--zoomFactor-tablet`} className="sr-only">
                  Zoom Factor on medium screens
                </label>
                <input
                  name={`${id}--zoomFactor-tablet`}
                  id={`${id}--zoomFactor-tablet`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `tablet`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.tablet.zoomFactor}
                />
              </div>
              <div className="w-1/3 min-w-0 flex-1">
                <label
                  htmlFor={`${id}--zoomFactor-desktop`}
                  className="sr-only"
                >
                  Zoom Factor on large screens
                </label>
                <input
                  name={`${id}--zoomFactor-desktop`}
                  id={`${id}--zoomFactor-desktop`}
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  onChange={(e) => handleChangeEditInPlace(e)}
                  className={classNames(
                    viewportKey === `desktop`
                      ? `bg-myorange/5`
                      : `bg-transparent`,
                    `relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`,
                  )}
                  value={payload.desktop.zoomFactor}
                />
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  )
}

const InputBreaksShapePayload = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  return (
    <div className="my-3">
      <fieldset>
        <div className="flex justify-between flex-row">
          <div className="inline-flex">
            <legend
              className="block text-sm leading-6 text-myblack"
              title="Shape Fill Colour"
            >
              Shape Fill Colour
            </legend>
          </div>
        </div>
        <div className="-space-y-px rounded-md bg-white shadow-sm">
          <div className="flex -space-x-px">
            <div className="w-1/3 min-w-0 flex-1">
              <input
                type="color"
                name={`${id}--svgFill-mobile}`}
                id={`${id}--svgFill-mobile}`}
                className="block h-12 flex-1 border-0 bg-transparent focus:ring-0"
                value={payload.artpackPayload.mobile.svgFill}
                onChange={(e) => handleChangeEditInPlace(e)}
              />
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <input
                type="color"
                name={`${id}--svgFill-tablet}`}
                id={`${id}--svgFill-tablet}`}
                className="block h-12 flex-1 border-0 bg-transparent focus:ring-0"
                value={payload.artpackPayload.tablet.svgFill}
                onChange={(e) => handleChangeEditInPlace(e)}
              />
            </div>
            <div className="w-1/3 min-w-0 flex-1">
              <input
                type="color"
                name={`${id}--svgFill-desktop}`}
                id={`${id}--svgFill-desktop}`}
                className="block h-12 flex-1 border-0 bg-transparent focus:ring-0"
                value={payload.artpackPayload.desktop.svgFill}
                onChange={(e) => handleChangeEditInPlace(e)}
              />
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

const InputArtpackImagePayload = ({
  id,
  payload,
  handleChangeEditInPlace,
}: {
  id: string
  payload: any
  handleChangeEditInPlace: Function
}) => {
  const thisCollection = payload?.artpackPayload?.all?.collection
  const thisImage = payload?.artpackPayload?.all?.image
  const objectFit = payload?.artpackPayload?.all?.objectFit
  const thisCollectionImages = artpackCollectionImages(thisCollection)

  return (
    <div key={id}>
      <div className="mb-4">
        <label
          htmlFor={`${id}--collection`}
          className="block text-sm leading-6 text-black"
        >
          Uses Artpack Collection
        </label>
        <select
          name={`${id}--collection`}
          id={`${id}--collection`}
          className={`font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`}
          onChange={(e) => handleChangeEditInPlace(e)}
          value={thisCollection}
        >
          {artpackCollections.map((o, idx) => (
            <option key={idx}>{o}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor={`${id}--image`}
          className="block text-sm leading-6 text-black"
        >
          Image
        </label>
        <select
          name={`${id}--image`}
          id={`${id}--image`}
          className={`font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`}
          onChange={(e) => handleChangeEditInPlace(e)}
          value={thisImage}
        >
          {Object.keys(thisCollectionImages.images).map((o, idx) => (
            <option key={idx}>
              {
                thisCollectionImages.images[
                  o as keyof typeof thisCollectionImages.images
                ]
              }
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label
          htmlFor={`${id}--objectFit`}
          className="block text-sm leading-6 text-black"
        >
          Object Fit
        </label>
        <select
          name={`${id}--objectFit`}
          id={`${id}--objectFit`}
          className={`font-action relative block w-full rounded-none rounded-bl-md border-0 py-1.5 text-black ring-1 ring-inset ring-slate-200 placeholder:text-mydarkgrey focus:z-10 focus:ring-2 focus:ring-inset focus:ring-myorange text-xs leading-6`}
          onChange={(e) => handleChangeEditInPlace(e)}
          value={objectFit}
        >
          {[`cover`, `contain`].map((o, idx) => (
            <option key={idx}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

const PaneEditInPlace = ({
  tag,
  tagType,
  nth,
  childNth,
  childGlobalNth,
  stateLivePreview,
  stateLivePreviewMarkdown,
  handleChangeEditInPlace,
  viewportKey,
  reset,
  pageStylesPagination,
  setPageStylesPagination,
  hasBgColourId,
  hasBgColour,
  hasBreaks,
  setLocked,
  handleUnsavedImage,
  showImageLibrary,
  setShowImageLibrary,
  isOpenDemo,
  setNewImage,
}: IEditInPlaceControls) => {
  const allFiles = useDrupalStore((state) => state.allFiles)
  const [filterString, setFilterString] = useState(``)
  const parentClasses = stateLivePreview?.parentClasses
  const hasParentClasses =
    parentClasses && Object.keys(parentClasses).length > 0
  const modalClasses = stateLivePreview?.modalClasses
  const hasModalClasses = modalClasses && Object.keys(modalClasses).length > 0
  const shapesData = stateLivePreview.shapes
  const modalData = stateLivePreview.modal
  const listItemsLookup = stateLivePreviewMarkdown.listItemsLookup
  const codeItems = stateLivePreviewMarkdown.codeItems
  const codeItemsLookup = stateLivePreviewMarkdown.codeItemsLookup
  const codeHook =
    (tag === `li` || tag === `code`) &&
    typeof codeItemsLookup[nth] !== `undefined` &&
    typeof codeItems[codeItemsLookup[nth][childNth]] !== `undefined`
      ? codeItems[codeItemsLookup[nth][childNth]]
      : null
  const links = stateLivePreviewMarkdown.links
  const linksLookup = stateLivePreviewMarkdown.linksLookup
  const linksData =
    linksLookup && typeof linksLookup[nth] !== `undefined`
      ? Object.keys(linksLookup[nth])?.map(
          (l: any) => links[linksLookup[nth][l]],
        )
      : null
  const images = stateLivePreviewMarkdown.images
  const imagesLookup = stateLivePreviewMarkdown.imagesLookup
  const imageData =
    tag === `img` &&
    imagesLookup &&
    images &&
    typeof imagesLookup[nth] !== `undefined` &&
    typeof images[imagesLookup[nth][childNth]] !== `undefined`
      ? images[imagesLookup[nth][childNth]]
      : null
  const modalState =
    typeof stateLivePreview?.modalClasses !== `undefined`
      ? stateLivePreview.modalClasses
      : null
  const modalId = `modal`
  const parentState =
    pageStylesPagination > -1 &&
    stateLivePreview?.parentClasses &&
    typeof stateLivePreview?.parentClasses[pageStylesPagination] !== `undefined`
      ? stateLivePreview.parentClasses[pageStylesPagination]
      : {}
  const parentId =
    pageStylesPagination > -1 ? `${pageStylesPagination}--parent` : `0--parent`
  const tagTypeTitle = !codeHook
    ? tagType
    : codeHook?.hook === `youtube`
      ? `YouTube Video Embed`
      : codeHook?.hook === `resource`
        ? `Resource Embed`
        : codeHook?.hook === `identifyAs`
          ? `IdentifyAs Widget`
          : codeHook?.hook === `belief`
            ? `Belief Widget`
            : codeHook?.hook === `toggle`
              ? `Toggle Belief Widget`
              : `Code Hook`
  const state =
    childNth === -1 &&
    stateLivePreview?.childClasses &&
    typeof stateLivePreview?.childClasses[tag] !== `undefined` &&
    typeof stateLivePreview?.childClasses[tag][nth] !== `undefined`
      ? stateLivePreview.childClasses[tag][nth]
      : childNth > -1 &&
          childGlobalNth > -1 &&
          typeof stateLivePreview?.childClasses[tag] !== `undefined` &&
          typeof stateLivePreview?.childClasses[tag][childGlobalNth] !==
            `undefined`
        ? stateLivePreview.childClasses[tag][childGlobalNth]
        : {}
  const id =
    childNth > -1 &&
    childGlobalNth > -1 &&
    typeof stateLivePreview?.childClasses[tag] !== `undefined` &&
    typeof stateLivePreview?.childClasses[tag][childGlobalNth] !== `undefined`
      ? `${nth}-${childNth}--${tag}`
      : `${nth}--${tag}`
  const listItemGlobalNth =
    tag === `img` &&
    listItemsLookup &&
    typeof listItemsLookup[nth] !== `undefined` &&
    typeof listItemsLookup[nth][childNth] !== `undefined`
      ? listItemsLookup[nth][childNth]
      : null
  const listItemState =
    tag === `img` &&
    childNth > -1 &&
    childGlobalNth > -1 &&
    typeof stateLivePreview?.childClasses.li !== `undefined` &&
    typeof stateLivePreview?.childClasses.li[listItemGlobalNth] !== `undefined`
      ? stateLivePreview.childClasses.li[listItemGlobalNth]
      : {}
  const listItemId = tag === `img` ? `${nth}-${childNth}--li` : null
  const actualTag =
    stateLivePreviewMarkdown &&
    stateLivePreviewMarkdown?.markdownTags &&
    typeof stateLivePreviewMarkdown.markdownTags[nth] !== `undefined`
      ? stateLivePreviewMarkdown.markdownTags[nth]
      : null
  const outerListState =
    [`img`, `li`].includes(tag) &&
    childNth > -1 &&
    childGlobalNth > -1 &&
    typeof stateLivePreview?.childClasses[actualTag] !== `undefined` &&
    typeof stateLivePreview?.childClasses[actualTag][nth] !== `undefined`
      ? stateLivePreview.childClasses[actualTag][nth]
      : {}
  const outerListId =
    tag === `img` || tag === `li` ? `${nth}--${actualTag}` : null
  const outerCodeState =
    tag === `code` &&
    childNth > -1 &&
    childGlobalNth > -1 &&
    typeof stateLivePreview?.childClasses.code !== `undefined` &&
    typeof stateLivePreview?.childClasses.code[childGlobalNth] !== `undefined`
      ? stateLivePreview.childClasses.code[childGlobalNth]
      : {}
  const outerCodeId = tag === `code` ? `${nth}--ul` : null
  const bgColour = typeof hasBgColour === `string` ? hasBgColour : `#ffffff`
  const textShapeOutside = stateLivePreviewMarkdown?.hasTextShapeOutside
    ? stateLivePreviewMarkdown.textShapeOutside
    : null

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }
  const converterDataURItoBlob = (dataURI: string) => {
    let byteString
    if (dataURI.split(`,`)[0].indexOf(`base64`) >= 0) {
      byteString = atob(dataURI.split(`,`)[1])
    } else {
      byteString = encodeURI(dataURI.split(`,`)[1])
    }
    const mimeString = dataURI.split(`,`)[0].split(`:`)[1].split(`;`)[0]
    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ia], { type: mimeString })
  }

  const handleFileRead = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.length ? event?.target?.files[0] : null
    if (file) {
      const base64 = await convertBase64(file)
      const binary = converterDataURItoBlob(base64 as string)
      setNewImage({
        filename: `${Math.random().toString(36).substr(2, 4)}-${file.name}`,
        filetype: file.type,
        binary,
        nth,
        childNth,
        childGlobalNth,
      })
    }
  }
  const files =
    allFiles &&
    Object.keys(allFiles)
      .map((e: any) => {
        if (
          !allFiles[e].title.toLowerCase().includes(filterString.toLowerCase())
        )
          return null
        if (
          [`image/png`, `image/jpeg`, `image/svg+xml`].includes(
            allFiles[e].filemime,
          )
        )
          return {
            id: e,
            name: allFiles[e].title,
            imageSrc: allFiles[e].localFile.publicURL,
            imageType: allFiles[e].filemime,
          }
        return null
      })
      .filter((e) => e)

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    if (name === `filterString`) setFilterString(value)
  }

  return (
    <>
      {showImageLibrary ? (
        <div className="mb-4 bg-white shadow rounded-lg max-w-md">
          <div className="px-3 py-5 p-6">
            <div className="inline-flex">
              <span className="font-action my-auto">Select an Image</span>
              <span className="w-2"></span>
              <button
                className="bg-transparent text-mydarkgrey hover:bg-myorange rounded-md px-3 py-2 text-xs font-action"
                onClick={() => {
                  setShowImageLibrary(false)
                  setLocked(false)
                }}
                title="Toggle out of view"
              >
                Cancel
              </button>
            </div>

            {(files && Object.keys(files).length) || filterString ? (
              <div className="my-2">
                <label
                  htmlFor="filterString"
                  className="text-sm leading-6 text-black inline-block"
                >
                  Type to filter results
                </label>
                <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                  <input
                    type="text"
                    name="filterString"
                    id="filterString"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                    value={filterString}
                    onChange={(e) => handleChangeFilter(e)}
                  />
                </div>
              </div>
            ) : null}

            <ul role="list" className="divide-y divide-slate-200">
              {!files ||
              (files && Object.keys(files).length === 0 && !filterString) ? (
                <p>no images</p>
              ) : files && Object.keys(files).length === 0 && filterString ? (
                <p>no matches</p>
              ) : (
                files &&
                files.map((image: any) => (
                  <li key={image.id}>
                    <button
                      className="flex items-center py-6 hover:bg-mygreen/10 w-full"
                      title={image.name}
                      onClick={() =>
                        handleUnsavedImage(
                          image.id,
                          nth,
                          childNth,
                          childGlobalNth,
                        )
                      }
                    >
                      <img
                        src={image.imageSrc}
                        alt={image.name}
                        className="h-auto my-auto w-16 flex-none rounded-md border border-slate-200"
                      />
                      <div className="ml-4 flex-auto overflow-hidden">
                        <h3 className="text-left text-myblack font-action truncate">
                          {image.name}
                        </h3>
                        <p className="text-left text-mydarkgrey font-main text-sm truncate">
                          {image.imageType}
                        </p>
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : (
        <>
          {state && id && tag ? (
            <div className="mb-4 bg-white shadow rounded-lg max-w-md">
              <div className="px-3 py-5 p-6">
                {tagTypeTitle ? (
                  <div className="inline-flex">
                    <span className="font-action my-auto">
                      This {tagTypeTitle}
                    </span>
                    {!codeHook ? (
                      <>
                        <span className="w-1"></span>
                        <InformationCircleIcon
                          className="my-auto w-5 h-5 text-myblue hover:text-myorange"
                          title={`By default styles are applied to all ${tagTypeTitle}.`}
                        />
                      </>
                    ) : null}
                    <span className="w-2"></span>
                    <button
                      className="bg-transparent text-mydarkgrey hover:bg-myorange rounded-md px-3 py-2 text-xs font-action"
                      onClick={() => reset()}
                      title="Toggle out of view"
                    >
                      Hide
                    </button>
                  </div>
                ) : null}
                {imageData ? (
                  <>
                    {imageData.alt === `ImagePlaceholder` ? (
                      <>
                        {isOpenDemo ? null : (
                          <input
                            type="file"
                            id={`file-${childGlobalNth}`}
                            accept="image/*"
                            className="mb-3"
                            onChange={(e) => handleFileRead(e)}
                          />
                        )}
                        <div className="clear mb-4">
                          <p>
                            or select from{` `}
                            <button
                              className="font-main underline underline-2 hover:text-myorange"
                              onClick={() => {
                                setShowImageLibrary(true)
                                setLocked(true)
                              }}
                            >
                              image library
                            </button>
                          </p>
                        </div>
                      </>
                    ) : (
                      <img
                        className="w-auto h-10"
                        src={imageData.publicURL}
                        alt={imageData.alt}
                      />
                    )}

                    <label
                      htmlFor={`image-${childGlobalNth}--alt`}
                      className="block text-sm leading-6 text-black"
                    >
                      Alternate Description
                    </label>
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        disabled={imageData.alt === `ImagePlaceholder`}
                        name={`image-${childGlobalNth}--alt`}
                        id={`image-${childGlobalNth}--alt`}
                        className="block h-12 flex-1 border-0 bg-transparent focus:ring-0"
                        value={imageData.alt}
                        onChange={(e) => handleChangeEditInPlace(e)}
                      />
                    </div>
                  </>
                ) : null}
                {!codeHook ? (
                  // why isn't this if imageData like above?
                  <>
                    {!Object.keys(state).length ? (
                      <span className="block my-2">No image styles</span>
                    ) : (
                      Object.keys(state).map((e: any) => (
                        <InputTailwindClass
                          id={id}
                          key={`${id}-${e}-img-${viewportKey}`}
                          payload={{
                            [e]: state[e],
                          }}
                          viewportKey={viewportKey}
                          allowOverride={true}
                          handleChangeEditInPlace={handleChangeEditInPlace}
                        />
                      ))
                    )}
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`add---${id}`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`add---${id}`}
                        name={`add---${id}`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}

                {codeHook ? (
                  <>
                    {codeHook.hook === `youtube` ? (
                      <EditCodeHookYouTube
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    ) : codeHook.hook === `resource` ? (
                      <EditCodeHookResource
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    ) : codeHook.hook === `identifyAs` ? (
                      <EditCodeHookIdentifyAs
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    ) : codeHook.hook === `belief` ? (
                      <EditCodeHookBelief
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    ) : codeHook.hook === `toggle` ? (
                      <EditCodeHookToggleBelief
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    ) : (
                      <EditCodeHook
                        id={`${id}`}
                        payload={codeHook}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    )}

                    <div className="h-4"></div>
                    <span className="font-action my-auto">Outer Container</span>
                    {!Object.keys(outerCodeState).length ? (
                      <span className="block my-2">No outer styles</span>
                    ) : (
                      Object.keys(outerCodeState).map((e: any) => (
                        <InputTailwindClass
                          id={outerCodeId}
                          key={`${id}-${e}-ul-${viewportKey}`}
                          payload={{
                            [e]: outerCodeState[e],
                          }}
                          viewportKey={viewportKey}
                          allowOverride={false}
                          handleChangeEditInPlace={handleChangeEditInPlace}
                        />
                      ))
                    )}
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`add---${id}`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`add---${id}`}
                        name={`add---${id}`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}
                {tag === `img` ? (
                  <>
                    <span className="block mt-6 font-action">
                      Image Container
                    </span>
                    {!Object.keys(state).length ? (
                      <span className="block my-2">No list item styles</span>
                    ) : (
                      Object.keys(listItemState).map((e: any) => (
                        <InputTailwindClass
                          id={listItemId}
                          key={`${id}-${e}-li-${viewportKey}`}
                          payload={{
                            [e]: listItemState[e],
                          }}
                          viewportKey={viewportKey}
                          allowOverride={true}
                          handleChangeEditInPlace={handleChangeEditInPlace}
                        />
                      ))
                    )}
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`add---${listItemId}`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`add---${listItemId}`}
                        name={`add---${listItemId}`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}
                {[`img`, `li`].includes(tag) ? (
                  <>
                    <span className="block mt-6 font-action my-auto">
                      Outer Container
                    </span>
                    {!Object.keys(outerListState).length ? (
                      <span className="block my-2">No list item styles</span>
                    ) : (
                      Object.keys(outerListState).map((e: any) => (
                        <InputTailwindClass
                          id={outerListId}
                          key={`${id}-${e}-${actualTag}-${viewportKey}`}
                          payload={{
                            [e]: outerListState[e],
                          }}
                          viewportKey={viewportKey}
                          allowOverride={false}
                          handleChangeEditInPlace={handleChangeEditInPlace}
                        />
                      ))
                    )}
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`add---${outerListId}`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`add---${outerListId}`}
                        name={`add---${outerListId}`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : null}

                {stateLivePreviewMarkdown.hasTextShapeOutside ? (
                  <>
                    <div className="block mb-4 mt-4">
                      <span className="font-action">Text has inside shape</span>
                    </div>
                    <EditShape
                      id={`textShapeOutside---${textShapeOutside.paneFragmentId}`}
                      payload={textShapeOutside}
                      viewportKey={viewportKey}
                      handleChangeEditInPlace={handleChangeEditInPlace}
                    />
                  </>
                ) : null}
              </div>
            </div>
          ) : null}

          {linksData &&
            Object.keys(linksData).map((l: any, idx: number) => (
              <div
                key={idx}
                className="mb-4 bg-white shadow rounded-lg w-full max-w-md"
              >
                <div className="px-4 py-5 p-6">
                  <div className="block mb-4">
                    <span className="font-action">Has Link</span>
                  </div>
                  <EditLink
                    id={`${id}---link-${idx}`}
                    payload={linksData[l]}
                    viewportKey={viewportKey}
                    handleChangeEditInPlace={handleChangeEditInPlace}
                  />
                </div>
              </div>
            ))}

          {typeof shapesData !== `undefined` &&
            Object.keys(shapesData).map((s: any, idx: number) => (
              <div
                key={idx}
                className="mb-4 bg-white shadow rounded-lg w-full max-w-md"
              >
                <div className="px-4 py-5 p-6">
                  <div className="block mb-4">
                    <span className="font-action">Background Shape</span>
                  </div>
                  <EditShape
                    id={`paneShape---${shapesData[s].paneFragmentId}`}
                    payload={shapesData[s]}
                    viewportKey={viewportKey}
                    handleChangeEditInPlace={handleChangeEditInPlace}
                  />
                  {Object.keys(shapesData[s].parentClasses).map((e: string) => {
                    return (
                      <InputTailwindClass
                        key={`paneShapeClasses---${shapesData[s].paneFragmentId}-${e}`}
                        id={`paneShapeClasses---${shapesData[s].paneFragmentId}`}
                        payload={{ [e]: shapesData[s].parentClasses[e] }}
                        viewportKey={viewportKey}
                        allowOverride={false}
                        handleChangeEditInPlace={handleChangeEditInPlace}
                      />
                    )
                  })}
                  {!shapesData[s].artpackPayload ? (
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`paneShapeClasses---${shapesData[s].paneFragmentId}-add`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`paneShapeClasses---${shapesData[s].paneFragmentId}-add`}
                        name={`paneShapeClasses---${shapesData[s].paneFragmentId}-add`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

          {hasModalClasses ? (
            <div className="mb-4 bg-white shadow rounded-lg w-full max-w-md">
              <div className="px-4 py-5 p-6">
                <div className="block mb-4">
                  <span className="pr-2 font-action">Modal Styles</span>
                </div>

                {typeof modalData !== `undefined` &&
                  Object.keys(modalData).map((s: string, idx: number) => (
                    <EditShape
                      key={idx}
                      id={`modalShape---${modalData[s].paneFragmentId}`}
                      payload={modalData[s]}
                      viewportKey={viewportKey}
                      handleChangeEditInPlace={handleChangeEditInPlace}
                    />
                  ))}
                {modalState && modalId && !Object.keys(modalState).length ? (
                  <span className="block my-2">No styles</span>
                ) : (
                  Object.keys(modalState).map((e: string) => (
                    <InputTailwindClass
                      id={modalId}
                      key={`${id}-${e}-modal-${viewportKey}`}
                      payload={{
                        [e]: modalState[e],
                      }}
                      viewportKey={viewportKey}
                      allowOverride={false}
                      handleChangeEditInPlace={handleChangeEditInPlace}
                    />
                  ))
                )}
                <div className="mt-2 inline-flex items-center">
                  <label
                    htmlFor={`add---${modalId}`}
                    className="pr-2 block text-sm leading-6 text-black"
                  >
                    Add&nbsp;Style
                  </label>
                  <select
                    id={`modalShape---0-add`}
                    name={`modalShape---0-add`}
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                    onChange={(e) => handleChangeEditInPlace(e)}
                    value={` `}
                  >
                    <option>{` `}</option>
                    {tailwindAllowedClasses.map((e) => (
                      <option key={e} value={e}>
                        {tailwindSpecialTitle[e]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : null}
          {pageStylesPagination === -1 ? (
            <div className="mb-4 bg-white shadow rounded-lg w-full max-w-md">
              <div className="px-4 py-5 p-6">
                <span className="pr-2 font-action">Pane Styles</span>
                <button
                  className="bg-slate-200 text-black hover:bg-myorange rounded-md px-3 py-2 text-xs font-action"
                  onClick={() => {
                    setPageStylesPagination(0)
                    reset()
                  }}
                >
                  Show
                </button>
              </div>
            </div>
          ) : pageStylesPagination > -1 ? (
            <div className="mb-4 bg-white shadow rounded-lg w-full max-w-md">
              <div className="px-4 py-5 p-6">
                <div className="inline-block">
                  <span className="pr-2 font-action">Pane Styles</span>
                  <button
                    className="bg-transparent text-mydarkgrey hover:bg-myorange rounded-md px-3 py-2 text-xs font-action"
                    onClick={() => setPageStylesPagination(-1)}
                    title="Toggle out of view"
                  >
                    Hide
                  </button>
                </div>
                <div>
                  <span className="pr-2 text-xs font-action">Layer</span>
                  {hasParentClasses &&
                    Object.keys(parentClasses).map((e) => (
                      <button
                        key={`${id}-${e}-button-${viewportKey}`}
                        onClick={() => {
                          setPageStylesPagination(+e)
                          reset()
                        }}
                        className={classNames(
                          +e === pageStylesPagination
                            ? `bg-slate-200 rounded-md`
                            : `bg-transparent`,
                          `text-black hover:bg-myorange px-3 py-2 text-sm font-action`,
                        )}
                        title={`Layer ${+e + 1}/${
                          Object.keys(parentClasses).length
                        }`}
                      >
                        {+e + 1}
                      </button>
                    ))}
                  <button
                    key={`add---${parentId}`}
                    onClick={() =>
                      handleChangeEditInPlace({
                        target: {
                          name: `add---${
                            Object.keys(parentClasses).length
                          }--parent`,
                          value: null,
                        },
                      })
                    }
                    className="text-black hover:bg-myorange px-3 py-2 text-sm font-action"
                    title="Add layer"
                  >
                    +
                  </button>
                </div>
                {hasParentClasses ? (
                  <div>
                    {parentState &&
                    parentId &&
                    !Object.keys(parentState).length ? (
                      <span className="block my-2">No styles</span>
                    ) : (
                      Object.keys(parentState).map((e: string) => (
                        <InputTailwindClass
                          id={parentId}
                          key={`${parentId}-${e}`}
                          payload={{
                            [e]: parentState[e],
                          }}
                          viewportKey={viewportKey}
                          allowOverride={false}
                          handleChangeEditInPlace={handleChangeEditInPlace}
                        />
                      ))
                    )}
                    <div className="mt-2 inline-flex items-center">
                      <label
                        htmlFor={`add---${parentId}`}
                        className="pr-2 block text-sm leading-6 text-black"
                      >
                        Add&nbsp;Style
                      </label>
                      <select
                        id={`add---${parentId}`}
                        name={`add---${parentId}`}
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => handleChangeEditInPlace(e)}
                        value={` `}
                      >
                        <option>{` `}</option>
                        {tailwindAllowedClasses.map((e) => (
                          <option key={e} value={e}>
                            {tailwindSpecialTitle[e]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          {hasBgColourId ? (
            <div className="mb-4 bg-white shadow rounded-lg w-full max-w-md">
              <div className="px-4 py-5 p-6">
                <div className="block mb-4">
                  <div className="grid grid-cols-2">
                    <span className="font-action">Background Colour</span>
                    <div>
                      <label
                        htmlFor={`bgColour--${hasBgColourId}`}
                        className="sr-only"
                      >
                        Background Colour
                      </label>
                      <div className="inline-flex">
                        <div className="flex w-20 rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                          <input
                            type="color"
                            name={`bgColour--${hasBgColourId}`}
                            id={`bgColour--${hasBgColourId}`}
                            className="block h-12 flex-1 border-0 bg-transparent focus:ring-0"
                            value={bgColour}
                            onChange={(e) => handleChangeEditInPlace(e)}
                          />
                        </div>
                        <button
                          onClick={() =>
                            handleChangeEditInPlace({
                              target: {
                                name: `bgColour--${hasBgColourId}`,
                                value: null,
                              },
                            })
                          }
                        >
                          <XMarkIcon
                            className="ml-2 my-auto w-3 h-3 text-myorange hover:text-black"
                            title="Remove"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {(modalData.length && !hasBgColour) ||
          (hasBreaks && !hasBgColour) ||
          (!modalData.length && !hasBreaks) ? (
            <div className="px-4 py-5 p-6">
              <div className="block mb-4">
                <div className="grid grid-cols-2">
                  <div className="mt-2 inline-flex items-center">
                    <label
                      htmlFor={`add---special`}
                      className="pr-2 block text-sm leading-6 text-black"
                    >
                      Add
                    </label>
                    <select
                      id={`add---special`}
                      name={`add---special`}
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-black ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen xs:text-sm xs:leading-6"
                      onChange={(e) => handleChangeEditInPlace(e)}
                      value={` `}
                    >
                      <option>{` `}</option>
                      {!hasBgColourId ? (
                        <option value="bgColour--0">Background Colour</option>
                      ) : null}
                      {stateLivePreviewMarkdown.markdownId &&
                      !textShapeOutside &&
                      !modalData.length ? (
                        <option value="bgPaneShapeOutside--0">
                          Inside Shape on Text
                        </option>
                      ) : null}
                      {!hasBreaks && !modalData.length ? (
                        <>
                          <option value="bgPane--0">Background Shape</option>
                          <option value="bgPaneArtPack--0">
                            Shape with Art Pack fill
                          </option>
                        </>
                      ) : null}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

export default PaneEditInPlace
