export const artpackCollections = [`custom`, `kCz`]

export const artpackCollectionImages = (collection: string) => {
  const payload = {
    custom: [
      `learn`,
      `agency`,
      `awesome`,
      `awesomenot`,
      `builder`,
      `insights`,
      `pmf`,
      `pmf-m1`,
      `pmf-m2`,
      `pmf-f1`,
      `pmf-f2`,
      `temp`,
    ],
    kCz: [
      `captainBreakfast`,
      `dragonSkin`,
      `skindrips`,
      `tractstack`,
      `cleanDrips`,
      `nightcity`,
      `slimetime`,
      `tripdrips`,
      `crispwaves`,
      `dragon`,
      `toxicshock`,
      `pattern1`,
      `pattern2`,
      `snake`,
      `wavedrips`,
    ],
    imageTypeLookup: {
      custom: {
        learn: `jpg`,
        agency: `jpg`,
        awesome: `jpg`,
        awesomenot: `jpg`,
        builder: `jpg`,
        insights: `jpg`,
        pmf: `jpg`,
        'pmf-m1': `jpg`,
        'pmf-m2': `jpg`,
        'pmf-f1': `jpg`,
        'pmf-f2': `jpg`,
        temp: `jpg`,
      },
      kCz: {
        captainBreakfast: `png`,
        dragonSkin: `png`,
        skindrips: `png`,
        tractstack: `png`,
        cleanDrips: `png`,
        nightcity: `png`,
        slimetime: `png`,
        tripdrips: `png`,
        crispwaves: `png`,
        dragon: `png`,
        toxicshock: `png`,
        pattern1: `png`,
        pattern2: `png`,
        snake: `png`,
        wavedrips: `png`,
      },
    },
  }
  return {
    images: payload[collection as keyof typeof payload],
    imageTypeLookup:
      payload.imageTypeLookup[
        collection as keyof typeof payload.imageTypeLookup
      ],
  }
}

export const modalShapes = [
  `bubble1`,
  `modal1`,
  `modal2`,
  `modal3`,
  `modal4`,
  `modal5`,
]

export const paneShapes = [
  `none`,
  `controller`,
  `pane`,
  `short`,
  `short2`,
  `tall`,
  `comic600r1`,
  `comic600r2`,
  `comic600r3`,
  `comic600r4`,
  `comic1080r1main1`,
  `comic1080r1main2`,
  `comic1080r2`,
  `comic1080r3`,
  `comic1080r4`,
  `comic1920r1main1`,
  `comic1920r1main2`,
  `comic1920r1main3`,
  `comic1920r2`,
  `comic1920r3main1`,
  `comic1920r3main2`,
]

export const paneShapesMobile = [
  `none`,
  `controller`,
  `pane`,
  `short`,
  `short2`,
  `tall`,
  `comic600r1`,
  `comic600r2`,
  `comic600r3`,
  `comic600r4`,
]

export const paneShapesTablet = [
  `none`,
  `controller`,
  `pane`,
  `short`,
  `short2`,
  `tall`,
  `comic1080r1main1`,
  `comic1080r1main2`,
  `comic1080r2`,
  `comic1080r3`,
  `comic1080r4`,
]

export const paneShapesDesktop = [
  `none`,
  `controller`,
  `pane`,
  `short`,
  `short2`,
  `tall`,
  `comic1920r1main1`,
  `comic1920r1main2`,
  `comic1920r1main3`,
  `comic1920r2`,
  `comic1920r3main1`,
  `comic1920r3main2`,
]

