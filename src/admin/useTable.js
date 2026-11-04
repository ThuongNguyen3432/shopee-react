import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { store } from './store.js';

// Generic data hook that works with Supabase (when configured) or localStorage fallback.
export function useTable(table) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.from(table).select('*').order('id', { ascending: false });
        if (error) throw error;
        setRows(data || []);
      } else {
        setRows(store.get(table));
      }
    } catch (e) {
      setError(e.message);
      // fallback to local
      try { setRows(store.get(table)); } catch {}
    } finally {
      setLoading(false);
    }
  }, [table]);

  useEffect(() => { refresh(); }, [refresh]);

  const insert = useCallback(async (row) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      setRows((prev) => [data, ...prev]);
      return data;
    }
    const r = store.insert(table, row);
    setRows(store.get(table));
    return r;
  }, [table]);

  const update = useCallback(async (id, patch) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
      if (error) throw error;
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
      return data;
    }
    store.update(table, id, patch);
    setRows(store.get(table));
  }, [table]);

  const remove = useCallback(async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      setRows((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    store.remove(table, id);
    setRows(store.get(table));
  }, [table]);

  return { rows, loading, error, refresh, insert, update, remove };
}