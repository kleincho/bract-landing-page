import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nynoniwkrtrqadcuvvsn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55bm9uaXdrcnRycWFkY3V2dnNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NzgwNTIsImV4cCI6MjA2MTM1NDA1Mn0.hjgGon4igfzrlN5_t_iAIt9sN-dwKnyFIpaMmLgEyIM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
