import React, { useCallback, useEffect, useState } from 'react';
import { client } from '../Utils/httpClient';
import { PersonalData } from '../Shared/types/types';

type Status = 'checking' | 'authorized' | 'guest';

interface AuthContextType {
  /** True while the session is being checked on first load. */
  checking: boolean;
  authorized: boolean;
  user: PersonalData | null;
  logIn: (user: PersonalData) => void;
  logOut: () => Promise<void>;
  setUser: (user: PersonalData | null) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  checking: true,
  authorized: false,
  user: null,
  logIn: () => {},
  logOut: async () => {},
  setUser: () => {},
});

// Older versions kept the token, a login flag and even the password here.
for (const key of ['authToken', 'isAuthorized', 'password', 'userName']) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage unavailable: nothing to clean up.
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<Status>('checking');
  const [user, setUserState] = useState<PersonalData | null>(null);

  // The session lives in an httpOnly cookie; ask the API whether it is valid.
  useEffect(() => {
    client
      .get<PersonalData>('account/me')
      .then((me) => {
        setUserState(me);
        setStatus('authorized');
      })
      .catch(() => setStatus('guest'));
  }, []);

  const logIn = useCallback((me: PersonalData) => {
    setUserState(me);
    setStatus('authorized');
  }, []);

  const logOut = useCallback(async () => {
    try {
      await client.post('auth/logout', {});
    } finally {
      setUserState(null);
      setStatus('guest');
    }
  }, []);

  const setUser = useCallback((next: PersonalData | null) => {
    setUserState(next);
    setStatus(next ? 'authorized' : 'guest');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        checking: status === 'checking',
        authorized: status === 'authorized',
        user,
        logIn,
        logOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
