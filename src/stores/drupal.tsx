import { create } from 'zustand'
import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'

import { IDrupalState } from '../types'

export const useDrupalStore = create<IDrupalState>((set, get) => ({
  stage: 0,
  setStage: (stage: number) => set((state) => ({ ...state, stage })),
  apiStage: 0,
  setApiStage: (apiStage: number) => set((state) => ({ ...state, apiStage })),
  embeddedEdit: {
    child: null,
    childType: null,
    parent: null,
    parentType: null,
  },
  setEmbeddedEdit: (
    child: string,
    childType: string,
    parent: string,
    parentType: string,
  ) =>
    set((state) => ({
      ...state,
      embeddedEdit: { child, childType, parent, parentType },
    })),
  cleanerQueue: {},
  setCleanerQueue: (uuid: string, type: any) =>
    set((state) => ({
      cleanerQueue: {
        ...state.cleanerQueue,
        [uuid]: type,
      },
    })),
  removeCleanerQueue: (key: string) =>
    set((state) => {
      const newData = { ...state.cleanerQueue }
      delete newData[key as keyof typeof newData]
      return { ...state, cleanerQueue: newData }
    }),
  setStoryFragment: (uuid: string, payload: any) =>
    set((state) => ({
      allStoryFragments: {
        ...state.allStoryFragments,
        [uuid]: payload,
      },
    })),
  setPane: (uuid: string, payload: any) =>
    set((state) => ({
      allPanes: { ...state.allPanes, [uuid]: payload },
    })),
  viewportKey: `mobile`,
  setViewportKey: (viewportKey: string) =>
    set((state) => ({ ...state, viewportKey })),
  locked: ``,
  setLocked: (locked: string) => set((state) => ({ ...state, locked })),
  drupalQueue: {},
  drupalPreSaveQueue: {},
  drupalResponse: {},
  drupalLocked: ``,
  drupalSoftLock: false,
  selectedCollection: `storyfragment`,
  openDemoEnabled: false,
  oauthDrupalUuid: ``,
  oauthDrupalRoles: ``,
  allTractStacks: {},
  allStoryFragments: {},
  allPanes: {},
  allFiles: {},
  allMenus: {},
  allResources: {},
  allMarkdown: {},
  allCollections: {},
  setDrupalPreSaveQueue: (
    payload: any,
    type: string,
    uuid: string,
    drupalNid: number,
    wait?: boolean,
    markdownId?: string,
    oldMarkdownId?: string,
  ) =>
    set((state) => ({
      drupalPreSaveQueue: {
        ...state.drupalPreSaveQueue,
        [type]: {
          [uuid]: {
            payload,
            drupalNid,
            wait: typeof wait === `boolean` ? wait : false,
            markdownId: typeof markdownId === `string` ? markdownId : undefined,
            oldMarkdownId:
              typeof oldMarkdownId === `string` ? oldMarkdownId : undefined,
          },
        },
      },
    })),
  setDrupalSaveNode: (
    payload: any,
    type: string,
    uuid: string,
    drupalNid: number,
  ) => {
    const apiBase = process.env.DRUPAL_APIBASE
    const setDrupalQueue = get().setDrupalQueue
    if (drupalNid > -1) {
      const fullPayload = {
        endpoint: `${apiBase}/node/${type}/${uuid}`,
        method: `PATCH`,
        body: {
          data: payload,
        },
      }
      setDrupalQueue(uuid, fullPayload)
    } else {
      delete payload.id
      const fullPayload = {
        endpoint: `${apiBase}/node/${type}`,
        method: `POST`,
        body: {
          data: payload,
        },
      }
      setDrupalQueue(uuid, fullPayload)
    }

    switch (type) {
      case `pane`: {
        const thisPane = get().allPanes[uuid]
        const updatePanes = get().updatePanes
        const newPane = {
          ...thisPane,
          id: uuid,
          title: payload.attributes.title,
          slug: payload.attributes.field_slug,
          isContextPane: payload.attributes.field_is_context_pane,
          optionsPayload: payload.attributes.field_options,
          heightRatioDesktop: payload.attributes.field_height_ratio_desktop,
          heightRatioTablet: payload.attributes.field_height_ratio_tablet,
          heightRatioMobile: payload.attributes.field_height_ratio_mobile,
          heightOffsetDesktop: payload.attributes.field_height_offset_desktop,
          heightOffsetTablet: payload.attributes.field_height_offset_tablet,
          heightOffsetMobile: payload.attributes.field_height_offset_mobile,
        }
        updatePanes(newPane)
        break
      }

      case `markdown`: {
        const thisMarkdown = get().allMarkdown[uuid]
        const updateMarkdown = get().updateMarkdown
        const newMarkdown = {
          ...thisMarkdown,
          id: uuid,
          title: payload.attributes.title,
          markdownBody: payload.attributes.field_markdown_body,
          slug: payload.attributes.field_slug,
          categorySlug: payload.attributes.categorySlug,
          images: thisMarkdown?.relationships?.images || [],
          svgs: thisMarkdown?.relationships?.imagesSvg || [],
        }
        updateMarkdown(newMarkdown)
        break
      }

      case `storyfragment`: {
        const thisStoryFragment = get().allStoryFragments[uuid]
        const updateStoryFragments = get().updateStoryFragments
        const newStoryFragment = {
          ...thisStoryFragment,
          id: uuid,
          contextPanes:
            payload?.relationships?.field_context_panes?.data
              ?.map((f: any) => {
                return f.id
              })
              .filter((e: string) => e !== `missing`) || [],
          tractstack: payload?.relationships?.field_tract_stack?.data?.id,
          panes: payload?.relationships?.field_panes?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`),
          menu: payload?.relationships?.field_menu?.data?.id,
        }
        if (payload.attributes.title !== thisStoryFragment.title)
          newStoryFragment.title = payload.attributes.title
        if (payload.attributes.field_slug !== thisStoryFragment.slug)
          newStoryFragment.slug = payload.attributes.field_slug
        if (
          payload.attributes.field_tailwind_background_colour !==
          thisStoryFragment.tailwindBgColour
        )
          newStoryFragment.tailwindBgColour =
            payload.attributes.field_tailwind_background_colour
        if (payload.socialImagePath !== thisStoryFragment.socialImagePath)
          newStoryFragment.attributes.field_social_image_path =
            payload.attributes.field_social_image_path
        updateStoryFragments(newStoryFragment)
        break
      }

      case `tractstack`:
      case `resource`:
      case `file`:
      case `menu`:
        console.log(`todo`)
        break
    }
  },
  setDrupalLocked: (drupalLocked: string) =>
    set((state) => ({ ...state, drupalLocked })),
  setDrupalSoftLock: (drupalSoftLock: boolean) =>
    set((state) => ({ ...state, drupalSoftLock })),
  setDrupalResponse: (
    uuid: string,
    payload: any, // FIX
  ) =>
    set((state) => ({
      drupalResponse: { ...state.drupalResponse, [uuid]: payload },
    })),
  setDrupalQueue: (
    uuid: string,
    payload: any, // FIX
  ) =>
    set((state) => ({
      drupalQueue: { ...state.drupalQueue, [uuid]: payload },
    })),
  removeDrupalQueue: (key: string) =>
    set((state) => {
      const newData = { ...state.drupalQueue }
      delete newData[key]
      return { ...state, drupalQueue: newData }
    }),
  removeDrupalPreSaveQueue: (uuid: string, type: string) =>
    set((state) => {
      const newData = { ...state.drupalPreSaveQueue }
      delete newData[type][uuid]
      return { ...state, drupalPreSaveQueue: newData }
    }),
  removeDrupalResponse: (key: string) =>
    set((state) => {
      const newData = { ...state.drupalResponse }
      delete newData[key]
      return { ...state, drupalResponse: newData }
    }),
  setSelectedCollection: (selectedCollection: string) =>
    set((state) => ({ ...state, selectedCollection })),
  setOpenDemoEnabled: (openDemoEnabled: boolean) =>
    set((state) => ({ ...state, openDemoEnabled })),
  setOauthDrupalUuid: (oauthDrupalUuid: string) =>
    set((state) => ({ ...state, oauthDrupalUuid })),
  setOauthDrupalRoles: (oauthDrupalRoles: string) =>
    set((state) => ({ ...state, oauthDrupalRoles })),
  updateIngestSource: (payload: any) => {
    // FIX
    const regexp = /(file|node|paragraph)--([_a-z]+[_a-z0-9]*$)/
    const result = payload?.type?.match(regexp)
    const updateTractStacks = get().updateTractStacks
    const updateStoryFragments = get().updateStoryFragments
    const updatePanes = get().updatePanes
    const updateMenus = get().updateMenus
    const updateResources = get().updateResources
    const updateMarkdown = get().updateMarkdown
    const updateFiles = get().updateFiles
    if (result && result[1] && result[2]) {
      switch (result[1]) {
        case `node`:
        case `paragraph`:
        case `menu`:
        case `file`:
          if (payload && typeof payload === `object`) {
            if (result[1] === `node` && result[2] === `tractstack`)
              updateTractStacks(payload)
            if (result[1] === `node` && result[2] === `story_fragment`)
              updateStoryFragments(payload)
            if (result[1] === `node` && result[2] === `pane`)
              updatePanes(payload)
            if (result[1] === `node` && result[2] === `menu`)
              updateMenus(payload)
            if (result[1] === `node` && result[2] === `markdown`)
              updateMarkdown(payload)
            if (result[1] === `node` && result[2] === `resource`)
              updateResources(payload)
            if (result[1] === `file` && result[2] === `file`)
              updateFiles(payload)
          }
          break
        default:
          console.log(`ingest miss on`, result[1], result[2])
      }
    }
  },
  updateCollections: (payload: string[]) => {
    Object.keys(payload).forEach((e: string) => {
      set((state) => ({
        allCollections: { ...state.allCollections, [e]: true },
      }))
    })
  },
  updateStoryFragments: (payload: any) => {
    // FIX
    const thisStoryFragment = {
      drupalNid:
        payload?.attributes?.drupal_internal__nid || payload?.drupalNid,
      title: payload?.attributes?.title || payload?.title,
      socialImagePath:
        payload?.attributes?.field_social_image_path ||
        payload?.socialImagePath,
      slug: payload?.attributes?.field_slug || payload?.slug,
      contextPanes:
        payload?.relationships?.field_context_panes?.data
          ?.map((f: any) => {
            return f.id
          })
          .filter((e: string) => e !== `missing`) || payload.contextPanes,
      tailwindBgColour:
        payload?.attributes?.field_tailwind_background_colour ||
        payload?.tailwindBgColour,
      tractstack:
        payload?.relationships?.field_tract_stack?.data?.id ||
        payload?.tractstack,
      panes:
        payload?.relationships?.field_panes?.data
          ?.map((f: any) => {
            return f.id
          })
          .filter((e: string) => e !== `missing`) || payload?.panes,
      menu: payload?.relationships?.field_menu?.data?.id || payload?.menu,
    }
    set((state) => ({
      allStoryFragments: {
        ...state.allStoryFragments,
        [payload.id]: thisStoryFragment,
      },
    }))
  },
  updateTractStacks: (payload: any) => {
    // FIX
    const thisTractStack = {
      drupalNid:
        payload?.attributes?.drupal_internal__nid || payload?.drupalNid,
      title: payload?.attributes?.title || payload?.title,
      socialImagePath:
        payload?.attributes?.field_social_image_path ||
        payload?.socialImagePath,
      slug: payload?.attributes?.field_slug || payload?.slug,
      contextPanes:
        payload?.relationships?.field_context_panes?.data
          ?.map((f: any) => {
            return f.id
          })
          .filter((e: string) => e !== `missing`) || payload.contextPanes,
      storyFragments:
        payload?.relationships?.field_story_fragments?.data
          ?.map((f: any) => {
            return f.id
          })
          .filter((e: string) => e !== `missing`) || payload.storyFragments,
    }
    set((state) => ({
      allTractStacks: { ...state.allTractStacks, [payload.id]: thisTractStack },
    }))
  },
  updatePanes: (payload: any) => {
    // FIX
    const thisPane = {
      drupalNid:
        payload?.attributes?.drupal_internal__nid || payload?.drupalNid,
      title: payload?.attributes?.title || payload?.title,
      slug: payload?.attributes?.field_slug || payload?.slug,
      isContextPane:
        payload?.attributes?.field_is_context_pane ||
        payload?.isContextPane ||
        false,
      optionsPayload:
        payload?.attributes?.field_options ||
        payload?.optionsPayloadString ||
        payload?.optionsPayload ||
        `{}`,
      heightRatioDesktop:
        payload?.attributes?.field_height_ratio_desktop ||
        payload?.heightRatioDesktop ||
        0,
      heightRatioTablet:
        payload?.attributes?.field_height_ratio_tablet ||
        payload?.heightRatioMobile ||
        0,
      heightRatioMobile:
        payload?.attributes?.field_height_ratio_mobile ||
        payload?.heightRatioMobile ||
        0,
      heightOffsetDesktop:
        payload?.attributes?.field_height_offset_desktop ||
        payload?.heightOffsetDesktop ||
        `0`,
      heightOffsetTablet:
        payload?.attributes?.field_height_offset_tablet ||
        payload?.heightOffsetTablet ||
        `0`,
      heightOffsetMobile:
        payload?.attributes?.field_height_offset_mobile ||
        payload?.heightOffsetMobile ||
        `0`,
      relationships: {
        markdown:
          payload?.relationships?.field_markdown?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`) ||
          payload?.markdown ||
          payload?.relationships?.markdown ||
          [],
        images:
          payload?.relationships?.field_image?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`) ||
          payload?.images ||
          payload?.relationships?.images ||
          [],
        imagesSvg:
          payload?.relationships?.field_image_svg?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`) ||
          payload?.svgs ||
          payload?.relationships?.imagesSvgs ||
          [],
      },
    }
    set((state) => ({
      allPanes: { ...state.allPanes, [payload.id]: thisPane },
    }))
  },
  removePane: (uuid: string) => {
    const allPanes = get().allPanes
    const newPayload = { ...allPanes }
    delete newPayload[uuid]
    set((state) => ({ ...state, allPanes: newPayload }))
  },
  removeMarkdown: (uuid: string) => {
    const allMarkdown = get().allMarkdown
    const newPayload = { ...allMarkdown }
    delete newPayload[uuid]
    set((state) => ({ ...state, allMarkdown: newPayload }))
  },
  removeStoryFragment: (uuid: string) => {
    const allStoryFragments = get().allStoryFragments
    const newPayload = { ...allStoryFragments }
    delete newPayload[uuid]
    set((state) => ({ ...state, allStoryFragments: newPayload }))
  },
  updateMarkdown: (payload: any) => {
    // FIX
    const thisMarkdown = {
      drupalNid:
        payload?.attributes?.drupal_internal__nid || payload?.drupalNid,
      title: payload?.attributes?.title || payload?.title,
      type: `node__markdown`,
      markdownBody:
        payload?.attributes?.field_markdown_body || payload?.markdownBody,
      childMarkdown: {
        childMarkdownRemark: {
          htmlAst: toHast(
            fromMarkdown(
              payload?.attributes?.field_markdown_body || payload.markdownBody,
            ),
          ),
        },
      },
      slug: payload?.attributes?.field_slug || payload?.slug,
      categorySlug:
        payload?.attributes?.field_category_slug || payload?.categorySlug,
      relationships: {
        images:
          payload?.relationships?.field_image?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`) ||
          payload.images ||
          [],
        imagesSvg:
          payload?.relationships?.field_image_svg?.data
            ?.map((f: any) => {
              return f.id
            })
            .filter((e: string) => e !== `missing`) ||
          payload.svgs ||
          [],
      },
    }
    set((state) => ({
      allMarkdown: { ...state.allMarkdown, [payload.id]: thisMarkdown },
    }))
  },
  updateFiles: (payload: any) => {
    // FIX
    const thisFile = {
      title: payload.attributes.filename,
      filemime: payload.attributes.filemime,
      filename: payload.attributes.filename,
      localFile: {
        publicURL: payload.attributes.uri.url,
      },
    }
    set((state) => ({
      allFiles: { ...state.allFiles, [payload.id]: thisFile },
    }))
  },
  updateResources: (payload: any) => {
    // FIX
    const thisResource = {
      drupalNid:
        payload?.attributes?.drupal_internal__nid || payload?.drupalNid,
      title: payload?.attributes?.title || payload?.title,
      actionLisp: payload?.attributes?.field_action_lisp || payload?.actionLisp,
      categorySlug:
        payload?.attributes?.field_category_slug || payload?.categorySlug,
      oneliner: payload?.attributes?.field_oneliner || payload?.oneliner,
      optionsPayload:
        payload?.attributes?.field_options || payload?.optionsPayload,
      slug: payload?.attributes?.field_slug || payload?.slug,
    }
    set((state) => ({
      allResources: { ...state.allResources, [payload.id]: thisResource },
    }))
  },
  updateMenus: (payload: any) => {
    // FIX
    const thisMenu = {
      nid: payload.attributes.drupal_internal__nid,
      title: payload.attributes.title,
      theme: payload.attributes.field_theme,
      optionsPayload: payload.attributes.field_options,
      svgLogoFile: payload?.relationships?.field_svg_logo?.data?.id,
      imageLogoFile: payload?.relationships?.field_image?.data
        ?.map((f: any) => {
          return f.id
        })
        .filter((e: string) => e !== `missing`),
    }
    set((state) => ({
      allMenus: { ...state.allMenus, [payload.id]: thisMenu },
    }))
  },
}))
