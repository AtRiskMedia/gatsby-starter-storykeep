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

const Account = () => {
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
      if (typeof maxAttempts === `undefined`) setMaxAttempts(false)
      if (typeof maxAttempts === `boolean` && !maxAttempts) setMaxAttempts(true)
      setPublishing(true)
      goPostSettings().then((res: any) => {
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
  }, [saved, isLoggedIn, publishing, publish, goPostSettings, maxAttempts])

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
    isLoggedIn,
    maxAttempts,
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
              Account Settings (Advanced)
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
            <p className="text-mydarkgrey text-xl">Be very careful!</p>
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
              Front-end
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the frontend web experience
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_SITE_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Site URL
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_SITE_URL"
                      id="PUBLIC_SITE_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.PUBLIC_SITE_URL}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="FRONT_ROOT"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Front-end root folder
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="FRONT_ROOT"
                      id="FRONT_ROOT"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.FRONT_ROOT}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Story Keep
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the backend editor experience
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_STORYKEEP_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Story Keep URL
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_STORYKEEP_URL"
                      id="PUBLIC_STORYKEEP_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.PUBLIC_STORYKEEP_URL}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="STORYKEEP_ROOT"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Story Keep root folder
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="STORYKEEP_ROOT"
                      id="STORYKEEP_ROOT"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.STORYKEEP_ROOT}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Concierge
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the backend service
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="WATCH_ROOT"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Build watch root folder
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="WATCH_ROOT"
                      id="WATCH_ROOT"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.WATCH_ROOT}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_CONCIERGE_BASE_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Base URL | front-end
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_CONCIERGE_BASE_URL"
                      id="PUBLIC_CONCIERGE_BASE_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.PUBLIC_CONCIERGE_BASE_URL}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_CONCIERGE_REFRESH_TOKEN_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Refresh Token URL | front-end
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_CONCIERGE_REFRESH_TOKEN_URL"
                      id="PUBLIC_CONCIERGE_REFRESH_TOKEN_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.PUBLIC_CONCIERGE_REFRESH_TOKEN_URL}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="CONCIERGE_BASE_URL_BACK"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Base URL | Story Keep
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="CONCIERGE_BASE_URL_BACK"
                      id="CONCIERGE_BASE_URL_BACK"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.CONCIERGE_BASE_URL_BACK}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="CONCIERGE_REFRESH_TOKEN_URL_BACK"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Refresh Token URL | backend
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="CONCIERGE_REFRESH_TOKEN_URL_BACK"
                      id="CONCIERGE_REFRESH_TOKEN_URL_BACK"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.CONCIERGE_REFRESH_TOKEN_URL_BACK}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="SECRET_KEY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Secret for Frontend
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="SECRET_KEY"
                      id="SECRET_KEY"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.SECRET_KEY}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="BUILDER_SECRET_KEY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge Secret for Story Keep backend
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="BUILDER_SECRET_KEY"
                      id="BUILDER_SECRET_KEY"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.BUILDER_SECRET_KEY}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="CONCIERGE_ROOT"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Concierge root folder
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="CONCIERGE_ROOT"
                      id="CONCIERGE_ROOT"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.CONCIERGE_ROOT}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Shopify
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the Shopify integration
            </p>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="shopifyStoreUrl"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Shopify Store Url
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="shopifyStoreUrl"
                      id="shopifyStoreUrl"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.PUBLIC_SHOPIFY_SHOP}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Shopify Shop Password | front-end
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                      id="PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={
                        settingsData?.PRIVATE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
                      }
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="SHOPIFY_SHOP_PASSWORD_BACK"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Shopify Shop Password | backend
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="SHOPIFY_SHOP_PASSWORD_BACK"
                      id="SHOPIFY_SHOP_PASSWORD_BACK"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={settingsData?.SHOPIFY_SHOP_PASSWORD_BACK}
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Shopify Storefront Access Token
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                      id="PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      value={
                        settingsData?.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
                      }
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Neo4j Graph Database
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the Neo4j integration
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <div className="flex items-center gap-x-3">
                  <input
                    id="NEO4J_ENABLED"
                    name="NEO4J_ENABLED"
                    type="checkbox"
                    className="h-4 w-4 border-mylightgrey text-myorange focus:ring-myorange"
                    checked={settingsData?.NEO4J_ENABLED}
                    onChange={() =>
                      handleToggle(
                        `NEO4J_ENABLED`,
                        !settingsData?.NEO4J_ENABLED,
                      )
                    }
                  />
                  <label
                    htmlFor="neo4jEnabled"
                    className="pl-2 block text-md leading-6 text-mydarkgrey font-bold"
                  >
                    Enable Neo4j knowledge graph
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="NEO4J_URI"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Neo4j URI
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="NEO4J_URI"
                      id="NEO4J_URI"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.NEO4J_URI}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="NEO4J_USER"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Neo4j User
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="NEO4J_USER"
                      id="NEO4J_USER"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.NEO4J_USER}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="NEO4J_SECRET"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Neo4j Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="NEO4J_SECRET"
                      id="NEO4J_SECRET"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.NEO4J_SECRET}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              MySQL Database
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the primary database connection used by the
              backend Concierge service
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="DB_HOST"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Database Host
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DB_HOST"
                      id="DB_HOST"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="localhost"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DB_HOST}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DB_NAME"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Database Name
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DB_NAME"
                      id="DB_NAME"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="tractstack"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DB_NAME}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="DB_USER"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Database User
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DB_USER"
                      id="DB_USER"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DB_USER}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DB_PASSWORD"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Database Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="DB_PASSWORD"
                      id="DB_PASSWORD"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DB_PASSWORD}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
            <h2 className="text-base font-action leading-7 text-myblack">
              Drupal
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              These settings affect the backend Drupal service
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_APIBASE"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal API Base
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_APIBASE"
                      id="DRUPAL_APIBASE"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="jsonapi"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_APIBASE}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="PUBLIC_IMAGE_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal domain | for images
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="PUBLIC_IMAGE_URL"
                      id="PUBLIC_IMAGE_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.PUBLIC_IMAGE_URL}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_BASE_URL"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal base URL
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_BASE_URL"
                      id="DRUPAL_BASE_URL"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_BASE_URL}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_URL_BACK"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal URL | backend
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_URL_BACK"
                      id="DRUPAL_URL_BACK"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_URL_BACK}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="BASIC_AUTH_USERNAME"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Username
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="BASIC_AUTH_USERNAME"
                      id="BASIC_AUTH_USERNAME"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.BASIC_AUTH_USERNAME}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="BASIC_AUTH_PASSWORD"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Password
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="BASIC_AUTH_PASSWORD"
                      id="BASIC_AUTH_PASSWORD"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.BASIC_AUTH_PASSWORD}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_OAUTH_CLIENT_ID"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Client ID
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_OAUTH_CLIENT_ID"
                      id="DRUPAL_OAUTH_CLIENT_ID"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="builder"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_OAUTH_CLIENT_ID}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_OAUTH_CLIENT_SECRET"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Client Secret
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="password"
                      name="DRUPAL_OAUTH_CLIENT_SECRET"
                      id="DRUPAL_OAUTH_CLIENT_SECRET"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_OAUTH_CLIENT_SECRET}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_OAUTH_GRANT_TYPE"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Grant Type
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_OAUTH_GRANT_TYPE"
                      id="DRUPAL_OAUTH_GRANT_TYPE"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="password"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_OAUTH_GRANT_TYPE}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_OAUTH_SCOPE"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Scope
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_OAUTH_SCOPE"
                      id="DRUPAL_OAUTH_SCOPE"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="builder"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_OAUTH_SCOPE}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="DRUPAL_OAUTH_ROOT"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth folder
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <input
                      type="text"
                      name="DRUPAL_OAUTH_ROOT"
                      id="DRUPAL_OAUTH_ROOT"
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.DRUPAL_OAUTH_ROOT}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-full">
                <label
                  htmlFor="OAUTH_PUBLIC_KEY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Public Key
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <textarea
                      name="OAUTH_PUBLIC_KEY"
                      id="OAUTH_PUBLIC_KEY"
                      rows={5}
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.OAUTH_PUBLIC_KEY}
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-full">
                <label
                  htmlFor="OAUTH_PRIVATE_KEY"
                  className="block text-sm leading-6 text-mydarkgrey font-bold"
                >
                  Drupal Oauth Private Key
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                    <textarea
                      name="OAUTH_PRIVATE_KEY"
                      id="OAUTH_PRIVATE_KEY"
                      rows={5}
                      className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      onChange={(e) => handleChange(e)}
                      value={settingsData?.OAUTH_PRIVATE_KEY}
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

export default Account
