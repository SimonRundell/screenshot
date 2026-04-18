import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

/**
 * Main protected app frame.
 * @param {{ appConfig?: Record<string, any> | null }} props
 * @returns {JSX.Element}
 */
export default function Layout({ appConfig }) {
  return (
    <div className="app-shell">
      <Header appName={appConfig?.name} />
      <Sidebar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
