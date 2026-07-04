'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/evenement/debat', label: 'Le Débat' },
    { href: '/evenement/cif', label: 'Congrès & CIF' },
    { href: '/programme', label: 'Programme' },
    { href: '/intervenants', label: 'Intervenants' },
    { href: '/partenaires', label: 'Partenaires' },
    { href: '/contact', label: 'Infos Pratiques' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Logo and Brand */}
        <Link href="/" style={styles.logoLink} onClick={closeMenu}>
          <div style={styles.logoBadge}>
            <span style={styles.logoText}>OJEMAO 2026</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                ...styles.navLink,
                color: isActive(link.href) ? 'var(--accent)' : 'var(--white)',
                borderBottom: isActive(link.href) ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/inscription" className="btn btn-primary" style={styles.ctaBtn}>
            S'inscrire
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} style={styles.mobileToggle} aria-label="Menu">
          <div style={{ ...styles.burgerLine, transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
          <div style={{ ...styles.burgerLine, opacity: isOpen ? 0 : 1 }}></div>
          <div style={{ ...styles.burgerLine, transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></div>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <nav style={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{
                ...styles.mobileNavLink,
                color: isActive(link.href) ? 'var(--accent)' : 'var(--white)',
                background: isActive(link.href) ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={styles.mobileCtaWrapper}>
            <Link href="/inscription" onClick={closeMenu} className="btn btn-primary" style={styles.mobileCtaBtn}>
              S'inscrire aux événements
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--background-dark)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.25rem 2rem',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  logoBadge: {
    background: 'var(--primary)',
    padding: '0.4rem 1.1rem',
    borderRadius: '0px', // Strict sharp corners
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.05em',
    color: '#FFFFFF',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
    // Responsive hide done by standard css rules or media check
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  navLink: {
    fontFamily: 'var(--font-title)',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    padding: '0.5rem 0',
    transition: 'color 0.15s ease',
  },
  ctaBtn: {
    fontSize: '0.8rem',
    padding: '0.5rem 1.25rem',
  },
  mobileToggle: {
    display: 'none', // Shown in CSS media queries
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    width: '24px',
    height: '18px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    outline: 'none',
  },
  burgerLine: {
    width: '100%',
    height: '2px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.15s ease',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'var(--background-dark)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    width: '100%',
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    zIndex: 99,
  },
  mobileNavLink: {
    fontFamily: 'var(--font-title)',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    padding: '1rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  },
  mobileCtaWrapper: {
    padding: '1.5rem 2rem',
  },
  mobileCtaBtn: {
    width: '100%',
    textAlign: 'center' as const,
  },
};
