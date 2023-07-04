import { useState } from 'react';
import useInterceptor from '../../hooks/useInterceptor';
import OtherUser from '../../interfaces/OtherUser';

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
