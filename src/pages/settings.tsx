// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import Layout from '../components/Layout'
import ConciergeApi from '../components/ConciergeApi'
import Settings from '../components/Settings'
import { Stages } from '../types'
import '../styles/default.css'

const SettingsPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const validToken = useAuthStore((state) => state.validToken)

  // SSR + Concierge API check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
    if (
      process.env.NODE_ENV === `production` &&
      !validToken &&
      stage === Stages.Activated
    )
      setStage(Stages.Initialize)
    if (stage < Stages.Initialize) navigate(`/login`, { replace: true })
  }, [isSSR, stage, validToken, setStage])

  if (isSSR) return null

  return (
    <ConciergeApi>
      <Layout current="settings">
        <Settings />
      </Layout>
    </ConciergeApi>
  )
}

export default SettingsPage
