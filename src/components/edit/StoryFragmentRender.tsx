// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useRef, useMemo, Fragment } from 'react'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import styled from 'styled-components'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline'
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  RectangleGroupIcon,
} from '@heroicons/react/20/solid'
import { classNames, Compositor } from '@tractstack/helpers'

import { IAdd } from '../../types'
import { useDrupalStore } from '../../stores/drupal'
import StoryFragmentPaneRender from './StoryFragmentPaneRender'
import { injectBuilderClasses } from '../../helpers/injectBuilderClasses'
import DetailsPane from './DetailsPane'
import { getPaneDetailsPie } from '../../api/services'

const goGetPaneDetailsPie = async (storyFragmentId: string) => {
  try {
    const response = await getPaneDetailsPie({ storyFragmentId })
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

interface IStyledWrapperSectionProps {
  css: string
}
const StyledWrapperSection = styled.section<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`
const StyledWrapperDiv = styled.div<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`

const StoryFragmentRender = ({ uuid, previewPayload, flags, fn }: any) => {
  const { handleInsertPane, handleReorderPane } = fn
  const { width, viewportKey } = flags
  const elementRef = useRef<HTMLElement>(null)
  const thisStoryFragment = previewPayload.state
  const thisTractStack = useDrupalStore(
    (state) => state.allTractStacks[thisStoryFragment.tractstack],
  )
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  // thisStoryFragment.panes.forEach((e: any) => {
  //  console.log(e, allPanes[e])
  //  if (allPanes[e].relationships.markdown[0]) console.log(allPanes[e].relationships.markdown[0], allMarkdown[allPanes[e].relationships.markdown[0]])
  // })
  const overrideWidthCss = `width:${width}px;`
  const viewportClasses = classNames(
    thisStoryFragment.tailwindBgColour || ``,
    `h-fit-content overflow-hidden`,
  )
  const [query, setQuery] = useState(``)
  const [selectedPane, setSelectedPane] = useState<any>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [idx, setIdx] = useState(-1)
  const panes = Object.keys(allPanes).map((e: string) => {
    return { id: e, title: allPanes[e].title }
  })
  const filteredPanes =
    query === ``
      ? panes
      : panes.filter((pane: any) => {
          return pane.title.toLowerCase().includes(query.toLowerCase())
        })
  const renderedPayload = useMemo(() => {
    const panesPayload = thisStoryFragment.panes.map((e: string) => {
      const thisPane = allPanes[e]
      const markdownPayload = (e: string) => {
        const thisMarkdown = allMarkdown[e]
        const thisMarkdownImages = thisMarkdown?.relationships?.images?.map(
          (f: any) => {
            if (typeof f === `string`) return allFiles[f]
            return f
          },
        )
        const thisMarkdownImagesSvg =
          thisMarkdown?.relationships?.imagesSvg?.map((f: any) => {
            return allFiles[f]
          })
        return {
          id: e,
          ...thisMarkdown,
          relationships: {
            images: thisMarkdownImages,
            imagesSvg: thisMarkdownImagesSvg,
          },
        }
      }
      const optionsPayload =
        typeof thisPane?.optionsPayload === `string`
          ? JSON.parse(thisPane.optionsPayload)
          : null
      const paneFragmentsOptionsPayloadObject =
        typeof optionsPayload?.paneFragmentsPayload === `object`
          ? optionsPayload.paneFragmentsPayload
          : null
      const paneFragmentsOptionsPayload =
        paneFragmentsOptionsPayloadObject?.reduce((acc: any, cur: any) => {
          acc[cur.id] = { ...cur }
          return acc
        }, {})
      const paneFragmentsOptionsPayloadOverride = injectBuilderClasses(
        paneFragmentsOptionsPayload,
      )
      const optionsPayloadOverride: any = {
        ...optionsPayload,
        paneFragmentsPayload: paneFragmentsOptionsPayloadOverride,
      }
      const optionsPayloadOverrideString = paneFragmentsOptionsPayloadOverride
        ? JSON.stringify(optionsPayloadOverride)
        : null
      return {
        id: e,
        title: thisPane.title,
        slug: thisPane.slug,
        optionsPayload: optionsPayloadOverrideString || thisPane.optionsPayload,
        isContextPane: thisPane.isContextPane,
        heightRatio:
          viewportKey === `mobile`
            ? thisPane.heightRatioMobile
            : viewportKey === `tablet`
              ? thisPane.heightRatioTablet
              : thisPane.heightRatioDesktop,
        heightOffset:
          viewportKey === `mobile`
            ? thisPane.heightOffsetMobile
            : viewportKey === `tablet`
              ? thisPane.heightOffsetTablet
              : thisPane.heightOffsetDesktop,
        relationships: {
          markdown: thisPane.relationships.markdown.map((e: string) => {
            return markdownPayload(e)
          }),
        },
      }
    })
    const compositorPayload = {
      panesPayload,
      tailwindBgColour: thisStoryFragment.tailwindBgColour || null,
      viewportKey,
      hooks: {
        belief: () => {},
        processRead: () => {},
        GatsbyImage: () => {},
        getImage: () => {},
        resourcePayload: () => {},
      },
      id: {
        id: uuid,
        title: thisStoryFragment.title,
        slug: thisStoryFragment.slug,
        tractStackId: thisStoryFragment.tractstack,
        tractStackTitle: thisTractStack.title,
        tractStackSlug: thisTractStack.slug,
        isBuilderPreview: true,
      },
    }
    return Compositor(compositorPayload)
  }, [
    allFiles,
    allMarkdown,
    allPanes,
    thisStoryFragment.panes,
    thisStoryFragment.slug,
    thisStoryFragment.tailwindBgColour,
    thisStoryFragment.title,
    thisStoryFragment.tractstack,
    thisTractStack.slug,
    thisTractStack.title,
    uuid,
    viewportKey,
  ])

  const handleAdd = (mode: string) => {
    setAddModalOpen(false)
    if (mode === `new`) handleInsertPane(idx)
    else if (mode === `existing` && selectedPane)
      handleInsertPane(idx, selectedPane.id)
  }

  const Add = ({ idx }: IAdd) => (
    <div className="relative bg-black/20">
      <>
        <button
          className="absolute top-0
            left-0 w-full h-full hover:border-2 hover:border-mygreen hover:border-dashed hover:bg-mygreen hover:bg-opacity-20 hover:border-opacity-20 z-9"
          title="Insert Pane"
          onClick={() => {
            setIdx(idx)
            setAddModalOpen(!addModalOpen)
          }}
        ></button>
        <div className="relative flex justify-center">
          <span className="bg-mywhite px-2">
            <PlusIcon className="h-5 w-5 text-mylightgrey" aria-hidden="true" />
          </span>
        </div>
      </>
    </div>
  )

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    function handleResize() {
      const thisWidth = elementRef?.current?.offsetWidth || 0
      const viewportWidth =
        viewportKey === `desktop` ? 1928 : viewportKey === `tablet` ? 1088 : 608
      const thisScale = (thisWidth - 8) / viewportWidth
      document.documentElement.style.setProperty(
        `--scale`,
        thisScale.toString(),
      )
    }
    window.addEventListener(`resize`, handleResize)
    handleResize()
    const lastWidth = width
    if (width !== lastWidth) handleResize()
    return () => window.removeEventListener(`resize`, handleResize)
  }, [elementRef, viewportKey, width])

  useEffect(() => {
    if (data && Object.keys(data).length === 0 && !loading && !loaded) {
      setLoading(true)
      goGetPaneDetailsPie(uuid)
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            setData(JSON.parse(res.data.data))
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => {
          setLoaded(true)
          setLoading(false)
        })
    }
  }, [uuid, data, setData, loaded, loading, setLoaded, setLoading])

  return (
    <>
      {addModalOpen ? (
        <Transition.Root show={addModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-30" onClose={setAddModalOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-mydarkgrey/80 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 max-w-screen overflow-y-auto">
              <div className="flex h-full justify-center items-center">
                <div className="flex bg-mylightgrey h-96 w-full items-end justify-start p-4 text-center xs:items-center xs:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 xs:translate-y-0 xs:scale-95"
                    enterTo="opacity-100 translate-y-0 xs:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 xs:scale-100"
                    leaveTo="opacity-0 translate-y-4 xs:translate-y-0 xs:scale-95"
                  >
                    <Dialog.Panel className="max-w-3xl relative transform px-4 pb-4 pt-5 text-left transition-all xs:my-8 xs:w-full xs:p-6">
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
                              <Dialog.Title
                                as="h3"
                                className="text-lg font-main leading-6 text-black"
                              >
                                Design a new pane?
                              </Dialog.Title>
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
                              onClick={() => setAddModalOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
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
                              <Dialog.Title
                                as="h3"
                                className="text-lg font-main leading-6 text-black"
                              >
                                Insert an existing pane?
                              </Dialog.Title>
                            </div>
                          </div>
                          <Combobox
                            as="div"
                            value={selectedPane}
                            onChange={setSelectedPane}
                          >
                            <Combobox.Label className="mt-3 block text-sm leading-6 text-black">
                              Select pane or enter title to search
                            </Combobox.Label>
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-black shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-mygreen xs:text-sm xs:leading-6"
                                onChange={(event) =>
                                  setQuery(event.target.value)
                                }
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
                                          active
                                            ? `bg-mygreen text-black`
                                            : `text-black`,
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
                                                active
                                                  ? `text-white`
                                                  : `text-mygreen`,
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
                                onClick={() => handleAdd(`existing`)}
                              >
                                Insert
                              </button>
                            ) : null}
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 xs:mt-0 xs:w-auto"
                              onClick={() => setAddModalOpen(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
      {thisStoryFragment.panes?.map((p: string, idx: number) => (
        <div
          key={`${p}-${idx}`}
          className={idx % 2 === 0 ? `bg-black/10` : `bg-black/5`}
        >
          <StyledWrapperDiv css={overrideWidthCss}>
            {idx === 0 ? <Add idx={idx} /> : null}
          </StyledWrapperDiv>
          <div className="w-full grow flex flex-row">
            <StyledWrapperDiv
              ref={elementRef as React.RefObject<HTMLDivElement>}
              className="shrink-0"
              css={overrideWidthCss}
            >
              <StyledWrapperSection
                css={renderedPayload?.storyFragment?.css || ``}
              >
                <StoryFragmentPaneRender
                  payload={{
                    panePayload: renderedPayload.contentMap[p],
                    children:
                      renderedPayload.contentChildren[`${viewportKey}-${p}`],
                  }}
                  paneId={p}
                  storyFragmentId={flags.storyFragmentId}
                  viewportKey={viewportKey}
                  viewportClasses={viewportClasses}
                />
              </StyledWrapperSection>
            </StyledWrapperDiv>
            <div className="flex-1 shrink">
              <div className="flex flex-row">
                <div className="m-2 py-2 bg-mywhite rounded-md w-72 shadow-md">
                  {loaded ? (
                    <DetailsPane
                      uuid={p}
                      data={data.filter((e: any) => e.paneId === p)}
                    />
                  ) : null}
                </div>
                <div className="flex flex-col my-2">
                  {idx > 0 ? (
                    <button
                      title="Move Up"
                      onClick={() => handleReorderPane(idx, false)}
                      className="my-0.5 py-1 rounded-md bg-mywhite px-2 shadow-sm hover:bg-myorange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </button>
                  ) : null}
                  {idx + 1 < thisStoryFragment.panes.length ? (
                    <button
                      title="Move Down"
                      onClick={() => handleReorderPane(idx, true)}
                      className="my-0.5 py-1 rounded-md bg-mywhite px-2 shadow-sm hover:bg-myorange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </button>
                  ) : null}
                  <button
                    title="Remove Pane"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Remove pane from this storyfragment? Please confirm.`,
                        )
                      )
                        handleReorderPane(idx, undefined)
                    }}
                    className="my-0.5 py-1 rounded-md bg-mywhite px-2 shadow-sm hover:bg-myorange hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <StyledWrapperDiv css={overrideWidthCss}>
            <Add idx={idx + 1} />
          </StyledWrapperDiv>
        </div>
      ))}
    </>
  )
}

export default StoryFragmentRender
