// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import { RectangleGroupIcon } from '@heroicons/react/20/solid'
import { classNames } from '@tractstack/helpers'

import { useDrupalStore } from '../../stores/drupal'

const StoryFragmentStarter = ({ fn }: any) => {
  const { handleAdd, setAddModalOpen } = fn
  const [query, setQuery] = useState(``)
  const [selectedPane, setSelectedPane] = useState<any>(null)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const panes = Object.keys(allPanes).map((e: string) => {
    return { id: e, title: allPanes[e].title }
  })
  const filteredPanes =
    query === ``
      ? panes
      : panes.filter((pane: any) => {
          return pane.title.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <div className="flex flex-row">
      <div className="h-fit rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all xs:my-8 xs:w-full xs:p-6">
        <div className="xs:flex xs:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-myorange/20 xs:mx-0 xs:h-10 xs:w-10">
            <RectangleGroupIcon
              className="h-6 w-6 text-myorange"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center xs:ml-4 xs:mt-0 xs:text-left">
            <h3 className="text-2xl font-main leading-6 text-black font-bold">
              Design a new content pane
            </h3>
          </div>
        </div>
        <div className="mt-5 xs:mt-4 xs:flex xs:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-mydarkgrey px-3 py-2 text-sm font-bold text-mywhite shadow-sm hover:bg-myorange xs:ml-3 xs:w-auto"
            onClick={() => handleAdd(`new`)}
          >
            New Pane
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 xs:mt-0 xs:w-auto"
            onClick={() => {
              if (setAddModalOpen) setAddModalOpen(false)
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {panes.length > 0 ? (
        <>
          <span className="mt-16 px-4 text-2xl font-action text-black -rotate-2">
            OR
          </span>
          <div className="rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all xs:my-8 xs:w-full xs:p-6">
            <div className="xs:flex xs:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-myorange/20 xs:mx-0 xs:h-10 xs:w-10">
                <RectangleGroupIcon
                  className="h-6 w-6 text-myorange"
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center xs:ml-4 xs:mt-0 xs:text-left">
                <h3 className="text-2xl font-main leading-6 text-black font-bold">
                  Select from your content library
                </h3>
              </div>
            </div>
            <Combobox as="div" value={selectedPane} onChange={setSelectedPane}>
              <Combobox.Label className="mt-6 mb-3 block text-md leading-6 text-black">
                Select from a list of existing panes, or begin typing to search
                by title:
              </Combobox.Label>
              <div className="relative mt-2">
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-black shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-mygreen xs:text-sm xs:leading-6"
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(pane: any) => pane?.title}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-slate-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {filteredPanes.length > 0 && (
                  <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none xs:text-sm">
                    {filteredPanes.map((pane: any) => (
                      <Combobox.Option
                        key={pane.id}
                        value={pane}
                        className={({ active }) =>
                          classNames(
                            `relative cursor-default select-none py-2 pl-3 pr-9`,
                            active ? `bg-mygreen text-black` : `text-black`,
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span
                              className={classNames(
                                `block truncate`,
                                selected ? `font-bold` : ``,
                              )}
                            >
                              {pane.title}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  `absolute inset-y-0 right-0 flex items-center pr-4`,
                                  active ? `text-white` : `text-mygreen`,
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>

            <div className="mt-5 xs:mt-4 xs:flex xs:flex-row-reverse">
              {selectedPane ? (
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-mydarkgrey px-3 py-2 text-sm font-bold text-mywhite shadow-sm hover:bg-myorange xs:ml-3 xs:w-auto"
                  onClick={() => handleAdd(`existing`, selectedPane.id)}
                >
                  Insert
                </button>
              ) : null}
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 xs:mt-0 xs:w-auto"
                onClick={() => {
                  if (setAddModalOpen) setAddModalOpen(false)
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default StoryFragmentStarter
