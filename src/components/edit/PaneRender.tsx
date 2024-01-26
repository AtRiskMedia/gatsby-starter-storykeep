// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  DependencyList,
  useCallback,
} from 'react'
import { renderToString } from 'react-dom/server'
import { ArrowDownIcon } from '@heroicons/react/20/solid'
import styled from 'styled-components'
import { classNames, Compositor } from '@tractstack/helpers'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'
import ContentEditable from 'react-contenteditable'

import PaneEditInPlace from './PaneEditInPlace'
import { generateLivePreviewPayload } from '../../helpers/generateLivePreviewPayload'
import { htmlToMarkdown } from '../../helpers/htmlToMarkdown'
import { useDrupalStore } from '../../stores/drupal'
import {
  IEditInPlace,
  IInterceptOverride,
  IContentEditableContainer,
  ICurrentlyDesigning,
  IPaneRender,
} from '../../types'

interface IStyledWrapperSectionProps {
  css: string
}
const StyledWrapperSection = styled.section<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`
const StyledWrapperDiv = styled.div<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`

const CurrentlyDesigning = ({
  viewportKey,
  setViewportKey,
  setWidth,
  innerWidth,
  visible,
}: ICurrentlyDesigning) => {
  if (!visible) return null
  return (
    <>
      <div className="my-2 flex items-center px-3">
        <span className="mr-2 text-sm text-mydarkgrey">
          Currently designing for:
        </span>
        <span className="font-bold text-xl text-myblue">{viewportKey}</span>
      </div>
      <div className="mb-3 text-myorange">
        <div className="flex justify-between flex-row">
          <div className="w-1/3 grid justify-items-center">
            <button
              onClick={() => {
                setWidth(innerWidth[0])
                setViewportKey(`mobile`)
              }}
              title="Design for mobile"
              className={classNames(
                viewportKey === `mobile`
                  ? `text-myorange`
                  : `text-mydarkgrey/5`,
                `inline-flex`,
              )}
            >
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="w-1/3 grid justify-items-center">
            <button
              onClick={() => {
                setWidth(innerWidth[1])
                setViewportKey(`tablet`)
              }}
              title="Design for tablet"
              className={classNames(
                viewportKey === `tablet`
                  ? `text-myorange`
                  : `text-mydarkgrey/5`,
                `inline-flex`,
              )}
            >
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
            </button>
          </div>
          <div className="w-1/3 grid justify-items-center">
            <button
              onClick={() => {
                setWidth(innerWidth[2])
                setViewportKey(`desktop`)
              }}
              title="Design for desktop"
              className={classNames(
                viewportKey === `desktop`
                  ? `text-myorange`
                  : `text-mydarkgrey/5`,
                `inline-flex`,
              )}
            >
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
              <ArrowDownIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

const tags = {
  h1: `Heading`,
  h2: `Heading`,
  h3: `Heading`,
  h4: `Heading`,
  h5: `Heading`,
  h6: `Heading`,
  p: `Paragraph`,
  li: `List Item`,
  img: `Image`,
  code: `Code Hook`,
  ul: `Unordered List`,
  ol: `Ordered List`,
}

const useRefCallback = <T extends any[]>(
  value: ((...args: T) => void) | undefined,
  deps?: DependencyList,
): ((...args: T) => void) => {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value, deps])

  const result = useCallback((...args: T) => {
    ref.current?.(...args)
  }, [])

  return result
}

