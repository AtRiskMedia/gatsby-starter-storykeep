// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { Link, navigate } from 'gatsby'
import { classNames } from '@tractstack/helpers'
import {
  PaneActivitySwarm,
  StoryFragmentActivitySwarm,
  RecentDailyActivity,
} from '@tractstack/nivo'

import { useAuthStore } from '../stores/authStore'
import { useDrupalStore } from '../stores/drupal'
import { useProductData } from '../hooks/use-product-data'
import { getDashboardPayloads } from '../api/services'

const goGetDashboardPayloads = async () => {
  try {
    const response = await getDashboardPayloads()
    const data = response?.data
    if (data) {
      return { data, error: null }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const processRecentDailyActivity = (data: any) => {
  const payload: any = {}
  data.forEach((e: any) => {
    const actions = [`clicked`, `discovered`, `entered`, `glossed`, `red`]
    actions.forEach((f) => {
      if (typeof payload[f] === `undefined`) payload[f] = []
      payload[f].push({
        x: e.daysSince.toString(),
        y: parseInt(e[f]),
      })
    })
  })
  const val = [
    {
      id: `clicked`,
      data: payload.clicked,
    },
    {
      id: `discovered`,
      data: payload.discovered,
    },
    {
      id: `entered`,
      data: payload.entered,
    },
    {
      id: `glossed`,
      data: payload.glossed,
    },
    {
      id: `read`,
      data: payload.red,
    },
  ]
  return val
}

const processPaneSwarm = (data: any) => {
  const maxRaw =
    data.length === 0
      ? 0
      : 1.01 *
        data.reduce((a: any, b: any) =>
          a.hours_since_activity > b.hours_since_activity ? a : b,
        ).hours_since_activity
  const maxSince = maxRaw > 0 ? maxRaw : 1
  return data
    .map((e: any) => {
      if (!e || !e.title) return null
      return {
        id: e.title,
        group: `pane`,
        engagement: (100 * (maxSince - e.hours_since_activity)) / maxSince,
        hoursSince: e.hours_since_activity,
        events: parseInt(e.clicked) + parseInt(e.red) + parseInt(e.glossed),
        categories: [
          0,
          parseInt(e.red),
          parseInt(e.glossed),
          parseInt(e.clicked),
        ],
      }
    })
    .filter((n: any) => n)
}
const processStoryFragmentSwarm = (data: any) => {
  const maxRaw =
    data.length === 0
      ? 0
      : 1.01 *
        data.reduce((a: any, b: any) =>
          a.hours_since_activity > b.hours_since_activity ? a : b,
        ).hours_since_activity
  const maxSince = maxRaw > 0 ? maxRaw : 1
  return data
    .map((e: any) => {
      if (!e || !e.title) return null
      return {
        id: e.title,
        group: `storyfragment`,
        engagement: (100 * (maxSince - e.hours_since_activity)) / maxSince,
        hoursSince: e.hours_since_activity,
        events:
          parseInt(e.clicked) +
          parseInt(e.red) +
          parseInt(e.glossed) +
          parseInt(e.entered) +
          parseInt(e.discovered),
        categories: [
          0,
          parseInt(e.red),
          parseInt(e.glossed),
          parseInt(e.clicked),
          parseInt(e.entered),
          parseInt(e.discovered),
        ],
      }
    })
    .filter((n: any) => n)
}

const Dashboard = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)
  const allStoryFragments = useDrupalStore((state) => state.allStoryFragments)
  const allPanes = useDrupalStore((state) => state.allPanes)
  const allResources = useDrupalStore((state) => state.allResources)
  const allFiles = useDrupalStore((state) => state.allFiles)
  const allMenus = useDrupalStore((state) => state.allMenus)
  const allMarkdown = useDrupalStore((state) => state.allMarkdown)
  const allProducts = useProductData()
  const setSelected = useDrupalStore((state) => state.setSelected)
  const setSelectedCollection = useDrupalStore(
    (state) => state.setSelectedCollection,
  )
  const enabledStats = [
    `tractstack`,
    `storyfragment`,
    `pane`,
    `resource`,
    `file`,
  ]
  const recentMetrics = [
    {
      id: `uniqueSessions`,
      name: `Unique Sessions`,
    },
    { id: `uniqueUtmCampaign`, name: `Active Campaigns` },
    { id: `uniqueUtmSource`, name: `Campaign Sources Active` },
    { id: `uniqueUtmTerm`, name: `Campaign Terms Active` },
  ]
  const stats = [
    {
      id: `tractstack`,
      name: `Tract Stacks`,
      value: Object.keys(allTractStacks).length,
    },
    {
      id: `storyfragment`,
      name: `Story Fragments`,
      value: Object.keys(allStoryFragments).length,
    },
    { id: `pane`, name: `Panes`, value: Object.keys(allPanes).length },
    { id: `markdown`, name: `Copy`, value: Object.keys(allMarkdown).length },
    {
      id: `resource`,
      name: `Resources`,
      value: Object.keys(allResources).length,
    },
    { id: `file`, name: `Files`, value: Object.keys(allFiles).length },
    { id: `menu`, name: `Menus`, value: Object.keys(allMenus).length },
    { id: `product`, name: `Products`, value: Object.keys(allProducts).length },
  ]

  const [recentDailyActivityData, setRecentDailyActivityData]: any = useState(
    [],
  )
  const [recentMetricsData, setRecentMetricsData] = useState({})
  const [paneActivityData, setPaneActivityData] = useState([])
  const [storyFragmentActivityData, setStoryFragmentActivityData] = useState([])
  const [loadingDashboardPayloads, setLoadingDashboardPayloads] =
    useState(false)
  const [loadedDashboardPayloads, setLoadedDashboardPayloads] = useState(false)
  const [maxRetryDashboardPayloads, setMaxRetyDashboardPayloads] = useState<
    undefined | boolean
  >(undefined)

  const handleClick = (e: any) => {
    if (e.group === `pane`) {
      let thisId
      Object.keys(allPanes).forEach((f: any) => {
        if (allPanes[f].title === e.id) thisId = f
      })
      if (e) {
        setSelected(thisId)
        setSelectedCollection(`pane`)
        navigate(`/storykeep`)
      } else console.log(`miss on`, e)
    } else if (e.group === `storyfragment`) {
      let thisId
      Object.keys(allStoryFragments).forEach((f: any) => {
        if (allStoryFragments[f].title === e.id) thisId = f
      })
      if (e) {
        setSelected(thisId)
        setSelectedCollection(`storyfragment`)
        navigate(`/storykeep`)
      } else console.log(`miss on`, e)
    } else console.log(`missed on`, e)
  }

  useEffect(() => {
    if (
      !loadingDashboardPayloads &&
      !loadedDashboardPayloads &&
      !maxRetryDashboardPayloads &&
      isLoggedIn
    ) {
      setLoadingDashboardPayloads(true)
      goGetDashboardPayloads()
        .then((res: any) => {
          if (res?.data && res.data?.data) {
            const payload = JSON.parse(res.data.data)
            setPaneActivityData(processPaneSwarm(payload.paneActivitySwarm))
            setStoryFragmentActivityData(
              processStoryFragmentSwarm(payload.storyFragmentActivitySwarm),
            )
            setRecentDailyActivityData(
              processRecentDailyActivity(payload.recentDailyActivity),
            )
            setRecentMetricsData(payload.recentMetrics[0])
            setLoadedDashboardPayloads(true)
          } else {
            if (typeof maxRetryDashboardPayloads === `undefined`) {
              setMaxRetyDashboardPayloads(false)
              setLoadingDashboardPayloads(false)
            } else if (
              typeof maxRetryDashboardPayloads === `boolean` &&
              !maxRetryDashboardPayloads
            ) {
              setMaxRetyDashboardPayloads(true)
              setLoadingDashboardPayloads(false)
              window.reload()
            }
          }
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
    }
  }, [
    isLoggedIn,
    loadedDashboardPayloads,
    loadingDashboardPayloads,
    maxRetryDashboardPayloads,
  ])

  return (
    <section className="xl:max-w-screen-2xl">
      <ul role="list" className="space-y-5">
        <li className="bg-slate-100 px-4 py-4 shadow sm:rounded-md sm:px-6">
          <div className="border-b border-myblue/10 pb-2 mx-8">
            <h3 className="font-action text-xl text-myblue">
              Total activity | past 7 days
            </h3>
          </div>
          <dl className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-2xl text-center md:grid-cols-3 lg:grid-cols-4">
            {recentMetrics.map((stat) => (
              <div
                key={stat.id}
                className="font-action flex flex-col bg-lightgrey/5 p-4"
              >
                <dt className="text-sm font-bold leading-6 text-myblue">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-myblue">
                  {recentMetricsData[stat.id as keyof typeof recentMetricsData]}
                </dd>
              </div>
            ))}
          </dl>
        </li>

        <li className="bg-slate-100 px-4 py-4 shadow sm:rounded-md sm:px-6">
          <div>
            <div className="border-b border-myblue/10 pb-2 mx-8">
              <h3 className="font-action text-xl text-myblue">
                Recent Daily Activity Totals
              </h3>
            </div>
            <div className="h-80 m-3">
              {loadedDashboardPayloads ? (
                <RecentDailyActivity data={recentDailyActivityData} />
              ) : null}
            </div>
          </div>
        </li>
        <li className="bg-slate-100 px-4 py-4 shadow sm:rounded-md sm:px-6">
          <div className="md:grid md:grid-cols-2 md:gap-2">
            <div>
              <div className="border-b border-myblue/10 pb-2 mx-8">
                <h3 className="font-action text-xl text-myblue">
                  Total Page Activity
                </h3>
              </div>
              <div className="h-80 m-3">
                {loadedDashboardPayloads ? (
                  <StoryFragmentActivitySwarm
                    handleClick={handleClick}
                    data={{
                      data: storyFragmentActivityData,
                      groups: [`storyfragment`],
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div className="mt-12 md:mt-0">
              <div className="border-b border-myblue/10 pb-2 mx-8">
                <h3 className="font-action text-xl text-myblue">
                  Total Content Interactions
                </h3>
              </div>
              <div className="h-80 mt-2">
                {loadedDashboardPayloads ? (
                  <PaneActivitySwarm
                    handleClick={handleClick}
                    data={{ data: paneActivityData, groups: [`pane`] }}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </li>
        <li className="bg-slate-100 px-4 py-4 shadow sm:rounded-md sm:px-6">
          <div className="border-b border-myblue/10 pb-2 mx-8">
            <h3 className="font-action text-xl text-myblue">
              Story Keep at a glance
            </h3>
          </div>
          <dl className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-2xl text-center md:grid-cols-3 lg:grid-cols-4">
            {stats.map((stat) => (
              <Link
                onClick={(e) => {
                  if (enabledStats.includes(stat.id))
                    setSelectedCollection(stat.id)
                  else e.preventDefault()
                }}
                to={`/storykeep`}
                key={stat.id}
                className={classNames(
                  !enabledStats.includes(stat.id)
                    ? `pointer-events-none`
                    : `pointer-events-auto`,
                  `font-action flex flex-col bg-lightgrey/5 p-4`,
                )}
              >
                <dt className="text-sm font-bold leading-6 text-myblue">
                  {stat.name}
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-myblue">
                  {stat.value}
                </dd>
              </Link>
            ))}
          </dl>
        </li>
      </ul>
    </section>
  )
}

export default Dashboard
