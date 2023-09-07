import OtherUser from '../../OtherUser';
import MessageRendererModal from './MessageRendererModal';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from '../Messages.module.css'
import Dialog from '@mui/material/Dialog';
import { MessageInfo } from '../hooks/useMessageInfo';
interface Props{
  toggleDialog:()=>void,
  isDialogOpen:boolean,
  messageInfo:MessageInfo,
  participantsNumber?:number,

}
export default function MessageInfoDialog({
  toggleDialog, isDialogOpen, participantsNumber, messageInfo
}:Props ){
  return (
    <Dialog
      open={isDialogOpen}
      onClose={toggleDialog}
    >
      <div
        className={styles.dialogInfoContainer}>
        <MessageRendererModal
          message={messageInfo}
          participantsNumber={participantsNumber}
        />
        <div className={styles.seenByContainer}>
          <h3>Seen by</h3>
          <DoneAllIcon color="primary"/>
        </div>
        {messageInfo?.seenBy?.length ?
          messageInfo.seenBy.map( user=>(
            <div
              style={{
                display: 'flex',
                gap: '.5em',
              }}
              key={user._id}
            >
              <OtherUser
                isUserLoading={false}
                otherUserData={user}
                key={user._id}
                seenAt={user.seenAt}
              />
            </div>
          ) )
          :
          <h4>No one saw the message yet</h4>
        }
      </div>
    </Dialog>
  )
}