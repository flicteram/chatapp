import NavBar from "../components/NavBar";
import withWrapper from "__mocks__/withWrapper";
import { render, act } from '@testing-library/react'
import userEvent from "@testing-library/user-event";

const Component = withWrapper( NavBar )

test( 'test click button', ()=>{
  const { getByTestId } = render( <Component/> )

  const navigateButton = getByTestId( "navigateToLoginButton" )

  expect( navigateButton ).toBeInTheDocument()
  act( ()=>{
    userEvent.click( navigateButton )
  })
})
