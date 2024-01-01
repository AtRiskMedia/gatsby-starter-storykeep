// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { DrupalProvider } from '@tractstack/drupal-react-oauth-provider'
// import { navigate } from 'gatsby'
// import { v4 as uuidv4 } from 'uuid'

import { useDrupalStore } from '../../../stores/drupal'
import DrupalApi from '../../../components/DrupalApi'
import StoryFragmentState from '../../../components/edit/StoryFragmentState'
import { SaveStages, EditStages, IEditFlags } from '../../../types'

export default function EditStoryFragment({
  params,
}: {
  params: { uuid: string }
}) {
  const uuid = params.uuid
  const drupalConfig = {
    url: process.env.DRUPAL_URL || ``,
  }
  const [editStage /* setEditStage */] = useState(EditStages.Booting)
  // const embeddedEdit = useDrupalStore((state) => state.embeddedEdit)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  // const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  // const thisStoryFragment = allStoryFragments[uuid]
  // const allMenus = useDrupalStore(
  //  (state) => state.allMenus[thisStoryFragment?.menu],
  // )
  // const thisMenu = thisStoryFragment?.menu
  //  ? allMenus[thisStoryFragment.menu]
  //  : null
  /*
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
  */
  const [flags /* setFlags */] = useState<IEditFlags>({
    isAuthor: false,
    isEmbeddedEdit: false,
    isAdmin: false,
    isBuilder: false,
    isOpenDemo: openDemoEnabled,
    isEmpty: false,
    editStage: EditStages.Booting,
    saveStage: SaveStages.Booting,
  })
  const [isSSR, setIsSSR] = useState(true)

  // SSR check
  useEffect(() => {
    if (isSSR && typeof window !== `undefined`) {
      setIsSSR(false)
    }
  }, [isSSR])

  if (isSSR) return null

  console.log(uuid)
  return (
    <DrupalProvider config={drupalConfig}>
      <DrupalApi>
        {editStage < EditStages.Activated ? (
          <></>
        ) : (
          <StoryFragmentState
            uuid={uuid}
            payload={{}}
            flags={{ ...flags, editStage }}
          />
        )}
      </DrupalApi>
    </DrupalProvider>
  )
}
