import { client } from './axiosClient'
import {
  IAxiosTriggerPublishProps,
  IAxiosConnectProps,
  IAxiosStoryFragmentProps,
} from '../types'

export async function connect({ fingerprint }: IAxiosConnectProps) {
  const secret = process.env.CONCIERGE_SECRET || ``
  const payload = {
    fingerprint,
    secret,
  }
  const options: any = { authorization: false }
  return client.post(`/auth/builderConnect`, payload, options)
}

export async function getGraph() {
  return client.get(`/graph/graph`)
}

export async function getPaneDetailsPie({
  storyFragmentId,
}: IAxiosStoryFragmentProps) {
  const payload = {
    storyFragmentId,
  }
  if (process.env.NODE_ENV !== `development`)
    return client.post(`/builder/paneDetailsPie`, payload)
  console.log(`dev mode: skipping paneDetailsPie`)
  return null
}

export async function getStoryFragmentDaysSince() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/storyFragmentDaysSince`)
  console.log(`dev mode: skipping storyFragmentDaysSince`)
  return null
}

export async function getPanesDaysSince() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/panesDaysSince`)
  console.log(`dev mode: skipping panesDaysSince`)
  return null
}

export async function getDashboardPayloads() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/dashboard`)
  console.log(`dev mode: skipping getDashboardPayloads`)
  return null
}

export async function getTriggerPublish({
  tailwindArray,
}: IAxiosTriggerPublishProps) {
  const payload = {
    tailwindArray,
  }
  if (process.env.NODE_ENV !== `development`)
    return client.post(`/builder/publish`, payload)
  console.log(`dev mode: skipping triggerPublish`)
  return null
}
