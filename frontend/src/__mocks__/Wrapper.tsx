import { Provider } from "react-redux";
import store from "Utils/store";
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'

const Wrapper = ({ children }:{children:React.ReactElement}) =>
  <BrowserRouter>
    <GoogleOAuthProvider clientId='112677181611-p1vim48upb3kfbeu16tn6h8vk15hghq0.apps.googleusercontent.com'>
      <Provider store={store}>
        {children}
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>

export default Wrapper