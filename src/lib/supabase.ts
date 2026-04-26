import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Verifica se as variáveis foram preenchidas e não são os placeholders iniciais
  const isValidUrl = supabaseUrl && 
    supabaseUrl !== 'your-supabase-url' && 
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co');

  const isValidKey = supabaseAnonKey && 
    supabaseAnonKey !== 'your-supabase-anon-key' &&
    supabaseAnonKey.length > 20;

  export const isSupabaseConfigured = Boolean(isValidUrl && isValidKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
