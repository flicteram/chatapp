import useUserSelector from "../User/useUserSelector"
import styles from './Messages.module.css'
import SendMessage from '../../interfaces/SendMessage'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useMemo, useCallback } from 'react'

interface Props{
  message: SendMessage,
  messagePosition: number,
  datesState:{
    [value: string]: number
  }
}

export default function Message({
  message, messagePosition, datesState
}: Props){
  const currentUser = useUserSelector()
  const handleDisplayTime = useCallback((dateMilSeconds: number) => {
    const date = new Date(dateMilSeconds)
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }, [])
  const getDate = useCallback((date: number) => {
    return new Date(date).toLocaleDateString('en-GB')
  }, [])

  const isMessageByCurrentUser = message.sentBy._id === currentUser._id

  const showDate = useMemo(()=>{
    return datesState[getDate(message.sentAt)] === messagePosition
  }, [datesState])

  return (
    <div
      className={styles.container}
      key={message.sentAt}
      style={{ alignItems: isMessageByCurrentUser ? 'flex-end' : 'flex-start' }}>
      { showDate &&
      <span
        className={styles.date}>
        {getDate(message.sentAt)}
      </span>
      }
      <div className={isMessageByCurrentUser ? styles.messageData : styles.messageDataLeft}>
        <p>{message.message} </p>
        <div>
          <span>{handleDisplayTime(message.sentAt)}</span>
          {
            message.sentBy.username === currentUser.username
          &&
          <DoneAllIcon
            style={{ fontSize: '1rem' }}
            color={message.seen ? "primary" : 'disabled'} />
          }
        </div>
      </div>
    </div>
  )
}