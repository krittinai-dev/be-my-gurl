'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <section className="page active">
      <div className="login-wrap">
        <div className="login-emoji">🔒💕</div>
        <h1 className="login-title">ใส่รหัสของเรา</h1>
        <p className="login-sub">อัลบั้มนี้ดูกันแค่เราสองคนนะ</p>
        <form className="login-form" action={formAction}>
          <input
            className="pin-input"
            type="password"
            name="password"
            inputMode="text"
            placeholder="• • • •"
            autoComplete="current-password"
            autoFocus
          />
          <p className="pin-error">{error || ' '}</p>
          <button className="btn-yes" type="submit" disabled={pending}>
            {pending ? <><span className="spinner" />กำลังเข้า...</> : 'เปิดเลย 💕'}
          </button>
        </form>
        <a className="login-intro-link" href="/">💌 กลับหน้าจดหมายรัก</a>
      </div>
    </section>
  );
}
