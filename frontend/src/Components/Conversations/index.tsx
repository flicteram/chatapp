import { memo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useUserSelector from 'Components/User/useUserSelector'
import ConnectedUser from '@Interfaces/ConnectedUser';
import styles from './index.module.css'
import MultipleConvs from '@Interfaces/MulltipleConvs';
import GroupIcon from '@mui/icons-material/Group';
import Conversation from './components/Conversation';
import OtherUser from '@Interfaces/OtherUser';

interface Props{
  dataConversations:MultipleConvs[],
  connectedUsers:ConnectedUser[]
}

function Conversations({
  dataConversations,
  connectedUsers
}:Props ){
  const params = useParams()
  const navigate = useNavigate()
  const currentUser = useUserSelector()
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
    return date.toLocaleDateString( 'en-GB' )
  }, [])

  const handleClickConversation = ( convId: string ) => () => navigate( convId )

  const profilePictureToDisplay = useCallback( ( isGroup:boolean, singleParticipant:OtherUser ) =>{
    if( isGroup ){
      return (
        <GroupIcon
          data-testid="groupIcon"
          sx={{
            width: 30,
            height: 30
          }}/>
      )
    }else if( !singleParticipant?.picture ){
      return singleParticipant.username.slice( 0, 2 ).toUpperCase()
    }
    return singleParticipant?.picture
  }, [])

  const conversations = dataConversations.map( ( conv: MultipleConvs ) => {
    const isGroup = conv.participants.length>1
    const participantsUserNames = conv.participants.map( p=>p.username )
    const usernames = participantsUserNames.join( ', ' )
    const displayName = isGroup ? conv.groupName : usernames
    const [singleParticipant] = conv.participants
    const isUserOnline = !isGroup && connectedUsers.some( u => u?.username === singleParticipant.username )
    const profilePicture = profilePictureToDisplay( isGroup, singleParticipant )
    const displayLastMessageUsername = conv?.lastMessage?.sentBy?.username === currentUser.username ?
      `You: `
      :
      `${conv?.lastMessage?.sentBy?.username}: `
    const hasProfilePicture = !isGroup && !!singleParticipant.picture
    const isMessageSeen =
    conv?.lastMessage?.sentBy?._id === currentUser._id
    &&
    conv?.lastMessage?.seenByIds?.length === conv.participants.length
    const hasUnseenMessage =
    ( conv?.lastMessage?.sentBy?.username !== currentUser.username )
    &&
    !conv?.lastMessage?.seenByIds?.includes( currentUser._id )
    const isCurrentConversationSelected = conv._id === params.id

    return(
      <Conversation
        key={conv._id}
        isCurrentConversationSelected={isCurrentConversationSelected}
        hasUnseenMessage={hasUnseenMessage}
        isMessageSeen={isMessageSeen}
        hasProfilePicture={hasProfilePicture}
        profilePicture={profilePicture}
        handleClickConversation={handleClickConversation}
        conv={conv}
        isUserOnline={isUserOnline}
        displayName={displayName}
        displayLastMessageUsername={displayLastMessageUsername}
        handleDate={handleDate}
      />
    )
  })
  if ( !dataConversations.length ) {
    return <h3
      style={{
        textAlign: 'center',
        marginTop: "1em"
      }}>No conversations</h3>
  }
  return (
    <div className={styles.convsContainer}>
      {conversations}
    </div>
  )
}

export default memo( Conversations )