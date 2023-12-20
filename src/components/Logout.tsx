// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { navigate } from 'gatsby'
import {
  useLazyLogout,
  useAuthenticated,
} from '@tractstack/drupal-react-oauth-provider'

import { useDrupalStore } from '../stores/drupal'

const Logout = () => {
  const [logout] = useLazyLogout()
  const isAuthenticated = useAuthenticated()
  const setOauthAuthenticated = useDrupalStore(
    (state) => state.setOauthAuthenticated,
  )
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setOpenDemoEnabled = useDrupalStore((state) => state.setOpenDemoEnabled)

  return (
    <section>
      {isAuthenticated || openDemoEnabled ? (
        <button
          className="font-action rounded-md bg-black px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-mygreen hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
          onClick={() => {
            if (openDemoEnabled) {
              setOauthAuthenticated(false)
              setOpenDemoEnabled(false)
              navigate(`/`, { replace: true })
            } else {
              logout()
              navigate(`/`, { replace: true })
            }
          }}
        >
          Logout
        </button>
      ) : (
        <div>You have been logged out.</div>
      )}
    </section>
  )
}

export default Logout
