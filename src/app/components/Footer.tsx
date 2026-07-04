import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Col 1: About / Branding */}
          <div style={styles.col}>
            <div style={styles.logoBadge}>
              <span style={styles.logoText}>OJEMAO 2026</span>
            </div>
            <p style={styles.aboutText}>
              Événements institutionnels portés par l'Association des Intellectuels Musulmans du Bénin (AIMB), l'ACEEMUB, l'OJEMAO et le RAI-Bénin à Cotonou.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Événements</h4>
            <div style={styles.links}>
              <Link href="/evenement/debat" style={styles.link}>Débat de Cotonou (D2C26)</Link>
              <Link href="/evenement/cif" style={styles.link}>Congrès & Colloque (CIF)</Link>
              <Link href="/programme" style={styles.link}>Programme complet</Link>
              <Link href="/intervenants" style={styles.link}>Intervenants officiels</Link>
            </div>
          </div>

          {/* Col 3: Resources */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Inscriptions</h4>
            <div style={styles.links}>
              <Link href="/inscription/debat" style={styles.link}>S'inscrire au Débat (Gratuit)</Link>
              <Link href="/inscription/cif" style={styles.link}>Réserver pour le CIF (Colloque)</Link>
              <Link href="/partenaires" style={styles.link}>Devenir Partenaire</Link>
              <Link href="/contact" style={styles.link}>Infos & Hébergements</Link>
            </div>
          </div>

          {/* Col 4: Partners / Logos */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Organisateurs</h4>
            <p style={styles.organizerText}>
              AIMB • ACEEMUB • OJEMAO • RAI-BÉNIN
            </p>
            <div style={styles.contactInfo}>
              <p style={styles.contactItem}>📧 info@ojemao26.logtech.tech</p>
              <p style={styles.contactItem}>📍 Cotonou, Bénin</p>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} OJEMAO. Tous droits réservés. Conception et réalisation minimaliste officielle.
          </p>
          <div style={styles.bottomLinks}>
            <Link href="/mentions-legales" style={styles.bottomLink}>Données personnelles</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: 'var(--background-dark)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94A3B8',
    padding: '4rem 0 2rem 0',
    width: '100%',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  logoBadge: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.4rem 1.1rem',
    width: 'fit-content',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.05em',
    color: '#FFFFFF',
  },
  aboutText: {
    fontSize: '0.85rem',
    lineHeight: '1.6',
  },
  colTitle: {
    fontFamily: 'var(--font-title)',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  links: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  link: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    transition: 'color 0.15s ease',
    width: 'fit-content',
    borderBottom: '1px solid transparent',
    paddingBottom: '2px',
    ':hover': {
      color: '#FFFFFF',
    },
  },
  organizerText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
  contactItem: {
    color: '#94A3B8',
  },
  bottomBar: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  copyright: {
    fontSize: '0.75rem',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  bottomLink: {
    fontSize: '0.75rem',
    color: '#64748B',
  },
};
