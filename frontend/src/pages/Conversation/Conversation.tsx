import { useEffect, useRef, memo, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import GotNewMessage from "@Interfaces/GotNewMeessage";
import InfiniteScroll from 'react-infinite-scroll-component';
import { Socket } from 'socket.io-client'
import Messages from 'Components/Messages'
import SendMessage from '@Interfaces/SendMessage'
import ConnectedUser from "@Interfaces/ConnectedUser";
import CustomLoader from "Components/CustomLoader/CustomLoader";
import styles from './Conversation.module.css'
import MessageInput from 'Components/MessageInput/MessageInput'
import useConversation from "./hooks/useConversation";
import ConversationHeader from "Components/ConversationHeader";
import GotSeenMessage from "@Interfaces/GotSeenMessage";
import { useParams } from 'react-router-dom';

interface OutletContext {
  socket: {
    current: Socket
  },
  connectedUsers: ConnectedUser[],
  gotNewMessage: GotNewMessage,
  handleSeenLastMessage: () => void,
  addLastMessageAndSortConversations: ( sendToId: string, message: SendMessage ) => void,
  handleWindowHeight:{height?:number},
  windowHeight:number,
  gotSeenMsg?:GotSeenMessage
}
function Conversation() {
  const {
    socket,
    gotNewMessage,
    handleSeenLastMessage,
    addLastMessageAndSortConversations,
    connectedUsers,
    handleWindowHeight,
    windowHeight,
    gotSeenMsg
  } = useOutletContext<OutletContext>()
  const viewRef = useRef<HTMLDivElement>( null )
  const {
    errorConversation,
    getConversation,
    handleSendMessage,
    hasMoreMessages,
    isConversationLoading,
    pendingMessage,
    sendMessageLoading,
    conversationData,
    makeMessagesSeen,
    otherUsersIds,
    convUsersData,
    convUsersLoading
  } = useConversation( addLastMessageAndSortConversations, socket, gotNewMessage )

  const { id: convId } = useParams()

  useEffect( () => {
    const timeout = setTimeout( () => {
      viewRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 200 )
    return () => {
      clearTimeout( timeout )
    }
  }, [gotNewMessage, sendMessageLoading, windowHeight])

  useEffect( () => {
    if ( gotSeenMsg && gotSeenMsg?.convId === convId ) {
      makeMessagesSeen( gotSeenMsg )
    }
  }, [gotSeenMsg?.seenBy.seenAt])

  const conversationHasMessages = useMemo( ()=>!!conversationData?.messages.length, [conversationData?.messages.length])

  if ( errorConversation ) return <h2
    style={{
      textAlign: 'center',
      alignSelf: 'center'
    }}>{errorConversation}</h2>
  if ( isConversationLoading ) return <CustomLoader />
  return (
    <div
      className={styles.container}
      style={handleWindowHeight}>
      <ConversationHeader
        groupName={conversationData?.groupName || ""}
        convUsersData={convUsersData}
        convUsersLoading={convUsersLoading}
        connectedUsers={connectedUsers}
        otherUsersIds={otherUsersIds}/>
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
          next={getConversation}
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
              convUsersData={convUsersData}
              socket={socket}
              otherUsersIds={otherUsersIds}
              data={conversationData}
              gotNewMessage={gotNewMessage}
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
export default memo( Conversation )