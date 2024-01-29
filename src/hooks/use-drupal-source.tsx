import { useState } from 'react'
import { useDrupalStore } from '../stores/drupal'
import { Stages } from '../types'

export const useDrupalSource = async () => {
  const [locked, setLocked] = useState(false)
  const stage = useDrupalStore((state) => state.stage)
  const updateIngestSource = useDrupalStore((state) => state.updateIngestSource)
  const allCollections = useDrupalStore((state) => state.allCollections)
  const regexp = /(file|node|paragraph)--([_a-z]+[_a-z0-9]*$)/
  const apiBase = process.env.DRUPAL_APIBASE
  const baseURL = process.env.DRUPAL_URL_BACK

  if (stage === Stages.SourceLoad && !locked) {
    setLocked(true)
    const sourced = Object.keys(allCollections).map((e: string) => {
      const result = e.match(regexp)
      if (result && result[1] && result[2]) {
        switch (result[1]) {
          case `node`:
          case `menu`:
          case `file`:
            return [result[1], result[2]]
        }
      }
      return null
    })
    const pagination: string[] = []
    const payload = await Promise.all(
      sourced.map((result: any) => {
        if (result && result[0] && result[1]) {
          const thisURL =
            result[0] === `node` && result[1] === `markdown`
              ? `${baseURL}${apiBase}/${result[0]}/${result[1]}?include=field_image,field_image_svg&fields[file--file]=uri,url,filemime,filename`
              : `${baseURL}${apiBase}/${result[0]}/${result[1]}`
          return fetch(thisURL)
        }
        return null
      }),
    ).then(async (res) => {
      return Promise.all(
        res.map(async (data) => {
          if (data) {
            const response = await data.json()
            if (response.links.next?.href)
              pagination.push(response.links.next.href)
            return response
          } else return null
        }),
      )
    })
    payload?.forEach((c) => {
      if (c !== null) {
        c?.data?.forEach((e: any) => {
          updateIngestSource(e)
        })
        c?.included?.forEach((e: any) => {
          updateIngestSource(e)
        })
      }
    })
    while (pagination.length) {
      const thisUrl = pagination.shift()
      if (typeof thisUrl === `string`) {
        const response = await fetch(thisUrl)
        if (response.status === 200) {
          const data = await response.json()
          data.data?.forEach((e: any) => {
            updateIngestSource(e)
          })
          data.included?.forEach((e: any) => {
            updateIngestSource(e)
          })
        }
      }
    }
    return true
  }
  return null
}
