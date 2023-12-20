// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'

import { IEdit } from '../types'
import EditFormStoryFragment from './EditFormStoryFragment'
import { useDrupalStore } from '../stores/drupal'

const EditStoryFragment = ({ uuid, handleToggle }: IEdit) => {
  const [thisUuid, setThisUuid] = useState(uuid)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const thisStoryFragment = allStoryFragments[uuid]
  const allMenus = useDrupalStore(
    (state) => state.allMenus[thisStoryFragment?.menu],
  )
  const thisMenu = thisStoryFragment?.menu
    ? allMenus[thisStoryFragment.menu]
    : null
  const initialState = {
    title: thisStoryFragment?.title,
    slug: thisStoryFragment?.slug,
    socialImagePath: thisStoryFragment?.socialImagePath || ``,
    tailwindBgColour: thisStoryFragment?.tailwindBgColour || ``,
    panes: thisStoryFragment?.panes || {},
    contextPanes: thisStoryFragment?.contextPanes || {},
    menu: thisMenu,
    tractstack: thisStoryFragment?.tractstack,
  }
  const initialFormState = {
    submitted: false,
    success: false,
    changes: false,
    slugCollision: false,
  }

  return (
    <EditFormStoryFragment
      uuid={thisUuid}
      handleToggle={handleToggle}
      setThisUuid={setThisUuid}
      payload={{
        initialState,
        initialFormState,
      }}
    />
  )
}

export default EditStoryFragment
