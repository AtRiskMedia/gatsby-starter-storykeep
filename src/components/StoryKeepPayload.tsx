import { useDrupalSource } from '../hooks/use-drupal-source'
import { useDrupalStore } from '../stores/drupal'
import { IReactChild } from '../types'

const StoryKeepPayload = ({ children }: IReactChild) => {
  const sourceLoaded = useDrupalStore((state) => state.sourceLoaded)
  const setSourceLoaded = useDrupalStore((state) => state.setSourceLoaded)
  useDrupalSource().finally(() => setSourceLoaded(true))
  if (!sourceLoaded) return null
  return children
}

export default StoryKeepPayload
