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
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const [settingsData, setSettingsData] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
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
    goPostSettings()
    console.log(`submitted`, settingsData)
  }

  useEffect(() => {
    if (
      isLoggedIn &&
      settingsData &&
      Object.keys(settingsData).length === 0 &&
      !loading &&
      !loaded
    ) {
      setLoading(true)
      goGetSettings()
        .then((res: any) => {
          setSettingsData({
            ...res?.data?.frontend,
            ...res?.data?.storykeep,
            OPENDEMO: res?.data?.storykeep?.OPENDEMO === `1`,
          })
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => setLoaded(true))
      setLoading(false)
    }
  }, [
    isLoggedIn,
    settingsData,
    setSettingsData,
    loaded,
    loading,
    setLoaded,
    setLoading,
  ])

  if (openDemoEnabled) return <DemoProhibited />
  return (
    <>
      <section>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="space-y-6">
            <div className="border-b border-mydarkgrey/10 pb-6">
              <h2 className="text-xl font-bold leading-7 text-myblack">
                Publish Settings
              </h2>
              <p className="mt-1 text-sm leading-6 text-mydarkgrey">
                Remember to re-publish your site after changing these settings!
              </p>
            </div>

            <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
              <h2 className="text-base font-action leading-7 text-myblack">
                Front-end Experience
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                These settings impact the frontend web experience
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="SLOGAN"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Slogan
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="SLOGAN"
                        id="SLOGAN"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.SLOGAN}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <label
                    htmlFor="FOOTER"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Footer Text
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="FOOTER"
                        id="FOOTER"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.FOOTER}
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="HOMEPAGE"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Slug of Story Fragment to use as homepage
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="HOMEPAGE"
                        id="HOMEPAGE"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.HOMEPAGE}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="ACTION"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Conversion Action for Email Sign-up
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="ACTION"
                        id="ACTION"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.ACTION}
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="READ_THRESHOLD"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Read Threshold
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="READ_THRESHOLD"
                        id="READ_THRESHOLD"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="42000"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.READ_THRESHOLD}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="SOFT_READ_THRESHOLD"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    (Soft) Read Threshold
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="SOFT_READ_THRESHOLD"
                        id="SOFT_READ_THRESHOLD"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="7000"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.SOFT_READ_THRESHOLD}
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="CONCIERGE_SYNC"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Sync frequency (milliseconds)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="CONCIERGE_SYNC"
                        id="CONCIERGE_SYNC"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="45000"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.CONCIERGE_SYNC}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="CONCIERGE_FORCE_INTERVAL"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Multiplier to force immediate eventStream on page load
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="3"
                        name="CONCIERGE_FORCE_INTERVAL"
                        id="CONCIERGE_FORCE_INTERVAL"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="2"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.CONCIERGE_FORCE_INTERVAL}
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="IMPRESSIONS_DELAY"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Cycle impressions delay interval (milliseconds)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="IMPRESSIONS_DELAY"
                        id="IMPRESSIONS_DELAY"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="22000"
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.IMPRESSIONS_DELAY}
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="SOCIAL"
                    className="block text-sm leading-6 text-mydarkgrey"
                  >
                    <span className="font-bold">Social Links payload</span> |
                    must be {`[ {name:string, href:string} ]`}, only name =
                    Twitter, GitLab, GitHub supported
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-xl">
                      <textarea
                        name="SOCIAL"
                        id="SOCIAL"
                        rows={4}
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue=""
                        onChange={(e) => handleChange(e)}
                        value={settingsData?.SOCIAL}
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
                <div className="sm:col-span-full">
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
                      {` `}| Allows public safe-mode access to your story keep
                      for demo purposes
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
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
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
          <div className="border-b border-mydarkgrey-900/10 p-6 my-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-bold text-black shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100"
            >
              Save Settings
            </button>
          </div>
        </form>
      </section>
    </>
  )
}

export default Settings
