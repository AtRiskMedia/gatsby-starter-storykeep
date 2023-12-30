// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { useEffect, useState } from 'react'
import {
  useLazyAPI,
  useAuthenticated,
} from '@tractstack/drupal-react-oauth-provider'

import { IReactChild } from 'src/types'
import { useDrupalStore } from '../stores/drupal'

const DrupalAPI = ({ children }: IReactChild) => {
  const isAuthenticated = useAuthenticated()
  const [lazyAPI, { loading, error, data }] = useLazyAPI()
  const [failed, setFailed] = useState(false)
  const removeDrupalQueue = useDrupalStore((state) => state.removeDrupalQueue)
  const setDrupalResponse = useDrupalStore((state) => state.setDrupalResponse)
  const drupalQueue = useDrupalStore((state) => state.drupalQueue)
  const drupalLocked = useDrupalStore((state) => state.drupalLocked)
  const drupalSoftLock = useDrupalStore((state) => state.drupalSoftLock)
  const setDrupalLocked = useDrupalStore((state) => state.setDrupalLocked)
  const setDrupalSoftLock = useDrupalStore((state) => state.setDrupalSoftLock)
  const processQueue = Object.keys(drupalQueue).length

  useEffect(() => {
    if (
      isAuthenticated &&
      !loading &&
      !failed &&
      !drupalSoftLock &&
      drupalLocked === `` &&
      processQueue
    ) {
      const thisKey = Object.keys(drupalQueue)[0]
      setDrupalLocked(thisKey)
      const thisPayload = drupalQueue[thisKey]
      if (process.env.NODE_ENV === `development`)
        console.log(`skipping API call to drupal`, thisPayload)
      else lazyAPI(thisPayload)
      setTimeout(() => setDrupalSoftLock(true), 0)
    }
    if (data && drupalLocked !== `` && drupalSoftLock && !loading) {
      setDrupalResponse(drupalLocked, data)
      removeDrupalQueue(drupalLocked)
      setTimeout(() => setDrupalSoftLock(false), 0)
      setDrupalLocked(``)
    }
    if (drupalLocked && error && !failed) {
      setFailed(true)
      console.log(`error in api call to drupal`, error)
    }
  }, [
    isAuthenticated,
    drupalQueue,
    removeDrupalQueue,
    setDrupalResponse,
    setDrupalLocked,
    setDrupalSoftLock,
    drupalLocked,
    drupalSoftLock,
    loading,
    data,
    error,
    lazyAPI,
    failed,
    processQueue,
  ])

  return children
}

export default DrupalAPI
