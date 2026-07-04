import Link from 'next/link';

export default function ContactPage() {
  const hotes = [
    { name: 'Hôtel Direct Aid Cotonou', desc: 'Situé sur place, réservé en priorité aux délégations officielles OJEMAO de la sous-région.', dist: 'Sur le site' },
    { name: 'Hôtel Résidence de la Paix', desc: 'Chambres climatisées standard, Wi-Fi gratuit, petit-déjeuner inclus.', dist: 'À 5 minutes du site (Partenaire tarif préférentiel)' },
    { name: 'Hôtel Le Consulaire', desc: 'Recommandé pour les cadres et universitaires. Service de navette disponible.', dist: 'À 10 minutes du site' },
  ];

  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Logistique & Contact</span>
          <h1 style={styles.title}>Infos Pratiques & Hébergement</h1>
          <p style={styles.subtitle}>
            Toutes les informations nécessaires pour préparer votre venue et votre séjour à Cotonou.
          </p>
        </header>

        {/* Info grid */}
        <section style={styles.grid}>
          {/* Main Info */}
          <div style={styles.mainContent} className="glass">
            <h2 style={styles.sectionTitle}>Lieu de l'Événement</h2>
            <div style={styles.locationBox}>
              <h3 style={styles.venueName}>📍 Siège National de l'ONG Direct Aid</h3>
              <p style={styles.venueAddress}>Quartier Cadjehoun, Cotonou, Bénin</p>
              <p style={styles.text}>
                Le site est entièrement sécurisé, équipé de salles de conférence climatisées, d'un espace de prière et d'un service de restauration. Il est facilement accessible en taxi ou moto depuis n'importe quel point de la ville.
              </p>
            </div>

            <div style={styles.sectionDivider}></div>

            <h2 style={styles.sectionTitle}>Hébergements Recommandés</h2>
            <p style={styles.text}>
              Pour les délégations nationales et les participants venant hors du Bénin ou des villes reculées, voici les solutions de logement négociées par le comité d'organisation :
            </p>

            <div style={styles.hotesList}>
              {hotes.map((h, idx) => (
                <div key={idx} style={styles.hotelCard}>
                  <div style={styles.hotelHeader}>
                    <h3 style={styles.hotelName}>{h.name}</h3>
                    <span style={styles.distBadge}>{h.dist}</span>
                  </div>
                  <p style={styles.hotelDesc}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Contacts */}
          <div style={styles.sidebar}>
            {/* Urgent contacts */}
            <div style={styles.sidebarBox} className="glass">
              <h3 style={styles.sidebarTitle}>Comité d'Accueil</h3>
              <p style={styles.sidebarText}>
                Pour coordonner votre arrivée (accueil à l'aéroport ou à la gare routière) :
              </p>
              <div style={styles.contactItem}>
                <span style={styles.contactLabel}>📞 PÔLE ACCUEIL</span>
                <span style={styles.contactVal}>+229 90 00 00 01</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactLabel}>📞 SECRÉTARIAT GÉNÉRAL</span>
                <span style={styles.contactVal}>+229 90 00 00 02</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactLabel}>📧 EMAIL COORDINATION</span>
                <span style={styles.contactVal}>coordination@ojemao26.logtech.tech</span>
              </div>
            </div>

            {/* Inscription prompt */}
            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--accent)', background: 'rgba(232, 131, 42, 0.05)' }} className="glass">
              <h3 style={styles.sidebarTitle}>Prêt à participer ?</h3>
              <p style={styles.sidebarText}>
                Les réservations et inscriptions restent ouvertes. Assurez votre enregistrement en ligne avant votre déplacement.
              </p>
              <Link href="/inscription" className="btn btn-accent" style={styles.ctaBtn}>
                Accéder au Hub d'inscription
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
    background: 'rgba(3, 67, 137, 0.15)',
    border: '1px solid rgba(3, 67, 137, 0.3)',
    color: 'var(--secondary)',
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
    fontSize: '1.05rem',
    color: '#94A3B8',
    lineHeight: '1.6',
    maxWidth: '800px',
  },
  grid: {
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
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1.25rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#94A3B8',
    marginBottom: '1.5rem',
  },
  locationBox: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
  },
  venueName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '0.25rem',
  },
  venueAddress: {
    fontSize: '0.85rem',
    color: 'var(--accent)',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '2rem 0',
  },
  hotesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  hotelCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  hotelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  hotelName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  distBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--primary)',
    background: 'rgba(56, 165, 84, 0.15)',
    padding: '0.2rem 0.6rem',
  },
  hotelDesc: {
    fontSize: '0.85rem',
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
  sidebarText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#94A3B8',
    marginBottom: '1.5rem',
  },
  contactItem: {
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
  contactLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
  },
  contactVal: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ctaBtn: {
    width: '100%',
  },
};
