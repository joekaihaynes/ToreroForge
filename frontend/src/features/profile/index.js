// Public entry point for the Profile component (2B).
// Other components import from here only, e.g.:
//   import { ProfileCard, useProfiles, toMatchingInput } from '../profile';
// Anything not exported here is internal and may change.

export { profileRoutes, profilePaths } from './routes.jsx';
export { default as ProfileCard } from './components/ProfileCard.jsx';
export { useProfile, useProfiles, useProfileSearch } from './useProfile.js';
export { getProfile, getProfilesByIds, searchProfiles, updateMyProfile, onProfileUpdated } from './profileService.js';
export { toMatchingInput, validateProfile } from './profileContract.js';