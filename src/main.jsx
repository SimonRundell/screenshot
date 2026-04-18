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
            position="top-right"
            gutter={10}
            toastOptions={{
              duration: 3200,
              success: { duration: 2500 },
              style: {
                borderRadius: '10px',
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                color: 'var(--text-main)',
                boxShadow: '0 10px 24px rgba(0, 0, 0, 0.2)'
              }
            }}
          />
        </ColourHistoryProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
