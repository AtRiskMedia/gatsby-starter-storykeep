// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'

import Layout from '../components/Layout'
import RunTime from '../components/RunTime'
import StoryKeep from '../components/StoryKeep'
import DrupalAuth from '../components/DrupalAuth'
import DrupalAPI from '../components/DrupalApi'
import DrupalUuid from '../components/DrupalUuid'
import StoryKeepPayload from '../components/StoryKeepPayload'
import StoryKeepWrapper from '../components/StoryKeepWrapper'
import '../styles/default.css'

// import Seo from '../components/Seo'
// import { config } from '../../data/SiteConfig'

const StoryKeepPage = () => {
  const config = {
    url: process.env.DRUPAL_URL || ``,
  }
  return (
    <RunTime>
      <DrupalProvider config={config}>
        <DrupalAuth>
          <DrupalAPI>
            <DrupalUuid>
              <StoryKeepWrapper>
                <StoryKeepPayload>
                  <Layout current="storykeep">
                    <StoryKeep />
                  </Layout>
                </StoryKeepPayload>
              </StoryKeepWrapper>
            </DrupalUuid>
          </DrupalAPI>
        </DrupalAuth>
      </DrupalProvider>
    </RunTime>
  )
}

// export const Head = () => <Seo />

export default StoryKeepPage
