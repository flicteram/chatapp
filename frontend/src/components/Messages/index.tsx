import { Socket } from 'socket.io-client'
import { useEffect } from 'react'
import Conversation from '../../interfaces/Conversation';
import useUserSelector from '../User/useUserSelector';
import { useParams } from 'react-router-dom'
import { useSeenMessage } from './MessagesApi'
import SendMessage from '../../interfaces/SendMessage'
import GotNewMessage from '../../interfaces/GotNewMeessage'
import PendingMessage from '../PendingMessage';
import Message from './Message';
import useDates from './hooks/useDates';
import IOtherUser from '../../interfaces/OtherUser'
import MessageInfoDialog from './MessageInfoDialog'
import useMessageInfo from './hooks/useMessageInfo';

interface Props {
  socket: {
    current: Socket
  }
  data: Conversation | null,
  handleSeenLastMessage: () => void,
  pendingMessage: SendMessage | null,
  convUsersData: IOtherUser[],
  gotNewMessage?: GotNewMessage,
  otherUsersIds?: string[],
}

export default function Messages(
  {
    socket,
    data,
    handleSeenLastMessage,
    gotNewMessage,
    pendingMessage,
    otherUsersIds,
    convUsersData,
  }: Props
) {
  const currentUser = useUserSelector()
  const { id: convId } = useParams()

  const {
    handleMessageInfo,
    isDialogOpen,
    messageInfo,
    toggleDialog
  } = useMessageInfo( convUsersData )

  const { seenMessageRequest } = useSeenMessage()
  const datesState = useDates( data )
  useEffect( () => {
    if (
      data?.messages
       &&
       data?.lastMessage?.sentBy?._id !== currentUser._id
       &&
       !data?.lastMessage?.seenByIds?.includes( currentUser._id )
    ) {
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
  }, [gotNewMessage?.newMessage?.sentAt, data?.lastMessage?.sentAt])
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