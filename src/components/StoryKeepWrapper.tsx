import { useState, useEffect } from 'react'

import { IReactChild } from 'src/types'
import { useDrupalCollections } from '../hooks/use-drupal-collections'
import { useDrupalStore } from '../stores/drupal'

const StoryKeepWrapper = ({ children }: IReactChild) => {
  const collectionsLoaded = useDrupalStore((state) => state.collectionsLoaded)
  const [loaded, setLoaded] = useState(false)
  useDrupalCollections()

  useEffect(() => {
    if (collectionsLoaded) setLoaded(true)
  }, [collectionsLoaded])

  if (!loaded) return null
  return children
}

export default StoryKeepWrapper
