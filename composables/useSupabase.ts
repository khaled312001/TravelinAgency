// Legacy Supabase client implementation - DEPRECATED
// This file is kept for reference but functionality has been replaced by the @nuxtjs/supabase module
// If you need to use Supabase, import from '#supabase/client' instead

import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase'

export const useCustomSupabaseClient = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient<Database>(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  return supabase
}