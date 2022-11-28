import { useParams } from "react-router-dom"
import { useGetConversation, useSendMessage } from './ConversationAPI'
import { useEffect, useRef, useState, memo } from "react"
import { useOutletContext } from "react-router-dom"
import useUserSelector from '../../components/User/useUserSelector';
import GotNewMessage from "../../interfaces/GotNewMeessage";
// import Conv from '../../interfaces/Conversation'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Socket } from 'socket.io-client'
import Messages from '../../components/Messages/Messages'
import SendMessage from '../../interfaces/SendMessage'
import ConnectedUser from "../../interfaces/ConnectedUser";
import OtherUser from '../../components/OtherUser/OtherUser'
import CustomLoader from "../../components/CustomLoader/CustomLoader";
import styles from './Conversation.module.css'
import MessageInput from '../../components/MessageInput/MessageInput'
import Skeleton from '@mui/material/Skeleton'

interface OutletContext {
  socket: {
    current: Socket
  },
  connectedUsers: ConnectedUser[],
  gotNewMessage: GotNewMessage,
  handleSeenLastMessage: () => void,
  addLastMessageAndSortConversations: (sendToId: string, message: SendMessage) => void
}

function Conversation() {
  const {
    socket, gotNewMessage, handleSeenLastMessage, addLastMessageAndSortConversations,
    connectedUsers
  } = useOutletContext<OutletContext>()
  const [pendingMessages, setPendingMessages] = useState<SendMessage[]>([])
  const currentUser = useUserSelector()
  const viewRef = useRef<HTMLDivElement>(null)
  const convId = useParams()
  const {
    request, data, isLoading, setNewMsg, hasMore, error,
  } = useGetConversation()
  const {
    sendMessageData, sendMessageLoading, sendMessageRequest
  } = useSendMessage()

  const otherUser = data?.participants.find(u => u._id !== currentUser._id)

  const handleSendMessage = async (msg: string) => {
    const dateNow = new Date()
    const newMessage = {
      message: msg,
      sentBy: {
        username: currentUser.username,
        _id: currentUser._id
      },
      sentAt: dateNow.getTime(),
      seen: false,
    }
    setPendingMessages(prevState=>[...prevState, newMessage])
    await sendMessageRequest(newMessage)
    socket.current.emit('sendMessage', {
      newMessage,
      sentToId: otherUser?._id,
      convId: convId.id
    })
    convId.id && addLastMessageAndSortConversations(convId.id, newMessage)
  }

  useEffect(() => {
    if (sendMessageData !== null) {
      setNewMsg(prevState => (prevState ? {
        ...prevState,
        messages: [sendMessageData, ...prevState.messages]
      } : null))
      setPendingMessages(prevState=>prevState.slice(1))
    }
  }, [sendMessageData])

  useEffect(() => {
    if (gotNewMessage !== null && gotNewMessage.convId === convId.id) {
      setNewMsg(prevState => (prevState ? {
        ...prevState,
        lastMessage: gotNewMessage.newMessage,
        messages: [gotNewMessage.newMessage, ...prevState.messages]
      } : null))
    }
  }, [gotNewMessage])

  useEffect(() => {
    const timeout = setTimeout(() => {
      viewRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => {
      clearTimeout(timeout)
    }
  }, [gotNewMessage, sendMessageData, sendMessageLoading])
  useEffect(() => {
    const controller = new AbortController()
    request(controller, 20)
    return () => {
      controller.abort()
    }
  }, [convId.id])

  if (error) return <h2>{error}</h2>
  if (isLoading) return <CustomLoader />
  return (
    <div className={styles.container}>
      <OtherUser
        otherUser={otherUser}
        isOnline={connectedUsers.find(u => u.userId === otherUser?._id) !== undefined ? true : false}
      />
      <div
        className={styles.scrollableDiv}
        style={{ flexDirection: data?.messages.length ? 'column-reverse' : 'column' }}
        id="scrollableDiv"
      >
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          style={{
            display: 'flex',
            flexDirection: data?.messages.length ? 'column-reverse' : 'column'
          }}
          hasMore={hasMore}
          dataLength={data?.messages.length || 0}
          inverse={true}
          next={() => request(undefined, 0)}
          loader={<p>Loading...</p>}
        >
          <div
            ref={viewRef}>
          </div>
          {/* {sendMessageLoading &&
            <Skeleton
              className={styles.sendingMsg}
              variant="text"
              width={100}
              height={50}
            />
          } */}

          {data?.messages?.length === 0 ? <span
            style={{
              alignSelf: 'center',
              marginTop: '1em'
            }}>Be the first to send a message</span> :
            <Messages
              socket={socket}
              data={data}
              sendMessageData={sendMessageData}
              gotNewMessage={gotNewMessage}
              setNewMsg={setNewMsg}
              handleSeenLastMessage={handleSeenLastMessage}
              pendingMessages={pendingMessages}
            />
          }
        </InfiniteScroll>
      </div>
      <MessageInput
        handleSendMessage={handleSendMessage}
        sendMessageLoading={sendMessageLoading}

      />

    </div >

  )
}

export default memo(Conversation)