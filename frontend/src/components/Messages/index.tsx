import { Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'
import Conversation from '../../interfaces/Conversation';
import useUserSelector from '../User/useUserSelector';
import { useParams } from 'react-router-dom'
import { useSeenMessage } from './MessagesApi'
import SendMessage from '../../interfaces/SendMessage'
import GotNewMessages from '../../interfaces/GotNewMeessage'
import PendingMessage from '../PendingMessage';
import Message from './Message';
import OtherUser from '../../interfaces/OtherUser';

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  gotNewMessage: GotNewMessages,
  makeMessagesSeen: ()=>void,
  handleSeenLastMessage: () => void,
  pendingMessage: SendMessage | null,
  otherUser: OtherUser | undefined
}

export default function Messages(
  {
    socket, data, handleSeenLastMessage, gotNewMessage, pendingMessage, makeMessagesSeen, otherUser
  }: Props
) {
  const currentUser = useUserSelector()
  const convId = useParams()
  const [seenMsg, setSeenMsg] = useState(null);
  const [datesState, setDatesState] = useState<{
    [value: string]: number
  }>({})
  const { seenMessageRequest } = useSeenMessage()
  useEffect(() => {
    socket.current.on('gotSeenMessages', (seenMsgData) => {
      if (seenMsgData.convId === convId.id) {
        setSeenMsg(seenMsgData)
      }
    })
    return () => {
      socket.current.off("gotSeenMessages")
    }
  }, [])

  useEffect(() => {
    if (seenMsg !== null) {
      makeMessagesSeen()
    }
  }, [seenMsg])

  useEffect(() => {
    if (data?.messages.length) {
      seenMessageRequest()
      socket.current.emit("seenMessages", {
        seenBy: currentUser._id,
        seenToId: otherUser?._id,
        convId: convId.id
      })
      handleSeenLastMessage()
    }
    return () => {
      socket.current.off("seenMessages")
    }
  }, [gotNewMessage])

  useEffect(() => {
    const dates: {
      [value: string]: number
    } = {}
    data?.messages.forEach((m, index) => {
      const date = new Date(m.sentAt).toLocaleDateString('en-GB')
      dates[date] = index
    })
    setDatesState(dates)
  }, [data?.messages])

  return (
    <>
      <PendingMessage pendingMessage={pendingMessage}/>
      {data?.messages?.map((m, index) => (
        <Message
          datesState={datesState}
          message={m}
          messagePosition={index}
          key={m.sentAt}/>
      ))}
    </>
  )
}