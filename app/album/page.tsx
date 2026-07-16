import { createAdminClient } from '@/lib/supabase/admin';
import AlbumClient, { type Photo } from './AlbumClient';

export const dynamic = 'force-dynamic';

// ต้องมี url + service key เป็น ASCII ล้วน (กัน placeholder ภาษาไทยทำ header พัง)
function supabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return url.startsWith('http') && key.length > 20 && /^[\x20-\x7E]+$/.test(key);
}

export default async function AlbumPage() {
  if (!supabaseConfigured()) {
    return (
      <section className="page active">
        <div className="setup-banner">
          ⚙️ <b>ยังไม่ได้ตั้งค่า Supabase</b><br />
          ใส่ <code>SUPABASE_SERVICE_ROLE_KEY</code> (จริง) ใน <code>.env.local</code><br />
          แล้วรัน <code>supabase/schema.sql</code> ใน SQL Editor<br />
          จากนั้นรีสตาร์ท dev server (<code>npm run dev</code>)
        </div>
      </section>
    );
  }

  const supabase = createAdminClient();
  const photos: Photo[] = [];

  try {
    const { data: rows, error } = await supabase
      .from('photos')
      .select('id, taken_on, caption, storage_path')
      .order('taken_on', { ascending: true });

    if (error) throw error;

    if (rows && rows.length > 0) {
      const paths = rows.map((r) => r.storage_path);
      const { data: signed } = await supabase.storage
        .from('photos')
        .createSignedUrls(paths, 60 * 60); // 1 ชั่วโมง

      rows.forEach((r, i) => {
        photos.push({
          id: r.id,
          taken_on: r.taken_on,
          caption: r.caption,
          storage_path: r.storage_path,
          url: signed?.[i]?.signedUrl || '',
        });
      });
    }
  } catch {
    return (
      <section className="page active">
        <div className="setup-banner">
          ⚠️ <b>เชื่อม Supabase ไม่สำเร็จ</b><br />
          เช็คว่ารัน <code>supabase/schema.sql</code> แล้ว และ <code>SUPABASE_SERVICE_ROLE_KEY</code> ถูกต้อง
        </div>
      </section>
    );
  }

  return <AlbumClient photos={photos} />;
}
