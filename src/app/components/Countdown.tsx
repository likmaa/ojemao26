'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Target date: July 25, 2026 at 09:00:00 (Benin Time GMT+1)
    // Using explicit parameters to avoid parsing errors on older mobile browsers (like Android 7)
    // Month is 0-indexed, so 6 is July.
    const targetDate = new Date(2026, 6, 25, 9, 0, 0).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    // Update time every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    // Skeleton state to prevent layout shift before hydration
    return (
      <div style={styles.container}>
        <div className="countdown-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={styles.cardSkeleton}>
              <span style={styles.number}>--</span>
              <span style={styles.label}>...</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="countdown-grid">
        <div style={styles.card}>
          <span style={styles.number}>{String(timeLeft.days).padStart(2, '0')}</span>
          <span style={styles.label}>Jours</span>
        </div>
        <div style={styles.card}>
          <span style={styles.number}>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span style={styles.label}>Heures</span>
        </div>
        <div style={styles.card}>
          <span style={styles.number}>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span style={styles.label}>Minutes</span>
        </div>
        <div style={styles.card}>
          <span style={styles.number}>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span style={styles.label}>Secondes</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: '2.5rem 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(80px, 120px))',
    gap: '1rem',
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '1.25rem 0.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  cardSkeleton: {
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '1.25rem 0.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  number: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--primary)',
    lineHeight: '1',
    marginBottom: '0.5rem',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    color: 'var(--text-muted)',
    fontWeight: '700',
  },
};
