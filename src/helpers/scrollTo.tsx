export function scrollTo() {
  const preview =
    typeof window !== `undefined`
      ? document.getElementById(`PanePreview`)
      : null
  preview?.scrollIntoView({ behavior: `smooth` })
}
