// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import Layout from '../components/Layout'
import Dashboard from '../components/Dashboard'
import { Stages } from '../types'
import '../styles/default.css'

const DashboardPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const validToken = useAuthStore((state) => state.validToken)

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
    if (process.env.NODE_ENV === `production` && !validToken)
      setStage(Stages.Booting)
    if (stage !== Stages.Activated) navigate(`/login`)
  }, [isSSR, stage, validToken, setStage])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <Layout current="dashboard" openDemo={openDemoEnabled}>
        <Dashboard />
      </Layout>
    </DrupalProvider>
  )
}

export default DashboardPage
