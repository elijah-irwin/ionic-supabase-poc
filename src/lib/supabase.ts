import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uepirjskpelalzdgonze.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcGlyanNrcGVsYWx6ZGdvbnplIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2NDE5NzcsImV4cCI6MjAwODIxNzk3N30.pgzSNpXhFpM87yhi9wX3vZC4ia3SYEggSriVocpr_yM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)