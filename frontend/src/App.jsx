import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import { profileRoutes } from './features/profile';

// Each component (feature) exports its own routes. To add one, import it and
// place it inside <Routes>, e.g. {feedRoutes}, {stemRoutes}, {adminRoutes}.
export default function App() {
  return (
    <>
      <NavBar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          {profileRoutes}
          <Route path="*" element={<p className="muted">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}