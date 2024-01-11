// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useState } from 'react'
import { Link, navigate } from 'gatsby'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  BeakerIcon,
  RectangleGroupIcon,
  WrenchScrewdriverIcon,
  ChartPieIcon,
  BoltIcon,
  // CircleStackIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '@tractstack/helpers'

import { ILayout } from '../types'
import { useDrupalStore } from '../stores/drupal'
import Logo from '../../assets/logo.svg'

const Layout = ({ children, current }: ILayout) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navLocked = useDrupalStore((state) => state.navLocked)
  const navigation = [
    {
      id: `dashboard`,
      name: `Dashboard`,
      href: `/`,
      icon: ChartPieIcon,
      current: current === `dashboard`,
    },
    {
      id: `storykeep`,
      name: `Story Keep`,
      href: `/storykeep`,
      icon: RectangleGroupIcon,
      current: [`storykeep`, `storykeepInner`].includes(current),
    },
    {
      id: `graph`,
      name: `Knowledge Graph`,
      href: `/graph`,
      icon: BeakerIcon,
      current: current === `graph`,
    },
    {
      id: `publish`,
      name: `Publish`,
      href: `/publish`,
      icon: BoltIcon,
      current: current === `publish`,
    },
  ]
  const actions = [
    // {
    //  id: 1,
    //  name: `Backup/Restore`,
    //  href: `/backups`,
    //  icon: CircleStackIcon,
    //  current: current === `backups`,
    // },
    {
      id: 2,
      name: `Publish Settings`,
      href: `/settings`,
      icon: WrenchScrewdriverIcon,
      current: current === `settings`,
    },
    {
      id: 3,
      name: `Account Settings`,
      href: `/account`,
      icon: UserIcon,
      current: current === `account`,
    },
    {
      id: 4,
      name: `Logout`,
      href: `/logout`,
      icon: XMarkIcon,
      current: current === `logout`,
    },
  ]
  const title = navigation.filter((e) => e.current).length
    ? navigation.filter((e) => e.current)[0].name
    : actions.filter((e) => e.current).length
      ? actions.filter((e) => e.current)[0].name
      : ``

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className={classNames(
              current === `storykeepInner` ? `` : `xl:hidden`,
              `relative`,
            )}
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-mydarkgrey/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white hover:text-mygreen"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/95 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <Logo
                        className="h-8 w-auto"
                        alt="Tract Stack by At Risk Media"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <>
                                  {!navLocked ? (
                                    <Link
                                      to={item.href}
                                      className={classNames(
                                        item.current
                                          ? `mydarkgrey text-white`
                                          : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                        `group flex gap-x-3 rounded-md p-2 text-sm font-bold`,
                                      )}
                                    >
                                      <item.icon
                                        className="h-6 w-6 shrink-0"
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (navLocked) {
                                          if (
                                            window.confirm(
                                              `There are unsaved changes. Proceed?`,
                                            )
                                          )
                                            navigate(item.href)
                                        } else navigate(item.href)
                                      }}
                                      className={classNames(
                                        item.current
                                          ? `mydarkgrey text-white`
                                          : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                        `group flex gap-x-3 rounded-md p-2 text-sm font-bold`,
                                      )}
                                    >
                                      <item.icon
                                        className="h-6 w-6 shrink-0"
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </button>
                                  )}
                                </>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-bold text-mylightgrey">
                            Actions
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {actions.map((action) => (
                              <li key={action.name}>
                                <>
                                  {!navLocked ? (
                                    <Link
                                      to={action.href}
                                      className={classNames(
                                        action.current
                                          ? `mydarkgrey text-white`
                                          : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                        `group flex gap-x-3 rounded-md p-2 text-sm font-bold`,
                                      )}
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-mylightgrey mydarkgrey text-[0.625rem] font-medium text-mylightgrey group-hover:text-white">
                                        <action.icon
                                          className="h-4 w-4 shrink-0"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <span className="truncate">
                                        {action.name}
                                      </span>
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (navLocked) {
                                          if (
                                            window.confirm(
                                              `There are unsaved changes. Proceed?`,
                                            )
                                          )
                                            navigate(action.href)
                                        } else navigate(action.href)
                                      }}
                                      className={classNames(
                                        action.current
                                          ? `mydarkgrey text-white`
                                          : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                        `group flex gap-x-3 rounded-md p-2 text-sm font-bold`,
                                      )}
                                    >
                                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-mylightgrey mydarkgrey text-[0.625rem] font-medium text-mylightgrey group-hover:text-white">
                                        <action.icon
                                          className="h-4 w-4 shrink-0"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <span className="truncate">
                                        {action.name}
                                      </span>
                                    </button>
                                  )}
                                </>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div
          className={classNames(
            current === `storykeepInner`
              ? `hidden`
              : `hidden xl:fixed xl:inset-y-0 xl:flex xl:w-72 xl:flex-col`,
          )}
        >
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Logo className="h-8 w-auto" alt="Tract Stack by At Risk Media" />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <>
                          {!navLocked ? (
                            <Link
                              to={item.href}
                              className={classNames(
                                item.current
                                  ? `text-white`
                                  : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                `group flex gap-x-3 rounded-md p-2 text-lg font-bold`,
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                if (navLocked) {
                                  if (
                                    window.confirm(
                                      `There are unsaved changes. Proceed?`,
                                    )
                                  )
                                    navigate(item.href)
                                } else navigate(item.href)
                              }}
                              className={classNames(
                                item.current
                                  ? `text-white`
                                  : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                `group flex gap-x-3 rounded-md p-2 text-lg font-bold`,
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </button>
                          )}
                        </>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-sm font-action font-bold text-mylightgrey">
                    Actions
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {actions.map((action) => (
                      <li key={action.name}>
                        <>
                          {!navLocked ? (
                            <Link
                              to={action.href}
                              className={classNames(
                                action.current
                                  ? `mydarkgrey text-white`
                                  : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                `group flex gap-x-3 rounded-md p-2 text-md font-bold`,
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-mylightgrey mydarkgrey text-[0.625rem] text-mylightgrey group-hover:text-white">
                                <action.icon
                                  className="w-4 h-4 shrink-0"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="truncate">{action.name}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                if (navLocked) {
                                  if (
                                    window.confirm(
                                      `There are unsaved changes. Proceed?`,
                                    )
                                  )
                                    navigate(action.href)
                                } else navigate(action.href)
                              }}
                              className={classNames(
                                action.current
                                  ? `mydarkgrey text-white`
                                  : `text-mylightgrey hover:text-white hover:mydarkgrey`,
                                `group flex gap-x-3 rounded-md p-2 text-md font-bold`,
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-mylightgrey mydarkgrey text-[0.625rem] text-mylightgrey group-hover:text-white">
                                <action.icon
                                  className="w-4 h-4 shrink-0"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="truncate">{action.name}</span>
                            </button>
                          )}
                        </>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <span>x</span>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          className={classNames(
            current === `storykeepInner` ? `` : `xl:hidden`,
            `z-99 sticky top-0 flex items-center gap-x-6 bg-black px-4 py-4 shadow-sm`,
          )}
        >
          <button
            type="button"
            className={classNames(
              current === `storykeepInner` ? `` : `xl:hidden`,
              `-m-2.5 p-2.5 text-mylightgrey`,
            )}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-lg font-bold text-white">{title}</div>
          <div className="inline-flex">
            {navigation.map((e: any) => (
              <span key={e.id} className={e.id !== current ? `mx-1` : ``}>
                {e.id !== current ? (
                  <>
                    {!navLocked ? (
                      <Link
                        to={e.href}
                        title={e.name}
                        className="text-mywhite hover:text-mygreen"
                      >
                        <span className="sr-only">{e.name}</span>
                        <e.icon className="h-6 w-6" aria-hidden="true" />
                      </Link>
                    ) : (
                      <button
                        title={e.name}
                        onClick={() => {
                          if (navLocked) {
                            if (
                              window.confirm(
                                `There are unsaved changes. Proceed?`,
                              )
                            )
                              navigate(e.href)
                          } else navigate(e.href)
                        }}
                        className="text-mywhite hover:text-mygreen"
                      >
                        <span className="sr-only">{e.name}</span>
                        <e.icon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    )}
                  </>
                ) : null}
              </span>
            ))}
          </div>
        </div>

        <main
          className={classNames(
            current === `storykeepInner` ? `py-10` : `py-10 xl:pl-72`,
          )}
        >
          <div className="px-4 xl:px-8">{children}</div>
        </main>
      </div>
    </>
  )
}

export default Layout
