// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'

const Settings = () => {
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  if (openDemoEnabled) return <DemoProhibited />
  return (
    <section>
      <div>data/SiteConfig entries</div>
      <ul>
        <li>openDemoEnabled</li>
        <li>set storyFragment as home</li>
        <li>readThreshold</li>
        <li>softReadThreshold</li>
        <li>conciergeSync</li>
        <li>conciergeForceInterval</li>
        <li>impressionsDelay</li>
        <li>action button text, e.g. waitlist or register</li>
        <li>slogan</li>
        <li>footer</li>
        <li>social links[], name+href</li>
      </ul>
    </section>
  )
}

export default Settings
