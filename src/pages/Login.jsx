import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

/**
 * Login page.
 * @param {{ appConfig?: Record<string, any> | null }} props
 * @returns {JSX.Element}
 */
export default function Login({ appConfig }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/codemonkey-logo.png" alt="CodeMonkey logo" className="auth-logo" />
        <h2>{appConfig?.name || 'ScreenCapture by CodeMonkey'}</h2>
        <p>Sign in to continue.</p>
        <LoginForm />
        <p className="auth-links">
          <Link to="/register">Create account</Link>
          <Link to="/reset">Forgot password?</Link>
        </p>
      </div>
    </section>
  );
}
