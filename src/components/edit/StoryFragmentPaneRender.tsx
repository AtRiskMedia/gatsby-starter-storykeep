// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { navigate } from 'gatsby'
import { classNames } from '@tractstack/helpers'
import { ICodeHookProps } from '@tractstack/types'

import { useDrupalStore } from '../../stores/drupal'
import codeHooks from '../../custom/codehooks'
import { SaveStages } from '../../types'

const CodeHook = ({
  thisId,
  payload,
  viewportKey,
  storyFragmentId,
}: ICodeHookProps) => {
  const ThisCodeHook =
    typeof codeHooks[payload.target] !== `undefined`
      ? codeHooks[payload.target]
      : null
  const children = (
    <ThisCodeHook viewportKey={viewportKey} storyFragmentId={storyFragmentId} />
  )
  return (
    <div
      id={`${thisId}-hook`}
      className="paneFragment paneFragmentCode overflow-hidden"
    >
      {children}
    </div>
  )
}

const StoryFragmentPaneRender = ({
  viewportKey,
  payload,
  paneId,
  storyFragmentId,
  viewportClasses,
  flags,
}: any) => {
  const setEmbeddedEdit = useDrupalStore((state) => state.setEmbeddedEdit)
  const p = paneId
  const thisPane = payload.panePayload
  const thisId = `${viewportKey}-${p}`
  const hasCodeHook: any = thisPane.hasCodeHook
  const codeHookDiv = (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 xs:p-6">Code Hook</div>
    </div>
  )
  const thisPaneChildren =
    hasCodeHook?.target &&
    (hasCodeHook.target === `h5p` || hasCodeHook.target === `iframe`) ? (
      codeHookDiv
    ) : hasCodeHook?.target && hasCodeHook.target === `shopify` ? (
      codeHookDiv
    ) : hasCodeHook?.target ? (
      <CodeHook
        thisId={thisId}
        payload={hasCodeHook}
        viewportKey={viewportKey}
        storyFragmentId={{
          ...storyFragmentId,
          paneId: p,
          paneTitle: thisPane.title,
          paneSlug: thisPane.slug,
        }}
      />
    ) : (
      payload.children
    )
  const hasMaxHScreen =
    typeof thisPane?.hasMaxHScreen === `boolean`
      ? thisPane.hasMaxHScreen
      : false
  const isHiddenPane = thisPane.hasHiddenPane
  const hasBeliefs =
    (thisPane.heldBeliefs && Object.keys(thisPane.heldBeliefs).length) ||
    (thisPane.withheldBeliefs && Object.keys(thisPane.withheldBeliefs).length)
  const borderColour = isHiddenPane
    ? `border-black`
    : hasBeliefs
      ? `border-myorange`
      : `border-mydarkgrey`
  return (
    <section
      key={`${viewportKey}-${p}-wrapper`}
      className={classNames(
        borderColour,
        `border border-dashed border-l-4 border-r-4 border-t-0 border-b-0 border-opacity-50 bg-white`,
        viewportClasses,
        `w-full h-fit-content overflow-hidden group`,
      )}
      id={`wrapper-${viewportKey}-${p}`}
    >
      <div
        id={thisId}
        key={thisId}
        className={classNames(
          `w-full h-full grid grid-rows-1 grid-cols-1 relative`,
          hasMaxHScreen ? `max-h-screen` : ``,
        )}
      >
        <>
          <button
            className="absolute top-0
            left-0 w-full h-full hover:border-2 hover:border-mygreen hover:border-dashed hover:bg-mygreen hover:bg-opacity-20 z-9"
            title="Edit this Pane"
            onClick={() => {
              if (
                flags.saveStage === SaveStages.NoChanges ||
                (flags.saveStage === SaveStages.UnsavedChanges &&
                  window.confirm(`There are Unsaved Changes. Proceed?`))
              ) {
                setEmbeddedEdit(
                  p,
                  `panes`,
                  storyFragmentId.id,
                  `storyfragments`,
                )
                navigate(`/storykeep/panes/${p}`)
              }
            }}
          ></button>
          {thisPaneChildren}
        </>
      </div>
    </section>
  )
}

export default StoryFragmentPaneRender
