import { useState, useEffect } from "react";
import useInterceptor from "Hooks/useInterceptor";
import CustomAxiosError from "@Interfaces/CustomAxiosError";
import { AxiosRequestConfig } from 'axios'

interface Props{
  url:string,
  callOnMount?:boolean,
  requestParams?:AxiosRequestConfig
}
type IReturnType<T> = [
  T|null,
  boolean,
  string,
  ( controller?: AbortController | undefined ) => Promise<void>
]
export default function useAxiosRequest<T>({
  url,
  callOnMount,
  requestParams
}:Props ):IReturnType<T>{
  const [loading, setLoading] = useState( true );
  const [data, setData] = useState<T | null>( null );
  const [error, setError] = useState( '' );
  const axios = useInterceptor();

  async function request( controller?: AbortController ) {
    setLoading( true )
    setError( '' )
    try {
      const response = await axios.request({
        url,
        signal: controller?.signal,
        ...requestParams
      })
      setData( response.data )
    } catch ( e: unknown ) {
      const err = e as CustomAxiosError
      if( err?.response?.data?.message ){
        setError( err.response.data.message )
      }
    } finally {
      setLoading( false )
    }
  }

  useEffect( ()=>{
    if( callOnMount ){
      const controller = new AbortController();
      request( controller )
      return () => {
        controller.abort()
      }
    }
  }, [url])

  return [data, loading, error, request]
}

