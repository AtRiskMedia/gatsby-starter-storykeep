// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { ISlideOver } from '../../types'

const SlideOver = ({ children, setToggle, locked }: ISlideOver) => {
  const [open, setOpen] = useState(false)
  const [lag, setLag] = useState(true)

  const doClose = () => {
    if (!locked) setOpen(false)
    else alert(`Please enter a title and unique slug.`)
  }

  useEffect(() => {
    if (lag) {
      setOpen(true)
      setLag(false)
    }
    if (!lag && !open) setTimeout(() => setToggle(false), 500)
  }, [open, lag, setLag, setToggle])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => doClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-mydarkgrey bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 xs:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 xs:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-5xl">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 xs:-ml-10 xs:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => doClose()}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 xs:px-6">
                      <Dialog.Title className="text-xl leading-6 text-myblue">
                        Advanced Settings
                      </Dialog.Title>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 xs:px-6">
                      <>
                        {children}
                        <div className="mt-12">
                          <button
                            type="button"
                            onClick={() => doClose()}
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                          >
                            <XMarkIcon
                              className="-ml-0.5 mr-1.5 h-5 w-5"
                              aria-hidden="true"
                            />
                            Close
                          </button>
                        </div>
                      </>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default SlideOver
