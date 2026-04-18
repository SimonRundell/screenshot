import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import getApiError from '../utils/getApiError';

/**
 * Password reset request page.
 * @returns {JSX.Element}
 */
export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  /**
   * Sends reset request regardless of account existence.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/auth/reset-request.php', { email });
      const message = 'If this email exists, a reset link was sent.';
      setStatus(message);
      setEmail('');
      toast.success(message);
    } catch (requestError) {
      const message = getApiError(requestError, 'Unable to send reset link');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="reset-email">Email</label>
          <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <button type="submit">Send reset link</button>
        </form>
        {status ? <p className="success-text">{status}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <p className="auth-links"><Link to="/login">Back to login</Link></p>
      </div>
    </section>
  );
}
