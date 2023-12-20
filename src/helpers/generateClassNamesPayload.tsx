const fullTuple = (tuple: string[], overridden?: boolean) => {
  const override = typeof overridden === `undefined` ? false : overridden
  const val1 = typeof tuple[0] !== `undefined` ? tuple[0] : `=`
  const val2 = typeof tuple[1] !== `undefined` ? tuple[1] : `=`
  const val3 = typeof tuple[2] !== `undefined` ? tuple[2] : `=`
  return [val1, val2, val3, override]
}

export function generateClassNamesPayload(payload: any, markdownPayload: any) {
  const images = markdownPayload.images
  const markdownTags = markdownPayload.markdownTags
  const listItems = markdownPayload.listItems
  const codeItems = markdownPayload.codeItems
  const returnPayload: any = {
    parentClasses: {},
    modalClasses: {},
    childClasses: {},
  }
  Object.keys(payload).forEach((e: any) => {
    const thisSelector = e
    const selectorPayload = payload[e]
    const selectorClasses = selectorPayload?.classes
    const selectorClassesOverride = selectorPayload?.override
    const selectorClassesCount = selectorPayload?.count
    if (thisSelector === `parent` || thisSelector === `modal`) {
      Object.keys(selectorClasses).forEach((f: any, idx: number) => {
        let thisValue = {}
        Object.keys(selectorClasses[f]).forEach((g: any) => {
          thisValue = { ...thisValue, [g]: fullTuple(selectorClasses[f][g]) }
        })
        const v = `${thisSelector}Classes`
        if (thisSelector === `parent`)
          returnPayload[v] = {
            ...returnPayload[v],
            [idx]: thisValue,
          }
        else returnPayload[v] = thisValue
      })
    } else if (
      (thisSelector === `li` ||
        thisSelector === `img` ||
        thisSelector === `code`) &&
      selectorClassesCount &&
      selectorClassesOverride
    ) {
      returnPayload.childClasses[thisSelector] = {}
      Object.keys(selectorClasses).forEach((g: any) => {
        for (let h = 0; h < selectorClassesCount; h++) {
          const thisValue =
            typeof selectorClassesOverride[g] === `undefined` ||
            (typeof selectorClassesOverride[g] !== `undefined` &&
              typeof selectorClassesOverride[g][h] === `undefined`)
              ? fullTuple(selectorClasses[g], false)
              : typeof selectorClassesOverride[g][h] !== `undefined`
                ? fullTuple(selectorClassesOverride[g][h], true)
                : null
          returnPayload.childClasses[thisSelector][h] = {
            ...returnPayload.childClasses[thisSelector][h],
            [g]: thisValue,
          }
        }
      })
    } else if (
      thisSelector === `li` ||
      thisSelector === `img` ||
      thisSelector === `code`
    ) {
      const thisCount =
        thisSelector === `li`
          ? Object.keys(listItems).length
          : thisSelector === `img`
            ? Object.keys(images).length
            : thisSelector === `code`
              ? Object.keys(codeItems).length
              : 0
      returnPayload.childClasses[thisSelector] = {}
      Object.keys(selectorClasses).forEach((g: any) => {
        for (let h = 0; h < thisCount; h++) {
          returnPayload.childClasses[thisSelector][h] = {
            ...returnPayload.childClasses[thisSelector][h],
            [g]: fullTuple(selectorClasses[g]),
          }
        }
      })
    } else if (selectorClassesCount && selectorClassesOverride) {
      let index = 0
      const thisCountNth: any = []
      markdownTags.forEach((k: string, x: number) => {
        if (k === thisSelector) {
          thisCountNth.push(x)
          index = index + 1
        }
      })
      if (thisCountNth.length) returnPayload.childClasses[thisSelector] = {}
      Object.keys(selectorClasses).forEach((g: any) => {
        thisCountNth.forEach((h: number, j: number) => {
          const thisValue =
            typeof selectorClassesOverride[g] === `undefined` ||
            (typeof selectorClassesOverride[g] !== `undefined` &&
              typeof selectorClassesOverride[g][j] === `undefined`)
              ? fullTuple(selectorClasses[g], false)
              : typeof selectorClassesOverride[g][j] !== `undefined`
                ? fullTuple(selectorClassesOverride[g][j], true)
                : null
          returnPayload.childClasses[thisSelector][h] = {
            ...returnPayload.childClasses[thisSelector][h],
            [g]: thisValue,
          }
        })
      })
    } else {
      const thisCountNth: any = []
      markdownTags?.forEach((e: string, x: number) => {
        if (e === thisSelector) thisCountNth.push(x)
      })
      if (thisCountNth.length) returnPayload.childClasses[thisSelector] = {}
      Object.keys(selectorClasses).forEach((g: any) => {
        thisCountNth.forEach((h: number) => {
          returnPayload.childClasses[thisSelector][h] = {
            ...returnPayload.childClasses[thisSelector][h],
            [g]: fullTuple(selectorClasses[g]),
          }
        })
      })
    }
  })
  return returnPayload
}
