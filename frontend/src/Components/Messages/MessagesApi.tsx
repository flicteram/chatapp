import { useState } from 'react';
import useInterceptor from 'Hooks/useInterceptor';
import { useParams } from "react-router-dom"
import CustomAxiosError from '@Interfaces/CustomAxiosError'

export function useSeenMessage() {
  const [isLoading, setIsLoading] = useState( false );
  const [data, setData] = useState<null>( null );
  const [error, setError] = useState( '' );
  const axios = useInterceptor();
  const param = useParams();

  async function request() {
    setIsLoading( true )
    setError( '' )
    setData( null )

    try {
      const response = await axios.post( `/conversation/seen/${param.id}` )
      setData( response.data )
    } catch ( e: unknown ) {
      const err = e as CustomAxiosError
      if( err?.response?.data?.message ) setError( err.response.data.message )
    } finally {
      setIsLoading( false )
    }
  }

  return {
    seenMessageLoading: isLoading,
    seenMessageData: data,
    seenMessageError: error,
    seenMessageRequest: request
  }
}
