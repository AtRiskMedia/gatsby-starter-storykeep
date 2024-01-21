import type { GatsbyConfig } from 'gatsby'

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Tract Stack Story Keep by At Risk Media`,
    description: `Tract Stack Story Keep: SaaS by At Risk Media | Intelligent no-code landing pages for product-market-fit validation`,
    author: `@AtRiskMedia`,
    siteUrl: `https://tractstack.com/`,
    image: 'tractstack-2023-social.png',
  },
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-shopify',
      options: {
        password: process.env.SHOPIFY_SHOP_PASSWORD_BACK,
        storeUrl: process.env.GATSBY_SHOPIFY_STORE_URL,
        shopifyConnections: ['collections'],
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-tractstack`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#c8df8c`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./assets/ARm-logo.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        disableVendorPrefixes: true,
      },
    },
    'gatsby-plugin-postcss',
  ],
  jsxRuntime: `automatic`,
}

export default config
