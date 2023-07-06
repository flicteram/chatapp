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
import IOtherUser from '../../interfaces/OtherUser'
import MessageInfoDialog from './MessageInfoDialog'
import useMessageInfo from './hooks/useMessageInfo';

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  gotNewMessage: GotNewMessages,
  makeMessagesSeen: ( seenMessage:GotSeenMessage )=>void,
  handleSeenLastMessage: () => void,
  pendingMessage: SendMessage | null,
  convUsersData: IOtherUser[],
  otherUsersIds?: string[],
}

export default function Messages(
  {
    socket,
    data,
    handleSeenLastMessage,
    gotNewMessage,
    pendingMessage,
    makeMessagesSeen,
    otherUsersIds,
    convUsersData
  }: Props
) {
  const currentUser = useUserSelector()
  const { id: convId } = useParams()
  const [seenMsg, setSeenMsg] = useState( null );

  const {
    handleMessageInfo,
    isDialogOpen,
    messageInfo,
    toggleDialog
  } = useMessageInfo( data, convUsersData )

  const { seenMessageRequest } = useSeenMessage()
  const datesState = useDates( data )
  useEffect( () => {
    socket.current.on( 'gotSeenMessages', ( seenMsgData ) => {
      console.log( seenMsgData )
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
        seenBy: {
          username: currentUser.username,
          _id: currentUser._id,
          seenAt: Date.now(),
        },
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
      <MessageInfoDialog
        isDialogOpen={isDialogOpen}
        toggleDialog={toggleDialog}
        messageInfo={messageInfo}
        participantsNumber={data?.participants ? data.participants.length-1 : 0}
      />
      <PendingMessage pendingMessage={pendingMessage}/>
      {data?.messages?.map( ( m, index ) => (
        <Message
          handleMessageInfo={handleMessageInfo}
          participantsNumber={data.participants.length-1}
          datesState={datesState}
          message={m}
          messagePosition={index}
          key={m.sentAt}/>
      ) )}
    </>
  )
}