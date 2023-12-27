// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'

import { useDrupalStore } from '../stores/drupal'
import { navigate } from 'gatsby'
import Layout from '../components/Layout'
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

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
    if (stage !== Stages.Activated) navigate(`/login`)
  }, [isSSR, stage])

  if (isSSR) return null

  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <Layout current="storykeep">
          <StoryKeep />
        </Layout>
      </DrupalApi>
    </DrupalProvider>
  )
}

export default StoryKeepPage
