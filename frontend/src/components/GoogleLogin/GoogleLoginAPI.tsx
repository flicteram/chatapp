import { useState } from 'react';
import axios from '../../utils/axios';
import { useDispatch } from 'react-redux'
import { authUser } from '../../components/User/userSlice'
import CustomAxiosError from '../../interfaces/CustomAxiosError'

export function useGoogleLoginRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()

  async function request(googleToken: string) {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.post(`/googleAuth`, { data: googleToken })
      console.log('data', response.data)
      dispatch(authUser(response.data))
    } catch (e: unknown) {
      const err = e as CustomAxiosError
      setError(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loginGoogleLoading: isLoading,
    loginGoogleError: error,
    loginGoogleRequest: request
  }
}