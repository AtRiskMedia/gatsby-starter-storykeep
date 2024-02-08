import { client } from './axiosClient'
import {
  IAxiosTriggerPublishProps,
  IAxiosConnectProps,
  IAxiosStoryFragmentProps,
} from '../types'

export async function connect({ fingerprint }: IAxiosConnectProps) {
  const secret = process.env.BUILDER_SECRET_KEY || ``
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
  return null
}

export async function getStoryFragmentDaysSince() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/storyFragmentDaysSince`)
  return null
}

export async function getPanesDaysSince() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/panesDaysSince`)
  return null
}

export async function getDashboardPayloads() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/dashboard`)
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
  return null
}

export async function getSettings() {
  if (process.env.NODE_ENV !== `development`)
    return client.get(`/builder/settings`)
  return null
}

export async function postSettings({ payload }: any) {
  if (process.env.NODE_ENV !== `development`)
    return client.post(`/builder/settings`, payload)
  return null
}

export async function postPublish({ payload }: any) {
  if (process.env.NODE_ENV !== `development`)
    return client.post(`/builder/publish`, payload)
  return null
}
