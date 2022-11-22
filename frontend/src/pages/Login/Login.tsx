import styles from './Login.module.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import hadleHelperText from '../../utils/hadleHelperText'
import { useLogin } from './LoginAPI'
import { useEffect } from 'react'

interface InitialValues {
  username: string,
  password: string,
}

export default function Login() {
  const {
    loginRequest, loginError
  } = useLogin()

  useEffect(() => {
    if (loginError.toLocaleLowerCase().includes('user')) {
      formik.setFieldError('username', loginError)
    }
    if (loginError.toLocaleLowerCase().includes('password')) {
      formik.setFieldError('password', loginError)
    }
  }, [loginError])

  const handleValidate = (values: InitialValues) => {
    const errors = {} as InitialValues

    if (!values.username) {
      errors.username = 'Required'
    }
    if (!values.password) {
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
    onSubmit: (values) => loginRequest(values)
  })

  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <h1>Login to your account</h1>
        <Box
          component="form"
          className={styles.formContainer}
          onSubmit={formik.handleSubmit}>
          <TextField
            label="Username"
            helperText={hadleHelperText(formik.errors.username, formik.touched.username)}
            name='username'
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.username !== undefined && formik.touched.username}
          />
          <TextField
            type="password"
            label="Password"
            helperText={hadleHelperText(formik.errors.password, formik.touched.password)}
            name='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password !== undefined && formik.touched.password}
          />
          <Button
            type='submit'
            variant='contained'>
            Login
          </Button>
        </Box>
        <p>{`You don't have an account?`}</p>
        <Link to='/register'>Create one now!</Link>
      </div>
    </div>
  )
}