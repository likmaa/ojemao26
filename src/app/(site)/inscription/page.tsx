import Link from 'next/link';

export default function InscriptionHub() {
  return (
    <main style={styles.page} className="animate-fade-in">
      <div style={styles.container}>
        {/* Navigation back link */}
        <div style={styles.navContainer}>
          <Link href="/" style={styles.backLink}>
            ← Retour à l'accueil
          </Link>
        </div>

        <header style={styles.header}>
          <h1 style={styles.title}>Portail d'inscription</h1>
          <p style={styles.subtitle}>
            Veuillez choisir le volet de l'événement auquel vous souhaitez participer.
          </p>
        </header>

        <div style={styles.grid}>
          {/* Card 1: Débat de Cotonou */}
          <div style={styles.card}>
            <div>
              <span style={styles.cardBadgeGratuit}>Public & Gratuit</span>
              <h2 style={styles.cardTitle}>Débat de Cotonou (D2C26)</h2>
              <span style={styles.cardDate}>📅 Samedi 25 Juillet 2026</span>
              <p style={styles.cardDescription}>
                Participez aux échanges intellectuels sur le thème : « Unité et engagement pour la paix, la sécurité et la stabilité des États : responsabilités et contributions des intellectuels musulmans, des associations et ONG islamiques face aux défis du terrorisme ».
              </p>
            </div>
            <Link href="/inscription/debat" className="btn btn-primary" style={styles.cardBtn}>
              S'inscrire au Débat
            </Link>
          </div>

          {/* Card 2: CIF */}
          <div style={styles.card}>
            <div>
              <span style={styles.cardBadgeCif}>Réservation en ligne</span>
              <h2 style={styles.cardTitle}>Colloque International (CIF)</h2>
              <span style={styles.cardDate}>📅 26 au 28 Juillet 2026</span>
              <p style={styles.cardDescription}>
                Réservez votre place pour les panels, conférences et ateliers du Colloque sur le thème : « La communauté médiane (Oumma Wasatiyya) : fondements islamiques, enjeux contemporains et pratiques de la jeunesse musulmane en Afrique de l'Ouest ».
              </p>
              <div style={styles.infoBox}>
                ⚠️ <strong>Note :</strong> La participation est payante. Cette inscription en ligne constitue une réservation, les frais de participation seront réglés lors de votre arrivée sur le site de l'événement.
              </div>
            </div>
            <Link href="/inscription/cif" className="btn btn-accent" style={styles.cardBtn}>
              Réserver pour le CIF
            </Link>
          </div>
        </div>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Pour les délégués statutaires mandatés du Congrès de l'OJEMAO, veuillez utiliser le lien d'accès privé qui vous a été transmis par votre structure d'origine.
          </p>
        </footer>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: '#FFFFFF',
  },
  container: {
    maxWidth: '1400px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '0 0.5rem',
  },
  navContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '2rem',
  },
  backLink: {
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
    gap: '2rem',
    marginBottom: '3rem',
  },
  card: {
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '420px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
  },
  cardBadgeGratuit: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    background: 'rgba(56, 165, 84, 0.08)',
    border: '1px solid rgba(56, 165, 84, 0.2)',
    color: 'var(--primary)',
    padding: '0.3rem 0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '1rem',
  },
  cardBadgeCif: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    background: 'rgba(232, 131, 42, 0.08)',
    border: '1px solid rgba(232, 131, 42, 0.2)',
    color: 'var(--accent)',
    padding: '0.3rem 0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
  },
  cardDate: {
    fontSize: '0.85rem',
    color: 'var(--text-dark)',
    display: 'block',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  infoBox: {
    fontSize: '0.8rem',
    background: 'rgba(232, 131, 42, 0.04)',
    borderLeft: '3px solid var(--accent)',
    padding: '0.75rem 1rem',
    color: 'var(--accent)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  cardBtn: {
    width: '100%',
    textAlign: 'center' as const,
    display: 'block',
  },
  footer: {
    borderTop: '1px solid #E2E8F0',
    paddingTop: '1.5rem',
    textAlign: 'center' as const,
  },
  footerText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.5',
  },
};
