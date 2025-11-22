import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import './main.scss';
import { Toaster } from './Components/ui/toaster.jsx'
import { Provider } from 'react-redux';
import store from './Redux/store';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Toaster />
      <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
);
