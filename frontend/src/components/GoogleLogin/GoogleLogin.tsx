import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button';
import { useGoogleLogin,  } from '@react-oauth/google';
import { useGoogleLoginRequest } from './GoogleLoginAPI';

export default function GoogleLogin(){

  const { loginGoogleRequest } = useGoogleLoginRequest()
  const handleGoogle = useGoogleLogin({ onSuccess: ( res ) => loginGoogleRequest( res.access_token ) })

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