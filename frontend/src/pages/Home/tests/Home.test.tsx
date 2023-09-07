import { render, act, waitFor,  } from '@testing-library/react'
import '@testing-library/jest-dom';
import Home from '../Home';
import withWrapper from '__mocks__/withWrapper';
import userEvent from '@testing-library/user-event';
import App from 'pages/App';

const HomeComponent = withWrapper( Home )
const AppComponent = withWrapper( App )

describe( "Test Home Component", ()=>{
  it( "Home should have H1", ()=>{
    const { getByRole } = render( <HomeComponent/> )

    const Header = getByRole( "heading", { level: 1 })

    expect( Header ).toBeInTheDocument()
  })

  it( "Home should have Login and Register buttons", ()=>{
    const { getByRole } = render( <HomeComponent/> )

    const LoginButton = getByRole( "button", { name: /login/i })
    const RegisterButton = getByRole( "button", { name: /register/i })

    expect( LoginButton ).toBeInTheDocument()
    expect( RegisterButton ).toBeInTheDocument()

  })

  it( "Check if login button redirects to /login route", async ()=>{
    const {
      getByRole, getByText
    } = render( <AppComponent/> )

    const LoginButton = getByRole( "button", { name: /login/i })
    expect( LoginButton ).toBeInTheDocument()
    await act( async () => {
      userEvent.click( LoginButton )
    })

    await waitFor( ()=>{
      expect( getByText( /Login to your account/i ) ).toBeInTheDocument()
    })
  })

  it( "Check if register button redirects to /register route", async ()=>{
    window.history.pushState({}, 'Test page', '/' )

    const {
      getByRole, getByText
    } = render( <AppComponent/> )

    const RegisterButton = getByRole( "button", { name: /register/i })

    expect( RegisterButton ).toBeInTheDocument()
    await act( async () => {
      userEvent.click( RegisterButton )
    })

    await waitFor( ()=>{
      expect( getByText( /Create a new account/i ) ).toBeInTheDocument()
    })

  })

})

