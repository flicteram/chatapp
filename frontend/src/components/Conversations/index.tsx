import { memo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Conv from '../../interfaces/Conversation'
import useUserSelector from '../../components/User/useUserSelector'
import UserAvatar from "../../components/UserAvatar";
import ConnectedUser from '../../interfaces/ConnectedUser';
import styles from './index.module.css'

interface Props{
  dataConversations:Conv[],
  connectedUsers:ConnectedUser[]
}

function Conversations({
  dataConversations,
  connectedUsers
}:Props){
  const navigate = useNavigate()
  const currentUser = useUserSelector()
  const params = useParams()
  const handleDate = useCallback((sentAt: number) => {
    const date = new Date(sentAt)
    const today = new Date()
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: 'numeric'
      })
    }
    if (date.toLocaleDateString('en-GB') === "Invalid Date") {
      return ''
    }
    return date.toLocaleDateString('en-GB')
  }, [])

  if (!dataConversations.length) {
    return <h3
      style={{
        textAlign: 'center',
        marginTop: "1em"
      }}>No conversations</h3>
  }
  const handleClickConversation = (convId: string) => {
    return () => {
      navigate(convId)
    }
  }

  const conversations: JSX.Element[] = [];
  dataConversations.forEach((conv: Conv) => {
    const participant = conv.participants.find(i => i.username !== currentUser.username)
    const isUserOnline = connectedUsers.some(u => u?.username === participant?.username)
    conversations.push(
      <button
        className={styles.convContainer}
        key={conv._id}
        onClick={handleClickConversation(conv._id)}
        style={conv._id === params.id ? { background: 'var(--gray)' } : {}}
      >
        <div className={styles.profilePicContainer}>
          <UserAvatar
            sx={{
              width: '55px',
              height: '55px'
            }}
            hasProfilePicture={!!participant?.picture}
            isLoading={false}
            pictureToShow={participant?.picture || participant?.username?.slice(0, 2).toUpperCase() }
          />
          <div
            className={styles.statusProfile}
            style={{ display: isUserOnline ? "unset" : "none" }} />
        </div>
        <div className={styles.convLeftContainer}>
          <div className={styles.convLeft}>
            <div className={styles.convLeftInfo}>
              <h3>{participant?.username}</h3>
              {conv?.lastMessage.sentBy &&
                  <span>
                    {conv.lastMessage.message}
                  </span>
              }
            </div>
            <div className={styles.convRight}>
              <span>{handleDate(conv.lastMessage.sentAt)}</span>
              <span
                className={styles.newMessage}
                style={(conv?.lastMessage?.sentBy?.username !== currentUser.username)
                    &&
                    conv?.lastMessage?.seen === false ? { display: "unset" } : { display: 'none' }
                }
              />
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

export default memo(Conversations)