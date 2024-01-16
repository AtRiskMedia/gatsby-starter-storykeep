// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useDrupalStore } from '../stores/drupal'
import { DemoProhibited } from './DemoProhibited'

const Settings = () => {
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  if (openDemoEnabled) return <DemoProhibited />

  return (
    <>
      <section>
        <form>
          <div className="space-y-6">
            <div className="border-b border-mydarkgrey/10 pb-6">
              <h2 className="text-xl font-bold leading-7 text-myblack">
                Publish Settings
              </h2>
              <p className="mt-1 text-sm leading-6 text-mydarkgrey">
                Remember to re-publish your site after changing these settings!
              </p>
            </div>

            <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
              <h2 className="text-base font-action leading-7 text-myblack">
                Front-end Experience
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                These settings impact the frontend web experience
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="slogan"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Slogan
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="slogan"
                        id="slogan"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5">
                  <label
                    htmlFor="footer"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Footer Text
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen">
                      <input
                        type="text"
                        name="footer"
                        id="footer"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="home"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Slug of Story Fragment to use as homepage
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="home"
                        id="home"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="action"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Conversion Action for Email Sign-up
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="text"
                        name="action"
                        id="action"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="readThreshold"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Read Threshold
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="readThreshold"
                        id="readThreshold"
                        autoComplete="readThreshold"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="42000"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="softReadThreshold"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    (Soft) Read Threshold
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="softReadThreshold"
                        id="softReadThreshold"
                        autoComplete="softReadThreshold"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="7000"
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="conciergeSync"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Concierge Sync frequency (milliseconds)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="conciergeSync"
                        id="conciergeSync"
                        autoComplete="conciergeSync"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="45000"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="conciergeForceInterval"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Multiplier to force immediate eventStream on page load
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="3"
                        name="conciergeForceInterval"
                        id="conciergeForceInterval"
                        autoComplete="conciergeForceInterval"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="2"
                      />
                    </div>
                  </div>
                </div>

                <div className="clear" />
                <div className="sm:col-span-2">
                  <label
                    htmlFor="impressionsDelay"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Cycle impressions delay interval (milliseconds)
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="impressionsDelay"
                        id="impressionsDelay"
                        autoComplete="impressionsDelay"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="22000"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="social"
                    className="block text-sm leading-6 text-mydarkgrey"
                  >
                    <span className="font-bold">Social Links payload</span> |
                    must be {`[ {name:string, href:string} ]`}, only name =
                    Twitter, GitLab, GitHub supported
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-xl">
                      <textarea
                        name="social"
                        id="social"
                        rows={4}
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full">
                  <label
                    htmlFor="conciergeNav"
                    className="block text-sm leading-6 text-mydarkgrey"
                  >
                    <span className="font-bold">Admin Panel menu</span> | must
                    be {`[ {id:string, title:string, href:string} ]`}
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-xl">
                      <textarea
                        name="conciergeNav"
                        id="conciergeNav"
                        rows={7}
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-mydarkgrey-900/10 p-6 bg-white/20 my-3">
              <h2 className="text-base font-action leading-7 text-myblack">
                Story Keep settings
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                These settings impact the backend editor experience
              </p>

              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-full">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="openDemoEnabled"
                      name="openDemoEnabled"
                      type="radio"
                      className="h-4 w-4 border-mylightgrey text-myorange focus:ring-myorange"
                    />
                    <label
                      htmlFor="openDemoEnabled"
                      className="pl-2 block text-md leading-6 text-mydarkgrey"
                    >
                      <span className="font-bold">
                        Enable the &quot;Open Demo&quot; mode
                      </span>
                      {` `}| Allows public safe-mode access to your story keep
                      for demo purposes
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="messageDelay"
                    className="block text-sm leading-6 text-mydarkgrey font-bold"
                  >
                    Read Threshold
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-mylightgrey focus-within:ring-2 focus-within:ring-inset focus-within:ring-mygreen sm:max-w-md">
                      <input
                        type="number"
                        min="1"
                        max="600000"
                        name="messageDelay"
                        id="messageDelay"
                        className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-myblack placeholder:text-black/50 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="7000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}

export default Settings
