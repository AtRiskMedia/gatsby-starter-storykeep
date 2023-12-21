// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import {
  useLazyLogin,
  useLazyLogout,
  useAuthenticated,
} from '@tractstack/drupal-react-oauth-provider'

import { IReactChild } from 'src/types'
import { useDrupalStore } from '../stores/drupal'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { config } from '../../data/SiteConfig'

const DrupalAuth = ({ children }: IReactChild) => {
  const openDemo = config.openDemo
  const [login, { loading, error, data }] = useLazyLogin()
  const [logout] = useLazyLogout()
  const [oauthUsername, setOauthUsername] = useState(openDemo ? `demo` : ``)
  const [oauthPassword, setOauthPassword] = useState(
    openDemo ? `tractstack` : ``,
  )
  const isAuthenticated = useAuthenticated()
  const [failed, setFailed] = useState(false)
  const [locked, setLocked] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setOpenDemoEnabled = useDrupalStore((state) => state.setOpenDemoEnabled)
  const oauthAuthenticate = useDrupalStore((state) => state.oauthAuthenticate)
  const oauthAuthenticated = useDrupalStore((state) => state.oauthAuthenticated)
  const setOauthAuthenticate = useDrupalStore(
    (state) => state.setOauthAuthenticate,
  )
  const setOauthAuthenticated = useDrupalStore(
    (state) => state.setOauthAuthenticated,
  )
  const authInLocalStorage =
    localStorage.getItem(`token`) !== null &&
    localStorage.getItem(`oauthSettings`) !== null
  const tokenOnlyInLocalStorage =
    (localStorage.getItem(`token`) !== null &&
      localStorage.getItem(`oauthSettings`) === null) ||
    (localStorage.getItem(`token`) === null &&
      localStorage.getItem(`oauthSettings`) !== null)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setFailed(false)
    setSubmitted(true)
    if (oauthUsername && oauthPassword) setOauthAuthenticate(true)
  }

  useEffect(() => {
    if (
      openDemo &&
      oauthAuthenticate &&
      oauthUsername === `demo` &&
      oauthPassword === `tractstack`
    ) {
      setLocked(false)
      setOauthAuthenticated(true)
      setOauthAuthenticate(false)
      setOpenDemoEnabled(true)
    } else {
      if (
        !failed &&
        !loading &&
        !locked &&
        oauthAuthenticate &&
        process.env.NODE_ENV !== `development`
      ) {
        const settings = {
          username: oauthUsername,
          password: oauthPassword,
          client_id: process.env.DRUPAL_OAUTH_CLIENT_ID || ``,
          client_secret: process.env.DRUPAL_OAUTH_CLIENT_SECRET || ``,
          grant_type: process.env.DRUPAL_OAUTH_GRANT_TYPE || ``,
          scope: process.env.DRUPAL_OAUTH_SCOPE || ``,
        }
        setLocked(true)
        login(settings)
      }
      if (data?.access_token && data?.refresh_token && locked) {
        setLocked(false)
        setOauthAuthenticated(true)
        setOauthAuthenticate(false)
      }
      if (error && !failed && locked) {
        setFailed(true)
        setLocked(false)
        setOauthAuthenticate(false)
      }
    }
  }, [
    openDemo,
    setOpenDemoEnabled,
    authInLocalStorage,
    tokenOnlyInLocalStorage,
    oauthAuthenticate,
    oauthAuthenticated,
    setOauthAuthenticate,
    setOauthAuthenticated,
    oauthUsername,
    oauthPassword,
    login,
    error,
    loading,
    data,
    failed,
    logout,
    locked,
    isAuthenticated,
  ])

  if (authInLocalStorage || isAuthenticated || openDemoEnabled) return children
  return (
    <div className="flex items-center justify-center h-full py-24 px-12 bg-mydarkgrey/80">
      <form id="login" onSubmit={handleSubmit} method="POST">
        <div className="space-y-12 bg-mywhite/95 rounded-xl p-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-black/10 pb-12 md:grid-cols-3 items-center">
            <div className="mr-6">
              <div className="flex flex-col w-fit mb-8">
                <Logo className="h-8 mb-2" />
                <Wordmark className="h-6 fill-black" />
              </div>

              <h2 className="text-xl font-main font-bold text-myblue">
                welcome to{` `}
                {openDemo ? <span className="line-through">your</span> : `your`}
                {` `}
                story keep
              </h2>
              {openDemo ? (
                <p className="mt-6 leading-6 max-w-sm">
                  This is an open sandbox for tractstack dot com. Have fun!{` `}
                  <span className="text-mydarkgrey">
                    (Don&apos;t worry, your changes won&apos;t actually be
                    saved.)
                  </span>
                </p>
              ) : null}
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-4">
                <div className="inline-flex">
                  <label
                    htmlFor="username"
                    className="block text-sm leading-6 text-black"
                  >
                    User name
                  </label>
                  {` `}
                  {openDemo ? <span className="mx-2">(use: demo)</span> : null}
                  {submitted && oauthUsername === `` ? (
                    <span className="ml-5 text-myorange text-xs font-action">
                      * required
                    </span>
                  ) : null}
                </div>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-mygreen sm:text-sm sm:leading-6"
                      onChange={(e) => setOauthUsername(e.target.value)}
                      value={oauthUsername}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-4">
                <div className="inline-flex">
                  <label
                    htmlFor="password"
                    className="block text-sm leading-6 text-black"
                  >
                    Password
                  </label>
                  {` `}
                  {openDemo ? (
                    <span className="mx-2">(use: tractstack)</span>
                  ) : null}
                  {submitted && oauthPassword === `` ? (
                    <span className="ml-5 text-myorange text-xs font-action">
                      * required
                    </span>
                  ) : null}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-mygreen sm:text-sm sm:leading-6"
                    onChange={(e) => setOauthPassword(e.target.value)}
                    value={oauthPassword}
                  />
                </div>
              </div>
              {failed ? (
                <div className="sm:col-span-4">
                  Those credentials were not accepted.
                </div>
              ) : null}

              <div className="sm:col-span-4">
                <button
                  type="submit"
                  className="font-action rounded-md bg-black px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-mygreen hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
                >
                  enter story keep
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default DrupalAuth
