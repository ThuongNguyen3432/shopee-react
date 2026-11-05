import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (isSupabaseConfigured && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="text-gray-400 text-sm">Đang tải...</div>
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/?login=1&redirect=${redirect}`} replace />;
  }

  return children;
}
