import customAxios from '../utils/axios';
import { authUser, logoutUser } from '../components/User/userSlice';
import { useDispatch } from 'react-redux'

export default function useRefresh() {
  const dispatch = useDispatch();

  async function getNewToken() {
    try {
      const response = await customAxios.get( '/refresh', { withCredentials: true })
      dispatch( authUser( response.data ) )
      return response.data.accessToken
    } catch ( e ) {
      dispatch( logoutUser() )
      return e
    }
  }
  return getNewToken
}
