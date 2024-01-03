// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import Layout from '../components/Layout'
import ConciergeApi from '../components/ConciergeApi'
import Dashboard from '../components/Dashboard'
import { Stages } from '../types'
import '../styles/default.css'

const DashboardPage = () => {
  const [isSSR, setIsSSR] = useState(true)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const validToken = useAuthStore((state) => state.validToken)

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
    if (process.env.NODE_ENV === `production` && !validToken)
      setStage(Stages.Initialize)
    if (stage < Stages.Initialize) navigate(`/login`)
  }, [isSSR, stage, validToken, setStage])

  if (isSSR) return null

  return (
    <ConciergeApi>
      <Layout current="dashboard">
        <Dashboard />
      </Layout>
    </ConciergeApi>
  )
}

export default DashboardPage
