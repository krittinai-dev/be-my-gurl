'use strict';

// ============================================================
// CONFIG — แก้ได้เลยครับ
// ============================================================
const CONFIG = {
  introText: 'ถึง ปลื้ม ที่ผมแอบชอบ...',
  reasons: [
    { icon: '😊', text: 'รอยยิ้มของปลื้มทำให้วันของผมดีขึ้นทุกวัน' },
    { icon: '💫', text: 'ปลื้มน่ารักทั้งข้างนอกและข้างใน' },
    { icon: '🤣', text: 'อยู่ด้วยกันแล้วสนุกและหัวเราะตลอด' },
    { icon: '🤝', text: 'ปลื้มเป็นคนที่ไว้วางใจได้เสมอ' },
    { icon: '✨', text: 'ปลื้มทำให้ผมอยากเป็นคนที่ดีขึ้น' },
    { icon: '❤️', text: 'ผมชอบปลื้มในแบบที่ปลื้มเป็น' },
  ],
  noEscapeMessages: [
    'อย่ากด! 🥺',
    'ไม่ได้นะ!! 😭',
    'วิ่งไม่ทันหรอก 😤',
    'กดใช่เถอะนะ~ 🙏',
    'ปลื้มโหดมาก!! 😱',
  ],
};

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
  setupReasons();
});

startTypewriter('intro-text', CONFIG.introText);

// ============================================================
// PAGE 2: REASONS
// ============================================================
function setupReasons() {
  const list = document.getElementById('reasons-list');
  list.innerHTML = '';
  CONFIG.reasons.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="reason-icon">${r.icon}</span><span>${r.text}</span>`;
    list.appendChild(li);
  });
  // Stagger animation
  const items = list.querySelectorAll('li');
  items.forEach((item, i) => {
    setTimeout(() => item.classList.add('visible'), i * 200 + 100);
  });
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

  // Make button run away
  const maxX = window.innerWidth - 160;
  const maxY = window.innerHeight - 80;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  btnNo.style.position = 'fixed';
  btnNo.style.left = randomX + 'px';
  btnNo.style.top = randomY + 'px';
  btnNo.style.transition = 'left 0.25s ease, top 0.25s ease';
  btnNo.style.zIndex = '999';

  // Show scream meme
  memeScream.classList.add('show');
  if (screamTimeout) clearTimeout(screamTimeout);
  screamTimeout = setTimeout(() => memeScream.classList.remove('show'), 1800);
}

btnNo.addEventListener('mouseover', runNoButton);

// Touch support — move button on touchstart
btnNo.addEventListener('touchstart', (e) => {
  e.preventDefault();
  noCount++;
  const msg = CONFIG.noEscapeMessages[Math.min(noCount - 1, CONFIG.noEscapeMessages.length - 1)];
  hintEl.textContent = msg;

  const maxX = window.innerWidth - 120;
  const maxY = window.innerHeight - 80;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * Math.max(maxY, 100));

  btnNo.style.position = 'fixed';
  btnNo.style.left = randomX + 'px';
  btnNo.style.top = randomY + 'px';
  btnNo.style.transition = 'left 0.25s ease, top 0.25s ease';
  btnNo.style.zIndex = '999';

  // Show scream meme
  memeScream.classList.add('show');
  if (screamTimeout) clearTimeout(screamTimeout);
  screamTimeout = setTimeout(() => memeScream.classList.remove('show'), 1800);
}, { passive: false });

btnYes.addEventListener('click', () => {
  // Reset no button position
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
  showPage('page-intro');
  startTypewriter('intro-text', CONFIG.introText);
});
