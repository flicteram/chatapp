import useRefresh from "Hooks/useRefresh";
import useUserSelector from "Components/User/useUserSelector";
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import CustomLoader from "Components/CustomLoader/CustomLoader";

function PersistLogin() {
  const refresh = useRefresh();
  const currentUser = useUserSelector()
  const [loading, setLoading] = useState( true )

  useEffect( () => {
    const getNewToken = async () => {
      try {
        await refresh()
      } catch ( err ) {
        console.log( 'e', err )
      }
      finally {
        setLoading( false )
      }
    }
    currentUser?.accessToken ? setLoading( false ) : getNewToken()
  }, [refresh, currentUser?.accessToken])

  if ( loading ) return <CustomLoader />
  return (
    <Outlet />
  )
}

export default PersistLogin