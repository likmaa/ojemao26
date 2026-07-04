'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { FaSpinner } from 'react-icons/fa';

type Category = 'Tous' | 'Dignitaires' | 'Experts' | 'Leaders';

interface Speaker {
  id: string;
  name: string;
  title: string;
  role: string;
  category: string;
  image_url: string;
}

export default function IntervenantsPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('Tous');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setSpeakers(data);
      } else {
        console.error('Error fetching speakers:', error);
      }
      setLoading(false);
    };
    
    fetchSpeakers();
  }, []);

  const filteredSpeakers = speakers.filter(
    (speaker) => activeFilter === 'Tous' || speaker.category === activeFilter || (activeFilter === 'Leaders' && speaker.category.includes('Leaders'))
  );

  return (
    <div className="animate-fade-in" style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <span className="badge-solid" style={styles.badge}>Délégations & Modérateurs</span>
          <h1 style={styles.title}>Les Intervenants</h1>
          <p style={styles.subtitle}>
            Découvrez les personnalités, experts et dignitaires qui animeront le Débat de Cotonou et le Congrès CIF.
          </p>
        </header>

        {/* Filters */}
        <div style={styles.filters}>
          {(['Tous', 'Dignitaires', 'Experts', 'Leaders'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              style={{
                ...styles.filterBtn,
                background: activeFilter === category ? 'var(--primary)' : 'transparent',
                color: activeFilter === category ? '#FFFFFF' : 'var(--text-dark)',
                borderColor: activeFilter === category ? 'var(--primary)' : '#E2E8F0',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loading}>
            <FaSpinner className="fa-spin" size={32} color="var(--primary)" />
            <p style={{ marginTop: '1rem', color: '#64748B' }}>Chargement des intervenants...</p>
          </div>
        )}

        {/* Grid */}
        {!loading && speakers.length > 0 && (
          <div style={styles.grid} className="speakers-grid">
            {filteredSpeakers.map((speaker) => (
              <div key={speaker.id} style={styles.card} className="speaker-card">
                <div style={styles.imageWrapper}>
                  <Image
                    src={speaker.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=E2E8F0`}
                    alt={speaker.name}
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div style={styles.cardContent}>
                  <span style={styles.categoryBadge}>{speaker.category}</span>
                  <h3 style={styles.name}>{speaker.name}</h3>
                  <p style={styles.role}>{speaker.role}</p>
                  <p style={styles.titleText}>{speaker.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && speakers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
            Aucun intervenant n'a été ajouté pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '4rem 0',
    minHeight: '80vh',
    background: '#F8FAFC',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    width: '100%',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '3rem',
  },
  badge: {
    background: 'rgba(56, 165, 84, 0.08)',
    border: '1px solid rgba(56, 165, 84, 0.2)',
    color: 'var(--primary)',
    marginBottom: '1rem',
    display: 'inline-block',
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
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
    flexWrap: 'wrap' as const,
  },
  filterBtn: {
    padding: '0.6rem 1.2rem',
    borderRadius: '50px',
    border: '1px solid',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  imageWrapper: {
    position: 'relative' as const,
    width: '100%',
    height: '320px',
    backgroundColor: '#E2E8F0',
  },
  cardContent: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
  },
  categoryBadge: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: '700',
    color: 'var(--accent)',
    marginBottom: '0.5rem',
  },
  name: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.25rem',
  },
  role: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--primary)',
    marginBottom: '0.5rem',
  },
  titleText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
  }
};
