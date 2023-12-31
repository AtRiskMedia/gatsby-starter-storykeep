// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import {
  CursorArrowRaysIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'

// import { useStoryStepStore } from '../stores/storyStep'
import { IViewportKeyProps } from '@tractstack/types'

const FeaturesGrid = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  // const processRead = useStoryStepStore((state) => state.processRead)
  // const updateEventStream = useStoryStepStore(
  //  (state) => state.updateEventStream,
  // )
  const features = [
    {
      id: `builder`,
      title: `All-in-one website builder`,
      description: `Everything your business needs to market and sell online. Integrates with your Shopify store.`,
      icon: (
        <CursorArrowRaysIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
      goto: `/context/builder/`,
    },
    {
      id: `analytics`,
      title: `Meaningful engagement analytics`,
      description: `As buyers engage with your funnel, we'll generate data-driven insight on what does (and doesn't) convert.`,
      icon: (
        <CircleStackIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
      goto: `/context/analytics/`,
    },
    {
      id: `contentMarketing`,
      title: `Better tooling for content marketing`,
      description: `Removes all the complexity. Gives you everything you'll need in one tool. You retain ownership and control of your data.`,
      icon: (
        <ArrowTrendingUpIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
      goto: `/context/contentMarketing/`,
    },
    {
      id: `qualifyLeads`,
      title: `Help leads qualify themselves`,
      description: `Easily create interactive 'mini-funnels' that pre-filter or onboard prospective new buyers/clients.`,
      icon: (
        <BeakerIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
      goto: `/context/qualifyLeads/`,
    },
  ]

  /*
  const handleClick = (goto: string, targetSlug: string) => {
    if (
      storyFragmentId &&
      storyFragmentId?.paneId &&
      storyFragmentId?.paneTitle
    )
      updateEventStream(Date.now(), {
        id: storyFragmentId.paneId,
        title: storyFragmentId.paneTitle,
        type: `Pane`,
        verb: `CLICKED`,
      })
    if (storyFragmentId?.paneId && storyFragmentId?.paneTitle && targetSlug) {
      updateEventStream(Date.now(), {
        id: storyFragmentId?.paneId,
        title: storyFragmentId?.paneTitle,
        targetSlug,
        type: `Pane`,
        verb: `CONNECTED`,
      })
    }
    processRead(goto, `context`)
  }
  */

  // temporary hack for viewports in demo mode
  //

  if (viewportKey === `mobile`)
    return (
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="px-8 py-16 bg-slate-50"
      >
        <div className="mx-auto max-w-5xl">
          <div className="relative px-8">
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="relative flex items-center space-x-3 rounded-lg bg-allwhite px-6 py-5 shadow-sm"
                >
                  <div className="my-auto flex-shrink-0 pr-6">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-action text-black">
                      {feature.title}
                    </p>
                    <p className="text-md text-darkgrey pt-2">
                      {feature.description}
                      {` `}
                      <button
                        /*  onClick={() => handleClick(feature.goto, feature.id)} */
                        className="text-xs hover:text-allblack text-blue underline underline-offset-2"
                      >
                        Why?
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )

  if (viewportKey === `tablet`)
    return (
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="px-8 py-16 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative px-8">
            <div className="grid gap-4 grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="relative flex items-center space-x-3 rounded-lg bg-allwhite px-6 py-5 shadow-sm"
                >
                  <div className="my-auto flex-shrink-0 pr-6">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-action text-black">
                      {feature.title}
                    </p>
                    <p className="text-md text-darkgrey pt-2">
                      {feature.description}
                      {` `}
                      <button
                        /*  onClick={() => handleClick(feature.goto, feature.id)} */
                        className="text-xs hover:text-allblack text-blue underline underline-offset-2"
                      >
                        Why?
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )

  if (viewportKey === `desktop`)
    return (
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="px-8 py-16 bg-slate-50"
      >
        <div className="mx-auto max-w-7xl px-8">
          <div className="relative px-12">
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="relative flex items-center space-x-3 rounded-lg bg-allwhite px-6 py-5 shadow-sm"
                >
                  <div className="my-auto flex-shrink-0 pr-6">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-action text-black">
                      {feature.title}
                    </p>
                    <p className="text-md text-darkgrey pt-2">
                      {feature.description}
                      {` `}
                      <button
                        /*  onClick={() => handleClick(feature.goto, feature.id)} */
                        className="text-xs hover:text-allblack text-blue underline underline-offset-2"
                      >
                        Why?
                      </button>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
}

export default FeaturesGrid
