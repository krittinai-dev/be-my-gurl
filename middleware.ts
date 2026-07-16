import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/constants';

// กันหน้า /album ให้เฉพาะคนที่ใส่รหัสถูก (มี cookie ตรงกับ SESSION_SECRET)
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/album')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token || token !== process.env.SESSION_SECRET) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/album/:path*'],
};
