'use client';

import { useEffect, useState, useRef } from 'react';

const TARGET_DATE = new Date('2026-04-24T09:00:00+05:30').getTime();

interface TimeUnit {
  value: number;
  label: string;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeUnit[]>([
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' },
  ]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const diff = Math.max(0, TARGET_DATE - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft([
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' },
      ]);
    };

    calculate();
    intervalRef.current = setInterval(calculate, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {/* Label — exact Figma: Inter 16px 500 #797979 */}
      <span
        className="font-body"
        style={{
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#797979',
          lineHeight: '130%',
          textAlign: 'center',
        }}
      >
        Hackathon starts in
      </span>

      {/* Timer boxes — exact Figma: 117×104px, #121212 bg, rounded-16, gap-28 */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        {timeLeft.map((unit) => (
          <div
            key={unit.label}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px 22px 12px',
              gap: '2px',
              width: '117px',
              height: '104px',
              background: '#121212',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              boxShadow: '0px 2px 12px rgba(212, 175, 55, 0.08)',
              borderRadius: '16px',
            }}
          >
            {/* Number — Cinzel 40px 700 white */}
            <span
              className="font-heading"
              style={{
                fontWeight: 700,
                fontSize: '40px',
                lineHeight: '100%',
                textAlign: 'center',
                letterSpacing: '0.02em',
                color: '#FFFFFF',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            {/* Label — Cinzel 14px 700 white */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '5px 2px',
              }}
            >
              <span
                className="font-heading"
                style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                  color: '#FFFFFF',
                }}
              >
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
