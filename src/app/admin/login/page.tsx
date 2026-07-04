'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAdmin } from '@/app/lib/actions';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(authenticateAdmin, null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
    }
  }, [state, router]);

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card} className="glass">
        <div style={styles.header}>
          <span style={styles.badge}>Administration</span>
          <h1 style={styles.title}>OJEMAO 2026</h1>
          <p style={styles.subtitle}>Espace de gestion des inscriptions</p>
        </div>

        <form action={formAction} style={styles.form}>
          {state?.error && (
            <div style={styles.errorAlert}>
              ❌ {state.error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              Mot de passe d'administration *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="Entrez le mot de passe global"
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  paddingRight: '3rem',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px'
                }}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn btn-primary"
            style={styles.submitBtn}
          >
            {pending ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  card: {
    width: '100%',
    maxWidth: '450px',
    padding: '3rem 2.5rem',
    borderRadius: '8px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  badge: {
    background: 'rgba(56, 165, 84, 0.1)',
    color: 'var(--primary)',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginTop: '1rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  errorAlert: {
    background: '#FEF2F2',
    borderLeft: '4px solid #EF4444',
    padding: '1rem',
    borderRadius: '4px',
    color: '#B91C1C',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    marginTop: '1rem',
  },
};
