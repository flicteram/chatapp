import styles from './Login.module.css'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Link } from 'react-router-dom'
import hadleHelperText from 'Utils/hadleHelperText'
import Layout from 'Components/Layout/components/Layout'
import GoogleLogin from "Components/GoogleLogin/GoogleLogin"
import useCustomFormik from './hooks/useCustomFormik'

export default function Login() {

  const formik = useCustomFormik()
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.containerInner}>
          <h1>Login to your account</h1>
          <Box
            component="form"
            className={styles.formContainer}
            onSubmit={formik.handleSubmit}>
            <TextField
              label="Username"
              helperText={hadleHelperText( formik.errors.username, formik.touched.username )}
              name='username'
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.username !== undefined && formik.touched.username}
            />
            <TextField
              type="password"
              label="Password"
              helperText={hadleHelperText( formik.errors.password, formik.touched.password )}
              name='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password !== undefined && formik.touched.password}
            />
            <Button
              role="button"
              type='submit'
              variant='contained'>
            Login
            </Button>
            <span style={{ textAlign: 'center' }}>or</span>
            <GoogleLogin/>
          </Box>
          <p>{`You don't have an account?`}</p>
          <Link to='/register'>Create one now!</Link>
        </div>
      </div>
    </Layout>
  )
}