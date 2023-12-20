// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { getGraph } from '../api/services'
import VisNetwork from './VisNetwork'
import { useAuthStore } from '../stores/authStore'

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
      })
      const graph =
        Object.keys(graphNodes).length +
          Object.keys(graphRelationships).length ===
        0
          ? null
          : {
              results: [
                {
                  columns: [`user`, `entity`],
                  data: [
                    {
                      graph: {
                        nodes: graphNodes,
                        relationships: graphRelationships,
                      },
                    },
                  ],
                },
              ],
              errors: [],
            }
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
