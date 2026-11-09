# ToreroForge frontend

React + Vite web app. Runs on mock data by default, so no backend is needed.

## Run it

```
cd frontend
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173).

To use the real Node.js API instead of mock data, copy `.env.example` to `.env.local` and set:

```
VITE_DATA_SOURCE=live
VITE_API_BASE_URL=http://localhost:3000/api
```

## Folder layout

```
src/
  main.jsx            wraps the app in Router + AuthProvider
  App.jsx             combines every feature's routes
  auth/               AuthContext: who is signed in (useAuth)
  lib/                config (env vars) and apiClient (shared fetch + JWT)
  components/         shared UI: NavBar, Avatar, Tag, TagInput
  shared/             shared lists: schools, skills, roles
  features/
    profile/          User Profile (2B)
      index.js        PUBLIC exports - other features import only from here
      routes.jsx      its pages and URL paths
      profileService.js   single data seam (mock or live)
      profileContract.js  data shape, validation, backend mapping, matching input
      useProfile.js   React hooks
      api/            mockProfileApi (Sem 1) and liveProfileApi (Sem 2)
      components/     ProfileCard
      pages/          ProfilePage, EditProfilePage, PeoplePage
```

New components (Feed, Teams, Contests, STEM Building, Notifications, Admin) follow the same pattern: `src/features/<name>/` with an `index.js`, `routes.jsx`, a service and an `api/` folder.

## How other parts connect to Profile

**Who is signed in (Auth, 2A).** Use `useAuth()` anywhere:

```jsx
import { useAuth } from '../../auth/AuthContext.jsx';
const { user, isSignedIn, hasRole, signIn, signOut } = useAuth();
```

Right now a mock user is always signed in. The login page only needs to call `signIn(token, user)` after `POST /api/auth/login`. From then on `apiClient` sends `Authorization: Bearer <token>` on every request.

**Showing people (Feed, Teams, Applicants).**

```jsx
import { ProfileCard, useProfiles } from '../profile';

const { profiles } = useProfiles(team.memberIds);
profiles.map((p) => <ProfileCard key={p.id} profile={p} />);
```

**Matching Engine (2D).** Use `toMatchingInput(profile)` to get `{ userId, role, schools, majors, skills, interests }`. Use `onProfileUpdated(fn)` to refresh recommendations when a user edits their profile.

**Adding routes.** Each feature exports its routes. Add them in `App.jsx`:

```jsx
<Routes>
  {profileRoutes}
  {feedRoutes}
</Routes>
```

Link to profile pages with `profilePaths.person(id)` instead of typing URLs.

**Calling the backend from any feature.**

```js
import { api } from '../../lib/apiClient.js';
const projects = await api.get('/projects');
```

Errors come back as `ApiError` with `status` and `fields`.

## Profile API contract (for the backend)

The backend reads the user from the JWT and applies the privacy rules. JSON uses the database's snake_case names. `profileContract.js` maps them to the frontend's names.

| Method | Path | Returns |
|---|---|---|
| GET | `/api/profiles/me` | Full profile of the signed-in user |
| GET | `/api/profiles/:id` | Public view of another user |
| GET | `/api/profiles?q=&skill=&school=&role=` | List of public views |
| GET | `/api/profiles?ids=u-1,u-2` | List of public views (team members, applicants) |
| PATCH | `/api/profiles/me` | Updated full profile |

Profile object:

```json
{
  "id": "uuid",
  "name": "Alex Rivera",
  "email": "arivera@sandiego.edu",
  "role": "student",
  "schools": ["Shiley-Marcos School of Engineering"],
  "majors": ["Computer Science"],
  "skills": ["React", "UX design"],
  "interests": ["Sustainability"],
  "bio": "…",
  "profile_photo": null,
  "visibility": { "bio": "public", "interests": "public" },
  "created_at": "2026-10-01T17:00:00Z"
}
```

**Privacy rules:**
- Name, role, schools, majors and skills are always public.
- Bio and interests are returned to other users only when their visibility is `public`.
- `email` and `visibility` are returned only on `/me`.

**PATCH body:** any of `name, schools, majors, skills, interests, bio, profile_photo, visibility`. `id`, `email`, `role` and `created_at` cannot be edited.

**Validation errors:** respond with status `422` and

```json
{ "message": "Some fields need attention.", "errors": { "skills": "Add at least one skill." } }
```

The edit form shows each message under its field.