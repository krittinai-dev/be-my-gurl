-- ============================================================
-- be-my-gurl — Supabase schema
-- รันใน Supabase Dashboard → SQL Editor → New query → วางทั้งหมด → Run
-- ============================================================

-- ── ตารางเก็บรูป ─────────────────────────────────────────
create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  taken_on    date not null,                 -- วันที่ของความทรงจำ (ใช้จัดลงปฏิทิน)
  caption     text,                           -- แคปชั่น
  storage_path text not null,                 -- path ไฟล์ในบั้กเก็ต photos
  created_at  timestamptz not null default now()
);

create index if not exists photos_taken_on_idx on public.photos (taken_on);

-- เปิด Row Level Security
alter table public.photos enable row level security;

-- ให้เฉพาะคนที่ล็อกอินแล้ว (authenticated) อ่าน/เพิ่ม/ลบได้
create policy "authenticated can read photos"
  on public.photos for select
  to authenticated using (true);

create policy "authenticated can insert photos"
  on public.photos for insert
  to authenticated with check (true);

create policy "authenticated can delete photos"
  on public.photos for delete
  to authenticated using (true);

-- ============================================================
-- ── Storage bucket ──────────────────────────────────────
-- สร้างบั้กเก็ตชื่อ "photos" แบบ private
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

-- ให้คนที่ล็อกอินแล้ว upload / อ่าน / ลบ ไฟล์ในบั้กเก็ต photos ได้
create policy "authenticated can upload to photos bucket"
  on storage.objects for insert
  to authenticated with check (bucket_id = 'photos');

create policy "authenticated can read photos bucket"
  on storage.objects for select
  to authenticated using (bucket_id = 'photos');

create policy "authenticated can delete from photos bucket"
  on storage.objects for delete
  to authenticated using (bucket_id = 'photos');
