import axios from "Utils/axios";
import { useDispatch } from 'react-redux'
import { logoutUser } from "Components/User/userSlice";

export default function useLogout() {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await axios.get( '/logout' )
      dispatch( logoutUser() )
    } catch ( e ) {
      console.log( e )
    }
  }

  return handleLogout
}