import { useEffect, useRef, memo, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import GotNewMessage from "../../interfaces/GotNewMeessage";
// import Conv from '../../interfaces/Conversation'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Socket } from 'socket.io-client'
import Messages from '../../components/Messages'
import SendMessage from '../../interfaces/SendMessage'
import ConnectedUser from "../../interfaces/ConnectedUser";
import OtherUser from '../../components/OtherUser/OtherUser'
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import styles from './Conversation.module.css'
import MessageInput from '../../components/MessageInput/MessageInput'
import useConversation from "./hooks/useConversation";

interface OutletContext {
  socket: {
    current: Socket
  },
  connectedUsers: ConnectedUser[],
  gotNewMessage: GotNewMessage,
  handleSeenLastMessage: () => void,
  addLastMessageAndSortConversations: (sendToId: string, message: SendMessage) => void,
  handleWindowHeight:{height?:number},
  windowHeight:number
}

function Conversation() {
  const {
    socket, gotNewMessage, handleSeenLastMessage, addLastMessageAndSortConversations,
    connectedUsers, handleWindowHeight, windowHeight
  } = useOutletContext<OutletContext>()
  const viewRef = useRef<HTMLDivElement>(null)
  const {
    errorConversation,
    getConversation,
    handleSendMessage,
    hasMoreMessages,
    isConversationLoading,
    pendingMessage,
    sendMessageLoading,
    otherUser,
    conversationData,
    makeMessagesSeen
  } = useConversation(addLastMessageAndSortConversations, socket, gotNewMessage)

  useEffect(() => {
    const timeout = setTimeout(() => {
      viewRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [gotNewMessage, sendMessageLoading, windowHeight])

  const conversationHasMessages = useMemo(()=>!!conversationData?.messages.length, [conversationData?.messages.length])

  if (errorConversation) return <h2
    style={{
      textAlign: 'center',
      alignSelf: 'center'
    }}>{errorConversation}</h2>
  if (isConversationLoading) return <CustomLoader />
  return (
    <div
      className={styles.container}
      style={handleWindowHeight}>
      <OtherUser
        otherUser={otherUser}
        isOnline={connectedUsers.find(u => u.userId === otherUser?._id) !== undefined ? true : false}
      />
      <div
        className={styles.scrollableDiv}
        style={{ flexDirection: conversationHasMessages ? 'column-reverse' : 'column' }}
        id="scrollableDiv"
      >
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          style={{
            display: 'flex',
            flexDirection: conversationHasMessages ? 'column-reverse' : 'column'
          }}
          hasMore={hasMoreMessages}
          dataLength={conversationData?.messages.length || 0}
          inverse={true}
          next={() => getConversation(undefined, 0)}
          loader={<p>Loading...</p>}
        >
          <div
            ref={viewRef}/>
          {!conversationHasMessages ?
            <span
              style={{
                alignSelf: 'center',
                marginTop: '1em'
              }}>
                Be the first to send a message
            </span> :
            <Messages
              socket={socket}
              otherUser={otherUser}
              data={conversationData}
              gotNewMessage={gotNewMessage}
              makeMessagesSeen={makeMessagesSeen}
              handleSeenLastMessage={handleSeenLastMessage}
              pendingMessage={pendingMessage}
            />
          }
        </InfiniteScroll>
      </div>
      <MessageInput
        handleSendMessage={handleSendMessage}
        sendMessageLoading={sendMessageLoading}
      />
    </div>

  )
}

export default memo(Conversation)