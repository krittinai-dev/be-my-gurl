'use strict';

// ============================================================
// CONFIG — แก้ได้เลยครับ
// ============================================================
const CONFIG = {
  introText: 'ถึง pluem 💕',
  noEscapeMessages: [
    'อย่ากดเลยนะ 🥺',
    'ยังไม่พร้อมก็ได้ แต่ลองดูก่อนได้ไหม 😭',
    'กดได้เลย กดซ้ายได้เลย 😤',
    'pluem~ กด "ได้เลย" เถอะนะ 🙏',
    'พี่รออยู่นะ!! 😱',
  ],

  // ============================================================
  // GALLERY — อัลบั้มปฏิทิน (แก้ตรงนี้ได้เลย)
  // ============================================================
  gallery: {
    // รหัสแบบเบาๆ ให้ดูกันแค่ 2 คน (ตั้งเป็น '' ถ้าไม่อยากใส่รหัส)
    pin: '1412',

    // เดือน/ปี ที่ให้เปิดครั้งแรก (ปี ค.ศ., month = 1-12)
    startYear: 2026,
    startMonth: 7,

    // ความทรงจำแต่ละวัน — date ต้องเป็น 'YYYY-MM-DD'
    // photos ใส่ path รูปได้หลายรูป (เก็บรูปไว้ในโฟลเดอร์ assets/)
    memories: [
      {
        date: '2026-07-14',
        caption: 'วันแรกที่เที่ยวด้วยกัน 🌊',
        photos: ['assets/roses-guy.jpeg'],
      },
      {
        date: '2026-07-20',
        caption: 'กินของอร่อยกัน 🍰',
        photos: ['assets/shy-boy.jpeg', 'assets/love-explosion.jpeg'],
      },
    ],
  },
};

// ============================================================
// MUSIC BOTTOM SHEET
// ============================================================
const musicBtn     = document.getElementById('music-toggle');
const musicSheet   = document.getElementById('music-sheet');
const musicOverlay = document.getElementById('music-overlay');
const musicClose   = document.getElementById('music-close');

function openMusicSheet() {
  musicSheet.classList.add('open');
  musicOverlay.classList.add('show');
  musicBtn.innerHTML = '🎵 กำลังเล่น';
}

function closeMusicSheet() {
  musicSheet.classList.remove('open');
  musicOverlay.classList.remove('show');
}

musicBtn.addEventListener('click', openMusicSheet);
musicClose.addEventListener('click', closeMusicSheet);
musicOverlay.addEventListener('click', closeMusicSheet);

// ============================================================
// HEARTS — หัวใจปลิว
// ============================================================
const HEART_EMOJIS = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '🩶', '🤍', '💕', '💗', '💓'];

function spawnHeart() {
  const container = document.getElementById('hearts-container');
  const el = document.createElement('span');
  el.className = 'floating-heart';
  el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  const dur = 5 + Math.random() * 8;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay = '0s';
  el.style.opacity = (0.4 + Math.random() * 0.5).toString();
  container.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}

setInterval(spawnHeart, 600);
for (let i = 0; i < 10; i++) {
  setTimeout(spawnHeart, i * 200);
}

// ============================================================
// PAGE TRANSITIONS
// ============================================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ============================================================
// PAGE 1: INTRO — Typewriter
// ============================================================
function startTypewriter(targetId, text, callback) {
  const el = document.getElementById(targetId);
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      el.classList.remove('typewriter');
      if (callback) setTimeout(callback, 400);
    }
  }, 80);
}

document.getElementById('btn-next-intro').addEventListener('click', () => {
  showPage('page-reasons');
  setupLetter();
});

startTypewriter('intro-text', CONFIG.introText);

// ============================================================
// PAGE 2: LOVE LETTER
// ============================================================
const LETTER_LINES = [
  'pluem,',
  '',
  'หนูเคยบอกว่ายังไม่เป็นแฟน',
  'ไม่ขอเป็นแฟนสักที...',
  '',
  'พี่มีไรจะบอก',
  '',
  'ขอโทษที่ผ่านมาที่ทำให้เสียใจ',
  '',
  'พี่รักหนูนะ',
  'รักจริงๆ ไม่ได้แกล้งทำ',
  '',
  'และวันนี้พี่มีอะไรอยากบอก 🌹',
];

