import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis foram preenchidas e não são os placeholders iniciais
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl !== 'your-supabase-url' && 
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
