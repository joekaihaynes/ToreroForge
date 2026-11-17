// Auth context: the one place the frontend learns WHO is logged in.
// Every component reads the current user with useAuth() instead of hardcoding an id.
//
// Semester 1: a mock signed-in user, so pages work without a login screen.
// When the Auth component (2A) is built, its login page calls signIn(token, user)
// with the JWT and user returned by POST /api/auth/login. Nothing else changes.
// When USD SSO replaces email/password, only the login page changes.

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { setTokenProvider } from '../lib/apiClient.js';
import { isLive } from '../lib/config.js';

const MOCK_SESSION = {
  token: null,
  user: { id: 'u-001', name: 'Alex Rivera', email: 'arivera@sandiego.edu', role: 'student' },
};

const STORAGE_KEY = 'toreroforge.session';

function loadSession() {
  if (!isLive) return MOCK_SESSION;
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  // The API client asks for the token on every request.
  setTokenProvider(() => session.token);

  const signIn = useCallback((token, user) => {
    const next = { token, user };
    setSession(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  }, []);

  const signOut = useCallback(() => {
    setSession({ token: null, user: null });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* storage unavailable */ }
  }, []);

  const value = useMemo(
    () => ({
      user: session.user,            // { id, name, email, role } or null
      token: session.token,
      isSignedIn: Boolean(session.user),
      hasRole: (...roles) => Boolean(session.user) && roles.includes(session.user.role),
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>.');
  return ctx;
}