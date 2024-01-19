// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'
import '../styles/default.css'
import { postPublish } from '../api/services'

const Publish = () => {
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publish, setPublish] = useState(false)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)

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
    setSaved(false)
    setPublish(true)
  }

  useEffect(() => {
    if (publish && !publishing && !saved) {
      setPublishing(true)
      postPublish({ payload: { whitelist: whitelistArrayUnique } })
      setSaved(true)
    }
    if (saved && publish && publishing) {
      setPublish(false)
      setPublishing(false)
    }
  }, [saved, publishing, publish])

  if (openDemoEnabled) return <DemoProhibited />
  return (
    <>
      <section>
        <div className="w-full xl:max-w-screen-2xl">
          <div className="bg-white px-4 py-4 shadow xs:rounded-md xs:px-6">
            <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
              <h3 className="text-base font-action leading-6 text-black">
                Re-Publish your Website
              </h3>
              <button
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
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
                  <div className="text-xl text-myorange pb-12">
                    <p>Site rebuild has been queued.</p>
                  </div>
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
  )
}

export default Publish
