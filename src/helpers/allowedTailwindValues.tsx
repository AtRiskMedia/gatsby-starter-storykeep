export const tailwindModifier = [``, `md:`, `xl:`]

export const tailwindSpecial: { [index: string]: string } = {
  textCOLOR: `text`,
  textSIZE: `text`,
  fontFACE: `font`,
  fontSTYLE: `font`,
  bgCOLOR: `bg`,
  borderSTROKE: `border`,
  borderSTYLE: `border`,
  borderCOLOR: `border`,
  borderSIZE: `border`,
  strokeSIZE: `stroke`,
  strokeSTYLE: `stroke`,
  strokeCOLOR: `stroke`,
  justifyCONTENT: `justify`,
  fillCOLOR: `fill`,
  underlineSTYLE: `underline`,
  maxW: `max-w`,
  maxH: `max-h`,
}

const spacing = [
  `0`,
  `1`,
  `r1`,
  `2`,
  `r2`,
  `3`,
  `r3`,
  `4`,
  `r4`,
  `5`,
  `r5`,
  `6`,
  `!6`,
  `r6`,
  `7`,
  `r7`,
  `8`,
  `r8`,
  `9`,
  `r9`,
  `10`,
  `r10`,
  `11`,
  `r11`,
  `12`,
  `!12`,
  `r12`,
  `14`,
  `r14`,
  `16`,
  `r16`,
  `20`,
  `r20`,
  `24`,
  `28`,
  `32`,
  `36`,
  `40`,
  `44`,
  `48`,
  `52`,
  `56`,
  `60`,
  `64`,
  `72`,
  `80`,
  `96`,
  `auto`,
  `px`,
  `0.5`,
  `1.5`,
  `2.5`,
  `3.5`,
]

const spacingExtraW = [
  `1/2`,
  `1/3`,
  `2/3`,
  `1/4`,
  `2/4`,
  `3/4`,
  `1/5`,
  `2/5`,
  `3/5`,
  `4/5`,
  `1/6`,
  `2/6`,
  `3/6`,
  `4/6`,
  `5/6`,
  `1/12`,
  `2/12`,
  `3/12`,
  `4/12`,
  `5/12`,
  `6/12`,
  `7/12`,
  `8/12`,
  `9/12`,
  `10/12`,
  `11/12`,
  `full`,
  `screen`,
  `min`,
  `max`,
  `fit`,
  `[110%]`,
]

const spacingExtraH = [
  `1/2`,
  `1/3`,
  `2/3`,
  `1/4`,
  `2/4`,
  `3/4`,
  `1/5`,
  `2/5`,
  `3/5`,
  `4/5`,
  `1/6`,
  `2/6`,
  `3/6`,
  `4/6`,
  `5/6`,
  `full`,
  `screen`,
  `min`,
  `max`,
  `fit`,
]

