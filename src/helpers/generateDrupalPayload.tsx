export function resourcePayload(
  state: any, // FIX
  uuid: string,
) {
  return {
    type: `node--resource`,
    id: uuid,
    attributes: {
      title: state.title,
      field_slug: state.slug,
      drupalNid: state.drupalNid,
      field_action_lisp: state.actionLisp || ``,
      field_category_slug: state.categorySlug || null,
      field_oneliner: state.oneliner || ``,
      field_options: state.optionsPayload || `{}`,
    },
  }
}

export function tractStackPayload(
  state: any, // FIX
  uuid: string,
) {
  const relationships = (contextPanes: string[], storyFragments: string[]) => {
    const val: any = {}
    if (storyFragments.length)
      val.field_story_fragments = {
        data: storyFragments.map((p: string) => {
          return {
            type: `node--story_fragment`,
            id: p,
          }
        }),
      }
    if (contextPanes.length)
      val.field_context_panes = {
        data: contextPanes.map((p: string) => {
          return {
            type: `node--pane`,
            id: p,
          }
        }),
      }
    return { relationships: val }
  }
  return {
    type: `node--tractstack`,
    id: uuid,
    attributes: {
      title: state.title,
      field_slug: state.slug,
      field_social_image_path: state?.socialImagePath || ``,
    },
    ...relationships(state.contextPanes, state.storyFragments),
  }
}

export function storyFragmentPayload(
  state: any, // FIX
  uuid: string,
) {
  const relationships = (
    panes: string[],
    contextPanes: string[],
    tractStackId: string,
  ) => {
    const val: any = {
      field_tract_stack: {
        data: {
          type: `node--tractstack`,
          id: tractStackId,
        },
      },
    }
    if (panes.length)
      val.field_panes = {
        data: panes.map((p: string) => {
          return {
            type: `node--pane`,
            id: p,
          }
        }),
      }
    if (contextPanes.length)
      val.field_context_panes = {
        data: contextPanes.map((p: string) => {
          return {
            type: `node--pane`,
            id: p,
          }
        }),
      }
    return { relationships: val }
  }
  return {
    type: `node--story_fragment`,
    id: uuid,
    attributes: {
      title: state.title,
      field_slug: state.slug,
      field_social_image_path: state.socialImagePath,
      field_tailwind_background_colour: state?.tailwindBgColour || ``,
    },
    ...relationships(state.panes, state.contextPanes, state.tractstack),
  }
}

export function panePayload(
  state: any, // FIX
  uuid: string,
  paneFragments: any, // FIX
  impressions: any, // FIX
  heldBeliefs: any, // FIX
  withheldBeliefs: any, // FIX
) {
  let paneOptionsHeldBeliefs = {}
  Object.keys(heldBeliefs).forEach((e: string) => {
    if (Object.keys(heldBeliefs[e]).length === 0) return null
    if (typeof heldBeliefs[e] === `string`)
      paneOptionsHeldBeliefs = {
        ...paneOptionsHeldBeliefs,
        [e]: heldBeliefs[e].split(`,`),
      }
    else
      paneOptionsHeldBeliefs = {
        ...paneOptionsHeldBeliefs,
        [e]: heldBeliefs[e],
      }
  })
  let paneOptionsWithheldBeliefs = {}
  Object.keys(withheldBeliefs).forEach((e: string) => {
    if (Object.keys(withheldBeliefs[e]).length === 0) return null
    if (typeof withheldBeliefs[e] === `string`)
      paneOptionsWithheldBeliefs = {
        ...paneOptionsWithheldBeliefs,
        [e]: withheldBeliefs[e].split(`,`),
      }
    else
      paneOptionsWithheldBeliefs = {
        ...paneOptionsWithheldBeliefs,
        [e]: withheldBeliefs[e],
      }
  })
  const thisOptionsRaw: any = {} // FIX
  if (paneFragments && Object.keys(paneFragments).length > 0)
    thisOptionsRaw.paneFragmentsPayload = paneFragmentsPayload(paneFragments)
  if (Object.keys(paneOptionsHeldBeliefs).length !== 0)
    thisOptionsRaw.heldBeliefs = paneOptionsHeldBeliefs
  if (Object.keys(paneOptionsWithheldBeliefs).length !== 0)
    thisOptionsRaw.withheldBeliefs = paneOptionsWithheldBeliefs
  if (impressions?.title && impressions?.id)
    thisOptionsRaw.impressions = { [impressions.id]: impressions }
  if (state?.hiddenPane) thisOptionsRaw.hiddenPane = true
  if (state?.overflowHidden) thisOptionsRaw.overflowHidden = true
  if (state?.maxHeightScreen) thisOptionsRaw[`max-h-screen`] = true
  let markdownId = null
  Object.keys(paneFragments).forEach((e: any) => {
    if (paneFragments[e].internal?.type === `markdown`)
      markdownId = paneFragments[e].markdownId
  })
  const relationships = markdownId
    ? {
        relationships: {
          field_markdown: {
            data: {
              type: `node--markdown`,
              id: markdownId,
            },
          },
        },
      }
    : {}
  return {
    id: uuid,
    type: `node--pane`,
    attributes: {
      title: state.title,
      field_slug: state.slug,
      field_height_offset_desktop: state.heightOffsetDesktop,
      field_height_offset_tablet: state.heightOffsetTablet,
      field_height_offset_mobile: state.heightOffsetMobile,
      field_height_ratio_desktop: state.heightRatioDesktop,
      field_height_ratio_tablet: state.heightRatioTablet,
      field_height_ratio_mobile: state.heightRatioMobile,
      field_is_context_pane: state.isContextPane,
      field_options: JSON.stringify(thisOptionsRaw),
    },
    ...relationships,
    // relationships: g.relationships, *** THIS NEEDS WORK: field_image, field_image_svg
    // FOR NOW, only markdown is touched
  }
}

