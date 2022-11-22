import { useState } from 'react';
import axios from '../../utils/axios';
import { useDispatch } from 'react-redux'
import { authUser } from '../../components/User/userSlice'
import CustomAxiosError from '../../interfaces/CustomAxiosError'

interface UserCredentials {
  username: string,
  password: string,
}

function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()

  async function request(userCredentials: UserCredentials) {
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`/register`, { data: userCredentials })
      dispatch(authUser(response.data))
      console.log(response.data)
    } catch (e: unknown) {
      const err = e as CustomAxiosError
      setError(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    registerLoading: isLoading,
    registerError: error,
    registerRequest: request
  }
}

export { useRegister }