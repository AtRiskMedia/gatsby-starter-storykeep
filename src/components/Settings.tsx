// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react'

import { useAuthStore } from '../stores/authStore'
import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'
import { getSettings, postSettings } from '../api/services'
import { config } from '../../data/SiteConfig'

const goGetSettings = async () => {
  try {
    const response = await getSettings()
    const data = JSON.parse(response?.data?.data)
    return { data, error: null }
  } catch (error: any) {
    return {
      error: error?.message,
      data: null,
    }
  }
}

const Settings = () => {
  const [maxAttempts, setMaxAttempts] = useState<undefined | boolean>(undefined)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const [settingsData, setSettingsData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publish, setPublish] = useState(false)
  const [saved, setSaved] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())

  const goPostSettings = useCallback(async () => {
    try {
      const response = await postSettings({
        payload: { ...settingsData },
      })
      const data = response?.data
      if (data) {
        return { data, error: null }
      }
      return { data: null, error: null }
    } catch (error: any) {
      return {
        error: error?.response?.data?.message || error?.message,
        graph: null,
      }
    }
  }, [settingsData])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target as HTMLInputElement
    setSettingsData((prev: any) => {
      return { ...prev, [name]: value }
    })
  }

  const handleToggle = (name: string, value: boolean) => {
    setSettingsData((prev: any) => {
      return { ...prev, [name]: value }
    })
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaved(false)
    setPublish(true)
  }

  useEffect(() => {
    if (publish && isLoggedIn && !publishing && !saved && !maxAttempts) {
      setPublishing(true)
      goPostSettings().then((res: any) => {
        if (typeof maxAttempts === `undefined`) setMaxAttempts(false)
        if (typeof maxAttempts === `boolean` && !maxAttempts)
          setMaxAttempts(true)
        if (res?.error) {
          setPublishing(false)
        } else if (res?.data && res.data?.data) {
          setSaved(true)
          setPublish(false)
          setPublishing(false)
          setMaxAttempts(undefined)
        }
      })
    }
  }, [maxAttempts, saved, isLoggedIn, publishing, publish, goPostSettings])

  useEffect(() => {
    if (
      isLoggedIn &&
      !maxAttempts &&
      settingsData &&
      Object.keys(settingsData).length === 0 &&
      !loading &&
      !loaded
    ) {
      if (typeof maxAttempts === `undefined`) setMaxAttempts(false)
      if (typeof maxAttempts === `boolean` && !maxAttempts) setMaxAttempts(true)
      setLoading(true)
      goGetSettings()
        .then((res: any) => {
          if (!res?.error) {
            setSettingsData({
              ...res?.data?.concierge,
              ...res?.data?.frontend,
              ...res?.data?.storykeep,
              OAUTH_PUBLIC_KEY: res?.data?.oauth_public_key,
              OAUTH_PRIVATE_KEY: res?.data?.oauth_private_key,
            })
            setLoaded(true)
            setMaxAttempts(undefined)
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [
    maxAttempts,
    isLoggedIn,
    settingsData,
    setSettingsData,
    loaded,
    loading,
    setLoaded,
    setLoading,
  ])

  useEffect(() => {
    if (saved) {
      setTimeout(() => setSaved(false), config.messageDelay)
    }
  }, [saved, setSaved])

  if (openDemoEnabled) return <DemoProhibited />
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <section className="w-full xl:max-w-screen-2xl">
        <div className="bg-white px-4 py-4 shadow xs:rounded-md xs:px-6">
          <div className="border-b border-gray-200 pb-1.5 flex items-center justify-between">
            <h3 className="text-base font-action leading-6 text-black">
              Publish Settings
            </h3>
            <div className="flex flex-nowrap space-x-3">
              <div className="flex justify-center items-center">
                <button
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
                  type="submit"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-mydarkgrey text-xl">
              Remember to re-publish your site after changing these settings!
            </p>
            <div
              id="message"
              className="mt-6 flex items-center justify-end gap-x-6"
            >
              {saved ? (
                <div className="text-xl text-myorange pb-12">
                  <p>Settings Applied. Remember to re-publish the site!</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full xl:max-w-screen-2xl">
        <div className="space-y-6">
          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Front-end Experience
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings impact the frontend web experience
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-full">
                <label
                  htmlFor="PUBLIC_SLOGAN"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Slogan
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_SLOGAN"
                      id="PUBLIC_SLOGAN"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_SLOGAN}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label
                  htmlFor="PUBLIC_FOOTER"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Footer Text
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_FOOTER"
                      id="PUBLIC_FOOTER"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_FOOTER}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_HOME"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Slug of Story Fragment to use as homepage
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_HOME"
                      id="PUBLIC_HOME"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_HOME}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_READ_THRESHOLD"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Read Threshold
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="number"
                      min="1"
                      max="600000"
                      name="PUBLIC_READ_THRESHOLD"
                      id="PUBLIC_READ_THRESHOLD"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="42000"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_READ_THRESHOLD}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_SOFT_READ_THRESHOLD"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  (Soft) Read Threshold
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="number"
                      min="1"
                      max="600000"
                      name="PUBLIC_SOFT_READ_THRESHOLD"
                      id="PUBLIC_SOFT_READ_THRESHOLD"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="7000"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_SOFT_READ_THRESHOLD}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_IMPRESSIONS_DELAY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Cycle impressions delay interval (milliseconds)
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="number"
                      min="1"
                      max="600000"
                      name="PUBLIC_IMPRESSIONS_DELAY"
                      id="PUBLIC_IMPRESSIONS_DELAY"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="22000"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_IMPRESSIONS_DELAY}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-full">
                <label
                  htmlFor="PUBLIC_SOCIALS"
                  className="block text-sm leading-6 text-mydarkgrey"
                >
                  <span className="font-bold">Social Links payload</span> | must
                  be {`[ {name:string, href:string} ]`}, only name = Twitter,
                  GitLab, GitHub supported
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-xl">
                    <textarea
                      name="PUBLIC_SOCIALS"
                      id="PUBLIC_SOCIALS"
                      rows={4}
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      defaultValue=""
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_SOCIALS}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Story Keep settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings impact the backend editor experience
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-x-3">
                  <input
                    id="OPENDEMO"
                    name="OPENDEMO"
                    type="checkbox"
                    className="h-4 w-4 border-mylightgrey text-myorange focus:ring-myorange"
                    checked={settingsData?.OPENDEMO}
                    onChange={() =>
                      handleToggle(`OPENDEMO`, !settingsData?.OPENDEMO)
                    }
                  />
                  <label
                    htmlFor="OPENDEMO"
                    className="pl-2 block text-md leading-6 text-mydarkgrey"
                  >
                    <span className="font-bold">
                      Enable the &quot;Open Demo&quot; mode
                    </span>
                    {` `}| Allows public safe-mode access to your story keep for
                    demo purposes
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="MESSAGE_DELAY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Message Lifetime (milliseconds)
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="number"
                      min="1"
                      max="60000"
                      name="MESSAGE_DELAY"
                      id="MESSAGE_DELAY"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="7000"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.MESSAGE_DELAY}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </form>
  )
}

export default Settings
