import { useEffect } from 'react'
import { IReactChild, Stages } from '../types'

import { useDrupalStore } from '../stores/drupal'
import { useAuthStore } from '../stores/authStore'
import { getTokens } from '../api/axiosClient'

const ConciergeAPI = ({ children }: IReactChild) => {
  const login = useAuthStore((state) => state.login)
  const validToken = useAuthStore((state) => state.validToken)
  const stage = useDrupalStore((state) => state.stage)
  const setStage = useDrupalStore((state) => state.setStage)
  const openDemoEnabled = useDrupalStore((state) => state.openDemoEnabled)

  // initialize (connect to concierge)
  useEffect(() => {
    switch (stage) {
      case Stages.Initialize:
        if (process.env.NODE_ENV === `development`) setStage(Stages.Activated)
        else {
          setStage(Stages.Initializing)
          getTokens(`builder`).then((res) => login(res))
        }
        break

      case Stages.Initializing:
        if (validToken) setStage(Stages.Initialized)
        break

      case Stages.Initialized:
        setStage(Stages.Activated)
        break
    }
  }, [login, stage, setStage, openDemoEnabled, validToken])

  if (stage === Stages.Activated) return children
  return null
}

export default ConciergeAPI
