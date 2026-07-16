/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // อนุญาตให้โหลดรูปจาก Supabase Storage (แก้ domain ให้ตรงกับโปรเจกต์ของคุณ)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
