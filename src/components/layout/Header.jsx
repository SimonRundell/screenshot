import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Top fixed header with branding and account actions.
 * @param {{ appName?: string }} props
 * @returns {JSX.Element}
 */
export default function Header({ appName }) {
  const { user, logout } = useAuth();

  /**
   * Logs out and keeps UX resilient when API fails.
   * @returns {Promise<void>}
   */
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // UI state already resets in context.
    }
  };

  return (
    <header className="app-header">
      <div className="brand-block">
        <img src="/codemonkey-logo.png" alt="CodeMonkey logo" className="brand-logo" />
        <div>
          <h1>{appName || 'ScreenCapture by CodeMonkey'}</h1>
          <p>Capture screens. Pick colours. Build palettes.</p>
        </div>
      </div>
      <div className="header-user">
        <span>{user?.username}</span>
        <Link to="/">Dashboard</Link>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
