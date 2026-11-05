import { useAuth } from '../context/AuthContext.jsx';
import { useLogin } from '../context/LoginContext.jsx';

export function useRequireAuth() {
  const { user, isSupabaseConfigured } = useAuth();
  const { openLogin } = useLogin();
  return (action) => {
    if (isSupabaseConfigured && !user) {
      openLogin();
      return false;
    }
    if (typeof action === 'function') action();
    return true;
  };
}
