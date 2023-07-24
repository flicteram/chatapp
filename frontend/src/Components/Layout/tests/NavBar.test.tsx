import NavBar from "../components/NavBar";
import Wrapper from "__mocks__/Wrapper";
import { render, act } from '@testing-library/react'
import userEvent from "@testing-library/user-event";

const Component = <Wrapper><NavBar/></Wrapper>

test( 'test click button', ()=>{
  const { getByTestId } = render( Component )

  const navigateButton = getByTestId( "navigateToLoginButton" )

  expect( navigateButton ).toBeInTheDocument()
  act( ()=>{
    userEvent.click( navigateButton )
  })
})
