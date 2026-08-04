import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis foram preenchidas e não são os placeholders iniciais
const isValidUrl = Boolean(
  rawUrl && 
  typeof rawUrl === 'string' &&
  (rawUrl.startsWith('https://') || rawUrl.startsWith('http://')) &&
  !rawUrl.includes('your-supabase-url')
);

const isValidKey = Boolean(
  rawKey && 
  typeof rawKey === 'string' &&
  !rawKey.includes('your-supabase-anon-key') &&
  rawKey.length > 20
);

export const isSupabaseConfigured = Boolean(isValidUrl && isValidKey);

const supabaseUrl = isValidUrl ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isValidKey ? rawKey : 'placeholder-anon-key-12345678901234567890';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
