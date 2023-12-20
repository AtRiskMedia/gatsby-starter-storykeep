import { reduceTailwindClasses } from './reduceTailwindClasses'

export const injectBuilderClasses = (payload: any) => {
  if (!payload) return null
  return Object.keys(payload).map((f: any) => {
    const e = payload[f]
    const parsedPayload =
      typeof e?.optionsPayloadString === `string`
        ? JSON.parse(e.optionsPayloadString)
        : typeof e?.optionsPayload === `object`
          ? e.optionsPayload
          : typeof e?.optionsPayload === `string`
            ? JSON.parse(e.optionsPayload)
            : null
    const overridePayload = parsedPayload
      ? parsedPayload?.classNamesPayload
      : null
    const reduced = overridePayload
      ? reduceTailwindClasses(overridePayload)
      : null
    const builderOverridePayload = reduced
      ? {
          ...parsedPayload,
          classNames: { ...reduced.builder.classNames },
          classNamesModal: { ...reduced.builder.classNamesModal },
          classNamesParent: { ...reduced.builder.classNamesParent },
        }
      : null
    const newPayload = reduced
      ? builderOverridePayload
      : typeof e?.optionsPayloadString === `string`
        ? JSON.parse(e.optionsPayloadString)
        : typeof e?.optionsPayload === `string`
          ? JSON.parse(e.optionsPayload)
          : typeof e?.optionsPayload === `object`
            ? e.optionsPayload
            : {}
    if (typeof e?.internal?.type === `undefined`) return null
    switch (e.internal.type) {
      case `bgPane`:
        return {
          id: e.id,
          hiddenViewports: e.hiddenViewports,
          shapeDesktop: e.shapeDesktop,
          shapeMobile: e.shapeMobile,
          shapeTablet: e.shapeTablet,
          optionsPayload: newPayload,
          zindex: e.zindex,
          internal: { type: e.internal.type },
        }
      case `markdown`:
        return {
          id: e.id,
          hiddenViewports: e.hiddenViewports,
          markdownId: e.markdownId,
          markdownBody: e.markdownBody,
          imageMaskShapeDesktop: e.imageMaskShapeDesktop,
          imageMaskShapeMobile: e.imageMaskShapeMobile,
          imageMaskShapeTablet: e.imageMaskShapeTablet,
          textShapeOutsideDesktop: e.textShapeOutsideDesktop,
          textShapeOutsideMobile: e.textShapeOutsideMobile,
          textShapeOutsideTablet: e.textShapeOutsideTablet,
          optionsPayload: newPayload,
          isModal: e.isModal,
          isContextPane: e.isContextPane || false,
          zindex: e.zindex,
          internal: { type: e.internal.type },
        }
      case `bgColour`:
        return {
          id: e.id,
          bgColour: e.bgColour,
          hiddenViewports: e.hiddenViewports,
          internal: { type: e.internal.type },
        }

      default:
        console.log(
          `missing handler for paneFragment type on EditFormPane-generateLivePreview`,
          e.internal.type,
          e,
        )
        return null
    }
  })
}
