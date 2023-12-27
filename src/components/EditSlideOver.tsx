// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { IEditSlideOver } from 'src/types'
import { classNames } from '@tractstack/helpers'

import { useDrupalStore } from '../stores/drupal'

const EditSlideOver = ({ children, title, setSelected }: IEditSlideOver) => {
  const [open, setOpen] = useState(true)
  const locked = useDrupalStore((state) => state.locked)
  function close() {
    if (!locked) {
      setOpen(false)
      setSelected(``)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-250"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-myblue bg-opacity-95 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <>
              <div className="fixed inset-y-0 right-0 max-w-full flex xs:hidden justify-center items-center">
                <div>
                  <h3 className="font-action text-mygreen text-3xl px-12 max-w-xl">
                    The visual editor has not been optimized for small screens.
                  </h3>
                  <p className="pt-12 font-main text-mywhite text-xl px-12 max-w-xl">
                    A mobile-first &lsquo;storykeep experience&rsquo; is on our
                    roadmap. In the meantime, try requesting the &quot;Desktop
                    Site$quot; in your mobile browser. We apologize for this
                    limitation.
                  </p>
                </div>
              </div>
              <div className="pointer-events-none fixed inset-y-0 right-0 max-w-full pl-10 hidden xs:flex">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-1 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-mygreen hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          title={
                            locked ? `You have unsaved changes.` : `Close panel`
                          }
                          onClick={close}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon
                            className={classNames(
                              locked ? `invisible` : `visible`,
                              `h-6 w-6`,
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-bold leading-6 text-black">
                          {title}
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {children}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default EditSlideOver
