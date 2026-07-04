import Link from 'next/link';

export default function DebatPage() {
  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Volet Académique & Citoyen</span>
          <h1 style={styles.title}>Le Débat de Cotonou 2026</h1>
          <p style={styles.subtitle}>
            Un espace d'échange intellectuel et de réflexion stratégique face aux enjeux contemporains.
          </p>
        </header>

        {/* Details Grid */}
        <section style={styles.detailsGrid}>
          <div style={styles.mainContent} className="glass">
            <h2 style={styles.sectionTitle}>Présentation générale</h2>
            <p style={styles.text}>
              Le Débat de Cotonou se veut une agora d'excellence réunissant universitaires, leaders d'opinion, chercheurs et représentants d'organisations islamiques. L'objectif est de dresser un diagnostic lucide et de proposer des pistes d'action concrètes face aux menaces sécuritaires de notre sous-région.
            </p>
            <p style={styles.text}>
              Cette journée d'échange mettra en lumière le rôle crucial que doivent jouer les intellectuels musulmans et les ONG pour cultiver la paix sociale et consolider la stabilité de nos États.
            </p>

            <h3 style={styles.subTitle}>Thématique centrale</h3>
            <blockquote style={styles.themeQuote}>
              « Unité et engagement pour la paix, la sécurité et la stabilité des États : responsabilités et contributions des intellectuels musulmans, des associations et ONG islamiques face aux défis du terrorisme »
            </blockquote>

            <h3 style={styles.subTitle}>Les Axes de discussion</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Axe 1 :</strong> Analyse historique et doctrinale du phénomène terroriste dans la sous-région.
              </li>
              <li style={styles.listItem}>
                <strong>Axe 2 :</strong> Responsabilité sociétale et académique des leaders d'opinion et intellectuels.
              </li>
              <li style={styles.listItem}>
                <strong>Axe 3 :</strong> Stratégies concrètes de résilience et contribution opérationnelle des ONG musulmanes.
              </li>
            </ul>
          </div>

          <div style={styles.sidebar}>
            {/* Info Box */}
            <div style={styles.sidebarBox} className="glass">
              <h3 style={styles.sidebarTitle}>Informations Clés</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📅 DATE</span>
                <span style={styles.infoVal}>Samedi 25 Juillet 2026</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📍 LIEU</span>
                <span style={styles.infoVal}>Cotonou, Siège de l'ONG Direct Aid</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>🎫 ACCÈS</span>
                <span style={styles.infoVal}>Gratuit, Inscription obligatoire</span>
              </div>
            </div>

            {/* CTA Box */}
            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--primary)', background: 'rgba(56, 165, 84, 0.05)' }} className="glass">
              <h3 style={styles.sidebarTitle}>Rejoindre l'événement</h3>
              <p style={styles.sidebarText}>
                Les places sont limitées en raison de la capacité d'accueil de la salle. Enregistrez-vous dès maintenant pour garantir votre accès.
              </p>
              <Link href="/inscription/debat" className="btn btn-primary" style={styles.ctaBtn}>
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '4rem 0',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    width: '100%',
  },
  header: {
    marginBottom: '3rem',
  },
  badge: {
    background: 'rgba(56, 165, 84, 0.15)',
    border: '1px solid rgba(56, 165, 84, 0.3)',
    color: 'var(--primary)',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#94A3B8',
    maxWidth: '800px',
    lineHeight: '1.6',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '3fr 1.5fr',
    gap: '2.5rem',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  mainContent: {
    padding: '3rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1.5rem',
  },
  subTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#94A3B8',
    marginBottom: '1.25rem',
  },
  themeQuote: {
    borderLeft: '4px solid var(--accent)',
    background: 'rgba(232, 131, 42, 0.05)',
    padding: '1.5rem',
    fontSize: '1.05rem',
    lineHeight: '1.6',
    fontWeight: '600',
    color: '#FDBA74',
    margin: '1.5rem 0',
  },
  list: {
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  listItem: {
    fontSize: '0.95rem',
    color: '#94A3B8',
    lineHeight: '1.5',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  sidebarBox: {
    padding: '2rem',
  },
  sidebarTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1.25rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    marginBottom: '1rem',
    ':last-child': {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
  },
  infoLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
  },
  infoVal: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sidebarText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#94A3B8',
    marginBottom: '1.5rem',
  },
  ctaBtn: {
    width: '100%',
  },
};
