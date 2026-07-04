'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProgramItem {
  time: string;
  title: string;
  type: string;
  description?: string;
  volet: 'Débat' | 'CIF' | 'Congrès' | 'Tous';
}

export default function ProgrammePage() {
  const [activeTab, setActiveTab] = useState<'25' | '26' | '27' | '28'>('25');

  const schedule: Record<'25' | '26' | '27' | '28', ProgramItem[]> = {
    '25': [
      { time: '07:30 - 08:30', title: 'Accueil et enregistrement des participants', type: 'Accueil', volet: 'Débat' },
      { time: '08:30 - 08:45', title: 'Ouverture officielle', type: 'Cérémonie', description: 'Lecture de versets, hymne national, mot de bienvenue.', volet: 'Débat' },
      { time: '08:45 - 09:30', title: 'Allocutions officielles', type: 'Cérémonie', description: 'Interventions de la CEDEAO, UEMOA, UNDP, OCI, DICID, Ministres.', volet: 'Débat' },
      { time: '09:30 - 10:15', title: 'Présentation : Unité et engagement pour la paix et la stabilité', type: 'Conférence', description: 'Par SAR Lamido Sanusi Lamido.', volet: 'Débat' },
      { time: '10:15 - 10:45', title: 'Pause Café / Contexte et Justification', type: 'Pause', volet: 'Tous' },
      { time: '10:45 - 11:15', title: 'PANEL 1 : Terrorisme, radicalisation et extrémisme violent en Afrique de l\'Ouest', type: 'Panel', volet: 'Débat' },
      { time: '11:15 - 11:30', title: 'Pause Café', type: 'Pause', volet: 'Tous' },
      { time: '11:30 - 12:45', title: 'PANEL 2 : Rôle des intellectuels musulmans dans la construction de la paix', type: 'Panel', volet: 'Débat' },
      { time: '12:45 - 14:00', title: 'Pause déjeuner et prière', type: 'Pause', volet: 'Tous' },
      { time: '14:00 - 15:15', title: 'PANEL 3 : Associations et ONG islamiques face au terrorisme', type: 'Panel', volet: 'Débat' },
      { time: '15:15 - 15:30', title: 'Pause Café', type: 'Pause', volet: 'Tous' },
      { time: '15:30 - 16:30', title: 'Table ronde de synthèse : Stratégies concertées', type: 'Panel', volet: 'Débat' },
      { time: '16:30 - 17:00', title: 'Adoption des recommandations', type: 'Statutaire', volet: 'Débat' },
      { time: '17:00 - 17:30', title: 'Lecture du communiqué final & Cérémonie de clôture', type: 'Cérémonie', volet: 'Débat' },
    ],
    '26': [
      { time: '08:00 - 09:00', title: 'Accueil et installation des participants', type: 'Accueil', volet: 'Tous' },
      { time: '09:00 - 10:15', title: "Cérémonie officielle d'ouverture", type: 'Cérémonie', description: 'Allocutions protocolaires et lancement officiel du Congrès.', volet: 'Tous' },
      { time: '10:15 - 10:30', title: 'Pause-café', type: 'Pause', volet: 'Tous' },
      { time: '10:30 - 11:30', title: 'Conférence inaugurale : La communauté médiane dans le Coran et la Sunnah', type: 'Conférence', volet: 'CIF' },
      { time: '11:30 - 13:00', title: 'PANEL 1 : Conversations avec la Jeunesse Ouest-Africaine', type: 'Panel', volet: 'CIF' },
      { time: '13:00 - 14:30', title: 'Pause Déjeuner / Prière', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 16:00', title: 'PANEL 2 : Fondements théologiques et conceptuels de la Oumma Wasatiyya', type: 'Panel', volet: 'CIF' },
      { time: '16:00 - 17:30', title: 'PANEL 3 : Jeunesse musulmane & équilibre identitaire', type: 'Panel', volet: 'CIF' },
      { time: '17:30 - 18:00', title: 'Synthèse de la journée', type: 'Atelier', volet: 'Tous' },
      { time: '20:00 - 23:00', title: 'Dîner de bienvenue & Soirée Culturelle / Bilan BNC', type: 'Cérémonie', volet: 'Tous' },
    ],
    '27': [
      { time: '08:30 - 10:00', title: 'PANEL 4 : Médianité et prévention des extrémismes', type: 'Panel', volet: 'CIF' },
      { time: '10:00 - 11:30', title: 'PANEL 5 : Islam, citoyenneté et cohésion sociale en Afrique de l\'Ouest', type: 'Panel', volet: 'CIF' },
      { time: '11:30 - 11:45', title: 'Pause-café', type: 'Pause', volet: 'Tous' },
      { time: '11:45 - 13:00', title: 'PANEL 6 : Défis socio-économiques et autonomisation des jeunes', type: 'Panel', volet: 'CIF' },
      { time: '13:00 - 14:30', title: 'Pause-déjeuner', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 16:30', title: 'Ateliers de Formation : Première série (Leadership, Prévention, Communication)', type: 'Atelier', volet: 'CIF' },
      { time: '16:30 - 18:30', title: 'Ateliers de Formation : Deuxième série (Gestion des conflits, Entrepreneuriat)', type: 'Atelier', volet: 'CIF' },
      { time: '20:30 - 23:00', title: 'Élection OJEMAO (Congressistes) & Soirée culturelle (CIF)', type: 'Statutaire', volet: 'Tous' },
    ],
    '28': [
      { time: '08:30 - 10:00', title: 'PANEL 7 : Gouvernance et renforcement des organisations de jeunesse', type: 'Panel', volet: 'CIF' },
      { time: '10:00 - 10:30', title: 'Pause-café', type: 'Pause', volet: 'Tous' },
      { time: '10:30 - 12:00', title: 'SESSION STRATÉGIQUE : Élaboration du Plan d\'action régional 2026-2028', type: 'Statutaire', volet: 'Congrès' },
      { time: '12:00 - 13:00', title: 'Lecture des recommandations & adoption du Plan d\'action', type: 'Statutaire', volet: 'Congrès' },
      { time: '13:00 - 14:30', title: 'Pause-déjeuner', type: 'Pause', volet: 'Tous' },
      { time: '14:30 - 15:30', title: 'Mise en place du Cadre de coopération ouest-africain', type: 'Statutaire', volet: 'Congrès' },
      { time: '15:30 - 16:30', title: 'Cérémonie de clôture Officielle', type: 'Cérémonie', volet: 'Tous' },
      { time: '16:30 - 19:00', title: 'Tourisme et Visites de la ville (Facultatif)', type: 'Atelier', volet: 'Tous' },
    ],
  };

  const getVoletBadgeStyle = (volet: string) => {
    switch (volet) {
      case 'Débat': return { background: 'rgba(56, 165, 84, 0.08)', border: '1px solid rgba(56, 165, 84, 0.2)', color: 'var(--primary)' };
      case 'CIF': return { background: 'rgba(232, 131, 42, 0.08)', border: '1px solid rgba(232, 131, 42, 0.2)', color: 'var(--accent)' };
      case 'Congrès': return { background: 'rgba(3, 67, 137, 0.08)', border: '1px solid rgba(3, 67, 137, 0.2)', color: 'var(--secondary)' };
      default: return { background: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--text-muted)' };
    }
  };

  return (
    <div style={styles.page} className="animate-fade-in">
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
              backgroundColor: activeTab === '25' ? 'var(--primary)' : '#F8FAFC',
              borderColor: activeTab === '25' ? 'var(--primary)' : '#E2E8F0',
              color: activeTab === '25' ? '#FFFFFF' : 'var(--text-dark)',
            }}
          >
            <span style={styles.tabDate}>Sam. 25 Juillet</span>
            <span style={styles.tabName}>Débat de Cotonou</span>
          </button>

          <button
            onClick={() => setActiveTab('26')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '26' ? 'var(--secondary)' : '#F8FAFC',
              borderColor: activeTab === '26' ? 'var(--secondary)' : '#E2E8F0',
              color: activeTab === '26' ? '#FFFFFF' : 'var(--text-dark)',
            }}
          >
            <span style={styles.tabDate}>Dim. 26 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J1)</span>
          </button>

          <button
            onClick={() => setActiveTab('27')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '27' ? 'var(--secondary)' : '#F8FAFC',
              borderColor: activeTab === '27' ? 'var(--secondary)' : '#E2E8F0',
              color: activeTab === '27' ? '#FFFFFF' : 'var(--text-dark)',
            }}
          >
            <span style={styles.tabDate}>Lun. 27 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J2)</span>
          </button>

          <button
            onClick={() => setActiveTab('28')}
            style={{
              ...styles.tabBtn,
              backgroundColor: activeTab === '28' ? 'var(--secondary)' : '#F8FAFC',
              borderColor: activeTab === '28' ? 'var(--secondary)' : '#E2E8F0',
              color: activeTab === '28' ? '#FFFFFF' : 'var(--text-dark)',
            }}
          >
            <span style={styles.tabDate}>Mar. 28 Juillet</span>
            <span style={styles.tabName}>Congrès & CIF (J3)</span>
          </button>
        </div>

        {/* Schedule List */}
        <section style={styles.scheduleList} className="glass">
          {schedule[activeTab].map((item, idx) => (
            <div key={idx} className="schedule-item" style={styles.scheduleItem}>
              {/* Time column */}
              <div className="time-col" style={styles.timeCol}>
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
    background: '#FFFFFF',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    width: '100%',
  },
  header: {
    marginBottom: '3rem',
    textAlign: 'center' as const,
  },
  badge: {
    background: 'rgba(3, 67, 137, 0.08)',
    border: '1px solid rgba(3, 67, 137, 0.2)',
    color: 'var(--secondary)',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
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
    cursor: 'pointer',
    textAlign: 'center' as const,
    borderRadius: '0px',
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
    borderBottom: '1px solid #F1F5F9',
    padding: '2rem',
    alignItems: 'start',
  },
  timeCol: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    color: 'var(--text-dark)',
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
    color: 'var(--text-dark)',
    lineHeight: '1.4',
  },
  itemDescription: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginTop: '0.25rem',
  },
  ctaWrapper: {
    textAlign: 'center' as const,
    marginTop: '3rem',
    padding: '2rem',
    border: '1px dashed #CBD5E1',
  },
  ctaText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  ctaBtn: {},
};
