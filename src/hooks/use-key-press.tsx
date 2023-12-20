import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

export const useKeyPress = (keys: any, callback: Function, node = null) => {
  const callbackRef = useRef(callback)
  useLayoutEffect(() => {
    callbackRef.current = callback
  })
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (keys.some((key: any) => event.key === key)) {
        callbackRef.current(event)
      }
    },
    [keys],
  )
  useEffect(() => {
    const targetNode = node ?? document
    targetNode && targetNode.addEventListener(`keydown`, handleKeyPress)
    return () =>
      targetNode && targetNode.removeEventListener(`keydown`, handleKeyPress)
  }, [handleKeyPress, node])
}
