import { useState } from 'react'
import useInterceptor from '../../hooks/useInterceptor'

export function useGetUsers() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const axios = useInterceptor();

  async function request(controller?: AbortController) {
    setIsLoading(true)
    setError('')
    try {
      const response = await axios.get('/users', { signal: controller?.signal })
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
    loadingUsers: isLoading,
    dataUsers: data,
    errorUsers: error,
    requestUsers: request
  }
}

