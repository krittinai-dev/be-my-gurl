# 💕 be-my-gurl

เว็บโรแมนติก + อัลบั้มความทรงจำของเราสองคน — ทำด้วย **Next.js + Supabase**

## ฟีเจอร์

- 💌 **Intro** — หน้าขอเป็นแฟน (typewriter, จดหมาย, ปุ่ม "ไม่" วิ่งหนี, confetti) เก็บไว้เป็นหน้าเปิด
- 🔒 **Login** — ใส่ "รหัสร่วม" อันเดียว (แค่โค้ด ไม่ต้องมีอีเมล) ล็อกจริงฝั่ง server ด้วย cookie
- 📅 **Album** — ปฏิทินเดือนใหญ่ วันไหนมีรูปจะโชว์รูปเล็ก กดดูรูปใหญ่ได้ (lightbox)
- ▶️ **Slideshow** — เล่นสไลด์โชว์เต็มจอ เลื่อนอัตโนมัติ + Ken Burns ไว้ดูด้วยกัน 2 คน
- ⬆️ **Upload** — อัปโหลดรูปได้ทั้งคู่ เลือกวัน + แคปชั่น เก็บลง Supabase Storage + DB
- 🗑️ **ลบรูป** ได้จากใน lightbox

## เทคโนโลยี

- Next.js 15 (App Router) + TypeScript
- Supabase — Auth + Postgres + Storage
- CSS ล้วน (ธีมชมพู Pink Panther เดิม) ไม่มี framework

---

## วิธีตั้งค่า (ทำครั้งเดียว)

### 1. ติดตั้ง dependency
```bash
npm install
```

### 2. ตั้งค่า Supabase
1. เข้า [supabase.com](https://supabase.com) → สร้างโปรเจกต์
2. ไปที่ **SQL Editor** → วางเนื้อหาไฟล์ [`supabase/schema.sql`](supabase/schema.sql) ทั้งหมด → กด **Run**
   (สร้างตาราง `photos` + bucket `photos` + RLS ให้เรียบร้อย)
3. ไปที่ **Project Settings → API** เอา **URL** กับ **service_role key (secret)** มาใส่ `.env.local`
   > ✅ **ไม่ต้องสร้าง user / ไม่ต้องมีอีเมล** — ล็อกด้วยรหัสร่วมอย่างเดียว

### 3. สร้างไฟล์ `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret   # ฝั่ง server เท่านั้น ห้ามขึ้น NEXT_PUBLIC
ALBUM_PASSWORD=27062026                               # รหัสที่กรอกหน้าเว็บ (ใส่แค่โค้ด ไม่ต้องมีอีเมล)
SESSION_SECRET=<สุ่มยาวๆ>                              # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
> - **`ALBUM_PASSWORD`** = รหัสที่จะพิมพ์ตอนเข้าเว็บ (เช่น `27062026`)
> - **`SUPABASE_SERVICE_ROLE_KEY`** เป็นความลับ ใช้ฝั่ง server เท่านั้น (page/action) ไม่หลุดไป browser — รูปทั้งหมดอยู่ใน bucket แบบ private, ดึงผ่าน signed URL
> - **`SESSION_SECRET`** ใช้เซ็น cookie กันคนปลอม session

### 4. รัน
```bash
npm run dev
```
เปิด http://localhost:3000

---

## Deploy (ให้เปิดจากมือถือได้ทุกที่)

Deploy ฟรีบน [Vercel](https://vercel.com):
1. push โค้ดขึ้น GitHub
2. Import repo ใน Vercel
3. ใส่ Environment Variables 3 ตัวเดียวกับ `.env.local`
4. Deploy — ได้ลิงก์เว็บส่งให้แฟนเปิดได้เลย 💕

## โครงสร้าง

```
app/
├── page.tsx          ← หน้า intro (ขอเป็นแฟน)
├── login/            ← หน้าใส่รหัส
├── album/            ← ปฏิทิน + อัปโหลด + lightbox
│   ├── page.tsx      ← ดึงรูป (server)
│   ├── AlbumClient.tsx
│   └── actions.ts    ← upload / delete / logout
lib/supabase/         ← client / server / middleware
supabase/schema.sql   ← ตาราง + storage + RLS
middleware.ts         ← กันหน้า /album ให้เฉพาะคนล็อกอิน
```
