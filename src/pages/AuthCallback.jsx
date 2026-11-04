import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSupabaseConfigured) { navigate('/'); return; }
    // Supabase automatically exchanges the code in the URL for a session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/');
      else navigate('/?login=failed');
    });
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Đang đăng nhập...
    </div>
  );
}