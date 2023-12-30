// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { IEditBelief } from '../types'

const EditBelief = ({
  selector,
  value,
  index,
  mode,
  handleChangeBelief,
}: IEditBelief) => {
  return (
    <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6 p-4 shadow bg-white mb-2">
      <div className="xs:col-span-2 col-span-1">
        <label
          htmlFor={`${mode}-${index}-selector`}
          className="block text-sm leading-6 text-black"
        >
          Selector (allowed: A-Z, a-z)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
            <input
              type="text"
              name="selector"
              id={`${mode}-${index}-selector`}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
              value={selector}
              pattern="[A-Za-z]+"
              onChange={(event) =>
                handleChangeBelief({
                  event,
                  selector,
                  value,
                  mode,
                  action: `selector`,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="xs:col-span-2 col-span-1">
        <label
          htmlFor={`${mode}-${index}-value`}
          className="block text-sm leading-6 text-black"
        >
          Value (allowed: A-Z, or * | csv)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
            <input
              type="text"
              name="value"
              id={`${mode}-${index}-value`}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
              value={value}
              pattern="[A-Z*,_]+"
              onChange={(event) =>
                handleChangeBelief({
                  event,
                  selector,
                  value,
                  mode,
                  action: `value`,
                })
              }
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={(event) =>
          handleChangeBelief({
            event,
            selector,
            value,
            mode,
            action: `remove`,
          })
        }
      >
        {` `}
        REMOVE
      </button>
    </div>
  )
}

export default EditBelief
