import { v4 as uuidv4 } from 'uuid'

import { reduceTailwindClasses } from './reduceTailwindClasses'

/*
const reduced = reduceTailwindClasses(newClassNamesPayload)
    const thisOptionsPayload = {
      ...optionsPayload,
      classNames: reduced.classNames,
      classNamesModal: reduced?.classNamesModal || ``,
      classNamesPayload: newClassNamesPayload,
    }
*/

export const starterTemplate = (key: string, title: string, slug: string) => {
  switch (key) {
    case `breaks`: {
      const newPaneFragmentBgColourId = uuidv4()
      const newPaneFragmentBgPaneId = uuidv4()
      const newOptionsPayload = {
        artpack: {
          desktop: {
            collection: `kCz`,
            image: `stepped`,
            mode: `break`,
            svgFill: `#c8df8c`,
          },
          tablet: {
            collection: `kCz`,
            image: `stepped`,
            mode: `break`,
            svgFill: `#c8df8c`,
          },
          mobile: {
            collection: `kCz`,
            image: `stepped`,
            mode: `break`,
            svgFill: `#c8df8c`,
          },
        },
      }
      const payloadBgColour = {
        bgColour: `#000000`,
        hiddenViewports: `none`,
        id: newPaneFragmentBgColourId,
        internal: { type: `bgColour` },
      }
      const payloadBgPane = {
        hiddenViewports: `none`,
        id: newPaneFragmentBgPaneId,
        internal: { type: `bgPane` },
        shapeMobile: `none`,
        shapeTablet: `none`,
        shapeDesktop: `none`,
        zIndex: 100,
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
      }
      const paneFragmentsPayload = {
        [newPaneFragmentBgPaneId]: payloadBgPane,
        [newPaneFragmentBgColourId]: payloadBgColour,
      }
      return {
        paneFragmentsPayload,
      }
    }

    case `titleText`: {
      const newPaneFragmentId = uuidv4()
      const newMarkdownId = uuidv4()
      const newMarkdownBody = `## title\n...\n`
      const newMarkdownPayload = {
        id: newMarkdownId,
        drupalNid: -1,
        title: `Copy for ${title}`,
        type: `node__markdown`,
        markdownBody: newMarkdownBody,
        slug,
        categorySlug: ``,
        images: [],
        svgs: [],
      }
      const newMarkdown = {
        [newMarkdownId]: {
          id: newMarkdownId,
          drupalNid: -1,
          title: `Copy for ${title}`,
          type: `node__markdown`,
          markdownBody: newMarkdownBody,
          slug,
          categorySlug: ``,
          relationships: {
            images: [],
            imagesSvg: [],
          },
        },
      }
      const newClassNamesPayload = {
        parent: {
          classes: {
            0: {
              my: [12, 16],
            },
            1: {
              maxW: [`2xl`, `3xl`],
              mx: [`auto`],
              px: [8],
            },
          },
        },
        h2: {
          classes: {
            fontSTYLE: [`bold`],
            rotate: [`!1`],
            textCOLOR: [`myblue`],
            textSIZE: [`3xl`, `5xl`],
          },
        },
        p: {
          classes: {
            textCOLOR: [`mydarkgrey`],
            textSIZE: [`lg`, `xl`],
            my: [3],
          },
        },
      }
      const reduced = reduceTailwindClasses(newClassNamesPayload)
      const newOptionsPayload = {
        classNamesPayload: newClassNamesPayload,
        classNames: reduced.classNames,
        classNamesParent: reduced.classNamesParent,
      }
      const payload = {
        id: newPaneFragmentId,
        drupalNid: -1,
        markdownId: newMarkdownId,
        internal: {
          type: `markdown`,
        },
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        markdownBody: newMarkdownBody,
        hiddenViewports: `none`,
        textShapeOutsideMobile: `none`,
        textShapeOutsideTablet: `none`,
        textShapeOutsideDesktop: `none`,
        imageMaskShapeMobile: `none`,
        imageMaskShapeTablet: `none`,
        imageMaskShapeDesktop: `none`,
        zIndex: 100,
      }
      const paneFragmentsPayload = { [newPaneFragmentId]: payload }
      return {
        newMarkdownPayload,
        newMarkdown,
        newMarkdownId,
        paneFragmentsPayload,
      }
    }

    case `text`: {
      const newPaneFragmentId = uuidv4()
      const newMarkdownId = uuidv4()
      const newMarkdownBody = `...\n`
      const newMarkdownPayload = {
        id: newMarkdownId,
        drupalNid: -1,
        title: `Copy for ${title}`,
        type: `node__markdown`,
        markdownBody: newMarkdownBody,
        slug,
        categorySlug: ``,
        images: [],
        svgs: [],
      }
      const newMarkdown = {
        [newMarkdownId]: {
          id: newMarkdownId,
          drupalNid: -1,
          title: `Copy for ${title}`,
          type: `node__markdown`,
          markdownBody: newMarkdownBody,
          slug,
          categorySlug: ``,
          relationships: {
            images: [],
            imagesSvg: [],
          },
        },
      }
      const newClassNamesPayload = {
        parent: {
          classes: {
            0: {
              my: [12, 16],
            },
            1: {
              maxW: [`2xl`, `3xl`],
              mx: [`auto`],
              px: [8],
            },
          },
        },
        p: {
          classes: {
            textCOLOR: [`mydarkgrey`],
            textSIZE: [`lg`, `xl`],
            my: [3],
          },
        },
      }
      const reduced = reduceTailwindClasses(newClassNamesPayload)
      const newOptionsPayload = {
        classNamesPayload: newClassNamesPayload,
        classNames: reduced.classNames,
        classNamesParent: reduced.classNamesParent,
      }
      const payload = {
        hiddenViewports: `none`,
        id: newPaneFragmentId,
        markdownId: newMarkdownId,
        internal: {
          type: `markdown`,
        },
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        markdownBody: newMarkdownBody,
        textShapeOutsideMobile: `none`,
        textShapeOutsideTablet: `none`,
        textShapeOutsideDesktop: `none`,
        imageMaskShapeMobile: `none`,
        imageMaskShapeTablet: `none`,
        imageMaskShapeDesktop: `none`,
        zIndex: 100,
      }
      const paneFragmentsPayload = { [newPaneFragmentId]: payload }
      return {
        newMarkdownPayload,
        newMarkdown,
        newMarkdownId,
        paneFragmentsPayload,
      }
    }

    case `borderedText`: {
      const newPaneFragmentId = uuidv4()
      const newMarkdownId = uuidv4()
      const newMarkdownBody = `...\n`
      const newMarkdownPayload = {
        id: newMarkdownId,
        drupalNid: -1,
        title: `Copy for ${title}`,
        type: `node__markdown`,
        markdownBody: newMarkdownBody,
        slug,
        categorySlug: ``,
        images: [],
        svgs: [],
      }
      const newMarkdown = {
        [newMarkdownId]: {
          id: newMarkdownId,
          drupalNid: -1,
          title: `Copy for ${title}`,
          type: `node__markdown`,
          markdownBody: newMarkdownBody,
          slug,
          categorySlug: ``,
          relationships: {
            images: [],
            imagesSvg: [],
          },
        },
      }
      const newClassNamesPayload = {
        parent: {
          classes: {
            0: {
              my: [12, 16],
              px: [12],
            },
            1: {
              bgCOLOR: [`slate-50`],
              border: [true],
              borderCOLOR: [`mylightgrey`],
              borderSTROKE: [2],
              borderSTYLE: [`dashed`],
              maxW: [`none`, `3xl`],
              mx: [`auto`],
            },
            2: {
              maxW: [`none`, `2xl`],
              mx: [`auto`],
              p: [8],
            },
          },
        },
        h2: {
          classes: {
            fontSTYLE: [`bold`],
            rotate: [`!1`],
            textCOLOR: [`myblue`],
            textSIZE: [`3xl`, `5xl`],
          },
        },
        p: {
          classes: {
            textCOLOR: [`mydarkgrey`],
            textSIZE: [`lg`, `xl`],
            my: [3],
          },
        },
      }
      const reduced = reduceTailwindClasses(newClassNamesPayload)
      const newOptionsPayload = {
        classNamesPayload: newClassNamesPayload,
        classNames: reduced.classNames,
        classNamesParent: reduced.classNamesParent,
      }
      const payload = {
        hiddenViewports: `none`,
        id: newPaneFragmentId,
        markdownId: newMarkdownId,
        internal: {
          type: `markdown`,
        },
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        markdownBody: newMarkdownBody,
        textShapeOutsideMobile: `none`,
        textShapeOutsideTablet: `none`,
        textShapeOutsideDesktop: `none`,
        imageMaskShapeMobile: `none`,
        imageMaskShapeTablet: `none`,
        imageMaskShapeDesktop: `none`,
        zIndex: 100,
      }
      const paneFragmentsPayload = { [newPaneFragmentId]: payload }
      return {
        newMarkdownPayload,
        newMarkdown,
        newMarkdownId,
        paneFragmentsPayload,
      }
    }

    case `fancy`: {
      const newPaneFragmentId = uuidv4()
      const newMarkdownId = uuidv4()
      const newPaneBgShapeId = uuidv4()
      const newPaneBgShapeArtPackId = uuidv4()
      const newMarkdownBody = `## fancy title\n...\n`
      const newMarkdownPayload = {
        id: newMarkdownId,
        drupalNid: -1,
        title: `Copy for ${title}`,
        type: `node__markdown`,
        markdownBody: newMarkdownBody,
        slug,
        categorySlug: ``,
        images: [],
        svgs: [],
      }
      const newMarkdown = {
        [newMarkdownId]: {
          id: newMarkdownId,
          drupalNid: -1,
          title: `Copy for ${title}`,
          type: `node__markdown`,
          markdownBody: newMarkdownBody,
          slug,
          categorySlug: ``,
          relationships: {
            images: [],
            imagesSvg: [],
          },
        },
      }
      const newClassNamesPayload = {
        h2: {
          classes: {
            fontFACE: [`action`],
            rotate: [`!2`],
            textCOLOR: [`myblue`],
            textSIZE: [`r6xl`, `r7xl`, `r8xl`],
            z: [1],
          },
        },
        p: {
          classes: {
            textCOLOR: [`mydarkgrey`],
            textSIZE: [`r4xl`, `r5xl`, `r6xl`],
            mt: [`r12`],
            rotate: [`!1`],
          },
        },
      }
      const reduced = reduceTailwindClasses(newClassNamesPayload)
      const newOptionsPayload = {
        classNamesPayload: newClassNamesPayload,
        classNames: reduced.classNames,
      }
      const payload = {
        hiddenViewports: `none`,
        id: newPaneFragmentId,
        markdownId: newMarkdownId,
        internal: {
          type: `markdown`,
        },
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        markdownBody: newMarkdownBody,
        isModal: false,
        textShapeOutsideMobile: `comic600r3inner`,
        textShapeOutsideTablet: `comic1080r3inner`,
        textShapeOutsideDesktop: `comic1920r3main1inner`,
        imageMaskShapeMobile: `none`,
        imageMaskShapeTablet: `none`,
        imageMaskShapeDesktop: `none`,
        zIndex: 100,
      }
      const paneFragmentBgPaneClassNamesPayload = {
        parent: {
          classes: [
            {
              fill: [`slate-100`],
              strokeCOLOR: [`mydarkgrey`],
              strokeSIZE: [2, 3, 4],
            },
          ],
        },
      }
      const paneFragmentBgPaneReduced = reduceTailwindClasses(
        paneFragmentBgPaneClassNamesPayload,
      )
      const paneFragmentBgPaneOptionsPayload = {
        classNamesPayload: paneFragmentBgPaneClassNamesPayload,
        classNames: paneFragmentBgPaneReduced.classNames,
        classNamesParent: paneFragmentBgPaneReduced.classNamesParent,
      }
      const paneFragmentBgPane = {
        hiddenViewports: `none`,
        id: newPaneBgShapeId,
        internal: {
          type: `bgPane`,
        },
        optionsPayload: paneFragmentBgPaneOptionsPayload,
        optionsPayloadString: JSON.stringify(paneFragmentBgPaneOptionsPayload),
        shapeMobile: `comic600r3`,
        shapeTablet: `comic1080r3`,
        shapeDesktop: `comic1920r3main1`,
      }
      const paneFragmentBgPaneArtPackOptionsPayload = {
        artpack: {
          all: {
            image: `nightcity`,
            collection: `kCz`,
            filetype: `png`,
            mode: `mask`,
            objectFit: `cover`,
          },
        },
      }
      const paneFragmentBgPaneArtPack = {
        hiddenViewports: `mobile,tablet`,
        id: newPaneBgShapeArtPackId,
        internal: {
          type: `bgPane`,
        },
        optionsPayload: paneFragmentBgPaneArtPackOptionsPayload,
        optionsPayloadString: JSON.stringify(
          paneFragmentBgPaneArtPackOptionsPayload,
        ),
        shapeMobile: `none`,
        shapeTablet: `none`,
        shapeDesktop: `comic1920r3main2`,
      }

      const paneFragmentsPayload = {
        [newPaneFragmentId]: payload,
        [newPaneBgShapeId]: paneFragmentBgPane,
        [newPaneBgShapeArtPackId]: paneFragmentBgPaneArtPack,
      }
      return {
        newMarkdownPayload,
        newMarkdown,
        newMarkdownId,
        paneFragmentsPayload,
      }
    }

    case `modal`: {
      const newPaneFragmentId = uuidv4()
      const newMarkdownId = uuidv4()
      const newMarkdownBody = `## catchy title\n`
      const newMarkdownPayload = {
        id: newMarkdownId,
        drupalNid: -1,
        title: `Copy for ${title}`,
        type: `node__markdown`,
        markdownBody: newMarkdownBody,
        slug,
        categorySlug: ``,
        images: [],
        svgs: [],
      }
      const newMarkdown = {
        [newMarkdownId]: {
          id: newMarkdownId,
          drupalNid: -1,
          title: `Copy for ${title}`,
          type: `node__markdown`,
          markdownBody: newMarkdownBody,
          slug,
          categorySlug: ``,
          relationships: {
            images: [],
            imagesSvg: [],
          },
        },
      }
      const newClassNamesPayload = {
        modal: {
          classes: {
            0: {
              fill: [`mywhite`],
              strokeCOLOR: [`black`],
              strokeSIZE: [2],
            },
          },
        },
        h2: {
          classes: {
            fontFACE: [`action`],
            relative: [true],
            textCOLOR: [`myblue`],
            textSIZE: [`r2xl`, `r3xl`, `r4xl`],
            z: [1],
          },
        },
      }
      const reduced = reduceTailwindClasses(newClassNamesPayload)
      const newOptionsPayload = {
        classNamesPayload: newClassNamesPayload,
        classNames: reduced.classNames,
        classNamesModal: reduced.classNamesModal,
        modal: {
          desktop: { zoomFactor: 1.3, paddingLeft: 430, paddingTop: 60 },
          mobile: { zoomFactor: 0.8, paddingLeft: 60, paddingTop: 40 },
          tablet: { zoomFactor: 1, paddingLeft: 240, paddingTop: 80 },
        },
      }
      const payload = {
        hiddenViewports: `none`,
        id: newPaneFragmentId,
        markdownId: newMarkdownId,
        internal: {
          type: `markdown`,
        },
        optionsPayload: newOptionsPayload,
        optionsPayloadString: JSON.stringify(newOptionsPayload),
        markdownBody: newMarkdownBody,
        isModal: true,
        textShapeOutsideMobile: `modal2`,
        textShapeOutsideTablet: `modal2`,
        textShapeOutsideDesktop: `modal1`,
        imageMaskShapeMobile: `none`,
        imageMaskShapeTablet: `none`,
        imageMaskShapeDesktop: `none`,
        zIndex: 100,
      }
      const paneFragmentsPayload = { [newPaneFragmentId]: payload }
      return {
        newMarkdownPayload,
        newMarkdown,
        newMarkdownId,
        paneFragmentsPayload,
      }
    }
  }
}
