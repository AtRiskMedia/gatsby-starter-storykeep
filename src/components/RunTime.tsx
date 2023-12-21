import { useEffect, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

import { useAuthStore } from '../stores/authStore'
import { getTokens } from '../api/axiosClient'
import { IReactChild } from 'src/types'

const RunTime = ({ children }: IReactChild) => {
  const [init, setInit] = useState(
    !!(typeof window !== `undefined` && process.env.NODE_ENV === `development`),
  )
  const [loggingIn, setLoggingIn] = useState(false)
  const login = useAuthStore((state) => state.login)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const fingerprint = useAuthStore((state) => state.fingerprint)
  const setFingerprint = useAuthStore((state) => state.setFingerprint)

  useEffect(() => {
    if (
      !init &&
      typeof window !== `undefined` &&
      process.env.NODE_ENV !== `development`
    ) {
      setInit(true)
      const fpPromise = FingerprintJS.load()
      ;(async () => {
        const fp = await fpPromise
        const result = await fp.get()
        setFingerprint(result.visitorId)
      })()
    }
    if (
      fingerprint &&
      !loggingIn &&
      !isLoggedIn &&
      process.env.NODE_ENV !== `development`
    ) {
      setLoggingIn(true)
      getTokens(fingerprint).then((res) => login(res))
    }
  }, [init, fingerprint, setFingerprint, login, loggingIn, isLoggedIn])

  if (!init) return null
  return children
}

export default RunTime
