import CircularProgress from '@mui/material/CircularProgress';
import styles from '../Messages/Messages.module.css'
import SendMessage from '../../interfaces/SendMessage'

interface Props {
  pendingMessage: SendMessage | null
}

export default function PendingMessage({ pendingMessage }:Props){
  if(!pendingMessage){
    return null
  }
  return (
    <div
      className={styles.container}
      style={{ alignItems: 'flex-end' }}>
      <div className={styles.messageData}>
        <p>{pendingMessage.message}</p>
        <div>
          <CircularProgress
            disableShrink
            color='primary'
            style={{ color: 'var(--tealGreen)' }}
            size={15}/>
        </div>
      </div>
    </div>
  )
}