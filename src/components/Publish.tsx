// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'

import { useDrupalStore } from '../stores/drupal'
import Message from './Message'
import RunTime from '../components/RunTime'
import DrupalAuth from '../components/DrupalAuth'
import DrupalAPI from '../components/DrupalApi'
import StoryKeepPayload from '../components/StoryKeepPayload'
import StoryKeepWrapper from '../components/StoryKeepWrapper'
import { DemoProhibited } from './DemoProhibited'
import '../styles/default.css'

const Publish = () => {
  const [saved, setSaved] = useState(false)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const config = {
    url: process.env.DRUPAL_URL || ``,
  }

  let whitelistString = ``
  console.log(`extracting tailwind.whitelist`)
  Object.keys(allPanes).forEach((e: any) => {
    const thisPayload = JSON.parse(allPanes[e].optionsPayload)
    thisPayload?.paneFragmentsPayload?.forEach((f: any) => {
      const payload = f?.optionsPayload
      if (payload) {
        const classNames = payload?.classNames
        const classNamesModal = payload?.classNamesModal
        const classNamesParent = payload?.classNamesParent
        const classNamesButtons = payload?.buttons
        if (classNamesButtons) {
          Object.keys(classNamesButtons).forEach((j: string) => {
            if (
              typeof classNamesButtons[j] === `object` &&
              typeof classNamesButtons[j].className === `string`
            )
              whitelistString = `${whitelistString} ${classNamesButtons[j].className}`
          })
        }
        const all = [
          { ...classNames },
          { ...classNamesParent },
          { ...classNamesModal },
        ]
        Object.keys(all).forEach((a: any) => {
          if (typeof all[a] !== `undefined`) {
            const payload = typeof all[a] === `object` ? all[a] : null
            Object.keys(payload).forEach((v: string) => {
              const value = payload[v]
              if (typeof value === `string`)
                whitelistString = `${whitelistString} ${value}`
              if (typeof value === `object`) {
                Object.keys(value).forEach((s: string) => {
                  if (typeof value[s] === `string`)
                    whitelistString = `${whitelistString} ${value[s]}`
                  if (typeof value[s] === `object`) {
                    Object.keys(value[s]).forEach((t: string) => {
                      if (typeof value[s][t] === `string`)
                        whitelistString = `${whitelistString} ${value[s][t]}`
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  })
  const whitelistArray = whitelistString.split(` `)
  const whitelistArrayUnique = whitelistArray.filter(
    (item, index) => whitelistArray.indexOf(item) === index,
  )

  const handleClick = () => {
    setSaved(true)
    console.log(`publish`, whitelistArrayUnique)
  }

  return (
    <RunTime>
      <DrupalProvider config={config}>
        <DrupalAuth>
          <DrupalAPI>
            <StoryKeepWrapper>
              <StoryKeepPayload>
                {!openDemoEnabled ? (
                  <>
                    <section>
                      <div className="w-full xl:max-w-5xl">
                        <div className="bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
                          <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
                            <h3 className="text-base font-action leading-6 text-black">
                              Re-Publish your Website
                            </h3>
                            <button
                              className="font-action rounded-md bg-black px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-mygreen hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
                              onClick={() => handleClick()}
                            >
                              Trigger Re-Publish
                            </button>
                          </div>
                          <div className="mt-4">
                            <p className="text-mydarkgrey text-xl">
                              To make your changes live, click to publish.
                            </p>
                            <div
                              id="message"
                              className="mt-6 flex items-center justify-end gap-x-6"
                            >
                              {saved ? (
                                <Message className="text-xl text-myorange pb-12">
                                  <p>Site rebuild has been queued.</p>
                                </Message>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="mt-80">
                      <div>
                        <h2>whitelist hack</h2>
                        {whitelistArrayUnique.map((e: string, idx: number) => {
                          return <p key={idx}>{e}</p>
                        })}
                      </div>
                    </section>
                  </>
                ) : (
                  <DemoProhibited />
                )}
              </StoryKeepPayload>
            </StoryKeepWrapper>
          </DrupalAPI>
        </DrupalAuth>
      </DrupalProvider>
    </RunTime>
  )
}

export default Publish
