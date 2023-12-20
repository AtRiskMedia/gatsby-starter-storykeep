// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'

import Layout from '../components/Layout'
import RunTime from '../components/RunTime'
import Backups from '../components/Backups'
import DrupalAuth from '../components/DrupalAuth'
import DrupalUuid from '../components/DrupalUuid'
import StoryKeepPayload from '../components/StoryKeepPayload'
import StoryKeepWrapper from '../components/StoryKeepWrapper'
import '../styles/default.css'

// import Seo from '../components/Seo'

const BackupsPage = () => {
  const config = {
    url: process.env.DRUPAL_URL || ``,
  }
  return (
    <RunTime>
      <DrupalProvider config={config}>
        <DrupalAuth>
          <DrupalUuid>
            <StoryKeepWrapper>
              <StoryKeepPayload>
                <Layout current="backups">
                  <Backups />
                </Layout>
              </StoryKeepPayload>
            </StoryKeepWrapper>
          </DrupalUuid>
        </DrupalAuth>
      </DrupalProvider>
    </RunTime>
  )
}

// export const Head = () => <Seo />

export default BackupsPage