function setupLetter() {
  const envelope = document.getElementById('letter-envelope');
  const sheet = document.getElementById('letter-sheet');
  const linesEl = document.getElementById('letter-lines');

  let hint = envelope.parentElement.querySelector('.open-hint');
  if (!hint) {
    hint = document.createElement('p');
    hint.className = 'open-hint';
    hint.textContent = '👆 แตะเพื่อเปิดจดหมาย';
    envelope.parentElement.insertBefore(hint, envelope.nextSibling);
  }
  hint.style.display = '';

  envelope.addEventListener('click', function openLetter() {
    envelope.classList.add('opening');
    hint.style.display = 'none';
    setTimeout(() => {
      envelope.style.display = 'none';
      sheet.style.display = 'block';
      document.getElementById('page-reasons').classList.add('scroll-top');
      document.getElementById('page-reasons').scrollTop = 0;
      linesEl.innerHTML = '';
      LETTER_LINES.forEach((line, i) => {
        const span = document.createElement('span');
        span.className = 'letter-line';
        span.textContent = line || ' ';
        linesEl.appendChild(span);
        setTimeout(() => span.classList.add('show'), i * 220 + 100);
      });
    }, 700);
  }, { once: true });
}

document.getElementById('btn-next-reasons').addEventListener('click', () => {
  showPage('page-question');
});

// ============================================================
// PAGE 3: THE QUESTION — Runaway "No" button
// ============================================================
const btnNo = document.getElementById('btn-no');
const btnYes = document.getElementById('btn-yes');
const hintEl = document.getElementById('no-hint');
const memeScream = document.getElementById('meme-scream');
let noCount = 0;
let screamTimeout = null;

function runNoButton() {
  noCount++;
  const msg = CONFIG.noEscapeMessages[Math.min(noCount - 1, CONFIG.noEscapeMessages.length - 1)];
  hintEl.textContent = msg;

  const maxX = window.innerWidth - 160;
  const maxY = window.innerHeight - 80;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  btnNo.style.position = 'fixed';
  btnNo.style.left = randomX + 'px';
  btnNo.style.top = randomY + 'px';
  btnNo.style.transition = 'left 0.25s ease, top 0.25s ease';
  btnNo.style.zIndex = '999';

  memeScream.classList.add('show');
  if (screamTimeout) clearTimeout(screamTimeout);
  screamTimeout = setTimeout(() => memeScream.classList.remove('show'), 1800);
}

btnNo.addEventListener('mouseover', runNoButton);

btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  runNoButton();
}, { passive: false });

btnYes.addEventListener('click', () => {
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
  showPage('page-celebrate');
  startCelebration();
});

// ============================================================
// PAGE 4: CELEBRATION
// ============================================================
const CONFETTI_COLORS = ['#ff6b8a', '#ff9ec4', '#ffd700', '#ff6347', '#9c27b0', '#2196f3', '#4caf50', '#ff5722'];

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.width = (6 + Math.random() * 10) + 'px';
    el.style.height = (6 + Math.random() * 10) + 'px';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    const dur = 2 + Math.random() * 3;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = Math.random() * 1.5 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + 1.5) * 1000);
  }
}

function startCelebration() {
  launchConfetti();
  setTimeout(launchConfetti, 1500);

  const video = document.getElementById('celebrate-video');
  const soundBtn = document.getElementById('video-sound-btn');
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      soundBtn.textContent = video.muted ? '🔇' : '🔊';
    });
  }

  const dateBox = document.getElementById('start-date');
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  dateBox.textContent = '💕 ' + now.toLocaleDateString('th-TH', opts);
}

document.getElementById('btn-restart').addEventListener('click', () => {
  noCount = 0;
  btnNo.style.position = '';
  btnNo.style.left = '';
  btnNo.style.top = '';
  hintEl.textContent = '';
  memeScream.classList.remove('show');
  document.getElementById('confetti-container').innerHTML = '';
  const envelope = document.getElementById('letter-envelope');
  const sheet = document.getElementById('letter-sheet');
  envelope.style.display = '';
  envelope.classList.remove('opening');
  sheet.style.display = 'none';
  showPage('page-intro');
  startTypewriter('intro-text', CONFIG.introText);
});

// ============================================================
// PAGE 5: GALLERY CALENDAR
// ============================================================
const G = CONFIG.gallery;
const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

// map ความทรงจำ: 'YYYY-MM-DD' -> memory
const memoryMap = {};
G.memories.forEach(m => { memoryMap[m.date] = m; });

