// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
// import { Link } from 'gatsby'
import { Svg } from '@tractstack/helpers'
import { IViewportKeyProps } from '@tractstack/types'
import styled from 'styled-components'
// import { InformationCircleIcon } from '@heroicons/react/24/outline'

import Hexa from '../../assets/hexa.svg'
import Wordmark from '../../assets/ARm-wordmark.svg'
import Logo from '../../assets/ARm-logo.svg'
// import Belief from '../components/Belief'
// import { config } from '../../data/SiteConfig'

interface IStyledDivProps {
  css: string
}
const StyledDiv = styled.div<IStyledDivProps>`
  ${(props: any) => props.css};
`

const AtRiskMedia = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const breakTop =
    viewportKey !== `desktop`
      ? Svg(`kCzlowcut2`, viewportKey, `herolowcut2`)
      : Svg(`kCzlowcutwide2`, viewportKey, `herolowcutwide2`)

  const branding = (
    <div className="py-24 mx-auto w-fit relative z-10">
      <div className="flex flex-col w-fit">
        <span className="mb-2">
          <Logo className="h-14 mx-auto fill-myblack" />
        </span>
        <Wordmark className="h-6 fill-myblack" />
      </div>
    </div>
  )

  return (
    <>
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="bg-white-gradient overflow-hidden"
      >
        <div className="absolute">
          <Hexa className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] xl:ml-[30rem] fill-mywhite" />
        </div>
        {branding}
      </div>
      <StyledDiv
        css={`
          margin-top: ${viewportKey === `mobile` ? `-30` : `-50`}px;
          position: relative;
          background: none;
          svg {
            fill: #ffffff;
          }
        `}
      >
        {breakTop}
      </StyledDiv>
    </>
  )
}

/*
  const yourJam = (
    <ul>
      <li>
        <h3 className="font-action text-orange text-xl">
          What&apos;s your jam?
        </h3>
      </li>
      <li>
        <p className="text-gray-700">
          Use these widgets to customize your web reading experience!
        </p>
      </li>
      <li className="mt-6">
        <div className="inline-flex">
          I prefer non-technical explanations
          <InformationCircleIcon
            className="h-6 w-6 mx-1"
            title="Set this to DISAGREE if you *want* to geek-out on all the tech under the hood!"
          />
        </div>
      </li>
      <li className="mt-2">
        <Belief
          value={{ slug: `NonTechnical`, scale: `agreement` }}
          cssClasses={``}
          storyFragmentId={storyFragmentId}
        />
      </li>
      <li className="mt-6">
        <div className="inline-flex">
          I&apos;m already familiar with Tract Stack
          <InformationCircleIcon
            className="h-6 w-6 mx-1"
            title="Already familiar? Sweet... all our introductory product marketing can be turned off!"
          />
        </div>
      </li>
      <li className="mt-2">
        <Belief
          value={{ slug: `AlreadyFamiliar`, scale: `tf` }}
          cssClasses={``}
          storyFragmentId={storyFragmentId}
        />
      </li>
      <li className="mt-6">
        To read more on our data practices and professional standards, please
        see{` `}
        <Link
          to={`/concierge/zeroParty`}
          className="no-underline hover:underline hover:underline-offset-1 text-blue hover:text-orange"
        >
          Zero Party data privacy policy
        </Link>
        .
      </li>
    </ul>
  )



      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="bg-white-gradient overflow-hidden"
      >
        <div className="absolute">
          <Hexa className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] xl:ml-[30rem] fill-white" />
        </div>
        <div className="md:flex md:flex-row md:flex-nowrap mx-auto md:pb-24">
          {branding}
          <div className="mt-8 mb-12 md:my-auto md:ml-16 p-6">
            <div className="w-full rounded-xl bg-story-controls p-6 max-w-xl mx-auto -rotate-1">
              {yourJam}
            </div>
          </div>
        </div>
      </div>

 */

export default AtRiskMedia
