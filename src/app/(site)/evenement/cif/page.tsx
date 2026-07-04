import Link from 'next/link';

export default function CifPage() {
  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Volet Formatif & Statutaire</span>
          <h1 style={styles.title}>Congrès & Colloque (CIF) 2026</h1>
          <p style={styles.subtitle}>
            Le rassemblement régional de la jeunesse musulmane pour se former, échanger et statuer.
          </p>
        </header>

        {/* Details Grid */}
        <section style={styles.detailsGrid}>
          <div style={styles.mainContent} className="glass">
            <h2 style={styles.sectionTitle}>Présentation des deux Volets</h2>
            
            {/* Volet 1: Colloque CIF */}
            <div style={styles.sectionBlock}>
              <h3 style={styles.subTitle}>1. Le Colloque International de Formation (CIF)</h3>
              <p style={styles.text}>
                Le CIF est un espace <strong>ouvert au grand public, aux étudiants, aux jeunes cadres et aux militants</strong>. Il propose trois jours de panels interactifs, de conférences magistrales et d'ateliers pratiques menés par des experts sous-régionaux.
              </p>
              <blockquote style={styles.themeQuote}>
                <strong>Thème central :</strong> « La communauté médiane (Oumma Wasatiyya) : fondements islamiques, enjeux contemporains et pratiques de la jeunesse musulmane en Afrique de l'Ouest »
              </blockquote>
              <p style={styles.text}>
                L'objectif est d'outiller la jeunesse avec le concept du juste milieu (Wasatiyya) afin de prévenir les dérives extrémistes et de stimuler un engagement social et spirituel constructif.
              </p>
            </div>

            <div style={styles.sectionDivider}></div>

            {/* Volet 2: Le Congrès statutaire */}
            <div style={styles.sectionBlock}>
              <h3 style={styles.subTitle}>2. Le Congrès Statutaire de l'OJEMAO</h3>
              <p style={styles.text}>
                Le Congrès est un espace <strong>strictement réservé aux délégués officiels mandatés</strong> par les structures membres de l'Organisation de la Jeunesse Musulmane en Afrique de l'Ouest (OJEMAO).
              </p>
              <p style={styles.text}>
                Il sera consacré aux séances d'évaluation, à la présentation des bilans d'activité et financiers, aux réformes des textes et à l'élection du nouveau bureau exécutif de l'organisation.
              </p>
            </div>
          </div>

          <div style={styles.sidebar}>
            {/* Info Box */}
            <div style={styles.sidebarBox} className="glass">
              <h3 style={styles.sidebarTitle}>Informations Clés</h3>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📅 DATES</span>
                <span style={styles.infoVal}>Dim. 26 au Mar. 28 Juillet 2026</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>📍 LIEU</span>
                <span style={styles.infoVal}>Cotonou, Siège de l'ONG Direct Aid</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>🎫 ACCÈS COLLOQUE</span>
                <span style={styles.infoVal}>Sur réservation (Paiement sur place)</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>🗳️ ACCÈS CONGRÈS</span>
                <span style={styles.infoVal}>Réservé aux délégués mandatés</span>
              </div>
            </div>

            {/* CTA Box */}
            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--accent)', background: 'rgba(232, 131, 42, 0.05)' }} className="glass">
              <h3 style={styles.sidebarTitle}>Faire ma réservation</h3>
              <p style={styles.sidebarText}>
                Pour participer au Colloque (panels, ateliers et matériel), effectuez votre réservation en ligne. Le règlement des frais s'effectuera directement lors de votre enregistrement physique à Cotonou.
              </p>
              <Link href="/inscription/cif" className="btn btn-accent" style={styles.ctaBtn}>
                Réserver ma place CIF
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
    background: 'rgba(232, 131, 42, 0.15)',
    border: '1px solid rgba(232, 131, 42, 0.3)',
    color: 'var(--accent)',
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
  sectionBlock: {
    marginBottom: '1.5rem',
  },
  subTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#94A3B8',
    marginBottom: '1.25rem',
  },
  themeQuote: {
    borderLeft: '4px solid var(--primary)',
    background: 'rgba(56, 165, 84, 0.05)',
    padding: '1.25rem 1.5rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#E2E8F0',
    margin: '1.25rem 0',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '2rem 0',
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
