import {
  tailwindSpecial,
  tailwindModifier,
  isShorty,
  truncateShorty,
} from './allowedTailwindValues'

const reduceClassNameArray = (selector: string, tuple: any) => {
  if (!tuple) return null
  return Object.keys(tuple)
    .map((e: string, idx: number) => {
      const value = typeof tuple[e] !== `undefined` ? tuple[e] : null
      if (value) return reduceClassName(selector, value, idx)
      return null
    })
    .join(` `)
}
const reduceClassName = (selector: string, v: any, idx: number) => {
  if (selector === `flex`)
    if (!selector && typeof selector !== `number`) {
      console.log(`FIX THIS: bad selector`, selector, v, idx)
      return null
    }
  const modifier = idx === -1 ? `` : tailwindModifier[idx]
  const truncated =
    isShorty.includes(selector) && typeof truncateShorty[selector] === `string`
  const thisSelector = truncated ? truncateShorty[selector] : selector
  if (v || (typeof v === `number` && v === 0)) {
    if (typeof v === `boolean`) return `${modifier}${thisSelector}`
    else if (typeof v === `boolean`) return `${modifier}${thisSelector}`
    else if (typeof v === `string` && v === `true`)
      return `${modifier}${thisSelector}`
    else if (typeof v === `string` && v[0] === `!`)
      return `${modifier}-${thisSelector}-${v.substring(1)}`
    else if (
      (typeof v === `string` || typeof v === `number`) &&
      selector === `animate`
    )
      return `motion-safe:${modifier}${thisSelector}-${v}`
    else if (truncated && typeof v === `string`)
      return `${modifier}${thisSelector}-${v}`
    else if (isShorty.includes(selector) && typeof v === `string`)
      return `${modifier}${v}`
    else if (typeof v === `string` || typeof v === `number`)
      return `${modifier}${thisSelector}-${v}`
    else console.log(`bad match on`, thisSelector, selector, isShorty, v, idx)
  }
  return ``
}

const processTuples = (thisTuples: any) => {
  return Object.keys(thisTuples)
    .map((f: any) => {
      let thisTailwindString = ``
      const thisTuple = thisTuples[f]
      thisTuple.forEach((v: any, idx: number) => {
        const noMod = thisTuple.length === 1
        const isSpecial = !!(typeof tailwindSpecial[f] !== `undefined`)
        const hasSpecialSelector = isSpecial ? tailwindSpecial[f] : null
        const thisSelector = isSpecial ? hasSpecialSelector : f
        const thisClass = [`false`, `FALSE`].includes(v)
          ? ``
          : [`true`, `TRUE`].includes(v)
            ? f
            : reduceClassName(thisSelector, v, noMod ? -1 : idx)
        thisTailwindString = thisTailwindString.length
          ? `${thisTailwindString} ${thisClass}`
          : `${thisClass}`
      })
      return thisTailwindString
    })
    .filter((n) => n)
    .join(` `)
}

const processTuplesAllViewports = (thisTuples: any, i: number) => {
  return Object.keys(thisTuples)
    .map((f: any) => {
      let thisTailwindString = ``
      const thisTuple = thisTuples[f]
      const mobileValue = thisTuple[0]
      const tabletValue =
        typeof thisTuple[1] !== `undefined` ? thisTuple[1] : thisTuple[0]
      const desktopValue =
        typeof thisTuple[2] !== `undefined`
          ? thisTuple[2]
          : typeof thisTuple[1] !== `undefined`
            ? thisTuple[1]
            : thisTuple[0]
      const thisValue =
        i === 0 ? mobileValue : i === 1 ? tabletValue : desktopValue
      const isSpecial = !!(typeof tailwindSpecial[f] !== `undefined`)
      const hasSpecialSelector = isSpecial ? tailwindSpecial[f] : null
      const thisSelector = isSpecial ? hasSpecialSelector : f
      const thisClass = reduceClassName(thisSelector, thisValue, -1)
      thisTailwindString = thisTailwindString.length
        ? `${thisTailwindString} ${thisClass}`
        : `${thisClass}`
      return thisTailwindString
    })
    .filter((n) => n)
    .join(` `)
}

