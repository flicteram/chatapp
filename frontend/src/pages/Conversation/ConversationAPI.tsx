import { useState, useEffect, useReducer, useRef } from 'react';
import useInterceptor from 'Hooks/useInterceptor';
import { useParams } from "react-router-dom"
import IConv from '@Interfaces/Conversation';
import SendMessage from "@Interfaces/SendMessage";
import CustomAxiosError from '@Interfaces/CustomAxiosError';
import GotNewMessage from "@Interfaces/GotNewMeessage";
import useUserSelector from 'Components/User/useUserSelector';
import GotSeenMessage from '@Interfaces/GotSeenMessage';
import OtherUser from '@Interfaces/OtherUser';

interface ConvsActions{
  type: "resetInitialState" | "fetchedData" | "addNewMessage" | "gotNewMessage" | "gotSeenMessage"
  data?: IConv,
  messageData?:SendMessage,
  newMessageData?:GotNewMessage,
  seenMessageData?:GotSeenMessage,
  currentUserUsername?:string
}

function conversationReducer( conv:IConv | null, action:ConvsActions ): IConv | null{
  switch( action.type ){
    case "resetInitialState":{
      return null
    }
    case "fetchedData":{
      if( !conv ){
        return action.data ?? null
      }
      if( action?.data?.messages ){
        return{
          ...conv,
          totalMsgs: conv.totalMsgs,
          messages: [...conv.messages, ...action.data.messages],
        }
      }
      return null
    }
    case "addNewMessage":{
      if( conv && action.messageData ){
        const { messageData } = action
        return{
          ...conv,
          messages: [messageData, ...conv.messages],
        }
      }
      return null
    }
    case "gotNewMessage":{
      if( conv && action.newMessageData ){
        const { newMessage } = action.newMessageData
        return{
          ...conv,
          lastMessage: newMessage,
          messages: [newMessage, ...conv.messages]
        }
      }
      return null
    }
    case "gotSeenMessage":{
      if( conv && action.seenMessageData && action.currentUserUsername ){
        const { _id: seenById } = action.seenMessageData.seenBy
        const { seenBy } = action.seenMessageData
        const currentUserUsername = action.currentUserUsername
        return {
          ...conv,
          messages: conv.messages.map( ( message ) => {
            if ( message.sentBy.username === currentUserUsername
               &&
               !message?.seenByIds?.includes( seenById )
               &&
               message.seenByIds
               &&
               message.seenBy
            ) {
              return {
                ...message,
                seenByIds: [...message.seenByIds, seenById],
                seenBy: [...message.seenBy, seenBy]
              }
            }
            return message
          })
        }
      }
      return null
    }
  }
}
function useGetConversation() {
  const [isLoading, setIsLoading] = useState( true );
  const [error, setError] = useState<string | null>( null );
  const [hasMore, setHasMore] = useState( false );
  const axios = useInterceptor();
  const currentUser = useUserSelector()
  const msgCountRef = useRef( 0 )
  const [conversation, dispatch] = useReducer(
    conversationReducer,
    null
  );
  const param = useParams();
  useEffect( () => {
    setIsLoading( true )
    dispatch({ type: "resetInitialState" })
    msgCountRef.current = 0
  }, [param.id])
  async function request( controller?: AbortController ){
    setError( null )
    try {
      const response = await axios.get( `/conversation/${param.id}?messagesCount=${msgCountRef.current}`,
        { signal: controller?.signal })
      if ( ( response.data.totalMsgs - 20 ) > msgCountRef.current ) {
        setHasMore( true )
      } else {
        setHasMore( false )
      }
      msgCountRef.current += 20
      dispatch({
        type: "fetchedData",
        data: response.data
      })
    } catch ( e: unknown ) {
      const err = e as CustomAxiosError
      if( err?.response?.data?.message ){
        setError( err.response.data.message )
      }
    } finally {
      setIsLoading( false )
    }
  }

  const addNewMessage = ( messageData:SendMessage ) =>{
    msgCountRef.current+=1
    dispatch({
      type: "addNewMessage",
      messageData
    })
  }

  const addGotNewMessage = ( newMessageData:GotNewMessage )=>{
    msgCountRef.current+=1
    dispatch({
      type: "gotNewMessage",
      newMessageData
    })
  }

  const makeMessagesSeen = ( seenMessage:GotSeenMessage ) =>{
    dispatch({
      type: "gotSeenMessage",
      seenMessageData: seenMessage,
      currentUserUsername: currentUser.username
    })
  }
  return {
    hasMore,
    isLoading,
    data: conversation,
    error,
    request,
    addNewMessage,
    addGotNewMessage,
    makeMessagesSeen,
  }
}

function useSendMessage() {
  const [isLoading, setIsLoading] = useState( false );
  const [data, setData] = useState<SendMessage | null>( null );
  const [error, setError] = useState( '' );
  const axios = useInterceptor();
  const param = useParams();

  async function request( newMessage: SendMessage ) {
    setIsLoading( true )
    setError( '' )
    setData( null )

    try {
      const response = await axios.post( `/conversation/${param.id}`, { data: newMessage })
      setData( response.data )
    } catch ( e: unknown ) {
      if ( e instanceof Error ) {
        setError( e?.message )
      }
    } finally {
      setIsLoading( false )
    }
  }

  return {
    sendMessageLoading: isLoading,
    sendMessageData: data,
    sendMessageError: error,
    sendMessageRequest: request
  }
}

function useConversationUsers( otherUsersIds?:string[]) {
  const [isLoading, setIsLoading] = useState( false );
  const [data, setData] = useState<OtherUser[]>([]);
  const [error, setError] = useState( '' );
  const axios = useInterceptor();

  async function request( usersIds?: string[]) {
    setIsLoading( true )
    setError( '' )
    try {
      const response = await axios.post( `/users/conversation`, { data: usersIds })
      setData( response.data )
    } catch ( e: unknown ) {
      if ( e instanceof Error ) {
        setError( e?.message )
      }
    } finally {
      setIsLoading( false )
    }
  }

  useEffect( ()=>{
    if( otherUsersIds&&otherUsersIds.length ){
      request( otherUsersIds )
    }
  }, [otherUsersIds])

  return {
    convUsersLoading: isLoading,
    convUsersData: data,
    convUsersError: error,
    getConvUsers: request
  }
}

export {
  useGetConversation, useSendMessage, useConversationUsers
}