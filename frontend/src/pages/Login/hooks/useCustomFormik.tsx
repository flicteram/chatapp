import { useFormik } from 'formik'
import { useEffect } from 'react'
import useAuth from "Hooks/useAuth"
import handleFieldError from 'Utils/handleFieldError'

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
    handleFieldError<InitialValues>( authError, formik, ["username", "password"])
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

