// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect, useCallback, MouseEvent } from 'react'

import { useAuthStore } from '../stores/authStore'
import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'
import '../styles/default.css'
import { postPublish } from '../api/services'
import { config } from '../../data/SiteConfig'

const Publish = () => {
  const [maxAttempts, setMaxAttempts] = useState<undefined | boolean>(undefined)
  const [target, setTarget] = useState(`tailwind`)
  const [publishing, setPublishing] = useState(false)
  const [publish, setPublish] = useState(false)
  const [saved, setSaved] = useState(false)
  const [payload, setPayload] = useState<any>({})
  const [locked, setLocked] = useState(false)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())

  let whitelistString = ``
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
  const whitelistArrayUnique = whitelistArray
    .filter((item, index) => whitelistArray.indexOf(item) === index)
    .filter((e) => e)

  const handleClick = () => {
    setSaved(false)
    setPublish(true)
  }

  const goPostPublish = useCallback(async () => {
    try {
      const response = await postPublish({
        payload: { whitelist: whitelistArrayUnique, target },
      })
      const data = response?.data
      if (data) {
        return { data, error: null }
      }
      return { data: null, error: true }
    } catch (error: any) {
      return {
        error: error?.response?.data?.message || error?.message,
        data: null,
      }
    }
  }, [whitelistArrayUnique, target])

  useEffect(() => {
    if (publish && isLoggedIn && !publishing && !saved) {
      setPublishing(true)
    }
  }, [isLoggedIn, saved, publishing, publish, goPostPublish])

  useEffect(() => {
    if (!locked && publishing && !maxAttempts) {
      if (typeof maxAttempts === `undefined`) setMaxAttempts(false)
      if (typeof maxAttempts === `boolean` && !maxAttempts) setMaxAttempts(true)
      setLocked(true)
      goPostPublish().then((res: any) => {
        if (res?.error) {
          setPublishing(false)
          if (!maxAttempts) setLocked(false)
        } else if (res?.data && res.data?.data) {
          const newPayload = JSON.parse(res.data.data)
          setPayload(newPayload)
          setSaved(true)
          setPublish(false)
          setPublishing(false)
          setLocked(false)
          setMaxAttempts(undefined)
        }
      })
    }
  }, [maxAttempts, locked, publishing, goPostPublish])

  useEffect(() => {
    if (saved) {
      setTimeout(() => setSaved(false), config.messageDelay)
    }
  }, [saved, setSaved])

  if (openDemoEnabled) return <DemoProhibited />
  return (
    <section className="w-full xl:max-w-screen-2xl">
      <div className="bg-white px-4 py-4 shadow xs:rounded-md xs:px-6">
        <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
          <h3 className="text-base font-action leading-6 text-black">
            Re-Publish your Website
          </h3>
          <div className="flex flex-nowrap space-x-3">
            <div className="flex justify-center items-center">
              <button
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                onClick={() => handleClick()}
              >
                Trigger Re-Publish
              </button>
            </div>
            <div>
              <label
                htmlFor="target"
                className="block text-sm leading-6 text-mydarkgrey"
              >
                Build Target
              </label>
              <select
                id="target"
                name="target"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-mydarkgrey ring-1 ring-inset ring-mylightgrey focus:ring-2 focus:ring-mygreen sm:text-sm sm:leading-6"
                defaultValue="front"
                onClick={(e: MouseEvent) => {
                  setTarget((e.target as HTMLInputElement).value)
                }}
              >
                <option>tailwind</option>
                <option>front</option>
                <option>back</option>
                <option>all</option>
              </select>
            </div>
          </div>
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
                {payload.build ? (
                  <p>Site rebuild has been queued.</p>
                ) : payload.locked ? (
                  <p>Site rebuild has already been queued.</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Publish
