import { memo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useUserSelector from 'Components/User/useUserSelector'
import UserAvatar from "Components/UserAvatar";
import ConnectedUser from '@Interfaces/ConnectedUser';
import styles from './index.module.css'
import MultipleConvs from '@Interfaces/MulltipleConvs';
import GroupIcon from '@mui/icons-material/Group';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface Props{
  dataConversations:MultipleConvs[],
  connectedUsers:ConnectedUser[]
}

function Conversations({
  dataConversations,
  connectedUsers
}:Props ){
  const navigate = useNavigate()
  const currentUser = useUserSelector()
  const params = useParams()
  const handleDate = useCallback( ( sentAt?: number ) => {
    if( !sentAt ) return ''
    const date = new Date( sentAt )
    const today = new Date()
    if ( date.toDateString() === today.toDateString() ) {
      return date.toLocaleTimeString( 'en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
    if ( date.toLocaleDateString( 'en-GB' ) === "Invalid Date" ) {
      return ''
    }
    return date.toLocaleDateString( 'en-GB' )
  }, [])

  if ( !dataConversations.length ) {
    return <h3
      style={{
        textAlign: 'center',
        marginTop: "1em"
      }}>No conversations</h3>
  }
  const handleClickConversation = ( convId: string ) => {
    return () => {
      navigate( convId )
    }
  }

  const conversations: JSX.Element[] = [];

  dataConversations.forEach( ( conv: MultipleConvs ) => {
    const isGroup = conv.participants.length>1
    const participantsUserNames = conv.participants.map( p=>p.username )
    const usernames = participantsUserNames.join( ', ' )
    const displayName = isGroup ? conv.groupName : usernames
    const [singleParticipant] = conv.participants
    const isUserOnline = !isGroup && connectedUsers.some( u => u?.username === singleParticipant.username )
    const profilePictureToDisplay = () =>{
      if( isGroup ){
        return (
          <GroupIcon
            sx={{
              width: 30,
              height: 30
            }}/>
        )
      }else if( !singleParticipant?.picture ){
        return singleParticipant.username.slice( 0, 2 ).toUpperCase()
      }
      return singleParticipant?.picture
    }
    const displayUsernameForGroup = conv?.lastMessage?.sentBy?.username === currentUser.username ?
      `You: `
      :
      `${conv?.lastMessage?.sentBy?.username}: `
    conversations.push(
      <button
        className={styles.convContainer}
        key={conv._id}
        onClick={handleClickConversation( conv._id )}
        style={conv._id === params.id ? { background: 'var(--gray)' } : {}}
      >
        <div className={styles.profilePicContainer}>
          <UserAvatar
            sx={{
              width: '55px',
              height: '55px'
            }}
            hasProfilePicture={!isGroup && !!singleParticipant.picture}
            isLoading={false}
            pictureToShow={profilePictureToDisplay()}
          />
          <div
            className={styles.statusProfile}
            style={{ display: isUserOnline ? "unset" : "none" }} />
        </div>
        <div className={styles.convLeftContainer}>
          <div className={styles.convLeft}>
            <div className={styles.convLeftInfo}>
              <h3>{displayName}</h3>
              {conv?.lastMessage?.sentBy &&
                  <span>
                    {displayUsernameForGroup}
                    {conv.lastMessage.message}
                  </span>
              }
            </div>
            <div className={styles.convRight}>
              <span>{handleDate( conv?.lastMessage?.sentAt )}</span>
              {conv?.lastMessage?.message &&
              <span
                className={styles.newMessage}
                style={( conv.lastMessage.sentBy.username !== currentUser.username )
                  &&
                  !conv?.lastMessage?.seenByIds?.includes( currentUser._id ) ? { display: "unset" } : { display: 'none' }
                }
              />
              }
              { conv?.lastMessage?.sentBy?._id === currentUser._id
                &&
                conv.lastMessage.seenByIds?.length === conv.participants.length
                &&
                <DoneAllIcon
                  color='primary'
                  fontSize='small'/>
              }
            </div>
          </div>
        </div>
      </button>
    )
  })

  return (
    <div className={styles.convsContainer}>
      {conversations}
    </div>
  )
}

export default memo( Conversations )