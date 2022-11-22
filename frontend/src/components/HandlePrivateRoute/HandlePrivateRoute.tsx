import useUserSelector from "../User/useUserSelector";
import { Navigate, Outlet } from 'react-router-dom'

export default function HandlePrivateRoute() {
  const currentUser = useUserSelector()
  if (!currentUser?.accessToken) {
    return <Navigate to='/' />
  }
  return <Outlet />
}