// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'

import { IMessage } from 'src/types'

const Message = ({ className, children }: IMessage) => {
  const [alert, setAlert] = useState(true)
  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 7000)
  }, [])
  return alert ? <div className={className}>{children}</div> : null
}

export default Message
