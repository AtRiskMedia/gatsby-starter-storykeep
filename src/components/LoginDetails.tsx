// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'

import { useDrupalStore } from '../stores/drupal'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { config } from '../../data/SiteConfig'
import { Stages } from '../types'

const LoginDetails = () => {
  const [isSSR, setIsSSR] = useState(true)
  const openDemo = config.openDemo
  const stage = useDrupalStore((state) => state.stage)
  // const setStage = useDrupalStore((state) => state.setStage)
  // import { useDrupalSource } from '../hooks/use-drupal-source'
  // useDrupalSource().then(() => {
  //  setStage(Stages.SourceLoaded)
  // })

  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) setIsSSR(false)
  }, [isSSR])

  if (isSSR) return null

  return (
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
              {openDemo ? <span className="line-through">your</span> : `your`}
              {` `}
              story keep
            </h2>
            {openDemo ? (
              <p className="mt-6 leading-6 max-w-sm">
                This is an open sandbox for tractstack dot com. Have fun!
                {` `}
                <span className="text-mydarkgrey">
                  (Don&apos;t worry, your changes won&apos;t actually be saved.)
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
  )
}

export default LoginDetails
