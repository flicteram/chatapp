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
import useDates from './hooks/useDates';
import GotSeenMessage from '../../interfaces/GotSeenMessage';

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  gotNewMessage: GotNewMessages,
  makeMessagesSeen: ( seenMessage:GotSeenMessage )=>void,
  handleSeenLastMessage: () => void,
  pendingMessage: SendMessage | null,
  otherUsersIds: string[] | undefined
}

export default function Messages(
  {
    socket,
    data,
    handleSeenLastMessage,
    gotNewMessage,
    pendingMessage,
    makeMessagesSeen,
    otherUsersIds
  }: Props
) {
  const currentUser = useUserSelector()
  const { id: convId } = useParams()
  const [seenMsg, setSeenMsg] = useState( null );

  const { seenMessageRequest } = useSeenMessage()
  const datesState = useDates( data )
  useEffect( () => {
    socket.current.on( 'gotSeenMessages', ( seenMsgData ) => {
      if ( seenMsgData.convId === convId ) {
        setSeenMsg( seenMsgData )
      }
    })
    return () => {
      socket.current.off( "gotSeenMessages" )
    }
  }, [])

  useEffect( () => {
    if ( seenMsg !== null ) {
      makeMessagesSeen( seenMsg )
    }
  }, [seenMsg])

  useEffect( () => {
    if ( data?.messages.length ) {
      seenMessageRequest()
      socket.current.emit( "seenMessages", {
        seenBy: currentUser.username,
        seenToId: otherUsersIds,
        convId: convId
      })
      handleSeenLastMessage()
    }
    return () => {
      socket.current.off( "seenMessages" )
    }
  }, [gotNewMessage])

  return (
    <>
      <PendingMessage pendingMessage={pendingMessage}/>
      {data?.messages?.map( ( m, index ) => (
        <Message
          participantsNumber={data.participants.length-1}
          datesState={datesState}
          message={m}
          messagePosition={index}
          key={m.sentAt}/>
      ) )}
    </>
  )
}