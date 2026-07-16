'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAuthenticated } from '@/lib/auth';
import { SESSION_COOKIE } from '@/lib/constants';

// อัปโหลดรูป (ทีละหลายไฟล์ได้) ลง Storage + บันทึกลง DB
export async function uploadPhotos(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  if (!(await isAuthenticated())) redirect('/login');

  const takenOn = String(formData.get('taken_on') || '');
  const caption = String(formData.get('caption') || '');
  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);

  if (!takenOn) return 'เลือกวันที่ก่อนนะ';
  if (files.length === 0) return 'ยังไม่ได้เลือกรูป';

  const supabase = createAdminClient();

  for (const file of files) {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${takenOn}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from('photos')
      .upload(path, file, { contentType: file.type || undefined });
    if (upErr) return 'อัปโหลดรูปไม่สำเร็จ: ' + upErr.message;

    const { error: dbErr } = await supabase.from('photos').insert({
      taken_on: takenOn,
      caption: caption || null,
      storage_path: path,
    });
    if (dbErr) {
      await supabase.storage.from('photos').remove([path]);
      return 'บันทึกลงฐานข้อมูลไม่สำเร็จ: ' + dbErr.message;
    }
  }

  revalidatePath('/album');
  return 'OK';
}

// แก้ไขวันที่ / แคปชั่นของรูป (กรณีกรอกผิด)
export async function updatePhoto(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  if (!(await isAuthenticated())) redirect('/login');

  const id = String(formData.get('id') || '');
  const takenOn = String(formData.get('taken_on') || '');
  const caption = String(formData.get('caption') || '');

  if (!id) return 'ไม่พบรูปที่จะแก้';
  if (!takenOn) return 'เลือกวันที่ก่อนนะ';

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('photos')
    .update({ taken_on: takenOn, caption: caption || null })
    .eq('id', id);

  if (error) return 'บันทึกไม่สำเร็จ: ' + error.message;

  revalidatePath('/album');
  return 'OK';
}

// ลบรูป
export async function deletePhoto(id: string, storagePath: string): Promise<void> {
  if (!(await isAuthenticated())) redirect('/login');

  const supabase = createAdminClient();
  await supabase.storage.from('photos').remove([storagePath]);
  await supabase.from('photos').delete().eq('id', id);
  revalidatePath('/album');
}

// ออกจากระบบ
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect('/login');
}
