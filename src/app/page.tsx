import Countdown from './components/Countdown';

export default function UnderConstruction() {
  return (
    <main style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.overlay}></div>
      
      <div style={styles.container} className="animate-slide-up">
        {/* Header/Logo section */}
        <header style={styles.header}>
          <div style={styles.logoBadge}>
            <span style={styles.logoText}>OJEMAO 2026</span>
          </div>
          <div style={styles.badge} className="pulse-subtle">
            Site en construction
          </div>
        </header>

        {/* Main hero section */}
        <section style={styles.heroSection}>
          <h1 style={styles.title}>
            Débat de Cotonou <span style={{ color: 'var(--accent)' }}>2026</span>
            <br />
            <span style={{ fontSize: '0.85em', fontWeight: '400', color: '#FFF' }}>& Congrès de l'OJEMAO</span>
          </h1>
          
          <p style={styles.location}>
            📍 Cotonou, Bénin — ONG Direct Aid | 📅 25 au 28 Juillet 2026
          </p>

          <div style={styles.divider}></div>
          
          <p style={styles.description}>
            Le portail d'inscription officiel et le programme complet seront très bientôt disponibles en ligne. 
            Préparez votre participation à ces deux grands rendez-vous de la jeunesse et des intellectuels musulmans d'Afrique de l'Ouest.
          </p>
        </section>

        {/* Countdown */}
        <Countdown />

        {/* The two events side-by-side */}
        <section style={styles.eventsGrid}>
          <div style={styles.eventCard} className="glass">
            <span style={styles.eventDate}>25 Juillet 2026</span>
            <h3 style={styles.eventTitle}>Débat de Cotonou (D2C26)</h3>
            <p style={styles.eventTheme}>
              « Unité et engagement pour la paix, la sécurité et la stabilité des États : responsabilités et contributions des intellectuels musulmans, des associations et ONG islamiques face aux défis du terrorisme »
            </p>
            <div style={styles.cardFooter}>
              <span style={styles.badgeGratuit}>Accès Libre sur Inscription</span>
            </div>
          </div>

          <div style={styles.eventCard} className="glass">
            <span style={styles.eventDate}>26 au 28 Juillet 2026</span>
            <h3 style={styles.eventTitle}>Congrès OJEMAO & Colloque (CIF)</h3>
            <p style={styles.eventTheme}>
              « La communauté médiane (Oumma Wasatiyya) : fondements islamiques, enjeux contemporains et pratiques de la jeunesse musulmane en Afrique de l'Ouest »
            </p>
            <div style={styles.cardFooter}>
              <span style={styles.badgeReservation}>Réservation en ligne (Paiement sur place)</span>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Porté par : AIMB • ACEEMUB • OJEMAO • RAI-Bénin
          </p>
          <p style={styles.contactText}>
            Pour toute information d'urgence, contactez la coordination locale ou écrivez-nous sur les canaux officiels.
          </p>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} OJEMAO. Tous droits réservés.
          </p>
        </footer>
      </div>
    </main>
  );
}

const styles = {
  page: {
    position: 'relative' as const,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    overflowX: 'hidden' as const,
    fontFamily: 'var(--font-inter)',
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 30%, rgba(7, 15, 27, 0.8) 100%)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  },
  container: {
    position: 'relative' as const,
    zIndex: 2,
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  logoBadge: {
    background: 'linear-gradient(135deg, var(--primary) 0%, #2da85a 100%)',
    padding: '0.5rem 1.25rem',
    borderRadius: '0px',
    boxShadow: 'var(--shadow-md)',
  },
  logoText: {
    fontFamily: 'var(--font-outfit)',
    fontWeight: '700',
    fontSize: '1rem',
    letterSpacing: '0.05em',
    color: '#FFF',
  },
  badge: {
    background: 'rgba(232, 131, 42, 0.15)',
    border: '1px solid rgba(232, 131, 42, 0.3)',
    color: 'var(--accent)',
    padding: '0.4rem 1rem',
    borderRadius: '0px',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  heroSection: {
    marginBottom: '2rem',
  },
  title: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '2.75rem',
    fontWeight: '800',
    color: '#FFF',
    lineHeight: '1.2',
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
  },
  location: {
    fontSize: '1rem',
    color: '#E2E8F0',
    fontWeight: '500',
    opacity: 0.9,
    marginBottom: '1.5rem',
  },
  divider: {
    width: '60px',
    height: '4px',
    background: 'var(--accent)',
    margin: '1.5rem auto',
  },
  description: {
    fontSize: '1.1rem',
    color: '#94A3B8',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto',
  },
  eventsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    width: '100%',
    marginTop: '2rem',
    marginBottom: '4rem',
    textAlign: 'left' as const,
  },
  eventCard: {
    padding: '2rem',
    borderRadius: '0px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '260px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
  },
  eventDate: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--accent)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
    display: 'block',
  },
  eventTitle: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#FFF',
    marginBottom: '1rem',
  },
  eventTheme: {
    fontSize: '0.9rem',
    color: '#94A3B8',
    lineHeight: '1.5',
    flexGrow: 1,
    marginBottom: '1.5rem',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  badgeGratuit: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: 'rgba(45, 168, 90, 0.15)',
    border: '1px solid rgba(45, 168, 90, 0.3)',
    color: '#4ADE80',
    padding: '0.3rem 0.75rem',
    borderRadius: '0px',
  },
  badgeReservation: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '600',
    background: 'rgba(232, 131, 42, 0.15)',
    border: '1px solid rgba(232, 131, 42, 0.3)',
    color: '#FDBA74',
    padding: '0.3rem 0.75rem',
    borderRadius: '0px',
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '2rem',
    width: '100%',
    opacity: 0.7,
  },
  footerText: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#FFF',
    marginBottom: '0.5rem',
  },
  contactText: {
    fontSize: '0.8rem',
    color: '#94A3B8',
    marginBottom: '1.5rem',
  },
  copyright: {
    fontSize: '0.75rem',
    color: '#64748B',
  },
};
