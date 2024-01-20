// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { useLazyLogin } from '@tractstack/drupal-react-oauth-provider'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

import { useDrupalStore } from '../stores/drupal'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { config } from '../../data/SiteConfig'
import { Stages } from '../types'

const Login = () => {
  const [isSSR, setIsSSR] = useState(true)
  const openDemo = config.openDemo
  const [login, { loading, error, data }] = useLazyLogin()
  const [oauthUsername, setOauthUsername] = useState(openDemo ? `demo` : ``)
  const [oauthPassword, setOauthPassword] = useState(
    openDemo ? `tractstack` : ``,
  )
  const [failed, setFailed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const setOpenDemoEnabled = useDrupalStore((state) => state.setOpenDemoEnabled)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setFailed(false)
    setSubmitted(true)
    if (oauthUsername && oauthPassword) {
      setStage(Stages.Authenticate)
    }
  }

  useEffect(() => {
    if (
      openDemo &&
      stage === Stages.Authenticate &&
      oauthUsername === `demo` &&
      oauthPassword === `tractstack`
    ) {
      setStage(Stages.Authenticated)
      setOpenDemoEnabled(true)
    } else if (
      !failed &&
      stage === Stages.Authenticate &&
      process.env.NODE_ENV === `development`
    ) {
      alert(`Credential Login disabled in dev mode; use demo account`)
    } else {
      if (
        !failed &&
        stage === Stages.Authenticate &&
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
        setStage(Stages.Authenticating)
        login(settings)
      }
      if (
        data?.access_token &&
        data?.refresh_token &&
        stage === Stages.Authenticating
      ) {
        setStage(Stages.Authenticated)
      } else if (error && !failed && stage === Stages.Authenticating) {
        setFailed(true)
        setStage(Stages.Booting)
      }
    }
  }, [
    data,
    setStage,
    stage,
    data?.access_token,
    data?.refresh_token,
    error,
    failed,
    loading,
    login,
    oauthPassword,
    oauthUsername,
    openDemo,
    setOpenDemoEnabled,
  ])

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
  }, [isSSR])

  if (isSSR) return null

  return (
    <>
      {stage > Stages.Booting ? (
        <div className="flex items-center justify-center h-full py-24 px-12 bg-mydarkgrey/80">
          <div className="space-y-12 bg-mywhite/95 rounded-xl p-12">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-black/10 pb-12 md:grid-cols-3 items-center">
              <div className="mr-6">
                <div className="flex flex-col w-fit mb-8">
                  <Logo className="h-8 mb-2" />
                  <Wordmark className="h-6 fill-black" />
                </div>

                <h2 className="text-xl font-main font-bold text-myblue">
                  welcome to{` `}
                  {openDemo ? (
                    <span className="line-through">your</span>
                  ) : (
                    `your`
                  )}
                  {` `}
                  story keep
                </h2>
                {openDemo ? (
                  <p className="mt-6 leading-6 max-w-sm">
                    This is an open sandbox for tractstack dot com. Have fun!
                    {` `}
                    <span className="text-mydarkgrey">
                      (Don&apos;t worry, your changes won&apos;t actually be
                      saved.)
                    </span>
                  </p>
                ) : null}
              </div>

              <div className="max-w-2xl space-y-3 text-xl text-mydarkgrey col-span-2">
                <p>
                  {stage >= Stages.Authenticated ? (
                    <CheckIcon className="w-4 h-4 inline" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 inline" />
                  )}
                  {` `}
                  Authenticating
                </p>
                <p>
                  {stage >= Stages.UuidConfirmed ? (
                    <CheckIcon className="w-4 h-4 inline" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 inline" />
                  )}
                  {` `}
                  Synchronizing to Drupal
                </p>
                <p>
                  {stage >= Stages.CollectionsLoaded ? (
                    <CheckIcon className="w-4 h-4 inline" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 inline" />
                  )}
                  {` `}
                  Loading Collections
                </p>
                <p>
                  {stage >= Stages.SourceLoaded ? (
                    <CheckIcon className="w-4 h-4 inline" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 inline" />
                  )}
                  {` `}
                  Loading Nodes
                </p>
                <p>
                  {stage >= Stages.Initialized ? (
                    <CheckIcon className="w-4 h-4 inline" />
                  ) : (
                    <XMarkIcon className="w-4 h-4 inline" />
                  )}
                  {` `}
                  Activating Session
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center h-full py-24 px-12 bg-slate-200">
          <form id="login" onSubmit={handleSubmit} method="POST">
            <div className="space-y-12 bg-white rounded-xl p-12 shadow-xl">
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-black/10 pb-12 md:grid-cols-3 items-center">
                <div className="mr-6">
                  <div className="flex flex-col w-fit mb-8">
                    <Logo className="h-8 mb-2" />
                    <Wordmark className="h-6 fill-black" />
                  </div>

                  <h2 className="text-xl font-main font-bold text-myblue">
                    welcome to{` `}
                    {openDemo ? (
                      <span className="line-through">your</span>
                    ) : (
                      `your`
                    )}
                    {` `}
                    story keep
                  </h2>
                  {openDemo ? (
                    <p className="mt-6 leading-6 max-w-sm">
                      This is an open sandbox for tractstack dot com. Have fun!
                      {` `}
                      <span className="text-mydarkgrey">
                        (Don&apos;t worry, your changes won&apos;t actually be
                        saved.)
                      </span>
                    </p>
                  ) : null}
                </div>

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6 md:col-span-2">
                  <div className="xs:col-span-4">
                    <div className="inline-flex">
                      <label
                        htmlFor="username"
                        className="block text-sm leading-6 text-black"
                      >
                        User name
                      </label>
                      {` `}
                      {openDemo ? (
                        <span className="mx-2">(use: demo)</span>
                      ) : null}
                      {submitted && oauthUsername === `` ? (
                        <span className="ml-5 text-myorange text-xs font-action">
                          * required
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen xs:max-w-md">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-mygreen xs:text-sm xs:leading-6"
                          onChange={(e) => setOauthUsername(e.target.value)}
                          value={oauthUsername}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="xs:col-span-4">
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
                        className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-mylightgrey focus:ring-2 focus:ring-inset focus:ring-mygreen xs:text-sm xs:leading-6"
                        onChange={(e) => setOauthPassword(e.target.value)}
                        value={oauthPassword}
                      />
                    </div>
                  </div>
                  {failed ? (
                    <div className="xs:col-span-4">
                      Those credentials were not accepted.
                    </div>
                  ) : null}

                  <div className="xs:col-span-4">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                    >
                      enter story keep
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default Login