export const reduceTailwindClasses = (classes: any) => {
  // FIX
  const keys = [0, 1, 2]
  const buttonClasses = classes?.button?.classes
  const buttonHoverClasses = classes?.hover?.classes
  const classNamesButtonObject =
    typeof buttonClasses !== `undefined`
      ? Object.keys(buttonClasses).map((e: any) => {
          const thisTuples = { [e]: buttonClasses[e] }
          return processTuples(thisTuples)
        })
      : null
  const classNamesButton =
    typeof classNamesButtonObject !== `undefined`
      ? classNamesButtonObject?.join(` `)
      : ``
  const classNamesButtonHoverObject =
    typeof buttonHoverClasses !== `undefined`
      ? Object.keys(buttonHoverClasses).map((e: any) => {
          const thisTuples = { [e]: buttonHoverClasses[e] }
          const val = processTuples(thisTuples)
          return `hover:${val}`
        })
      : null
  const classNamesButtonHover =
    typeof classNamesButtonObject !== `undefined`
      ? classNamesButtonHoverObject?.join(` `)
      : ``
  const newClassNameString = `${
    typeof classNamesButton === `string` ? classNamesButton : ``
  }${` `}${
    typeof classNamesButtonHover === `string` ? classNamesButtonHover : ``
  }`
  const classNamesModalObject =
    typeof classes?.modal?.classes !== `undefined` &&
    typeof classes?.modal?.classes[0] !== `undefined`
      ? processTuples(classes.modal.classes[0])
      : null
  const classNamesModalAllViewports =
    typeof classes?.modal?.classes !== `undefined` &&
    typeof classes?.modal?.classes[0] !== `undefined`
      ? keys.map((i: number) => {
          return processTuplesAllViewports(classes.modal.classes[0], i)
        })
      : null
  const parentClasses = classes?.parent?.classes
  const classNamesParentObject = parentClasses
    ? Object.keys(parentClasses).map((e: any) => {
        const thisTuples = parentClasses[e]
        return processTuples(thisTuples)
      })
    : null
  const classNamesParentAllViewports = parentClasses
    ? keys.map((i: number) => {
        return Object.keys(parentClasses).map((e: any) => {
          const thisTuples = parentClasses[e]
          return processTuplesAllViewports(thisTuples, i)
        })
      })
    : null
  const parentClassesMulti = classNamesParentObject
    ? classNamesParentObject?.length > 1
    : null
  const classNamesObject: any = {}
  const classNamesObjectMobile: any = {}
  const classNamesObjectTablet: any = {}
  const classNamesObjectDesktop: any = {}
  Object.keys(classes).forEach((e: any) => {
    if (e === `parent` || e === `modal`) return null
    const allSelectors = classes[e].classes
    const hasCount = typeof classes[e].count === `number`
    const count = hasCount ? classes[e].count : 1
    const hasOverride = typeof classes[e].override === `object`
    const override = hasOverride ? classes[e].override : null
    let tailwindString = ``
    let tailwindStringMobile = ``
    let tailwindStringTablet = ``
    let tailwindStringDesktop = ``
    const tailwindStringArray: string[] = []
    const tailwindStringArrayMobile: string[] = []
    const tailwindStringArrayTablet: string[] = []
    const tailwindStringArrayDesktop: string[] = []
    for (let i = 0; i < count; i++) {
      let thisTailwindString = ``
      let thisTailwindStringMobile = ``
      let thisTailwindStringTablet = ``
      let thisTailwindStringDesktop = ``
      if (typeof allSelectors !== `undefined`)
        Object.keys(allSelectors).forEach((s: any) => {
          const isSpecial = !!(typeof tailwindSpecial[s] !== `undefined`)
          const hasSpecialSelector = isSpecial ? tailwindSpecial[s] : null
          const thisSelector = isSpecial ? hasSpecialSelector : s
          const thisHasOverride = !!(
            hasOverride && typeof override[s] !== `undefined`
          )
          const thisOverride = thisHasOverride ? override[s] : null
          const thisTuple =
            hasOverride &&
            thisOverride &&
            typeof thisOverride[i] !== `undefined` &&
            thisOverride[i].length &&
            classes[e].classes[s].length === 2
              ? classes[e].classes[s].concat(undefined)
              : hasOverride &&
                  thisOverride &&
                  typeof thisOverride[i] !== `undefined` &&
                  thisOverride[i].length &&
                  classes[e].classes[s].length === 1
                ? classes[e].classes[s].concat([undefined, undefined])
                : classes[e].classes[s]
          thisTuple.forEach((v: any, idx: number) => {
            const thisValue =
              thisHasOverride &&
              typeof thisOverride[i] !== `undefined` &&
              typeof thisOverride[i] === `string`
                ? thisOverride[i]
                : thisHasOverride &&
                    typeof thisOverride[i] !== `undefined` &&
                    typeof thisOverride[i] === `object` &&
                    typeof thisOverride[i][idx] === `string`
                  ? thisOverride[i][idx]
                  : thisHasOverride &&
                      typeof thisOverride[i] !== `undefined` &&
                      typeof thisOverride[i] === `object` &&
                      idx === 2 &&
                      typeof thisOverride[i][1] === `string`
                    ? thisOverride[i][1]
                    : thisHasOverride &&
                        typeof thisOverride[i] !== `undefined` &&
                        typeof thisOverride[i] === `object` &&
                        typeof thisOverride[i][0] === `string`
                      ? thisOverride[i][0]
                      : v
            const thisClass =
              typeof thisValue === `undefined`
                ? null
                : typeof thisValue === `string` ||
                    typeof thisValue === `number` ||
                    typeof thisValue === `boolean`
                  ? reduceClassName(thisSelector, thisValue, idx)
                  : reduceClassNameArray(thisSelector, thisValue)
            if (thisClass)
              thisTailwindString = thisTailwindString.length
                ? `${thisTailwindString} ${thisClass}`
                : `${thisClass}`
          })
          const mobileValue =
            thisHasOverride &&
            typeof thisOverride[i] !== `undefined` &&
            typeof thisOverride[i] === `string`
              ? thisOverride[i]
              : thisHasOverride &&
                  typeof thisOverride[i] !== `undefined` &&
                  typeof thisOverride[i] === `object` &&
                  typeof thisOverride[i][0] !== `undefined`
                ? thisOverride[i][0]
                : thisTuple[0]
          const tabletValue =
            thisHasOverride &&
            typeof thisOverride[i] !== `undefined` &&
            typeof thisOverride[i] === `string`
              ? thisOverride[i]
              : thisHasOverride &&
                  typeof thisOverride[i] !== `undefined` &&
                  typeof thisOverride[i] === `object` &&
                  typeof thisOverride[i][1] !== `undefined`
                ? thisOverride[i][1]
                : thisHasOverride &&
                    typeof thisOverride[i] !== `undefined` &&
                    typeof thisOverride[i] === `object` &&
                    typeof thisOverride[i][0] !== `undefined`
                  ? thisOverride[i][0]
                  : typeof thisTuple[1] !== `undefined`
                    ? thisTuple[1]
                    : thisTuple[0]
          const desktopValue =
            thisHasOverride &&
            typeof thisOverride[i] !== `undefined` &&
            typeof thisOverride[i] === `string`
              ? thisOverride[i]
              : thisHasOverride &&
                  typeof thisOverride[i] !== `undefined` &&
                  typeof thisOverride[i] === `object` &&
                  typeof thisOverride[i][2] !== `undefined`
                ? thisOverride[i][2]
                : thisHasOverride &&
                    typeof thisOverride[i] !== `undefined` &&
                    typeof thisOverride[i] === `object` &&
                    typeof thisOverride[i][1] !== `undefined`
                  ? thisOverride[i][1]
                  : thisHasOverride &&
                      typeof thisOverride[i] !== `undefined` &&
                      typeof thisOverride[i] === `object` &&
                      typeof thisOverride[i][0] !== `undefined`
                    ? thisOverride[i][0]
                    : typeof thisTuple[2] !== `undefined`
                      ? thisTuple[2]
                      : typeof thisTuple[1] !== `undefined`
                        ? thisTuple[1]
                        : thisTuple[0]
          const thisClassMobile = mobileValue
            ? reduceClassName(thisSelector, mobileValue, -1)
            : ``
          const thisClassTablet = tabletValue
            ? reduceClassName(thisSelector, tabletValue, -1)
            : thisClassMobile
          const thisClassDesktop = desktopValue
            ? reduceClassName(thisSelector, desktopValue, -1)
            : thisClassTablet
          if (thisClassMobile)
            thisTailwindStringMobile = thisTailwindStringMobile.length
              ? `${thisTailwindStringMobile} ${thisClassMobile}`
              : `${thisClassMobile}`
          if (thisClassTablet)
            thisTailwindStringTablet = thisTailwindStringTablet.length
              ? `${thisTailwindStringTablet} ${thisClassTablet}`
              : `${thisClassTablet}`
          if (thisClassDesktop)
            thisTailwindStringDesktop = thisTailwindStringDesktop.length
              ? `${thisTailwindStringDesktop} ${thisClassDesktop}`
              : `${thisClassDesktop}`
        })
      if (hasOverride) {
        tailwindStringArray.push(thisTailwindString)
        tailwindStringArrayMobile.push(thisTailwindStringMobile)
        tailwindStringArrayTablet.push(thisTailwindStringTablet)
        tailwindStringArrayDesktop.push(thisTailwindStringDesktop)
      } else {
        tailwindString = thisTailwindString
        tailwindStringMobile = thisTailwindStringMobile
        tailwindStringTablet = thisTailwindStringTablet
        tailwindStringDesktop = thisTailwindStringDesktop
      }
    }
    if (tailwindStringArray.length) classNamesObject[e] = tailwindStringArray
    else if (tailwindString) classNamesObject[e] = tailwindString
    if (tailwindStringArrayMobile.length)
      classNamesObjectMobile[e] = tailwindStringArrayMobile
    else if (tailwindStringMobile)
      classNamesObjectMobile[e] = tailwindStringMobile
    if (tailwindStringArrayTablet.length)
      classNamesObjectTablet[e] = tailwindStringArrayTablet
    else if (tailwindStringTablet)
      classNamesObjectTablet[e] = tailwindStringTablet
    if (tailwindStringArrayDesktop.length)
      classNamesObjectDesktop[e] = tailwindStringArrayDesktop
    else if (tailwindStringDesktop)
      classNamesObjectDesktop[e] = tailwindStringDesktop
  })

  let payload = {
    button: {},
    classNames: {},
    classNamesParent: {},
    classNamesModal: {},
    builder: {
      classNames: {},
      classNamesParent: {},
      classNamesModal: {},
    },
  }
  if (typeof buttonClasses !== `undefined`)
    payload = { ...payload, button: newClassNameString }
  if (classNamesObject && Object.keys(classNamesObject).length)
    payload = { ...payload, classNames: { all: classNamesObject } }
  if (classNamesParentObject && Object.keys(classNamesParentObject).length) {
    payload = {
      ...payload,
      classNamesParent: {
        all: parentClassesMulti
          ? classNamesParentObject
          : classNamesParentObject[0],
      },
    }
  }
  if (classNamesModalObject && Object.keys(classNamesModalObject).length)
    payload = {
      ...payload,
      classNamesModal: {
        all: classNamesModalObject,
      },
    }
  if (classNamesObject && Object.keys(classNamesObject).length)
    payload.builder = {
      ...payload.builder,
      classNames: {
        mobile: classNamesObjectMobile,
        tablet: classNamesObjectTablet,
        desktop: classNamesObjectDesktop,
      },
    }
  if (
    classNamesParentAllViewports &&
    Object.keys(classNamesParentAllViewports).length
  )
    payload.builder = {
      ...payload.builder,
      classNamesParent: {
        mobile: classNamesParentAllViewports[0],
        tablet: classNamesParentAllViewports[1],
        desktop: classNamesParentAllViewports[2],
      },
    }
  if (
    classNamesModalAllViewports &&
    Object.keys(classNamesModalAllViewports).length
  )
    payload.builder = {
      ...payload.builder,
      classNamesModal: {
        mobile: classNamesModalAllViewports[0],
        tablet: classNamesModalAllViewports[1],
        desktop: classNamesModalAllViewports[2],
      },
    }

  return payload
}
