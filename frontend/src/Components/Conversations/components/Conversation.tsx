import UserAvatar from "Components/UserAvatar";
import styles from '../index.module.css'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import MultipleConvs from '@Interfaces/MulltipleConvs';

interface Props{
  conv:MultipleConvs,
  isUserOnline:boolean,
  displayName:string,
  displayLastMessageUsername:string,
  handleClickConversation:( convId:string )=>()=>void,
  handleDate:( sentAt?:number )=>string,
  profilePicture:string|JSX.Element,
  hasProfilePicture:boolean,
  isMessageSeen:boolean,
  hasUnseenMessage:boolean,
  isCurrentConversationSelected:boolean
}

export default function Conversation({
  conv,
  isUserOnline,
  displayName,
  displayLastMessageUsername,
  handleClickConversation,
  handleDate,
  profilePicture,
  hasProfilePicture,
  isMessageSeen,
  hasUnseenMessage,
  isCurrentConversationSelected
}:Props ){

  return(
    <button
      data-testid="convContainer"
      className={styles.convContainer}
      onClick={handleClickConversation( conv._id )}
      style={isCurrentConversationSelected ? { background: 'var(--gray)' } : {}}
    >
      <div className={styles.profilePicContainer}>
        <UserAvatar
          sx={{
            width: '55px',
            height: '55px'
          }}
          hasProfilePicture={hasProfilePicture}
          isLoading={false}
          pictureToShow={profilePicture}
        />
        <div
          className={styles.statusProfile}
          data-testid="statusProfile"
          style={{ display: isUserOnline ? "unset" : "none" }} />
      </div>
      <div className={styles.convLeftContainer}>
        <div className={styles.convLeft}>
          <div className={styles.convLeftInfo}>
            <h3>{displayName}</h3>
            {conv?.lastMessage?.sentBy &&
                  <span>
                    {displayLastMessageUsername}
                    {conv.lastMessage.message}
                  </span>
            }
          </div>
          <div className={styles.convRight}>
            <span>{handleDate( conv?.lastMessage?.sentAt )}</span>
            {conv?.lastMessage?.message &&
              <span
                data-testid="newMessage"
                className={styles.newMessage}
                style={{ display: hasUnseenMessage ? "unset" : "none" }}
              />
            }
            { isMessageSeen &&
                <DoneAllIcon
                  data-testid="doneAllIcon"
                  color='primary'
                  fontSize='small'/>
            }
          </div>
        </div>
      </div>
    </button>
  )
}