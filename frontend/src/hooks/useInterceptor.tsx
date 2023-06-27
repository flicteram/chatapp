import useRefresh from "./useRefresh";
import { axiosPrivate } from '../utils/axios'
import { useEffect } from "react";
import useUserSelector from "../components/User/useUserSelector";

export default function useInterceptor() {
  const refresh = useRefresh();
  const currentUser = useUserSelector();

  useEffect(() => {
    const request = axiosPrivate.interceptors.request.use((config) => {
      config.headers = config.headers ?? {};
      if (!config?.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${currentUser?.accessToken}`;
      }
      return config
    }, (error: unknown) => Promise.reject(error))

    const response = axiosPrivate.interceptors.response.use(response => response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (error: any) => {
        if (error?.response?.status === 403 && !error?.config?.sent) {
          error.config.sent = true;
          const newAccessToken = await refresh();
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(error.config);
        }
        return Promise.reject(error);
      })
    return () => {
      axiosPrivate.interceptors.request.eject(request)
      axiosPrivate.interceptors.response.eject(response)
    }
  }, [refresh, currentUser])
  return axiosPrivate
}