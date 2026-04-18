import { NavLink } from 'react-router-dom';

/**
 * Primary navigation sidebar.
 * @returns {JSX.Element}
 */
export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/colours">Saved Colours</NavLink>
        <NavLink to="/palettes">Palettes</NavLink>
      </nav>
    </aside>
  );
}
