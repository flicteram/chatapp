import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import { useGoogleLogin,  } from '@react-oauth/google';
import useAuth from 'Hooks/useAuth';

export default function GoogleLogin(){

  const { authRequest } = useAuth( `/googleAuth` )
  const handleGoogle = useGoogleLogin({ onSuccess: ( res ) => authRequest( res.access_token ) })

  const handleGoogleLogin = () => handleGoogle()

  return(
    <Button
      onClick={handleGoogleLogin}
      startIcon={<GoogleIcon/>}
    >
      Continue with Google
    </Button>
  )
}