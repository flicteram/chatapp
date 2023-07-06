import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from './Messages.module.css'
import SendMessage from '../../interfaces/SendMessage';
import { useCallback } from 'react'
import useUserSelector from '../User/useUserSelector';

interface Props{
  message: SendMessage,
  participantsNumber:number,
  isMessageByCurrentUser:boolean,
  handleMessageInfo?:( message:SendMessage, isSelfMessage:boolean )=>()=>void,
}

export default function MessageRenderer({
  isMessageByCurrentUser, message, participantsNumber, handleMessageInfo
}:Props ){
  const currentUser = useUserSelector()

  const styleButton = isMessageByCurrentUser && participantsNumber>1 ?
    { cursor: 'pointer' }
    :
    { cursor: 'initial' }
  const styleMessageContainer = !isMessageByCurrentUser?{
    borderRadius: '10px',
    borderBottomLeftRadius: '0px'
  }:{}

  const handleDisplayTime = useCallback( ( dateMilSeconds: number ) => {
    const date = new Date( dateMilSeconds )
    return date.toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }, [])

  return (
    <div
      className={styles.messageContainer}
      style={styleMessageContainer}>
      {
        ( participantsNumber>1 && !isMessageByCurrentUser )
        &&
        <span className={styles.messageUsername}>{message.sentBy.username}</span>
      }
      <button
        style={styleButton}
        onClick={handleMessageInfo && handleMessageInfo( message, isMessageByCurrentUser )}
        className={styles.messageData}>
        <p>{message.message} </p>
        <div>
          <span>{handleDisplayTime( message.sentAt )}</span>
          {
            message.sentBy.username === currentUser.username
            &&
            <DoneAllIcon
              style={{ fontSize: '1rem' }}
              color={participantsNumber === message?.seenBy?.length ? "primary" : 'disabled'}
            />
          }
        </div>
      </button>
    </div>
  )
}