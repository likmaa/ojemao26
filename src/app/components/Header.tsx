'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
    <>
      {/* Institutional Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topBarContainer}>
          <span style={styles.topBarText}>Une initiative conjointe de :</span>
          <div style={styles.topBarLogos}>
            <Image src="/images/organisateurs/logo_ojemao.webp" alt="OJEMAO" width={40} height={25} style={{ objectFit: 'contain' }} />
            <Image src="/images/organisateurs/logo_aimb.webp" alt="AIMB" width={30} height={25} style={{ objectFit: 'contain' }} />
            <Image src="/images/organisateurs/logo_aceemub.webp" alt="ACEEMUB" width={30} height={25} style={{ objectFit: 'contain' }} />
            <Image src="/images/organisateurs/logo_raibenin.webp" alt="RAI-Bénin" width={30} height={25} style={{ objectFit: 'contain' }} />
          </div>
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.container}>
          {/* Logo and Brand */}
          <Link href="/" style={styles.logoLink} onClick={closeMenu}>
            <Image
              src="/images/logo.png"
              alt="OJEMAO 2026 Logo"
              width={140}
              height={50}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav style={styles.desktopNav} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.navLink,
                  color: isActive(link.href) ? 'var(--primary)' : 'var(--text-dark)',
                  borderBottom: isActive(link.href) ? '2px solid var(--primary)' : '2px solid transparent',
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
          <button 
            type="button"
            onClick={toggleMenu} 
            style={styles.mobileToggle} 
            className="mobile-toggle" 
            aria-label="Menu" 
            aria-expanded={isOpen}
          >
            <div style={{ ...styles.burgerLine, transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none' }}></div>
            <div style={{ ...styles.burgerLine, opacity: isOpen ? 0 : 1, marginTop: '5px' }}></div>
            <div style={{ ...styles.burgerLine, transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none', marginTop: '5px' }}></div>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <nav style={styles.mobileNav} className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              style={{
                ...styles.mobileNavLink,
                color: isActive(link.href) ? 'var(--primary)' : 'var(--text-dark)',
                background: isActive(link.href) ? '#F0FDF4' : 'transparent',
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
    </>
  );
}

const styles = {
  topBar: {
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    padding: '0.5rem 0',
  },
  topBarContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '1rem',
  },
  topBarText: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  topBarLogos: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '1.25rem 2rem',
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
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
    flexDirection: 'column' as const,
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0 10px',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    position: 'relative' as const,
    zIndex: 1000,
  },
  burgerLine: {
    width: '100%',
    height: '2px',
    backgroundColor: 'var(--text-dark)',
    transition: 'all 0.15s ease',
    pointerEvents: 'none' as const,
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    width: '100%',
    position: 'fixed' as const,
    top: '76px', // Matches header height approximately
    left: 0,
    height: 'calc(100vh - 76px)',
    overflowY: 'auto' as const,
    zIndex: 99,
  },
  mobileNavLink: {
    fontFamily: 'var(--font-title)',
    fontWeight: '600',
    fontSize: '0.9rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #F1F5F9',
  },
  mobileCtaWrapper: {
    padding: '2rem',
  },
  mobileCtaBtn: {
    width: '100%',
    textAlign: 'center' as const,
    padding: '1rem',
  },
};
