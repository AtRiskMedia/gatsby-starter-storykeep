import { fromMarkdown } from 'mdast-util-from-markdown'
import { toHast } from 'mdast-util-to-hast'

import { injectBuilderClasses } from '../helpers/injectBuilderClasses'

export function generateLivePreviewPayload(uuid: string, previewPayload: any) {
  const {
    state,
    statePaneFragments,
    stateImpressions,
    stateHeldBeliefs,
    stateWithheldBeliefs,
    allMarkdown,
  } = previewPayload
  const impressionsPayload = stateImpressions?.title
    ? {
        [stateImpressions.id]: stateImpressions,
      }
    : null
  const newMarkdownPayload = Object.keys(statePaneFragments)
    .map((f: any) => {
      const e = statePaneFragments[f]
      if (e?.type === `markdown`) {
        const g = allMarkdown[e.markdownId]
        return {
          id: e.markdownId,
          drupalNid: g.drupalNid,
          slug: g.slug,
          title: g.title,
          categorySlug: g.categorySlug,
          markdownBody: e.markdownBody,
          relationships: g.relationships, // NEED TO PULL FROM STATE, not zus
          childMarkdown: {
            childMarkdownRemark: {
              htmlAst: toHast(fromMarkdown(e.markdownBody)),
            },
          },
          internal: {
            type: g.internal.type,
          },
        }
      }
      return null
    })
    .filter((e) => e)
  const newPaneFragmentsPayload = injectBuilderClasses(statePaneFragments)
  const codeHookPayload =
    typeof state.codeHookTarget === `string`
      ? {
          codeHook: {
            target: state.codeHookTarget,
            url: state.codeHookTargetUrl,
            height: state.codeHookHeight,
            width: state.codeHookWidth,
          },
        }
      : {}
  const newPayload = {
    id: uuid,
    slug: state.slug,
    title: state.title,
    isContextPane: state.isContextPane,
    relationships: { markdown: newMarkdownPayload },
    optionsPayload: JSON.stringify({
      heldBeliefs: stateHeldBeliefs,
      withheldBeliefs: stateWithheldBeliefs,
      impressions: impressionsPayload,
      paneFragmentsPayload: newPaneFragmentsPayload,
      hiddenPane: state.hiddenPane,
      overflowHidden: state.overflowHidden,
      ...codeHookPayload,
    }),
    heightOffsetDesktop: state.heightOffsetDesktop,
    heightOffsetTablet: state.heightOffsetTablet,
    heightOffsetMobile: state.heightOffsetMobile,
    heightRatioDesktop: state.heightRatioDesktop,
    heightRatioTablet: state.heightRatioTablet,
    heightRatioMobile: state.heightRatioMobile,
  }
  return newPayload
}
