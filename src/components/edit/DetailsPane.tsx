// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useMemo } from 'react'
import { navigate } from 'gatsby'
import { DetailsPie } from '@tractstack/nivo'

import { useDrupalStore } from '../../stores/drupal'
import { SaveStages } from '../../types'

const DetailsPane = ({
  uuid,
  data,
  flags,
}: {
  uuid: string
  data: any[]
  flags: { panes: string[]; saveStage: number; storyFragmentId: string }
}) => {
  const setEmbeddedEdit = useDrupalStore((state) => state.setEmbeddedEdit)
  const thisPane = useDrupalStore((state) => state.allPanes[uuid])
  const payload = useMemo(() => {
    return [
      {
        id: `skip`,
        label: ``,
        value: 0,
        color: `#fffff`,
      },
      {
        id: `read`,
        label: `Read`,
        value:
          data && data.length && typeof data[0] !== `undefined`
            ? data[0].red
            : 0,
      },
      {
        id: `glossed`,
        label: `Glossed`,
        value:
          data && data.length && typeof data[0] !== `undefined`
            ? data[0].glossed
            : 0,
      },
      {
        id: `clicked`,
        label: `Clicked`,
        value:
          data && data.length && typeof data[0] !== `undefined`
            ? data[0].clicked
            : 0,
      },
    ]
  }, [data])

  return (
    <>
      <button
        title="Edit this Pane"
        className="px-3 text-xs text-left"
        onClick={() => {
          if (
            flags.saveStage === SaveStages.NoChanges ||
            (flags.saveStage === SaveStages.UnsavedChanges &&
              window.confirm(`There are Unsaved Changes. Proceed?`))
          ) {
            setEmbeddedEdit(
              uuid,
              `panes`,
              flags.storyFragmentId,
              `storyfragments`,
            )
            navigate(`/storykeep/panes/${uuid}`)
          }
        }}
      >
        {thisPane.title}
      </button>
      <p className="px-3 text-sm leading-6 text-mydarkgrey">
        ({thisPane.slug})
      </p>
      {data && data.length && payload ? (
        <div className="h-36 w-full">
          <DetailsPie data={payload} />
        </div>
      ) : null}
    </>
  )
}

export default DetailsPane
