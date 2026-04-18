import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
          <Toaster
            position="top-center"
            gutter={10}
            toastOptions={{
              duration: 4000,
              success: {
                duration: 4000,
                style: {
                  background: '#2f855a',
                  color: '#ffffff',
                }
              },
              error: {
                duration: 5000,
                style: {
                  background: '#c53030',
                  color: '#ffffff',
                }
              },
              style: {
                borderRadius: '10px',
                fontFamily: '"Trebuchet MS", Tahoma, sans-serif',
                fontSize: '15px',
                fontWeight: '500',
                padding: '12px 18px',
                background: '#2d3748',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
              }
            }}
          />
        </ColourHistoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
