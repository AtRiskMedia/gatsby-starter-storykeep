// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import Logout from '../components/Logout'
import '../styles/default.css'

const LogoutPage = () => {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
  }, [isSSR])

  if (isSSR) return null

  return (
    <Layout current="logout">
      <Logout />
    </Layout>
  )
}

export default LogoutPage
