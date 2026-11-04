import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) { setUser(data.session?.user ?? null); setLoading(false); }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return; }
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } });
  };
  const signInWithFacebook = async () => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return; }
    await supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: window.location.origin + '/auth/callback' } });
  };
  const signInWithEmail = async (email, password) => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return { error: new Error('not configured') }; }
    return supabase.auth.signInWithPassword({ email, password });
  };
  const signUpWithEmail = async (email, password, name) => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return { error: new Error('not configured') }; }
    return supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
  };
  const signInWithPhone = async (phone, password) => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return { error: new Error('not configured') }; }
    return supabase.auth.signInWithPassword({ phone, password });
  };
  const signUpWithPhone = async (phone, password, name) => {
    if (!isSupabaseConfigured) { alert('Supabase chưa cấu hình'); return { error: new Error('not configured') }; }
    return supabase.auth.signUp({ phone, password, options: { data: { full_name: name } } });
  };
  const signOut = async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithFacebook, signInWithEmail, signUpWithEmail, signInWithPhone, signUpWithPhone, signOut, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);