import { useFormik, FormikHelpers } from 'formik'
import { useEffect } from 'react'
import useAuth from "Hooks/useAuth"

export interface InitialValues {
  username: string,
  password: string,
}

export default function useCustomFormik(){
  const {
    authRequest,
    authError
  } = useAuth( "/auth" )

  useEffect( () => {
    handleDisplayError( authError, formik )
  }, [authError])

  const handleValidate = ( values: InitialValues ) => {
    const errors = {} as InitialValues

    if ( !values.username ) {
      errors.username = 'Required'
    }
    if ( !values.password ) {
      errors.password = 'Required'
    }
    return errors
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: handleValidate,
    onSubmit: authRequest
  })

  return formik
}

export const handleDisplayError = ( loginError:string, formik: FormikHelpers<InitialValues> ) =>{
  if ( loginError.toLocaleLowerCase().includes( 'user' ) ) {
    formik.setFieldError( 'username', loginError )
  }
  if ( loginError.toLocaleLowerCase().includes( 'password' ) ) {
    formik.setFieldError( 'password', loginError )
  }
}