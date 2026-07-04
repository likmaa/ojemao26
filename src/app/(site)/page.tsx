import Link from 'next/link';
import Image from 'next/image';
import Countdown from '../components/Countdown';
import HeroCarousel from '../components/HeroCarousel';
import { IoLocationOutline, IoCalendarOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { supabase } from '@/app/lib/supabase';

export const revalidate = 0;

export default async function Home() {
  const { data: fetchedEvents } = await supabase.from('events').select('*');
  
  const debatImage = fetchedEvents?.find(e => e.title === 'debat')?.image_url || '/images/affiche-d1.webp';
  const cifImage = fetchedEvents?.find(e => e.title === 'cif')?.image_url || '/images/affiche-co1.webp';

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION - REPLACED WITH CAROUSEL */}
      <HeroCarousel />

      {/* FLAGS SECTION */}
      <section style={styles.flagsSection}>
        <div style={styles.flagsContainer}>
          <div style={styles.flagsList}>
            <Image src="https://flagcdn.com/w160/bj.png" alt="Bénin" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/bf.png" alt="Burkina Faso" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/ci.png" alt="Côte d'Ivoire" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/ml.png" alt="Mali" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/ne.png" alt="Niger" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/tg.png" alt="Togo" width={60} height={40} style={styles.flag} />
            <Image src="https://flagcdn.com/w160/sn.png" alt="Sénégal" width={60} height={40} style={styles.flag} />
          </div>
          <p style={styles.flagsText}>OJEMAO pour une action unitaire.</p>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Countdown />
        </div>
      </section>

      {/* EVENTS OVERVIEW SECTION */}
      <section style={styles.eventsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Les temps forts de l'événement</h2>
          <p style={styles.sectionSubtitle}>
            Une programmation riche répartie sur 4 jours intenses.
          </p>
        </div>

        <div style={styles.eventsGrid}>
          {/* Débat de Cotonou */}
          <div style={styles.eventCard}>
            <div style={styles.eventImageContainer}>
              <Image src={debatImage} alt="Affiche Débat de Cotonou" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={styles.eventCardContent}>
              <div style={styles.eventCardHeader}>
                <span style={styles.eventBadgePrimary}>25 Juillet 2026</span>
              </div>
              <h3 style={styles.eventCardTitle}>Débat de Cotonou (D2C26)</h3>
              <p style={styles.eventCardText}>
                Une journée d'échanges intellectuels : « Unité et engagement pour la paix, la sécurité et la stabilité des États : responsabilités des intellectuels face au terrorisme ».
              </p>
              <Link href="/evenement/debat" style={styles.eventLink}>
                En savoir plus <IoArrowForwardOutline />
              </Link>
            </div>
          </div>

          {/* Colloque CIF & Congrès */}
          <div style={styles.eventCard}>
            <div style={styles.eventImageContainer}>
              <Image src={cifImage} alt="Affiche Colloque CIF et Congrès" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={styles.eventCardContent}>
              <div style={styles.eventCardHeader}>
                <span style={styles.eventBadgeAccent}>26 - 28 Juillet 2026</span>
              </div>
              <h3 style={styles.eventCardTitle}>Colloque (CIF) & Congrès</h3>
              <p style={styles.eventCardText}>
                Trois jours intenses combinant le Colloque International sur le thème de la « communauté médiane » et l'Assemblée Générale de l'OJEMAO.
              </p>
              <Link href="/evenement/cif" style={styles.eventLink}>
                En savoir plus <IoArrowForwardOutline />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ne manquez pas ce grand rendez-vous</h2>
          <p style={styles.ctaSubtitle}>
            Les places pour le Débat de Cotonou et le Colloque International sont limitées. Enregistrez-vous dès aujourd'hui pour garantir votre participation.
          </p>
          <Link href="/inscription" className="btn btn-accent" style={styles.ctaButtonFinal}>
            Accéder au portail d'inscription
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  flagsSection: {
    padding: '1.5rem',
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
  },
  flagsContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.75rem',
  },
  flagsList: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  flag: {
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  flagsText: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  eventsSection: {
    padding: '6rem 1.5rem',
    background: '#F8FAFC',
  },
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.25rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  sectionSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
  },
  eventsGrid: {
    maxWidth: '1400px', // Wider layout
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
  },
  eventCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  eventImageContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '250px',
  },
  eventCardContent: {
    padding: '2.5rem 2rem',
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
  },
  eventCardHeader: {
    marginBottom: '1.25rem',
  },
  eventBadgePrimary: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--primary)',
    background: 'rgba(56, 165, 84, 0.08)',
    border: '1px solid rgba(56, 165, 84, 0.2)',
    padding: '0.3rem 0.75rem',
    textTransform: 'uppercase' as const,
  },
  eventBadgeAccent: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--accent)',
    background: 'rgba(232, 131, 42, 0.08)',
    border: '1px solid rgba(232, 131, 42, 0.2)',
    padding: '0.3rem 0.75rem',
    textTransform: 'uppercase' as const,
  },
  eventBadgeSecondary: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--secondary)',
    background: 'rgba(3, 67, 137, 0.08)',
    border: '1px solid rgba(3, 67, 137, 0.2)',
    padding: '0.3rem 0.75rem',
    textTransform: 'uppercase' as const,
  },
  eventCardTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  eventCardText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    flexGrow: 1,
    marginBottom: '2rem',
  },
  eventLink: {
    fontWeight: '600',
    color: 'var(--text-dark)',
    fontSize: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  ctaSection: {
    padding: '6rem 1.5rem',
    background: 'rgba(232, 131, 42, 0.03)',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
    textAlign: 'center' as const,
  },
  ctaContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  ctaSubtitle: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    marginBottom: '2.5rem',
  },
  ctaButtonFinal: {
    padding: '1.2rem 2.5rem',
    fontSize: '1.1rem',
  },
};
