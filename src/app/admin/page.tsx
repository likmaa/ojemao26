'use client';

import Link from 'next/link';
import { FaUsers, FaMicrophone, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <h1 style={styles.title}>Tableau de bord</h1>
        <p style={styles.subtitle}>Bienvenue sur l'administration de OJEMAO 26</p>
      </div>

      <div style={styles.grid}>
        {/* Card 1: Inscriptions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(56, 165, 84, 0.1)', color: 'var(--primary)' }}>
              <FaUsers size={24} />
            </div>
            <h2 style={styles.cardTitle}>Inscriptions</h2>
          </div>
          <p style={styles.cardDesc}>Gérez les participants, validez les paiements et exportez les données.</p>
          <Link href="/admin/inscriptions" style={styles.cardLink}>
            Voir les inscriptions <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Card 2: Intervenants */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(232, 131, 42, 0.1)', color: 'var(--accent)' }}>
              <FaMicrophone size={24} />
            </div>
            <h2 style={styles.cardTitle}>Intervenants</h2>
          </div>
          <p style={styles.cardDesc}>Ajoutez, modifiez ou supprimez les intervenants affichés sur le site.</p>
          <Link href="/admin/intervenants" style={styles.cardLink}>
            Gérer les intervenants <FaArrowRight size={12} />
          </Link>
        </div>

        {/* Card 3: Finances (Coming Soon) */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={{ ...styles.iconWrapper, backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
              <FaMoneyBillWave size={24} />
            </div>
            <h2 style={styles.cardTitle}>Finances</h2>
          </div>
          <p style={styles.cardDesc}>Suivez les paiements MoMo, Wave et cartes bancaires.</p>
          <span style={styles.comingSoon}>Bientôt disponible</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#64748B',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    color: '#475569',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  cardLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--primary)',
    fontWeight: '600',
    fontSize: '0.9rem',
    textDecoration: 'none',
  },
  comingSoon: {
    display: 'inline-block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#94A3B8',
    backgroundColor: '#F1F5F9',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    alignSelf: 'flex-start',
  }
};
