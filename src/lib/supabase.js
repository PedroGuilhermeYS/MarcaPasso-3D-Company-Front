import { createClient } from '@supabase/supabase-js'

// Configure essas variáveis no seu .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar definidos no .env')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Nome do bucket de imagens de produtos
export const BUCKET_PRODUTOS = 'imagens-produtos'
