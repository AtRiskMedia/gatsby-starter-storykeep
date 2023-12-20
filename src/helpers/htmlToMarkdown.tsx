import { toMdast } from 'hast-util-to-mdast'
import { fromHtml } from 'hast-util-from-html'
import { toMarkdown } from 'mdast-util-to-markdown'

export function htmlToMarkdown(element: HTMLInputElement, Tag: string) {
  const regExBold = /(?:\*\*|__)(.+?)(?:\*\*|__)(?!\*)/g
  const regExItalic = /(?:\*|_)(.+?)(?:\*|_)(?!\*)/g
  const regExImages = /(?:!\[)(.+?)(?:\])(?:\()(.+?)(?:\))(?!\*)/g
  const regExLinks = /(?:\[)(.+?)(?:\])(?:\()(.+?)(?:\))(?!\*)/g
  const regExSlashedLinks = /(?:\\\[)(.+?)(?:\])(?:\\\()(.+?)(?:\))(?!\*)/g
  const regExCode = /(?:`)(.+?)(?:`)(?!\*)/g
  const thisHtml = element.innerHTML
    // @ts-ignore:next-line
    .replaceAll(regExBold, `<strong>$1</strong>`)
    // @ts-ignore:next-line
    .replaceAll(regExItalic, `<em>$1</em>`)
    // @ts-ignore:next-line
    .replaceAll(regExImages, `<img src="$2" alt="$1">`)
    // @ts-ignore:next-line
    .replaceAll(regExLinks, `<a href=$2>$1</a>`)
  const html =
    `${Tag}` === `code` ? (
      // @ts-ignore:next-line
      <code>{element.innerHTML.replaceAll(regExCode, `$1`)}</code>
    ) : `${Tag}` !== `img` ? (
      `<${Tag}>${thisHtml}</${Tag}>`
    ) : (
      thisHtml
    )
  const hast: any = fromHtml(html, { fragment: true })
  const Mdast = toMdast(hast)
  const markdownRaw = !(`${Tag}` === `img` || `${Tag}` === `code`)
    ? toMarkdown(Mdast)
    : element.innerHTML
  return (
    markdownRaw
      // @ts-ignore:next-line
      .replaceAll(regExSlashedLinks, `[$1]($2)`)
  )
}
