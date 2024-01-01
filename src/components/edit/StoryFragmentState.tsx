// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

const StoryFragmentState = ({ uuid, payload, flags }: any) => {
  console.log(`StateFragmentState`, payload, flags)
  return <p>{uuid}</p>
}

export default StoryFragmentState
