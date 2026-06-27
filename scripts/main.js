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
    'ปาล์มรอนะ!! 😱',
  ],
};

// ============================================================
// YOUTUBE MUSIC
// ============================================================
let musicPlaying = false;
const ytPlayer = document.getElementById('yt-player');
const musicBtn = document.getElementById('music-toggle');

function playMusic() {
  ytPlayer.src = ytPlayer.src.replace('autoplay=0', 'autoplay=1');
  musicPlaying = true;
  musicBtn.textContent = '🔇';
}

musicBtn.addEventListener('click', () => {
  if (!musicPlaying) {
    playMusic();
  } else {
    // mute/unmute via src swap trick
    const muted = ytPlayer.src.includes('mute=1');
    if (muted) {
      ytPlayer.src = ytPlayer.src.replace('mute=1', 'mute=0');
      musicBtn.textContent = '🔇';
    } else {
      ytPlayer.src = ytPlayer.src.replace('mute=0', 'mute=1');
      musicBtn.textContent = '🎵';
    }
  }
});

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
  playMusic();
  showPage('page-reasons');
  setupLetter();
});

startTypewriter('intro-text', CONFIG.introText);

// ============================================================
// PAGE 2: LOVE LETTER
// ============================================================
const LETTER_LINES = [
  'pluem ที่รัก,',
  '',
  'หนูเคยบอกว่ายังไม่เป็นแฟน',
  'ไม่ขอเป็นแฟนสักที...',
  '',
  'พี่มีไรจะบอก',
  '',
  'พี่รักหนูนะ',
  'รักจริงๆ ไม่ได้แกล้งทำ',
  '',
  'และวันนี้พี่อยากถามหนูสักเรื่อง 🌹',
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
