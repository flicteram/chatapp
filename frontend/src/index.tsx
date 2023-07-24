import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import '../src/global.css'
import ScrollToTop from 'Components/ScrollToTop/ScrollToTop';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from 'Utils/store'

const root = ReactDOM.createRoot( document.getElementById( 'root' ) as HTMLElement );
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId='112677181611-p1vim48upb3kfbeu16tn6h8vk15hghq0.apps.googleusercontent.com'>
      <Provider store={store}>
        <ScrollToTop/>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);

