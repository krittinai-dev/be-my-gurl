'use client';

import { useEffect } from 'react';

const HEART_EMOJIS = ['❤️', '🧡', '💛', '💚', '💙', '💜', '🩷', '🩶', '🤍', '💕', '💗', '💓'];

// หัวใจปลิวพื้นหลัง (เหมือนเว็บเดิม)
export default function Hearts() {
  useEffect(() => {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    function spawnHeart() {
      const el = document.createElement('span');
      el.className = 'floating-heart';
      el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = 1 + Math.random() * 1.5 + 'rem';
      const dur = 5 + Math.random() * 8;
      el.style.animationDuration = dur + 's';
      el.style.opacity = (0.4 + Math.random() * 0.5).toString();
      container!.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000);
    }

    const interval = setInterval(spawnHeart, 600);
    for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 200);
    return () => clearInterval(interval);
  }, []);

  return <div id="hearts-container" />;
}
