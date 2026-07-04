'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProgramItem {
  time: string;
  title: string;
  type: string; // 'Cérémonie' | 'Conférence' | 'Panel' | 'Atelier' | 'Statutaire' | 'Pause'
  description?: string;
  volet: 'Débat' | 'CIF' | 'Congrès' | 'Tous';
}

export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState<'25' | '26' | '27' | '28'>('25');

  const schedule: Record<'25' | '26' | '27' | '28', ProgramItem[]> = {
    '25': [
      { time: '08:00 - 08:30', title: 'Accueil et Enregistrement des participants', type: 'Accueil', volet: 'Débat' },
      { time: '08:30 - 09:30', title: "Cérémonie d'Ouverture Officielle du Débat de Cotonou", type: 'Cérémonie', description: 'Allocutions des autorités locales, des partenaires et des comités d\'organisation.', volet: 'Débat' },
      { time: '09:30 - 10:30', title: 'Conférence Cadrage : Responsabilités des intellectuels musulmans face aux défis sécuritaires contemporains', type: 'Conférence', volet: 'Débat' },
      { time: '10:30 - 11:00', title: 'Pause Café / Réseautage', type: 'Pause', volet: 'Tous' },
      { time: '11:00 - 13:00', title: 'Panel 1 : Analyse des causes et dynamiques de l\'extrémisme violent en Afrique de l\'Ouest', type: 'Panel', description: 'Présentations croisées d\'universitaires et de chercheurs en géopolitique.', volet: 'Débat' },
      { time: '13:00 - 14:30', title: 'Pause Déjeuner & Prière', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 16:30', title: 'Panel 2 : Rôle et contribution opérationnelle des ONG et associations islamiques dans la prévention', type: 'Panel', description: 'Partage de bonnes pratiques et présentation d\'études de cas locales.', volet: 'Débat' },
      { time: '16:30 - 17:30', title: 'Panel 3 & Lecture des Recommandations du Débat (D2C26)', type: 'Panel', description: 'Synthèse des travaux et adoption de la feuille de route du pôle de réflexion.', volet: 'Débat' },
    ],
    '26': [
      { time: '08:00 - 09:00', title: 'Accueil et Enregistrement des Délégués et Participants CIF', type: 'Accueil', volet: 'Tous' },
      { time: '09:00 - 11:00', title: "Cérémonie d'Ouverture Conjointe du Congrès OJEMAO & du Colloque (CIF)", type: 'Cérémonie', description: 'Allocutions protocolaires en présence de délégations ministérielles de la sous-région.', volet: 'Tous' },
      { time: '11:00 - 11:30', title: 'Pause Café / Photo de famille officielle', type: 'Pause', volet: 'Tous' },
      { time: '11:30 - 13:00', title: 'Conférence Inaugurale : La communauté médiane (Oumma Wasatiyya) - Fondements coraniques et réalités ouest-africaines', type: 'Conférence', volet: 'CIF' },
      { time: '13:00 - 14:30', title: 'Pause Déjeuner & Prière', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 16:30', title: 'Session Statutaire Congrès : Présentation et adoption du rapport moral et d\'activités du Bureau Sortant', type: 'Statutaire', volet: 'Congrès' },
      { time: '14:30 - 17:00', title: 'Colloque (CIF) - Panel 1 : Les enjeux de la radicalisation chez les jeunes et l\'alternative éducative islamique', type: 'Panel', volet: 'CIF' },
    ],
    '27': [
      { time: '08:30 - 10:30', title: 'Colloque (CIF) - Panel 2 : Pratiques de la jeunesse musulmane, engagement citoyen et réseaux sociaux', type: 'Panel', volet: 'CIF' },
      { time: '08:30 - 11:00', title: 'Congrès OJEMAO : Travaux en commissions thématiques (Réforme des textes, Plan stratégique)', type: 'Statutaire', volet: 'Congrès' },
      { time: '10:30 - 11:00', title: 'Pause Café', type: 'Pause', volet: 'Tous' },
      { time: '11:00 - 13:00', title: 'Colloque (CIF) - Ateliers pratiques : Leadership, Gestion de projet et Communication associative', type: 'Atelier', description: 'Sessions parallèles interactives en petits groupes.', volet: 'CIF' },
      { time: '13:00 - 14:30', title: 'Pause Déjeuner & Prière', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 17:30', title: 'Congrès OJEMAO : Restitution des commissions et débats en plénière', type: 'Statutaire', volet: 'Congrès' },
      { time: '14:30 - 17:00', title: 'Colloque (CIF) - Conférence : L\'entreprenariat des jeunes comme rempart contre l\'oisiveté et l\'extrémisme', type: 'Conférence', volet: 'CIF' },
    ],
    '28': [
      { time: '08:30 - 10:30', title: 'Colloque (CIF) - Session de synthèse et recommandations finales des jeunes', type: 'Panel', volet: 'CIF' },
      { time: '08:30 - 11:00', title: 'Congrès OJEMAO - Plénière élective : Élection du nouveau bureau exécutif et passation de charge', type: 'Statutaire', volet: 'Congrès' },
      { time: '10:30 - 11:00', title: 'Pause Café', type: 'Pause', volet: 'Tous' },
      { time: '11:00 - 13:00', title: 'Cérémonie de Clôture Officielle, Lecture de la Déclaration finale de Cotonou', type: 'Cérémonie', description: 'Remise des attestations aux participants du CIF et clôture solennelle du Congrès.', volet: 'Tous' },
      { time: '13:00', title: 'Déjeuner de clôture & Départ des délégations', type: 'Pause', volet: 'Tous' },
    ],
  };

  const getVoletBadgeStyle = (volet: string) => {
    switch (volet) {
      case 'Débat': return { background: 'rgba(56, 165, 84, 0.15)', border: '1px solid rgba(56, 165, 84, 0.3)', color: '#4ADE80' };
      case 'CIF': return { background: 'rgba(232, 131, 42, 0.15)', border: '1px solid rgba(232, 131, 42, 0.3)', color: '#FDBA74' };
      case 'Congrès': return { background: 'rgba(3, 67, 137, 0.3)', border: '1px solid rgba(3, 67, 137, 0.5)', color: '#60A5FA' };
      default: return { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#E2E8F0' };
    }
  };

  return (
    <div style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.container}>
        <header style={styles.header}>
          <span style={styles.badge} className="badge-solid">Agenda officiel</span>
          <h1 style={styles.title}>Le Programme Détaillé</h1>
          <p style={styles.subtitle}>
            Découvrez le chronogramme complet des activités, conférences, panels et séances statutaires.
          </p>
        </header>

        {/* Tab Selectors */}
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('25')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '25' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activeTab === '25' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={styles.tabDate}>Sam. 25 Juillet</span>
            <span style={styles.tabName}>Débat de Cotonou</span>
          </button>

          <button
            onClick={() => setActiveTab('26')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '26' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activeTab === '26' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={styles.tabDate}>Dim. 26 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J1)</span>
          </button>

          <button
            onClick={() => setActiveTab('27')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '27' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activeTab === '27' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={styles.tabDate}>Lun. 27 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J2)</span>
          </button>

          <button
            onClick={() => setActiveTab('28')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '28' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.03)',
              borderColor: activeTab === '28' ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={styles.tabDate}>Mar. 28 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J3)</span>
          </button>
        </div>

        {/* Schedule List */}
        <section style={styles.scheduleList} className="glass">
          {schedule[activeTab].map((item, idx) => (
            <div key={idx} style={styles.scheduleItem}>
              {/* Time column */}
              <div style={styles.timeCol}>
                <span style={styles.timeText}>{item.time}</span>
              </div>
              
              {/* Content column */}
              <div style={styles.contentCol}>
                <div style={styles.metaRow}>
                  <span style={styles.itemType}>{item.type}</span>
                  <span style={{ ...styles.itemVolet, ...getVoletBadgeStyle(item.volet) }}>
                    Volet: {item.volet}
                  </span>
                </div>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                {item.description && <p style={styles.itemDescription}>{item.description}</p>}
              </div>
            </div>
          ))}
        </section>

        {/* Action button */}
        <div style={styles.ctaWrapper}>
          <p style={styles.ctaText}>
            Vous souhaitez prendre part à ces travaux ? Enregistrez votre présence dès maintenant.
          </p>
          <Link href="/inscription" className="btn btn-accent" style={styles.ctaBtn}>
            Accéder à l'inscription
          </Link>
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
    fontSize: '1rem',
    color: '#94A3B8',
    lineHeight: '1.6',
  },
  tabsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  tabBtn: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '1.25rem 1rem',
    border: '1px solid',
    color: '#FFFFFF',
    cursor: 'pointer',
    textAlign: 'center' as const,
    borderRadius: '0px', // Strict flat
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  tabDate: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.95rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  tabName: {
    fontSize: '0.75rem',
    opacity: 0.8,
  },
  scheduleList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  scheduleItem: {
    display: 'grid',
    gridTemplateColumns: '180px 1fr',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    alignItems: 'start',
    ':last-child': {
      borderBottom: 'none',
    },
    '@media (max-width: 700px)': {
      gridTemplateColumns: '1fr',
      gap: '1rem',
      padding: '1.5rem',
    },
  },
  timeCol: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: '1.05rem',
  },
  timeText: {
    borderLeft: '3px solid var(--accent)',
    paddingLeft: '0.75rem',
  },
  contentCol: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
  },
  itemType: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  itemVolet: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.15rem 0.5rem',
    borderRadius: '0px',
  },
  itemTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: '1.4',
  },
  itemDescription: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    lineHeight: '1.5',
    marginTop: '0.25rem',
  },
  ctaWrapper: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    padding: '2rem',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
  },
  ctaText: {
    fontSize: '0.9rem',
    color: '#94A3B8',
    marginBottom: '1.25rem',
  },
  ctaBtn: {},
};