export function markdownPayload(
  statePaneFragments: any,
  allMarkdown: any, // FIX
  unsavedMarkdownImages: any, // FIX
  unsavedMarkdownImageSvgs: any, // FIX
) {
  const relationships = (images: string[], imageSvgs: string[]) => {
    const val: any = {}
    if (images.length)
      val.field_image = {
        data: images.map((p: string) => {
          return {
            type: `file--file`,
            id: p,
          }
        }),
      }
    if (imageSvgs.length)
      val.field_image_svg = {
        data: imageSvgs.map((p: string) => {
          return {
            type: `file--file`,
            id: p,
          }
        }),
      }
    return { relationships: val }
  }

  return Object.keys(statePaneFragments)
    .map((f: any) => {
      const e = statePaneFragments[f]
      if (e?.type === `markdown` || e?.internal?.type === `markdown`) {
        const g = allMarkdown[e.markdownId]
        const addUnsavedImages =
          unsavedMarkdownImages &&
          Object.keys(unsavedMarkdownImages)
            .map((e) => {
              return e
            })
            .concat(g.images)
            .filter((e) => e)
        const addUnsavedImageSvgs =
          unsavedMarkdownImageSvgs &&
          Object.keys(unsavedMarkdownImageSvgs)
            .map((e) => {
              return e
            })
            .concat(g.imageSvgs)
            .filter((e) => e)
        return {
          id: e.markdownId,
          type: `node--markdown`,
          attributes: {
            title: typeof g.title === `string` ? g.title : ``,
            field_slug: typeof g.slug === `string` ? g.slug : ``,
            field_category_slug:
              typeof g.categorySlug === `string` ? g.categorySlug : ``,
            field_markdown_body:
              typeof e.markdownBody === `string` ? e.markdownBody : ``,
          },
          ...relationships(addUnsavedImages, addUnsavedImageSvgs),
        }
      }
      return null
    })
    .filter((e) => e)
}

export function paneFragmentsPayload(paneFragments: any) {
  return Object.keys(paneFragments)
    .map((f: any) => {
      const e = paneFragments[f]
      if (e.internal.type === `bgColour`) {
        return {
          id: e.id,
          bgColour: e.bgColour,
          hiddenViewports: e.hiddenViewports,
          internal: {
            type: `bgColour`,
          },
        }
      }
      if (e.internal.type === `markdown`) {
        return {
          id: e.id,
          markdownId: e.markdownId,
          zindex: e.zindex,
          imageMaskShapeDesktop: e.imageMaskShapeDesktop,
          imageMaskShapeTablet: e.imageMaskShapeTablet,
          imageMaskShapeMobile: e.imageMaskShapeMobile,
          textShapeOutsideDesktop: e.textShapeOutsideDesktop,
          textShapeOutsideTablet: e.textShapeOutsideTablet,
          textShapeOutsideMobile: e.textShapeOutsideMobile,
          hiddenViewports: e.hiddenViewports,
          optionsPayload: JSON.parse(e.optionsPayloadString),
          isModal: e.isModal || false,
          isContextPane: e.isContextPane || false,
          internal: {
            type: `markdown`,
          },
        }
      }
      if (e.internal.type === `bgPane`) {
        return {
          id: e.id,
          hiddenViewports: e.hiddenViewports,
          optionsPayload: JSON.parse(e.optionsPayloadString),
          shapeDesktop: e.shapeDesktop,
          shapeTablet: e.shapeTablet,
          shapeMobile: e.shapeMobile,
          internal: {
            type: `bgPane`,
          },
        }
      }
      console.log(
        `miss on generateDrupalPayload:paneFragments`,
        e.internal.type,
      )
      return null
    })
    .filter((e) => e)
}
