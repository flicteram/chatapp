import { Socket } from 'socket.io-client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Conversation from '../../interfaces/Conversation';
import useUserSelector from '../../components/User/useUserSelector';
import { useParams } from 'react-router-dom'
import { useSeenMessage } from './MessagesApi'
import SendMessage from '../../interfaces/SendMessage'
import GotNewMessages from '../../interfaces/GotNewMeessage'
import Conv from '../../interfaces/Conversation';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import styles from './Messages.module.css'

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  sendMessageData: SendMessage | null,
  gotNewMessage: GotNewMessages,
  setNewMsg: Dispatch<SetStateAction<Conv | null>>,
  handleSeenLastMessage: () => void

}

export default function Messages(
  {
    socket, data, setNewMsg, handleSeenLastMessage, gotNewMessage
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
      setNewMsg(prevState => (prevState ? {
        ...prevState,
        messages: prevState.messages.map((message) => {
          if (message.sentBy.username === currentUser.username) {
            return {
              ...message,
              seen: true
            }
          }
          return message
        })
      } : null))
    }
  }, [seenMsg])

  useEffect(() => {
    if (data?.messages.length) {
      seenMessageRequest()
      socket.current.emit("seenMessages", {
        seenBy: currentUser._id,
        seenToId: data?.participants.find(u => u._id !== currentUser._id)?._id,
        convId: convId.id
      })
      handleSeenLastMessage()
    }
    return () => {
      socket.current.off("seenMessages")
    }
  }, [gotNewMessage])

  const handleDisplayTime = (dateMilSeconds: number) => {
    const date = new Date(dateMilSeconds)
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric'
    })
  }
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
  const getDate = (date: number) => {
    return new Date(date).toLocaleDateString('en-GB')
  }
  return (
    <>
      {data?.messages?.map((m, index) => (
        <div
          className={styles.container}
          key={index}
          style={{
            alignItems: m.sentBy._id === currentUser._id ? 'flex-end' : 'flex-start',
            // textAlign: m.sentBy._id === currentUser._id ? "right" : "left",
          }}>
          {datesState[getDate(m.sentAt)] === index &&
            <span
              className={styles.date}>
              {getDate(m.sentAt)}
            </span>
          }
          <div className={m.sentBy._id === currentUser._id ? styles.messageData : styles.messageDataLeft}>
            <p>{m.message} </p>
            <div>
              <span>{handleDisplayTime(m.sentAt)}</span>
              {
                m.sentBy.username === currentUser.username
                &&
                <DoneAllIcon
                  style={{ fontSize: '1rem' }}
                  color={m.seen ? "primary" : 'disabled'} />
              }
            </div>
          </div>
        </div>
      ))}
    </>
  )
}