import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import handleFieldError from 'Utils/handleFieldError';
import { useFormik } from 'formik';

interface InitialValues{
  username:string,
  password:string
}
describe( 'test handleDisplayError', ()=>{
  test( "User has error", ()=>{
    const error =  "Username plm"
    const formik = renderHook( ()=>useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validate: jest.fn(),
      onSubmit: jest.fn()
    }) )
    act( ()=>{
      handleFieldError<InitialValues>( error, formik.result.current, ["username"])
    })

    expect( formik.result.current.errors.username ).toEqual( error )
  })
  test( "Password has error", ()=>{
    const error = "Password plm"
    const formik = renderHook( ()=>useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validate: jest.fn(),
      onSubmit: jest.fn()
    }) )
    act( ()=>{
      handleFieldError<InitialValues>( error, formik.result.current, ["password"])
    })

    expect( formik.result.current.errors.password ).toEqual( error )
  })

})