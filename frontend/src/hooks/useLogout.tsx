import axios from "../utils/axios";
import { useDispatch } from 'react-redux'
import { logoutUser } from "../components/User/userSlice";

export default function useLogout() {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    try {
      await axios.get('/logout')
      dispatch(logoutUser())
    } catch (e) {
      console.log(e)
    }
  }

  return handleLogout
}