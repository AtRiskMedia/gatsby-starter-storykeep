// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

const PaneStarter = ({ state, fn, flags }: any) => {
  const { handleChangeEditInPlace, handleChange } = fn

  return (
    <section className="p-6 max-max-w-screen-lg">
      <div className="mb-4">
        <span className="font-action pr-3 text-base font-bold text-black">
          Pane Details
        </span>
        <form className="max-w-3xl" id="editPaneDetails">
          <div className="space-y-12">
            <div className="border-b border-black/10 pb-12">
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 xs:grid-cols-6">
                <div className="xs:col-span-3">
                  <label
                    htmlFor="title"
                    className="block text-sm leading-6 text-black"
                  >
                    Title
                    {state.title.length === 0 ? (
                      <>
                        {` `}
                        <span className="text-myorange ml-1" title="required">
                          *required
                        </span>
                      </>
                    ) : null}
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                        value={state.title}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="xs:col-span-2">
                  <label
                    htmlFor="slug"
                    className="block text-sm leading-6 text-black"
                  >
                    Slug{` `}
                    <span
                      className="text-myorange ml-1"
                      title="use lowercase letters, dash allowed"
                    >
                      *
                    </span>
                  </label>
                  {flags.slugCollision ? (
                    <span className="text-myorange ml-2">
                      that slug was taken
                    </span>
                  ) : null}
                  <div className="mt-2">
                    <div className="flex rounded-md bg-white shadow-sm ring-1 ring-inset ring-slate-200 focus-within:ring-2 focus-within:ring-inset focus-within:ring-myorange xs:max-w-md">
                      <input
                        type="text"
                        name="slug"
                        id="slug"
                        pattern="[a-zA-Z\-]+"
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-2 text-black placeholder:text-mylightgrey focus:ring-0 xs:text-sm xs:leading-6"
                        value={state.slug}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {state.slug && state.title && !flags.slugCollision ? (
        <>
          <div className="mb-4">
            <span className="font-action pr-3 text-base font-bold text-black">
              Select a starter for this pane
            </span>
          </div>
          <ul className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 xl:gap-x-8">
            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `titleText`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/title-text.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey ">
                  Title with paragraph
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  Includes heading 2 and paragraph styles
                </p>
              </button>
            </li>

            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `text`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/text.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey group-hover:text-black">
                  Paragraphs
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  Includes paragraph styles only
                </p>
              </button>
            </li>

            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `modal`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/modal.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey group-hover:text-black">
                  Modal with title
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  Pick a modal; includes heading 2 styles
                </p>
              </button>
            </li>

            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `fancy`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/fancy.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey group-hover:text-black">
                  Fancy title section
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  The works; includes shapes and heading 2 + paragraph styles
                </p>
              </button>
            </li>

            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `borderedText`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/bordered-text.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey group-hover:text-black">
                  Bordered paragraphs
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  Includes parent and paragraph styles
                </p>
              </button>
            </li>

            <li className="group">
              <button
                onClick={() =>
                  handleChangeEditInPlace({
                    target: {
                      name: `starter--0`,
                      value: `breaks`,
                    },
                  })
                }
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-black/10">
                  <img
                    className="group-hover:scale-125"
                    src="/posters/breaks.png"
                  />
                </div>
                <h4 className="mt-4 text-sm text-mydarkgrey group-hover:text-black">
                  Transition Shape
                </h4>
                <p className="relative mt-1.5 text-xs text-mydarkgrey">
                  Add some personality...
                </p>
              </button>
            </li>
          </ul>
        </>
      ) : (
        <div className="text-base">
          Please enter a title and slug to get started!
        </div>
      )}
    </section>
  )
}

export default PaneStarter
