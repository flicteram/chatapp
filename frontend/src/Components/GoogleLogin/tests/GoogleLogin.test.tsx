import GoogleLogin from "../GoogleLogin";
import withWrapper from "__mocks__/withWrapper";
import { render, act } from '@testing-library/react'
import userEvent from "@testing-library/user-event";

const Component = withWrapper( GoogleLogin )

test( 'Google Login Component', ()=>{
  const { getByText } = render( <Component/> )

  const GoogleButton = getByText( /continue with google/i )

  expect( GoogleButton ).toBeInTheDocument()
  act( ()=>{
    userEvent.click( GoogleButton )
  })
})
