// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import { getTokens } from '../api/axiosClient'
import { useDrupalCollections } from '../hooks/use-drupal-collections'
import { useDrupalSource } from '../hooks/use-drupal-source'
import Login from '../components/Login'
import DrupalApi from '../components/DrupalApi'
import Initialize from '../components/Initialize'
import { Stages } from '../types'

const LoginPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const login = useAuthStore((state) => state.login)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const setOauthDrupalUuid = useDrupalStore((state) => state.setOauthDrupalUuid)
  const setOauthDrupalRoles = useDrupalStore(
    (state) => state.setOauthDrupalRoles,
  )
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)
  const updateCollections = useDrupalStore((state) => state.updateCollections)
  const apiBase = process.env.DRUPAL_APIBASE
  const baseURL = process.env.DRUPAL_URL
  const thisURL = `${baseURL}/${apiBase}`

  // UuidConfirm
  useEffect(() => {
    if (!openDemoEnabled && stage === Stages.UuidConfirm) {
      setStage(Stages.UuidConfirming)
      const payload = {
        endpoint: `uuid/`,
        method: `GET`,
      }
      setDrupalQueue(`uuid`, payload)
    } else if (
      !openDemoEnabled &&
      stage === Stages.UuidConfirming &&
      drupalResponse?.uuid
    ) {
      const data = drupalResponse.uuid
      if (data && Object.keys(data).length) {
        const oauthDrupaUuid = data[0].uuid
        const oauthDrupalRoles = data[0].roles_target_id
        setOauthDrupalUuid(oauthDrupaUuid)
        setOauthDrupalRoles(oauthDrupalRoles)
        removeDrupalResponse(`uuid`)
        setStage(Stages.UuidConfirmed)
      }
    }
  }, [
    stage,
    setStage,
    openDemoEnabled,
    setDrupalQueue,
    drupalResponse,
    removeDrupalResponse,
    setOauthDrupalRoles,
    setOauthDrupalUuid,
  ])
  useEffect(() => {
    const authInLocalStorage =
      typeof window !== `undefined` &&
      localStorage.getItem(`token`) !== null &&
      localStorage.getItem(`oauthSettings`) !== null
    if (authInLocalStorage) setStage(Stages.Authenticated)
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
  }, [isSSR, setStage])

  // load collections
  useDrupalCollections().then((e) => {
    if (e && stage === Stages.CollectionsLoad)
      setStage(Stages.CollectionsLoaded)
  })
  // load source
  useDrupalSource().then((e) => {
    if (e && stage === Stages.SourceLoad) setStage(Stages.SourceLoaded)
  })

  // initialize (connect to concierge)
  useEffect(() => {
    if (isLoggedIn && stage === Stages.Initializing)
      setStage(Stages.Initialized)
  }, [isLoggedIn, setStage, stage])

  // handle stages
  useEffect(() => {
    console.log(`stage: ${Stages[stage]}`)
    switch (stage) {
      case Stages.Authenticated:
        if (process.env.NODE_ENV === `development` || openDemoEnabled)
          setStage(Stages.UuidConfirmed)
        else setStage(Stages.UuidConfirm)
        break

      case Stages.UuidConfirmed:
        setStage(Stages.CollectionsLoad)
        break

      case Stages.CollectionsLoaded:
        setStage(Stages.SourceLoad)
        break

      case Stages.SourceLoaded:
        setStage(Stages.Initialize)
        break

      case Stages.Initialize:
        if (process.env.NODE_ENV === `development`) setStage(Stages.Activated)
        else {
          setStage(Stages.Initializing)
          getTokens(`builder`).then((res) => login(res))
        }
        break

      case Stages.Initialized:
        setStage(Stages.Activated)
        navigate(`/`)
        break
    }
  }, [login, thisURL, updateCollections, stage, setStage, openDemoEnabled])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        {stage < Stages.Authenticated ? <Login /> : <Initialize />}
      </DrupalApi>
    </DrupalProvider>
  )
}

export default LoginPage
