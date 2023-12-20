// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { Network } from 'vis-network'

const VisNetwork = ({ payload }: any) => {
  useEffect(() => {
    // console.log(payload)
    const nodes = [
      { id: 1, value: 2, label: `Algie` },
      { id: 2, value: 31, label: `Alston` },
      { id: 3, value: 12, label: `Barney` },
      { id: 4, value: 16, label: `Coley` },
      { id: 5, value: 17, label: `Grant` },
      { id: 6, value: 15, label: `Langdon` },
      { id: 7, value: 6, label: `Lee` },
      { id: 8, value: 5, label: `Merlin` },
      { id: 9, value: 30, label: `Mick` },
      { id: 10, value: 18, label: `Tod` },
    ]

    const edges = [
      { from: 2, to: 8, value: 3 },
      { from: 2, to: 9, value: 5 },
      { from: 2, to: 10, value: 1 },
      { from: 4, to: 6, value: 8 },
      { from: 5, to: 7, value: 2 },
      { from: 4, to: 5, value: 1 },
      { from: 9, to: 10, value: 2 },
      { from: 2, to: 3, value: 6 },
      { from: 3, to: 9, value: 4 },
      { from: 5, to: 3, value: 1 },
      { from: 2, to: 7, value: 4 },
    ]
    const container = document.getElementById(`mynetwork`)
    const data = {
      nodes,
      edges,
    }
    const options = {}
    if (container) {
      const network = new Network(container, data, options)
      console.log(network)
    }
  }, [payload])

  return <div id="mynetwork" className="w-full h-full"></div>
}

export default VisNetwork
