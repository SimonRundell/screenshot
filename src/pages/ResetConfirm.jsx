import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axiosInstance';

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
      setMessage('Password reset complete. You can now login.');
      setPassword('');
    } catch (requestError) {
      setError(requestError?.response?.data?.error || 'Reset failed');
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
