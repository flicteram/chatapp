import useUserSelector from "Components/User/useUserSelector"
import { Navigate, Outlet } from 'react-router-dom'
export default function HandleAuthRoute() {
  const currentUser = useUserSelector()
  if ( currentUser.accessToken ) {
    return <Navigate to="/chat" />
  }
  return <Outlet />
}