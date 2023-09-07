import CircularProgress from '@mui/material/CircularProgress';
import styles from '../Messages/Messages.module.css'
import SendMessage from '@Interfaces/SendMessage'

interface Props {
  pendingMessage?: SendMessage
}

export default function PendingMessage({ pendingMessage }:Props ){
  if( !pendingMessage ){
    return null
  }
  return (
    <div
      className={styles.container}
      style={{ alignItems: 'flex-end' }}>
      <div className={styles.messageContainer}>
        <div className={styles.messageData}>
          <p>{pendingMessage.message}</p>
          <div>
            <CircularProgress
              data-testid="loadingPendingMessage"
              disableShrink
              color='primary'
              style={{
                color: 'var(--tealGreen)',
                padding: '0'
              }}
              size={15}/>
          </div>
        </div>
      </div>
    </div>
  )
}