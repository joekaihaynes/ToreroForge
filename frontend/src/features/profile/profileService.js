// The single seam for profile data. Pages, hooks and OTHER components
// (Feed, Teams, Applicants, Matching) call these functions and never care
// whether the data is mock or live. VITE_DATA_SOURCE picks the source.

import { isLive } from '../../lib/config.js';
import { mockProfileApi } from './api/mockProfileApi.js';
import { liveProfileApi } from './api/liveProfileApi.js';
import { validateProfile } from './profileContract.js';
import { ApiError } from '../../lib/apiClient.js';

const source = isLive ? liveProfileApi : mockProfileApi;

// Listeners are told when the signed-in user's profile changes, so other
// components can refresh (e.g. Feed reloads "Recommended for you").
const listeners = new Set();
export function onProfileUpdated(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** @returns {Promise<import('./profileContract.js').Profile>} */
export function getProfile(id, viewerId) {
  return source.getProfile(id, viewerId);
}

/** Batch load, e.g. team members or applicants. */
export function getProfilesByIds(ids, viewerId) {
  return source.getProfilesByIds(ids, viewerId);
}

/** filters: { q, skill, school, role } */
export function searchProfiles(filters, viewerId) {
  return source.searchProfiles(filters, viewerId);
}

export async function updateMyProfile(userId, changes) {
  const errors = validateProfile(changes);
  if (Object.keys(errors).length) throw new ApiError('Some fields need attention.', 422, errors);
  const updated = await source.updateProfile(userId, changes);
  listeners.forEach((fn) => fn(updated));
  return updated;
}