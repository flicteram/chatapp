import { useState } from 'react';
import useInterceptor from '../../hooks/useInterceptor';
import OtherUser from '../../interfaces/OtherUser';

function useGetOtherUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OtherUser | null>(null);
  const [error, setError] = useState('');
  const axios = useInterceptor();

  async function request(userId: string) {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get(`/users/${userId}`)
      setData(response.data)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e?.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getOtherUserLoading: isLoading,
    getOtherUserData: data,
    getOtherUserError: error,
    getOtherUserRequest: request
  }
}

export { useGetOtherUser }