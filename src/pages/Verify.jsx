import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';

/**
 * Email verification handler page.
 * @returns {JSX.Element}
 */
export default function Verify() {
  const { token } = useParams();
  const [state, setState] = useState({ loading: true, message: '' });

  useEffect(() => {
    /**
     * Calls verify endpoint with route token.
     * @returns {Promise<void>}
     */
    async function verifyToken() {
      try {
        await api.get(`/auth/verify.php?token=${encodeURIComponent(token || '')}`);
        setState({ loading: false, message: 'Email verified. You can now login.' });
      } catch (error) {
        setState({ loading: false, message: error?.response?.data?.error || 'Verification failed' });
      }
    }
    verifyToken();
  }, [token]);

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Email Verification</h2>
        <p>{state.loading ? 'Verifying...' : state.message}</p>
        <Link to="/login">Go to Login</Link>
      </div>
    </section>
  );
}
