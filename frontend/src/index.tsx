import ReactDOM from 'react-dom/client';
import App from './pages/App';
import { BrowserRouter } from 'react-router-dom';
import store from './utils/store'
import { Provider } from 'react-redux'
import '../src/global.css'
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ScrollToTop/>
      <App />
    </Provider>
  </BrowserRouter>
);

