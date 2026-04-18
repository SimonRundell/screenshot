import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import getApiError from '../utils/getApiError';

/**
 * Password reset confirmation page.
 * @returns {JSX.Element}
 */
export default function ResetConfirm() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /**
   * Submits new password with reset token.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/auth/reset-confirm.php', { token, password });
      const successMessage = 'Password reset complete. You can now login.';
      setMessage(successMessage);
      setPassword('');
      toast.success(successMessage);
    } catch (requestError) {
      const errorMessage = getApiError(requestError, 'Reset failed');
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h2>Choose New Password</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input id="new-password" type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button type="submit">Update password</button>
        </form>
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <p className="auth-links"><Link to="/login">Back to login</Link></p>
      </div>
    </section>
  );
}
