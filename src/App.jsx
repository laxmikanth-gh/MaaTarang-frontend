import { useEffect, useState, useCallback } from "react";
import logo from "./assets/logo.png";

const API_URL = "https://maatarang-backend.onrender.com";

/* ═══════════════════════════════════════════════════════════════
   CSS  — all styles including every 3D / animation effect
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold:        #B8942A;
    --gold-lt:     #E8D48A;
    --gold-dk:     #7A5F10;
    --gold-shine:  #F5E6A3;
    --cream:       #FAF7F2;
    --cream-dk:    #F2EDE3;
    --ink:         #1A1410;
    --ink-md:      #3D2F20;
    --ink-lt:      #6B5744;
    --teal:        #0F6E56;
    --teal-lt:     #E1F5EE;
    --teal-dk:     #0A4D3C;
    --white:       #FFFFFF;
    --shadow-sm:   0 2px 16px rgba(26,20,16,0.06);
    --shadow:      0 4px 40px rgba(26,20,16,0.10);
    --shadow-lg:   0 12px 60px rgba(26,20,16,0.16);
    --shadow-gold: 0 4px 24px rgba(184,148,42,0.25);
    --ff-display:  'DM Serif Display', Georgia, serif;
    --ff-serif:    'Playfair Display', Georgia, serif;
    --ff-sans:     'DM Sans', sans-serif;
    --radius-sm:   3px;
    --radius:      6px;
    --radius-lg:   14px;
    --radius-xl:   24px;
    --transition:  all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--ff-sans);
    background: var(--cream);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Subtle grain overlay */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.4;
  }

  /* ══════════════════════
     LOADER
  ══════════════════════ */
  .loader {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: var(--cream); position: relative; overflow: hidden;
  }
  .loader::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,148,42,0.08), transparent);
  }
  .loader__logo-wrap {
    position: relative; display: flex; align-items: center; justify-content: center;
    margin-bottom: 2.5rem;
  }
  .loader__logo {
    width: 220px; object-fit: contain;
    animation: loaderFloat 3s ease-in-out infinite;
    position: relative; z-index: 2;
  }
  .loader__ring {
    position: absolute;
    width: 260px; height: 260px;
    border-radius: 50%;
    border: 1.5px solid transparent;
    border-top-color: var(--gold);
    border-right-color: rgba(184,148,42,0.3);
    animation: spinRing 1.4s linear infinite;
  }
  .loader__ring-2 {
    position: absolute;
    width: 290px; height: 290px;
    border-radius: 50%;
    border: 1px solid transparent;
    border-bottom-color: var(--gold-lt);
    border-left-color: rgba(184,148,42,0.2);
    animation: spinRing 2.2s linear infinite reverse;
  }
  .loader__sub {
    font-size: 0.68rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: var(--ink-lt); margin-bottom: 2rem;
    animation: fadeInUp 0.8s 0.15s ease both;
  }
  .loader__dots {
    display: flex; gap: 8px; align-items: center;
  }
  .loader__dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    animation: dotPulse 1.4s ease-in-out infinite;
  }
  .loader__dot:nth-child(2) { animation-delay: 0.2s; background: var(--gold-lt); }
  .loader__dot:nth-child(3) { animation-delay: 0.4s; background: var(--gold-dk); }

  @keyframes loaderFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spinRing    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dotPulse    { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.5);opacity:1} }
  @keyframes fadeInUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

  /* ══════════════════════
     NAVBAR
  ══════════════════════ */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(250,247,242,0.88);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid rgba(184,148,42,0.15);
    padding: 0 5%;
    display: flex; align-items: center; justify-content: space-between;
    height: 80px; transition: height 0.4s ease, box-shadow 0.4s ease;
  }
  .nav.scrolled { box-shadow: 0 4px 32px rgba(26,20,16,0.1); height: 66px; }

  .nav__brand { display: flex; align-items: center; gap: 0.9rem; text-decoration: none; }

  /* 3D — Logo rotates on hover */
  .nav__logo {
    width: 140px; height: 56px; object-fit: contain;
    transition: transform 0.5s cubic-bezier(0.34,1.4,0.64,1);
    transform-style: preserve-3d;
  }
  .nav__brand:hover .nav__logo { transform: perspective(300px) rotateY(28deg) scale(1.04); }

  .nav__name {
    font-family: var(--ff-display); font-size: 1.65rem; font-weight: 400;
    letter-spacing: 0.06em; color: var(--ink); line-height: 1.1;
  }
  .nav__tagline { font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--gold-dk); margin-top: 1px; font-weight: 500; }
  .nav__links { display: flex; align-items: center; gap: 2.5rem; list-style: none; }
  .nav__link {
    font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--ink-md); text-decoration: none;
    position: relative; padding-bottom: 3px; font-weight: 500; transition: color 0.25s;
  }
  .nav__link::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 1.5px; background: var(--gold);
    transition: width 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .nav__link:hover { color: var(--gold-dk); }
  .nav__link:hover::after { width: 100%; }
  .nav__btn {
    font-family: var(--ff-sans); font-size: 0.68rem; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--ink); background: transparent;
    border: 1.5px solid rgba(184,148,42,0.5); padding: 8px 20px;
    cursor: pointer; border-radius: var(--radius); transition: var(--transition);
    font-weight: 500; position: relative; overflow: hidden;
  }
  .nav__btn::before {
    content: ''; position: absolute; inset: 0; background: var(--gold);
    transform: translateX(-100%); transition: transform 0.3s ease; z-index: -1;
  }
  .nav__btn:hover { color: var(--white); border-color: var(--gold); }
  .nav__btn:hover::before { transform: translateX(0); }

  /* hamburger */
  .nav__hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px; background: none; border: none; }
  .nav__hamburger span { display: block; width: 22px; height: 1.5px; background: var(--ink-md); border-radius: 2px; transition: var(--transition); }
  .nav__hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
  .nav__hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .nav__hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

  .nav__mobile {
    position: fixed; inset: 80px 0 0 0;
    background: rgba(250,247,242,0.97); backdrop-filter: blur(16px);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 2.5rem; z-index: 99; list-style: none;
    transform: translateY(-100%); opacity: 0;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1); pointer-events: none;
  }
  .nav__mobile.open { transform: translateY(0); opacity: 1; pointer-events: all; }
  .nav__mobile .nav__link { font-size: 1rem; letter-spacing: 0.2em; }

  /* ══════════════════════
     MODAL
  ══════════════════════ */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(26,20,16,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(6px); animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--white); width: 90%; max-width: 400px;
    border-radius: var(--radius-lg); padding: 2.75rem;
    box-shadow: var(--shadow-lg); animation: modalUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    border: 1px solid rgba(184,148,42,0.12);
  }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes modalUp { from{transform:translateY(24px) scale(0.96);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
  .modal__icon { width:52px;height:52px;border-radius:50%;background:rgba(184,148,42,0.1);border:1px solid rgba(184,148,42,0.2);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;font-size:1.4rem; }
  .modal__title { font-family:var(--ff-serif);font-size:1.8rem;font-weight:500;color:var(--ink);margin-bottom:0.4rem; }
  .modal__sub { font-size:0.8rem;color:var(--ink-lt);letter-spacing:0.05em;margin-bottom:2rem; }
  .modal__divider { width:36px;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--gold-lt));margin-bottom:1.75rem;border-radius:2px; }

  /* ══════════════════════
     INPUTS
  ══════════════════════ */
  .field-wrap { position:relative;margin-bottom:0.85rem; }
  .field-label { display:block;font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-dk);font-weight:600;margin-bottom:6px; }
  .field {
    width:100%;font-family:var(--ff-sans);font-size:0.88rem;color:var(--ink);
    background:var(--cream);border:1.5px solid rgba(184,148,42,0.2);border-radius:var(--radius);
    padding:12px 16px;outline:none;transition:border-color 0.25s,box-shadow 0.25s,background 0.25s;
  }
  .field:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,148,42,0.1);background:var(--white); }
  .field::placeholder { color:rgba(107,87,68,0.5); }
  .field[type="file"] { padding:10px 16px;cursor:pointer; }

  /* ══════════════════════
     BUTTONS
  ══════════════════════ */
  .btn-primary {
    width:100%;font-family:var(--ff-sans);font-size:0.72rem;letter-spacing:0.2em;
    text-transform:uppercase;color:var(--white);border:none;padding:14px 24px;
    border-radius:var(--radius);cursor:pointer;font-weight:600;
    position:relative;overflow:hidden;
    background:linear-gradient(135deg,var(--gold-dk) 0%,var(--gold) 50%,var(--gold-dk) 100%);
    background-size:200% 100%;
    transition:background-position 0.4s ease,transform 0.2s,box-shadow 0.2s;
    box-shadow:0 2px 16px rgba(184,148,42,0.3);
  }
  .btn-primary:hover { background-position:100% 0;transform:translateY(-1px);box-shadow:0 6px 24px rgba(184,148,42,0.4); }
  .btn-primary:active { transform:translateY(0); }

  .btn-ghost {
    width:100%;font-family:var(--ff-sans);font-size:0.72rem;letter-spacing:0.14em;
    text-transform:uppercase;color:var(--ink-lt);background:transparent;border:none;
    padding:11px;cursor:pointer;margin-top:0.5rem;transition:color 0.2s;
    font-weight:500;border-radius:var(--radius);
  }
  .btn-ghost:hover { color:var(--ink);background:rgba(26,20,16,0.04); }

  /* WhatsApp button */
  .btn-wa {
    display:flex;align-items:center;justify-content:center;gap:8px;
    width:100%;font-family:var(--ff-sans);font-size:0.72rem;letter-spacing:0.18em;
    text-transform:uppercase;color:var(--white);border:none;padding:13px;
    border-radius:var(--radius);cursor:pointer;font-weight:600;
    text-decoration:none;text-align:center;
    background:linear-gradient(135deg,#1FAD54,#25D366 50%,#1FAD54);
    background-size:200% 100%;
    transition:background-position 0.4s ease,transform 0.2s,box-shadow 0.2s;
    box-shadow:0 2px 14px rgba(37,211,102,0.3);
  }
  .btn-wa:hover { background-position:100% 0;transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,211,102,0.4); }
  .btn-wa:active { transform:translateY(0); }

  .btn-outline {
    display:inline-flex;align-items:center;gap:8px;
    font-family:var(--ff-sans);font-size:0.72rem;letter-spacing:0.2em;
    text-transform:uppercase;color:var(--gold-dk);background:transparent;
    border:1.5px solid var(--gold);padding:13px 32px;
    border-radius:var(--radius);cursor:pointer;font-weight:600;
    transition:var(--transition);text-decoration:none;
  }
  .btn-outline:hover { background:var(--gold);color:var(--white); }

  .btn-delete {
    font-family:var(--ff-sans);font-size:0.65rem;letter-spacing:0.14em;
    text-transform:uppercase;color:#B83232;
    background:rgba(184,50,50,0.05);border:1.5px solid rgba(184,50,50,0.25);
    padding:8px 16px;border-radius:var(--radius);cursor:pointer;
    margin-top:0.6rem;width:100%;transition:var(--transition);font-weight:500;
  }
  .btn-delete:hover { background:#B83232;color:var(--white);border-color:#B83232; }

  /* ══════════════════════
     ADMIN
  ══════════════════════ */
  .admin {
    max-width:640px;margin:2.5rem auto;background:var(--white);
    border:1px solid rgba(184,148,42,0.18);border-radius:var(--radius-lg);
    padding:2.5rem;box-shadow:var(--shadow);animation:fadeInUp 0.4s ease;
  }
  .admin__header { display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem; }
  .admin__icon { width:48px;height:48px;border-radius:50%;background:rgba(184,148,42,0.1);border:1px solid rgba(184,148,42,0.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0; }
  .admin__title { font-family:var(--ff-serif);font-size:1.75rem;font-weight:500;color:var(--ink);margin-bottom:0.15rem; }
  .admin__sub { font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-dk);font-weight:500; }
  .admin__divider { width:100%;height:1px;background:linear-gradient(90deg,rgba(184,148,42,0.3),transparent);margin-bottom:2rem; }
  .admin__grid { display:grid;gap:0; }
  .admin__row { display:grid;grid-template-columns:1fr 1fr;gap:0.8rem; }

  /* ══════════════════════
     HERO — 3D effects
  ══════════════════════ */
  .hero {
    position:relative;text-align:center;
    padding:8rem 5% 7rem;overflow:hidden;
    background: var(--cream);
  }

  /* Canvas for animated silk threads */
  .hero__canvas {
    position:absolute;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:0;opacity:0.55;
  }

  /* Layered decorative background */
  .hero__bg {
    position:absolute;inset:0;pointer-events:none;will-change:transform;
    background:
      radial-gradient(ellipse 65% 55% at 50% 40%, rgba(184,148,42,0.12), transparent 65%),
      radial-gradient(ellipse 40% 40% at 15% 85%, rgba(15,110,86,0.07), transparent),
      radial-gradient(ellipse 30% 30% at 85% 15%, rgba(184,148,42,0.06), transparent);
    transition:transform 0.05s linear;
  }

  /* Floating embroidery-motif decorations */
  .hero__motif {
    position:absolute;pointer-events:none;opacity:0.07;
    animation:motifDrift 18s ease-in-out infinite;
  }
  .hero__motif:nth-child(3) { width:320px;height:320px;top:-60px;right:-60px;animation-delay:-3s;animation-duration:22s; }
  .hero__motif:nth-child(4) { width:220px;height:220px;bottom:-40px;left:-30px;animation-delay:-9s;animation-duration:16s; }
  .hero__motif:nth-child(5) { width:160px;height:160px;top:30%;right:8%;animation-delay:-6s;animation-duration:20s;opacity:0.05; }
  @keyframes motifDrift {
    0%,100% { transform:translate(0,0) rotate(0deg) scale(1); }
    33%      { transform:translate(8px,-12px) rotate(8deg) scale(1.04); }
    66%      { transform:translate(-6px,8px) rotate(-5deg) scale(0.97); }
  }

  /* Floating gold dust particles */
  .hero__particle {
    position:absolute;border-radius:50%;pointer-events:none;
    background:radial-gradient(circle, rgba(184,148,42,0.6) 0%, transparent 70%);
    animation:particleFloat linear infinite;
  }
  @keyframes particleFloat {
    0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:0.6; }
    100% { transform:translateY(-120px) translateX(30px) scale(0.4); opacity:0; }
  }

  /* Diagonal shimmer sweep across hero */
  .hero::before {
    content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(184,148,42,0.04) 45%,
      rgba(245,230,163,0.06) 50%,
      rgba(184,148,42,0.04) 55%,
      transparent 70%
    );
    background-size:300% 100%;
    animation:heroSweep 6s ease-in-out infinite;
  }
  @keyframes heroSweep {
    0%   { background-position:200% 0; }
    100% { background-position:-100% 0; }
  }

  /* Subtle geometric grid overlay */
  .hero::after {
    content:'';position:absolute;inset:0;pointer-events:none;z-index:0;
    background-image:
      linear-gradient(rgba(184,148,42,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(184,148,42,0.04) 1px, transparent 1px);
    background-size:60px 60px;
    mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%);
    -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%);
  }

  .hero__eyebrow {
    font-size:0.65rem;letter-spacing:0.38em;text-transform:uppercase;
    color:var(--gold-dk);margin-bottom:1.5rem;font-weight:600;
    display:inline-flex;align-items:center;gap:10px;
    animation:fadeInUp 0.7s 0.1s ease both;
    position:relative;z-index:1;
  }
  .hero__eyebrow::before,.hero__eyebrow::after { content:'';display:block;width:28px;height:1px;background:var(--gold); }

  /* 3D — floating hero title */
  .hero__title {
    font-family:var(--ff-display);font-size:clamp(3rem,7vw,6rem);
    font-weight:400;line-height:1.05;color:var(--ink);
    margin-bottom:1.5rem;letter-spacing:0.01em;
    animation:fadeInUp 0.7s 0.2s ease both, heroFloat 6s 1s ease-in-out infinite;
    position:relative;z-index:1;
  }
  @keyframes heroFloat {
    0%,100%{transform:translateY(0)}
    50%{transform:translateY(-8px)}
  }

  /* 3D — shimmer gradient on italic word */
  .hero__title em {
    font-style:italic;
    background:linear-gradient(120deg, var(--gold-dk) 0%, var(--gold) 30%, var(--gold-shine) 50%, var(--gold) 70%, var(--gold-dk) 100%);
    background-size:300% 100%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
    animation:goldShimmer 4s ease-in-out infinite;
  }
  @keyframes goldShimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

  .hero__desc {
    font-size:1rem;line-height:1.95;color:var(--ink-lt);
    max-width:500px;margin:0 auto 2.5rem;letter-spacing:0.02em;
    animation:fadeInUp 0.7s 0.3s ease both;position:relative;z-index:1;
  }
  .hero__pills {
    display:flex;align-items:center;justify-content:center;
    gap:0.6rem;flex-wrap:wrap;margin-bottom:3rem;
    animation:fadeInUp 0.7s 0.4s ease both;position:relative;z-index:1;
  }
  /* 3D — pill tilts on mouse move (applied via JS) */
  .hero__pill {
    font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;
    color:var(--ink-lt);padding:6px 14px;
    border:1px solid rgba(184,148,42,0.25);border-radius:100px;
    display:inline-flex;align-items:center;gap:6px;
    background:rgba(250,247,242,0.8);
    transition:border-color 0.3s,color 0.3s,background 0.3s,transform 0.15s ease;
    cursor:default;transform-style:preserve-3d;will-change:transform;
  }
  .hero__pill:hover { border-color:var(--gold);color:var(--gold-dk);background:var(--white); }
  .hero__pill-dot { width:5px;height:5px;border-radius:50%;background:var(--gold); }

  .hero__cta {
    display:flex;align-items:center;justify-content:center;
    gap:1rem;flex-wrap:wrap;
    animation:fadeInUp 0.7s 0.5s ease both;position:relative;z-index:1;
  }

  /* ══════════════════════
     STATS BAR
  ══════════════════════ */
  .stats {
    display:flex;align-items:stretch;justify-content:center;
    background:var(--ink);padding:2.5rem 5%;
  }
  .stats__item { flex:1;text-align:center;padding:1rem 2rem;border-right:1px solid rgba(250,247,242,0.08); }
  .stats__item:last-child { border-right:none; }

  /* 3D — number depth shadow + count-up via JS */
  .stats__num {
    font-family:var(--ff-display);font-size:2.4rem;color:var(--gold-lt);
    letter-spacing:0.02em;display:block;line-height:1;
    text-shadow:2px 2px 0 rgba(122,95,16,0.6),4px 4px 0 rgba(184,148,42,0.2);
    transition:transform 0.3s ease;
  }
  .stats__item:hover .stats__num { transform:scale(1.08) translateY(-2px); }
  .stats__label { font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(250,247,242,0.4);margin-top:0.4rem;display:block;font-weight:500; }

  /* ══════════════════════
     SECTION HEADER
  ══════════════════════ */
  .section-head { text-align:center;margin-bottom:3.5rem; }
  .section-head__eyebrow {
    font-size:0.65rem;letter-spacing:0.32em;text-transform:uppercase;
    color:var(--gold-dk);margin-bottom:0.85rem;font-weight:600;
    display:inline-flex;align-items:center;gap:8px;
  }
  .section-head__eyebrow::before,.section-head__eyebrow::after { content:'';display:block;width:20px;height:1px;background:var(--gold); }
  .section-head__title { font-family:var(--ff-display);font-size:clamp(2.2rem,4vw,3.2rem);font-weight:400;color:var(--ink);letter-spacing:0.01em; }
  .section-head__line { width:48px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1rem auto 0;border-radius:2px; }

  /* ══════════════════════
     PRODUCTS & CARDS
  ══════════════════════ */
  .products { padding:6rem 5%;background:var(--cream-dk); }
  .products__grid {
    display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
    gap:2rem;max-width:1200px;margin:0 auto;
  }

  /* 3D — card tilt on mousemove (applied via JS), lift shadow on hover */
  .card {
    background:var(--white);border-radius:var(--radius-lg);overflow:hidden;
    box-shadow:var(--shadow-sm);border:1px solid rgba(184,148,42,0.08);
    opacity:0;transform:translateY(24px);
    transition:box-shadow 0.4s ease;
    transform-style:preserve-3d;will-change:transform;
  }
  .card.visible { animation:cardReveal 0.6s ease forwards; }
  @keyframes cardReveal { to{opacity:1;transform:translateY(0)} }

  /* directional lift shadow — updated via JS on hover */
  .card:hover {
    box-shadow:0 20px 50px -12px rgba(184,148,42,0.28),0 8px 20px rgba(26,20,16,0.1);
  }

  .card__img-wrap { position:relative;overflow:hidden;height:340px;background:var(--cream);cursor:pointer; }
  .card__img { width:100%;height:100%;object-fit:contain;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1); }
  .card:hover .card__img { transform:scale(1.05) translateZ(10px); }

  .card__overlay {
    position:absolute;inset:0;background:rgba(26,20,16,0.5);
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity 0.3s ease;
  }
  .card:hover .card__overlay { opacity:1; }
  .card__overlay-btn {
    font-family:var(--ff-sans);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;
    color:var(--ink);background:var(--white);border:none;padding:11px 24px;
    border-radius:var(--radius);cursor:pointer;font-weight:600;
    transform:translateY(8px);transition:transform 0.3s 0.05s ease,background 0.2s;
  }
  .card:hover .card__overlay-btn { transform:translateY(0); }
  .card__overlay-btn:hover { background:var(--gold-lt); }

  /* 3D — floating badge animation */
  .card__badge {
    position:absolute;top:14px;right:14px;
    background:rgba(250,247,242,0.95);color:var(--gold-dk);
    font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;
    padding:5px 12px;border-radius:100px;
    border:1px solid rgba(184,148,42,0.3);font-weight:600;backdrop-filter:blur(8px);
    animation:badgeFloat 3s ease-in-out infinite;
  }
  @keyframes badgeFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

  .card__body { padding:1.6rem 1.6rem 1.4rem; }
  .card__name { font-family:var(--ff-serif);font-size:1.45rem;font-weight:500;color:var(--ink);margin-bottom:0.3rem;letter-spacing:0.01em; }
  .card__cat { font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold-dk);margin-bottom:1.1rem;font-weight:600; }
  .card__price-row { display:flex;align-items:baseline;gap:2px;margin-bottom:1.25rem; }
  .card__price { font-family:var(--ff-display);font-size:2rem;font-weight:400;color:var(--teal); }
  .card__currency { font-size:0.9rem;color:var(--ink-lt);font-weight:300; }
  .card__divider { width:100%;height:1px;background:linear-gradient(90deg,rgba(184,148,42,0.2),transparent);margin-bottom:1.25rem; }

  /* ══════════════════════
     ABOUT — 3D effects
  ══════════════════════ */
  .about { padding:7rem 5%;background:var(--white);position:relative;overflow:hidden; }
  .about::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold-lt),var(--gold),transparent); }
  .about__inner { max-width:700px;margin:0 auto;text-align:center; }
  .about__logo { width:72px;height:72px;object-fit:contain;margin-bottom:2rem;filter:drop-shadow(0 4px 16px rgba(184,148,42,0.25)); }

  /* 3D — quote: each word flips in on scroll (applied via JS) */
  .about__quote {
    font-family:var(--ff-display);font-size:1.8rem;font-weight:400;
    font-style:italic;color:var(--ink);margin:2.5rem 0 1.5rem;
    line-height:1.5;position:relative;padding:0 2rem;
  }
  .about__quote::before {
    content:'"';position:absolute;top:-1.5rem;left:0;
    font-family:var(--ff-display);font-size:6rem;color:rgba(184,148,42,0.1);line-height:1;
  }
  /* Each word wrapped in a span with flip animation class */
  .quote-word {
    display:inline-block;
    opacity:0;transform:rotateX(90deg);transform-origin:bottom center;
    transition:opacity 0.5s ease, transform 0.5s ease;
    margin-right:0.25em;
  }
  .quote-word.flipped { opacity:1;transform:rotateX(0deg); }

  .about__text { font-size:1rem;line-height:2;color:var(--ink-lt);letter-spacing:0.02em; }
  .about__features { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem; }

  /* 3D — feature cards tilt on mousemove (applied via JS) */
  .about__feature {
    padding:1.5rem 1rem;border:1px solid rgba(184,148,42,0.15);
    border-radius:var(--radius-lg);text-align:center;background:var(--cream);
    transition:border-color 0.3s,background 0.3s,box-shadow 0.3s;
    transform-style:preserve-3d;will-change:transform;cursor:default;
  }
  .about__feature:hover { border-color:rgba(184,148,42,0.35);background:var(--white);box-shadow:var(--shadow-sm); }
  .about__feature-icon { font-size:1.75rem;margin-bottom:0.75rem;display:block; }
  .about__feature-title { font-family:var(--ff-serif);font-size:1rem;font-weight:500;color:var(--ink);margin-bottom:0.35rem; }
  .about__feature-desc { font-size:0.78rem;color:var(--ink-lt);line-height:1.7; }

  /* ══════════════════════
     FOOTER
  ══════════════════════ */
  .footer { background:var(--ink);color:rgba(250,247,242,0.65);text-align:center;padding:5rem 5% 3rem;position:relative; }
  .footer::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold-dk),var(--gold),var(--gold-dk),transparent); }
  .footer__logo { width:56px;height:56px;object-fit:contain;margin-bottom:1.5rem;filter:brightness(10) sepia(1) saturate(2) hue-rotate(5deg);opacity:0.75; }

  /* 3D — footer brand name: shimmer light scan */
  .footer__name {
    font-family:var(--ff-display);font-size:2.4rem;font-weight:400;
    letter-spacing:0.08em;margin-bottom:0.4rem;
    background:linear-gradient(120deg, var(--gold-lt) 0%, var(--gold-shine) 30%, var(--white) 50%, var(--gold-shine) 70%, var(--gold-lt) 100%);
    background-size:300% 100%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
    animation:footerShimmer 5s ease-in-out infinite;
  }
  @keyframes footerShimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

  .footer__tagline { font-size:0.62rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(250,247,242,0.3);margin-bottom:3rem;font-weight:500; }
  .footer__divider { width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(184,148,42,0.5),transparent);margin:0 auto 2.5rem; }
  .footer__contact { display:flex;align-items:center;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:3rem; }
  .footer__contact-item { display:flex;align-items:center;gap:8px;font-size:0.82rem;color:rgba(250,247,242,0.55);letter-spacing:0.05em;text-decoration:none;transition:color 0.2s; }
  .footer__contact-item:hover { color:var(--gold-lt); }
  .footer__contact-sep { width:1px;height:20px;background:rgba(250,247,242,0.1); }
  .footer__copy { font-size:0.62rem;letter-spacing:0.14em;color:rgba(250,247,242,0.2);text-transform:uppercase;padding-top:2rem;border-top:1px solid rgba(250,247,242,0.06); }
  .footer__social { display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:2.5rem; }
  .footer__social-link { width:42px;height:42px;border-radius:50%;border:1px solid rgba(184,148,42,0.25);display:flex;align-items:center;justify-content:center;color:rgba(250,247,242,0.45);text-decoration:none;transition:var(--transition); }
  .footer__social-link:hover { border-color:var(--gold);color:var(--gold-lt);background:rgba(184,148,42,0.1);transform:translateY(-3px); }
  .footer__nav { display:flex;gap:2rem;justify-content:center;flex-wrap:wrap;margin-bottom:2.5rem; }
  .footer__nav-link { font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(250,247,242,0.35);text-decoration:none;font-weight:500;transition:color 0.2s; }
  .footer__nav-link:hover { color:var(--gold-lt); }

  /* HERO ENHANCED */
  .hero__ring { position:absolute;width:600px;height:600px;border-radius:50%;border:1px solid rgba(184,148,42,0.06);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;animation:ringRotate 30s linear infinite; }
  .hero__ring:nth-child(2) { width:820px;height:820px;animation-duration:50s;animation-direction:reverse;border-color:rgba(184,148,42,0.04); }
  @keyframes ringRotate { to{transform:translate(-50%,-50%) rotate(360deg)} }
  .hero__ring-dot { position:absolute;top:50%;left:-4px;width:8px;height:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 12px rgba(184,148,42,0.8);margin-top:-4px; }
  .hero__typed-cursor { display:inline-block;width:3px;height:0.85em;background:var(--gold);margin-left:3px;vertical-align:middle;animation:cursorBlink 1s step-end infinite; }
  @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

  /* PROCESS */
  .process { padding:7rem 5%;background:var(--cream);position:relative;overflow:hidden; }
  .process::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent); }
  .process__inner { max-width:1100px;margin:0 auto; }
  .process__steps { display:grid;grid-template-columns:repeat(3,1fr);gap:2.5rem;margin-top:1rem;position:relative; }
  .process__steps::before { content:'';position:absolute;top:48px;left:calc(16.66% + 1.25rem);right:calc(16.66% + 1.25rem);height:1px;background:linear-gradient(90deg,var(--gold-dk),var(--gold-lt),var(--gold-dk));z-index:0; }
  .process__step { text-align:center;padding:2rem 1.5rem;position:relative;z-index:1;background:var(--white);border-radius:var(--radius-lg);border:1px solid rgba(184,148,42,0.1);opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease,box-shadow 0.3s ease,border-color 0.3s; }
  .process__step.visible { opacity:1;transform:translateY(0); }
  .process__step:hover { box-shadow:var(--shadow);border-color:rgba(184,148,42,0.3); }
  .process__step-num { width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dk),var(--gold));color:var(--white);font-family:var(--ff-display);font-size:1.5rem;display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;box-shadow:0 4px 20px rgba(184,148,42,0.35);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1); }
  .process__step:hover .process__step-num { transform:scale(1.12) rotate(-5deg); }
  .process__step-icon { font-size:1.6rem;margin-bottom:0.8rem;display:block; }
  .process__step-title { font-family:var(--ff-serif);font-size:1.25rem;font-weight:500;color:var(--ink);margin-bottom:0.5rem; }
  .process__step-desc { font-size:0.83rem;color:var(--ink-lt);line-height:1.8; }

  /* TESTIMONIALS */
  .testimonials { padding:7rem 5%;background:var(--ink);position:relative;overflow:hidden; }
  .testimonials::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 100%, rgba(184,148,42,0.08), transparent);pointer-events:none; }
  .testimonials .section-head__title { color:var(--gold-lt); }
  .testimonials .section-head__eyebrow { color:rgba(232,212,138,0.6); }
  .testimonials .section-head__eyebrow::before, .testimonials .section-head__eyebrow::after { background:rgba(184,148,42,0.5); }
  .testimonials__grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.75rem;max-width:1100px;margin:0 auto; }
  .tcard { background:rgba(250,247,242,0.04);border:1px solid rgba(184,148,42,0.15);border-radius:var(--radius-lg);padding:2rem;opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease,background 0.3s,border-color 0.3s; }
  .tcard.visible { opacity:1;transform:translateY(0); }
  .tcard:hover { background:rgba(250,247,242,0.07);border-color:rgba(184,148,42,0.3); }
  .tcard__quote { font-family:var(--ff-serif);font-size:1.05rem;font-style:italic;color:rgba(250,247,242,0.75);line-height:1.85;margin-bottom:1.5rem;position:relative;padding-left:1.5rem; }
  .tcard__quote::before { content:'"';position:absolute;left:0;top:-0.5rem;font-family:var(--ff-display);font-size:3rem;color:var(--gold);line-height:1;opacity:0.6; }
  .tcard__stars { color:var(--gold);letter-spacing:2px;font-size:0.85rem;margin-bottom:1rem; }
  .tcard__author { display:flex;align-items:center;gap:0.75rem; }
  .tcard__avatar { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold-dk),var(--gold));display:flex;align-items:center;justify-content:center;font-family:var(--ff-display);font-size:1rem;color:var(--white);flex-shrink:0; }
  .tcard__name { font-size:0.82rem;font-weight:600;color:rgba(250,247,242,0.8);letter-spacing:0.05em; }
  .tcard__loc { font-size:0.7rem;color:rgba(250,247,242,0.35);letter-spacing:0.1em;margin-top:1px; }

  /* INSTAGRAM */
  .insta { padding:5rem 5%;background:var(--cream-dk); }
  .insta__grid { display:grid;grid-template-columns:repeat(6,1fr);gap:6px;max-width:1100px;margin:2rem auto 0; }
  .insta__item { aspect-ratio:1;overflow:hidden;border-radius:var(--radius-sm);position:relative;cursor:pointer;background:var(--cream); }
  .insta__item-placeholder { width:100%;height:100%;background:linear-gradient(135deg,var(--cream),var(--cream-dk));display:flex;align-items:center;justify-content:center;font-size:1.5rem;transition:transform 0.5s ease; }
  .insta__item:hover .insta__item-placeholder { transform:scale(1.08); }
  .insta__item-overlay { position:absolute;inset:0;background:rgba(184,148,42,0.6);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.3s; }
  .insta__item:hover .insta__item-overlay { opacity:1; }
  .insta__item-icon { color:var(--white);font-size:1.5rem; }
  .insta__cta { text-align:center;margin-top:2rem; }
  .insta__handle { display:inline-flex;align-items:center;gap:0.6rem;font-size:0.78rem;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold-dk);text-decoration:none;font-weight:600;border-bottom:1px solid rgba(184,148,42,0.3);padding-bottom:3px;transition:color 0.2s,border-color 0.2s; }
  .insta__handle:hover { color:var(--ink);border-color:var(--gold); }

  /* FAQ */
  .faq { padding:7rem 5%;background:var(--white); }
  .faq__inner { max-width:740px;margin:0 auto; }
  .faq__item { border-bottom:1px solid rgba(184,148,42,0.15);overflow:hidden; }
  .faq__question { width:100%;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:1.4rem 0;gap:1rem;font-family:var(--ff-serif);font-size:1.05rem;font-weight:500;color:var(--ink);transition:color 0.2s; }
  .faq__question:hover { color:var(--gold-dk); }
  .faq__icon { width:28px;height:28px;border-radius:50%;flex-shrink:0;border:1.5px solid rgba(184,148,42,0.3);display:flex;align-items:center;justify-content:center;color:var(--gold-dk);font-size:1.1rem;font-weight:300;transition:var(--transition); }
  .faq__item.open .faq__icon { background:var(--gold);border-color:var(--gold);color:var(--white);transform:rotate(45deg); }
  .faq__answer { font-size:0.9rem;color:var(--ink-lt);line-height:1.9;max-height:0;overflow:hidden;transition:max-height 0.45s cubic-bezier(0.4,0,0.2,1),padding 0.35s ease;padding:0; }
  .faq__item.open .faq__answer { max-height:300px;padding-bottom:1.4rem; }

  /* CUSTOM DESIGN FORM */
  .custom { padding:7rem 5%;background:var(--ink);position:relative;overflow:hidden; }
  .custom::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 50% 70% at 80% 50%, rgba(15,110,86,0.08), transparent),radial-gradient(ellipse 40% 50% at 20% 50%, rgba(184,148,42,0.06), transparent);pointer-events:none; }
  .custom__inner { max-width:700px;margin:0 auto;text-align:center; }
  .custom .section-head__title { color:var(--gold-lt); }
  .custom .section-head__eyebrow { color:rgba(232,212,138,0.6); }
  .custom .section-head__eyebrow::before, .custom .section-head__eyebrow::after { background:rgba(184,148,42,0.45); }
  .custom__desc { color:rgba(250,247,242,0.5);font-size:0.9rem;line-height:1.9;margin-bottom:3rem;margin-top:-1rem; }
  .custom__form { display:grid;grid-template-columns:1fr 1fr;gap:1rem;text-align:left; }
  .custom__form .field-wrap:last-of-type { grid-column:1/-1; }
  .custom__field-dark { width:100%;font-family:var(--ff-sans);font-size:0.88rem;color:rgba(250,247,242,0.85);background:rgba(250,247,242,0.05);border:1.5px solid rgba(184,148,42,0.2);border-radius:var(--radius);padding:12px 16px;outline:none;transition:border-color 0.25s,box-shadow 0.25s,background 0.25s; }
  .custom__field-dark::placeholder { color:rgba(250,247,242,0.3); }
  .custom__field-dark:focus { border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,148,42,0.12);background:rgba(250,247,242,0.08); }
  .custom__field-dark option { background:var(--ink-md); }
  .custom__label-dark { display:block;font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(232,212,138,0.6);font-weight:600;margin-bottom:6px; }
  .custom__submit { grid-column:1/-1;width:100%;font-family:var(--ff-sans);font-size:0.72rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white);border:none;padding:15px 24px;border-radius:var(--radius);cursor:pointer;font-weight:600;background:linear-gradient(135deg,#1FAD54,#25D366 50%,#1FAD54);background-size:200% 100%;transition:background-position 0.4s ease,transform 0.2s,box-shadow 0.2s;box-shadow:0 3px 18px rgba(37,211,102,0.35);display:flex;align-items:center;justify-content:center;gap:10px; }
  .custom__submit:hover { background-position:100% 0;transform:translateY(-2px);box-shadow:0 6px 24px rgba(37,211,102,0.45); }

  @media (max-width:768px) {
    .process__steps { grid-template-columns:1fr; }
    .process__steps::before { display:none; }
    .insta__grid { grid-template-columns:repeat(3,1fr); }
    .custom__form { grid-template-columns:1fr; }
    .custom__form .field-wrap:last-of-type { grid-column:1; }
    .custom__submit { grid-column:1; }
  }

  /* ══════════════════════
     FAB — 3D pulse ring
  ══════════════════════ */
  .fab-wrap { position:fixed;bottom:1.75rem;right:1.75rem;z-index:99; }
  .fab-wrap::before {
    content:'';position:absolute;inset:-6px;
    border-radius:100px;background:rgba(37,211,102,0.35);
    animation:fabPulse 2.2s ease-out infinite;
  }
  .fab-wrap::after {
    content:'';position:absolute;inset:-12px;
    border-radius:100px;background:rgba(37,211,102,0.15);
    animation:fabPulse 2.2s 0.4s ease-out infinite;
  }
  @keyframes fabPulse {
    0%{transform:scale(1);opacity:1}
    100%{transform:scale(1.5);opacity:0}
  }
  .fab {
    position:relative;z-index:1;
    display:flex;align-items:center;gap:8px;
    background:linear-gradient(135deg,#1FAD54,#25D366);
    color:var(--white);font-family:var(--ff-sans);font-size:0.7rem;
    letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;
    padding:13px 22px;border-radius:100px;font-weight:600;
    box-shadow:0 4px 20px rgba(37,211,102,0.4);
    transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;
    animation:fabBounce 0.6s 1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .fab:hover { transform:translateY(-4px) scale(1.04);box-shadow:0 8px 28px rgba(37,211,102,0.55); }
  @keyframes fabBounce { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ══════════════════════
     SCROLL REVEAL
  ══════════════════════ */
  .reveal { opacity:0;transform:translateY(28px);transition:opacity 0.7s ease,transform 0.7s ease; }
  .reveal.visible { opacity:1;transform:translateY(0); }

  /* ══════════════════════
     RESPONSIVE
  ══════════════════════ */
  @media (max-width:768px) {
    .nav__links { display:none; }
    .nav__hamburger { display:flex; }
    .stats { flex-direction:column; }
    .stats__item { border-right:none;border-bottom:1px solid rgba(250,247,242,0.08);padding:1.25rem; }
    .stats__item:last-child { border-bottom:none; }
    .about__features { grid-template-columns:1fr; }
    .admin__row { grid-template-columns:1fr; }
    .hero { padding:6rem 5% 5rem; }
    .hero__cta { flex-direction:column;align-items:center; }
    .btn-outline,.btn-wa { width:100%;max-width:280px;justify-content:center; }
    .footer__contact { flex-direction:column;gap:1rem; }
    .footer__contact-sep { display:none; }
    /* disable heavy 3D on mobile for perf */
    .card { transform-style:flat; }
    .hero__title { animation:fadeInUp 0.7s 0.2s ease both; }
  }

  /* ══════════════════════
     AUTH & COUPON STYLES
  ══════════════════════ */
  .modal { position:relative; }
  .modal__close {
    position:absolute;top:1rem;right:1rem;background:none;border:none;
    font-size:0.85rem;color:var(--ink-lt);cursor:pointer;padding:4px 8px;
    border-radius:var(--radius-sm);transition:color 0.2s,background 0.2s;
  }
  .modal__close:hover { color:var(--ink);background:rgba(26,20,16,0.06); }

  .auth-error {
    background:rgba(184,50,50,0.08);border:1px solid rgba(184,50,50,0.2);
    color:#B83232;border-radius:var(--radius);padding:10px 14px;
    font-size:0.8rem;margin-bottom:0.75rem;letter-spacing:0.02em;
  }
  .auth-success {
    background:rgba(15,110,86,0.08);border:1px solid rgba(15,110,86,0.2);
    color:var(--teal-dk);border-radius:var(--radius);padding:10px 14px;
    font-size:0.8rem;margin-bottom:0.75rem;letter-spacing:0.02em;
  }

  .coupon-modal { text-align:center; }
  .coupon-confetti { font-size:2.8rem;margin-bottom:1rem;animation:confettiBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes confettiBounce { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }

  .coupon-code-box {
    background:var(--ink);border-radius:var(--radius);padding:18px 24px;
    margin:0 auto 1rem;cursor:pointer;transition:transform 0.2s,box-shadow 0.2s;
    border:1px solid rgba(184,148,42,0.3);box-shadow:var(--shadow-gold);
  }
  .coupon-code-box:hover { transform:translateY(-2px);box-shadow:0 8px 32px rgba(184,148,42,0.3); }
  .coupon-code-text {
    display:block;font-family:var(--ff-display);font-size:1.9rem;
    letter-spacing:0.18em;color:var(--gold-lt);text-shadow:0 0 20px rgba(184,148,42,0.4);
  }
  .coupon-copy-hint { display:block;font-size:0.62rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(232,212,138,0.5);margin-top:4px; }
  .coupon-note { font-size:0.78rem;color:var(--ink-lt);line-height:1.7;margin-top:0.5rem; }

  .nav__user { display:flex;align-items:center;gap:0.75rem; }
  .nav__user-name { font-size:0.72rem;letter-spacing:0.1em;color:var(--ink-md);font-weight:500;text-transform:uppercase; }
  .nav__user-avatar {
    width:34px;height:34px;border-radius:50%;
    background:linear-gradient(135deg,var(--gold-dk),var(--gold));
    display:flex;align-items:center;justify-content:center;
    font-size:0.75rem;color:var(--white);font-weight:600;letter-spacing:0.05em;
    box-shadow:0 2px 8px rgba(184,148,42,0.3);
  }
  .nav__logout {
    font-family:var(--ff-sans);font-size:0.65rem;letter-spacing:0.16em;text-transform:uppercase;
    color:var(--ink-lt);background:transparent;border:1px solid rgba(184,148,42,0.25);
    padding:6px 14px;cursor:pointer;border-radius:var(--radius-sm);transition:var(--transition);font-weight:500;
  }
  .nav__logout:hover { color:#B83232;border-color:rgba(184,50,50,0.4);background:rgba(184,50,50,0.04); }

  .admin-check-label { display:flex;align-items:center;gap:8px;font-size:0.75rem;color:var(--ink-md);cursor:pointer;font-weight:500;letter-spacing:0.06em; }
  .admin-check-label input[type="checkbox"] { accent-color:var(--gold);width:15px;height:15px;cursor:pointer; }

  .coupon-row {
    background:var(--cream);border:1px solid rgba(184,148,42,0.12);
    border-radius:var(--radius);padding:14px 18px;
    display:flex;align-items:center;flex-wrap:wrap;gap:0.75rem;transition:border-color 0.2s;
  }
  .coupon-row:hover { border-color:rgba(184,148,42,0.3); }
  .coupon-row__left { display:flex;align-items:center;gap:0.6rem;flex:1; }
  .coupon-row__code { font-family:var(--ff-display);font-size:1rem;color:var(--ink);letter-spacing:0.1em; }
  .coupon-row__badge {
    font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;
    background:rgba(184,148,42,0.1);color:var(--gold-dk);
    border:1px solid rgba(184,148,42,0.2);padding:3px 10px;border-radius:100px;font-weight:600;
  }
  .coupon-row__tag {
    font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;
    background:rgba(15,110,86,0.08);color:var(--teal-dk);
    border:1px solid rgba(15,110,86,0.18);padding:3px 10px;border-radius:100px;font-weight:600;
  }
  .coupon-row__meta { display:flex;gap:1rem;font-size:0.72rem;color:var(--ink-lt);letter-spacing:0.04em; }
  .coupon-row__actions { display:flex;align-items:center;gap:0.5rem; }
  .coupon-row__edit {
    font-family:var(--ff-sans);font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;
    color:var(--gold-dk);background:rgba(184,148,42,0.06);border:1.5px solid rgba(184,148,42,0.25);
    padding:6px 14px;border-radius:var(--radius);cursor:pointer;font-weight:500;transition:var(--transition);
  }
  .coupon-row__edit:hover { background:var(--gold);color:var(--white);border-color:var(--gold); }
  .coupon-toggle {
    font-family:var(--ff-sans);font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    border:1.5px solid;padding:6px 14px;border-radius:100px;cursor:pointer;font-weight:600;transition:var(--transition);
  }
  .coupon-toggle.active { background:rgba(15,110,86,0.08);color:var(--teal-dk);border-color:rgba(15,110,86,0.3); }
  .coupon-toggle.active:hover { background:var(--teal-dk);color:var(--white);border-color:var(--teal-dk); }
  .coupon-toggle.inactive { background:rgba(107,87,68,0.06);color:var(--ink-lt);border-color:rgba(107,87,68,0.2); }
`;

/* ── WhatsApp Icon ── */
const WaIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */

/* Scroll reveal */
function useScrollReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .card, .process__step, .tcard").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps);
}

/* Hero parallax background on scroll */
function useHeroParallax() {
  useEffect(() => {
    const bg = document.querySelector(".hero__bg");
    if (!bg) return;
    const onScroll = () => {
      const y = window.scrollY;
      bg.style.transform = `translateY(${y * 0.35}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

/* 3D tilt on mousemove — reusable for cards and feature tiles */
function useTilt(selector, strength = 12) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    const handlers = [];
    elements.forEach((el) => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) translateY(-4px)`;
      };
      const onLeave = () => { el.style.transform = ""; };
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
      handlers.push({ el, onMove, onLeave });
    });
    return () => handlers.forEach(({ el, onMove, onLeave }) => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    });
  }, [selector, strength]);
}

/* Hero pill tilt on mousemove (lighter strength) */
function usePillTilt() {
  useEffect(() => {
    const pills = document.querySelectorAll(".hero__pill");
    const handlers = [];
    pills.forEach((pill) => {
      const onMove = (e) => {
        const rect = pill.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        pill.style.transform = `perspective(400px) rotateX(${-y * 18}deg) rotateY(${x * 18}deg) scale(1.06)`;
      };
      const onLeave = () => { pill.style.transform = ""; };
      pill.addEventListener("mousemove", onMove);
      pill.addEventListener("mouseleave", onLeave);
      handlers.push({ pill, onMove, onLeave });
    });
    return () => handlers.forEach(({ pill, onMove, onLeave }) => {
      pill.removeEventListener("mousemove", onMove);
      pill.removeEventListener("mouseleave", onLeave);
    });
  }, []);
}

/* Stats count-up on scroll into view */
function useCountUp() {
  useEffect(() => {
    const statsData = [
      { suffix: "+", target: 500 },
      { suffix: "+", target: 12 },
      { suffix: "%", target: 100 },
      { suffix: "", target: null }, // ∞ — no count-up
    ];
    const items = document.querySelectorAll(".stats__num");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const idx = Array.from(items).indexOf(el);
        const data = statsData[idx];
        if (!data || data.target === null) return;
        observer.unobserve(el);
        let start = 0;
        const end = data.target;
        const duration = 1400;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.floor(eased * end) + data.suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = end + data.suffix;
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* Quote word-by-word 3D flip on scroll */
function useQuoteFlip() {
  useEffect(() => {
    const quote = document.querySelector(".about__quote");
    if (!quote) return;
    const text = quote.textContent.trim();
    const words = text.split(/\s+/);
    quote.innerHTML = words.map((w, i) =>
      `<span class="quote-word" style="transition-delay:${i * 60}ms">${w}</span>`
    ).join(" ");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".quote-word").forEach((w) => w.classList.add("flipped"));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(quote);
    return () => observer.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   HERO CANVAS — animated silk threads + floating particles
══════════════════════════════════════════════════════════════ */
function useHeroCanvas() {
  useEffect(() => {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const THREAD_COUNT = 18;
    const threads = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    class Thread {
      constructor() { this.reset(true); }
      reset(init = false) {
        this.x  = Math.random() * (W || 1400);
        this.y  = init ? Math.random() * (H || 700) : (H || 700) + 20;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(0.3 + Math.random() * 0.5);
        this.len = 80 + Math.random() * 160;
        this.width = 0.5 + Math.random() * 1.2;
        this.alpha = 0;
        this.maxAlpha = 0.12 + Math.random() * 0.2;
        this.phase = Math.random() * Math.PI * 2;
        this.freq  = 0.008 + Math.random() * 0.012;
        this.amp   = 15 + Math.random() * 35;
        this.hue   = Math.random() > 0.7 ? "15,110,86" : "184,148,42";
        this.t = 0;
        this.life = 0;
        this.maxLife = 200 + Math.random() * 300;
      }
      update() {
        this.t++;
        this.life++;
        this.x += this.vx + Math.sin(this.t * this.freq + this.phase) * 0.3;
        this.y += this.vy;
        const progress = this.life / this.maxLife;
        this.alpha = progress < 0.15
          ? (progress / 0.15) * this.maxAlpha
          : progress > 0.8
            ? ((1 - progress) / 0.2) * this.maxAlpha
            : this.maxAlpha;
        if (this.life > this.maxLife || this.y < -this.len - 20) this.reset();
      }
      draw() {
        const dx = Math.sin(this.t * this.freq + this.phase) * this.amp;
        const grad = ctx.createLinearGradient(this.x, this.y, this.x + dx, this.y - this.len);
        grad.addColorStop(0, `rgba(${this.hue},0)`);
        grad.addColorStop(0.3, `rgba(${this.hue},${this.alpha})`);
        grad.addColorStop(0.7, `rgba(${this.hue},${this.alpha * 0.7})`);
        grad.addColorStop(1, `rgba(${this.hue},0)`);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        // Bezier silk curve
        ctx.bezierCurveTo(
          this.x + dx * 0.4, this.y - this.len * 0.3,
          this.x + dx * 0.8, this.y - this.len * 0.7,
          this.x + dx,       this.y - this.len
        );
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.width;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }

    // Floating sparkle dots
    const SPARKS = 28;
    const sparks = Array.from({length: SPARKS}, () => ({
      x: Math.random() * 1400,
      y: Math.random() * 700,
      r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(0.15 + Math.random() * 0.3),
      alpha: 0,
      maxAlpha: 0.2 + Math.random() * 0.35,
      life: Math.floor(Math.random() * 400),
      maxLife: 300 + Math.random() * 400,
      hue: Math.random() > 0.6 ? "184,148,42" : "232,212,138",
    }));

    function updateSpark(s) {
      s.life++;
      s.x += s.vx;
      s.y += s.vy + Math.sin(s.life * 0.02) * 0.2;
      const p = (s.life % s.maxLife) / s.maxLife;
      s.alpha = p < 0.2 ? (p / 0.2) * s.maxAlpha : p > 0.75 ? ((1 - p) / 0.25) * s.maxAlpha : s.maxAlpha;
      if (s.life > s.maxLife) {
        s.x = Math.random() * W;
        s.y = H + 10;
        s.life = 0;
      }
    }

    function drawSpark(s) {
      ctx.beginPath();
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
      g.addColorStop(0, `rgba(${s.hue},${s.alpha})`);
      g.addColorStop(1, `rgba(${s.hue},0)`);
      ctx.fillStyle = g;
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    resize();
    for (let i = 0; i < THREAD_COUNT; i++) threads.push(new Thread());

    function loop() {
      ctx.clearRect(0, 0, W, H);
      threads.forEach(t => { t.update(); t.draw(); });
      sparks.forEach(s => { updateSpark(s); drawSpark(s); });
      animId = requestAnimationFrame(loop);
    }
    loop();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
}

/* ══════════════════════════════════════════════════════════════
   FAQ ACCORDION COMPONENT
══════════════════════════════════════════════════════════════ */
const FAQ_DATA = [
  { q: "How long does a custom order take?", a: "Most custom orders are completed within 10–21 days depending on the complexity of the embroidery. We'll give you a precise timeline when you place your order. Rush orders can be accommodated for an additional charge." },
  { q: "How does the customisation process work?", a: "Once you place your enquiry via WhatsApp or our form, we discuss your requirements — fabric, design, colours, and measurements. We then share design references and progress photos at each stage for your approval." },
  { q: "Do you ship outside Hyderabad?", a: "Yes! We ship across India via trusted courier partners. International shipping to select countries is also available. Shipping charges are calculated based on your location and order weight." },
  { q: "How do I care for my embroidered piece?", a: "We recommend dry cleaning for all heavily embroidered pieces. For lighter embroidery, gentle hand wash in cold water with mild detergent works well. Always store flat or rolled to avoid crushing the embroidery work." },
  { q: "Can I provide my own fabric?", a: "Absolutely. If you have a special fabric you'd like us to work on, we welcome that. Just ensure the fabric is suitable for the type of embroidery you're requesting. We'll advise you during the consultation." },
  { q: "What is your return or alteration policy?", a: "We want you to love your piece. If there are any fitting issues or you're not satisfied with the work, contact us within 7 days of receiving your order and we'll make it right. We offer free minor alterations on all custom orders." },
];

function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div>
      {FAQ_DATA.map((item, i) => (
        <div className={`faq__item${openIdx === i ? " open" : ""}`} key={i}>
          <button className="faq__question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            {item.q}
            <span className="faq__icon">+</span>
          </button>
          <div className="faq__answer">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CUSTOM DESIGN FORM COMPONENT
══════════════════════════════════════════════════════════════ */
function CustomDesignForm() {
  const [form, setForm] = useState({ name:"", phone:"", occasion:"", fabric:"", size:"", notes:"" });
  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const handleSubmit = () => {
    if (!form.name || !form.phone) { alert("Please enter your name and phone number."); return; }
    const msg = `Hello MaaTarang! I'd like to request a custom design.%0A%0A*Name:* ${form.name}%0A*Phone:* ${form.phone}%0A*Occasion:* ${form.occasion || "Not specified"}%0A*Fabric preference:* ${form.fabric || "Not specified"}%0A*Size:* ${form.size || "Not specified"}%0A*Additional notes:* ${form.notes || "None"}%0A%0ALooking forward to creating something beautiful together!`;
    window.open(`https://wa.me/917780646402?text=${msg}`, "_blank");
  };
  return (
    <div className="custom__form">
      <div className="field-wrap">
        <label className="custom__label-dark">Your Name</label>
        <input className="custom__field-dark" placeholder="e.g. Priya Sharma" value={form.name} onChange={set("name")} />
      </div>
      <div className="field-wrap">
        <label className="custom__label-dark">Phone / WhatsApp</label>
        <input className="custom__field-dark" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
      </div>
      <div className="field-wrap">
        <label className="custom__label-dark">Occasion</label>
        <select className="custom__field-dark" value={form.occasion} onChange={set("occasion")}>
          <option value="">Select occasion</option>
          {["Wedding","Engagement","Festive / Puja","Reception","Birthday","Other"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field-wrap">
        <label className="custom__label-dark">Fabric Preference</label>
        <select className="custom__field-dark" value={form.fabric} onChange={set("fabric")}>
          <option value="">Select fabric</option>
          {["Silk","Cotton","Georgette","Chiffon","Net","Velvet","I'll provide my own","Not sure yet"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div className="field-wrap">
        <label className="custom__label-dark">Size / Measurements</label>
        <input className="custom__field-dark" placeholder="e.g. S / M / 36 bust" value={form.size} onChange={set("size")} />
      </div>
      <div className="field-wrap" style={{gridColumn:"1/-1"}}>
        <label className="custom__label-dark">Additional Notes</label>
        <textarea className="custom__field-dark" rows={3} placeholder="Describe your design idea, colour preferences, reference images you have in mind…" value={form.notes} onChange={set("notes")} style={{resize:"vertical"}} />
      </div>
      <button className="custom__submit" onClick={handleSubmit}>
        <WaIcon /> Send Request on WhatsApp
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newName, setNewName]       = useState("");
  const [newPrice, setNewPrice]     = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile]   = useState(null);
  const [showAdmin, setShowAdmin]   = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [uploading, setUploading]   = useState(false);





  /* ── Data fetch ── */
  useEffect(() => {
    const load = () => {
      fetch(`${API_URL}/products`)
        .then((r) => r.json())
        .then((d) => { setProducts(d); setLoading(false); })
        .catch(() => setTimeout(load, 3000));
    };
    load();
  }, []);

  /* ── Navbar scroll shrink ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── All 3D / animation hooks (run after products load) ── */
  useScrollReveal([products]);
  useHeroParallax();
  usePillTilt();
  useCountUp();
  useQuoteFlip();
  useTilt(".card", 10);
  useTilt(".about__feature", 14);
  useTilt(".process__step", 8);
  useHeroCanvas();

  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  /* ── Admin login helper ── */
  const doLogin = useCallback(() => {
    if (password === "Bunny@MaaTarang") {
      setIsAdmin(true); setShowAdmin(false); setPassword("");
    } else {
      alert("Incorrect password. Please try again.");
    }
  }, [password]);

  /* ══════════════════════════════════════════════════════
     LOADER
  ══════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="loader">
          <div className="loader__logo-wrap">
            <div className="loader__ring-2" />
            <div className="loader__ring" />
            <img src={logo} alt="MaaTarang" className="loader__logo" />
          </div>
          <p className="loader__sub">Preparing your collection</p>
          <div className="loader__dots">
            <div className="loader__dot" />
            <div className="loader__dot" />
            <div className="loader__dot" />
          </div>
        </div>
      </>
    );
  }

  /* ══════════════════════════════════════════════════════
     MAIN UI
  ══════════════════════════════════════════════════════ */
  return (
    <>
      <style>{css}</style>

      {/* ── Navbar ── */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="nav__brand">
          <img src={logo} alt="MaaTarang" className="nav__logo" />
          <div className="nav__tagline" style={{marginLeft:"0.5rem"}}>Where Tradition Meets Artistry</div>
        </a>
        <ul className="nav__links">
          <li><a href="#" className="nav__link">Home</a></li>
          <li><a href="#products" className="nav__link">Collection</a></li>
          <li><a href="#about" className="nav__link">About</a></li>
          <li><a href="#contact" className="nav__link">Contact</a></li>
          <li><button className="nav__btn" onClick={() => setShowAdmin(true)}>Admin</button></li>
        </ul>
        <button
          className={`nav__hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile menu */}
      <ul className={`nav__mobile${menuOpen ? " open" : ""}`}>
        {["Home", "Collection", "About", "Contact"].map((item) => (
          <li key={item}>
            <a
              href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
              className="nav__link"
              onClick={() => setMenuOpen(false)}
            >{item}</a>
          </li>
        ))}
        <li>
          <button className="nav__btn" onClick={() => { setShowAdmin(true); setMenuOpen(false); }}>
            Admin
          </button>
        </li>
      </ul>

      {/* ── Admin Login Modal ── */}
      {showAdmin && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdmin(false)}>
          <div className="modal">
            <div className="modal__icon">🔐</div>
            <h2 className="modal__title">Admin Access</h2>
            <p className="modal__sub">Enter credentials to continue</p>
            <div className="modal__divider" />
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") doLogin(); }}
                className="field"
                autoFocus
              />
            </div>
            <button className="btn-primary" onClick={doLogin}>Sign In</button>
            <button className="btn-ghost" onClick={() => setShowAdmin(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Admin Dashboard ── */}
      {isAdmin && (
        <div className="admin">
          <div className="admin__header">
            <div className="admin__icon">⚙️</div>
            <div>
              <h2 className="admin__title">Admin Dashboard</h2>
              <p className="admin__sub">Manage your collection</p>
            </div>
          </div>
          <div className="admin__divider" />
          <div className="admin__grid">
            <div className="admin__row">
              <div className="field-wrap">
                <label className="field-label">Product Name</label>
                <input type="text" placeholder="e.g. Bridal Blouse" value={newName}
                  onChange={(e) => setNewName(e.target.value)} className="field" />
              </div>
              <div className="field-wrap">
                <label className="field-label">Price (₹)</label>
                <input type="number" placeholder="e.g. 2500" value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)} className="field" />
              </div>
            </div>
            <div className="field-wrap">
              <label className="field-label">Category</label>
              <input type="text" placeholder="e.g. Designer Blouse" value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)} className="field" />
            </div>
            <div className="field-wrap">
              <label className="field-label">Product Image</label>
              <input type="file" accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])} className="field" />
            </div>
            <button
              className="btn-primary"
              disabled={uploading}
              onClick={async () => {
                if (!newName || !newPrice || !newCategory || !imageFile) {
                  alert("Please fill all fields and select an image.");
                  return;
                }
                setUploading(true);
                try {
                  const formData = new FormData();
                  formData.append("image", imageFile);
                  const uploadRes = await fetch(`${API_URL}/upload`, {
                    method: "POST",
                    body: formData,
                  });
                  const uploadData = await uploadRes.json();
                  await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: newName, price: Number(newPrice),
                      category: newCategory, image: uploadData.imageUrl,
                    }),
                  });
                  alert("Product added successfully ✓");
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                  alert("Upload failed. Please try again.");
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? "Uploading…" : "Add Product"}
            </button>
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="hero">
        <canvas id="hero-canvas" className="hero__canvas" />
        <div className="hero__bg" />
        <div className="hero__ring"><div className="hero__ring-dot" /></div>
        <div className="hero__ring" />
        {/* Decorative embroidery-inspired motifs */}
        <svg className="hero__motif" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="90" stroke="#B8942A" strokeWidth="1"/>
          <circle cx="100" cy="100" r="70" stroke="#B8942A" strokeWidth="0.5"/>
          <circle cx="100" cy="100" r="50" stroke="#B8942A" strokeWidth="1"/>
          {[0,45,90,135,180,225,270,315].map(a=>(
            <g key={a} transform={`rotate(${a} 100 100)`}>
              <line x1="100" y1="10" x2="100" y2="30" stroke="#B8942A" strokeWidth="1.5"/>
              <circle cx="100" cy="35" r="4" fill="#B8942A"/>
              <path d="M100 50 Q110 70 100 90 Q90 70 100 50" fill="#B8942A" opacity="0.4"/>
            </g>
          ))}
        </svg>
        <svg className="hero__motif" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" stroke="#0F6E56" strokeWidth="0.8"/>
          {[0,60,120,180,240,300].map(a=>(
            <g key={a} transform={`rotate(${a} 100 100)`}>
              <path d="M100 20 Q120 60 100 100 Q80 60 100 20" fill="#0F6E56" opacity="0.3"/>
              <circle cx="100" cy="20" r="5" fill="#0F6E56" opacity="0.5"/>
            </g>
          ))}
          <circle cx="100" cy="100" r="15" stroke="#0F6E56" strokeWidth="1.5"/>
          <circle cx="100" cy="100" r="6" fill="#0F6E56" opacity="0.4"/>
        </svg>
        <svg className="hero__motif" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0,90,180,270].map(a=>(
            <g key={a} transform={`rotate(${a} 50 50)`}>
              <path d="M50 5 Q65 30 50 50 Q35 30 50 5" fill="#B8942A"/>
            </g>
          ))}
          <circle cx="50" cy="50" r="8" stroke="#B8942A" strokeWidth="1.5"/>
        </svg>
        <p className="hero__eyebrow">Handcrafted in India · Est. 2012</p>
        <h1 className="hero__title">
          Wear the art of<br />
          <em>timeless craft</em>
        </h1>
        <p className="hero__desc">
          Discover handcrafted embroidery, designer blouses, maggam work,
          and bespoke creations — each piece a testament to artistry and
          generations of tradition.
        </p>
        <div className="hero__pills">
          {["Traditional Embroidery", "Maggam Work", "Custom Designs", "Designer Blouses"].map((t) => (
            <span className="hero__pill" key={t}>
              <span className="hero__pill-dot" />{t}
            </span>
          ))}
        </div>
        <div className="hero__cta">
          <a href="https://wa.me/917780646402" target="_blank" rel="noopener noreferrer">
            <button className="btn-wa" style={{ width: "auto", padding: "13px 32px" }}>
              <WaIcon /> Order on WhatsApp
            </button>
          </a>
          <a href="#products" className="btn-outline">View Collection</a>
          <a href="#custom" className="btn-outline" style={{borderColor:"rgba(15,110,86,0.5)",color:"var(--teal-dk)"}}>Request Custom Design</a>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats">
        {[
          { num: "500+", label: "Pieces Created" },
          { num: "12+",  label: "Years of Craft" },
          { num: "100%", label: "Handcrafted" },
          { num: "∞",    label: "Custom Orders" },
        ].map((s) => (
          <div className="stats__item" key={s.label}>
            <span className="stats__num">{s.num}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Products ── */}
      <section className="products" id="products">
        <div className="section-head reveal">
          <p className="section-head__eyebrow">Our Collection</p>
          <h2 className="section-head__title">Featured Designs</h2>
          <div className="section-head__line" />
        </div>
        <div className="products__grid">
          {products.map((product) => (
            <div className="card" key={product._id || product.id}>
              <div className="card__img-wrap">
                <img src={product.image} alt={product.name} className="card__img" />
                <span className="card__badge">{product.category}</span>
                <div className="card__overlay">
                  <button
                    className="card__overlay-btn"
                    onClick={() => window.open(
                      `https://wa.me/917780646402?text=Hello MaaTarang, I am interested in ${encodeURIComponent(product.name)}`,
                      "_blank"
                    )}
                  >Quick Enquire</button>
                </div>
              </div>
              <div className="card__body">
                <h3 className="card__name">{product.name}</h3>
                <p className="card__cat">{product.category}</p>
                <div className="card__price-row">
                  <span className="card__currency">₹</span>
                  <span className="card__price">{product.price}</span>
                  <span className="card__currency">/-</span>
                </div>
                <div className="card__divider" />
                <a
                  href={`https://wa.me/917780646402?text=Hello MaaTarang, I am interested in ${encodeURIComponent(product.name)}`}
                  target="_blank" rel="noopener noreferrer"
                >
                  <button className="btn-wa"><WaIcon /> Order on WhatsApp</button>
                </a>
                {isAdmin && (
                  <button
                    className="btn-delete"
                    onClick={async () => {
                      if (!window.confirm(`Delete "${product.name}"?`)) return;
                      try {
                        await fetch(`${API_URL}/products/${product._id}`, { method: "DELETE" });
                        window.location.reload();
                      } catch { alert("Delete failed."); }
                    }}
                  >✕ Remove Product</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Process / How It Works ── */}
      <section className="process" id="process">
        <div className="process__inner">
          <div className="section-head reveal">
            <p className="section-head__eyebrow">Simple Steps</p>
            <h2 className="section-head__title">How It Works</h2>
            <div className="section-head__line" />
          </div>
          <div className="process__steps">
            {[
              { num:"01", icon:"🎨", title:"Choose Your Design", desc:"Browse our curated collection or describe your dream piece — a bridal blouse, embroidered saree, or bespoke creation." },
              { num:"02", icon:"✂️", title:"We Customise For You", desc:"Our artisans work closely with you on fabric, colours, and embroidery. We share progress photos throughout the process." },
              { num:"03", icon:"📦", title:"Receive & Cherish", desc:"Your handcrafted piece is carefully packaged and delivered to your door. Wear it with pride — each stitch made for you." },
            ].map((s, i) => (
              <div className="process__step reveal" key={s.num} style={{transitionDelay:`${i*120}ms`}}>
                <div className="process__step-num">{s.num}</div>
                <span className="process__step-icon">{s.icon}</span>
                <div className="process__step-title">{s.title}</div>
                <p className="process__step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials" id="testimonials">
        <div className="section-head reveal">
          <p className="section-head__eyebrow">Happy Clients</p>
          <h2 className="section-head__title">What They Say</h2>
          <div className="section-head__line" />
        </div>
        <div className="testimonials__grid">
          {[
            { quote:"The bridal blouse MaaTarang made for my wedding was absolutely stunning. Every single guest asked where I got it. The embroidery detail was beyond anything I had imagined.", name:"Priya Sharma", loc:"Hyderabad", stars:"★★★★★", initial:"P" },
            { quote:"I've ordered three times and every piece has been better than the last. The maggam work on my saree blouse was so intricate and precise. Truly a work of art.", name:"Ananya Reddy", loc:"Bengaluru", stars:"★★★★★", initial:"A" },
            { quote:"Ordered a custom embroidered dupatta for my sister's wedding. The communication was excellent, they shared photos at every stage. Delivered exactly on time and beautifully packaged.", name:"Meena Iyer", loc:"Chennai", stars:"★★★★★", initial:"M" },
            { quote:"What sets MaaTarang apart is the personal attention. They understood my vision immediately and the final piece exceeded all my expectations. Already planning my next order!", name:"Sunitha Rao", loc:"Hyderabad", stars:"★★★★★", initial:"S" },
            { quote:"The quality of their handwork is museum-worthy. I wear my MaaTarang blouse to every special occasion and always receive compliments. Worth every rupee.", name:"Kavitha Nair", loc:"Mumbai", stars:"★★★★★", initial:"K" },
            { quote:"Fast, professional, and breathtakingly beautiful work. The attention to detail in their maggam work is unmatched. A true gem of Hyderabad craftsmanship.", name:"Deepika Pillai", loc:"Visakhapatnam", stars:"★★★★★", initial:"D" },
          ].map((t, i) => (
            <div className="tcard reveal" key={t.name} style={{transitionDelay:`${i*80}ms`}}>
              <div className="tcard__stars">{t.stars}</div>
              <p className="tcard__quote">{t.quote}</p>
              <div className="tcard__author">
                <div className="tcard__avatar">{t.initial}</div>
                <div>
                  <div className="tcard__name">{t.name}</div>
                  <div className="tcard__loc">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Instagram Teaser ── */}
      <section className="insta" id="instagram">
        <div className="section-head reveal">
          <p className="section-head__eyebrow">Follow Our Journey</p>
          <h2 className="section-head__title">@MaaTarang</h2>
          <div className="section-head__line" />
        </div>
        <div className="insta__grid">
          {["🪡","✨","🌸","🎨","👗","🪷","💛","🌿","🏵️","✂️","🌺","💎"].map((icon, i) => (
            <a
              key={i}
              className="insta__item"
              href="https://instagram.com/maatarang"
              target="_blank" rel="noopener noreferrer"
            >
              <div className="insta__item-placeholder">{icon}</div>
              <div className="insta__item-overlay">
                <span className="insta__item-icon">📷</span>
              </div>
            </a>
          ))}
        </div>
        <div className="insta__cta">
          <a href="https://instagram.com/maatarang" target="_blank" rel="noopener noreferrer" className="insta__handle">
            ✦ Follow us on Instagram for daily inspiration
          </a>
        </div>
      </section>

      {/* ── Custom Design Request ── */}
      <section className="custom" id="custom">
        <div className="custom__inner">
          <div className="section-head reveal">
            <p className="section-head__eyebrow">Bespoke Creations</p>
            <h2 className="section-head__title">Request a Custom Design</h2>
            <div className="section-head__line" />
          </div>
          <p className="custom__desc">
            Have a vision in mind? Tell us your dream piece and we'll bring it to life.<br />
            Fill in the details and we'll reach out on WhatsApp to begin your journey.
          </p>
          <CustomDesignForm />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq" id="faq">
        <div className="faq__inner">
          <div className="section-head reveal">
            <p className="section-head__eyebrow">Got Questions?</p>
            <h2 className="section-head__title">Frequently Asked</h2>
            <div className="section-head__line" />
          </div>
          <FaqAccordion />
        </div>
      </section>

      {/* ── About ── */}
      <section className="about" id="about">
        <div className="about__inner">
          <div className="section-head reveal">
            <p className="section-head__eyebrow">Our Story</p>
            <h2 className="section-head__title">About MaaTarang</h2>
            <div className="section-head__line" />
          </div>
          <img src={logo} alt="MaaTarang" className="about__logo reveal" />
          {/* Words are wrapped into spans by useQuoteFlip for 3D flip */}
          <blockquote className="about__quote">
            Every stitch carries the echo of tradition, every thread a story untold.
          </blockquote>
          <p className="about__text reveal">
            MaaTarang celebrates the timeless art of traditional craftsmanship
            through handcrafted embroidery, intricate maggam work, designer blouses,
            and custom tailoring. Every creation is born from artistry, patience,
            and a deep reverence for the craft passed down through generations.
          </p>
          <div className="about__features reveal">
            {[
              { icon: "🪡", title: "Hand Embroidered", desc: "Every piece stitched with care by skilled artisans" },
              { icon: "✨", title: "Bespoke Designs",  desc: "Custom creations tailored to your vision" },
              { icon: "🌿", title: "Ethically Made",   desc: "Supporting traditional craft communities" },
            ].map((f) => (
              <div className="about__feature" key={f.title}>
                <span className="about__feature-icon">{f.icon}</span>
                <div className="about__feature-title">{f.title}</div>
                <div className="about__feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" id="contact">
        <img src={logo} alt="MaaTarang" className="footer__logo" />
        <div className="footer__name">MaaTarang</div>
        <div className="footer__tagline">Where Tradition Meets Artistry</div>
        <div className="footer__divider" />
        {/* Social links */}
        <div className="footer__social">
          <a href="https://instagram.com/maatarang" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <a href="https://facebook.com/maatarang" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://wa.me/917780646402" target="_blank" rel="noopener noreferrer" className="footer__social-link" title="WhatsApp">
            <WaIcon />
          </a>
          <a href="mailto:hello@maatarang.in" className="footer__social-link" title="Email">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </a>
        </div>
        {/* Nav links */}
        <nav className="footer__nav">
          {[["Home","#"],["Collection","#products"],["Process","#process"],["About","#about"],["FAQ","#faq"],["Contact","#contact"]].map(([label,href]) => (
            <a key={label} href={href} className="footer__nav-link">{label}</a>
          ))}
        </nav>
        <div className="footer__divider" />
        <div className="footer__contact">
          <a href="https://wa.me/917780646402" className="footer__contact-item">
            <WaIcon /> +91 77806 46402
          </a>
          <div className="footer__contact-sep" />
          <a href="mailto:hello@maatarang.in" className="footer__contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            hello@maatarang.in
          </a>
          <div className="footer__contact-sep" />
          <span className="footer__contact-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Hyderabad, India
          </span>
        </div>
        <p className="footer__copy">© 2026 MaaTarang · All Rights Reserved · Crafted with ❤️</p>
      </footer>

      {/* ── Floating WhatsApp Button with pulse ring ── */}
      <div className="fab-wrap">
        <a href="https://wa.me/917780646402" target="_blank" rel="noopener noreferrer" className="fab">
          <WaIcon /> WhatsApp Us
        </a>
      </div>
    </>
  );
}
