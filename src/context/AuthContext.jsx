import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured, getAuthSettings } from '../lib/supabase.js';

const AuthContext = createContext(null);

const NOT_CONFIGURED =
  'Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env';

function notConfigured() {
  return { error: new Error(NOT_CONFIGURED) };
}

// Translate common Supabase auth errors to friendly Vietnamese messages.
export function authErrorMessage(error) {
  if (!error) return '';
  const msg = (error.message || '').toLowerCase();
  const code = (error.code || error.error_code || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'Email/số điện thoại hoặc mật khẩu không đúng.';
  if (msg.includes('email not confirmed')) return 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.';
  if (msg.includes('user already registered') || msg.includes('already registered')) return 'Tài khoản này đã được đăng ký. Hãy đăng nhập.';
  if (msg.includes('password should be at least') || code === 'weak_password') return 'Mật khẩu phải có ít nhất 6 ký tự.';
  if (msg.includes('over_email_send_rate_limit') || msg.includes('email rate limit')) {
    return 'Bạn đã yêu cầu gửi email quá nhiều lần. Vui lòng thử lại sau vài phút.';
  }
  if (msg.includes('rate limit') || msg.includes('too many') || code === 'over_request_rate_limit') {
    return 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.';
  }
  if (msg.includes('email address') && msg.includes('invalid')) return 'Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ email.';
  if (msg.includes('unable to validate email')) return 'Email không hợp lệ. Vui lòng kiểm tra lại địa chỉ email.';
  if (msg.includes('provider is not enabled')) return 'Phương thức đăng nhập này chưa được bật. Vui lòng dùng email hoặc số điện thoại.';
  if (msg.includes('email not authorized') || msg.includes('not authorized')) return 'Email này không được phép đăng nhập. Vui lòng liên hệ quản trị viên.';
  if (msg.includes('token has expired') || msg.includes('invalid token') || msg.includes('otp_expired')) {
    return 'Liên kết đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại.';
  }
  if (msg.includes('phone')) return 'Số điện thoại không hợp lệ hoặc chưa được xác thực.';
  if (msg.includes('signups not allowed') || msg.includes('signup is disabled')) return 'Tính năng đăng ký đang tạm khoá. Vui lòng thử lại sau.';
  if (msg.includes('user not found')) return 'Không tìm thấy tài khoản với thông tin này.';
  return error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authSettings, setAuthSettings] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAuthSettings().then((settings) => { if (mounted) setAuthSettings(settings); });
    return () => { mounted = false; };
  }, []);

  const providers = useMemo(() => ({
    email: authSettings ? authSettings.email !== false : true,
    phone: authSettings ? authSettings.phone === true : false,
    google: authSettings ? authSettings.external?.google === true : false,
    facebook: authSettings ? authSettings.external?.facebook === true : false,
  }), [authSettings]);

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

  const value = useMemo(() => {
    const signInWithGoogle = async () => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/auth/callback' },
      });
    };

    const signInWithFacebook = async () => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: { redirectTo: window.location.origin + '/auth/callback' },
      });
    };

    const signInWithEmail = async (email, password) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.signInWithPassword({ email, password });
    };

    const signUpWithEmail = async (email, password, name) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });
    };

    const signInWithPhone = async (phone, password) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.signInWithPassword({ phone, password });
    };

    const signUpWithPhone = async (phone, password, name) => {
      if (!isSupabaseConfigured) return notConfigured();
      const normalized = phone.startsWith('0')
        ? '+84' + phone.slice(1)
        : phone.startsWith('+84') ? phone : '+' + phone.replace(/\D/g, '');
      return supabase.auth.signUp({
        phone: normalized,
        password,
        options: { data: { full_name: name } },
      });
    };

    const resetPasswordForEmail = async (email) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset',
      });
    };

    const resendConfirmationEmail = async (email) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: window.location.origin + '/auth/callback' },
      });
    };

    const updatePassword = async (password) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.updateUser({ password });
    };

    const updateProfile = async (fields) => {
      if (!isSupabaseConfigured) return notConfigured();
      return supabase.auth.updateUser({ data: fields });
    };

    const signOut = async () => {
      if (isSupabaseConfigured) await supabase.auth.signOut();
      setUser(null);
    };

    return {
      user,
      loading,
      authSettings,
      providers,
      signInWithGoogle,
      signInWithFacebook,
      signInWithEmail,
      signUpWithEmail,
      signInWithPhone,
      signUpWithPhone,
      resetPasswordForEmail,
      resendConfirmationEmail,
      updatePassword,
      updateProfile,
      signOut,
      isSupabaseConfigured,
    };
  }, [user, loading, authSettings, providers]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
