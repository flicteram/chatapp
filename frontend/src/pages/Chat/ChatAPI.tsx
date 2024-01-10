import { useState, useCallback, useEffect } from 'react'
import useInterceptor from 'Hooks/useInterceptor'
import { useNavigate } from 'react-router-dom';
import CustomAxiosError from '@Interfaces/CustomAxiosError';
import SendMessage from '@Interfaces/SendMessage';
import useUserSelector from 'Components/User/useUserSelector';
import { useParams } from 'react-router-dom';
import MultipleConvs from '@Interfaces/MulltipleConvs';
import GotSeenMessage from '@Interfaces/GotSeenMessage';
function useGetConversations() {
  const [isLoading, setIsLoading] = useState( true );
  const [data, setData] = useState<MultipleConvs[]>([]);
  const [error, setError] = useState( '' );
  const axios = useInterceptor();
  const currentUser = useUserSelector()
  const params = useParams()

  useEffect( ()=>{
    ( async function getConversations( controller?: AbortController ) {
      setIsLoading( true )
      setError( '' )
      setData([])
      try {
        const response = await axios.get( '/conversations', { signal: controller?.signal })
        setData( response.data )
      } catch ( e: unknown ) {
        if ( e instanceof Error ) {
          setError( e?.message )
        }
      } finally {
        setIsLoading( false )
      }
    })()
  }, [])

  const handleAddCreatedConversation = ( convData:MultipleConvs ) => {
    setData( prevState => ([...prevState, convData]) )
  }

  const addLastMessageAndSortConversations = useCallback( ( sendToId: string, message: SendMessage ) => {
    const sortHelper = ( sentAt?:number )=>(
      sentAt || -Infinity
    )
    setData( prevState => prevState.map( conv => {
      if ( conv._id === sendToId ) {
        return {
          ...conv,
          lastMessage: message
        }
      }
      return conv
    }).sort( ( a, b ) =>  sortHelper( b?.lastMessage?.sentAt )  - sortHelper( a?.lastMessage?.sentAt ) ) )
  }, [])

  const handleAddNewConversation =( dataNewConversation:MultipleConvs ) =>{
    setData( prevState => ([dataNewConversation, ...prevState]) )
  }

  const handleUpdateLastMessageConversations = ( gotSeenMessage:GotSeenMessage ) =>{
    setData( prevState=> prevState.map( conv=>{
      if( conv.participants.length !== conv.lastMessage?.seenByIds?.length
          &&
          conv._id === gotSeenMessage.convId
          &&
         !conv?.lastMessage?.seenByIds?.includes( gotSeenMessage.seenBy._id )
          &&
          conv?.lastMessage?.seenByIds
          &&
          conv?.lastMessage?.seenBy
      ){
        return {
          ...conv,
          lastMessage: {
            ...conv.lastMessage,
            seenByIds: [...conv.lastMessage.seenByIds, gotSeenMessage.seenBy._id ],
            seenBy: [...conv.lastMessage.seenBy, gotSeenMessage.seenBy]
          }
        }
      }
      return conv
    }) )
  }

  const handleMakeMessagesSeen = ()=>{
    setData( prevState => prevState.map( conv => {
      if ( conv._id === params.id
        &&
        !conv?.lastMessage?.seenByIds?.includes( currentUser._id )
        &&
        conv?.lastMessage?.sentBy.username !== currentUser.username
        &&
        conv?.lastMessage?.seenByIds
        &&
        conv?.lastMessage?.seenBy
      ) {
        return {
          ...conv,
          lastMessage: {
            ...conv.lastMessage,
            seenByIds: [...conv.lastMessage.seenByIds, currentUser._id ],
            seenBy: [...conv.lastMessage.seenBy, {
              username: currentUser.username,
              _id: currentUser._id,
              seenAt: Date.now()
            }]
          }
        }
      }
      return conv
    }) )
  }

  return {
    isLoading,
    dataConversations: data,
    error,
    handleAddCreatedConversation,
    addLastMessageAndSortConversations,
    handleAddNewConversation,
    setAddConversation: setData,
    handleMakeMessagesSeen,
    handleUpdateLastMessageConversations
  }
}

export interface ICreateConversation{
  groupName:string,
  usersIds:string[]
}
function useCreateConversation() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState( true );
  const [data, setData] = useState<MultipleConvs | null>( null );
  const [error, setError] = useState( '' );
  const axios = useInterceptor();

  async function request( payload: ICreateConversation ) {
    setIsLoading( true )
    setError( '' )
    setData( null )
    try {
      const response = await axios.post( '/conversation', { data: payload })
      setData( response.data )
      navigate( response.data._id )
    } catch ( e: unknown ) {
      if ( e instanceof Error ) {
        setError( e?.message )
      }
    } finally {
      setIsLoading( false )
    }
  }

  return {
    loadingCreateConv: isLoading,
    dataCreateConv: data,
    errorCreateConv: error,
    requestCreateConv: request,
  }
}

function useGetConversationNew() {
  const [isLoading, setIsLoading] = useState( true );
  const [data, setData] = useState<MultipleConvs | null>( null );
  const [error, setError] = useState<string | null>( null );
  const axios = useInterceptor();

  async function request( convId: string, controller?: AbortController ) {
    setError( null )
    try {
      const response = await axios.get( `/conversation/new/${convId}`,
        { signal: controller?.signal })
      setData( response.data )
    } catch ( e: unknown ) {
      const err = e as CustomAxiosError
      setError( err.response.data.message )
    } finally {
      setIsLoading( false )
    }
  }
  return {
    isLoading,
    dataNewConversation: data,
    error,
    requestNewConversation: request,
  }
}

export {
  useGetConversations, useCreateConversation, useGetConversationNew
}