export const shapesMobileHeightRatio = (viewportKey: string, name: string) => {
  const mobileValues = {
    none: `0`,
    controller: `18.33`,
    pane: `57.5`,
    short: `14.67`,
    short2: `14.67`,
    tall: `37.5`,
    comic600r1: `190`,
    comic600r1inner: `190`,
    comic600r1half: `190`,
    comic600r2: `116.33`,
    comic600r2inner: `116.33`,
    comic600r2half: `116.33`,
    comic600r3: `120.83`,
    comic600r3inner: `120.83`,
    comic600r3half: `120.83`,
    comic600r4: `273.67`,
    comic600r4inner: `273.67`,
    comic600r4half: `273.67`,
  }
  const tabletValues = {
    none: `0`,
    controller: `9.63`,
    pane: `57.41`,
    short: `14.44`,
    short2: `14.44`,
    tall: `37.41`,
    comic1080r1main1: `103.8`,
    comic1080r1main2: `103.8`,
    comic1080r1main1inner: `103.8`,
    comic1080r1main1half: `103.8`,
    comic1080r1main2inner: `103.8`,
    comic1080r1main2half: `103.8`,
    comic1080r2: `73.33`,
    comic1080r2inner: `73.33`,
    comic1080r2half: `73.33`,
    comic1080r3: `92.22`,
    comic1080r3inner: `92.22`,
    comic1080r3half: `92.22`,
  }
  const desktopValues = {
    none: `0`,
    controller: `6.46`,
    pane: `56.72`,
    short: `13.8`,
    short2: `13.8`,
    tall: `36.77`,
    comic1920r1main1: `68.39`,
    comic1920r1main2: `68.39`,
    comic1920r1main3: `68.39`,
    comic1920r1main1inner: `68.39`,
    comic1920r1main1half: `68.39`,
    comic1920r1main2inner: `68.39`,
    comic1920r1main2half: `68.39`,
    comic1920r1main3inner: `68.39`,
    comic1920r1main3half: `68.39`,
    comic1920r2: `44.9`,
    comic1920r2left: `44.9`,
    comic1920r2right: `44.9`,
    comic1920r3main1: `58.39`,
    comic1920r3main2: `58.39`,
    comic1920r3main1inner: `58.39`,
    comic1920r3main1half: `58.39`,
    comic1920r3main2inner: `58.39`,
    comic1920r3main2half: `58.39`,
  }
  if (viewportKey === `mobile`)
    return mobileValues[name as keyof typeof mobileValues]
  if (viewportKey === `tablet`)
    return tabletValues[name as keyof typeof tabletValues]
  if (viewportKey === `desktop`)
    return desktopValues[name as keyof typeof desktopValues]
}

export const shapesMobile = [
  `comic600r1inner`,
  `comic600r1half`,
  `comic600r2inner`,
  `comic600r2half`,
  `comic600r3inner`,
  `comic600r3half`,
  `comic600r4inner`,
  `comic600r4half`,
]

export const shapesTablet = [
  `comic1080r1main1inner`,
  `comic1080r1main1half`,
  `comic1080r1main2inner`,
  `comic1080r1main2half`,
  `comic1080r2inner`,
  `comic1080r2half`,
  `comic1080r3inner`,
  `comic1080r3half`,
]

export const shapesDesktop = [
  `comic1920r1main1inner`,
  `comic1920r1main1half`,
  `comic1920r1main2inner`,
  `comic1920r1main2half`,
  `comic1920r1main3inner`,
  `comic1920r1main3half`,
  `comic1920r2left`,
  `comic1920r2right`,
  `comic1920r3main1inner`,
  `comic1920r3main1half`,
  `comic1920r3main2inner`,
  `comic1920r3main2half`,
]

export const breaksShapes = [
  `kCzcut1`,
  `kCzcut2`,
  `kCzcutwide1`,
  `kCzcutwide2`,
  `kCzlowcut1`,
  `kCzlowcut2`,
  `kCzlowcutwide1`,
  `kCzlowcutwide2`,
  `kCzjag`,
  `kCzjagwide`,
  `kCzburst1`,
  `kCzburstwide1`,
  `kCzburst2`,
  `kCzburstwide2`,
  `kCzcrooked`,
  `kCzcrookedwide`,
  `kCzstepped`,
  `kCzsteppedwide`,
]
