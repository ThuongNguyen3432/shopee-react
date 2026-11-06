import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
export const isSupabaseConfigured = !!supabase;
export const supabaseUrl = url;
export const supabaseAnonKey = key;

// Helper: throw a friendly error when Supabase isn't configured yet
export function requireSupabase() {
  if (!supabase) throw new Error('Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY vào .env');
  return supabase;
}

// Read the public auth configuration of the project so the UI can hide
// sign-in methods that are not enabled (phone, Google, Facebook...).
// Returns null when it cannot be read (offline, invalid key...).
let settingsPromise = null;
export function getAuthSettings() {
  if (!supabase) return Promise.resolve(null);
  if (settingsPromise) return settingsPromise;
  settingsPromise = fetch(`${url}/auth/v1/settings`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);
  return settingsPromise;
}
