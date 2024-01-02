// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import { navigate } from 'gatsby'
import Layout from '../components/Layout'
import Backups from '../components/Backups'
import { Stages } from '../types'
import '../styles/default.css'

const BackupsPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
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
      <Layout current="backups">
        <Backups />
      </Layout>
    </DrupalProvider>
  )
}

export default BackupsPage
