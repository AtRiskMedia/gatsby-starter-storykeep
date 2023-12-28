// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { classNames } from '@tractstack/helpers'
import {
  ChevronDownIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  FingerPrintIcon,
  CursorArrowRaysIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'
import { FireIcon } from '@heroicons/react/20/solid'

import { useDrupalStore } from '../stores/drupal'
import EditSlideOver from './EditSlideOver'
import EditTractStack from './EditTractStack'
import EditStoryFragment from './EditStoryFragment'
import EditResource from './EditResource'
import EditMarkdown from './EditMarkdown'
import EditPane from './EditPane'
import { getPanesDaysSince, getStoryFragmentDaysSince } from '../api/services'
import { IActivityDetails } from 'src/types'

const goGetStoryFragmentDaysSince = async () => {
  try {
    const response = await getStoryFragmentDaysSince()
    const data = response?.data
    if (data) {
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}
const goGetPanesDaysSince = async () => {
  try {
    const response = await getPanesDaysSince()
    const data = response?.data
    if (data) {
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}
const daysSinceDataPayload = (data: any) => {
  const maxSince =
    data.length === 0
      ? 0
      : data.reduce((a: any, b: any) =>
          a.hours_since_activity > b.hours_since_activity ? a : b,
        ).hours_since_activity
  const payload: IActivityDetails = {}
  data
    .map((e: any) => {
      if (!e || !e.title) return null
      let colorOffset =
        maxSince === 0
          ? 0
          : 10 *
            Math.round((10 * (maxSince - e.hours_since_activity)) / maxSince)
      if (colorOffset < 20) colorOffset = 20
      if (colorOffset > 95) colorOffset = 95
      return {
        id: e.storyFragmentId || e.paneId,
        engagement: Math.max(
          1,
          Math.min(
            95,
            Math.round((100 * (maxSince - e.hours_since_activity)) / maxSince),
          ),
        ),
        daysSince: Math.round((e.hours_since_activity / 24) * 10) / 10,
        colorOffset: colorOffset.toString(),
        read: parseInt(e.red),
        glossed: parseInt(e.glossed),
        clicked: parseInt(e.clicked),
        entered: parseInt(e.entered),
        discovered: parseInt(e.discovered),
      }
    })
    .filter((n: any) => n)
    .forEach((e: any) => {
      payload[e.id] = {
        engagement: e.engagement,
        daysSince: e.daysSince,
        colorOffset: e.colorOffset,
        read: e.read,
        glossed: e.glossed,
        clicked: e.clicked,
        entered: e.entered,
        discovered: e.discovered,
      }
    })
  return payload
}

const StoryKeep = () => {
  const selectedCollection = useDrupalStore((state) => state.selectedCollection)
  const [current, setCurrent] = useState(selectedCollection || `storyfragment`)
  const [children, setChildren]: any = useState(null)
  const [childrenTitle, setChildrenTitle] = useState(``)
  // const [displayMode, setDisplayMode] = useState(true)
  const displayMode = true
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const selected = useDrupalStore((state) => state.selected)
  const setSelected = useDrupalStore((state) => state.setSelected)
  const setSelectedCollection = useDrupalStore(
    (state) => state.setSelectedCollection,
  )
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allResources = useDrupalStore((state) => state.allResources)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const allMenus = useDrupalStore((state) => state.allMenus)
  const [storyFragmentDaysSinceData, setStoryFragmentDaysSinceData] =
    useState<IActivityDetails>({})
  const [loadingStoryFragmentDaysSince, setLoadingStoryFragmentDaysSince] =
    useState(false)
  const [loadedStoryFragmentDaysSince, setLoadedStoryFragmentDaysSince] =
    useState(false)
  const [panesDaysSinceData, setPanesDaysSinceData] =
    useState<IActivityDetails>({})
  const [loadingPanesDaysSince, setLoadingPanesDaysSince] = useState(false)
  const [loadedPanesDaysSince, setLoadedPanesDaysSince] = useState(false)
  const [maxRetryPanes, setMaxRetryPanes] = useState<undefined | boolean>(
    undefined,
  )
  const [maxRetryStoryFragments, setMaxRetryStoryFragments] = useState<
    undefined | boolean
  >(undefined)

  const addButtons = [
    {
      id: `resource`,
      name: `Resource`,
      enabled: current === `resource`,
    },
    {
      id: `tractstack`,
      name: `Track Stack`,
      enabled: current === `tractstack`,
    },
    {
      id: `pane`,
      name: `Content Pane`,
      enabled: true,
    },
    {
      id: `storyfragment`,
      name: `Story Fragment`,
      enabled: true,
    },
  ]

  const tags = [
    {
      id: `storyfragment`,
      name: `Story Fragments`,
      count: Object.keys(allStoryFragments).length,
      current: current === `storyfragment`,
    },
    {
      id: `pane`,
      name: `Panes`,
      count: Object.keys(allPanes).length,
      current: current === `pane`,
    },
    {
      id: `resource`,
      name: `Resources`,
      count: Object.keys(allResources).length,
      current: current === `resource`,
    },
    {
      id: `tractstack`,
      name: `Tract Stacks`,
      count: Object.keys(allTractStacks).length,
      current: current === `tractstack`,
    },
    // {
    //  id: `markdown`,
    //  name: `Markdown`,
    //  count: Object.keys(allMarkdown).length,
    //  current: current === `markdown`,
    // },
    // {
    //  id: `file`,
    //  name: `Files`,
    //  count: Object.keys(allFiles).length,
    //  current: current === `file`,
    // },
    // {
    //  id: `menu`,
    //  name: `Menus`,
    //  count: Object.keys(allMenus).length,
    //  current: current === `menu`,
    // },
  ]
  const noTags = tags.filter((t) => t.count).length === 0
  const payload =
    current === `tractstack`
      ? allTractStacks
      : current === `storyfragment`
        ? allStoryFragments
        : current === `pane`
          ? allPanes
          : current === `resource`
            ? allResources
            : current === `markdown`
              ? allMarkdown
              : current === `menu`
                ? allMenus
                : {}

  const filterKeys = Object.keys(payload).map((e: any) => {
    // console.log(payload[e])
    return e
  })

  const handleClick = (e: any) => {
    console.log(e)
  }

  useEffect(() => {
    if (selectedCollection && selected) {
      switch (selectedCollection) {
        case `tractstack`:
          setChildren(
            <EditTractStack uuid={selected} handleToggle={setSelected} />,
          )
          setChildrenTitle(`edit this tract stack`)
          break
        case `storyfragment`:
          setChildren(
            <EditStoryFragment uuid={selected} handleToggle={setSelected} />,
          )
          setChildrenTitle(`edit this story fragment`)
          break
        case `pane`:
          setChildren(<EditPane uuid={selected} handleToggle={setSelected} />)
          setChildrenTitle(`edit this pane`)
          break
        case `resource`:
          setChildren(
            <EditResource uuid={selected} handleToggle={setSelected} />,
          )
          setChildrenTitle(`edit this resource`)
          break
        case `markdown`:
          setChildren(
            <EditMarkdown uuid={selected} handleToggle={setSelected} />,
          )
          setChildrenTitle(`edit this markdown`)
          break
        default:
          console.log(`missed on`, selectedCollection, selected)
      }
    } else if (selectedCollection && selected === ``) {
      setChildren(null)
      setChildrenTitle(``)
    }
  }, [selected, setSelected, selectedCollection, setSelectedCollection])

  useEffect(() => {
    if (
      current === `storyfragment` &&
      storyFragmentDaysSinceData &&
      Object.keys(storyFragmentDaysSinceData).length === 0 &&
      !loadingStoryFragmentDaysSince &&
      !loadedStoryFragmentDaysSince &&
      !maxRetryStoryFragments
    ) {
      setLoadingStoryFragmentDaysSince(true)
      goGetStoryFragmentDaysSince()
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            const payload = daysSinceDataPayload(JSON.parse(res.data.data))
            setStoryFragmentDaysSinceData(payload)
            setLoadedStoryFragmentDaysSince(true)
          } else {
            if (typeof maxRetryStoryFragments === `undefined`) {
              setMaxRetryStoryFragments(false)
              setLoadingStoryFragmentDaysSince(false)
            } else if (typeof maxRetryStoryFragments === `undefined`) {
              setMaxRetryStoryFragments(true)
              setLoadingStoryFragmentDaysSince(false)
            }
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
    }
  }, [
    storyFragmentDaysSinceData,
    loadedStoryFragmentDaysSince,
    loadingStoryFragmentDaysSince,
    current,
    maxRetryStoryFragments,
  ])

  useEffect(() => {
    if (
      current === `pane` &&
      panesDaysSinceData &&
      Object.keys(panesDaysSinceData).length === 0 &&
      !loadingPanesDaysSince &&
      !loadedPanesDaysSince &&
      !maxRetryPanes
    ) {
      setLoadingPanesDaysSince(true)
      goGetPanesDaysSince()
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            const payload = daysSinceDataPayload(JSON.parse(res.data.data))
            setPanesDaysSinceData(payload)
            setLoadedPanesDaysSince(true)
          } else {
            if (typeof maxRetryPanes === `undefined`) {
              setMaxRetryPanes(false)
              setLoadingPanesDaysSince(false)
            } else if (typeof maxRetryPanes === `undefined`) {
              setMaxRetryPanes(true)
              setLoadingPanesDaysSince(false)
            }
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
    }
  }, [
    panesDaysSinceData,
    loadedPanesDaysSince,
    loadingPanesDaysSince,
    current,
    maxRetryPanes,
  ])

  return (
    <section className="w-full xl:max-w-screen-2xl">
      {childrenTitle ? (
        <EditSlideOver setSelected={setSelected} title={childrenTitle}>
          {children}
        </EditSlideOver>
      ) : null}
      <div className="w-full xl:max-w-screen-2xl">
        <div className="bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
          <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
            <h3 className="text-base font-action leading-6 text-black">
              Carry the conversation with Tract Stack
            </h3>

            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-mywhite px-3 py-2 text-sm text-myblack shadow-sm ring-1 ring-inset ring-myorange/20 hover:bg-myorange/10">
                  +&nbsp;Add
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-mydarkgrey"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-mywhite shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {addButtons.map((e) => (
                      <span key={e.id}>
                        {e.enabled ? (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleClick(e.id)}
                                className={classNames(
                                  active
                                    ? `bg-myorange/10 text-black`
                                    : `text-mydarkgrey`,
                                  `block px-4 py-2 text-sm w-full`,
                                )}
                              >
                                {e.name}
                              </button>
                            )}
                          </Menu.Item>
                        ) : null}
                      </span>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <div className="mt-4">
            <p className="text-mydarkgrey text-xl">
              {current === `storyfragment` ? (
                <>
                  Each <span className="font-bold">story fragment</span> maps to
                  {` `}
                  <span className="font-bold">one</span> web page or URL. It
                  contains one or more content panes. (This gets your easy
                  no-code analytics working straight out-of-the-box.)
                </>
              ) : current === `pane` ? (
                <>
                  Each <span className="font-bold">pane</span> is{` `}
                  <span className="font-bold">one section</span> of a web page.
                  Panes can be re-used multiple times! (As visitors engage with
                  your site activities such as reading or clicking in this pane
                  get collected.)
                </>
              ) : current === `resource` ? (
                <>
                  A <span className="font-bold">resource</span> is used in
                  special cases such as embedding a YouTube video.
                </>
              ) : current === `tractstack` ? (
                <>
                  Each <span className="font-bold">tract stack</span> contains a
                  collection of story fragments. Your website will have one or
                  more tract stacks. Think of each as having specific content to
                  address a particular issue. This will drive analytics and help
                  to tailor your insight discovery.
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full mt-6">
        <span className="isolate inline-flex rounded-md shadow-sm">
          {tags
            .filter((tag) => tag.count)
            .map((tag, idx) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  setSelectedCollection(tag.id)
                  setCurrent(tag.id)
                }}
                className={classNames(
                  tag.current ? `bg-myorange/10` : `bg-black/10`,
                  idx === 0 ? `rounded-l-md` : ``,
                  idx + 1 === tags.filter((tag) => tag.count).length
                    ? `rounded-r-md`
                    : ``,
                  `relative inline-flex items-center px-3 py-2 text-sm font-bold text-black ring-1 ring-inset ring-myorange/20 hover:text-black hover:bg-myorange/20`,
                )}
              >
                {`${tag.name} (${tag.count})`}
              </button>
            ))}
          {noTags ? (
            <div className="relative inline-flex items-center rounded-l-md bg-mywhite px-3 py-2 text-sm font-bold text-black">
              No content found.
            </div>
          ) : null}
        </span>
      </div>

      {displayMode && current === `tractstack` ? (
        <div className="text-xl font-action mb-12 xl:max-w-screen-2xl mt-16 px-4 xl:px-8">
          <div className="-mx-4">
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Object.keys(payload).map((record: string) => (
                <li key={payload[record].slug} className="col-span-1">
                  <button
                    type="button"
                    className="bg-slate-50 group relative block w-full max-w-md rounded-lg shadow-md hover:shadow-none hover:border-dashed border-2 border-dotted border-mylightgrey/20 p-6 text-center hover:border-myblue/20 hover:bg-myorange/10 focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2"
                    onClick={() => {
                      setSelectedCollection(current)
                      setSelected(record)
                    }}
                  >
                    <ChatBubbleLeftRightIcon
                      aria-hidden="true"
                      className="mx-auto h-8 w-8 text-myblue/10 group-hover:text-myblue/20"
                    />
                    <span className="group-hover:text-myblue mt-2 block text-md text-myblue">
                      {payload[record].title}
                    </span>
                    <span className="group-hover:text-myblue mt-2 block text-xs font-main text-mydarkgrey">
                      {`/${payload[record].slug}`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-xl font-action mb-12 xl:max-w-screen-2xl mt-4 px-4 xl:px-8">
          <div className="-mx-4">
            <table className="w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-black"
                  >
                    Name
                  </th>
                  {(current === `pane` && loadedPanesDaysSince) ||
                  (current === `storyfragment` &&
                    loadedStoryFragmentDaysSince) ? (
                    <th
                      scope="col"
                      className="hidden whitespace-nowrap px-3 py-4 text-left text-sm text-mydarkgrey sm:table-cell"
                    >
                      Activity
                    </th>
                  ) : null}
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-4 text-left text-sm text-mydarkgrey md:table-cell"
                  >
                    Slug
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-mywhite font-main">
                {filterKeys.map(
                  (
                    record: string, // FIX
                  ) => (
                    <tr key={payload[record].title}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-black">
                        {(current === `storyfragment` &&
                          loadedStoryFragmentDaysSince) ||
                        (current === `pane` && loadedPanesDaysSince) ? (
                          <span
                            className="mr-1"
                            title={`Recent activity score | ${
                              current === `storyfragment` &&
                              typeof storyFragmentDaysSinceData[record] !==
                                `undefined` &&
                              typeof storyFragmentDaysSinceData[record]
                                .engagement !== `undefined`
                                ? `${storyFragmentDaysSinceData[record].engagement}%`
                                : current === `pane` &&
                                    typeof panesDaysSinceData[record] !==
                                      `undefined` &&
                                    typeof panesDaysSinceData[record]
                                      .engagement !== `undefined`
                                  ? `${panesDaysSinceData[record].engagement}%`
                                  : `no activity`
                            }`}
                          >
                            <FireIcon
                              className={classNames(
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined`
                                  ? `opacity-${storyFragmentDaysSinceData[record].colorOffset}`
                                  : typeof panesDaysSinceData[record] !==
                                      `undefined`
                                    ? `opacity-${panesDaysSinceData[record].colorOffset}`
                                    : `opacity-5`,
                                `w-4 h-4 text-myorange inline`,
                              )}
                            />
                          </span>
                        ) : (
                          <span className="mr-5"></span>
                        )}
                        <button
                          className="truncate text-md font-main"
                          onClick={() => {
                            setSelectedCollection(current)
                            setSelected(record)
                          }}
                        >
                          {payload[record].title}
                        </button>
                      </td>

                      {(current === `pane` && loadedPanesDaysSince) ||
                      (current === `storyfragment` &&
                        loadedStoryFragmentDaysSince) ? (
                        <td className="hidden whitespace-nowrap pt-4 pb-2 text-sm text-mydarkgrey sm:table-cell">
                          <div
                            className={classNames(
                              `grid`,
                              current === `storyfragment` &&
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined` &&
                                (storyFragmentDaysSinceData[record].entered ||
                                  storyFragmentDaysSinceData[record].discovered)
                                ? `grid-rows-2`
                                : `grid-rows-1`,
                            )}
                          >
                            <div className="flex flex-row flex-nowrap">
                              {(current === `storyfragment` &&
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined` &&
                                ((typeof storyFragmentDaysSinceData[record]
                                  .read === `number` &&
                                  storyFragmentDaysSinceData[record].read >
                                    0) ||
                                  (typeof storyFragmentDaysSinceData[record]
                                    .glossed === `number` &&
                                    storyFragmentDaysSinceData[record].glossed >
                                      0))) ||
                              (current === `pane` &&
                                typeof panesDaysSinceData[record] !==
                                  `undefined`) ? (
                                <>
                                  <div title="Glossed | Read">
                                    <span
                                      title="Glossed | Read"
                                      className="sr-only"
                                    >
                                      Glossed | Read
                                    </span>
                                    <DocumentTextIcon
                                      className="h-4 w-4 text-mydarkgrey"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div
                                    className="text-xs leading-6 text-black ml-1 mr-2"
                                    title="Glossed | Read"
                                  >
                                    {current === `storyfragment` &&
                                    storyFragmentDaysSinceData[record].glossed >
                                      0
                                      ? storyFragmentDaysSinceData[record]
                                          .glossed
                                      : current === `pane` &&
                                          panesDaysSinceData[record].glossed > 0
                                        ? panesDaysSinceData[record].glossed
                                        : null}
                                    {(current === `storyfragment` &&
                                      storyFragmentDaysSinceData[record].read >
                                        0 &&
                                      storyFragmentDaysSinceData[record]
                                        .glossed > 0) ||
                                    (current === `pane` &&
                                      panesDaysSinceData[record].read > 0 &&
                                      panesDaysSinceData[record].glossed > 0)
                                      ? `, `
                                      : null}
                                    {current === `storyfragment` &&
                                    storyFragmentDaysSinceData[record].read > 0
                                      ? storyFragmentDaysSinceData[record].read
                                      : current === `pane` &&
                                          panesDaysSinceData[record].read > 0
                                        ? panesDaysSinceData[record].read
                                        : null}
                                  </div>
                                </>
                              ) : null}

                              {(current === `storyfragment` &&
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined` &&
                                storyFragmentDaysSinceData[record].clicked >
                                  0) ||
                              (current === `pane` &&
                                typeof panesDaysSinceData[record] !==
                                  `undefined` &&
                                panesDaysSinceData[record].clicked > 0) ? (
                                <>
                                  <div title="Clicked">
                                    <span className="sr-only">Clicked</span>
                                    <CursorArrowRaysIcon
                                      className="h-4 w-4 text-mydarkgrey"
                                      aria-hidden="true"
                                    />
                                  </div>

                                  {current === `storyfragment` ? (
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Clicked"
                                    >
                                      <span>
                                        {
                                          storyFragmentDaysSinceData[record]
                                            .clicked
                                        }
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Clicked"
                                    >
                                      <span>
                                        {panesDaysSinceData[record].clicked}
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : null}
                            </div>

                            {current === `storyfragment` &&
                            typeof storyFragmentDaysSinceData[record] !==
                              `undefined` &&
                            (storyFragmentDaysSinceData[record].entered ||
                              storyFragmentDaysSinceData[record].discovered) ? (
                              <div className="flex flex-row flex-nowrap">
                                {current === `storyfragment` &&
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined` &&
                                storyFragmentDaysSinceData[record].entered >
                                  0 ? (
                                  <>
                                    <div title="Entered">
                                      <span className="sr-only">Entered</span>
                                      <FingerPrintIcon
                                        className="h-4 w-4 text-mydarkgrey"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div
                                      className="text-xs leading-6 text-black ml-1 mr-2"
                                      title="Entered"
                                    >
                                      <span>
                                        {
                                          storyFragmentDaysSinceData[record]
                                            .entered
                                        }
                                      </span>
                                    </div>
                                  </>
                                ) : null}

                                {current === `storyfragment` &&
                                typeof storyFragmentDaysSinceData[record] !==
                                  `undefined` &&
                                storyFragmentDaysSinceData[record].discovered >
                                  0 ? (
                                  <>
                                    <div title="Discovered">
                                      <span className="sr-only">
                                        Discovered
                                      </span>
                                      <BookOpenIcon
                                        className="h-4 w-4 text-mydarkgrey"
                                        aria-hidden="true"
                                      />
                                    </div>

                                    {current === `storyfragment` ? (
                                      <div
                                        className="text-xs leading-6 text-black ml-1 mr-2"
                                        title="Discovered"
                                      >
                                        <span>
                                          {
                                            storyFragmentDaysSinceData[record]
                                              .discovered
                                          }
                                        </span>
                                      </div>
                                    ) : (
                                      <div
                                        className="text-xs leading-6 text-black ml-1 mr-2"
                                        title="Discovered"
                                      >
                                        <span>
                                          {
                                            panesDaysSinceData[record]
                                              .discovered
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </td>
                      ) : null}

                      <td className="hidden whitespace-nowrap px-3 py-4 text-xs font-main text-mydarkgrey md:table-cell">
                        {payload[record].slug || payload[record].categorySlug}
                      </td>

                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
                        <button
                          onClick={() => {
                            setSelectedCollection(current)
                            setSelected(record)
                          }}
                          className="text-myblue underline underline-offset-2 text-sm hover:text-myorange"
                        >
                          Edit
                          <span className="sr-only">
                            , {payload[record].title}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            {(current === `pane` && loadedPanesDaysSince) ||
            (current === `storyfragment` && loadedStoryFragmentDaysSince) ? (
              <div className="my-6">
                <FireIcon
                  className={classNames(`w-4 h-4 text-myorange inline`)}
                />
                <span className="ml-1 text-black font-main text-sm">
                  Recent activity score | between 0 and 100%, a value of 100%
                  means very recent activity.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}

export default StoryKeep
