'use client';

import { useEffect, useMemo, useState, useActionState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPhotos, updatePhoto, deletePhoto, logout } from './actions';

export type Photo = {
  id: string;
  taken_on: string;
  caption: string | null;
  storage_path: string;
  url: string;
};

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

function pad2(n: number) { return n < 10 ? '0' + n : '' + n; }
function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
}
function formatThaiDate(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return d + ' ' + THAI_MONTHS[m - 1] + ' ' + (y + 543);
}

export default function AlbumClient({ photos }: { photos: Photo[] }) {
  const router = useRouter();

  // group by วันที่
  const byDate = useMemo(() => {
    const map: Record<string, Photo[]> = {};
    for (const p of photos) (map[p.taken_on] ||= []).push(p);
    return map;
  }, [photos]);

  // เดือนเริ่มต้น: เดือนของรูปล่าสุด ไม่งั้นเดือนปัจจุบัน
  const initial = photos.length ? photos[photos.length - 1].taken_on : todayKey();
  const [iy, im] = [Number(initial.slice(0, 4)), Number(initial.slice(5, 7)) - 1];
  const [year, setYear] = useState(iy);
  const [month, setMonth] = useState(im); // 0-indexed

  const [lightboxDate, setLightboxDate] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);

  function prevMonth() {
    setMonth((m) => { if (m === 0) { setYear((y) => y - 1); return 11; } return m - 1; });
  }
  function nextMonth() {
    setMonth((m) => { if (m === 11) { setYear((y) => y + 1); return 0; } return m + 1; });
  }

  // สร้างเซลล์ปฏิทิน
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const tk = todayKey();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <section className="page active" id="page-gallery">
      <div className="gallery-wrap">
        <div className="gallery-head">
          <div className="gallery-badge">💞 ความทรงจำของเรา</div>
          <div className="album-actions">
            {photos.length > 0 && (
              <button className="album-play" onClick={() => setShowSlideshow(true)}>▶ สไลด์โชว์</button>
            )}
            <button className="album-add" onClick={() => setShowUpload(true)}>+ เพิ่มรูป</button>
            <form action={logout}>
              <button className="album-logout" type="submit">ออก</button>
            </form>
          </div>
        </div>

        <div className="cal-nav">
          <button className="cal-arrow" onClick={prevMonth}>‹</button>
          <div className="cal-month">{THAI_MONTHS[month]} {year + 543}</div>
          <button className="cal-arrow" onClick={nextMonth}>›</button>
        </div>

        <div className="cal-weekdays">
          <span>อา</span><span>จ</span><span>อ</span><span>พ</span><span>พฤ</span><span>ศ</span><span>ส</span>
        </div>

        <div className="cal-grid">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="cal-cell cal-blank" />;
            const key = year + '-' + pad2(month + 1) + '-' + pad2(d);
            const dayPhotos = byDate[key];
            const has = !!dayPhotos;
            return (
              <div
                key={i}
                className={`cal-cell${has ? ' cal-has' : ''}${key === tk ? ' cal-today' : ''}`}
                onClick={has ? () => setLightboxDate(key) : undefined}
              >
                <span className="cal-num">{d}</span>
                {has && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="cal-thumb" src={dayPhotos[0].url} alt={dayPhotos[0].caption || ''} loading="lazy" />
                    <span className="cal-dot">💕</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {photos.length === 0 ? (
          <p className="album-empty">ยังไม่มีรูปเลย 🥺<br />กด “+ เพิ่มรูป” เพื่อลงรูปแรกของเรากันนน</p>
        ) : (
          <p className="cal-hint">👆 แตะวันที่มีรูป เพื่อดูความทรงจำ</p>
        )}
      </div>

      {lightboxDate && byDate[lightboxDate] && (
        <Lightbox
          photos={byDate[lightboxDate]}
          onClose={() => setLightboxDate(null)}
          onChanged={() => { setLightboxDate(null); router.refresh(); }}
        />
      )}

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} defaultDate={tk} />
      )}

      {showSlideshow && (
        <Slideshow photos={photos} onClose={() => setShowSlideshow(false)} />
      )}
    </section>
  );
}

