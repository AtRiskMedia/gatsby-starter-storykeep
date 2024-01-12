// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { Network } from 'vis-network'
import {navigate} from 'gatsby'

import { useDrupalStore } from '../stores/drupal'

const VisNetwork = ({ payload }: any) => {
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const allPanes = useDrupalStore((state) => state.allPanes)

  useEffect(() => {
    const container = document.getElementById(`mynetwork`)
    const options = {
      nodes: {
        shape: `dot`,
        scaling: {
          label: {
            min: 8,
            max: 20,
          },
        },
      },
    }

    const goto = ({title,type}:{title:string, type:string})=>{
      const nodes = type === `StoryFragment` ? allStoryFragments : allPanes
      const thisType = type === `StoryFragment` ? `storyfragments` : `panes`
      let uuid
      if(nodes ) Object.keys(nodes).map((e:string)=> {
        if( nodes[e].title === title ) uuid = e
      })
      if(uuid)navigate(`/storykeep/${thisType}/${uuid}`)
      else
      console.log(`${type} not found.`)
    }

    if (container) {
      const network = new Network(container, payload, options)
      network.on(`doubleClick`, function (params) {
        const nid = params?.nodes?.length > 0 ? params.nodes[0] : null
        if (nid) {
          const thisNode = payload.nodes.filter((e: any) => nid === e.id)
          if (thisNode.length) goto( { title:thisNode[0].label, type: thisNode[0].title } )
        }
      })
    }
  }, [payload])

  return <div id="mynetwork" className="w-full h-full"></div>
}

export default VisNetwork
