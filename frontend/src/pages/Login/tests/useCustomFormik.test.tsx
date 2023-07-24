import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { handleDisplayError } from '../hooks/useCustomFormik'
import { useFormik } from 'formik';

describe( 'test handleDisplayError', ()=>{
  test( "User has error", ()=>{
    const formik = renderHook( ()=>useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validate: jest.fn(),
      onSubmit: jest.fn()
    }) )
    act( ()=>{
      handleDisplayError( "User plm", formik.result.current )
    })

    expect( formik.result.current.errors.username ).toEqual( 'User plm' )
  })
  test( "Password has error", ()=>{
    const formik = renderHook( ()=>useFormik({
      initialValues: {
        username: '',
        password: '',
      },
      validate: jest.fn(),
      onSubmit: jest.fn()
    }) )
    act( ()=>{
      handleDisplayError( "Password plm", formik.result.current )
    })

    expect( formik.result.current.errors.password ).toEqual( 'Password plm' )
  })

})