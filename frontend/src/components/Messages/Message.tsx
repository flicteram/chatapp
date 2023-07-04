import useUserSelector from "../User/useUserSelector"
import styles from './Messages.module.css'
import SendMessage from '../../interfaces/SendMessage'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useMemo, useCallback } from 'react'

interface Props{
  message: SendMessage,
  messagePosition: number,
  participantsNumber:number,
  datesState:{
    [value: string]: number
  }
}

export default function Message({
  message,
  messagePosition,
  datesState,
  participantsNumber
}: Props ){
  const currentUser = useUserSelector()
  const handleDisplayTime = useCallback( ( dateMilSeconds: number ) => {
    const date = new Date( dateMilSeconds )
    return date.toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }, [])
  const getDate = useCallback( ( date: number ) => {
    return new Date( date ).toLocaleDateString( 'en-GB' )
  }, [])

  const isMessageByCurrentUser = message.sentBy._id === currentUser._id

  const showDate = useMemo( ()=>{
    return datesState[getDate( message.sentAt )] === messagePosition
  }, [datesState])

  return (
    <div
      className={styles.container}
      key={message.sentAt}
      style={{ alignItems: isMessageByCurrentUser ? 'flex-end' : 'flex-start' }}>
      { showDate &&
      <span
        className={styles.date}>
        {getDate( message.sentAt )}
      </span>
      }
      <div
        className={styles.messageContainer}
        style={!isMessageByCurrentUser?{
          borderRadius: '10px',
          borderBottomLeftRadius: '0px'
        }:{}}

      >
        {
          ( participantsNumber>1 && !isMessageByCurrentUser )
          &&
        <span className={styles.messageUsername}>{message.sentBy.username}</span>
        }
        <div className={styles.messageData}>
          <p>{message.message} </p>
          <div>
            <span>{handleDisplayTime( message.sentAt )}</span>
            {
              message.sentBy.username === currentUser.username
          &&
          <DoneAllIcon
            style={{ fontSize: '1rem' }}
            color={participantsNumber === message.seenBy.length ? "primary" : 'disabled'}
          />
            }
          </div>
        </div>
      </div>

    </div>
  )
}