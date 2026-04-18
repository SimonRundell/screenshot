import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import getApiError from '../../utils/getApiError';

/**
 * Login form component.
 * @returns {JSX.Element}
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /**
   * Submits login credentials.
   * @param {import('react').FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success('Signed in successfully');
      navigate('/');
    } catch (requestError) {
      const message = getApiError(requestError, 'Unable to login');
      setError(message);
      toast.error(message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label htmlFor="login-email">Email</label>
      <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />

      {error && <p className="error-text">{error}</p>}
      <button type="submit">Sign In</button>
    </form>
  );
}
