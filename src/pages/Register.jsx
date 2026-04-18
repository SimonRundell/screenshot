import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

/**
 * Register page.
 * @param {{ appConfig?: Record<string, any> | null }} props
 * @returns {JSX.Element}
 */
export default function Register({ appConfig }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/codemonkey-logo.png" alt="CodeMonkey logo" className="auth-logo" />
        <h2>{appConfig?.name || 'ScreenCapture by CodeMonkey'}</h2>
        <p>Create your account and verify via email.</p>
        <RegisterForm />
        <p className="auth-links">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  );
}
