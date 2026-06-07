import { useEffect, useState, useRef, useCallback } from "react";
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
    background: var(--ink); position: relative; overflow: hidden;
  }
  .loader::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(184,148,42,0.14), transparent);
  }
  .loader__logo {
    width: 90px; height: 90px; object-fit: contain;
    filter: brightness(10) sepia(1) saturate(3) hue-rotate(5deg);
    opacity: 0.9; margin-bottom: 2rem;
    animation: loaderFloat 3s ease-in-out infinite;
  }
  .loader__title {
    font-family: var(--ff-display); font-size: 3.2rem; font-weight: 400;
    letter-spacing: 0.12em; color: var(--gold-lt); margin-bottom: 0.5rem;
    animation: fadeInUp 0.8s ease both;
  }
  .loader__sub {
    font-size: 0.72rem; letter-spacing: 0.35em; text-transform: uppercase;
    color: rgba(232,212,138,0.5); margin-bottom: 3rem;
    animation: fadeInUp 0.8s 0.15s ease both;
  }
  .loader__bar { width: 180px; height: 1px; background: rgba(184,148,42,0.2); border-radius: 4px; overflow: hidden; }
  .loader__bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dk), var(--gold-shine), var(--gold-dk));
    background-size: 200% 100%; animation: shimmerBar 1.8s linear infinite; border-radius: 4px;
  }
  @keyframes loaderFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-10px) scale(1.03)} }
  @keyframes shimmerBar  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
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
    width: 44px; height: 44px; object-fit: contain;
    transition: transform 0.5s cubic-bezier(0.34,1.4,0.64,1);
    transform-style: preserve-3d;
  }
  .nav__brand:hover .nav__logo { transform: perspective(300px) rotateY(28deg) scale(1.08); }

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
  }

  /* 3D — parallax background layer (moved by JS on scroll) */
  .hero__bg {
    position:absolute;inset:0;pointer-events:none;will-change:transform;
    background:
      radial-gradient(ellipse 80% 70% at 50% 50%, rgba(184,148,42,0.09), transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(15,110,86,0.05), transparent);
    transition:transform 0.05s linear;
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
    document.querySelectorAll(".reveal, .card").forEach((el) => observer.observe(el));
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
  const [password, setPassword]     = useState("");
  const [isAdmin, setIsAdmin]       = useState(false);
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
          <img src={logo} alt="MaaTarang" className="loader__logo" />
          <h1 className="loader__title">MaaTarang</h1>
          <p className="loader__sub">Preparing your collection</p>
          <div className="loader__bar"><div className="loader__bar-fill" /></div>
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
          <div>
            <div className="nav__name">MaaTarang</div>
            <div className="nav__tagline">Where Tradition Meets Artistry</div>
          </div>
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
                  const uploadRes = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
                  const uploadData = await uploadRes.json();
                  await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
        <div className="hero__bg" />
        <p className="hero__eyebrow">Handcrafted in India</p>
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
        <div className="footer__contact">
          <a href="https://wa.me/917780646402" className="footer__contact-item">
            <WaIcon /> +91 77806 46402
          </a>
          <div className="footer__contact-sep" />
          <span className="footer__contact-item">Hyderabad, India</span>
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
