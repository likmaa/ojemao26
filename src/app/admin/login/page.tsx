'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { authenticateAdmin } from '@/app/lib/actions';
import { authenticateWithRole } from '@/app/lib/admin-actions';
import { FaEye, FaEyeSlash, FaShieldAlt, FaBed } from 'react-icons/fa';

type LoginMode = 'admin' | 'role';

export default function AdminLogin() {
  const [mode, setMode] = useState<LoginMode>('admin');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('password', password);
    startTransition(async () => {
      const res = await authenticateAdmin(null, fd);
      if (res?.success) router.push('/admin');
      else setError(res?.error || 'Erreur inconnue');
    });
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) return setError('Remplissez tous les champs.');
    startTransition(async () => {
      const res = await authenticateWithRole(username, password);
      if (res?.success) {
        if (res.role === 'hebergement') router.push('/admin/hebergement');
        else router.push('/admin');
      } else {
        setError(res?.error || 'Identifiants incorrects.');
      }
    });
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card} className="glass">
        <div style={styles.header}>
          <span style={styles.badge}>Administration</span>
          <h1 style={styles.title}>OJEMAO 2026</h1>
          <p style={styles.subtitle}>Espace de gestion des inscriptions</p>
        </div>

        {/* MODE TOGGLE */}
        <div style={styles.modeToggle}>
          <button
            type="button"
            onClick={() => { setMode('admin'); setError(''); }}
            style={{ ...styles.modeBtn, ...(mode === 'admin' ? styles.modeBtnActive : {}) }}
          >
            <FaShieldAlt style={{ marginRight: '0.4rem' }} /> Super Admin
          </button>
          <button
            type="button"
            onClick={() => { setMode('role'); setError(''); }}
            style={{ ...styles.modeBtn, ...(mode === 'role' ? { ...styles.modeBtnActive, background: '#0EA5E9', borderColor: '#0EA5E9' } : {}) }}
          >
            <FaBed style={{ marginRight: '0.4rem' }} /> Autre rôle
          </button>
        </div>

        {/* ADMIN FORM */}
        {mode === 'admin' && (
          <form onSubmit={handleAdminSubmit} style={styles.form}>
            {error && <div style={styles.errorAlert}>❌ {error}</div>}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.fieldLabel}>Mot de passe d'administration *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Mot de passe global"
                  style={styles.inputField}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={styles.eyeBtn}>
                  {showPwd ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending} className="btn btn-primary" style={styles.submitBtn}>
              {isPending ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* ROLE FORM */}
        {mode === 'role' && (
          <form onSubmit={handleRoleSubmit} style={styles.form}>
            {error && <div style={styles.errorAlert}>❌ {error}</div>}
            <div style={{ marginBottom: '1rem' }}>
              <label style={styles.fieldLabel}>Nom d'utilisateur *</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Ex: hebergement.equipe" style={styles.inputField} autoComplete="username" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.fieldLabel}>Mot de passe *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Votre mot de passe" style={styles.inputField} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={styles.eyeBtn}>
                  {showPwd ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending} style={{ ...styles.submitBtn, background: '#0EA5E9', width: '100%', padding: '1rem', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}>
              {isPending ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  card: { width: '100%', maxWidth: '450px', padding: '3rem 2.5rem', borderRadius: '8px' },
  header: { textAlign: 'center' as const, marginBottom: '2rem' },
  badge: { background: 'rgba(56,165,84,0.1)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  title: { fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', marginTop: '1rem', marginBottom: '0.25rem' },
  subtitle: { fontSize: '0.95rem', color: 'var(--text-muted)' },
  modeToggle: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#F1F5F9', borderRadius: '8px', padding: '0.25rem' },
  modeBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem', border: '2px solid transparent', borderRadius: '6px', background: 'transparent', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', color: '#64748B', transition: 'all 0.2s' },
  modeBtnActive: { background: 'var(--primary)', borderColor: 'var(--primary)', color: '#fff' },
  form: { display: 'flex', flexDirection: 'column' as const },
  fieldLabel: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem' },
  inputField: { width: '100%', padding: '0.8rem 1rem', paddingRight: '3rem', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '1rem', fontFamily: 'inherit', boxSizing: 'border-box' as const },
  eyeBtn: { position: 'absolute' as const, right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' },
  submitBtn: { width: '100%', padding: '1rem', marginTop: '1rem' },
  errorAlert: { background: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '1rem', borderRadius: '4px', color: '#B91C1C', fontSize: '0.9rem', marginBottom: '1.5rem' },
};
