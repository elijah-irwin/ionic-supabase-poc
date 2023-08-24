import { createContext, useContext, useState, useEffect, ReactElement } from 'react';
import { Redirect } from 'react-router-dom';

// DB.
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

/****************************************
 * - Auth Context -
 ***************************************/
export const AuthContext = createContext<Session | null>(null);
export const useAuthContext = () => useContext(AuthContext);

/****************************************
 * - Auth Provider -
 ***************************************/
export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
  }, []);

  // Render.
  return <AuthContext.Provider value={session}>{!isLoading && children}</AuthContext.Provider>;
};

export const Protected = ({ children }: { children: ReactElement }) => {
  const session = useAuthContext();
  if (!session) return <Redirect to='/login' />;
  return children;
};

export const NonAuth = ({ children }: { children: ReactElement }) => {
  const session = useAuthContext();
  if (session && session.user) return <Redirect to='/' />;
  return children;
};
