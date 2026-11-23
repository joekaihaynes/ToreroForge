// Semester 1 data source: in-memory fixtures that behave like the real API,
// including the privacy rules the backend will enforce.

import { mockProfiles } from './mockProfiles.js';
import { EDITABLE_FIELDS, validateProfile } from '../profileContract.js';
import { ApiError } from '../../../lib/apiClient.js';

let profiles = structuredClone(mockProfiles); // edits last until the page reloads

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// Privacy (spec 2B): name, role, schools, majors, skills are public.
// Bio and interests follow the owner's setting. Email and settings are owner-only.
function view(profile, viewerId) {
  if (profile.id === viewerId) return { ...profile, isOwner: true };
  const { email, visibility, ...rest } = profile;
  return {
    ...rest,
    bio: visibility.bio === 'public' ? profile.bio : '',
    interests: visibility.interests === 'public' ? profile.interests : [],
    isOwner: false,
  };
}

function find(id) {
  const p = profiles.find((x) => x.id === id);
  if (!p) throw new ApiError('Profile not found.', 404);
  return p;
}

export const mockProfileApi = {
  async getProfile(id, viewerId) {
    await delay();
    return view(find(id), viewerId);
  },

  async getProfilesByIds(ids, viewerId) {
    await delay();
    return profiles.filter((p) => ids.includes(p.id)).map((p) => view(p, viewerId));
  },

  async searchProfiles({ q = '', skill = '', school = '', role = '' }, viewerId) {
    await delay();
    const text = q.trim().toLowerCase();
    return profiles
      .filter((p) => !skill || p.skills.includes(skill))
      .filter((p) => !school || p.schools.includes(school))
      .filter((p) => !role || p.role === role)
      .filter((p) => !text || p.name.toLowerCase().includes(text) || p.majors.some((m) => m.toLowerCase().includes(text)))
      .map((p) => view(p, viewerId));
  },

  async updateProfile(userId, changes) {
    await delay();
    const current = find(userId);
    const next = { ...current };
    EDITABLE_FIELDS.forEach((k) => { if (k in changes) next[k] = changes[k]; });
    const errors = validateProfile(next);
    if (Object.keys(errors).length) throw new ApiError('Some fields need attention.', 422, errors);
    profiles = profiles.map((p) => (p.id === userId ? next : p));
    return view(next, userId);
  },
};