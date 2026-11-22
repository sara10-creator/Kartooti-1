import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://gybfizqkjnttwggnzogz.supabase.co'

const SUPABASE_KEY = 'sb_publishable_GdcuaDvL2m4HWGNXtMHPww_qqUPFmye'

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
)

