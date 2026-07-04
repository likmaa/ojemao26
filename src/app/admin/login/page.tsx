'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAdmin } from '@/app/lib/actions';
import FormField from '@/app/components/FormField';

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(authenticateAdmin, null);
  const router = useRouter();

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

          <FormField
            label="Mot de passe d'administration"
            name="password"
            type="password"
            required={true}
            placeholder="Entrez le mot de passe global"
          />

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
