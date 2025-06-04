import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Build zamanında environment variable'lar yoksa dummy değerler kullan
const url = supabaseUrl || 'https://dummy.supabase.co'
const key = supabaseAnonKey || 'dummy_key'

export const supabase = createClient(url, key)

// Environment variable'ların eksik olup olmadığını kontrol et
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
} 