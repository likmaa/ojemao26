import Image from 'next/image';
import Link from 'next/link';

export default function PartenairesPage() {
  const logos = [
    '307697944_422326529983064_7008464641129287907_n-removebg-preview.png',
    '310606857_6168992549794905_2704647731196745770_n-removebg-preview.png',
    'télécharger-removebg-preview (2).png',
    'télécharger__1_-removebg-preview (2).png',
    'télécharger__2_-removebg-preview.png',
    'télécharger__3_-removebg-preview (1).png',
    'télécharger__3_-removebg-preview.png',
    'télécharger__4_-removebg-preview.png'
  ];

  const organizers = [
    { name: 'OJEMAO', logo: '/images/organisateurs/logo_ojemao.png', role: 'Organisation de Tutelle Régionale', details: "Organisation de la Jeunesse Musulmane en Afrique de l'Ouest" },
    { name: 'AIMB', logo: '/images/organisateurs/logo_aimb.png', role: 'Organisateur Local et stratégique', details: 'Amicale des Intellectuels Musulmans du Bénin' },
    { name: 'ACEEMUB (UIB)', logo: '/images/organisateurs/logo_aceemub.png', role: 'Coorganisateur Local & Logistique', details: 'Association Culturelle et des Élèves et Étudiants Musulmans du Bénin' },
    { name: 'RAI-Bénin', logo: '/images/organisateurs/logo_raibenin.png', role: 'Co-porteur Citoyen & Mobilisation', details: 'Réseau des Associations et ONGs Islamiques du Bénin' },
  ];

  return (
    <div className="animate-fade-in" style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <span className="badge-solid" style={styles.badge}>Ils nous soutiennent</span>
          <h1 style={styles.title}>Nos Partenaires</h1>
          <p style={styles.subtitle}>
            Le Débat de Cotonou et le Congrès CIF sont rendus possibles grâce au soutien de nos précieux partenaires institutionnels, médias et privés.
          </p>
        </header>

        {/* Organizers Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Comité d'Organisation Principal</h2>
          <div style={styles.partnerList}>
            {organizers.map((p, idx) => (
              <div key={idx} style={styles.partnerRow}>
                <div style={styles.logoBox}>
                  <Image src={p.logo} alt={p.name} fill style={{ objectFit: 'contain' }} />
                </div>
                <div style={styles.partnerDetails}>
                  <h3 style={styles.partnerRole}>{p.role}</h3>
                  <strong style={styles.partnerName}>{p.name}</strong>
                  <p style={styles.partnerText}>{p.details}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <div className="marquee-container">
            <div className="marquee-track">
              {[...logos, ...logos].map((logo, index) => (
                <div key={index} className="marquee-item" style={styles.logoCard}>
                  <Image
                    src={`/partenaires/${logo}`}
                    alt={`Partenaire ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain', padding: '1rem' }}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship Grid */}
        <section style={styles.sponsorshipSection}>
          <div style={styles.sponsorshipHeader}>
            <h2 style={styles.sectionTitle}>Grille de Sponsoring & Visibilité</h2>
            <p style={styles.sponsorshipText}>
              Devenez partenaire officiel de ces événements phares d'envergure sous-régionale et bénéficiez d'une visibilité ciblée auprès de centaines de cadres, d'universitaires, d'intellectuels et de jeunes leaders d'Afrique de l'Ouest.
            </p>
          </div>

          <div style={styles.sponsorshipGrid}>
            {/* Pack 1 */}
            <div style={styles.packCard} className="hover-lift">
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
            <div style={{ ...styles.packCard, borderTop: '4px solid var(--accent)' }} className="hover-lift">
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

        <div style={styles.callToAction}>
          <h2 style={styles.ctaTitle}>Devenir Partenaire</h2>
          <p style={styles.ctaText}>
            Vous souhaitez associer l'image de votre organisation à un événement prestigieux de portée internationale ?
          </p>
          <a 
            href="https://wa.me/2290169506246?text=Bonjour,%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20les%20opportunit%C3%A9s%20de%20partenariat%20pour%20l'OJEMAO%202026." 
            target="_blank" 
            rel="noopener noreferrer" 
            style={styles.ctaButton} 
            className="btn"
          >
            Contactez-nous sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '4rem 1.5rem',
    backgroundColor: '#F8FAFC',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '4rem',
  },
  badge: {
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  section: {
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '2rem',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '0.75rem',
  },
  partnerList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  partnerRow: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    paddingBottom: '1.25rem',
    borderBottom: '1px solid #F1F5F9',
  },
  logoBox: {
    position: 'relative' as const,
    width: '120px',
    height: '80px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: '0.5rem',
  },
  partnerDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  partnerRole: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  partnerName: {
    fontSize: '1rem',
    color: 'var(--text-dark)',
    marginBottom: '0.25rem',
  },
  partnerText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '2rem',
    alignItems: 'center',
    justifyItems: 'center',
  },
  logoCard: {
    position: 'relative' as const,
    width: '250px',
    aspectRatio: '3/2',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
  },
  sponsorshipSection: {
    padding: '4rem 0',
    borderTop: '1px solid #E2E8F0',
  },
  sponsorshipHeader: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  sponsorshipText: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  sponsorshipGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  packCard: {
    backgroundColor: '#FFFFFF',
    padding: '2.5rem',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    borderTop: '4px solid var(--primary)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  packType: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--primary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '0.5rem',
  },
  packTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '1.5rem',
  },
  packList: {
    listStyleType: 'disc',
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  callToAction: {
    backgroundColor: 'var(--text-dark)',
    color: '#FFFFFF',
    padding: '4rem 2rem',
    borderRadius: '24px',
    textAlign: 'center' as const,
    marginTop: '6rem',
    backgroundImage: 'linear-gradient(135deg, #0A1628 0%, #1E293B 100%)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '1rem',
    fontFamily: 'var(--font-title)',
    color: '#FFFFFF',
  },
  ctaText: {
    fontSize: '1.1rem',
    color: '#94A3B8',
    maxWidth: '600px',
    margin: '0 auto 2.5rem auto',
    lineHeight: '1.6',
  },
  ctaButton: {
    display: 'inline-block',
    backgroundColor: 'var(--accent)',
    color: '#FFFFFF',
    padding: '1rem 2.5rem',
    borderRadius: '50px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
  }
};
