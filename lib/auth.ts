import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './constants';

// เช็คว่าใส่รหัสถูกแล้วหรือยัง (อ่าน cookie ฝั่ง server)
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return !!token && !!process.env.SESSION_SECRET && token === process.env.SESSION_SECRET;
}
