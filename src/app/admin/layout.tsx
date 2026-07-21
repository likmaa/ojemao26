'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaTachometerAlt, FaUsers, FaMicrophone, FaBars, FaTimes, FaSignOutAlt, FaInfoCircle, FaCalendarAlt, FaCog, FaArrowLeft } from 'react-icons/fa';
import { logoutAdmin } from '@/app/lib/actions';




export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('admin');


  useEffect(() => {
    // Lire le rôle depuis le cookie côté client
    const match = document.cookie.match(/admin_role=([^;]+)/);
    if (match) setUserRole(match[1]);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };


  const allNavItems = [
    { name: 'Tableau de bord', href: '/admin', icon: <FaTachometerAlt />, roles: ['admin'] },
    { name: 'Événements', href: '/admin/events', icon: <FaCalendarAlt />, roles: ['admin'] },
    { name: 'Inscriptions', href: '/admin/inscriptions', icon: <FaUsers />, roles: ['admin', 'hebergement'] },
    { name: 'Intervenants', href: '/admin/intervenants', icon: <FaMicrophone />, roles: ['admin'] },
    { name: 'Infos Pratiques', href: '/admin/infos', icon: <FaInfoCircle />, roles: ['admin'] },
  ];


  const navItems = allNavItems.filter(item => item.roles.includes(userRole));


  return (
    <div style={styles.layoutWrapper}>
      {/* Mobile Header */}
      <div style={styles.mobileHeader} className="mobile-header">
        <div style={styles.brand}>
          <span style={styles.brandTitle}>OJEMAO 26</span>
          <span style={styles.brandBadge}>Admin</span>
        </div>
        <button onClick={toggleSidebar} style={styles.mobileToggle}>
          {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, left: isSidebarOpen ? '0' : '-280px' }} className="admin-sidebar">
        <div style={styles.sidebarHeader}>
          <div style={styles.brand}>
            <span style={styles.brandTitle}>OJEMAO 26</span>
            <span style={styles.brandBadge}>Admin</span>
          </div>
          <button onClick={toggleSidebar} style={styles.closeBtn} className="admin-close-btn">
            <FaTimes size={20} />
          </button>
        </div>

        <nav style={styles.nav}>
          <div style={styles.navGroup}>
            <p style={styles.navLabel}>Général</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                style={{
                  ...styles.navLink,
                  backgroundColor: pathname === item.href ? 'rgba(56, 165, 84, 0.1)' : 'transparent',
                  color: pathname === item.href ? 'var(--primary)' : '#475569',
                  borderRight: pathname === item.href ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: pathname === item.href ? '700' : '500',
                }}
              >
                <span style={{ 
                  ...styles.icon,
                  color: pathname === item.href ? 'var(--primary)' : '#94A3B8'
                }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          <div style={styles.navBottom}>
            {userRole === 'admin' && (
              <Link href="/admin/parametres" onClick={closeSidebar} style={{
                ...styles.navLink,
                backgroundColor: pathname === '/admin/parametres' ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: pathname === '/admin/parametres' ? '#6366F1' : '#475569',
                borderRight: pathname === '/admin/parametres' ? '3px solid #6366F1' : '3px solid transparent',
                fontWeight: pathname === '/admin/parametres' ? '700' : '500',
              }}>
                <span style={{ ...styles.icon, color: pathname === '/admin/parametres' ? '#6366F1' : '#94A3B8' }}><FaCog /></span>
                Paramètres
              </Link>
            )}
            <button onClick={handleLogout} style={{ ...styles.navLink, width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', fontWeight: '600' }}>
              <span style={{ ...styles.icon, color: '#EF4444' }}><FaSignOutAlt /></span>
              Déconnexion
            </button>
            <Link href="/" style={styles.navLink} onClick={closeSidebar}>
              <span style={styles.icon}><FaArrowLeft /></span>
              Retour au site
            </Link>
          </div>

        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div style={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Main Content */}
      <main style={styles.mainContent} className="admin-main">
        {children}
      </main>
    </div>
  );
}

const styles = {
  layoutWrapper: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#F1F5F9',
  },
  mobileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    width: '100%',
    position: 'fixed' as const,
    top: 0,
    zIndex: 40,
  },
  mobileToggle: {
    background: 'none',
    border: 'none',
    color: '#0F172A',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    top: 0,
    bottom: 0,
    zIndex: 50,
    transition: 'left 0.3s ease',
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748B',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  brandTitle: {
    fontFamily: 'var(--font-title)',
    fontWeight: '800',
    fontSize: '1.25rem',
    color: '#0F172A',
  },
  brandBadge: {
    backgroundColor: 'var(--accent)',
    color: '#FFFFFF',
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    padding: '1.5rem 0',
    justifyContent: 'space-between',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  navLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: '0.05em',
    padding: '0 1.5rem',
    marginBottom: '0.5rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  icon: {
    marginRight: '0.75rem',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
  },
  navBottom: {
    padding: '1.5rem 0',
    borderTop: '1px solid #F1F5F9',
  },
  mainContent: {
    flexGrow: 1,
    padding: '2rem',
    minHeight: '100vh',
    width: '100%',
    paddingTop: '80px', // For mobile header
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 45,
    backdropFilter: 'blur(2px)',
  },
};
