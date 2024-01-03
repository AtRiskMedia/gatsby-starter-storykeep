// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import {
  DrupalProvider,
  useLazyLogout,
} from '@tractstack/drupal-react-oauth-provider'
import DrupalApi from '../components/DrupalApi'
import { Stages } from '../types'

import { useDrupalStore } from '../stores/drupal'

const Logout = () => {
  const [logout] = useLazyLogout()
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setOpenDemoEnabled = useDrupalStore((state) => state.setOpenDemoEnabled)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  console.log(logout, drupalConfig)
  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        <section>
          {stage !== Stages.Booting ? (
            <button
              className="font-action rounded-md bg-black px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-mygreen hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
              onClick={() => {
                setStage(Stages.Booting)
                if (openDemoEnabled) setOpenDemoEnabled(false)
                else logout()
              }}
            >
              Logout
            </button>
          ) : (
            <div>You have been logged out.</div>
          )}
        </section>
      </DrupalApi>
    </DrupalProvider>
  )
}

export default Logout
