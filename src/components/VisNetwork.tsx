// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { Network } from 'vis-network'

const VisNetwork = ({ payload }: any) => {
  useEffect(() => {
    const container = document.getElementById(`mynetwork`)
    const options = {}
    if (container) {
      const network = new Network(container, payload, options)
      if (network) {
        // console.log(network)
      }
    }
  }, [payload])

  return <div id="mynetwork" className="w-full h-full"></div>
}

export default VisNetwork
