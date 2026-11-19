import { Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import PeoplePage from './pages/PeoplePage.jsx';

// Profile's pages. App.jsx drops these in next to the other components' routes.
// Links elsewhere in the app should use these paths.
export const profilePaths = {
  mine: '/profile',
  edit: '/profile/edit',
  people: '/people',
  person: (id) => `/people/${id}`,
};

export const profileRoutes = (
  <>
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/profile/edit" element={<EditProfilePage />} />
    <Route path="/people" element={<PeoplePage />} />
    <Route path="/people/:id" element={<ProfilePage />} />
  </>
);