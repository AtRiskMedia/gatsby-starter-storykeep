import { useEffect, useState, useMemo } from 'react'
import { IReactChild } from 'src/types'
import { useAuthenticated } from '@tractstack/drupal-react-oauth-provider'

import { useDrupalStore } from '../stores/drupal'

const DrupalUuid = ({ children }: IReactChild) => {
  const isAuthenticated = useAuthenticated()
  const [checked, setChecked] = useState(false)
  const [isUuidCheckSoftLock, setIsUuidCheckSoftLock] = useState(false)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)
  const setDrupalQueue = useDrupalStore((state) => state.setDrupalQueue)
  const setOauthDrupalUuid = useDrupalStore((state) => state.setOauthDrupalUuid)
  const setOauthDrupalRoles = useDrupalStore(
    (state) => state.setOauthDrupalRoles,
  )
  const removeDrupalResponse = useDrupalStore(
    (state) => state.removeDrupalResponse,
  )
  const drupalResponse = useDrupalStore((state) => state.drupalResponse)

  const uuidCheck = useMemo(() => {
    if (
      !openDemoEnabled &&
      process.env.NODE_ENV !== `development` &&
      !checked &&
      isAuthenticated
    ) {
      const payload = {
        endpoint: `uuid/`,
        method: `GET`,
      }
      setDrupalQueue(`uuid`, payload)
      setTimeout(() => setIsUuidCheckSoftLock(true), 0)
      return true
    }
    return false
  }, [
    openDemoEnabled,
    isAuthenticated,
    checked,
    setDrupalQueue,
    setIsUuidCheckSoftLock,
  ])

  useEffect(() => {
    if (
      !openDemoEnabled &&
      isAuthenticated &&
      !checked &&
      isUuidCheckSoftLock &&
      uuidCheck &&
      drupalResponse?.uuid
    ) {
      const data = drupalResponse.uuid
      if (data && Object.keys(data).length) {
        const oauthDrupaUuid = data[0].uuid
        const oauthDrupalRoles = data[0].roles_target_id
        setOauthDrupalUuid(oauthDrupaUuid)
        setOauthDrupalRoles(oauthDrupalRoles)
        removeDrupalResponse(`uuid`)
        setChecked(true)
      }
    }
  }, [
    openDemoEnabled,
    isAuthenticated,
    checked,
    uuidCheck,
    isUuidCheckSoftLock,
    drupalResponse,
    removeDrupalResponse,
    setOauthDrupalRoles,
    setOauthDrupalUuid,
  ])

  return children
}

export default DrupalUuid
