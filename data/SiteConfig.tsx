import { IStoryKeepConfig } from "../src/types"

export const config: IStoryKeepConfig = {
  openDemo: typeof process.env.OPENDEMO !== `undefined` && process.env.OPENDEMO === `true` ? true : false,
  messageDelay: typeof process.env.MESSAGE_DELAY !== `undefined` ? parseInt(process.env.MESSAGE_DELAY) : 7000,
  home: process.env.HOMEPAGE || ``,
  slogan: process.env.SLOGAN || `SLOGAN`,
}
