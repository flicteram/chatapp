import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from './Messages.module.css'
import { useCallback } from 'react'
import { MessageInfo } from './hooks/useMessageInfo';

interface Props{
  message: MessageInfo,
  participantsNumber:number,
}

export default function MessageRenderer({
  message, participantsNumber,
}:Props ){

  const handleDisplayTime = useCallback( ( dateMilSeconds: number ) => {
    const date = new Date( dateMilSeconds )
    return date.toLocaleTimeString( 'en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }, [])

  return (
    <button
      style={{ cursor: 'initial' }}
      className={styles.messageDataRenderer}>
      <p>{message.message} </p>
      <div>
        <span>{handleDisplayTime( message.sentAt )}</span>
        <DoneAllIcon
          style={{ fontSize: '1rem' }}
          color={participantsNumber === ( message.seenBy && message.seenBy.length ) ? "primary" : 'disabled'}
        />
      </div>
    </button>
  )
}