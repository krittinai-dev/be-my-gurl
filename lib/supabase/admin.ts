import { createClient } from '@supabase/supabase-js';

// Supabase client ฝั่ง server เท่านั้น — ใช้ service role key (ข้าม RLS ได้)
// ห้าม import ไฟล์นี้ใน client component เด็ดขาด (key จะหลุด)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
