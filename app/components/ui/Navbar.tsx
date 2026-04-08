'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Tracks', href: '#tracks' },
  { name: 'Timeline', href: '#timeline' },
  { name: 'Sponsors', href: '#sponsors' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [ctaPressed, setCtaPressed] = useState(false);
  const [mouseX, setMouseX] = useState(0.5);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const t = useRef(0);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Scroll tracking — always visible, but condense when scrolled down
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsVisible(true);
          setScrolled(y > 100);
          setScrollProgress(Math.min(1, y / 400));
          ticking = false;
        });
        ticking = true;
      }
    };
    
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse parallax
  useEffect(() => {
    let ticking = false;
    const handleMouse = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMouseX(e.clientX / window.innerWidth);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Floating animation (Optimized: Direct DOM manipulation prevents 60fps re-renders)
  const floatInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tick = (timestamp: number) => {
      t.current = timestamp;
      if (floatInnerRef.current) {
        const floatY = Math.sin(timestamp / 2800) * 2.5;
        floatInnerRef.current.style.transform = `translateY(${floatY}px) translateZ(0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // JS-computed dynamic values (cannot be static Tailwind)
  // Reduced transparency: Higher base and max values
  const blurAmount = 18 + scrollProgress * 14;
  const marginTop = scrolled ? 10 : 20;
  const sweepX = mouseX * 130 - 15;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-24'
        } gpu-accelerate`}
      >
        {/* ── Inner wrapper separating the continuous float from the entry transition ── */}
        <div ref={floatInnerRef} className="w-full flex justify-center will-change-transform">
        {/* Width constrainer */}
        <div
          className="container-main pointer-events-auto transition-[margin] duration-500"
          style={{ marginTop }}
        >
          {/* ── OUTER AURA (Layer 0) ── */}
          <div
            className="absolute -inset-x-3 rounded-[80px] pointer-events-none blur-[12px] [animation:goldPulse_4s_ease-in-out_infinite]"
            style={{
              top: '-8px',
              bottom: '-8px',
              background: 'radial-gradient(ellipse at 50% 50%, rgba(201, 168, 76,0.08) 0%, transparent 70%)',
            }}
          />

          {/* ── MAIN GLASS PANEL (Layer 1) ── */}
          <div
            className="relative flex items-center justify-between rounded-[72px] overflow-hidden transition-[padding,background,box-shadow,backdrop-filter] duration-500"
            style={{
              padding: `${scrolled ? 18 : 19}px 40px`,
              background: 'rgba(22, 22, 22, 0.8)',
              border: '1px solid rgba(201, 162, 39, 0.28)',
              backdropFilter: `blur(${blurAmount}px)`,
              WebkitBackdropFilter: `blur(${blurAmount}px)`,
              boxShadow: '0px 24px 64px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(201, 162, 39, 0.16), inset 0px 1px 0px 1px rgba(255, 255, 255, 0.08), inset 0px -1px 0px 1px rgba(201, 162, 39, 0.12)',
            }}
          >

            {/* ── MOUSE LIGHT SWEEP ── */}
            <div
              className="absolute top-0 bottom-0 w-[35%] pointer-events-none blur-[3px] [transform:skewX(-15deg)] transition-[left] duration-[1200ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{
                left: `${sweepX}%`,
                background: 'linear-gradient(105deg, transparent 0%, rgba(255,245,200,0.22) 40%, rgba(255,255,255,0.35) 50%, rgba(255,245,200,0.22) 60%, transparent 100%)',
              }}
            />

            {/* ── GRAIN TEXTURE ── */}
            <div
              className="absolute inset-0 rounded-[72px] pointer-events-none opacity-[0.025] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
              }}
            />

            {/* ── BOTTOM GOLD GLOW EDGE — exact Figma ── */}
            <div
              className="absolute bottom-[1px] left-[10.06%] right-[10.05%] h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, rgba(201, 162, 39, 0) 0%, rgba(201, 162, 39, 0.5) 30%, rgba(249, 212, 76, 0.8) 50%, rgba(201, 162, 39, 0.5) 70%, rgba(201, 162, 39, 0) 100%)',
                filter: 'drop-shadow(0px 2px 12px rgba(201, 162, 39, 0.3))',
              }}
            />

            {/* ═══════════════ INOUT BRANDING ═══════════════ */}
            <div
              className="flex-1 flex justify-start relative z-[2] transition-opacity duration-300 opacity-100"
            >
              <Link href="/" className="flex items-center gap-3 no-underline">
                {/* Gold orb logo */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #fff9e6, #F5E0A3 40%, #C9A84C 70%, #8F722E)',
                    boxShadow: '0 0 14px rgba(201,168,76,0.45), inset 0 1px 0 rgba(255,255,255,0.5)',
                    flexShrink: 0,
                  }}
                />
                {/* INOUT text */}
                <span
                  className="font-heading"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    background: 'linear-gradient(108.75deg, #FFC452 0%, #FFE38B 30%, #FFE38B 55%, #FFDF7B 75%, #FFDB9B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.3))',
                  }}
                >
                  INOUT
                </span>
              </Link>
            </div>

            {/* ══════════════ NAV LINKS — Desktop only ══════════════ */}
            <ul className="relative z-[2] hidden md:flex gap-12 list-none m-0 p-0">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="
                      group relative inline-block
                      font-heading text-[16px] font-bold tracking-[0.04em] uppercase no-underline
                      text-[#FFC979] transition-[color,transform,text-shadow] duration-300 ease-out
                      hover:text-[#FEC062] hover:-translate-y-0.5
                      hover:[text-shadow:0_0_16px_rgba(201, 168, 76,0.55),0_0_32px_rgba(201, 168, 76,0.2)]
                      py-1
                    "
                  >
                    {link.name}
                    {/* Hover glow bg */}
                    <span className="absolute -inset-x-3 -inset-y-1.5 rounded-lg bg-[radial-gradient(ellipse_at_center,rgba(201, 168, 76,0.12)_0%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                    {/* Underline */}
                    <span
                      className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-0 transition-[width] duration-[450ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:w-full pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, #C9A84C 40%, #F5E0A3 50%, #C9A84C 60%, transparent)',
                        boxShadow: '0 0 8px rgba(249,212,76,0.7)',
                      }}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* ═══════════════ CTA — Desktop only ═══════════════ */}
            <div className="flex-1 hidden md:flex justify-end relative z-[2]">

              <Link
                href="https://inout2026.devfolio.co/overview"
                id="nav-join-btn"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => { setCtaHovered(false); setCtaPressed(false); }}
                onMouseDown={() => setCtaPressed(true)}
                onMouseUp={() => setCtaPressed(false)}
                className="relative inline-flex items-center justify-center gap-2 no-underline select-none"
                style={{
                  padding: '11px 28px 11px 22px',
                  borderRadius: '50px',
                  transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 350ms ease',
                  transform: ctaPressed
                    ? 'scale(0.96) translateY(1px)'
                    : ctaHovered
                    ? 'scale(1.06) translateY(-3px)'
                    : 'scale(1) translateY(0)',
                }}
              >
                {/* Outer ambient glow blob */}
                <span
                  className="absolute pointer-events-none"
                  style={{
                    inset: '-12px',
                    borderRadius: '60px',
                    background: 'radial-gradient(ellipse at center, rgba(201, 168, 76,0.32) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                    animation: 'goldPulse 3s ease-in-out infinite',
                    opacity: ctaHovered ? 1 : 0.6,
                    transition: 'opacity 400ms ease',
                  }}
                />

                {/* Animated spinning conic border */}
                <span
                  className="absolute inset-0 rounded-[50px] pointer-events-none"
                  style={{
                    padding: '1.5px',
                    background: 'conic-gradient(from 0deg, #7a5010 0%, #F5E0A3 20%, #C9A84C 40%, #F5E0A3 60%, #8a5e0a 80%, #F5E0A3 90%, #7a5010 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    animation: 'borderEnergy 3s linear infinite',
                    opacity: ctaHovered ? 1 : 0.75,
                    transition: 'opacity 300ms ease',
                  }}
                />

                {/* Main fill */}
                <span
                  className="absolute inset-[1.5px] rounded-[48px] pointer-events-none"
                  style={{
                    background: ctaHovered
                      ? 'linear-gradient(103.81deg, #FFD03D 0%, #FFE38B 30%, #FFD03D 55%, #F7C937 80%, #FFB240 100%)'
                      : 'linear-gradient(103.81deg, #FFB240 0%, #FFB826 25%, #FFD03D 45%, #F7C937 60%, #ECB328 80%, #DC952C 100%)',
                    transition: 'background 400ms ease',
                    boxShadow: ctaHovered
                      ? 'inset 0 -2px 0 rgba(80,40,0,0.35)'
                      : 'inset 0 -2px 0 rgba(0,0,0,0.32)',
                  }}
                />

                {/* Outer glow shell */}
                <span
                  className="absolute inset-0 rounded-[50px] pointer-events-none"
                  style={{
                    boxShadow: ctaHovered
                      ? '0 0 0 1.5px rgba(245,217,128,0.9), 0 0 20px rgba(249,212,76,0.8), 0 0 55px rgba(201, 168, 76,0.45), 0 8px 28px rgba(0,0,0,0.25)'
                      : '0 0 0 1px rgba(201, 168, 76,0.4), 0 0 12px rgba(201, 168, 76,0.28), 0 4px 18px rgba(0,0,0,0.28)',
                    transition: 'box-shadow 400ms ease',
                  }}
                />


                {/* Dual energy pulse rings on hover */}
                {ctaHovered && (
                  <span
                    className="absolute inset-0 rounded-[50px] pointer-events-none"
                    style={{
                      border: '1.5px solid rgba(249,212,76,0.9)',
                      animation: 'energyPulse 0.65s ease-out forwards',
                    }}
                  />
                )}
                {ctaHovered && (
                  <span
                    className="absolute inset-0 rounded-[50px] pointer-events-none"
                    style={{
                      border: '1px solid rgba(249,212,76,0.5)',
                      animation: 'energyPulse 0.65s ease-out 0.2s forwards',
                    }}
                  />
                )}

                {/* Norse rune icon */}
                <span
                  className="relative z-[2] font-heading text-[1rem] leading-none"
                  style={{
                    color: ctaHovered ? 'rgba(55,25,0,0.85)' : 'rgba(245,217,128,0.95)',
                    filter: ctaHovered
                      ? 'drop-shadow(0 0 3px rgba(255,190,0,0.4))'
                      : 'drop-shadow(0 0 7px rgba(255,215,0,0.55))',
                    display: 'inline-block',
                    transform: ctaHovered ? 'rotate(-15deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                    transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), color 300ms ease, filter 300ms ease',
                  }}
                >
                  ᚦ
                </span>

                {/* Label */}
                <span
                  className="relative z-[2] font-heading font-bold capitalize"
                  style={{
                    fontSize: '14px',
                    lineHeight: '15px',
                    letterSpacing: '0.04em',
                    color: ctaHovered ? 'rgba(45,20,0,0.95)' : '#fff',
                    textShadow: ctaHovered ? 'none' : '0 1px 8px rgba(0,0,0,0.45)',
                    transition: 'color 300ms ease, text-shadow 300ms ease',
                  }}
                >
                  Join Hackathon
                </span>
              </Link>
            </div>

            {/* ═══════════════ HAMBURGER BUTTON — Mobile only ═══════════════ */}
            <div className="flex md:hidden relative z-[2] items-center">
              <button
                id="nav-hamburger-btn"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="relative flex flex-col items-center justify-center w-10 h-10 rounded-full focus:outline-none"
                style={{
                  background: 'rgba(201, 168, 76,0.12)',
                  border: '1px solid rgba(201, 168, 76,0.35)',
                  boxShadow: '0 0 12px rgba(201, 168, 76,0.2)',
                  transition: 'background 300ms ease, box-shadow 300ms ease',
                }}
              >
                {/* Three animated bars */}
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '1.5px',
                    background: 'linear-gradient(90deg, #C9A84C, #F5E0A3)',
                    borderRadius: '2px',
                    transformOrigin: 'center',
                    transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease',
                    transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'translateY(-4px)',
                    boxShadow: '0 0 6px rgba(201, 168, 76,0.6)',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '1.5px',
                    background: 'linear-gradient(90deg, #C9A84C, #F5E0A3)',
                    borderRadius: '2px',
                    transition: 'opacity 250ms ease',
                    opacity: menuOpen ? 0 : 1,
                    boxShadow: '0 0 6px rgba(201, 168, 76,0.6)',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '18px',
                    height: '1.5px',
                    background: 'linear-gradient(90deg, #C9A84C, #F5E0A3)',
                    borderRadius: '2px',
                    transformOrigin: 'center',
                    transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), opacity 250ms ease',
                    transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'translateY(4px)',
                    boxShadow: '0 0 6px rgba(201, 168, 76,0.6)',
                  }}
                />
              </button>
            </div>

          </div>{/* end main panel */}
        </div>

        </div>{/* end inner wrapper */}
      </nav>

      {/* ═══════════════════════════════════════════════════════
          MOBILE MENU OVERLAY
      ═══════════════════════════════════════════════════════ */}
      <div
        id="mobile-menu-overlay"
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          pointerEvents: menuOpen ? 'auto' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 400ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Backdrop blur layer */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            background: 'linear-gradient(160deg, rgba(30,15,5,0.97) 0%, rgba(50,25,5,0.95) 50%, rgba(20,10,3,0.98) 100%)',
          }}
        />

        {/* Gold grain texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
            opacity: 0.04,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        {/* Decorative radial glow center */}
        <div
          style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            height: '70vw',
            maxWidth: '400px',
            maxHeight: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(201, 168, 76,0.12) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />


          {/* ── Content container ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100dvh',
            padding: '6rem 2rem 4rem',
            gap: '0',
          }}
        >
          {/* Logo and Rune divider removed as they are redundant with the fixed navbar at the top */}

          {/* Nav links */}
          <nav aria-label="Mobile navigation">
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.name}
                  style={{
                    opacity: menuOpen ? 1 : 0,
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-24px)',
                    transition: `opacity 400ms ease ${180 + i * 70}ms, transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${180 + i * 70}ms`,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      padding: '1rem 2.5rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'rgba(245,217,128,0.85)',
                      borderBottom: '1px solid rgba(201, 168, 76,0.1)',
                      width: '100%',
                      transition: 'color 250ms ease, text-shadow 250ms ease, background 250ms ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#F5E0A3';
                      (e.currentTarget as HTMLElement).style.textShadow = '0 0 20px rgba(201, 168, 76,0.6), 0 0 40px rgba(201, 168, 76,0.3)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201, 168, 76,0.06)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(245,217,128,0.85)';
                      (e.currentTarget as HTMLElement).style.textShadow = 'none';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button */}
          <div
            style={{
              marginTop: '2.5rem',
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
              transition: `opacity 450ms ease ${180 + NAV_LINKS.length * 70 + 60}ms, transform 500ms cubic-bezier(0.34,1.56,0.64,1) ${180 + NAV_LINKS.length * 70 + 60}ms`,
            }}
          >
            <Link
              href="https://inout2026.devfolio.co/overview"
              id="mobile-join-btn"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="relative inline-flex items-center justify-center gap-2 no-underline select-none"
              style={{
                padding: '14px 36px 14px 28px',
                borderRadius: '50px',
              }}
            >
              {/* Outer ambient glow */}
              <span
                style={{
                  position: 'absolute',
                  inset: '-14px',
                  borderRadius: '60px',
                  background: 'radial-gradient(ellipse at center, rgba(201, 168, 76,0.35) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                  animation: 'goldPulse 3s ease-in-out infinite',
                }}
              />

              {/* Conic border */}
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50px',
                  padding: '1.5px',
                  background: 'conic-gradient(from 0deg, #7a5010 0%, #F5E0A3 20%, #C9A84C 40%, #F5E0A3 60%, #8a5e0a 80%, #F5E0A3 90%, #7a5010 100%)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  animation: 'borderEnergy 3s linear infinite',
                }}
              />

              {/* Main fill */}
              <span
                style={{
                  position: 'absolute',
                  inset: '1.5px',
                  borderRadius: '48px',
                  background: 'linear-gradient(135deg, #8F722E 0%, #9a7220 25%, #C9A84C 45%, #e8c040 60%, #a07820 80%, #8F722E 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 0 rgba(0,0,0,0.32)',
                }}
              />

              {/* Outer glow */}
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50px',
                  boxShadow: '0 0 0 1px rgba(201, 168, 76,0.4), 0 0 16px rgba(201, 168, 76,0.35), 0 6px 24px rgba(0,0,0,0.35)',
                }}
              />

              {/* Rune icon */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  lineHeight: 1,
                  color: 'rgba(245,217,128,0.95)',
                  filter: 'drop-shadow(0 0 7px rgba(255,215,0,0.55))',
                }}
              >
                ᚦ
              </span>

              {/* Label */}
              <span
                style={{
                  position: 'relative',
                  zIndex: 2,
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  textShadow: '0 1px 8px rgba(0,0,0,0.45)',
                }}
              >
                Join Hackathon
              </span>
            </Link>
          </div>

          {/* Bottom rune row */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(201, 168, 76,0.2)',
              fontSize: '0.75rem',
              letterSpacing: '0.4em',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap',
              opacity: menuOpen ? 1 : 0,
              transition: 'opacity 600ms ease 600ms',
            }}
          >
            ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ
          </div>
        </div>
      </div>
    </>
  );
}
