// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useDrupalCollections } from '../hooks/use-drupal-collections'
import { useDrupalSource } from '../hooks/use-drupal-source'
import Login from '../components/Login'
import DrupalApi from '../components/DrupalApi'
import LoginDetails from '../components/LoginDetails'
import { Stages } from '../types'

const LoginPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
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

  // UuidConfirm
  useEffect(() => {
    if (openDemoEnabled && stage === Stages.Booting) setStage(Stages.Initialize)
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
    if (authInLocalStorage && stage < Stages.Authenticated)
      setStage(Stages.Authenticated)
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
  }, [isSSR, setStage, stage])

  // load collections
  useDrupalCollections().then((e) => {
    if (e && stage === Stages.CollectionsLoad)
      setStage(Stages.CollectionsLoaded)
  })

  // load source
  useDrupalSource().then((e) => {
    if (e && stage === Stages.SourceLoad) setStage(Stages.SourceLoaded)
  })

  // handle stages
  useEffect(() => {
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

      case Stages.Activated:
        navigate(`/`)
        break
    }
  }, [stage, setStage, openDemoEnabled])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        {stage < Stages.Authenticated ? <Login /> : <LoginDetails />}
      </DrupalApi>
    </DrupalProvider>
  )
}

export default LoginPage
