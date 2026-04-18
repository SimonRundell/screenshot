import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import getApiError from '../../utils/getApiError';

/**
 * Register form component.
 * @returns {JSX.Element}
 */
export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  /**
   * Submits registration payload.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const response = await api.post('/auth/register.php', { username, email, password });
      const message = response.data?.message || 'Registration submitted. Check your email.';
      setStatus(message);
      toast.success(message);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (requestError) {
      const message = getApiError(requestError, 'Unable to register');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="register-username">Username</label>
      <input id="register-username" value={username} onChange={(event) => setUsername(event.target.value)} required />

      <label htmlFor="register-email">Email</label>
      <input id="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

      <label htmlFor="register-password">Password</label>
      <input id="register-password" type="password" value={password} minLength={8} onChange={(event) => setPassword(event.target.value)} required />

      {status && <p className="success-text">{status}</p>}
      {error && <p className="error-text">{error}</p>}
      <button type="submit">Create Account</button>
    </form>
  );
}
