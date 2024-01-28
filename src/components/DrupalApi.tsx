// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { useEffect } from 'react'
import {
  useLazyAPI,
  useAuthenticated,
} from '@tractstack/drupal-react-oauth-provider'

import { ApiStages, IReactChild } from '../types'
import { useDrupalStore } from '../stores/drupal'

const DrupalAPI = ({ children }: IReactChild) => {
  const isAuthenticated = useAuthenticated()
  const [lazyAPI, { loading, error, data }] = useLazyAPI()
  const apiStage = useDrupalStore((state) => state.apiStage)
  const setApiStage = useDrupalStore((state) => state.setApiStage)
  const removeDrupalQueue = useDrupalStore((state) => state.removeDrupalQueue)
  const setDrupalResponse = useDrupalStore((state) => state.setDrupalResponse)
  const drupalLocked = useDrupalStore((state) => state.drupalLocked)
  const setDrupalLocked = useDrupalStore((state) => state.setDrupalLocked)
  const drupalQueue = useDrupalStore((state) => state.drupalQueue)
  const processQueue = Object.keys(drupalQueue).length

  useEffect(() => {
    if (
      [ApiStages.Booting, ApiStages.Success].includes(apiStage) &&
      isAuthenticated &&
      !loading &&
      processQueue
    )
      setApiStage(ApiStages.Open)
    if (apiStage === ApiStages.Open && processQueue) {
      if (process.env.NODE_ENV === `development`)
        console.log(`skipping API call to drupal`)
      else {
        const thisKey = Object.keys(drupalQueue)[0]
        setDrupalLocked(thisKey)
        const thisPayload = drupalQueue[thisKey]
        lazyAPI(thisPayload)
        setApiStage(ApiStages.Locked)
      }
    }
  }, [
    isAuthenticated,
    drupalQueue,
    setDrupalLocked,
    lazyAPI,
    processQueue,
    apiStage,
    setApiStage,
    loading,
  ])

  useEffect(() => {
    if (apiStage === ApiStages.Locked && loading) setApiStage(ApiStages.Loading)
    if (apiStage === ApiStages.Loading && !loading && data) {
      setDrupalResponse(drupalLocked, data)
      removeDrupalQueue(drupalLocked)
      setApiStage(ApiStages.Success)
    }
    if (error)
      setApiStage(ApiStages.Error)
  }, [
    drupalLocked,
    removeDrupalQueue,
    setDrupalResponse,
    loading,
    data,
    error,
    processQueue,
    apiStage,
    setApiStage,
  ])

  return children
}

export default DrupalAPI
