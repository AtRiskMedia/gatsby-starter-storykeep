import { useDrupalStore } from '../stores/drupal'

export const useDrupalCollections = async () => {
  const updateCollections = useDrupalStore((state) => state.updateCollections)
  const setCollectionsLoaded = useDrupalStore(
    (state) => state.setCollectionsLoaded,
  )
  const setCollectionsLoading = useDrupalStore(
    (state) => state.setCollectionsLoading,
  )
  const collectionsLoading = useDrupalStore((state) => state.collectionsLoading)
  if (!collectionsLoading) setCollectionsLoading(true)
  else return null

  const apiBase = process.env.DRUPAL_APIBASE
  const baseURL = process.env.DRUPAL_URL
  if (typeof window === `undefined`) return null
  const thisURL = `${baseURL}/${apiBase}`
  const response = await fetch(thisURL)
  if (response.status === 200) {
    const data = await response.json()
    if (data?.links) updateCollections(data.links)
    setCollectionsLoaded(true)
    return true
  } else return false
}
