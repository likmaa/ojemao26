import Link from 'next/link';

interface Speaker {
  name: string;
  role: string;
  origin: string; // Institution / Country
  volet: 'Débat' | 'CIF' | 'Tous';
}

export default function IntervenantsPage() {
  const speakers: Speaker[] = [
    {
      name: 'Dr. Abdoulaye Salifou',
      role: 'Universitaire, Enseignant-Chercheur en Sciences de l\'Éducation et Sociologie politique',
      origin: 'Université d\'Abomey-Calavi (UAC) | Bénin',
      volet: 'Débat',
    },
    {
      name: 'M. Mouhammadou Sylla',
      role: 'Coordonnateur Sous-régional de l\'OJEMAO',
      origin: 'Secrétariat Permanent | Sénégal',
      volet: 'CIF',
    },
    {
      name: 'Dr. Ibrahim Al-Hassan',
      role: 'Spécialiste en Droit Islamique et Droits Humains',
      origin: 'Université de Niamey | Niger',
      volet: 'Débat',
    },
    {
      name: 'El-Hadj Issa Gounou',
      role: 'Représentant des Intellectuels et Cadres Musulmans du Bénin',
      origin: 'Association des Intellectuels Musulmans (AIMB) | Bénin',
      volet: 'Débat',
    },
    {
      name: 'Mme Fatoumata Diallo',
      role: 'Consultante en Leadership Associatif et Autonomisation des Jeunes',
      origin: 'Formatrice Régionale | Mali',
      volet: 'CIF',
    },
    {
      name: 'M. Abdul-Malik Kouton',
      role: 'Président d\'ACEEMUB / Organisateur Local',
      origin: 'Comité National d\'Accueil | Bénin',
      volet: 'Tous',
    },
  ];

  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Intervenants & Panelistes</span>
          <h1 style={styles.title}>Les Personnalités Invitées</h1>
          <p style={styles.subtitle}>
            Retrouvez les conférenciers, universitaires et leaders de la jeunesse musulmane d'Afrique de l'Ouest.
          </p>
        </header>

        {/* Speakers Grid */}
        <section style={styles.grid}>
          {speakers.map((speaker, idx) => (
            <div key={idx} style={styles.card} className="glass">
              <div style={styles.cardHeader}>
                {/* Visual placeholder box to look professional without actual photos */}
                <div style={styles.avatarPlaceholder}>
                  <span style={styles.avatarInitials}>
                    {speaker.name.split(' ').slice(-2).map(n => n[0]).join('')}
                  </span>
                </div>
                <div style={styles.meta}>
                  <span 
                    style={{
                      ...styles.voletBadge,
                      background: speaker.volet === 'Débat' ? 'rgba(56, 165, 84, 0.15)' : 'rgba(232, 131, 42, 0.15)',
                      color: speaker.volet === 'Débat' ? '#4ADE80' : '#FDBA74',
                      border: speaker.volet === 'Débat' ? '1px solid rgba(56, 165, 84, 0.3)' : '1px solid rgba(232, 131, 42, 0.3)',
                    }}
                  >
                    {speaker.volet === 'Tous' ? 'Débat & CIF' : speaker.volet}
                  </span>
                </div>
              </div>

              <div style={styles.cardBody}>
                <h3 style={styles.name}>{speaker.name}</h3>
                <p style={styles.role}>{speaker.role}</p>
                <div style={styles.divider}></div>
                <p style={styles.origin}>📍 {speaker.origin}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Bottom Banner */}
        <div style={styles.bottomBanner} className="glass">
          <p style={styles.bottomText}>
            D'autres conférenciers et panélistes de la sous-région (Côte d'Ivoire, Burkina Faso, Togo, Sénégal) seront bientôt ajoutés au fur et à mesure des confirmations de mandat de chaque délégation nationale.
          </p>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    width: '100%',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center' as const,
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
    maxWidth: '700px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem',
  },
  card: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    borderRadius: '0px', // Strict flat
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    width: '64px',
    height: '64px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0px', // Sharp
  },
  avatarInitials: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    color: 'var(--accent)',
    textTransform: 'uppercase' as const,
  },
  meta: {},
  voletBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.2rem 0.6rem',
    borderRadius: '0px',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  name: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  role: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: '#94A3B8',
    minHeight: '60px',
  },
  divider: {
    width: '30px',
    height: '2px',
    background: 'var(--accent)',
    margin: '0.5rem 0',
  },
  origin: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#E2E8F0',
  },
  bottomBanner: {
    padding: '2rem',
    textAlign: 'center' as const,
    border: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  bottomText: {
    fontSize: '0.85rem',
    lineHeight: '1.6',
    color: '#94A3B8',
    maxWidth: '800px',
    margin: '0 auto',
  },
};
