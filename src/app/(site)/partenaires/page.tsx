import Link from 'next/link';

export default function PartenairesPage() {
  const partners = [
    { name: 'AIMB', role: 'Porteur Principal Académique', details: 'Association des Intellectuels Musulmans du Bénin' },
    { name: 'ACEEMUB', role: 'Coorganisateur Local & Logistique', details: 'Association Culturelle et Éducative des Élèves et Étudiants Musulmans du Bénin' },
    { name: 'OJEMAO', role: 'Organisation de Tutelle Régionale', details: 'Organisation de la Jeunesse Musulmane en Afrique de l\'Ouest' },
    { name: 'RAI-Bénin', role: 'Co-porteur Citoyen & Mobilisation', details: 'Réseau des Associations Islamiques du Bénin' },
    { name: 'Direct Aid', role: 'Partenaire d\'Accueil & Lieu', details: 'ONG Internationale de Bienfaisance et d\'Éducation' },
  ];

  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Soutiens & Alliances</span>
          <h1 style={styles.title}>Partenaires & Organisateurs</h1>
          <p style={styles.subtitle}>
            Les institutions et organisations engagées pour la réussite du Débat de Cotonou et du Congrès OJEMAO 2026.
          </p>
        </header>

        {/* Founding Partners list */}
        <section style={styles.section} className="glass">
          <h2 style={styles.sectionTitle}>Comité d'Organisation Principal</h2>
          <div style={styles.partnerList}>
            {partners.map((p, idx) => (
              <div key={idx} style={styles.partnerRow}>
                <div style={styles.logoBox}>
                  <span style={styles.logoPlaceholder}>{p.name}</span>
                </div>
                <div style={styles.partnerDetails}>
                  <h3 style={styles.partnerName}>{p.role}</h3>
                  <p style={styles.partnerText}>{p.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsorship Grid */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Grille de Sponsoring & Visibilité</h2>
          <p style={styles.text}>
            Devenez partenaire officiel de ces événements phares d'envergure sous-régionale et bénéficiez d'une visibilité ciblée auprès de centaines de cadres, d'universitaires, d'intellectuels et de jeunes leaders d'Afrique de l'Ouest.
          </p>

          <div style={styles.sponsorshipGrid}>
            {/* Pack 1 */}
            <div style={styles.packCard} className="glass">
              <span style={styles.packType}>Pack Partenaire</span>
              <h3 style={styles.packTitle}>Partenaire Majeur</h3>
              <ul style={styles.packList}>
                <li>Logo sur toute la communication officielle (Affiches, Site, Réseaux)</li>
                <li>Espace d'exposition dédié (stand) lors du Colloque (CIF)</li>
                <li>Temps de parole lors de la cérémonie d'ouverture</li>
                <li>Projection de spot publicitaire pendant les pauses</li>
              </ul>
            </div>

            {/* Pack 2 */}
            <div style={{ ...styles.packCard, borderLeft: '4px solid var(--accent)' }} className="glass">
              <span style={{ ...styles.packType, color: 'var(--accent)' }}>Pack Visibilité</span>
              <h3 style={styles.packTitle}>Soutien Officiel</h3>
              <ul style={styles.packList}>
                <li>Logo sur le site internet et supports imprimés (badges, livrets)</li>
                <li>Espace d'affichage de roll-up publicitaire sur le site</li>
                <li>Mention officielle dans les discours de remerciements</li>
                <li>Distribution de dépliants corporatifs aux participants</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact/CTA */}
        <div style={styles.contactBanner} className="glass">
          <h3 style={styles.contactTitle}>Rejoindre le réseau des partenaires</h3>
          <p style={styles.contactText}>
            Pour recevoir notre dossier de partenariat officiel ou discuter d'une collaboration sur mesure :
          </p>
          <div style={styles.contactDetails}>
            <p>📧 Email : <strong>partenaires@ojemao26.logtech.tech</strong></p>
            <p>📞 Secrétariat du comité : <strong>+229 90 00 00 00</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '4rem 0',
    minHeight: '80vh',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2rem',
    width: '100%',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center' as const,
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
    fontSize: '1.05rem',
    color: '#94A3B8',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '3rem',
    padding: '2.5rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.75rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#94A3B8',
    marginBottom: '2rem',
  },
  partnerList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  partnerRow: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    ':last-child': {
      borderBottom: 'none',
      paddingBottom: 0,
    },
    '@media (max-width: 600px)': {
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      gap: '0.75rem',
    },
  },
  logoBox: {
    width: '120px',
    height: '50px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  logoPlaceholder: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
  },
  partnerDetails: {},
  partnerName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '0.25rem',
  },
  partnerText: {
    fontSize: '0.85rem',
    color: '#94A3B8',
  },
  sponsorshipGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  packCard: {
    padding: '2rem',
    borderLeft: '4px solid var(--primary)',
  },
  packType: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '0.5rem',
  },
  packTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '1.25rem',
  },
  packList: {
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#94A3B8',
    lineHeight: '1.5',
  },
  contactBanner: {
    padding: '2.5rem',
    borderLeft: '4px solid var(--primary)',
  },
  contactTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '0.75rem',
  },
  contactText: {
    fontSize: '0.9rem',
    color: '#94A3B8',
    marginBottom: '1.25rem',
  },
  contactDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#FFFFFF',
  },
};
