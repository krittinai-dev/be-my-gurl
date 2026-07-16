'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE } from '@/lib/constants';

// ล็อกอินด้วย "รหัสร่วม" อย่างเดียว — เทียบกับ ALBUM_PASSWORD แล้วตั้ง cookie
export async function login(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  const code = String(formData.get('password') || '');
  const expected = process.env.ALBUM_PASSWORD;
  const secret = process.env.SESSION_SECRET;

  if (!expected || !secret) {
    return 'ยังไม่ได้ตั้งค่า ALBUM_PASSWORD / SESSION_SECRET ใน .env.local';
  }
  if (!code) {
    return 'ใส่รหัสก่อนนะ';
  }
  if (code !== expected) {
    return 'รหัสไม่ถูกนะ ลองใหม่ 🥺';
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ปี
  });

  redirect('/album');
}