const colors = [
  `black`,
  `white`,
  `mywhite`,
  `myoffwhite`,
  `mylightgrey`,
  `myblue`,
  `mygreen`,
  `myorange`,
  `mydarkgrey`,
  `myblack`,
  `slate-50`,
  `slate-100`,
  `slate-200`,
  `slate-300`,
  `slate-400`,
  `slate-500`,
  `slate-600`,
  `slate-700`,
  `slate-800`,
  `slate-900`,
  `gray-50`,
  `gray-100`,
  `gray-200`,
  `gray-300`,
  `gray-400`,
  `gray-500`,
  `gray-600`,
  `gray-700`,
  `gray-800`,
  `gray-900`,
  `zinc-50`,
  `zinc-100`,
  `zinc-200`,
  `zinc-300`,
  `zinc-400`,
  `zinc-500`,
  `zinc-600`,
  `zinc-700`,
  `zinc-800`,
  `zinc-900`,
  `neutral-50`,
  `neutral-100`,
  `neutral-200`,
  `neutral-300`,
  `neutral-400`,
  `neutral-500`,
  `neutral-600`,
  `neutral-700`,
  `neutral-800`,
  `neutral-900`,
  `stone-50`,
  `stone-100`,
  `stone-200`,
  `stone-300`,
  `stone-400`,
  `stone-500`,
  `stone-600`,
  `stone-700`,
  `stone-800`,
  `stone-900`,
  `red-50`,
  `red-100`,
  `red-200`,
  `red-300`,
  `red-400`,
  `red-500`,
  `red-600`,
  `red-700`,
  `red-800`,
  `red-900`,
  `orange-50`,
  `orange-100`,
  `orange-200`,
  `orange-300`,
  `orange-400`,
  `orange-500`,
  `orange-600`,
  `orange-700`,
  `orange-800`,
  `orange-900`,
  `amber-50`,
  `amber-100`,
  `amber-200`,
  `amber-300`,
  `amber-400`,
  `amber-500`,
  `amber-600`,
  `amber-700`,
  `amber-800`,
  `amber-900`,
  `yellow-50`,
  `yellow-100`,
  `yellow-200`,
  `yellow-300`,
  `yellow-400`,
  `yellow-500`,
  `yellow-600`,
  `yellow-700`,
  `yellow-800`,
  `yellow-900`,
  `lime-50`,
  `lime-100`,
  `lime-200`,
  `lime-300`,
  `lime-400`,
  `lime-500`,
  `lime-600`,
  `lime-700`,
  `lime-800`,
  `lime-900`,
  `green-50`,
  `green-100`,
  `green-200`,
  `green-300`,
  `green-400`,
  `green-500`,
  `green-600`,
  `green-700`,
  `green-800`,
  `green-900`,
  `emerald-50`,
  `emerald-100`,
  `emerald-200`,
  `emerald-300`,
  `emerald-400`,
  `emerald-500`,
  `emerald-600`,
  `emerald-700`,
  `emerald-800`,
  `emerald-900`,
  `teal-50`,
  `teal-100`,
  `teal-200`,
  `teal-300`,
  `teal-400`,
  `teal-500`,
  `teal-600`,
  `teal-700`,
  `teal-800`,
  `teal-900`,
  `cyan-50`,
  `cyan-100`,
  `cyan-200`,
  `cyan-300`,
  `cyan-400`,
  `cyan-500`,
  `cyan-600`,
  `cyan-700`,
  `cyan-800`,
  `cyan-900`,
  `sky-50`,
  `sky-100`,
  `sky-200`,
  `sky-300`,
  `sky-400`,
  `sky-500`,
  `sky-600`,
  `sky-700`,
  `sky-800`,
  `sky-900`,
  `blue-50`,
  `blue-100`,
  `blue-200`,
  `blue-300`,
  `blue-400`,
  `blue-500`,
  `blue-600`,
  `blue-700`,
  `blue-800`,
  `blue-900`,
  `indigo-50`,
  `indigo-100`,
  `indigo-200`,
  `indigo-300`,
  `indigo-400`,
  `indigo-500`,
  `indigo-600`,
  `indigo-700`,
  `indigo-800`,
  `indigo-900`,
  `violet-50`,
  `violet-100`,
  `violet-200`,
  `violet-300`,
  `violet-400`,
  `violet-500`,
  `violet-600`,
  `violet-700`,
  `violet-800`,
  `violet-900`,
  `purple-50`,
  `purple-100`,
  `purple-200`,
  `purple-300`,
  `purple-400`,
  `purple-500`,
  `purple-600`,
  `purple-700`,
  `purple-800`,
  `purple-900`,
  `fuchsia-50`,
  `fuchsia-100`,
  `fuchsia-200`,
  `fuchsia-300`,
  `fuchsia-400`,
  `fuchsia-500`,
  `fuchsia-600`,
  `fuchsia-700`,
  `fuchsia-800`,
  `fuchsia-900`,
  `pink-50`,
  `pink-100`,
  `pink-200`,
  `pink-300`,
  `pink-400`,
  `pink-500`,
  `pink-600`,
  `pink-700`,
  `pink-800`,
  `pink-900`,
  `rose-50`,
  `rose-100`,
  `rose-200`,
  `rose-300`,
  `rose-400`,
  `rose-500`,
  `rose-600`,
  `rose-700`,
  `rose-800`,
  `rose-900`,
]

const rotate = [
  `0`,
  `1`,
  `2`,
  `3`,
  `6`,
  `12`,
  `45`,
  `90`,
  `180`,
  `!0`,
  `!1`,
  `!2`,
  `!3`,
  `!6`,
  `!12`,
  `!45`,
  `!90`,
  `!180`,
]

const textSIZE = [
  `xs`,
  `sm`,
  `base`,
  `lg`,
  `xl`,
  `2xl`,
  `3xl`,
  `4xl`,
  `5xl`,
  `6xl`,
  `7xl`,
  `8xl`,
  `9xl`,
  `rxs`,
  `rsm`,
  `rbase`,
  `rlg`,
  `rxl`,
  `r2xl`,
  `r3xl`,
  `r4xl`,
  `r5xl`,
  `r6xl`,
  `r7xl`,
  `r8xl`,
  `r9xl`,
]

