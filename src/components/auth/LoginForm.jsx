import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
      navigate('/');
    } catch (requestError) {
      setError(requestError?.response?.data?.error || 'Unable to login');
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
