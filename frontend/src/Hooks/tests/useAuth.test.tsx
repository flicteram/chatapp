import useAuth from "Hooks/useAuth";
import Wrapper from "__mocks__/Wrapper";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Provider } from 'react-redux';
import axios from 'Utils/axios';
import * as reactRedux from 'react-redux'
import Thunk from 'redux-thunk'
import configureStore from 'redux-mock-store';

const wrapper = Wrapper

jest.mock( 'Utils/axios' )
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockDispatch = jest.fn();
const mockSelector = jest.fn();

jest.mock( "react-redux", () => ({
  ...jest.requireActual( "react-redux" ),
  useDispatch: () => mockDispatch,
  useSelector: () => mockSelector,
}) );

const userData = {
  username: 'alextest',
  token: 'plmtoken'
}

describe( "test useAuth", ()=>{

  it( "test dispatch was called", ()=>{
    const mockStore = configureStore([Thunk]);
    const initialStore = {
      accessToken: '',
      username: '',
      _id: '',
    }
    const store = mockStore( initialStore );
    const useDispatchSpy = jest.spyOn( reactRedux, 'useDispatch' );
    mockedAxios.post.mockResolvedValueOnce({ data: userData })

    const wrapper2 = ({ children }:{children:React.ReactElement})=> <Provider store={store}>{children}</Provider>

    const { result } = renderHook( ()=> useAuth( "/mockurl" ), { wrapper: wrapper2 })

    act( ()=>{
      result.current.authRequest({
        username: 'alextest',
        password: '12345678'
      })
    })
    expect( useDispatchSpy ).toHaveBeenCalled()
    useDispatchSpy.mockClear()
  })

  it( "error request", async()=>{
    const message = "Oopes someting went wrong!"
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { message } } })
    const { result } = renderHook( ()=> useAuth( "/mockurl" ), { wrapper })

    await act( async()=>{
      await result.current.authRequest({
        username: 'alextest',
        password: '12345678'
      })
    })

    await waitFor( ()=>{
      expect( result.current.authError ).toStrictEqual( message )
    })
  })
})