import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zzbkbxwxbblfoekfknbs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6YmtieHd4YmJsZm9la2ZrbmJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjgyMjksImV4cCI6MjA2MzQwNDIyOX0._x5nYffQxk9X84x0-2C5UULcN3NqOIZNAANcr_TS6cw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 