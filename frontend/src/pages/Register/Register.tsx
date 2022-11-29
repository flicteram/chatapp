import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import styles from './Register.module.css'
import hadleHelperText from '../../utils/hadleHelperText'
import Button from '@mui/material/Button'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'
import { useRegister } from './RegisterAPI'
import { useEffect } from 'react'
import Layout from '../../components/Layout/Layout'

interface InitialValues {
  username: string,
  password: string,
  confirmPassword: string,
}

export default function Register() {

  const {
    registerRequest, registerError
  } = useRegister()

  const handleValidate = (values: InitialValues) => {
    const errors = {} as InitialValues

    if (!values.username) {
      errors.username = 'Required'
    } else if (values.username.length < 6) {
      errors.username = 'Must have at least 6 chars'
    } else if (values.username.length > 20) {
      errors.username = 'Username max length 20'
    }
    if (!values.password) {
      errors.password = 'Required'
    } else if (values.password.length < 6) {
      errors.password = 'Must have at least 6 chars'
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Required'
    }
    if (values.password !== values.confirmPassword) {
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
    onSubmit: (values) => registerRequest({
      username: values.username,
      password: values.password
    })
  })
  useEffect(() => {
    if (registerError.toLowerCase().includes('username')) {
      formik.setFieldError('username', registerError)
    }
  }, [registerError])
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <h1>Create a new account</h1>
          <Box
            component="form"
            className={styles.formContainer}
            onSubmit={formik.handleSubmit}>
            <TextField
              label="Username"
              name='username'
              helperText={hadleHelperText(formik.errors.username, formik.touched.username)}
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
            <TextField
              type="password"
              label="Confirm Password"
              helperText={hadleHelperText(formik.errors.confirmPassword, formik.touched.confirmPassword)}
              name='confirmPassword'
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword !== undefined && formik.touched.confirmPassword}
            />
            <Button
              type='submit'
              variant='contained'>
            Register
            </Button>
          </Box>
          <p>{`Already have an account ?`}</p>
          <Link to='/login'>Login with existing account</Link>
        </div>
      </div>
    </Layout>

  )
}