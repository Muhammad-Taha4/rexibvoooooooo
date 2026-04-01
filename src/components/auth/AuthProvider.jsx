import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { FullPageLoader } from '../ui/LoadingSpinner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety fallback: stop loading after 3 seconds even if database hangs
    const timeout = setTimeout(() => setLoading(false), 3000);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.user.email?.toLowerCase() !== 'taha@gmail.com') {
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.user.email?.toLowerCase() !== 'taha@gmail.com') {
        supabase.auth.signOut();
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const isAdmin = user?.email?.toLowerCase() === 'taha@gmail.com';

  if (loading) return <FullPageLoader />;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
