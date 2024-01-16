// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'

const Account = () => {
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  if (openDemoEnabled) return <DemoProhibited />

  return (
    <>
      <section>
        <form>
          <div className="space-y-6">
            <div className="border-b border-mydarkgrey/10 pb-6">
              <h2 className="text-xl font-bold leading-7 text-myblack">
                Account Settings (Advanced)
              </h2>
              <p className="mt-1 text-sm leading-6 text-mydarkgrey">
                Be very careful!
              </p>
            </div>

            <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
              <h2 className="text-base font-action leading-7 text-myblack">
                Front-end
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                These settings affect the frontend web experience
              </p>
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="siteUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Site URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="siteUrl"
                        id="siteUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
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
                <div className="sm:col-span-4">
                  <label
                    htmlFor="storyKeepUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Story Keep URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="storyKeepUrl"
                        id="storyKeepUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
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
                <div className="sm:col-span-4">
                  <label
                    htmlFor="conciergeBaseUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Base URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="conciergeBaseUrl"
                        id="conciergeBaseUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="conciergeRefreshTokenUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Refresh Token URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="conciergeRefreshTokenUrl"
                        id="conciergeRefreshTokenUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="conciergeSecret"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Secret for Frontend
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="conciergeSecret"
                        id="conciergeSecret"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="conciergeSecretStoryKeep"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Secret for Story Keep backend
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="conciergeSecretStoryKeep"
                        id="conciergeSecretStoryKeep"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
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
                <div className="sm:col-span-full">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="initializeShopify"
                      name="initializeShopify"
                      type="radio"
                      className="h-4 w-4 border-mylightgrey text-myorange focus:ring-myorange"
                    />
                    <label
                      htmlFor="initializeShopify"
                      className="pl-2 block text-md leading-6 text-mydarkgrey font-bold"
                    >
                      Enable Shopify Integration
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="shopifyStoreUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Shopify Store Url
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="shopifyStoreUrl"
                        id="shopifyStoreUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shopifyShopPassword"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Shopify Shop Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="shopifyShopPassword"
                        id="shopifyShopPassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="shopifyStorefrontAccessToken"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Shopify Storefront Access Token
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="shopifyStorefrontAccessToken"
                        id="shopifyStorefrontAccessToken"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="localStorageKey"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Shopify localStorageKey
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="localStorageKey"
                        id="localStorageKey"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="localStorageKey"
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
                <div className="sm:col-span-full">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="neo4jEnabled"
                      name="neo4jEnabled"
                      type="radio"
                      className="h-4 w-4 border-mylightgrey text-myorange focus:ring-myorange"
                    />
                    <label
                      htmlFor="neo4jEnabled"
                      className="pl-2 block text-md leading-6 text-mydarkgrey font-bold"
                    >
                      Enable Neo4j knowledge graph
                    </label>
                  </div>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="neo4jUri"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Neo4j URI
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="neo4jUri"
                        id="neo4jUri"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="neo4jUser"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Neo4j User
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="neo4jUser"
                        id="neo4jUser"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="neo4jPassword"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Neo4j Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="neo4jPassword"
                        id="neo4jPassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
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
                These settings affect the primary database connection used by
                the backend Concierge service
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="dbHost"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Database Host
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="dbHost"
                        id="dbHost"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="localhost"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="dbName"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Database Name
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="dbName"
                        id="dbName"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="tractstack"
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />

                <div className="sm:col-span-2">
                  <label
                    htmlFor="dbUser"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Database User
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="dbUser"
                        id="dbUser"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="dbPassword"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Database Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="dbPassword"
                        id="dbPassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
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
                <div className="sm:col-span-3">
                  <label
                    htmlFor="drupalUrl"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal URL
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="drupalUrl"
                        id="drupalUrl"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label
                    htmlFor="drupalApiBase"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal API Base
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="drupalApiBase"
                        id="drupalApiBase"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="jsonapi"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="basicAuthUsername"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Username
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="basicAuthUsername"
                        id="basicAuthUsername"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="basicAuthPassword"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Password
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="basicAuthPassword"
                        id="basicAuthPassword"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="drupalOauthClientId"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Oauth Client ID
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="drupalOauthClientId"
                        id="drupalOauthClientId"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="builder"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="drupalOauthClientSecret"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Oauth Client Secret
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="password"
                        name="drupalOauthClientSecret"
                        id="drupalOauthClientSecret"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="drupalOauthGrantType"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Oauth Grant Type
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="drupalOauthGrantType"
                        id="drupalOauthGrantType"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="password"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="drupalOauthScope"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Drupal Oauth Scope
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="drupalOauthScope"
                        id="drupalOauthScope"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="builder"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}

export default Account
