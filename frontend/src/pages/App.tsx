import Home from "./Home/Home";
import Chat from "./Chat/Chat";
import { Routes, Route } from 'react-router-dom'
import HandlePrivateRoute from "../components/HandlePrivateRoute/HandlePrivateRoute";
import PersistLogin from "../components/HandlePersistLogin/PersistLogin";
import Conversation from "./Conversation/Conversation";
import Login from './Login/Login'
import Register from './Register/Register'
import HandleAuthRoute from "../components/HandleAuthRoute/HandleAuthRoute";
function App() {

  return (
    <div style={{display: 'flex'}}>
      <Routes>
        <Route
          path='/'
          element={<Home />} />
        <Route element={<PersistLogin />}>
          <Route element={<HandleAuthRoute />}>
            <Route
              path='register'
              element={<Register />} />
            <Route
              path='login'
              element={<Login />} />
          </Route>
          <Route element={<HandlePrivateRoute />}>
            <Route
              path='chat'
              element={<Chat />} >
              <Route
                path=':id'
                element={<Conversation />} />
            </Route>
          </Route>
        </Route>
      </Routes >
    </div>

  );
}

export default App;

