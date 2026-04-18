import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

/**
 * Password reset request page.
 * @returns {JSX.Element}
 */
export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  /**
   * Sends reset request regardless of account existence.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.post('/auth/reset-request.php', { email });
    setStatus('If this email exists, a reset link was sent.');
    setEmail('');
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
        <p className="auth-links"><Link to="/login">Back to login</Link></p>
      </div>
    </section>
  );
}
