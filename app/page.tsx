'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const INTRO_TEXT = 'ถึง pluem 💕';

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

const NO_MESSAGES = [
  'อย่ากดเลยนะ 🥺',
  'ยังไม่พร้อมก็ได้ แต่ลองดูก่อนได้ไหม 😭',
  'กดได้เลย กดซ้ายได้เลย 😤',
  'pluem~ กด "ได้เลย" เถอะนะ 🙏',
  'พี่รออยู่นะ!! 😱',
];

const CONFETTI_COLORS = ['#ff6b8a', '#ff9ec4', '#ffd700', '#ff6347', '#9c27b0', '#2196f3', '#4caf50', '#ff5722'];

type Page = 'intro' | 'letter' | 'question' | 'celebrate';

export default function Home() {
  const router = useRouter();
  const [page, setPage] = useState<Page>('intro');

  return (
    <>
      {page === 'intro' && <Intro onNext={() => setPage('letter')} onAlbum={() => router.push('/album')} />}
      {page === 'letter' && <Letter onNext={() => setPage('question')} />}
      {page === 'question' && <Question onYes={() => setPage('celebrate')} />}
      {page === 'celebrate' && <Celebrate onAlbum={() => router.push('/album')} onRestart={() => setPage('intro')} />}
    </>
  );
}

// ── PAGE 1: INTRO ────────────────────────────────────────
function Intro({ onNext, onAlbum }: { onNext: () => void; onAlbum: () => void }) {
  const [typed, setTyped] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(INTRO_TEXT.slice(0, i));
      if (i >= INTRO_TEXT.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="page active" id="page-intro">
      <div className="intro-wrap">
        <div className="site-badge">💌 from Palm</div>
        <h1 className="site-title">be my<br /><span>gurl</span></h1>
        <div className="card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/roses-guy.jpeg" alt="ผมมีดอกไม้ให้" className="meme-roses" />
          <p className="intro-label">จาก Palm ถึง</p>
          <h1 className={done ? '' : 'typewriter'} id="intro-text">{typed}</h1>
          <p className="intro-sub">พี่มีเรื่องอยากบอก...</p>
          <button className="btn-primary" onClick={onNext}>ต่อไป</button>
          <button className="btn-gallery btn-gallery-intro" onClick={onAlbum}>📸 อัลบั้มเที่ยวด้วยกัน</button>
        </div>
      </div>
    </section>
  );
}

// ── PAGE 2: LETTER ───────────────────────────────────────
function Letter({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [shown, setShown] = useState<number>(-1);

  function openLetter() {
    if (opening || opened) return;
    setOpening(true);
    setTimeout(() => {
      setOpened(true);
      LETTER_LINES.forEach((_, i) => {
        setTimeout(() => setShown((s) => Math.max(s, i)), i * 220 + 100);
      });
    }, 700);
  }

  return (
    <section className={`page active page-letter${opened ? ' scroll-top' : ''}`} id="page-reasons">
      {!opened && (
        <div className="letter-center-wrap">
          <div className={`letter-envelope${opening ? ' opening' : ''}`} onClick={openLetter}>
            <div className="envelope-flap" />
            <div className="envelope-body">
              <div className="envelope-heart">💌</div>
            </div>
          </div>
          {!opening && <p className="open-hint">👆 แตะเพื่อเปิดจดหมาย</p>}
        </div>
      )}

      {opened && (
        <div className="letter-sheet" style={{ display: 'block' }}>
          <div className="letter-inner">
            <div className="letter-corner-deco">🌸✨🌸</div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/shy-boy.jpeg" alt="อายจัง" className="meme-letter" />
            <div className="letter-lines">
              {LETTER_LINES.map((line, i) => (
                <span key={i} className={`letter-line${i <= shown ? ' show' : ''}`}>{line || ' '}</span>
              ))}
            </div>
            <div className="letter-sig">รัก,<br /><span className="sig-name">ปาล์มสุดหล่อ 💕</span></div>
            <div className="wax-seal">💌</div>
            <button className="btn-primary" onClick={onNext}>ต่อไป</button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── PAGE 3: QUESTION ─────────────────────────────────────
function Question({ onYes }: { onYes: () => void }) {
  const [noCount, setNoCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [scream, setScream] = useState(false);
  const [noStyle, setNoStyle] = useState<React.CSSProperties>({});
  const screamTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function runNo() {
    const n = noCount + 1;
    setNoCount(n);
    setMsg(NO_MESSAGES[Math.min(n - 1, NO_MESSAGES.length - 1)]);
    const maxX = window.innerWidth - 160;
    const maxY = window.innerHeight - 80;
    setNoStyle({
      position: 'fixed',
      left: Math.floor(Math.random() * maxX) + 'px',
      top: Math.floor(Math.random() * maxY) + 'px',
      transition: 'left 0.25s ease, top 0.25s ease',
      zIndex: 999,
    });
    setScream(true);
    if (screamTimeout.current) clearTimeout(screamTimeout.current);
    screamTimeout.current = setTimeout(() => setScream(false), 1800);
  }

  return (
    <section className="page active" id="page-question">
      <div className="card question-card">
        <h1 className="question-text">เป็นแฟนกันไหม<br />pluem? 💕</h1>
        <div className="btn-group">
          <button className="btn-yes" onClick={onYes}>ตกลง 💕</button>
          <button
            className="btn-no"
            style={noStyle}
            onMouseOver={runNo}
            onTouchStart={(e) => { e.preventDefault(); runNo(); }}
          >
            ไม่
          </button>
          <p className="hint">{msg}</p>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/scream-guy.jpeg" alt="กรีดร้อง" className={`meme-scream${scream ? ' show' : ''}`} />
    </section>
  );
}

// ── PAGE 4: CELEBRATE ────────────────────────────────────
function Celebrate({ onAlbum, onRestart }: { onAlbum: () => void; onRestart: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const container = document.getElementById('confetti-container');
    function launch() {
      if (!container) return;
      for (let i = 0; i < 120; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        el.style.width = 6 + Math.random() * 10 + 'px';
        el.style.height = 6 + Math.random() * 10 + 'px';
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        const dur = 2 + Math.random() * 3;
        el.style.animationDuration = dur + 's';
        el.style.animationDelay = Math.random() * 1.5 + 's';
        container.appendChild(el);
        setTimeout(() => el.remove(), (dur + 1.5) * 1000);
      }
    }
    launch();
    const t = setTimeout(launch, 1500);

    videoRef.current?.play().catch(() => {});
    const now = new Date();
    setDateStr('💕 ' + now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }));
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="page active" id="page-celebrate">
      <div id="confetti-container" />
      <div className="card celebrate-card">
        <div className="celebrate-video-wrap">
          <video ref={videoRef} src="/assets/video.mp4" autoPlay muted={muted} loop playsInline className="celebrate-video" />
          <button
            className="video-sound-btn"
            onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
        <h1 className="celebrate-title">เป็นแฟนกัน<br />แล้วนะ</h1>
        <div className="date-box">{dateStr}</div>
        <button className="btn-gallery" onClick={onAlbum}>📸 อัลบั้มเที่ยวด้วยกัน</button>
        <button className="btn-primary" onClick={onRestart}>เริ่มใหม่</button>
      </div>
    </section>
  );
}
