import { NavLink } from 'react-router-dom';

// Top navigation from the wireframes. Links to pages that don't exist yet are disabled.
export default function NavBar() {
  return (
    <header className="nav">
      <span className="brand">ToreroForge</span>
      <nav>
        <span className="nav-link disabled" title="Coming soon">Project Feed</span>
        <span className="nav-link disabled" title="Coming soon">Teams</span>
        <span className="nav-link disabled" title="Coming soon">STEM Building</span>
        <NavLink to="/people" className="nav-link">People</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </nav>
    </header>
  );
}