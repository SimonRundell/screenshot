import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ColourHistoryProvider } from './context/ColourHistoryContext';
import './App.css';

/**
 * Renders the ScreenCapture app root tree.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ColourHistoryProvider>
          <App />
        </ColourHistoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