const maxW = [
  `0`,
  `none`,
  `xs`,
  `sm`,
  `md`,
  `lg`,
  `xl`,
  `2xl`,
  `3xl`,
  `4xl`,
  `5xl`,
  `6xl`,
  `7xl`,
  `full`,
  `min`,
  `max`,
  `fit`,
  `prose`,
  `screen-sm`,
  `screen-md`,
  `screen-lg`,
  `screen-xl`,
  `screen-2xl`,
]

const maxH = [
  `0`,
  `1`,
  `2`,
  `3`,
  `4`,
  `5`,
  `6`,
  `7`,
  `8`,
  `9`,
  `10`,
  `11`,
  `12`,
  `14`,
  `16`,
  `20`,
  `24`,
  `28`,
  `32`,
  `36`,
  `40`,
  `44`,
  `48`,
  `52`,
  `56`,
  `60`,
  `64`,
  `72`,
  `80`,
  `96`,
  `px`,
  `0.5`,
  `1.5`,
  `2.5`,
  `3.5`,
  `full`,
  `screen`,
  `min`,
  `max`,
  `fit`,
]

const fontSTYLE = [`normal`, `bold`]

const fontFACE = [`action`, `main`]

const leading = [
  `3`,
  `4`,
  `5`,
  `6`,
  `7`,
  `8`,
  `9`,
  `10`,
  `none`,
  `tight`,
  `snug`,
  `normal`,
  `relaxed`,
  `loose`,
]

