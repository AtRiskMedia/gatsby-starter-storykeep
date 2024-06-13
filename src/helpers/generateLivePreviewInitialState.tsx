import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { Svg } from '@tractstack/helpers'

import { generateClassNamesPayload } from './generateClassNamesPayload'

export function generateLivePreviewInitialState({
  payload,
  allMarkdown,
  allFiles,
  unsavedMarkdownImages,
  unsavedMarkdownImageSvgs,
}: any) {
  const initialStateLivePreviewMarkdown: any = {}
  let initialStateLivePreview: any = {}
  const initialStatePaneFragments: any = {}
  payload &&
    Object.keys(payload).forEach((e: any) => {
      const markdownId =
        typeof payload[e] !== `undefined` && payload[e].markdownId
      const thisMarkdown =
        typeof markdownId === `string` ? allMarkdown[markdownId] : null
      const hasFiles =
        thisMarkdown && thisMarkdown?.relationships
          ? [
              ...thisMarkdown?.relationships?.images,
              ...thisMarkdown?.relationships?.imagesSvg,
            ]
          : null
      const imagesData = hasFiles
        ?.map((f) => {
          return allFiles[f]
        })
        .concat(
          unsavedMarkdownImages &&
            Object.keys(unsavedMarkdownImages).map(
              (e: string) => unsavedMarkdownImages[e],
            ),
        )
        .concat(
          unsavedMarkdownImageSvgs &&
            Object.keys(unsavedMarkdownImageSvgs).map(
              (e: string) => unsavedMarkdownImageSvgs[e],
            ),
        )
        .filter((e) => e)
      if (payload[e] && Object.keys(payload[e]).length !== 0) {
        initialStatePaneFragments[payload[e].id] = payload[e]
        if (typeof payload[e].optionsPayload !== `undefined`) {
          initialStatePaneFragments[payload[e].id].optionsPayloadString =
            JSON.stringify(payload[e].optionsPayload, null, 2)
          const buttonData = payload[e].optionsPayload?.buttons

          if (
            payload[e].internal?.type === `markdown` &&
            typeof allMarkdown[payload[e].markdownId] !== `undefined` &&
            typeof allMarkdown[payload[e].markdownId].markdownBody === `string`
          ) {
            initialStatePaneFragments[payload[e].id].markdownBody =
              allMarkdown[payload[e].markdownId].markdownBody
            const thisMarkdownBody =
              initialStatePaneFragments[payload[e].id].markdownBody
            const mdAst = fromMarkdown(thisMarkdownBody)
            const markdownArray = mdAst.children
              .map((f) => {
                return toMarkdown(f)
              })
              .filter((n) => n)
            const markdownTags = mdAst.children
              .map((f) => {
                if (f.type === `paragraph`) return `p`
                else if (f.type === `heading`) return `h${f.depth}`
                else if (f.type === `list` && f.ordered) return `ol`
                else if (f.type === `list` && !f.ordered) return `ul`
                else console.log(`miss on`, f)
                return null
              })
              .filter((n) => n)
            let listItems: any = {}
            let images: any = {}
            let codeItems: any = {}
            let links: any = {}
            const imagesLookup: any = {}
            const codeItemsLookup: any = {}
            const listItemsLookup: any = {}
            const linksLookup: any = {}
            let listItemsIndex = 0
            let imagesIndex = 0
            let codeItemsIndex = 0
            let linksIndex = 0

            mdAst.children.forEach((f: any, idx: number) => {
              if (f.type === `list` || f.type === `paragraph`) {
                let localCount = 0
                f.children.forEach((g: any) => {
                  g?.children?.forEach((j: any) => {
                    j?.children?.forEach((i: any) => {
                      if (i.type === `link`) {
                        if (typeof linksLookup[idx] === `undefined`)
                          linksLookup[idx] = { [localCount]: linksIndex }
                        else
                          linksLookup[idx] = {
                            ...linksLookup[idx],
                            [localCount]: linksIndex,
                          }
                        const value =
                          typeof i.children[0] !== `undefined`
                            ? i.children[0].value
                            : null
                        const thisButtonData =
                          buttonData &&
                          Object.keys(buttonData)
                            .map((e: any) => {
                              if (e === i.url) return buttonData[e]
                              return null
                            })
                            .filter((n) => n)
                        links = {
                          ...links,
                          [linksIndex++]: {
                            parentNth: idx,
                            target: i.url,
                            value,
                            callbackPayload:
                              thisButtonData &&
                              typeof thisButtonData[0] !== `undefined`
                                ? thisButtonData[0].callbackPayload
                                : ``,
                            classNamesPayload:
                              thisButtonData &&
                              typeof thisButtonData[0] !== `undefined`
                                ? thisButtonData[0].classNamesPayload
                                : ``,
                          },
                        }
                        localCount++
                      }
                    })
                  })

                  if (g.type === `link`) {
                    if (typeof linksLookup[idx] === `undefined`)
                      linksLookup[idx] = { [localCount]: linksIndex }
                    else
                      linksLookup[idx] = {
                        ...linksLookup[idx],
                        [localCount]: linksIndex,
                      }
                    const value =
                      typeof g.children[0] !== `undefined`
                        ? g.children[0].value
                        : null
                    const thisButtonData =
                      buttonData &&
                      Object.keys(buttonData)
                        .map((e: any) => {
                          if (e === g.url) return buttonData[e]
                          return null
                        })
                        .filter((n) => n)
                    links = {
                      ...links,
                      [linksIndex++]: {
                        parentNth: idx,
                        target: g.url,
                        value,
                        callbackPayload:
                          thisButtonData &&
                          typeof thisButtonData[0] !== `undefined`
                            ? thisButtonData[0].callbackPayload
                            : ``,
                        classNamesPayload:
                          thisButtonData &&
                          typeof thisButtonData[0] !== `undefined`
                            ? thisButtonData[0].classNamesPayload
                            : ``,
                      },
                    }
                    localCount++
                  }
                })
              }
              if (f.type === `list` || f.type === `paragraph`) {
                f.children.forEach((g: any, idx2: number) => {
                  if (f.type === `list`) {
                    g?.children.forEach((h: any) => {
                      h?.children.forEach((j: any) => {
                        if (j.type === `inlineCode`) {
                          if (typeof codeItemsLookup[idx] === `undefined`)
                            codeItemsLookup[idx] = { [idx2]: codeItemsIndex }
                          else
                            codeItemsLookup[idx] = {
                              ...codeItemsLookup[idx],
                              [idx2]: codeItemsIndex,
                            }
                          const regexpHook =
                            /(identifyAs|youtube|bunny|bunnyContext|toggle|resource|belief)\((.*?)\)/
                          const regexpValues = /((?:[^\\|]+|\\\|?)+)/g
                          const thisHookRaw = j.value.match(regexpHook)
                          const hook =
                            thisHookRaw && typeof thisHookRaw[1] === `string`
                              ? thisHookRaw[1]
                              : null
                          const thisHookPayload =
                            thisHookRaw && typeof thisHookRaw[2] === `string`
                              ? thisHookRaw[2]
                              : null
                          const thisHookValuesRaw =
                            thisHookPayload &&
                            thisHookPayload.match(regexpValues)
                          codeItems = {
                            ...codeItems,
                            [codeItemsIndex++]: {
                              parentNth: idx,
                              childNth: idx2,
                              hook,
                              values: thisHookValuesRaw,
                            },
                          }
                        }
                        if (j.type === `image`) {
                          if (typeof imagesLookup[idx] === `undefined`)
                            imagesLookup[idx] = { [idx2]: imagesIndex }
                          else
                            imagesLookup[idx] = {
                              ...imagesLookup[idx],
                              [idx2]: imagesIndex,
                            }

                          const thisImage = imagesData?.filter(
                            (e: any) => e.title === j.url,
                          )
                          const publicURL =
                            typeof thisImage !== `undefined` &&
                            typeof thisImage[0] !== `undefined`
                              ? thisImage[0].localFile?.publicURL
                              : null
                          const fileId =
                            hasFiles
                              .map((z) => {
                                return allFiles[z].filename === j?.url
                                  ? z
                                  : null
                              })
                              .filter((z) => z)
                              .at(0) || null

                          images = {
                            ...images,
                            [imagesIndex++]: {
                              parentNth: idx,
                              childNth: idx2,
                              url: j?.url,
                              alt: j?.alt,
                              publicURL,
                              id: fileId,
                            },
                          }
                        }
                      })
                    })
                    if (typeof listItemsLookup[idx] === `undefined`)
                      listItemsLookup[idx] = { [idx2]: listItemsIndex }
                    else
                      listItemsLookup[idx] = {
                        ...listItemsLookup[idx],
                        [idx2]: listItemsIndex,
                      }
                    listItems = {
                      ...listItems,
                      [listItemsIndex++]: {
                        parentNth: idx,
                        childNth: idx2,
                        ordered: f.ordered,
                      },
                    }
                  }
                })
              }
              const hiddenMobile = payload[e].hiddenViewports.includes(`mobile`)
              const hiddenTablet = payload[e].hiddenViewports.includes(`tablet`)
              const hiddenDesktop =
                payload[e].hiddenViewports.includes(`desktop`)
              const shapeDesktop =
                !hiddenDesktop &&
                payload[e]?.textShapeOutsideDesktop &&
                payload[e]?.textShapeOutsideDesktop !== `none`
                  ? Svg(
                      payload[e].textShapeOutsideDesktop,
                      `desktop`,
                      `${payload[e].textShapeOutsideDesktop}-desktop-${idx}`,
                    )
                  : null
              const shapeTablet =
                !hiddenTablet &&
                payload[e]?.textShapeOutsideTablet &&
                payload[e]?.textShapeOutsideTablet !== `none`
                  ? Svg(
                      payload[e].textShapeOutsideTablet,
                      `tablet`,
                      `${payload[e].textShapeOutsideTablet}-tablet-${idx}`,
                    )
                  : null
              const shapeMobile =
                !hiddenMobile &&
                payload[e]?.textShapeOutsideMobile &&
                payload[e]?.textShapeOutsideMobile !== `none`
                  ? Svg(
                      payload[e].textShapeOutsideMobile,
                      `mobile`,
                      `${payload[e].textShapeOutsideMobile}-mobile-${idx}`,
                    )
                  : null
              if (
                !payload[e].isModal &&
                (shapeDesktop || shapeTablet || shapeMobile)
              ) {
                initialStateLivePreviewMarkdown.hasTextShapeOutside = true
                initialStateLivePreviewMarkdown.textShapeOutside = {
                  paneFragmentId: payload[e].id,
                  type: `textShapeOutside`,
                  mobile: {
                    name: payload[e].textShapeOutsideMobile,
                    svg: shapeMobile,
                  },
                  tablet: {
                    name: payload[e].textShapeOutsideTablet,
                    svg: shapeTablet,
                  },
                  desktop: {
                    name: payload[e].textShapeOutsideDesktop,
                    svg: shapeDesktop,
                  },
                }
              }
            })

            initialStateLivePreviewMarkdown.paneFragmentId = payload[e].id
            initialStateLivePreviewMarkdown.markdownId = payload[e].markdownId
            initialStateLivePreviewMarkdown.markdownAst = mdAst
            initialStateLivePreviewMarkdown.markdownArray = markdownArray
            initialStateLivePreviewMarkdown.markdownTags = markdownTags
            initialStateLivePreviewMarkdown.images = images
            initialStateLivePreviewMarkdown.codeItems = codeItems
            initialStateLivePreviewMarkdown.listItems = listItems
            initialStateLivePreviewMarkdown.links = links
            initialStateLivePreviewMarkdown.imagesLookup = imagesLookup
            initialStateLivePreviewMarkdown.codeItemsLookup = codeItemsLookup
            initialStateLivePreviewMarkdown.listItemsLookup = listItemsLookup
            initialStateLivePreviewMarkdown.linksLookup = linksLookup
          }
        }
      }
    })
  const modalRaw = payload
    ? Object.keys(payload)
        .map((e) => {
          const thisPaneFragment =
            e &&
            typeof payload !== `undefined` &&
            typeof payload[e] !== `undefined`
              ? payload[e]
              : null
          if (
            thisPaneFragment &&
            thisPaneFragment.internal?.type === `markdown` &&
            thisPaneFragment.isModal &&
            (thisPaneFragment.textShapeOutsideMobile ||
              thisPaneFragment.textShapeOutsideTablet ||
              thisPaneFragment.textShapeOutsideDesktop)
          )
            return thisPaneFragment
          return null
        })
        .filter((n) => n)
    : null
  const hasModal = modalRaw ? Object.keys(modalRaw).length : null
  const modal =
    hasModal && modalRaw
      ? modalRaw.map((modal, idx) => {
          const hiddenMobile = modal.hiddenViewports.includes(`mobile`)
          const hiddenTablet = modal.hiddenViewports.includes(`tablet`)
          const hiddenDesktop = modal.hiddenViewports.includes(`desktop`)
          const shapeDesktop =
            !hiddenDesktop &&
            modal?.textShapeOutsideDesktop &&
            modal?.textShapeOutsideDesktop !== `none`
              ? Svg(
                  modal.textShapeOutsideDesktop,
                  `desktop`,
                  `${modal.textShapeOutsideDesktop}-desktop-${idx}`,
                )
              : null
          const shapeTablet =
            !hiddenTablet &&
            modal?.textShapeOutsideTablet &&
            modal?.textShapeOutsideTablet !== `none`
              ? Svg(
                  modal.textShapeOutsideTablet,
                  `tablet`,
                  `${modal.textShapeOutsideTablet}-tablet-${idx}`,
                )
              : null
          const shapeMobile =
            !hiddenMobile &&
            modal?.textShapeOutsideMobile &&
            modal?.textShapeOutsideMobile !== `none`
              ? Svg(
                  modal.textShapeOutsideMobile,
                  `mobile`,
                  `${modal.textShapeOutsideMobile}-mobile-${idx}`,
                )
              : null
          return {
            paneFragmentId: modal.id,
            type: `modalShape`,
            mobile: {
              name: modal.textShapeOutsideMobile,
              svg: shapeMobile,
              paddingLeft: modal.optionsPayload?.modal?.mobile?.paddingLeft,
              paddingTop: modal.optionsPayload?.modal?.mobile?.paddingTop,
              zoomFactor: modal.optionsPayload?.modal?.mobile?.zoomFactor,
            },
            tablet: {
              name: modal.textShapeOutsideTablet,
              svg: shapeTablet,
              paddingLeft: modal.optionsPayload?.modal?.tablet?.paddingLeft,
              paddingTop: modal.optionsPayload?.modal?.tablet?.paddingTop,
              zoomFactor: modal.optionsPayload?.modal?.tablet?.zoomFactor,
            },
            desktop: {
              name: modal.textShapeOutsideDesktop,
              svg: shapeDesktop,
              paddingLeft: modal.optionsPayload?.modal?.desktop?.paddingLeft,
              paddingTop: modal.optionsPayload?.modal?.desktop?.paddingTop,
              zoomFactor: modal.optionsPayload?.modal?.desktop?.zoomFactor,
            },
          }
        })
      : {}

  const shapesRaw = payload
    ? Object.keys(payload)
        .map((e) => {
          const thisPaneFragment =
            e &&
            typeof payload !== `undefined` &&
            typeof payload[e] !== `undefined`
              ? payload[e]
              : null
          if (
            (thisPaneFragment &&
              thisPaneFragment?.internal?.type === `bgPane` &&
              thisPaneFragment?.shapeDesktop) ||
            thisPaneFragment?.shapeTablet ||
            thisPaneFragment?.shapeMobile ||
            thisPaneFragment?.optionsPayload?.artpack?.desktop?.mode ===
              `break` ||
            thisPaneFragment?.optionsPayload?.artpack?.tablet?.mode ===
              `break` ||
            thisPaneFragment?.optionsPayload?.artpack?.mobile?.mode === `break`
          )
            return thisPaneFragment
          return null
        })
        .filter((n) => n)
    : null
  const hasShapes = shapesRaw ? Object.keys(shapesRaw).length : null
  const shapes =
    hasShapes && shapesRaw
      ? shapesRaw.map((shape, idx) => {
          // shape here is paneFragment payload from bgPane, or artpackPayload
          const parentClasses =
            typeof shape.optionsPayload.classNamesPayload?.parent?.classes ===
            `object`
              ? shape.optionsPayload.classNamesPayload?.parent?.classes[0]
              : {}
          const artpackPayload =
            typeof shape.optionsPayload?.artpack === `object`
              ? shape.optionsPayload.artpack
              : null
          const hiddenMobile = shape.hiddenViewports.includes(`mobile`)
          const hiddenTablet = shape.hiddenViewports.includes(`tablet`)
          const hiddenDesktop = shape.hiddenViewports.includes(`desktop`)
          const shapeNameDesktop =
            artpackPayload &&
            typeof artpackPayload?.desktop?.mode === `string` &&
            artpackPayload.desktop.mode === `break`
              ? `${artpackPayload.desktop.collection}${artpackPayload.desktop.image}`
              : shape?.shapeDesktop && shape.shapeDesktop !== `none`
                ? shape.shapeDesktop
                : null
          const shapeNameTablet =
            artpackPayload &&
            typeof artpackPayload?.tablet?.mode === `string` &&
            artpackPayload.tablet.mode === `break`
              ? `${artpackPayload.tablet.collection}${artpackPayload.tablet.image}`
              : shape?.shapeTablet && shape.shapeTablet !== `none`
                ? shape.shapeTablet
                : null
          const shapeNameMobile =
            artpackPayload &&
            typeof artpackPayload?.mobile?.mode === `string` &&
            artpackPayload.mobile.mode === `break`
              ? `${artpackPayload.desktop.collection}${artpackPayload.mobile.image}`
              : shape?.shapeMobile && shape.shapeMobile !== `none`
                ? shape.shapeMobile
                : null
          const shapeTypeDesktop =
            artpackPayload &&
            typeof artpackPayload?.desktop?.mode === `string` &&
            artpackPayload.desktop.mode === `break`
              ? `breaksShape`
              : shape?.shapeDesktop
                ? `paneShape`
                : null
          const shapeTypeTablet =
            artpackPayload &&
            typeof artpackPayload?.tablet?.mode === `string` &&
            artpackPayload.tablet.mode === `break`
              ? `breaksShape`
              : shape?.shapeTablet
                ? `paneShape`
                : null
          const shapeTypeMobile =
            artpackPayload &&
            typeof artpackPayload?.mobile?.mode === `string` &&
            artpackPayload.mobile.mode === `break`
              ? `breaksShape`
              : shape?.shapeMobile
                ? `paneShape`
                : null
          const shapeDesktop =
            !hiddenDesktop && shapeNameDesktop
              ? Svg(
                  shapeNameDesktop,
                  `desktop`,
                  `${shapeNameDesktop}-desktop-${idx}`,
                )
              : null
          const shapeTablet =
            !hiddenTablet && shapeNameTablet
              ? Svg(
                  shapeNameTablet,
                  `tablet`,
                  `${shape.shapeTablet}-tablet-${idx}`,
                )
              : null
          const shapeMobile =
            !hiddenMobile && shapeNameMobile
              ? Svg(
                  shapeNameMobile,
                  `mobile`,
                  `${shape.shapeMobile}-mobile-${idx}`,
                )
              : null

          return {
            paneFragmentId: shape.id,
            type: shapeTypeMobile || shapeTypeTablet || shapeTypeDesktop,
            parentClasses,
            artpackPayload,
            mobile: {
              name: shape.shapeMobile,
              svg: shapeMobile,
            },
            tablet: {
              name: shape.shapeTablet,
              svg: shapeTablet,
            },
            desktop: {
              name: shape.shapeDesktop,
              svg: shapeDesktop,
            },
          }
        })
      : {}
  initialStateLivePreview = { ...initialStateLivePreview, shapes, modal }

  if (payload)
    Object.keys(payload).forEach((e: any) => {
      // pre-process paneFragments classNamesPayload, etc. for state onChange
      if (
        Object.keys(payload[e]).length &&
        payload[e].internal.type === `markdown`
      ) {
        const thisPaneFragmentClassNamesPayload =
          typeof payload[e] !== `undefined`
            ? payload[e].optionsPayload?.classNamesPayload
            : null
        const thisClassNamesPayload = thisPaneFragmentClassNamesPayload
          ? generateClassNamesPayload(
              thisPaneFragmentClassNamesPayload,
              initialStateLivePreviewMarkdown,
            )
          : null
        if (thisClassNamesPayload !== null)
          initialStateLivePreview = {
            ...initialStateLivePreview,
            ...thisClassNamesPayload,
          }
      }
    })

  return {
    initialStateLivePreview,
    initialStateLivePreviewMarkdown,
    initialStatePaneFragments,
  }
}