// ── Slideshow (จอใหญ่ ดูด้วยกัน) ─────────────────────────
function Slideshow({ photos, onClose }: { photos: Photo[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const cur = photos[idx];

  const go = (delta: number) => setIdx((i) => (i + delta + photos.length) % photos.length);

  // เลื่อนอัตโนมัติทุก 4.5 วิ ตอนเล่นอยู่
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % photos.length), 4500);
    return () => clearInterval(t);
  }, [playing, photos.length]);

  // ปุ่มลูกศร / Esc / เว้นวรรค
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === ' ') { e.preventDefault(); setPlaying((p) => !p); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length]);

  return (
    <div className="slideshow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={cur.id} className="ss-img" src={cur.url} alt={cur.caption || ''} />

      <div className="ss-info">
        {cur.caption && <div className="ss-caption">{cur.caption}</div>}
        <div className="ss-date">💕 {formatThaiDate(cur.taken_on)}</div>
      </div>

      <div className="ss-counter">{idx + 1} / {photos.length}</div>
      <button className="ss-close" onClick={onClose}>✕</button>

      <div className="ss-controls">
        <button className="ss-btn" onClick={() => go(-1)} title="ก่อนหน้า">‹</button>
        <button className="ss-btn ss-play" onClick={() => setPlaying((p) => !p)} title="เล่น/หยุด">
          {playing ? '⏸' : '▶'}
        </button>
        <button className="ss-btn" onClick={() => go(1)} title="ถัดไป">›</button>
      </div>
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────
function Lightbox({ photos, onClose, onChanged }: {
  photos: Photo[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [pending, startTransition] = useTransition();
  const [confirmDel, setConfirmDel] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const safeIdx = Math.min(idx, photos.length - 1);
  const cur = photos[safeIdx];
  const many = photos.length > 1;

  function del() {
    startTransition(async () => {
      await deletePhoto(cur.id, cur.storage_path);
      onChanged();
    });
  }

  return (
    <div className="lightbox show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button className="lb-close" onClick={onClose}>✕</button>
      {many && <button className="lb-arrow lb-prev" onClick={() => { setIdx((i) => (i - 1 + photos.length) % photos.length); setConfirmDel(false); }}>‹</button>}
      <div className="lb-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="lb-img" src={cur.url} alt={cur.caption || ''} />
        <div className="lb-caption">{cur.caption || ''}</div>
        <div className="lb-date">💕 {formatThaiDate(cur.taken_on)}</div>
        {many && (
          <div className="lb-dots">
            {photos.map((_, i) => <span key={i} className={`lb-dot${i === safeIdx ? ' active' : ''}`} />)}
          </div>
        )}
      </div>
      {many && <button className="lb-arrow lb-next" onClick={() => { setIdx((i) => (i + 1) % photos.length); setConfirmDel(false); }}>›</button>}

      <div className="lb-actions">
        <button className="lb-action lb-edit" onClick={() => setShowEdit(true)} disabled={pending}>✏️ แก้ไข</button>
        {!confirmDel ? (
          <button className="lb-action lb-del" onClick={() => setConfirmDel(true)} disabled={pending}>🗑️ ลบ</button>
        ) : (
          <button className="lb-action lb-del-confirm" onClick={del} disabled={pending}>
            {pending ? 'กำลังลบ...' : 'แน่ใจ? กดอีกที'}
          </button>
        )}
      </div>

      {showEdit && (
        <EditModal photo={cur} onClose={() => setShowEdit(false)} onSaved={onChanged} />
      )}
    </div>
  );
}

// ── Edit modal (แก้วันที่ / แคปชั่น) ─────────────────────
function EditModal({ photo, onClose, onSaved }: {
  photo: Photo;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [result, formAction, pending] = useActionState(updatePhoto, null);

  useEffect(() => {
    if (result === 'OK') onSaved();
  }, [result, onSaved]);

  const error = result && result !== 'OK' ? result : '';

  return (
    <div className="upload-overlay edit-overlay show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="upload-box">
        <p className="upload-title">✏️ แก้ไขความทรงจำ</p>
        <p className="upload-sub">แก้วันที่หรือแคปชั่นที่กรอกผิดได้เลย</p>
        <form action={formAction}>
          <input type="hidden" name="id" value={photo.id} />
          <div className="field">
            <label>วันที่</label>
            <input type="date" name="taken_on" defaultValue={photo.taken_on} required />
          </div>
          <div className="field">
            <label>แคปชั่น</label>
            <input type="text" name="caption" defaultValue={photo.caption || ''} placeholder="ใส่หรือเว้นว่างก็ได้" />
          </div>
          <p className="upload-error">{error || ' '}</p>
          <div className="upload-actions">
            <button className="btn-no" type="button" onClick={onClose}>ยกเลิก</button>
            <button className="btn-yes" type="submit" disabled={pending}>
              {pending ? <><span className="spinner" />กำลังบันทึก...</> : 'บันทึก 💕'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Upload modal ─────────────────────────────────────────
function UploadModal({ onClose, defaultDate }: { onClose: () => void; defaultDate: string }) {
  const [result, formAction, pending] = useActionState(uploadPhotos, null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const router = useRouter();

  // อัปโหลดสำเร็จ → ปิด modal + รีเฟรชปฏิทิน
  useEffect(() => {
    if (result === 'OK') {
      onClose();
      router.refresh();
    }
  }, [result, onClose, router]);

  const error = result && result !== 'OK' ? result : '';

  return (
    <div className="upload-overlay show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="upload-box">
        <p className="upload-title">📸 เพิ่มความทรงจำ</p>
        <p className="upload-sub">เลือกวัน ใส่แคปชั่น แล้วเลือกรูปได้เลย</p>
        <form action={formAction}>
          <div className="field">
            <label>วันที่</label>
            <input type="date" name="taken_on" defaultValue={defaultDate} required />
          </div>
          <div className="field">
            <label>แคปชั่น (ใส่หรือไม่ใส่ก็ได้)</label>
            <input type="text" name="caption" placeholder="เช่น ทริปทะเลครั้งแรก 🌊" />
          </div>
          <div className="field">
            <label>รูป (เลือกได้หลายรูป)</label>
            <label className="file-drop">
              {fileNames.length ? `เลือกแล้ว ${fileNames.length} รูป` : '📁 แตะเพื่อเลือกรูป'}
              <input
                type="file"
                name="files"
                accept="image/*"
                multiple
                onChange={(e) => setFileNames(Array.from(e.target.files || []).map((f) => f.name))}
              />
            </label>
            {fileNames.length > 0 && <p className="file-names">{fileNames.join(', ')}</p>}
          </div>
          <p className="upload-error">{error || ' '}</p>
          <div className="upload-actions">
            <button className="btn-no" type="button" onClick={onClose}>ยกเลิก</button>
            <button className="btn-yes" type="submit" disabled={pending}>
              {pending ? <><span className="spinner" />กำลังอัปโหลด...</> : 'บันทึก 💕'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
