import { useState } from 'react';
import axios from 'Utils/axios';
import { useDispatch } from 'react-redux'
import { authUser } from 'Components/User/userSlice'
import CustomAxiosError from '@Interfaces/CustomAxiosError'
interface UserCredentials {
  username: string,
  password: string,
}

export default function useAuth( url:string ) {
  const [isLoading, setIsLoading] = useState( false );
  const [error, setError] = useState( '' );
  const dispatch = useDispatch()

  async function request( userCredentials: UserCredentials | string ) {
    setIsLoading( true )
    setError( '' )
    try {
      const response = await axios.post( url, { data: userCredentials })
      dispatch( authUser( response.data ) )
    } catch ( e: unknown ) {
      const err = e as CustomAxiosError
      if( err?.response?.data?.message ) setError( err.response.data.message )
    } finally {
      setIsLoading( false )
    }
  }

  return {
    authLoading: isLoading,
    authError: error,
    authRequest: request,
  }
}
