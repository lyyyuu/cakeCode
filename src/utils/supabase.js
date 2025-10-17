import { createClient } from '@supabase/supabase-js'

// ⚠️ 替换成你的配置
const SUPABASE_URL = 'https://yrdvusdqmikphyqrgbng.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHZ1c2RxbWlrcGh5cXJnYm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTE4MjcsImV4cCI6MjA3NjIyNzgyN30.Xh_liUr6oebs0B-R20U_mM__PaYOjFuFs36s-0DKu74'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
