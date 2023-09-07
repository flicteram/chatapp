import { useEffect } from "react"
import useAuth from "Hooks/useAuth"
import { useFormik } from "formik"
import handleFieldError from "Utils/handleFieldError"

interface InitialValues {
  username: string,
  password: string,
  confirmPassword: string,
}
export default function useFromikRegister(){
  const {
    authRequest,
    authError
  } = useAuth( "/register" )

  const handleValidate = ( values: InitialValues ) => {
    const errors = {} as InitialValues
    if ( !values.username ) {
      errors.username = 'Required'
    } else if ( values.username.length < 6 ) {
      errors.username = 'Must have at least 6 chars'
    } else if ( values.username.length > 20 ) {
      errors.username = 'Username max length 20'
    }
    if ( !values.password ) {
      errors.password = 'Required'
    } else if ( values.password.length < 6 ) {
      errors.password = 'Must have at least 6 chars'
    }
    if ( !values.confirmPassword ) {
      errors.confirmPassword = 'Required'
    }
    if ( values.password !== values.confirmPassword ) {
      errors.confirmPassword = 'Passwords does not match'
    }
    return errors
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validate: handleValidate,
    onSubmit: ( values ) => authRequest({
      username: values.username,
      password: values.password
    })
  })
  useEffect( () => {
    handleFieldError<InitialValues>( authError, formik, ["username"])
  }, [authError])

  return formik
}