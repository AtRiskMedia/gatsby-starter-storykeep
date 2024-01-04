// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

import { useDrupalStore } from '../stores/drupal'

const StoryKeep = () => {
  const allTractStacks = useDrupalStore((state) => state.allTractStacks)

  return (
    <section className="w-full">
      <div className="text-xl font-action mb-12 xl:max-w-screen-2xl mt-16 px-4 xl:px-8">
        <div className="-mx-4">
          <ul
            role="list"
            className="grid grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3"
          >
            {Object.keys(allTractStacks).map((record: string) => (
              <li key={allTractStacks[record].slug} className="col-span-1">
                <button
                  type="button"
                  className="bg-slate-50 group relative block w-full max-w-md rounded-lg shadow-md hover:shadow-none hover:border-dashed border-2 border-dotted border-mylightgrey/20 p-6 text-center hover:border-myblue/20 hover:bg-myorange/10 focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2"
                  onClick={() => {
                    console.log(`goto edit tractstack`)
                  }}
                >
                  <ChatBubbleLeftRightIcon
                    aria-hidden="true"
                    className="mx-auto h-8 w-8 text-myblue/10 group-hover:text-myblue/20"
                  />
                  <span className="group-hover:text-myblue mt-2 block text-md text-myblue">
                    {allTractStacks[record].title}
                  </span>
                  <span className="group-hover:text-myblue mt-2 block text-xs font-main text-mydarkgrey">
                    {`/${allTractStacks[record].slug}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default StoryKeep