let calYear = G.startYear;
let calMonth = G.startMonth - 1; // 0-indexed

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  const label = document.getElementById('cal-month');
  label.textContent = THAI_MONTHS[calMonth] + ' ' + (calYear + 543);

  grid.innerHTML = '';
  const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=อา
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-cell cal-blank';
    grid.appendChild(blank);
  }

  const todayKey = new Date().getFullYear() + '-' + pad2(new Date().getMonth() + 1) + '-' + pad2(new Date().getDate());

  for (let d = 1; d <= daysInMonth; d++) {
    const key = calYear + '-' + pad2(calMonth + 1) + '-' + pad2(d);
    const cell = document.createElement('div');
    cell.className = 'cal-cell';
    if (key === todayKey) cell.classList.add('cal-today');

    const num = document.createElement('span');
    num.className = 'cal-num';
    num.textContent = d;
    cell.appendChild(num);

    const mem = memoryMap[key];
    if (mem) {
      cell.classList.add('cal-has');
      const thumb = document.createElement('img');
      thumb.className = 'cal-thumb';
      thumb.src = mem.photos[0];
      thumb.alt = mem.caption || '';
      thumb.loading = 'lazy';
      cell.appendChild(thumb);
      const dot = document.createElement('span');
      dot.className = 'cal-dot';
      dot.textContent = '💕';
      cell.appendChild(dot);
      cell.addEventListener('click', () => openLightbox(mem));
    }
    grid.appendChild(cell);
  }
}

document.getElementById('cal-prev').addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});

document.getElementById('btn-gallery-back').addEventListener('click', () => {
  showPage('page-celebrate');
});

// ---------- PIN gate (soft lock) ----------
const pinOverlay = document.getElementById('pin-overlay');
const pinInput   = document.getElementById('pin-input');
const pinError   = document.getElementById('pin-error');

function galleryUnlocked() {
  return !G.pin || sessionStorage.getItem('gallery_unlocked') === '1';
}

function enterGallery() {
  renderCalendar();
  showPage('page-gallery');
}

function openPinGate() {
  pinInput.value = '';
  pinError.textContent = '';
  pinOverlay.classList.add('show');
  setTimeout(() => pinInput.focus(), 200);
}

function closePinGate() {
  pinOverlay.classList.remove('show');
}

function submitPin() {
  if (pinInput.value === G.pin) {
    sessionStorage.setItem('gallery_unlocked', '1');
    closePinGate();
    enterGallery();
  } else {
    pinError.textContent = 'รหัสไม่ถูกนะ ลองใหม่ 🥺';
    pinInput.value = '';
    pinInput.focus();
  }
}

document.getElementById('btn-open-gallery').addEventListener('click', () => {
  if (galleryUnlocked()) enterGallery();
  else openPinGate();
});
document.getElementById('pin-ok').addEventListener('click', submitPin);
document.getElementById('pin-cancel').addEventListener('click', closePinGate);
pinInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitPin(); });
pinOverlay.addEventListener('click', (e) => { if (e.target === pinOverlay) closePinGate(); });

// ---------- Lightbox ----------
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbDate    = document.getElementById('lb-date');
const lbDots    = document.getElementById('lb-dots');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');
let lbPhotos = [];
let lbIndex = 0;

function formatThaiDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return d + ' ' + THAI_MONTHS[m - 1] + ' ' + (y + 543);
}

function showLbPhoto(i) {
  lbIndex = (i + lbPhotos.length) % lbPhotos.length;
  lbImg.src = lbPhotos[lbIndex];
  lbDots.querySelectorAll('.lb-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === lbIndex);
  });
}

function openLightbox(mem) {
  lbPhotos = mem.photos;
  lbIndex = 0;
  lbCaption.textContent = mem.caption || '';
  lbDate.textContent = '💕 ' + formatThaiDate(mem.date);

  lbDots.innerHTML = '';
  const many = lbPhotos.length > 1;
  lbPrev.style.display = many ? '' : 'none';
  lbNext.style.display = many ? '' : 'none';
  if (many) {
    lbPhotos.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.className = 'lb-dot';
      lbDots.appendChild(dot);
    });
  }
  showLbPhoto(0);
  lightbox.classList.add('show');
}

function closeLightbox() { lightbox.classList.remove('show'); }

document.getElementById('lb-close').addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => showLbPhoto(lbIndex - 1));
lbNext.addEventListener('click', () => showLbPhoto(lbIndex + 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLbPhoto(lbIndex - 1);
  if (e.key === 'ArrowRight') showLbPhoto(lbIndex + 1);
});
