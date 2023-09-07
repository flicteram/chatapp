import Register from "../Register";
import { render, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom';
import withWrapper from "__mocks__/withWrapper";
import userEvent from "@testing-library/user-event";

const RegisterComponent = withWrapper( Register )

describe( "Test register component", ()=>{

  it( "Should have Username Input", ()=>{
    const { getByLabelText } = render( <RegisterComponent/> )
    expect( getByLabelText( /username/i ) ).toBeInTheDocument()
  })
  it( "Should have Password Input", ()=>{
    const { getByLabelText } = render( <RegisterComponent/> )
    expect( getByLabelText( "Password" ) ).toBeInTheDocument()
  })
  it( "Should have Confirm Password Input", ()=>{
    const { getByLabelText } = render( <RegisterComponent/> )
    expect( getByLabelText( /confirm password/i ) ).toBeInTheDocument()
  })
  it( "Should have Register Button", ()=>{
    const { getByRole } = render( <RegisterComponent/> )
    expect( getByRole( "button", { name: "Register" }) ).toBeInTheDocument()
  })
  it( "Should have Continue with Google Button", ()=>{
    const { getByRole } = render( <RegisterComponent/> )
    expect( getByRole( "button", { name: "Continue with Google" }) ).toBeInTheDocument()
  })
  it( "Should have Login with existing account", ()=>{
    const { getByRole } = render( <RegisterComponent/> )
    expect( getByRole( "link", { name: "Login with existing account" }) ).toBeInTheDocument()
  })
  it( "Should show Required for each empty input on click register button", async ()=>{
    const {
      getByRole, getAllByText
    } = render( <RegisterComponent/> )

    await act( async ()=>{
      userEvent.click( getByRole( "button", { name: "Register" }) )
    })

    expect( getAllByText( /required/i ) ).toHaveLength( 3 )
  })
  it( "Should show error if username or password input length is between 1-6", async ()=>{
    const {
      getAllByText, getByLabelText, getByRole
    } = render( <RegisterComponent/> )

    await act( async ()=>{
      userEvent.type( getByLabelText( /username/i ), '123' )
      userEvent.type( getByLabelText( "Password" ), '123' )
      userEvent.click( getByRole( "button", { name: "Register" }) )
    })
    expect( getAllByText( 'Must have at least 6 chars' ) ).toHaveLength( 2 )
  })

  it( "Should show error message if passwords does not match", async ()=>{
    const {
      getByText, getByLabelText, getByRole
    } = render( <RegisterComponent/> )

    await act( async ()=>{
      userEvent.type( getByLabelText( "Password" ), '123' )
      userEvent.click( getByRole( "button", { name: "Register" }) )
    })
    expect( getByText( /passwords does not match/i ) ).toBeInTheDocument()
  })
  it( "Should show error message if username length > 20", async ()=>{
    const {
      getByText, getByLabelText, getByRole
    } = render( <RegisterComponent/> )

    await act( async ()=>{
      userEvent.type( getByLabelText( /username/i ), '123456789012345678901' )
      userEvent.click( getByRole( "button", { name: "Register" }) )
    })
    expect( getByText( 'Username max length 20' ) ).toBeInTheDocument()
  })
  it( "Should not show error if all fields are completed correctly", async()=>{
    const {
      getByLabelText, getByRole, queryByText
    } = render( <RegisterComponent/> )

    await act( async ()=>{
      userEvent.type( getByLabelText( /username/i ), 'alextest1234' )
      userEvent.type( getByLabelText( "Password" ), 'alextest1234' )
      userEvent.type( getByLabelText( /confirm password/i ), 'alextest1234' )
      userEvent.click( getByRole( "button", { name: "Register" }) )
    })
    await waitFor( ()=>{
      expect( queryByText( /required/i ) ).toBeNull()
      expect( queryByText( 'Must have at least 6 chars' ) ).toBeNull()
      expect( queryByText( /passwords does not match/i ) ).toBeNull()
      expect( queryByText( 'Username max length 20' ) ).toBeNull()
    })
  })
})