const PaneRender = ({ uuid, previewPayload, fn, flags }: IPaneRender) => {
  const {
    setInterceptMode,
    handleEditMarkdown,
    handleMutateMarkdown,
    handleChangeEditInPlace,
    setViewportKey,
    setWidth,
    handleUnsavedImage,
    setLocked,
    setShowImageLibrary,
  } = fn
  const {
    innerWidth,
    width,
    interceptMode,
    interceptModeTag,
    viewportKey,
    unsavedMarkdownImages,
    unsavedMarkdownImageSvgs,
    locked,
    showImageLibrary,
  } = flags
  const [pageStylesPagination, setPageStylesPagination] = useState(-1)
  const thisPane = previewPayload.state
  const paneFragmentsPayload = previewPayload.statePaneFragments
  const emptyPane =
    Object.keys(paneFragmentsPayload).length === 0 && !thisPane?.codeHookTarget
  const codeHook =
    Object.keys(paneFragmentsPayload).length === 0 && thisPane?.codeHookTarget
  const listItemsLookup =
    previewPayload.stateLivePreviewMarkdown.listItemsLookup
  const stateLivePreview = previewPayload.stateLivePreview
  const stateLivePreviewMarkdown = previewPayload.stateLivePreviewMarkdown
  const imagesLookup = previewPayload.stateLivePreviewMarkdown.imagesLookup
  const codeItemsLookup =
    previewPayload.stateLivePreviewMarkdown.codeItemsLookup
  const [nth, setNth] = useState(-1)
  const [focus, setFocus] = useState(-1)
  const [childFocus, setChildFocus] = useState(-1)
  const [childFocusNth, setChildFocusNth] = useState(-1)
  const [childNth, setChildNth] = useState(-1)
  const [childGlobalNth, setChildGlobalNth] = useState(-1)
  const [tag, setTag] = useState(``)
  const [tagType, setTagType] = useState(``)
  const EditInPlaceReset = () => {
    setNth(-1)
    setChildNth(-1)
    setTag(``)
  }
  const overrideWidthCss = `width:${width}px;`
  const thisId = `${viewportKey}-${uuid}`
  const elementRef = useRef<HTMLElement>(null)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const thisPaneOri = useDrupalStore((state) => state.allPanes[uuid])
  const hasMaxHScreen =
    typeof thisPane?.hasMaxHScreen === `boolean`
      ? thisPane.hasMaxHScreen
      : false
  const viewportClasses = `h-fit-content overflow-hidden`

  const renderedPayload = useMemo(() => {
    function ContentEditableContainer({
      initialValue,
      useRefCallback,
      className,
      title,
      nth,
      parent,
      Tag,
    }: IContentEditableContainer) {
      const [text, setText] = useState(initialValue)

      const handleChange = useRefCallback((evt: any) => {
        setText(evt.target.value)
      }, [])

      const handleBlur = useRefCallback(
        (e: FocusEvent) => {
          const element = e.target as HTMLInputElement
          const markdown = htmlToMarkdown(element, Tag)
          interceptEdit({
            nth: typeof parent === `number` && parent > -1 ? parent : nth,
            childNth: typeof parent === `number` && parent > -1 ? nth : -1,
            mode: Tag,
            payload: markdown,
          })
        },
        [text],
      )

      const handleFocus = useRefCallback(() => {
        if (locked) return null
        setPageStylesPagination(-1)
        setNth(typeof parent === `number` && parent > -1 ? parent : nth)
        setChildNth(typeof parent === `number` && parent > -1 ? nth : -1)
        setTag(Tag)
        setTagType(tags[Tag])
        if (
          Tag === `li` &&
          typeof parent === `number` &&
          typeof nth === `number` &&
          typeof listItemsLookup[parent][nth] === `number`
        )
          setChildGlobalNth(listItemsLookup[parent][nth])
        else if (
          Tag === `img` &&
          typeof nth === `number` &&
          typeof parent === `number` &&
          typeof imagesLookup[parent][nth] === `number`
        )
          setChildGlobalNth(imagesLookup[parent][nth])
        else if (
          Tag === `code` &&
          typeof nth === `number` &&
          typeof parent === `number` &&
          typeof codeItemsLookup[parent][nth] === `number`
        )
          setChildGlobalNth(codeItemsLookup[parent][nth])
        else setChildGlobalNth(-1)
      }, [])

      const pasteAtCaret = (text: string) => {
        let range
        const parser = new DOMParser()
        const el = parser.parseFromString(text, `text/html`).body
        if (window?.getSelection) {
          const sel = window.getSelection()
          if (sel?.getRangeAt && sel?.rangeCount) {
            range = sel.getRangeAt(0)
            range.deleteContents()
            const frag = document.createDocumentFragment()
            let node, lastNode
            while ((node = el.firstChild)) {
              lastNode = frag.appendChild(node)
            }
            range.insertNode(frag)
            if (lastNode) {
              range = range.cloneRange()
              range.setStartAfter(lastNode)
              range.collapse(true)
              sel.removeAllRanges()
              sel.addRange(range)
            }
          }
        }
      }

      return (
        <ContentEditable
          html={text}
          title={title}
          className={className}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            const keyCode = e.code
            if (keyCode === `Enter`) {
              const element = e.target as HTMLInputElement
              element.blur()
            }
          }}
          onPaste={(e) => {
            e.preventDefault()
            const text = e.clipboardData.getData(`text/plain`)
            pasteAtCaret(text)
          }}
          onChange={handleChange}
          onMouseEnter={handleFocus}
        />
      )
    }

    const deepEqual = require(`deep-equal`)
    const interceptEdit = ({ nth, childNth, payload }: IInterceptOverride) => {
      const tag =
        typeof childNth === `number` && childNth > 1
          ? `li`
          : previewPayload.stateLivePreviewMarkdown.markdownTags[nth]
      const oldArray = previewPayload.stateLivePreviewMarkdown.markdownArray
      const oldValue =
        typeof childNth === `number` && childNth > -1
          ? oldArray[nth].split(/\n/)[childNth]
          : oldArray[nth]
      const newArray = [...oldArray]
      const thisPayload =
        payload === `#\n`
          ? `# ...\n`
          : payload === `##\n`
            ? `## ...\n`
            : payload === `###\n`
              ? `### ...\n`
              : payload === `####\n`
                ? `#### ...\n`
                : payload === `#####\n`
                  ? `##### ...\n`
                  : payload === `######\n`
                    ? `###### ...\n`
                    : payload === ``
                      ? `...`
                      : payload === `*\n` &&
                          previewPayload.stateLivePreviewMarkdown.markdownTags[
                            nth
                          ] === `ol`
                        ? `1. ...`
                        : payload === `*\n`
                          ? `* ...`
                          : payload[0] === `*` &&
                              previewPayload.stateLivePreviewMarkdown
                                .markdownTags[nth] === `ol`
                            ? `1. ${payload.trim().substring(2)}`
                            : payload.trim()
      if (
        oldValue !== payload &&
        typeof childNth === `number` &&
        childNth > -1
      ) {
        const override = oldArray[nth].split(/\n/).filter((n: any) => n)
        override[childNth] = thisPayload
        newArray[nth] = `${override.join(`\n`)}\n`
      } else if (oldValue !== thisPayload) {
        newArray[nth] = `${thisPayload}\n`
      }

      const regexp = (target: string) => `^.*\\[(.*)\\]\\((${target})\\)`
      const hasLinks =
        typeof stateLivePreviewMarkdown.linksLookup[nth] !== `undefined`
      if (hasLinks) {
        Object.keys(stateLivePreviewMarkdown.linksLookup[nth]).forEach((e) => {
          const match = newArray[nth].match(
            regexp(stateLivePreviewMarkdown.links[e].target),
          )
          const newValue =
            match &&
            typeof match[1] === `string` &&
            match[1] !== stateLivePreviewMarkdown.links[e].value
              ? match[1]
              : null
          if (newValue) {
            const thisId = `${nth}--${tag}---link-${e}--title`
            handleChangeEditInPlace({
              target: { name: thisId, value: newValue },
            })
          }
        })
      }
      if (!deepEqual(newArray, oldArray)) handleEditMarkdown(newArray)
    }
    const interceptInsert = ({ nth, childNth, mode }: IInterceptOverride) => {
      handleMutateMarkdown(nth, childNth, mode, interceptModeTag)
      setInterceptMode(`edit`)
    }
    const interceptDelete = ({ nth, childNth }: IInterceptOverride) => {
      handleMutateMarkdown(nth, childNth, `delete`)
      setInterceptMode(`edit`)
    }
    const EditInPlace = ({
      Tag,
      value,
      nth,
      parent,
      className,
    }: IEditInPlace) => {
      const thisNth = parent && parent > -1 ? parent : nth
      let specialMode = ``
      let specialModeOn = false
      let specialModePre = true
      let specialModePost = true
      const thisTagType = typeof tags[Tag] !== `undefined` ? tags[Tag] : null
      if (!thisTagType) return null
      const ThisTag = Tag === `img` ? `p` : Tag

      switch (interceptModeTag) {
        case `li`:
          specialMode = `listItem`
          if (Tag === `li`) specialModeOn = true
          break

        case `ul`:
        case `ol`:
        case `imageContainer`:
          if (interceptModeTag === `imageContainer`)
            specialMode = `imageContainer`
          else specialMode = `list`
          specialModeOn = true
          if (
            [`ul`, `ol`].includes(
              stateLivePreviewMarkdown.markdownTags[thisNth],
            )
          ) {
            specialModePre = false
            specialModePost = false
          }
          if (
            typeof stateLivePreviewMarkdown.markdownTags[thisNth - 1] ===
              `string` &&
            [`ul`, `ol`].includes(
              stateLivePreviewMarkdown.markdownTags[thisNth - 1],
            )
          )
            specialModePre = false
          if (
            typeof stateLivePreviewMarkdown.markdownTags[thisNth + 1] ===
              `string` &&
            [`ul`, `ol`].includes(
              stateLivePreviewMarkdown.markdownTags[thisNth + 1],
            )
          )
            specialModePost = false
          break

        case `p`:
        case `h2`:
        case `h3`:
        case `h4`:
        case `h5`:
        case `h6`:
          if (Tag !== `li`) {
            specialMode = `insert`
            specialModeOn = true
          }
          break
      }

      if (interceptMode === `edit` && [`img`, `code`].includes(Tag))
        return (
          <>
            <button
              className="absolute top-0 left-0 w-full h-full border hover:border-black border-transparent z-8 hover:bg-red-900 hover:bg-opacity-20"
              title={`Edit this ${thisTagType}`}
              onClick={() => {
                setPageStylesPagination(-1)

                setNth(typeof parent === `number` && parent > -1 ? parent : nth)
                setChildNth(
                  typeof parent === `number` && parent > -1 ? nth : -1,
                )
                setTag(Tag)
                setTagType(tags[Tag])
                if (
                  Tag === `img` &&
                  typeof nth === `number` &&
                  typeof parent === `number` &&
                  typeof imagesLookup[parent][nth] === `number`
                )
                  setChildGlobalNth(imagesLookup[parent][nth])
                if (
                  Tag === `code` &&
                  typeof nth === `number` &&
                  typeof parent === `number` &&
                  typeof codeItemsLookup[parent][nth] === `number`
                )
                  setChildGlobalNth(codeItemsLookup[parent][nth])
              }}
            ></button>
            <ThisTag>{value}</ThisTag>
          </>
        )
      else if (interceptMode === `edit` && ![`ul`, `ol`].includes(Tag)) {
        const html = renderToString(value)
        return (
          <ContentEditableContainer
            initialValue={html}
            className={className}
            title={`Edit this ${thisTagType}`}
            useRefCallback={useRefCallback}
            nth={nth}
            parent={parent}
            Tag={Tag}
          />
        )
      } else if (interceptMode === `delete` && ![`ul`, `ol`].includes(Tag)) {
        // prevent collapse of lists in markdown; breaks out current data model
        if (
          typeof stateLivePreviewMarkdown?.markdownTags[thisNth - 1] !==
            `undefined` &&
          [`ul`, `ol`].includes(
            stateLivePreviewMarkdown.markdownTags[thisNth - 1],
          ) &&
          typeof stateLivePreviewMarkdown?.markdownTags[thisNth + 1] !==
            `undefined` &&
          [`ul`, `ol`].includes(
            stateLivePreviewMarkdown.markdownTags[thisNth + 1],
          )
        )
          return <div className={className}>{value}</div>
        return (
          <>
            <button
              className="absolute top-0 left-0 w-full h-full border border-transparent hover:border-red-900 border-dashed z-8 hover:bg-red-900 hover:bg-opacity-20"
              title={`Delete this ${thisTagType}`}
              onClick={() =>
                interceptDelete({
                  tag: Tag,
                  nth: typeof parent === `number` && parent > -1 ? parent : nth,
                  childNth:
                    typeof parent === `number` && parent > -1 ? nth : -1,
                  mode: `delete`,
                })
              }
            ></button>
            <div className={className}>{value}</div>
          </>
        )
      } else if (
        interceptMode === `insert` &&
        [`ul`, `ol`].includes(Tag) &&
        [`p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`].includes(interceptModeTag)
      ) {
        return (
          <>
            <button
              className="absolute top-0 left-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
              title={`Insert before ${thisTagType}`}
              onClick={() =>
                interceptInsert({
                  nth,
                  childNth: -1,
                  mode: `pre`,
                })
              }
            ></button>
            <button
              className="absolute top-0 right-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
              title={`Insert after ${thisTagType}`}
              onClick={() =>
                interceptInsert({
                  nth,
                  childNth: -1,
                  mode: `post`,
                })
              }
            ></button>
            <div className={className}>{value}</div>
          </>
        )
      } else if (
        interceptMode === `insert` &&
        specialMode &&
        specialModeOn &&
        Tag !== `img`
      ) {
        return (
          <>
            {specialModePre ? (
              <button
                className="absolute top-0 left-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
                title={`Insert before ${thisTagType}`}
                onClick={() =>
                  interceptInsert({
                    // tag: Tag,
                    nth:
                      typeof parent === `number` && parent > -1 ? parent : nth,
                    childNth:
                      typeof parent === `number` && parent > -1 ? nth : -1,
                    mode: specialMode === `parent` ? `parentpre` : `pre`,
                  })
                }
              ></button>
            ) : null}
            {specialModePost ? (
              <button
                className="absolute top-0 right-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
                title={`Insert after this ${thisTagType}`}
                onClick={() =>
                  interceptInsert({
                    // tag: Tag,
                    nth:
                      typeof parent === `number` && parent > -1 ? parent : nth,
                    childNth:
                      typeof parent === `number` && parent > -1 ? nth : -1,
                    mode: specialMode === `parent` ? `parentpost` : `post`,
                  })
                }
              ></button>
            ) : null}
            <div className={className}>{value}</div>
          </>
        )
      } else if (
        interceptMode === `insert` &&
        Tag === `img` &&
        interceptModeTag === `image`
      ) {
        return (
          <>
            <button
              className="absolute top-0 left-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
              title={`Insert image before this one`}
              onClick={() =>
                interceptInsert({
                  nth: typeof parent === `number` && parent > -1 ? parent : nth,
                  childNth:
                    typeof parent === `number` && parent > -1 ? nth : -1,
                  mode: `imagePre`,
                })
              }
            ></button>
            <button
              className="absolute top-0 right-0 w-1/2 h-full border border-transparent hover:border-myorange border-dashed z-8 hover:bg-myorange hover:bg-opacity-20"
              title={`Insert image after this one`}
              onClick={() =>
                interceptInsert({
                  nth: typeof parent === `number` && parent > -1 ? parent : nth,
                  childNth:
                    typeof parent === `number` && parent > -1 ? nth : -1,
                  mode: `imagePost`,
                })
              }
            ></button>
            <div className={className}>{value}</div>
          </>
        )
      } else return <div className={className}>{value}</div>
    }

    // generates live preview using data from state
    const newMarkdown = Object.keys(paneFragmentsPayload)
      .map((e) => {
        if (
          typeof paneFragmentsPayload[e] !== `undefined` &&
          typeof paneFragmentsPayload[e].markdownId !== `undefined`
        ) {
          const thisMarkdown = paneFragmentsPayload[e]
          const thisMarkdownId = thisMarkdown.markdownId
          if (typeof allMarkdown[thisMarkdownId] === `undefined`) return null
          const thisMarkdownOri = allMarkdown[thisMarkdownId]
          const thisMarkdownImages = thisMarkdownOri.relationships.images
            .map((f: any) => {
              if (typeof f === `string`) return allFiles[f]
              return f
            })
            .concat(
              unsavedMarkdownImages &&
                Object.keys(unsavedMarkdownImages).map(
                  (e: string) => unsavedMarkdownImages[e],
                ),
            )
            .filter((e: any) => e)
          const thisMarkdownImagesSvg = thisMarkdownOri.relationships.imagesSvg
            .map((f: any) => {
              return allFiles[f]
            })
            .concat(
              unsavedMarkdownImageSvgs &&
                Object.keys(unsavedMarkdownImageSvgs).map(
                  (e: string) => unsavedMarkdownImageSvgs[e],
                ),
            )
            .filter((e: any) => e)
          console.log(`ori`, thisMarkdownImages, thisMarkdownImagesSvg)
          console.log(`new`, unsavedMarkdownImages, unsavedMarkdownImageSvgs)
          console.log(``)
          return {
            id: paneFragmentsPayload[e].markdownId,
            drupalNid: thisMarkdownOri.drupalNid,
            title: thisMarkdownOri.title,
            type: `node__markdown`,
            markdownBody: thisMarkdown.markdownBody,
            childMarkdown: {
              childMarkdownRemark: {
                htmlAst: toHast(fromMarkdown(thisMarkdown.markdownBody)),
              },
            },
            slug: thisMarkdownOri.slug,
            categorySlug: thisMarkdownOri.categorySlug,
            relationships: {
              images: thisMarkdownImages,
              imagesSvg: thisMarkdownImagesSvg,
            },
          }
        } else return null
      })
      .filter((e: any) => e)

    const panePayloadRaw = generateLivePreviewPayload(uuid, previewPayload)
    const panesPayload = [
      {
        id: uuid,
        title: panePayloadRaw.title,
        slug: panePayloadRaw.slug,
        optionsPayload: panePayloadRaw.optionsPayload,
        isContextPane: panePayloadRaw.isContextPane,
        heightRatio:
          viewportKey === `mobile`
            ? panePayloadRaw.heightRatioMobile
            : viewportKey === `tablet`
              ? panePayloadRaw.heightRatioTablet
              : panePayloadRaw.heightRatioDesktop,
        heightOffset:
          viewportKey === `mobile`
            ? panePayloadRaw.heightOffsetMobile
            : viewportKey === `tablet`
              ? panePayloadRaw.heightOffsetTablet
              : panePayloadRaw.heightOffsetDesktop,
        relationships: {
          ...thisPaneOri.relationships, // re-use existing relationships for now
          markdown: newMarkdown,
        },
      },
    ]

    const compositorPayload = {
      panesPayload,
      tailwindBgColour: ``,
      viewportKey,
      hooks: {
        belief: () => {},
        processRead: () => {},
        GatsbyImage: () => {},
        getImage: () => {},
        resourcePayload: () => {},
        EditInPlace,
      },
      id: {
        id: `builder`,
        title: `builder`,
        slug: `builder`,
        tractStackId: `builder`,
        tractStackTitle: `builder`,
        tractStackSlug: `builder`,
        isBuilderPreview: true,
      },
    }
    console.log(`in`, compositorPayload)
    return Compositor(compositorPayload)
  }, [
    unsavedMarkdownImages,
    unsavedMarkdownImageSvgs,
    previewPayload,
    allMarkdown,
    allFiles,
    uuid,
    viewportKey,
    paneFragmentsPayload,
    thisPaneOri.relationships,
    codeItemsLookup,
    imagesLookup,
    interceptMode,
    interceptModeTag,
    listItemsLookup,
    handleEditMarkdown,
    handleMutateMarkdown,
    handleChangeEditInPlace,
    stateLivePreviewMarkdown.markdownTags,
    stateLivePreviewMarkdown.links,
    stateLivePreviewMarkdown.linksLookup,
    setInterceptMode,
    locked,
  ])

  useEffect(() => {
    function handleResize() {
      const thisWidth = elementRef?.current?.offsetWidth || 0
      const viewportWidth =
        viewportKey === `desktop` ? 1922 : viewportKey === `tablet` ? 1082 : 602
      const thisScale = (thisWidth - 2) / viewportWidth
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
    if (focus > -1) {
      const thisId = `${stateLivePreviewMarkdown.markdownTags[focus]}-${focus}`
      const el = document?.getElementById(thisId)
      el?.classList.remove(`border-yellow-300`)
      el?.classList.add(`border`)
      el?.classList.add(`border-transparent`)
    }
    const thisId =
      nth > -1 ? `${stateLivePreviewMarkdown.markdownTags[nth]}-${nth}` : null
    const el =
      typeof thisId === `string` ? document?.getElementById(thisId) : null
    el?.classList.remove(`border-transparent`)
    el?.classList.add(`border`)
    el?.classList.add(`border-yellow-300`)
    setFocus(nth)
  }, [nth, focus, stateLivePreviewMarkdown.markdownTags])

  useEffect(() => {
    if (
      childFocus > -1 &&
      childFocusNth > -1 &&
      !(childFocus === childNth && childFocusNth === nth)
    ) {
      const thisId = `li-${childFocusNth}-${childFocus}`
      const el = document?.getElementById(thisId)
      el?.classList.remove(`border-yellow-300/50`)
      el?.classList.add(`border`)
      el?.classList.add(`border-transparent`)
    }
    if (childNth > -1) {
      const thisId = `li-${nth}-${childNth}`
      const el = document?.getElementById(thisId)
      el?.classList.remove(`border-transparent`)
      el?.classList.add(`border`)
      el?.classList.add(`border-yellow-300/50`)
      setChildFocus(childNth)
      setChildFocusNth(nth)
    }
  }, [nth, childNth, childFocus, childFocusNth])

  return (
    <div className="px-6 mx-auto w-full grow flex flex-row">
      <div className="flex-0 shrink">
        <StyledWrapperDiv
          key={`${viewportKey}-${uuid}-wrapper-outer`}
          className={classNames(
            `bg-mylightgrey/20 sticky top-22`,
            viewportClasses,
          )}
          ref={elementRef as React.RefObject<HTMLDivElement>}
          css={overrideWidthCss}
        >
          <StyledWrapperSection
            key={`${viewportKey}-${uuid}-wrapper`}
            className={classNames(
              viewportClasses,
              `shadow-sm builder border border-myblue/10 border-dashed`,
            )}
            css={`
              ${renderedPayload?.storyFragment?.css}
            `}
          >
            <div
              id={`${viewportKey}-${uuid}`}
              key={`${viewportKey}-${uuid}`}
              className={classNames(
                `w-full h-full grid grid-rows-1 grid-cols-1 relative`,
                hasMaxHScreen ? `max-h-screen` : ``,
              )}
            >
              {renderedPayload.contentChildren[thisId]}
            </div>
          </StyledWrapperSection>
        </StyledWrapperDiv>
      </div>

      {!emptyPane && !codeHook && interceptMode === `edit` ? (
        <div className="pl-4 flex-1 flex-shrink">
          <div className="w-80 xl:w-96 mb-6 sticky top-20">
            <>
              <CurrentlyDesigning
                viewportKey={viewportKey}
                setViewportKey={setViewportKey}
                setWidth={setWidth}
                innerWidth={innerWidth}
                visible={
                  !locked && (nth > -1 || previewPayload.state.hasBreaks)
                }
              />
              <PaneEditInPlace
                tag={tag}
                tagType={tagType}
                nth={nth}
                childNth={childNth}
                childGlobalNth={childGlobalNth}
                stateLivePreview={stateLivePreview}
                stateLivePreviewMarkdown={stateLivePreviewMarkdown}
                handleChangeEditInPlace={handleChangeEditInPlace}
                viewportKey={viewportKey}
                reset={EditInPlaceReset}
                pageStylesPagination={pageStylesPagination}
                setPageStylesPagination={setPageStylesPagination}
                hasBgColour={thisPane.hasBgColour}
                hasBgColourId={thisPane.hasBgColourId}
                hasBreaks={thisPane.hasBreaks}
                setLocked={setLocked}
                handleUnsavedImage={handleUnsavedImage}
                setShowImageLibrary={setShowImageLibrary}
                showImageLibrary={showImageLibrary}
              />
            </>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PaneRender
