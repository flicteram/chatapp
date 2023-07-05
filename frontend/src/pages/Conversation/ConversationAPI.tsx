import { useState, useEffect } from 'react';
import useInterceptor from '../../hooks/useInterceptor';
import { useParams } from "react-router-dom"
import Conversation from '../../interfaces/Conversation';
import SendMessage from "../../interfaces/SendMessage";
import CustomAxiosError from '../../interfaces/CustomAxiosError';
import GotNewMessage from "../../interfaces/GotNewMeessage";
import useUserSelector from '../../components/User/useUserSelector';
import GotSeenMessage from '../../interfaces/GotSeenMessage';
import OtherUser from '../../interfaces/OtherUser';
function useGetConversation() {
  const [isLoading, setIsLoading] = useState( true );
  const [data, setData] = useState<Conversation | null>( null );
  const [error, setError] = useState<string | null>( null );
  const [hasMore, setHasMore] = useState( false );
  const [msgCount, setMsgCount] = useState( 20 )
  const axios = useInterceptor();
  const currentUser = useUserSelector()

  const param = useParams();

  useEffect( () => {
    setIsLoading( true )
    setData( null )
  }, [param.id])
  async function request( controller?: AbortController, initialCount = 0 ) {
    setError( null )
    try {
      const response = await axios.get( `/conversation/${param.id}?messagesCount=${initialCount || msgCount}`,
        { signal: controller?.signal })
      if ( response.data.totalMsgs > response.data.messages.length ) {
        setHasMore( true )
      } else {
        setHasMore( false )
      }
      setMsgCount( response.data.messages.length + 20 )
      setData( response.data )
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
    setData( prevState => ( prevState ? {
      ...prevState,
      messages: [messageData, ...prevState.messages]
    } : null ) )
  }

  const addGotNewMessage = ( gotNewMessage:GotNewMessage )=>{
    setData( prevState => ( prevState ? {
      ...prevState,
      lastMessage: gotNewMessage.newMessage,
      messages: [gotNewMessage.newMessage, ...prevState.messages]
    } : null ) )
  }

  const makeMessagesSeen = ( seenMessage:GotSeenMessage ) =>{
    setData( prevState => ( prevState ? {
      ...prevState,
      messages: prevState.messages.map( ( message ) => {
        if ( message.sentBy.username === currentUser.username && !message.seenBy.includes( seenMessage.seenBy ) ) {
          return {
            ...message,
            seenBy: [...message.seenBy, seenMessage.seenBy]
          }
        }
        return message
      })
    } : null ) )
  }
  return {
    hasMore,
    isLoading,
    data,
    error,
    request,
    addNewMessage,
    addGotNewMessage,
    makeMessagesSeen,
    setNewMsg: setData,
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

export function useConversationUsers() {
  const [isLoading, setIsLoading] = useState( false );
  const [data, setData] = useState<OtherUser[]>([]);
  const [error, setError] = useState( '' );
  const axios = useInterceptor();

  async function request( usersIds: string[] | undefined ) {
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

  return {
    convUsersLoading: isLoading,
    convUsersData: data,
    convUsersError: error,
    getConvUsers: request
  }
}

export { useGetConversation, useSendMessage }