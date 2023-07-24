import { useEffect, useState, useCallback, useMemo } from 'react'
import SendMessage from '@Interfaces/SendMessage'
import GotNewMessage from "@Interfaces/GotNewMeessage";
import { useParams } from 'react-router-dom';
import { useGetConversation, useSendMessage } from '../ConversationAPI'
import useUserSelector from 'Components/User/useUserSelector';
import { Socket } from 'socket.io-client'
import { useGotNewMessage, useNewMessageSent } from './useMessages'
import  useReturnConversationUsers  from './useReturnConversationUsers'

export default function useConversation(
  addLastMessageAndSortConversations: ( sendToId: string, message: SendMessage ) => void,
  socket: {
    current: Socket
  },
  gotNewMessage:GotNewMessage | null,
){
  const currentUser = useUserSelector()
  const convId = useParams()
  const {
    addGotNewMessage,
    addNewMessage,
    data,
    error,
    hasMore,
    isLoading,
    request,
    makeMessagesSeen
  } = useGetConversation()
  const {
    sendMessageData,
    sendMessageError,
    sendMessageLoading,
    sendMessageRequest
  } = useSendMessage()
  const [pendingMessage, setPendingMessage] = useState<SendMessage | null>( null )
  const handlePendingMessage = ( message?:SendMessage )=>{
    if( message ){
      setPendingMessage( message )
    }else{
      setPendingMessage( null )
    }
  }
  const otherUsersIds = useMemo( ()=>data?.participants.filter( ( uId:string ) => uId !== currentUser._id ), [data?._id])

  const handleSendMessage = useCallback( async ( msg: string ) => {
    const dateNow = new Date()
    const newMessage = {
      message: msg,
      sentBy: {
        username: currentUser.username,
        _id: currentUser._id
      },
      seenBy: [],
      seenByIds: [],
      sentAt: dateNow.getTime()
    }
    handlePendingMessage( newMessage )
    await sendMessageRequest( newMessage )
    socket.current.emit( 'sendMessage', {
      newMessage,
      sentToIds: otherUsersIds,
      convId: convId.id
    })
    convId.id && addLastMessageAndSortConversations( convId.id, newMessage )
  }, [otherUsersIds])

  useEffect( () => {
    const controller = new AbortController()
    request( controller, 20 )
    return () => {
      controller.abort()
    }
  }, [convId.id])

  useNewMessageSent( addNewMessage, handlePendingMessage, sendMessageData )
  useGotNewMessage( addGotNewMessage, gotNewMessage )
  const {
    convUsersData, convUsersLoading
  } = useReturnConversationUsers( otherUsersIds )

  return {
    otherUsersIds,
    handleSendMessage,
    pendingMessage,
    sendMessageLoading,
    sendMessageError,
    errorConversation: error,
    hasMoreMessages: hasMore,
    isConversationLoading: isLoading,
    getConversation: request,
    conversationData: data,
    makeMessagesSeen,
    convUsersData,
    convUsersLoading
  }
}