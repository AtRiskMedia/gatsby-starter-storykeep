// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useMemo } from 'react'
import { DetailsPie } from '@tractstack/nivo'

import { useDrupalStore } from '../../stores/drupal'

const EditDetailsPane = ({ uuid, data }: any) => {
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
        onClick={() => console.log(`todo; nav to`, uuid)}
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

export default EditDetailsPane
