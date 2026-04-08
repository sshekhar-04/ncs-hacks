'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import CountdownTimer from './CountdownTimer';

/* Exact Figma badge data with SVG icons matching #BB9E3C */
const INFO_BADGES = [
  {
    text: '26th -27th April',
    width: 192,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="3.5" width="15" height="14" rx="2" stroke="#BB9E3C" strokeWidth="1.5"/>
        <path d="M6.5 1.5V4.5" stroke="#BB9E3C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13.5 1.5V4.5" stroke="#BB9E3C" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2.5 8H17.5" stroke="#BB9E3C" strokeWidth="1.5"/>
        <rect x="8" y="11" width="4" height="4" rx="0.5" fill="#BB9E3C"/>
      </svg>
    ),
  },
  {
    text: 'JSS Noida',
    width: 150,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 10.833a2.083 2.083 0 100-4.166 2.083 2.083 0 000 4.166z" fill="#BB9E3C"/>
        <path d="M10 1.667a6.667 6.667 0 00-6.667 6.666c0 5 6.667 10 6.667 10s6.667-5 6.667-10A6.667 6.667 0 0010 1.667z" stroke="#BB9E3C" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    text: '36 Hr Hackathon',
    width: 198,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="#BB9E3C" strokeWidth="1.5"/>
        <path d="M10 5V10L13 13" stroke="#BB9E3C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    text: 'Open To All Colleges',
    width: 226,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6.667" r="3.333" stroke="#BB9E3C" strokeWidth="1.5"/>
        <path d="M3.333 17.5c0-3.682 2.985-6.667 6.667-6.667s6.667 2.985 6.667 6.667" stroke="#BB9E3C" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const warriorLeftRef = useRef<HTMLDivElement>(null);
  const warriorRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current.children,
          { opacity: 0, y: 50, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.18 },
          0.3
        );
      }
      if (subtitleRef.current) {
        tl.fromTo(subtitleRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8 }, 0.7);
      }
      if (badgesRef.current) {
        tl.fromTo(
          badgesRef.current.children,
          { opacity: 0, y: 18, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.08 },
          1.0
        );
      }
      if (countdownRef.current) {
        tl.fromTo(countdownRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 1.3);
      }
      if (warriorLeftRef.current) {
        tl.fromTo(warriorLeftRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 0.4);
      }
      if (warriorRightRef.current) {
        tl.fromTo(warriorRightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power2.out' }, 0.4);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: '900px',
        overflow: 'hidden',
        background: '#080706',
      }}
    >
      {/* ══ BG IMAGE ══ */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src="/hero-bg.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          quality={90}
          priority
        />
      </div>

      {/* ══ OVERLAY — exact Figma: rgba(0,0,0,0.498) + blur(6px) ══ */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.498)',
          backdropFilter: 'blur(5.99955px)',
          WebkitBackdropFilter: 'blur(5.99955px)',
          zIndex: 1,
        }}
      />

      {/* ══ LEFT WARRIOR — Figma: 180×446.67, left:25, top:430 ══ */}
      <div
        ref={warriorLeftRef}
        style={{
          position: 'absolute',
          width: 'clamp(100px, 12.5vw, 180px)',
          height: 'clamp(250px, 31vw, 446.67px)',
          left: 'clamp(10px, 1.7vw, 25px)',
          bottom: '0px',
          zIndex: 3,
          opacity: 0,
        }}
      >
        <Image
          src="/user-warrior-left.png"
          alt="Warrior illustration"
          fill
          sizes="180px"
          style={{ objectFit: 'contain', objectPosition: 'bottom' }}
        />
      </div>

      {/* ══ RIGHT WARRIOR — Figma: 180×446.67, mirrored ══ */}
      <div
        ref={warriorRightRef}
        style={{
          position: 'absolute',
          width: 'clamp(100px, 12.5vw, 180px)',
          height: 'clamp(250px, 31vw, 446.67px)',
          right: 'clamp(10px, 1.7vw, 25px)',
          bottom: '0px',
          zIndex: 3,
          opacity: 0,
        }}
      >
        <Image
          src="/user-warrior-right.png"
          alt="Warrior illustration"
          fill
          sizes="180px"
          style={{ objectFit: 'contain', objectPosition: 'bottom' }}
        />
      </div>

      {/* ══ FLOATING PARTICLES ══ */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${8 + (i * 41.7) % 84}%`,
              top: `${15 + (i * 53.3) % 70}%`,
              width: `${1.5 + (i % 3)}px`,
              height: `${1.5 + (i % 3)}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #F5E0A3, #C9A84C)',
              boxShadow: `0 0 ${4 + (i % 3) * 3}px rgba(201,168,76,0.5)`,
              opacity: 0.3 + (i % 4) * 0.08,
              animation: `nibble-particle ${6 + (i % 4) * 2}s ease-in-out ${(i % 5) * 0.8}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ══ MAIN CONTENT — centered vertically ══ */}
      <div
        style={{
          position: 'relative',
          zIndex: 4,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
        }}
      >
        {/* ── TITLE "INOUT HACKS" — Figma: 110px, gradient ── */}
        <div ref={titleRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1
            className="font-heading"
            style={{
              fontSize: 'clamp(3rem, 7.6vw, 110px)',
              fontWeight: 700,
              lineHeight: '100%',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'linear-gradient(104.51deg, #6B4A0A 0%, #C9A227 30%, #F5D980 55%, #C9A227 75%, #6B4A0A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              textAlign: 'center',
            }}
          >
            INOUT HACKS
          </h1>

          {/* ── "2K26" — Figma: 96px, same gradient ── */}
          <span
            className="font-heading"
            style={{
              fontSize: 'clamp(2.5rem, 6.6vw, 96px)',
              fontWeight: 700,
              lineHeight: '100%',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'linear-gradient(104.51deg, #6B4A0A 0%, #C9A227 30%, #F5D980 55%, #C9A227 75%, #6B4A0A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginTop: '5px',
              textAlign: 'center',
            }}
          >
            2K26
          </span>
        </div>

        {/* ── SUBTITLE — Figma: Inter 24px 500 #A4A4A4 ── */}
        <div
          ref={subtitleRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 'clamp(20px, 3vw, 40px)',
            gap: '0px',
            opacity: 0,
          }}
        >
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(14px, 1.67vw, 24px)',
              fontWeight: 500,
              lineHeight: '130%',
              textAlign: 'center',
              letterSpacing: '0.06em',
              textTransform: 'capitalize',
              color: '#A4A4A4',
              margin: 0,
            }}
          >
            36 hours of building, breaking and creating the future.
          </p>
          <p
            className="font-body"
            style={{
              fontSize: 'clamp(14px, 1.67vw, 24px)',
              fontWeight: 500,
              lineHeight: '130%',
              textAlign: 'center',
              letterSpacing: '0.06em',
              color: '#A4A4A4',
              margin: 0,
            }}
          >
            Where ideas and code come alive
          </p>
        </div>

        {/* ── INFO BADGES — Figma: #121212, border-radius 16px, gap 17px ── */}
        <div
          ref={badgesRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '17px',
            marginTop: 'clamp(24px, 4vw, 48px)',
          }}
        >
          {INFO_BADGES.map((badge) => (
            <div
              key={badge.text}
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '14px 22px',
                gap: '12px',
                height: '50px',
                background: '#121212',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                boxShadow: '0px 2px 12px rgba(212, 175, 55, 0.08)',
                borderRadius: '16px',
              }}
            >
              {badge.icon}
              <span
                className="font-body"
                style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '16px',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  textTransform: 'capitalize',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                {badge.text}
              </span>
            </div>
          ))}
        </div>

        {/* ── COUNTDOWN TIMER ── */}
        <div ref={countdownRef} style={{ opacity: 0, marginTop: 'clamp(32px, 5vw, 60px)' }}>
          <CountdownTimer />
        </div>
      </div>

      {/* ══ BOTTOM GRADIENT FADE ══ */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(0deg, #080706 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
    </section>
  );
}
