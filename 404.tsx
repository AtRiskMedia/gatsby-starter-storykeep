import { useEffect } from 'react'
import { navigate } from 'gatsby'

const PageNotFound = () => {
  useEffect(() => {
    navigate(`/`, { replace: true })
  }, [])
  return null
}

export default PageNotFound
