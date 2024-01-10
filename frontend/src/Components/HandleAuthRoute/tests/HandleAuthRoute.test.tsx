import HandleAuthRoute from "../HandleAuthRoute";
import{ Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Wrapper from "__mocks__/Wrapper";
import * as useUserSelector from "Components/User/useUserSelector";

const FakeComponent =()=> <div>Auth Route</div>
const FakeComponentChat =()=> <div>Chat Page</div>

describe( "Test HandleAuthRoute", ()=>{
  afterEach( () => {
    jest.restoreAllMocks();
  });
  test( "Test user is not logged in", ()=>{
    render( <Wrapper>
      <Routes>
        <Route element={<HandleAuthRoute/>}>
          <Route
            path="/"
            element={<FakeComponent/>}/>
        </Route>
        <Route
          path="/chat"
          element={<FakeComponentChat/>}/>
      </Routes>
    </Wrapper> )
    expect( screen.queryByText( 'Auth Route' ) ).toBeInTheDocument();
  })
  test( "Test user is logged in", ()=>{
    jest.spyOn( useUserSelector, "default" ).mockImplementation( ()=>({
      username: "alex",
      _id: '112',
      accessToken: "test"
    }) )
    render( <Wrapper>
      <Routes>
        <Route element={<HandleAuthRoute/>}>
          <Route
            path="/"
            element={<FakeComponent />} />
        </Route>
        <Route
          path="/chat"
          element={<FakeComponentChat/>}/>
      </Routes>
    </Wrapper> )
    expect( screen.queryByText( 'Chat Page' ) ).toBeInTheDocument();
  })
})