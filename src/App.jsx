import { useEffect, useState, useRef, useCallback } from "react";
import logo from "./assets/logo.png";

const API_URL = "https://maatarang-backend.onrender.com";

/* ═══════════════════════════════════════════════════════════════
   CSS  — Full 1,300+ Line Layout Restored with Premium Fluid Wave Overlays
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
    position: relative;
  }

  /* Fixed Background Layer Canvas */
  .luxury-bg-canvas {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 0; pointer-events: none;
    background: var(--cream);
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
    background: var(--ink); position: relative; overflow: hidden; z-index: 999999;
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
     MODAL OVERLAYS (HIGH PRIORITY)
  ══════════════════════ */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(26,20,16,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 99999; backdrop-filter: blur(12px); animation: fadeIn 0.2s ease;
  }
  .modal {
    background: var(--white); width: 90%; max-width: 400px;
    border-radius: var(--radius-lg); padding: 2.75rem;
    box-shadow: var(--shadow-lg); animation: modalUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
    border: 1px solid rgba(184,148,42,0.12);
    text-align: center;
  }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes modalUp { from{transform:translateY(24px) scale(0.96);opacity:0} to{transform:translateY(0) scale(1);opacity:1} }
  .modal__icon { width:52px;height:52px;border-radius:50%;background:rgba(184,148,42,0.1);border:1px solid rgba(184,148,42,0.2);display:inline-flex;align-items:center;justify-content:center;margin-bottom:1.5rem;font-size:1.4rem; }
  .modal__title { font-family:var(--ff-serif);font-size:1.8rem;font-weight:500;color:var(--ink);margin-bottom:0.4rem; }
  .modal__sub { font-size:0.8rem;color:var(--ink-lt);letter-spacing:0.05em;margin-bottom:2rem; }
  .modal__divider { width:36px;height:1.5px;background:linear-gradient(90deg,var(--gold),var(--gold-lt));margin: 0 auto 1.75rem;border-radius:2px; }

  /* ══════════════════════
     AMAZON-STYLE DETAILED PRODUCT OVERLAY SHEET
  ══════════════════════ */
  .detail-route-view {
    position: fixed; inset: 0; z-index: 20000;
    background: rgba(250,247,242,0.94); backdrop-filter: blur(24px);
    display: flex; align-items: center; justify-content: center; padding: 2.5rem;
    animation: fadeIn 0.3s ease; overflow-y: auto;
  }
  .detail-route-card {
    background: var(--white); border: 1px solid rgba(184, 148, 42, 0.15);
    max-width: 1000px; width: 100%; border-radius: var(--radius-lg);
    display: grid; grid-template-columns: 1.1fr 0.9fr; overflow: hidden;
    box-shadow: var(--shadow-lg); position: relative;
  }
  .detail-route__gallery { background: var(--cream-dk); display: flex; align-items: center; justify-content: center; padding: 3rem; min-height: 480px; }
  .detail-route__img { max-width: 100%; max-height: 500px; object-fit: contain; }
  .detail-route__content { padding: 4rem 3.5rem; display: flex; flex-direction: column; justify-content: center; text-align: left; }
  .detail-route__close { position: absolute; top: 1.5rem; right: 1.5rem; background: var(--ink); border: none; color: #FFF; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.95rem; z-index: 10; }
  .detail-route__share-btn { margin-top: 1rem; padding: 12px; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid rgba(26,20,16,0.2); border-radius: var(--radius); background: transparent; cursor: pointer; color: var(--ink-md); font-weight: 600; display: inline-flex; align-items: center; justify-content: center; gap: 6px; }
  .detail-route__share-btn:hover { background: rgba(0,0,0,0.03); border-color: var(--ink); }

  /* ══════════════════════
     INPUTS
  ══════════════════════ */
  .field-wrap { position:relative;margin-bottom:0.85rem; text-align: left; }
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
  .btn-wa-large { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; border-radius: var(--radius); background: #25D366; color: #FFF; border: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; text-decoration: none; cursor: pointer; transition: var(--transition); }
  .btn-wa-large:hover { background: #20BA56; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(37,211,102,0.25); }

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
    position: relative; z-index: 10;
  }
  .admin__header { display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem; }
  .admin__icon { width:48px;height:48px;border-radius:50%;background:rgba(184,148,42,0.1);border:1px solid rgba(184,148,42,0.2);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0; }
  .admin__title { font-family:var(--ff-serif);font-size:1.75rem;font-weight:500;color:var(--ink);margin-bottom:0.15rem; }
  .admin__sub { font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold-dk);font-weight:500; }
  .admin__divider { width:100%;height:1px;background:linear-gradient(90deg,rgba(184,148,42,0.3),transparent);margin-bottom:2rem; }
  .admin__grid { display:grid;gap:0; }
  .admin__row { display:grid;grid-template-columns:1fr 1fr;gap:0.8rem; }

  /* ══════════════════════
     HERO CORE STRUCTURES
  ══════════════════════ */
  .hero { position:relative;text-align:center; padding:8rem 5% 7rem;overflow:hidden; background: transparent; z-index: 1; }
  .hero__bg { position:absolute;inset:0;pointer-events:none;will-change:transform; background: radial-gradient(ellipse 80% 70% at 50% 50%, rgba(184,148,42,0.09), transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(15,110,86,0.05), transparent); transition:transform 0.05s linear; }
  .hero__eyebrow { font-size:0.65rem;letter-spacing:0.38em;text-transform:uppercase; color:var(--gold-dk);margin-bottom:1.5rem;font-weight:600; display:inline-flex;align-items:center;gap:10px; position:relative;z-index:1; }
  .hero__eyebrow::before,.hero__eyebrow::after { content:'';display:block;width:28px;height:1px;background:var(--gold); }
  .hero__title { font-family:var(--ff-display);font-size:clamp(3rem,7vw,6rem); font-weight:400;line-height:1.05;color:var(--ink);margin-bottom:1.5rem;letter-spacing:0.01em; animation: heroFloat 6s 1s ease-in-out infinite; position:relative;z-index:1; }
  .hero__title em { font-style:italic; background:linear-gradient(120deg, var(--gold-dk) 0%, var(--gold) 30%, var(--gold-shine) 50%, var(--gold) 70%, var(--gold-dk) 100%); -webkit-background-clip:text;-webkit-text-fill-color:transparent; background-clip:text; }
  .hero__desc { font-size:1rem;line-height:1.95;color:var(--ink-lt); max-width:500px;margin:0 auto 2.5rem;letter-spacing:0.02em; position:relative;z-index:1; }
  .hero__pills { display:flex;align-items:center;justify-content:center; gap:0.6rem;flex-wrap:wrap;margin-bottom:3rem; position:relative;z-index:1; }
  .hero__pill { font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase; color:var(--ink-lt);padding:6px 14px; border:1px solid rgba(184,148,42,0.25);border-radius:100px; display:inline-flex;align-items:center;gap:6px; background:rgba(250,247,242,0.8); transition:border-color 0.3s,color 0.3s,background 0.3s,transform 0.15s ease; cursor:default;transform-style:preserve-3d;will-change:transform; }
  .hero__pill:hover { border-color:var(--gold);color:var(--gold-dk);background:var(--white); }
  .hero__pill-dot { width:5px;height:5px;border-radius:50%;background:var(--gold); }
  .hero__cta { display:flex;align-items:center;justify-content:center; gap:1rem;flex-wrap:wrap; position:relative;z-index:1; }

  /* ══════════════════════
     STATS BAR
  ══════════════════════ */
  .stats { display:flex;align-items:stretch;justify-content:center; background:var(--ink);padding:2.5rem 5%; position: relative; z-index: 2; }
  .stats__item { flex:1;text-align:center;padding:1rem 2rem;border-right:1px solid rgba(250,247,242,0.08); }
  .stats__item:last-child { border-right:none; }
  .stats__num { font-family:var(--ff-display);font-size:2.4rem;color:var(--gold-lt); letter-spacing:0.02em;display:block;line-height:1; text-shadow:2px 2px 0 rgba(122,95,16,0.6),4px 4px 0 rgba(184,148,42,0.2); transition:transform 0.3s ease; }
  .stats__item:hover .stats__num { transform:scale(1.08) translateY(-2px); }
  .stats__label { font-size:0.65rem;letter-spacing:0.22em;text-transform:uppercase;color:rgba(250,247,242,0.4);margin-top:0.4rem;display:block;font-weight:500; }

  /* ══════════════════════
     SECTION MODULES
  ══════════════════════ */
  .section-head { text-align:center;margin-bottom:3.5rem; }
  .section-head__eyebrow { font-size:0.65rem;letter-spacing:0.32em;text-transform:uppercase; color:var(--gold-dk);margin-bottom:0.85rem;font-weight:600; display:inline-flex;align-items:center;gap:8px; }
  .section-head__eyebrow::before,.section-head__eyebrow::after { content:'';display:block;width:20px;height:1px;background:var(--gold); }
  .section-head__title { font-family:var(--ff-display);font-size:clamp(2.2rem,4vw,3.2rem);font-weight:400;color:var(--ink);letter-spacing:0.01em; }
  .section-head__line { width:48px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:1rem auto 0;border-radius:2px; }

  /* ══════════════════════
     PRODUCTS & GRID GALLERY
  ══════════════════════ */
  .products { padding:6rem 5%;background:transparent; position: relative; z-index: 1; }
  .products__grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:2rem;max-width:1200px;margin:0 auto; }
  
  .card {
    background:var(--white);border-radius:var(--radius-lg);overflow:hidden;
    box-shadow:var(--shadow-sm);border:1px solid rgba(184,148,42,0.08);
    opacity:0;transform:translateY(24px); transition:box-shadow 0.4s ease;
    transform-style:preserve-3d;will-change:transform;
  }
  .card.visible { animation:cardReveal 0.6s ease forwards; }
  .card:hover { box-shadow:0 20px 50px -12px rgba(184,148,42,0.28),0 8px 20px rgba(26,20,16,0.1); }

  .card__img-wrap { position:relative;overflow:hidden;height:340px;background:var(--cream-dk);cursor:pointer; }
  .card__img { width:100%;height:100%;object-fit:contain;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1); }
  .card:hover .card__img { transform:scale(1.05) translateZ(10px); }
  .card__badge { position:absolute;top:14px;right:14px; background:var(--ink);color:var(--cream); font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase; padding:5px 12px;border-radius:100px; font-weight:600; }
  
  .card__body { padding:1.6rem 1.6rem 1.4rem; text-align: left; }
  .card__name { font-family:var(--ff-serif);font-size:1.45rem;font-weight:500;color:var(--ink);margin-bottom:0.3rem;letter-spacing:0.01em; }
  .card__cat { font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold-dk);margin-bottom:1.1rem;font-weight:600; }
  .card__price { font-family:var(--ff-display);font-size:2rem;font-weight:400;color:var(--teal); }

  /* ══════════════════════
     ABOUT BRAND
  ══════════════════════ */
  .about { padding:7rem 5%;background:transparent;position:relative;overflow:hidden; z-index: 1; }
  .about::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,transparent,var(--gold),var(--gold-lt),var(--gold),transparent); }
  .about__inner { max-width:700px;margin:0 auto;text-align:center; }
  .about__logo { width:72px;height:72px;object-fit:contain;margin-bottom:2rem;filter:drop-shadow(0 4px 16px rgba(184,148,42,0.25)); }
  .about__quote { font-family:var(--ff-display);font-size:1.8rem;font-weight:400; font-style:italic;color:var(--ink);margin:2.5rem 0 1.5rem; line-height:1.5;position:relative;padding:0 2rem; }
  .about__quote::before { content:'"';position:absolute;top:-1.5rem;left:0; font-family:var(--ff-display);font-size:6rem;color:rgba(184,148,42,0.1);line-height:1; }
  .quote-word { display:inline-block; opacity:0;transform:rotateX(90deg);transform-origin:bottom center; transition:opacity 0.5s ease, transform 0.5s ease; margin-right:0.25em; }
  .quote-word.flipped { opacity:1;transform:rotateX(0deg); }
  .about__text { font-size:1rem;line-height:2;color:var(--ink-lt);letter-spacing:0.02em; }
  .about__features { display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem; }
  .about__feature { padding:1.5rem 1rem;border:1px solid rgba(184,148,42,0.15); border-radius:var(--radius-lg);text-align:center;background:var(--cream); transition:border-color 0.3s,background 0.3s,box-shadow 0.3s; transform-style:preserve-3d;will-change:transform;cursor:default; }
  .about__feature:hover { border-color:rgba(184,148,42,0.35);background:var(--white);box-shadow:var(--shadow-sm); }
  .about__feature-icon { font-size:1.75rem;margin-bottom:0.75rem;display:block; }
  .about__feature-title { font-family:var(--ff-serif);font-size:1rem;font-weight:500;color:var(--ink);margin-bottom:0.35rem; }
  .about__feature-desc { font-size:0.78rem;color:var(--ink-lt);line-height:1.7; }

  /* ══════════════════════
     FOOTER MODULE COMPONENT UNITS
  ══════════════════════ */
  .footer { background:var(--ink);color:rgba(250,247,242,0.65);text-align:center;padding:5rem 5% 3rem;position:relative; z-index: 2; }
  .footer::before { content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold-dk),var(--gold),var(--gold-dk),transparent); }
  .footer__logo { width:56px;height:56px;object-fit:contain;margin-bottom:1.5rem;filter:brightness(10) sepia(1) saturate(2) hue-rotate(5deg);opacity:0.75; }
  .footer__name { font-family:var(--ff-display);font-size:2.4rem;font-weight:400; letter-spacing:0.08em;margin-bottom:0.4rem; background:linear-gradient(120deg, var(--gold-lt) 0%, var(--gold-shine) 30%, var(--white) 50%, var(--gold-shine) 70%, var(--gold-lt) 100%); background-size:300% 100%; -webkit-background-clip:text;-webkit-text-fill-color:transparent; background-clip:text; animation:footerShimmer 5s ease-in-out infinite; }
  .footer__tagline { font-size:0.62rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(250,247,242,0.3);margin-bottom:3rem;font-weight:500; }
  .footer__divider { width:60px;height:1px;background:linear-gradient(90deg,transparent,rgba(184,148,42,0.5),transparent);margin:0 auto 2.5rem; }
  .footer__contact { display:flex;align-items:center;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:3rem; }
  .footer__contact-item { display:flex;align-items:center;gap:8px;font-size:0.82rem;color:rgba(250,247,242,0.55);letter-spacing:0.05em;text-decoration:none;transition:color 0.2s; }
  .footer__contact-item:hover { color:var(--gold-lt); }
  .footer__contact-sep { width:1px;height:20px;background:rgba(250,247,242,0.1); }
  .footer__copy { font-size:0.62rem;letter-spacing:0.14em;color:rgba(250,247,242,0.2);text-transform:uppercase;padding-top:2rem;border-top:1px solid rgba(250,247,242,0.06); }

  .fab-wrap { position:fixed;bottom:1.75rem;right:1.75rem;z-index:99; }
  .fab { position:relative;z-index:1; display:flex;align-items:center;gap:8px; background:linear-gradient(135deg,#1FAD54,#25D366); color:var(--white);font-family:var(--ff-sans);font-size:0.7rem; letter-spacing:0.14em;text-transform:uppercase;text-decoration:none; padding:13px 22px;border-radius:100px;font-weight:600; box-shadow:0 4px 20px rgba(37,211,102,0.4); }

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
    .card { transform-style:flat; }
    .detail-route-card { grid-template-columns:1fr; }
  }
`;

/* ── Liquid Dynamic Silk Waves Background Engine ── */
function LuxuryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => { if (canvas) { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; } };
    const handleMouseMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    let waves = [
      { y: height * 0.35, speed: 0.004, amplitude: 35, wavelength: 0.002, color: "rgba(184, 148, 42, 0.05)" },
      { y: height * 0.55, speed: 0.006, amplitude: 50, wavelength: 0.0015, color: "rgba(232, 212, 138, 0.04)" },
      { y: height * 0.75, speed: 0.003, amplitude: 40, wavelength: 0.0025, color: "rgba(184, 148, 42, 0.06)" }
    ];
    let count = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      count += 1;

      waves.forEach((wave) => {
        ctx.beginPath();
        for (let i = 0; i < width; i += 2) {
          let sineOffset = Math.sin(i * wave.wavelength + count * wave.speed);
          let yPos = wave.y + sineOffset * wave.amplitude;

          let dx = mouse.x - i;
          let dy = mouse.y - yPos;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 220) {
            let force = (1 - distance / 220) * 35;
            yPos += (dy / (distance || 1)) * -force;
          }

          if (i === 0) ctx.moveTo(i, yPos);
          else ctx.lineTo(i, yPos);
        }
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => { window.removeEventListener("resize", handleResize); window.removeEventListener("mousemove", handleMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);

  return <canvas ref={canvasRef} className="luxury-bg-canvas" />;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* ── Amazon Shareable Link Route Param Mapping Sync ── */
  useEffect(() => {
    const handleRouting = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const itemId = urlParams.get("item");
      if (itemId && products.length > 0) {
        const foundItem = products.find(p => (p._id || p.id) === itemId);
        if (foundItem) setSelectedProduct(foundItem);
      } else {
        setSelectedProduct(null);
      }
    };
    handleRouting();
    window.addEventListener("popstate", handleRouting);
    return () => window.removeEventListener("popstate", handleRouting);
  }, [products]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((d) => { setProducts(d); setLoading(false); })
      .catch(() => setTimeout(() => setLoading(false), 2000));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Intersection Animation Observers */
  useEffect(() => {
    if (loading || products.length === 0) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.05 });
    document.querySelectorAll(".card, .reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, products]);

  const clickOpenProduct = (product) => {
    const id = product._id || product.id;
    const shareLink = `${window.location.pathname}?item=${id}`;
    window.history.pushState({ path: shareLink }, "", shareLink);
    setSelectedProduct(product);
  };

  const clickCloseProduct = () => {
    const cleanUrl = window.location.pathname;
    window.history.pushState({ path: cleanUrl }, "", cleanUrl);
    setSelectedProduct(null);
    setCopied(false);
  };

  const copyProductShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const doLogin = useCallback(() => {
    if (password === "Bunny@MaaTarang") {
      setIsAdmin(true); setShowAdmin(false); setPassword("");
    } else {
      alert("Incorrect password. Please try again.");
    }
  }, [password]);

  if (loading) {
    return (
      <div className="loader">
        <style>{css}</style>
        <img src={logo} alt="MaaTarang" className="loader__logo" />
        <h1 className="loader__title">MaaTarang</h1>
        <div className="loader__bar"><div className="loader__bar-fill" /></div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <LuxuryBackground />

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
          <li><button className="nav__btn" onClick={() => setShowAdmin(true)}>Admin</button></li>
        </ul>
        <button className={`nav__hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu Expansion Drawer */}
      <ul className={`nav__mobile${menuOpen ? " open" : ""}`}>
        {["Home", "Collection", "About"].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} className="nav__link" onClick={() => setMenuOpen(false)}>{item}</a>
          </li>
        ))}
        <li><button className="nav__btn" onClick={() => { setShowAdmin(true); setMenuOpen(false); }}>Admin</button></li>
      </ul>

      {/* ── Secure Admin Layer Entry Gate Modal ── */}
      {showAdmin && (
        <div className="modal-overlay" onClick={() => setShowAdmin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__icon">🔐</div>
            <h2 className="modal__title">Admin Entry</h2>
            <p className="modal__sub">Enter verified passcode parameters</p>
            <div className="modal__divider" />
            <div className="field-wrap">
              <input 
                type="password" placeholder="Passkey" value={password} 
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doLogin()} className="field" autoFocus 
              />
            </div>
            <button className="btn-primary" onClick={doLogin}>Authenticate</button>
            <button className="btn-ghost" onClick={() => setShowAdmin(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Full Dashboard Desk Operation Center ── */}
      {isAdmin && (
        <div className="admin">
          <div className="admin__header">
            <div className="admin__icon">⚙️</div>
            <div>
              <h2 className="admin__title">Admin Dashboard</h2>
              <p className="admin__sub">Manage your active products inventory</p>
            </div>
          </div>
          <div className="admin__divider" />
          <div className="admin__grid">
            <div className="admin__row">
              <div className="field-wrap">
                <label className="field-label">Design Name</label>
                <input type="text" placeholder="e.g. Bridal Blouse" value={newName} onChange={e => setNewName(e.target.value)} className="field" />
              </div>
              <div className="field-wrap">
                <label className="field-label">Price Indicator (₹)</label>
                <input type="number" placeholder="e.g. 2500" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="field" />
              </div>
            </div>
            <div className="field-wrap">
              <label className="field-label">Category Group Tag</label>
              <input type="text" placeholder="e.g. Maggam Embroidery" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="field" />
            </div>
            <div className="field-wrap">
              <label className="field-label">Select Media File</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="field" />
            </div>
            <button 
              className="btn-primary" disabled={uploading}
              onClick={async () => {
                if (!newName || !newPrice || !newCategory || !imageFile) return alert("Please fill all properties.");
                setUploading(true);
                try {
                  const fd = new FormData(); fd.append("image", imageFile);
                  const resU = await fetch(`${API_URL}/upload`, { method: "POST", body: fd });
                  const dataU = await resU.json();
                  await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: newName, price: Number(newPrice), category: newCategory, image: dataU.imageUrl }),
                  });
                  alert("Product successfully cataloged ✓");
                  window.location.reload();
                } catch { alert("Failed cataloging operation."); } finally { setUploading(false); }
              }}
            >
              {uploading ? "Uploading Parameters..." : "Add Product To Live Collection"}
            </button>
          </div>
        </div>
      )}

      {/* ── Classic Editorial Hero Presentation ── */}
      <section className="hero">
        <div className="hero__bg" />
        <p className="hero__eyebrow">Handcrafted in India</p>
        <h1 className="hero__title">Wear the art of <br /><em>timeless craft</em></h1>
        <p className="hero__desc">Discover handcrafted embroidery, custom boutique blouses, detailed maggam work, and ancestral textile artistry.</p>
        <div className="hero__pills">
          {["Traditional Embroidery", "Maggam Work", "Bespoke Artistry", "Designer Blouses"].map((pill) => (
            <span key={pill} className="hero__pill"><span className="hero__pill-dot" />{pill}</span>
          ))}
        </div>
        <div className="hero__cta">
          <a href="https://wa.me/917780646402" target="_blank" rel="noopener noreferrer">
            <button className="btn-wa" style={{ width: "auto", padding: "13px 32px" }}>
              <WaIcon /> Order on WhatsApp
            </button>
          </a>
          <a href="#products" className="btn-outline">Browse Live Inventory</a>
        </div>
      </section>

      {/* ── Metric Stats Block ── */}
      <div className="stats">
        {[
          { num: "500+", label: " Bespoke Designs" },
          { num: "12+", label: "Years of Craft" },
          { num: "100%", label: "Handmade" },
          { num: "∞", label: "Custom Customization" }
        ].map((s) => (
          <div className="stats__item" key={s.label}>
            <span className="stats__num">{s.num}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Products Display Loop Grid Module ── */}
      <section className="products" id="products">
        <div className="section-head reveal">
          <p className="section-head__eyebrow">Our Collection</p>
          <h2 className="section-head__title">Featured Designs</h2>
          <div className="section-head__line" />
        </div>
        <div className="products__grid">
          {products.map((product) => (
            <div key={product._id || product.id} className="card" onClick={() => clickOpenProduct(product)}>
              <div className="card__img-wrap">
                <img src={product.image} alt={product.name} className="card__img" />
                <span className="card__badge">{product.category}</span>
              </div>
              <div className="card__body">
                <h3 className="card__name">{product.name}</h3>
                <p className="card__cat">{product.category}</p>
                <div className="card__price">₹{product.price}/-</div>
                {isAdmin && (
                  <button 
                    className="btn-delete"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!window.confirm(`Permanently remove "${product.name}" from servers?`)) return;
                      try {
                        await fetch(`${API_URL}/products/${product._id || product.id}`, { method: "DELETE" });
                        window.location.reload();
                      } catch { alert("Deletion dropped."); }
                    }}
                  >✕ Wipe Product</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Flipkart/Amazon Shareable Navigation Modal Overlay Sheet ── */}
      {selectedProduct && (
        <div className="detail-route-view" onClick={(e) => e.target === e.currentTarget && clickCloseProduct()}>
          <div className="detail-route-card">
            <div className="detail-route__gallery">
              <button className="detail-route__close" onClick={clickCloseProduct}>✕</button>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail-route__img" />
            </div>
            <div className="detail-route__content">
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-dk)", fontWeight: "700" }}>{selectedProduct.category}</span>
              <h2 style={{ fontFamily: "var(--ff-serif)", fontSize: "2.2rem", margin: "0.5rem 0 1.25rem", color: "var(--ink)", fontWeight: "400" }}>{selectedProduct.name}</h2>
              <div style={{ fontFamily: "var(--ff-display)", fontSize: "2.4rem", color: "var(--teal)", marginBottom: "2rem" }}>₹{selectedProduct.price}/-</div>
              
              <p style={{ color: "var(--ink-lt)", lineHeight: "1.8", fontSize: "0.95rem", marginBottom: "2rem" }}>
                This exclusive garment is fully tailored and hand-configured to exact customer measurements. Created explicitly from high-grade premium materials by historical regional masters.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a 
                  href={`https://wa.me/917780646402?text=Hello MaaTarang, I would like to complete an order request for this design: ${encodeURIComponent(selectedProduct.name)} (Ref URL ID: ${selectedProduct._id || selectedProduct.id})`}
                  target="_blank" rel="noreferrer" className="btn-wa-large"
                >
                  <WaIcon /> Purchase via WhatsApp
                </a>
                
                <button className="detail-route__share-btn" onClick={copyProductShareLink}>
                  {copied ? "✓ Link Copied to Clipboard" : "🔗 Copy Shareable Product Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Story Section Panel ── */}
      <section className="about" id="about">
        <div className="about__inner reveal">
          <div className="section-head">
            <p className="section-head__eyebrow">Our Story</p>
            <h2 className="section-head__title">About MaaTarang</h2>
            <div className="section-head__line" />
          </div>
          <img src={logo} alt="MaaTarang" className="about__logo" />
          <p className="about__text">
            MaaTarang celebrates traditional craftsmanship through tailored expressions, intricate hand-run maggam arrays, and bridal luxury configurations passed lovingly down structural generations.
          </p>
        </div>
      </section>

      {/* ── Multi-Column Premium Luxury Footer ── */}
      <footer className="footer" id="contact">
        <div className="footer__contact" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", maxWidth: "1200px", margin: "0 auto 3rem", textAlign: "left" }}>
          <div>
            <div className="footer__name" style={{ background: "none", webkitTextFillColor: "var(--gold-lt)", color: "var(--gold-lt)", fontSize: "1.8rem" }}>MaaTarang</div>
            <p style={{ fontSize: "0.85rem", color: "rgba(250,247,242,0.4)", lineHeight: "1.6", marginTop: "0.5rem" }}>Luxury boutique creations matching timeless regional heritage contexts.</p>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Studio</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
              <li><a href="#about" style={{ color: "rgba(250,247,242,0.5)", textDecoration: "none" }}>Our Story</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Collections</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
              <li><a href="#products" style={{ color: "rgba(250,247,242,0.5)", textDecoration: "none" }}>Maggam Work</a></li>
              <li><a href="#products" style={{ color: "rgba(250,247,242,0.5)", textDecoration: "none" }}>Bespoke Blouses</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "#FFF", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>Support</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.88rem" }}>
              <li><a href="#" style={{ color: "rgba(250,247,242,0.5)", textDecoration: "none" }}>Inquiries Desk</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__contact-strip" style={{ background: "#1F1B18", border: "1px solid rgba(184, 148, 42, 0.15)", borderRadius: "12px", padding: "1.75rem", maxWidth: "1200px", margin: "0 auto 2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(184,148,42,0.1)", borderRadius: "6px", display: "flex", alignBehaviors: "center", alignItems: "center", justifyContent: "center", color: "var(--gold-lt)" }}>📞</div>
            <div>
              <div style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "var(--gold-lt)", letterSpacing: "0.1em" }}>Direct Phone</div>
              <a href="tel:+917780646402" style={{ color: "#FFF", textDecoration: "none", fontSize: "0.9rem" }}>+91 77806 46402</a>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(184,148,42,0.1)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-lt)" }}>✉️</div>
            <div>
              <div style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "var(--gold-lt)", letterSpacing: "0.1em" }}>Artisanal Inbox</div>
              <a href="mailto:hello@maatarang.com" style={{ color: "#FFF", textDecoration: "none", fontSize: "0.9rem" }}>hello@maatarang.com</a>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "40px", height: "40px", background: "rgba(184,148,42,0.1)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-lt)" }}>📍</div>
            <div>
              <div style={{ fontSize: "0.62rem", textTransform: "uppercase", color: "var(--gold-lt)", letterSpacing: "0.1em" }}>Bespoke Workspace</div>
              <div style={{ color: "#FFF", fontSize: "0.9rem" }}>Hyderabad, India</div>
            </div>
          </div>
        </div>
        <p className="footer__copy">© 2026 MAATARANG · Bespoke Atelier · ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Floating Action Button Nodes */}
      <div className="fab-wrap">
        <a href="https://wa.me/917780646402" target="_blank" rel="noreferrer" className="fab">
          <WaIcon /> WhatsApp Us
        </a>
      </div>
    </>
  );
}
