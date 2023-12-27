import { useState } from 'react'
import { useDrupalStore } from '../stores/drupal'
import { Stages } from '../types'

export const useDrupalCollections = async () => {
  const [locked, setLocked] = useState(false)
  const stage = useDrupalStore((state) => state.stage)
  const updateCollections = useDrupalStore((state) => state.updateCollections)
  const apiBase = process.env.DRUPAL_APIBASE
  const baseURL = process.env.DRUPAL_URL
  const thisURL = `${baseURL}${apiBase}`

  if (stage === Stages.CollectionsLoad && !locked) {
    setLocked(true)
    const response = await fetch(thisURL)
    if (response.status === 200) {
      const data = await response.json()
      if (data?.links) updateCollections(data.links)
      return true
    }
    return false
  }
  return null
}
