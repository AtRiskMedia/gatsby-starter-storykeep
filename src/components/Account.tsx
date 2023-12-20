// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'

const Account = () => {
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  if (openDemoEnabled) return <DemoProhibited />
  return (
    <section>
      <div>end-points and all technical settings</div>
      <ul>
        <li>SITE_URL</li>
        <li>gatsby-starter-tractstack location</li>
        <li>gatsby-starter-tractstack-builder location</li>
        <li>builder URL</li>
        <li>tractstack-concierge location</li>
        <li>CONCIERGE_BASE_URL, CONCIERGE_REFERSH_TOKEN_URL</li>
        <li>
          builder: CONCIERGE_SECRET, CONCIERGE_BASE_URL,
          CONCIERGE_REFERSH_TOKEN_URL
        </li>
        <li>
          DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, SECRET_KEY,
          BUILDER_SECRET_KEY, NEO4J_URI, NEO4J_USER, NEO4J_SECRET, MODE
        </li>
        <li>tractstack drupal instance root</li>
        <li>DRUPAL_URL</li>
        <li>
          BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD for gatsby-source-drupal
        </li>
        <li>
          builder: DRUPAL_APIBASE, DRUPAL_OAUTH_CLIENT_ID
          DRUPAL_OAUTH_CLIENT_SECRET, DRUPAL_OAUTH_GRANT_TYPE,
          DRUPAL_OAUTH_SCORE
        </li>
        <li>drupal: database, username, password, host, port</li>
        <li>tractstack user home folder</li>
        <li>initializeShopify</li>
        <li>localStorageKey shopify</li>
        <li>
          SHOPIFY_SHOP_PASSWORD, GATSBY_SHOPIFY_STORE_URL,
          GATSBY_STOREFRONT_ACCESS_TOKEN
        </li>
      </ul>
    </section>
  )
}

export default Account
