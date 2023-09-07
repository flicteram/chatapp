import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import styles from './Register.module.css'
import hadleHelperText from 'Utils/hadleHelperText'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Layout from 'Components/Layout/components/Layout'
import GoogleLogin from "Components/GoogleLogin/GoogleLogin"
import useFromikRegister from './hooks/useFormikRegister'

export default function Register() {
  const formik = useFromikRegister()
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
              helperText={hadleHelperText( formik.errors.username, formik.touched.username )}
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
            <TextField
              type="password"
              label="Confirm Password"
              helperText={hadleHelperText( formik.errors.confirmPassword, formik.touched.confirmPassword )}
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
            <span style={{ textAlign: 'center' }}>or</span>
            <GoogleLogin/>
          </Box>
          <p>{`Already have an account ?`}</p>
          <Link to='/login'>Login with existing account</Link>
        </div>
      </div>
    </Layout>

  )
}