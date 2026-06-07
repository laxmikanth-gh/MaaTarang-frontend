import { useEffect, useState, useRef, useCallback } from "react";
import logo from "./assets/logo.png";

const API_URL = "https://maatarang-backend.onrender.com";

/* ═══════════════════════════════════════════════════════════════
   CSS  — Mid-Dark Luxury UI with Smooth Animation Overlays
═══════════════════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold:        #B8942A;
    --gold-lt:     #E8D48A;
    --gold-dk:     #7A5F10;
    --gold-shine:  #F5E6A3;
    --luxury-bg:   #141210; /* Sophisticated Mid-Dark Velvet Espresso tone */
    --card-bg:     rgba(28, 25, 22, 0.65); /* Elegant glass-tinted card container */
    --ink:         #FAF7F2; /* Creamy White text for ultimate dark mode readability */
    --ink-md:      #E8E2DA;
    --ink-lt:      #B3A798;
    --teal:        #1ABC9C;
    --white:       #1F1B18;
    --shadow-sm:   0 4px 30px rgba(0, 0, 0, 0.4);
    --shadow-lg:   0 20px 50px rgba(0, 0, 0, 0.6);
    --ff-display:  'DM Serif Display', Georgia, serif;
    --ff-serif:    'Playfair Display', Georgia, serif;
    --ff-sans:     'DM Sans', sans-serif;
    --radius:      8px;
    --radius-lg:   16px;
    --transition:  all 0.45s cubic-bezier(0.25, 1, 0.5, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--ff-sans);
    background: var(--luxury-bg);
    color: var(--ink);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    position: relative;
  }

  /* Luxury noise overlay */
  body::after {
    content: '';
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 9999; opacity: 0.6;
  }

  /* Fixed Mid-Dark Interactive Background Canvas */
  .luxury-bg-canvas {
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 0; pointer-events: none;
    background: var(--luxury-bg);
  }

  /* ══════════════════════
     NAVBAR
  ══════════════════════ */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(20, 18, 16, 0.75);
    backdrop-filter: blur(24px) saturate(140%);
    -webkit-backdrop-filter: blur(24px) saturate(140%);
    border-bottom: 1px solid rgba(184, 148, 42, 0.15);
    padding: 0 6%; display: flex; align-items: center; justify-content: space-between;
    height: 84px; transition: var(--transition);
  }
  .nav.scrolled { height: 70px; background: rgba(14, 12, 10, 0.9); }
  .nav__brand { display: flex; align-items: center; gap: 0.9rem; text-decoration: none; }
  .nav__logo { width: 44px; height: 44px; transform-style: preserve-3d; transition: transform 0.5s ease; }
  .nav__brand:hover .nav__logo { transform: perspective(300px) rotateY(30deg) scale(1.08); }
  .nav__name { font-family: var(--ff-display); font-size: 1.65rem; color: var(--ink); letter-spacing: 0.05em; }
  .nav__tagline { font-size: 0.6rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold-lt); }
  .nav__links { display: flex; align-items: center; gap: 2.8rem; list-style: none; }
  .nav__link { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-md); text-decoration: none; position: relative; font-weight: 600; }
  .nav__link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1.5px; background: var(--gold-lt); transition: width 0.3s; }
  .nav__link:hover::after { width: 100%; }
  .nav__btn { font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold-lt); background: transparent; border: 1.5px solid rgba(184,148,42,0.4); padding: 9px 22px; cursor: pointer; border-radius: var(--radius); transition: var(--transition); }
  .nav__btn:hover { background: var(--gold); color: #111; border-color: var(--gold); }

  /* ══════════════════════
     HERO & SECTIONS
  ══════════════════════ */
  .hero { position: relative; text-align: center; padding: 10rem 5% 9rem; background: transparent; z-index: 1; }
  .hero__eyebrow { font-size: 0.65rem; letter-spacing: 0.45em; text-transform: uppercase; color: var(--gold-lt); margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 12px; }
  .hero__eyebrow::before, .hero__eyebrow::after { content:''; display:block; width:30px; height:1px; background:var(--gold); }
  .hero__title { font-family: var(--ff-display); font-size: clamp(3.2rem, 7.5vw, 6rem); color: var(--ink); line-height: 1.1; margin-bottom: 1.5rem; }
  .hero__title em { font-style: italic; background: linear-gradient(120deg, var(--gold-lt), var(--gold-shine), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero__desc { font-size: 1.05rem; line-height: 2; color: var(--ink-lt); max-width: 540px; margin: 0 auto 3rem; }
  
  .hero__pill { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-md); padding: 8px 18px; border: 1px solid rgba(184,148,42,0.25); border-radius: 100px; background: rgba(28, 25, 22, 0.4); backdrop-filter: blur(8px); margin: 0 0.35rem; display: inline-flex; align-items: center; gap: 6px; }
  .hero__pill-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gold-lt); }

  /* ══════════════════════
     PRODUCTS GRID & CARDS
  ══════════════════════ */
  .products { padding: 6rem 5%; background: transparent; position: relative; z-index: 1; }
  .products__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 2.5rem; max-width: 1200px; margin: 0 auto; }
  
  .card {
    background: var(--card-bg); border-radius: var(--radius-lg); overflow: hidden;
    border: 1px solid rgba(184, 148, 42, 0.12); backdrop-filter: blur(12px);
    box-shadow: var(--shadow-sm); opacity: 0; transform: translateY(30px);
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s, border-color 0.5s;
    cursor: pointer; text-decoration: none; color: inherit; display: block;
  }
  .card.visible { opacity: 1; transform: translateY(0); }
  .card:hover {
    transform: translateY(-10px); border-color: rgba(184, 148, 42, 0.4);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(184, 148, 42, 0.1);
  }

  .card__img-wrap { position: relative; overflow: hidden; height: 360px; background: #1A1715; }
  .card__img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.6s var(--transition); }
  .card:hover .card__img { transform: scale(1.05); }
  .card__badge { position: absolute; top: 14px; right: 14px; background: rgba(184,148,42,0.9); color: #111; font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; font-weight: 700; }
  
  .card__body { padding: 1.75rem; }
  .card__name { font-family: var(--ff-serif); font-size: 1.4rem; font-weight: 500; color: var(--ink); margin-bottom: 0.35rem; }
  .card__cat { font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold-lt); margin-bottom: 1.2rem; }
  .card__price { font-family: var(--ff-display); font-size: 2rem; color: var(--gold-shine); }

  /* ══════════════════════
     PRODUCT DETAIL ROUTE MODAL VIEWER
  ══════════════════════ */
  .detail-view { position: fixed; inset: 0; z-index: 200; background: rgba(12, 11, 10, 0.92); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; padding: 2rem; animation: fadeIn 0.4s ease; }
  .detail-card { background: #1C1917; border: 1px solid rgba(184, 148, 42, 0.2); max-width: 960px; width: 100%; border-radius: var(--radius-lg); display: grid; grid-template-columns: 1.1fr 0.9fr; overflow: hidden; box-shadow: var(--shadow-lg); animation: modalUp 0.5s cubic-bezier(0.25, 1, 0.5, 1); }
  .detail__gallery { background: #141211; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; min-height: 450px; }
  .detail__img { max-width: 100%; max-height: 480px; object-fit: contain; }
  .detail__content { padding: 3.5rem 3rem; display: flex; flex-direction: column; justify-content: center; }
  .detail__close { position: absolute; top: 2rem; right: 2rem; background: transparent; border: none; color: var(--ink-lt); font-size: 1.5rem; cursor: pointer; transition: color 0.2s; }
  .detail__close:hover { color: var(--gold-lt); }

  /* ══════════════════════
     UPGRADED AUDIO / TEXT ABOUT
  ══════════════════════ */
  .about { padding: 8.5rem 6%; background: transparent; position: relative; z-index: 1; }
  .about__layout { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 4rem; max-width: 1200px; margin: 0 auto; }
  .about__title-mockup { font-family: var(--ff-serif); font-size: clamp(2.5rem, 4.5vw, 3.4rem); color: var(--ink); line-height: 1.2; }
  .about__title-mockup em { font-style: normal; color: var(--gold-lt); }
  .about__text { font-size: 1.05rem; line-height: 2.1; color: var(--ink-lt); }

  /* ══════════════════════
     PREMIUM FOOTER STRIP
  ══════════════════════ */
  .footer-premium { background: #0A0908; color: #8C8C8C; padding: 6rem 6% 3rem; position: relative; z-index: 2; border-top: 1px solid rgba(184, 148, 42, 0.1); }
  .footer__grid-columns { display: grid; grid-template-columns: 1.3fr repeat(4, 1fr); gap: 3rem; max-width: 1200px; margin: 0 auto 4rem; }
  .footer__brand-title { font-family: var(--ff-display); font-size: 1.6rem; color: var(--gold-lt); letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .footer__column-title { font-size: 0.82rem; letter-spacing: 0.2em; text-transform: uppercase; color: #FFF; margin-bottom: 1.5rem; font-weight: 700; }
  .footer__column-links { list-style: none; display: flex; flex-direction: column; gap: 0.85rem; }
  .footer__column-link { font-size: 0.88rem; color: #8C8C8C; text-decoration: none; transition: color 0.2s; }
  .footer__column-link:hover { color: var(--gold-lt); }
  
  .footer__contact-strip { background: #110F0E; border: 1px solid rgba(184, 148, 42, 0.08); border-radius: var(--radius-lg); padding: 2rem; max-width: 1200px; margin: 0 auto 4rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .footer__strip-item { display: flex; align-items: center; gap: 1rem; }
  .footer__strip-icon-wrapper { width: 44px; height: 44px; border-radius: var(--radius); background: #1A1715; border: 1px solid rgba(184,148,42,0.15); display: flex; align-items: center; justify-content: center; color: var(--gold-lt); }
  .footer__strip-label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-lt); margin-bottom: 2px; font-weight: 700; }
  .footer__strip-value { font-size: 0.92rem; color: #FFF; text-decoration: none; }

  /* Buttons */
  .btn-premium-gold { display: inline-flex; align-items: center; justify-content: center; font-family: var(--ff-sans); font-size: 0.72rem; letter-spacing: 0.16em; text-transform: uppercase; color: #111; font-weight: 600; padding: 14px 32px; border: none; border-radius: var(--radius); cursor: pointer; text-decoration: none; background: linear-gradient(135deg, #E8D48A 0%, #B8942A 100%); transition: transform 0.3s, box-shadow 0.3s; }
  .btn-premium-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(184, 148, 42, 0.4); }
  .btn-wa-large { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; border-radius: var(--radius); background: #25D366; color: #FFF; border: none; font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; text-decoration: none; cursor: pointer; transition: var(--transition); }
  .btn-wa-large:hover { background: #20BA56; transform: translateY(-2px); box-shadow: 0 10px 25px rgba(37,211,102,0.3); }

  .fab-wrap { position:fixed; bottom:2rem; right:2rem; z-index:99; }
  .fab { display:flex; align-items:center; gap:8px; background: linear-gradient(135deg,#1FAD54,#25D366); color:#FFF; font-size:0.7rem; letter-spacing:0.14em; text-transform:uppercase; text-decoration:none; padding:14px 24px; border-radius:100px; font-weight:600; box-shadow:0 4px 20px rgba(37,211,102,0.35); transition: transform 0.3s; }
  .fab:hover { transform:translateY(-4px); }

  .section-head { text-align:center; margin-bottom:4rem; }
  .section-head__title { font-family: var(--ff-display); font-size: clamp(2.4rem, 4.5vw, 3.2rem); background: linear-gradient(135deg, #FFF 40%, var(--gold-lt) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  @media (max-width: 992px) {
    .about__layout { grid-template-columns: 1fr; gap: 2.5rem; text-align: center; }
    .footer__grid-columns { grid-template-columns: 1fr repeat(2, 1fr); gap: 2.5rem; }
    .footer__contact-strip { grid-template-columns: 1fr; gap: 1.5rem; }
    .detail-card { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .nav__links { display:none; }
    .footer__grid-columns { grid-template-columns: 1fr; text-align: center; }
  }
`;

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

/* ══════════════════════════════════════════════════════════════
   UPGRADED INTERACTIVE CONSTELLATION SILK THREAD NETWORK
══════════════════════════════════════════════════════════════ */
function LuxuryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, maxDist: 180 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Create intricate interactive thread nodes
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const nodes = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and translate nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Boundary safety check
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse Magnet attraction logic
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            // Smoothly draw nodes slightly towards pointer context
            n.x += (dx / dist) * 0.25;
            n.y += (dy / dist) * 0.25;
          }
        }

        // Render standalone shimmering stardust node points
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232, 212, 138, 0.4)";
        ctx.fill();
      });

      // 2. Connect intersections to spin elegant lace lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distVecX = nodes[i].x - nodes[j].x;
          const distVecY = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(distVecX * distVecX + distVecY * distVecY);

          if (distance < 130) {
            const opacity = (1 - distance / 130) * 0.16;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            // Splendid luxury gold lace weave overlay
            ctx.strokeStyle = `rgba(184, 148, 42, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
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
  const [imageFile, setImageFile]   = useState(null);
  const [uploading, setUploading]   = useState(false);

  /* ── URL Parameter Navigation Monitor (Detail Routing Router) ── */
  useEffect(() => {
    const checkUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const productId = params.get("product");
      if (productId && products.length > 0) {
        const found = products.find(p => (p._id || p.id) === productId);
        if (found) setSelectedProduct(found);
      } else {
        setSelectedProduct(null);
      }
    };
    checkUrlParams();
    window.addEventListener("popstate", checkUrlParams);
    return () => window.removeEventListener("popstate", checkUrlParams);
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

  /* Intersection Observer Animation Hooks */
  useEffect(() => {
    if (loading || products.length === 0) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.05 });
    document.querySelectorAll(".card, .reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, products]);

  const openProductDetails = (product) => {
    const id = product._id || product.id;
    const newUrl = `${window.location.pathname}?product=${id}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    const cleanUrl = window.location.pathname;
    window.history.pushState({ path: cleanUrl }, "", cleanUrl);
    setSelectedProduct(null);
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
        <h1 style={{ color: "var(--gold-lt)", fontFamily: "var(--ff-display)", letterSpacing: "0.1em" }}>MaaTarang</h1>
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
          <img src={logo} alt="Logo" className="nav__logo" />
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
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <span className="hero__eyebrow">Handcrafted in India</span>
        <h1 className="hero__title">Wear the art of <br /><em>timeless craft</em></h1>
        <p className="hero__desc">Discover handcrafted embroidery, boutique bespoke blouses, intricate maggam accents, and master artisanal designs.</p>
        <div>
          <span className="hero__pill"><span className="hero__pill-dot" />Maggam Embroidery</span>
          <span className="hero__pill"><span className="hero__pill-dot" />Designer Heritage</span>
        </div>
      </section>

      {/* ── Products Display Collection ── */}
      <section className="products" id="products">
        <div className="section-head reveal">
          <h2 className="section-head__title">Featured Collections</h2>
        </div>
        <div className="products__grid">
          {products.map((product) => (
            <div key={product._id || product.id} className="card" onClick={() => openProductDetails(product)}>
              <div className="card__img-wrap">
                <img src={product.image} alt={product.name} className="card__img" />
                <span className="card__badge">{product.category}</span>
              </div>
              <div className="card__body">
                <h3 className="card__name">{product.name}</h3>
                <p className="card__cat">{product.category}</p>
                <div className="card__price">₹{product.price}/-</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dynamic Route Product Detail Overlay View ── */}
      {selectedProduct && (
        <div className="detail-view" onClick={(e) => e.target === e.currentTarget && closeProductDetails()}>
          <div className="detail-card">
            <div className="detail__gallery">
              <button className="detail__close" onClick={closeProductDetails}>✕</button>
              <img src={selectedProduct.image} alt={selectedProduct.name} className="detail__img" />
            </div>
            <div className="detail__content">
              <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-lt)" }}>{selectedProduct.category}</span>
              <h2 style={{ fontFamily: "var(--ff-serif)", fontSize: "2.2rem", margin: "0.5rem 0 1.5rem", fontWeight: "400" }}>{selectedProduct.name}</h2>
              <div style={{ fontFamily: "var(--ff-display)", fontSize: "2.5rem", color: "var(--gold-shine)", marginBottom: "2rem" }}>₹{selectedProduct.price}/-</div>
              <p style={{ color: "var(--ink-lt)", lineHeight: "1.8", marginBottom: "2.5rem", fontSize: "0.95rem" }}>
                This masterpiece is carefully configured and fully handcrafted to individual measurement specifications. Features premium traditional textile work tailored exclusively by senior artisans.
              </p>
              <a 
                href={`https://wa.me/917780646402?text=Hello MaaTarang, I am deeply interested in purchasing your bespoke design: ${encodeURIComponent(selectedProduct.name)} (Ref: ${selectedProduct._id || selectedProduct.id})`}
                target="_blank" rel="noreferrer" className="btn-wa-large"
              >
                <WaIcon /> Complete Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Upgraded Editorial Layout About ── */}
      <section className="about" id="about">
        <div className="about__layout reveal">
          <div>
            <h2 className="about__title-mockup">Crafting <em>Excellence</em> Since 2014</h2>
          </div>
          <div>
            <p className="about__text">
              MaaTarang celebrates heritage artistry by creating meticulously configured bespoke garments. Every thread and structural element inside our collection acts as an extension of high-fashion culture, providing authentic luxury for modern statements.
            </p>
          </div>
        </div>
      </section>

      {/* ── Multi-Column Premium Luxury Footer ── */}
      <footer className="footer-premium" id="contact">
        <div className="footer__grid-columns">
          <div>
            <div className="footer__brand-title">MaaTarang</div>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-lt)", lineHeight: "1.6" }}>Luxury textiles and artisanal creations configured for discerning wardrobes.</p>
          </div>
          <div>
            <h4 className="footer__column-title">Company</h4>
            <ul className="footer__column-links">
              <li><a href="#about" className="footer__column-link">About Us</a></li>
              <li><a href="#" className="footer__column-link">Artisans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__column-title">Products</h4>
            <ul className="footer__column-links">
              <li><a href="#products" className="footer__column-link">Maggam Work</a></li>
              <li><a href="#products" className="footer__column-link">Bridal Blouses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__column-title">Support</h4>
            <ul className="footer__column-links">
              <li><a href="#" className="footer__column-link">Inquiries</a></li>
              <li><a href="#" className="footer__column-link">Sizing Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer__column-title">Legal</h4>
            <ul className="footer__column-links">
              <li><a href="#" className="footer__column-link">Privacy Statement</a></li>
            </ul>
          </div>
        </div>

        {/* Info Contact Ribbon Blocks */}
        <div className="footer__contact-strip">
          <div className="footer__strip-item">
            <div className="footer__strip-icon-wrapper">📞</div>
            <div>
              <div className="footer__strip-label">Phone Context</div>
              <div className="footer__strip-value">+91 77806 46402</div>
            </div>
          </div>
          <div className="footer__strip-item">
            <div className="footer__strip-icon-wrapper">✉️</div>
            <div>
              <div className="footer__strip-label">Direct Inbox</div>
              <div className="footer__strip-value">hello@maatarang.com</div>
            </div>
          </div>
          <div className="footer__strip-item">
            <div className="footer__strip-icon-wrapper">📍</div>
            <div>
              <div className="footer__strip-label">Bespoke Studio</div>
              <div className="footer__strip-value">Hyderabad, India</div>
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.65rem", color: "#444" }}>© 2026 MAATARANG. ALL RIGHTS RESERVED.</p>
      </footer>

      {/* Admin Modal Overlay Trigger Box */}
      {showAdmin && (
        <div className="modal-overlay" onClick={() => setShowAdmin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1rem", color: "#111" }}>Security Check</h3>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passkey" style={{ width: "100%", padding: "10px", marginBottom: "1rem" }} />
            <button className="btn-premium-gold" onClick={doLogin}>Verify Entry</button>
          </div>
        </div>
      )}

      <div className="fab-wrap">
        <a href="https://wa.me/917780646402" target="_blank" rel="noreferrer" className="fab"><WaIcon /> Connect with Us</a>
      </div>
    </>
  );
}
