// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import Layout from '../components/Layout'
import ConciergeApi from '../components/ConciergeApi'
import StoryKeep from '../components/StoryKeep'
import DrupalApi from '../components/DrupalApi'
import { Stages } from '../types'
import '../styles/default.css'

const StoryKeepPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const validToken = useAuthStore((state) => state.validToken)

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
    if (
      process.env.NODE_ENV === `production` &&
      !validToken &&
      stage === Stages.Activated
    )
      setStage(Stages.Initialize)
    if (stage < Stages.Initialize) navigate(`/login`)
  }, [isSSR, stage, validToken, setStage])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <ConciergeApi>
          <Layout current="storykeep">
            <StoryKeep />
          </Layout>
        </ConciergeApi>
      </DrupalApi>
    </DrupalProvider>
  )
}

export default StoryKeepPage
