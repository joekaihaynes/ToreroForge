import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext.jsx';
import { getProfile, searchProfiles, getProfilesByIds } from './profileService.js';

// Generic loader: runs `load` whenever `deps` change and tracks loading/error.
function useAsync(load, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let cancelled = false; // ignore late responses after navigating away
    setState((s) => ({ ...s, loading: true, error: '' }));
    load()
      .then((data) => !cancelled && setState({ data, loading: false, error: '' }))
      .catch((err) => !cancelled && setState({ data: null, loading: false, error: err.message }));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/** Load a profile by id, or the signed-in user's profile if no id is given. */
export function useProfile(id) {
  const { user } = useAuth();
  const targetId = id ?? user?.id;
  const { data, loading, error } = useAsync(
    () => (targetId ? getProfile(targetId, user?.id) : Promise.reject(new Error('Sign in to view your profile.'))),
    [targetId, user?.id]
  );
  return { profile: data, loading, error };
}

/** Search profiles. filters: { q, skill, school, role } */
export function useProfileSearch(filters) {
  const { user } = useAuth();
  const key = JSON.stringify(filters);
  const { data, loading, error } = useAsync(() => searchProfiles(filters, user?.id), [key, user?.id]);
  return { results: data ?? [], loading, error };
}

/** Load several profiles at once, e.g. a team's members or a project's applicants. */
export function useProfiles(ids) {
  const { user } = useAuth();
  const key = ids.join(',');
  const { data, loading, error } = useAsync(() => getProfilesByIds(ids, user?.id), [key, user?.id]);
  return { profiles: data ?? [], loading, error };
}