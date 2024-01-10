import HandlePrivateRoute from "../HandlePrivateRoute";
import{ Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import Wrapper from "__mocks__/Wrapper";
import * as useUserSelector from "Components/User/useUserSelector";

const FakePrivateRoute =()=> <div>Private Route</div>
const FakeHome =()=> <div>Home Route</div>

describe( "Test HandleAuthRoute", ()=>{
  afterEach( () => {
    jest.restoreAllMocks();
  });
  test( "Test user is not logged in", ()=>{
    jest.spyOn( useUserSelector, "default" ).mockImplementation( ()=>({
      username: "",
      _id: '',
      accessToken: ""
    }) )
    render( <Wrapper>
      <Routes>
        <Route element={<HandlePrivateRoute/>}>
          <Route
            path="/chat"
            element={<FakePrivateRoute/>}/>
        </Route>
        <Route
          path="/"
          element={<FakeHome/>}/>
      </Routes>
    </Wrapper> )
    expect( screen.queryByText( 'Home Route' ) ).toBeInTheDocument();
  })
  test( "Test user is logged in", ()=>{
    jest.spyOn( useUserSelector, "default" ).mockImplementation( ()=>({
      username: "alex",
      _id: '112',
      accessToken: "test"
    }) )
    render( <Wrapper>
      <Routes>
        <Route element={<HandlePrivateRoute/>}>
          <Route
            path="/"
            element={<FakePrivateRoute/>}/>
        </Route>
        <Route
          path="/fakehome"
          element={<FakeHome />} />
      </Routes>
    </Wrapper> )
    expect( screen.queryByText( 'Private Route' ) ).toBeInTheDocument();
  })
})