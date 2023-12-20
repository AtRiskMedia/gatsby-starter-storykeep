// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { getGraph } from '../api/services'
import VisNetwork from './VisNetwork'
import { useAuthStore } from '../stores/authStore'

const processGraphPayload = (nodes: any, edges: any) => {
  const graphNodes = nodes.map((e: any) => {
    return {
      id: e.id,
      label: e.properties.object_name,
      value: 1,
    }
  })
  const graphEdges = edges.map((e: any) => {
    return {
      id: e.id,
      from: e.startNodeId,
      to: e.endNodeId,
      value: 1,
    }
  })
  return { nodes: graphNodes, edges: graphEdges }
}

const goGetGraph = async () => {
  try {
    const response = await getGraph()
    const data = response?.data
    if (data) {
      const graphNodes: any = []
      const graphNodeIds: any = []
      const graphRelationships: any = []
      const graphRelationshipIds: any = []
      data.forEach((row: any) => {
        if (row?.v?.id && !graphNodeIds.includes(row.v.id)) {
          graphNodes.push(row.v)
          graphNodeIds.push(row.v.id)
        }
        if (row?.c?.id && !graphNodeIds.includes(row.c.id)) {
          graphNodes.push(row.c)
          graphNodeIds.push(row.c.id)
        }
        if (row?.s?.id && !graphNodeIds.includes(row.s.id)) {
          graphNodes.push(row.s)
          graphNodeIds.push(row.s.id)
        }
        if (row?.t?.id && !graphNodeIds.includes(row.t.id)) {
          graphNodes.push(row.t)
          graphNodeIds.push(row.t.id)
        }
        if (row?.a?.id && !graphRelationshipIds.includes(row.a.id)) {
          graphRelationships.push(row.a)
          graphRelationshipIds.push(row.a.id)
        }
        if (row?.d?.id && !graphRelationshipIds.includes(row.d.id)) {
          graphRelationships.push(row.d)
          graphRelationshipIds.push(row.d.id)
        }
        if (row?.r?.id && !graphRelationshipIds.includes(row.r.id)) {
          graphRelationships.push(row.r)
          graphRelationshipIds.push(row.r.id)
        }
        if (row?.rsf?.id && !graphRelationshipIds.includes(row.rsf.id)) {
          graphRelationships.push(row.rsf)
          graphRelationshipIds.push(row.rsf.id)
        }
        if (row?.ts1?.id && !graphRelationshipIds.includes(row.ts1.id)) {
          graphRelationships.push(row.ts1)
          graphRelationshipIds.push(row.ts1.id)
        }
        if (row?.ts2?.id && !graphRelationshipIds.includes(row.ts2.id)) {
          graphRelationships.push(row.ts2)
          graphRelationshipIds.push(row.ts2.id)
        }
        if (row?.rc?.id && !graphRelationshipIds.includes(row.rc.id)) {
          graphRelationships.push(row.rc)
          graphRelationshipIds.push(row.rc.id)
        }
      })
      const graph =
        Object.keys(graphNodes).length +
          Object.keys(graphRelationships).length ===
          0
          ? null
          : processGraphPayload(graphNodes, graphRelationships)
      return { graph, error: null }
    }
    return { graph: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const Graph = () => {
  const [graphData, setGraphData] = useState({})
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())

  useEffect(() => {
    if (
      isLoggedIn &&
      graphData &&
      Object.keys(graphData).length === 0 &&
      !loading &&
      !loaded
    ) {
      setLoading(true)
      goGetGraph()
        .then((res: any) => {
          setGraphData(res?.graph)
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => setLoaded(true))
      setLoading(false)
    }
  }, [
    isLoggedIn,
    graphData,
    setGraphData,
    loaded,
    loading,
    setLoaded,
    setLoading,
  ])

  return (
    <section className="xl:max-w-5xl">
      <div className="h-screen shadow-sm bg-white">
        {!loaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-xs leading-6 text-lg text-mydarkgrey">
              <p>
                <strong>LOADING</strong>
              </p>
            </div>
          </div>
        ) : (
          <VisNetwork payload={graphData} />
        )}
      </div>
    </section>
  )
}

export default Graph
