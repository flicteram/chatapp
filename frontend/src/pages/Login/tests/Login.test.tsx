import Login from "../Login";
import { render, screen, queryByAttribute, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import withWrapper from "__mocks__/withWrapper";

const ComponentToRender = withWrapper( Login  )
describe( "Test login form", () => {
  jest.mock( "Hooks/useAuth.tsx", () => ({
    useLogin: () => ({
      authError: "Invalid user!",
      authRequest: jest.fn()
    })
  }) )
  it( "Username input should be in the document", ()=>{
    const { getByLabelText } = render( <ComponentToRender/> )
    const UserInput = getByLabelText( /username/i )
    expect( UserInput ).toBeInTheDocument()
  })

  it( "Password input should be in the document", ()=>{
    const { getByLabelText } = render( <ComponentToRender/> )
    const PasswordInput = getByLabelText( /password/i )
    expect( PasswordInput ).toBeInTheDocument()
  })

  it( "Login button should be in the document", ()=>{
    const { getByRole } = render( <ComponentToRender/> )
    const LoginButton = getByRole( "button", { name: /login/i })
    expect( LoginButton ).toBeInTheDocument()
  })
  it( "test if required text is visible", async () => {
    render( <ComponentToRender/> )
    await act( async () => {
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    expect( screen.getAllByText( /required/i ) ).toHaveLength( 2 )
  })

  it( "test required text password", async () => {
    const { container } = render( <ComponentToRender/> )
    await act( async () => {
      userEvent.type( screen.getByRole( "textbox", { name: /username/i }), 'alex' )
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    const getById = queryByAttribute.bind( null, "id" )
    await waitFor( () => {
      expect( getById( container, /:r9:-helper-text/i ) ).toBeInTheDocument()
    })
  })

  it( "test required text username", async () => {
    const { container,  } = render( <ComponentToRender/> )
    await act( async () => {
      userEvent.type( screen.getByLabelText( /password/i ), '12345678' )
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    const getById = queryByAttribute.bind( null, "id" )
    await waitFor( () => {
      expect( getById( container, /:ra:-helper-text/i ) ).toBeInTheDocument()
    })
  })
})
