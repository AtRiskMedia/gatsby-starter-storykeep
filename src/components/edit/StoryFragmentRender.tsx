// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useRef, useMemo, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import styled from 'styled-components'
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'
import { classNames, Compositor } from '@tractstack/helpers'

import { IAdd } from '../../types'
import { useDrupalStore } from '../../stores/drupal'
import StoryFragmentPaneRender from './StoryFragmentPaneRender'
import { injectBuilderClasses } from '../../helpers/injectBuilderClasses'
import DetailsPane from './DetailsPane'
import StoryFragmentStarter from './StoryFragmentStarter'
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
  const overrideWidthCss = `width:${width}px;`
  const viewportClasses = classNames(
    thisStoryFragment.tailwindBgColour || ``,
    `h-fit-content overflow-hidden`,
  )
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [idx, setIdx] = useState(-1)
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

  const handleAdd = (mode: string, paneId?: string) => {
    setAddModalOpen(false)
    if (mode === `new`) handleInsertPane(idx)
    else if (mode === `existing` && paneId) handleInsertPane(idx, paneId)
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
                      <StoryFragmentStarter
                        fn={{ handleAdd, addModalOpen }}
                        flags={{ allowCancel: true }}
                      />
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
          className={classNames(
            `pr-6`,
            idx % 2 === 0 ? `bg-black/10` : `bg-black/5`,
          )}
        >
          <StyledWrapperDiv css={overrideWidthCss}>
            {idx === 0 ? <Add idx={idx} /> : null}
          </StyledWrapperDiv>
          <div className="w-full grow flex flex-row pr-6">
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
                  flags={{ saveStage: flags.saveStage }}
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
                      flags={{
                        saveStage: flags.saveStage,
                        storyFragmentId: uuid,
                        panes: flags.panes,
                      }}
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
