'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  FaTachometerAlt, FaUsers, FaMicrophone, FaBars, FaTimes, FaSignOutAlt, 
  FaInfoCircle, FaCalendarAlt, FaCog, FaArrowLeft, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import { logoutAdmin } from '@/app/lib/actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<string>('admin');

  useEffect(() => {
    // Read role from client cookie
    const match = document.cookie.match(/admin_role=([^;]+)/);
    if (match) setUserRole(match[1]);

    // Read saved sidebar collapse preference
    const savedCollapse = localStorage.getItem('admin_sidebar_collapsed');
    if (savedCollapse === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('admin_sidebar_collapsed', String(next));
      return next;
    });
  };

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
  const sidebarWidth = isCollapsed ? '70px' : '220px';

  return (
    <div style={{ ...styles.layoutWrapper, '--sidebar-width': sidebarWidth } as any}>
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
      <aside 
        style={{ 
          ...styles.sidebar, 
          width: sidebarWidth,
          left: isSidebarOpen ? '0' : `-${sidebarWidth}` 
        }} 
        className="admin-sidebar"
      >
        <div style={{ ...styles.sidebarHeader, justifyContent: isCollapsed ? 'center' : 'space-between', padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1rem' }}>
          {!isCollapsed ? (
            <div style={styles.brand}>
              <span style={styles.brandTitle}>OJEMAO 26</span>
              <span style={styles.brandBadge}>Admin</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ fontWeight: '900', fontSize: '1rem', color: '#0F172A' }}>O26</span>
            </div>
          )}

          {/* Desktop Toggle Collapse Button */}
          <button 
            onClick={toggleCollapse} 
            title={isCollapsed ? 'Déplier le menu' : 'Réduire le menu'} 
            style={styles.collapseBtn}
          >
            {isCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
          </button>

          {/* Mobile Close Button */}
          <button onClick={toggleSidebar} style={styles.closeBtn} className="admin-close-btn">
            <FaTimes size={18} />
          </button>
        </div>

        <nav style={{ ...styles.nav, padding: isCollapsed ? '1rem 0' : '1.25rem 0' }}>
          <div style={styles.navGroup}>
            {!isCollapsed && <p style={styles.navLabel}>Général</p>}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                title={isCollapsed ? item.name : undefined}
                style={{
                  ...styles.navLink,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '0.75rem 0' : '0.65rem 1rem',
                  backgroundColor: pathname === item.href ? 'rgba(56, 165, 84, 0.1)' : 'transparent',
                  color: pathname === item.href ? 'var(--primary)' : '#475569',
                  borderRight: pathname === item.href ? '3px solid var(--primary)' : '3px solid transparent',
                  fontWeight: pathname === item.href ? '700' : '500',
                }}
              >
                <span style={{ 
                  ...styles.icon,
                  marginRight: isCollapsed ? 0 : '0.75rem',
                  color: pathname === item.href ? 'var(--primary)' : '#94A3B8'
                }}>{item.icon}</span>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          <div style={styles.navBottom}>
            {userRole === 'admin' && (
              <Link 
                href="/admin/parametres" 
                onClick={closeSidebar} 
                title={isCollapsed ? 'Paramètres' : undefined}
                style={{
                  ...styles.navLink,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '0.75rem 0' : '0.65rem 1rem',
                  backgroundColor: pathname === '/admin/parametres' ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: pathname === '/admin/parametres' ? '#6366F1' : '#475569',
                  borderRight: pathname === '/admin/parametres' ? '3px solid #6366F1' : '3px solid transparent',
                  fontWeight: pathname === '/admin/parametres' ? '700' : '500',
                }}
              >
                <span style={{ 
                  ...styles.icon, 
                  marginRight: isCollapsed ? 0 : '0.75rem',
                  color: pathname === '/admin/parametres' ? '#6366F1' : '#94A3B8' 
                }}><FaCog /></span>
                {!isCollapsed && <span>Paramètres</span>}
              </Link>
            )}

            <button 
              onClick={handleLogout} 
              title={isCollapsed ? 'Déconnexion' : undefined}
              style={{ 
                ...styles.navLink, 
                width: '100%', 
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '0.75rem 0' : '0.65rem 1rem',
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: '#EF4444', 
                fontWeight: '600' 
              }}
            >
              <span style={{ ...styles.icon, marginRight: isCollapsed ? 0 : '0.75rem', color: '#EF4444' }}><FaSignOutAlt /></span>
              {!isCollapsed && <span>Déconnexion</span>}
            </button>

            <Link 
              href="/" 
              style={{
                ...styles.navLink,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                padding: isCollapsed ? '0.75rem 0' : '0.65rem 1rem',
              }} 
              onClick={closeSidebar}
              title={isCollapsed ? 'Retour au site' : undefined}
            >
              <span style={{ ...styles.icon, marginRight: isCollapsed ? 0 : '0.75rem' }}><FaArrowLeft /></span>
              {!isCollapsed && <span>Retour au site</span>}
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
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'fixed' as const,
    top: 0,
    bottom: 0,
    zIndex: 50,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s ease',
    overflowX: 'hidden' as const,
  },
  sidebarHeader: {
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    transition: 'padding 0.3s ease',
  },
  collapseBtn: {
    background: '#F1F5F9',
    border: 'none',
    borderRadius: '6px',
    color: '#64748B',
    cursor: 'pointer',
    padding: '0.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
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
    fontSize: '1.15rem',
    color: '#0F172A',
    whiteSpace: 'nowrap' as const,
  },
  brandBadge: {
    backgroundColor: 'var(--accent)',
    color: '#FFFFFF',
    fontSize: '0.65rem',
    fontWeight: '700',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  navGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
  },
  navLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: '0.05em',
    padding: '0 1rem',
    marginBottom: '0.4rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const,
  },
  icon: {
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navBottom: {
    padding: '1rem 0',
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
