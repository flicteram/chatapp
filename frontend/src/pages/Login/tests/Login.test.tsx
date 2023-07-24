import Login from "../Login";
import { render, screen, queryByAttribute, waitFor, act  } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom';
import Wrapper from "__mocks__/Wrapper";

const ComponentToRender =<Wrapper><Login/></Wrapper>
describe( "Test login form", ()=>{
  jest.mock( "../../../Hooks/useAuth.tsx", ()=>({
    useLogin: ()=>({
      authError: "Invalid user!",
      authRequest: jest.fn()
    })
  }) )
  it( "test if required text is visible", async ()=>{
    render( ComponentToRender )
    await act( async ()=>{
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    expect( screen.getAllByText( /required/i ) ).toHaveLength( 2 )
  })

  it( "test required text password", async()=>{
    const { container } = render( ComponentToRender )
    await act( async ()=>{
      userEvent.type( screen.getByRole( "textbox", { name: /username/i }), 'alex' )
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    const getById = queryByAttribute.bind( null, "id" )
    waitFor( ()=>{
      expect( getById( container, /:r1:-helper-text/i ) ).toBeInTheDocument()
    })
  })

  it( "test required text username", async()=>{
    const { container } = render( ComponentToRender )
    await act( async ()=>{
      userEvent.type( screen.getByLabelText( /password/i ), '12345678' )
      userEvent.click( screen.getByRole( "button", { name: /login/i }) )
    })
    const getById = queryByAttribute.bind( null, "id" )
    waitFor( ()=>{
      expect( getById( container, /:r0:-helper-text/i ) ).toBeInTheDocument()
    })
  })
})
