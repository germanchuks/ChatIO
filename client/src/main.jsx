import React from 'react'
import ReactDOM from 'react-dom/client'
import './config/firebase-config';
import App from './App.jsx'
import { GlobalStyle } from './styles/GlobalStyle.jsx';
import { GlobalProvider } from './context/GlobalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyle />
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);