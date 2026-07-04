'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoLocationOutline, IoCalendarOutline } from 'react-icons/io5';

const images = [
  '/images/DSC_0564.jpg',
  '/images/DSC_0568.jpg',
  '/images/DSC_0569.jpg'
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={styles.heroSection}>
      {/* Background Images */}
      {images.map((src, index) => (
        <div
          key={src}
          style={{
            ...styles.imageLayer,
            opacity: index === currentIndex ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt="Événement"
            fill
            style={{ objectFit: 'cover' }}
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dark Overlay so text is readable */}
      <div style={styles.overlay}></div>

      {/* Content */}
      <div style={styles.heroContainer}>
        <h1 style={styles.heroTitle}>
          Unité, Paix et <br />
          <span style={{ color: 'var(--primary)' }}>Engagement Citoyen</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Deux grands rendez-vous de la jeunesse et des intellectuels musulmans d'Afrique de l'Ouest.
          Rejoignez-nous à Cotonou pour échanger, vous former et statuer sur l'avenir de l'Oumma.
        </p>
        <div style={styles.heroDetails}>
          <div style={styles.heroDetailItem}>
            <span style={styles.heroIcon}><IoLocationOutline /></span>
            <span>Cotonou, Bénin</span>
          </div>
          <div style={styles.heroDetailItem}>
            <span style={styles.heroIcon}><IoCalendarOutline /></span>
            <span>25 au 28 Juillet 2026</span>
          </div>
        </div>
        <div style={styles.heroActions}>
          <Link href="/inscription" className="btn btn-primary" style={styles.heroBtn}>
            S'inscrire maintenant
          </Link>
          <Link href="/programme" className="btn btn-secondary" style={styles.heroBtnOutline}>
            Découvrir le programme
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  heroSection: {
    position: 'relative' as const,
    minHeight: '80vh', // Takes a large portion of screen
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 1.5rem',
    overflow: 'hidden',
  },
  imageLayer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: 'opacity 1s ease-in-out',
    zIndex: 0,
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 100%)',
    zIndex: 1,
  },
  heroContainer: {
    position: 'relative' as const,
    zIndex: 2,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    textAlign: 'left' as const,
  },
  heroBadge: {
    background: 'rgba(56, 165, 84, 0.2)',
    border: '1px solid var(--primary)',
    color: '#FFF',
    padding: '0.4rem 1rem',
    borderRadius: '0px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: 'clamp(2.5rem, 5vw, 4rem)', // Responsive font size
    fontWeight: '800',
    color: '#FFF',
    lineHeight: '1.1',
    marginBottom: '1.5rem',
    letterSpacing: '-0.02em',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
    color: '#E2E8F0',
    lineHeight: '1.6',
    maxWidth: '750px',
    marginBottom: '2.5rem',
  },
  heroDetails: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  heroDetailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#FFF',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    padding: '0.6rem 1.25rem',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroIcon: {
    fontSize: '1.2rem',
  },
  heroActions: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  heroBtn: {
    padding: '1rem 2rem',
    fontSize: '1.05rem',
    fontWeight: '600',
  },
  heroBtnOutline: {
    padding: '1rem 2rem',
    fontSize: '1.05rem',
    fontWeight: '600',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(5px)',
    color: '#FFF',
    border: '1px solid #FFF',
  },
};
