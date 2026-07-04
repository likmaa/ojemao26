'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

type Accommodation = {
  id: string;
  name: string;
  description: string;
  distance: string;
};

type Contact = {
  id: string;
  label: string;
  value: string;
  icon_type: string;
};

export default function ContactPage() {
  const [hotes, setHotes] = useState<Accommodation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackHotes = [
    { id: '1', name: 'Hôtel Direct Aid Cotonou', description: 'Situé sur place, réservé en priorité aux délégations officielles OJEMAO de la sous-région.', distance: 'Sur le site' },
    { id: '2', name: 'Hôtel Résidence de la Paix', description: 'Chambres climatisées standard, Wi-Fi gratuit, petit-déjeuner inclus.', distance: 'À 5 minutes du site' },
    { id: '3', name: 'Hôtel Le Consulaire', description: 'Recommandé pour les cadres et universitaires. Service de navette disponible.', distance: 'À 10 minutes du site' },
  ];

  const fallbackContacts = [
    { id: '1', label: 'PÔLE ACCUEIL', value: '+229 90 00 00 01', icon_type: 'phone' },
    { id: '2', label: 'SECRÉTARIAT GÉNÉRAL', value: '+229 90 00 00 02', icon_type: 'phone' },
    { id: '3', label: 'EMAIL COORDINATION', value: 'coordination@ojemao26.logtech.tech', icon_type: 'email' },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: accData, error: accError } = await supabase.from('accommodations').select('*').order('created_at', { ascending: true });
        if (accError) throw accError;
        setHotes(accData && accData.length > 0 ? accData : fallbackHotes);

        const { data: conData, error: conError } = await supabase.from('contacts').select('*').order('created_at', { ascending: true });
        if (conError) throw conError;
        setContacts(conData && conData.length > 0 ? conData : fallbackContacts);
      } catch (error) {
        console.error('Error fetching data:', error);
        setHotes(fallbackHotes);
        setContacts(fallbackContacts);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={styles.page} className="animate-fade-in">
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
          <div style={styles.mainContent}>
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

            {loading ? (
              <p style={styles.text}>Chargement des hébergements...</p>
            ) : (
              <div style={styles.hotesList}>
                {hotes.map((h) => (
                  <div key={h.id} style={styles.hotelCard} className="hover-lift">
                    <div style={styles.hotelHeader}>
                      <h3 style={styles.hotelName}>{h.name}</h3>
                      <span style={styles.distBadge}>{h.distance}</span>
                    </div>
                    <p style={styles.hotelDesc}>{h.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Contacts */}
          <div style={styles.sidebar}>
            <div style={{...styles.sidebarBox, background: '#F8FAFC', borderRadius: '12px'}}>
              <h3 style={styles.sidebarTitle}>Comité d'Accueil</h3>
              <p style={styles.sidebarText}>
                Pour coordonner votre arrivée (accueil à l'aéroport ou à la gare routière) :
              </p>
              
              {loading ? (
                <p style={styles.sidebarText}>Chargement des contacts...</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {contacts.map((contact) => (
                    <div key={contact.id} style={styles.contactItem}>
                      <span style={styles.contactLabel}>
                        {contact.icon_type === 'phone' ? '📞' : contact.icon_type === 'email' ? '📧' : '📍'} {contact.label}
                      </span>
                      <span style={styles.contactVal}>
                        {contact.icon_type === 'phone' ? (
                          <a href={`tel:${contact.value.replace(/[^0-9+]/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.value}</a>
                        ) : contact.icon_type === 'email' ? (
                          <a href={`mailto:${contact.value}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contact.value}</a>
                        ) : contact.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--accent)', background: 'rgba(232, 131, 42, 0.05)', borderRadius: '12px' }}>
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
    background: '#FFFFFF',
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
    background: 'rgba(3, 67, 137, 0.08)',
    border: '1px solid rgba(3, 67, 137, 0.2)',
    color: 'var(--secondary)',
    marginBottom: '1rem',
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
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
    lineHeight: '1.6',
    maxWidth: '800px',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '2.5rem',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: '1 1 60%',
    minWidth: '280px',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1.25rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  locationBox: {
    background: '#F8FAFC',
    padding: '1.5rem',
    borderRadius: '12px',
  },
  venueName: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.15rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.25rem',
  },
  venueAddress: {
    fontSize: '0.85rem',
    color: 'var(--primary)',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: '#E2E8F0',
    margin: '2rem 0',
  },
  hotesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  hotelCard: {
    background: '#F8FAFC',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    borderRadius: '12px',
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
    color: 'var(--text-dark)',
  },
  distBadge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: 'var(--primary)',
    background: 'rgba(56, 165, 84, 0.1)',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
  },
  hotelDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  sidebar: {
    flex: '1 1 30%',
    minWidth: '280px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  sidebarBox: {
    padding: '2rem',
  },
  sidebarTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  sidebarText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  contactItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    marginBottom: '1rem',
  },
  contactLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  contactVal: {
    fontSize: '1rem',
    color: 'var(--text-dark)',
    fontWeight: '600',
  },
  ctaBtn: {
    width: '100%',
    textAlign: 'center' as const,
    justifyContent: 'center',
    background: 'var(--accent)',
    color: '#FFFFFF',
    border: 'none',
  }
};