const z = [`0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]

const rounded = [
  `t-none`,
  `r-none`,
  `b-none`,
  `l-none`,
  `tr-none`,
  `tl-none`,
  `br-none`,
  `bl-none`,
  `none`,
  `t-sm`,
  `r-sm`,
  `b-sm`,
  `l-sm`,
  `tr-sm`,
  `tl-sm`,
  `br-sm`,
  `bl-sm`,
  `sm`,
  `t`,
  `r`,
  `b`,
  `l`,
  `tr`,
  `tl`,
  `br`,
  `bl`,
  `t-md`,
  `r-md`,
  `b-md`,
  `l-md`,
  `tr-md`,
  `tl-md`,
  `br-md`,
  `bl-md`,
  `md`,
  `t-lg`,
  `r-lg`,
  `b-lg`,
  `l-lg`,
  `tr-lg`,
  `tl-lg`,
  `br-lg`,
  `bl-lg`,
  `lg`,
  `t-xl`,
  `r-xl`,
  `b-xl`,
  `l-xl`,
  `tr-xl`,
  `tl-xl`,
  `br-xl`,
  `bl-xl`,
  `xl`,
  `t-2xl`,
  `r-2xl`,
  `b-2xl`,
  `l-2xl`,
  `tr-2xl`,
  `tl-2xl`,
  `br-2xl`,
  `bl-2xl`,
  `2xl`,
  `t-3xl`,
  `r-3xl`,
  `b-3xl`,
  `l-3xl`,
  `tr-3xl`,
  `tl-3xl`,
  `br-3xl`,
  `bl-3xl`,
  `3xl`,
  `t-full`,
  `r-full`,
  `b-full`,
  `l-full`,
  `tr-full`,
  `tl-full`,
  `br-full`,
  `bl-full`,
  `full`,
]

const borderSTYLE = [`solid`, `dashed`, `dotted`, `double`, `hidden`, `none`]

const animate = [`fadeInUp`]

const shadowSIZE = [`sm`, `TRUE`, `md`, `lg`, `xl`, `2xl`, `inner`, `none`]

const strokeSIZE = [0, 1, 2]

const overflow = [
  `auto`,
  `clip`,
  `hidden`,
  `visible`,
  `scroll`,
  `x-auto`,
  `y-auto`,
  `x-clip`,
  `y-clip`,
  `x-hidden`,
  `y-hidden`,
  `x-visible`,
  `y-visible`,
  `x-scroll`,
  `y-scroll`,
]

const underlineSTYLE = [
  `offset-0`,
  `offset-1`,
  `offset-2`,
  `offset-4`,
  `offset-8`,
  `offset-auto`,
]

const display = [
  `block`,
  `inline-block`,
  `inline`,
  `flex`,
  `inline-flex`,
  `grid`,
  `inline-grid`,
  `table`,
  `inline-table`,
  `table-row`,
  `table-cell`,
  `contents`,
  `list-item`,
  `hidden`,
]

const justifyCONTENT = [
  `normal`,
  `start`,
  `center`,
  `end`,
  `between`,
  `around`,
  `evenly`,
  `stretch`,
]

// removes initial part of selector from className
export const isShorty = [`display`, `flexWRAP`]
export const truncateShorty: { [index: string]: string } = {
  flexWRAP: `flex`,
}

// tf renders true as "selector" and false does not render
const tf = [`true`, `false`]

export const tailwindSpecialTitle: { [index: string]: string } = {
  w: `Width`,
  h: `Height`,
  textCOLOR: `Text Color`,
  textSIZE: `Text Size`,
  fontFACE: `Font Face`,
  fontSTYLE: `Font Style`,
  bgCOLOR: `Background Color`,
  border: `Border`,
  borderSTYLE: `Border Style`,
  borderCOLOR: `Border Color`,
  borderSIZE: `Border Size`,
  borderSTROKE: `Border Stroke Size`,
  display: `Display`,
  stroke: `Stroke`,
  strokeSIZE: `Stroke Size`,
  strokeSTYLE: `Stroke Style`,
  strokeCOLOR: `Stroke Color`,
  justifyCONTENT: `Justify Content`,
  fill: `Fill`,
  fillCOLOR: `Fill Color`,
  flex: `Flex`,
  flexWRAP: `Flex Wrap`,
  m: `Margin`,
  mt: `Margin Top`,
  ml: `Margin Left`,
  mr: `Margin Right`,
  mb: `Margin Bottom`,
  my: `Margin Y`,
  mx: `Margin X`,
  p: `Padding`,
  pt: `Padding Top`,
  pl: `Padding Left`,
  pr: `Padding Right`,
  pb: `Padding Bottom`,
  py: `Padding Y`,
  px: `Padding X`,
  maxW: `Max Width`,
  maxH: `Max Height`,
  rotate: `Rotate`,
  rounded: `Rounded`,
  leading: `Leading - Line Height`,
  z: `Z Index`,
  animate: `Animate`,
  underline: `Underline`,
  underlineSTYLE: `Underline Style`,
  overflow: `Overflow`,
  shadow: `Shadow`,
  shadowSIZE: `Shadow Size`,
  relative: `Relative`,
}

const tailwindAllowedValues: { [index: string]: any } = {
  w: [...spacingExtraW, ...spacing],
  h: [...spacingExtraH, ...spacing],
  textCOLOR: colors,
  textSIZE,
  fontFACE,
  fontSTYLE,
  bgCOLOR: colors,
  border: tf,
  borderSTYLE,
  borderSTROKE: strokeSIZE,
  borderCOLOR: colors,
  // borderSIZE:
  display,
  strokeSIZE,
  // strokeSTYLE:
  stroke: [`none`, `inheret`, `current`, `transparent`],
  strokeCOLOR: colors,
  justifyCONTENT,
  flex: tf,
  flexWRAP: [`wrap`, `wrap-reverse`, `nowrap`],
  fill: [`none`, `inheret`, `current`, `transparent`, ...colors],
  fillCOLOR: colors,
  m: spacing,
  mt: spacing,
  ml: spacing,
  mr: spacing,
  mb: spacing,
  my: spacing,
  mx: spacing,
  p: spacing,
  pt: spacing,
  pl: spacing,
  pr: spacing,
  pb: spacing,
  py: spacing,
  px: spacing,
  maxW,
  maxH,
  rotate,
  rounded,
  leading,
  z,
  relative: tf,
  underline: tf,
  underlineSTYLE,
  animate,
  overflow,
  shadow: tf,
  shadowSIZE,
}

export const tailwindAllowedClasses = [
  `w`,
  `h`,
  `textCOLOR`,
  `textSIZE`,
  `fontFACE`,
  `fontSTYLE`,
  `bgCOLOR`,
  `border`,
  `borderSTYLE`,
  `borderSTROKE`,
  `borderCOLOR`,
  `display`,
  `strokeSIZE`,
  `stroke`,
  `strokeCOLOR`,
  `justifyCONTENT`,
  `flex`,
  `flexWRAP`,
  `fill`,
  `fillCOLOR`,
  `m`,
  `mt`,
  `ml`,
  `mr`,
  `mb`,
  `my`,
  `mx`,
  `p`,
  `pt`,
  `pl`,
  `pr`,
  `pb`,
  `py`,
  `px`,
  `maxW`,
  `maxH`,
  `rotate`,
  `rounded`,
  `leading`,
  `z`,
  `relative`,
  `underline`,
  `underlineSTYLE`,
  `animate`,
  `overflow`,
  `shadow`,
  `shadowSIZE`,
]

export const getValidation = (payload: any) => {
  const selector = Object.keys(payload)[0]
  if (tailwindAllowedClasses.includes(selector))
    return [...tailwindAllowedValues[selector]]
  console.log(`miss on`, selector)
}
