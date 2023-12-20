// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'

const Backups = () => {
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  if (openDemoEnabled) return <DemoProhibited />
  return (
    <section>
      <div>backups and restore functionality</div>
    </section>
  )
}

export default Backups
