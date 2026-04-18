import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api/axiosInstance';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import ResetRequest from './pages/ResetRequest';
import ResetConfirm from './pages/ResetConfirm';
import Gallery from './pages/Gallery';
import ImageView from './pages/ImageView';
import Colours from './pages/Colours';
import Palettes from './pages/Palettes';

/**
 * Root router and app-config bootstrap for ScreenCapture.
 * @returns {JSX.Element}
 */
export default function App() {
  const [appConfig, setAppConfig] = useState(null);

  useEffect(() => {
    /**
     * Loads public app config from backend endpoint.
     * @returns {Promise<void>}
     */
    async function loadConfig() {
      try {
        const response = await api.get('/app-config.php');
        setAppConfig(response.data?.app ?? null);
      } catch (error) {
        setAppConfig(null);
      }
    }

    loadConfig();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login appConfig={appConfig} />} />
      <Route path="/register" element={<Register appConfig={appConfig} />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/reset" element={<ResetRequest />} />
      <Route path="/reset/:token" element={<ResetConfirm />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Layout appConfig={appConfig} />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Dashboard />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="image/:id" element={<ImageView />} />
        <Route path="colours" element={<Colours />} />
        <Route path="palettes" element={<Palettes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
