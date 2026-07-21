'use client';

import { useState, useEffect, useTransition } from 'react';
import { createAdminUser, deleteAdminUser, updateAdminUser } from '@/app/lib/admin-actions';
import { supabase } from '@/app/lib/supabase';
import { FaPlus, FaTrash, FaEdit, FaTimes, FaShieldAlt, FaBed, FaUser } from 'react-icons/fa';

type AdminUser = { id: string; username: string; role: 'admin' | 'hebergement'; created_at: string; };

const ROLES = {
  admin: { label: 'Super Admin', color: '#6366F1', bg: 'rgba(99,102,241,0.1)', icon: '🛡️' },
  hebergement: { label: 'Hébergement', color: '#0EA5E9', bg: 'rgba(14,165,233,0.1)', icon: '🛏️' },
};

export default function ParametresPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ username: '', password: '', role: 'hebergement' as 'admin' | 'hebergement' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('admin_users').select('id, username, role, created_at').order('created_at');
    if (data) setUsers(data);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditUser(null); setForm({ username: '', password: '', role: 'hebergement' }); setError(''); setShowModal(true); };
  const openEdit = (u: AdminUser) => { setEditUser(u); setForm({ username: u.username, password: '', role: u.role }); setError(''); setShowModal(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!form.username.trim()) return setError("Le nom d'utilisateur est obligatoire.");
    if (!editUser && !form.password.trim()) return setError('Le mot de passe est obligatoire.');
    if (form.password && form.password.length < 6) return setError('Minimum 6 caractères.');
    startTransition(async () => {
      const res = editUser
        ? await updateAdminUser({ id: editUser.id, username: form.username, role: form.role, password: form.password || undefined })
        : await createAdminUser({ username: form.username, password: form.password, role: form.role });
      if (res?.error) setError(res.error);
      else { setShowModal(false); fetch(); }
    });
  };

  const handleDelete = (u: AdminUser) => {
    if (!confirm(`Supprimer "${u.username}" ?`)) return;
    startTransition(async () => { const res = await deleteAdminUser(u.id); if (res?.error) alert(res.error); else fetch(); });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>⚙️ Paramètres</h1>
          <p style={s.subtitle}>Gérez les accès à l'espace d'administration</p>
        </div>
        <button onClick={openAdd} style={s.addBtn}><FaPlus style={{ marginRight: '0.5rem' }} /> Nouvel utilisateur</button>
      </div>

      {/* ROLES INFO */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>Rôles disponibles</h3>
        <div style={s.rolesGrid}>
          <div style={s.roleCard}>
            <span style={{ fontSize: '2rem' }}>🛡️</span>
            <strong style={{ color: '#6366F1', display: 'block', margin: '0.5rem 0 0.25rem' }}>Super Admin</strong>
            <p style={s.roleDesc}>Accès complet : inscriptions, intervenants, événements, infos pratiques, paramètres et gestion des utilisateurs.</p>
          </div>
          <div style={s.roleCard}>
            <span style={{ fontSize: '2rem' }}>🛏️</span>
            <strong style={{ color: '#0EA5E9', display: 'block', margin: '0.5rem 0 0.25rem' }}>Hébergement</strong>
            <p style={s.roleDesc}>Accès restreint : vue en lecture seule de la liste de <b>toutes les inscriptions</b>. Aucune action de modification autorisée.</p>
          </div>

        </div>
      </div>

      {/* USERS TABLE */}
      <div style={s.card}>
        <div style={s.tableHeader}>
          <h2 style={s.cardTitle}>Utilisateurs ({users.length})</h2>
        </div>
        {loading ? (
          <div style={s.empty}>Chargement...</div>
        ) : users.length === 0 ? (
          <div style={s.empty}>Aucun utilisateur. Cliquez sur "Nouvel utilisateur" pour commencer.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead><tr>{['Utilisateur', 'Rôle', 'Créé le', 'Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => {
                  const r = ROLES[u.role] || ROLES.hebergement;
                  return (
                    <tr key={u.id} style={s.tr}>
                      <td style={s.td}><div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}><div style={s.avatar}><FaUser style={{ fontSize:'0.8rem' }} /></div><strong>{u.username}</strong></div></td>
                      <td style={s.td}><span style={{ ...s.badge, background: r.bg, color: r.color }}>{r.icon} {r.label}</span></td>
                      <td style={s.td}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                      <td style={s.td}><div style={{ display:'flex', gap:'0.5rem' }}>
                        <button onClick={() => openEdit(u)} style={s.editBtn} title="Modifier"><FaEdit /></button>
                        <button onClick={() => handleDelete(u)} style={s.deleteBtn} title="Supprimer"><FaTrash /></button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={s.overlay} onClick={() => setShowModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={{ margin:0, fontWeight:'700' }}>{editUser ? `✏️ Modifier "${editUser.username}"` : '➕ Nouvel utilisateur'}</h3>
              <button onClick={() => setShowModal(false)} style={s.closeBtn}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} style={s.modalBody}>
              {error && <div style={s.errorBox}>❌ {error}</div>}
              <div style={s.field}><label style={s.label}>Nom d'utilisateur *</label><input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} style={s.input} placeholder="Ex: hebergement.equipe" autoComplete="off" /></div>
              <div style={s.field}><label style={s.label}>Mot de passe {editUser ? '(vide = conserver)' : '*'}</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={s.input} placeholder={editUser ? 'Laisser vide pour ne pas changer' : 'Min. 6 caractères'} autoComplete="new-password" /></div>
              <div style={s.field}><label style={s.label}>Rôle *</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} style={s.input}>
                  <option value="hebergement">🛏️ Hébergement (accès restreint)</option>
                  <option value="admin">🛡️ Super Admin (accès complet)</option>
                </select>
              </div>
              <div style={{ ...s.preview, borderColor: ROLES[form.role].color }}>
                <strong style={{ color: ROLES[form.role].color, fontSize: '0.85rem' }}>Accès de ce rôle :</strong>
                <ul style={{ margin:'0.4rem 0 0', paddingLeft:'1.2rem', fontSize:'0.82rem', color:'#475569', lineHeight:'1.6' }}>
                  {form.role === 'admin' ? (<>
                    <li>✅ Toutes les inscriptions (Débat, CIF, Délégués) avec droit de modification</li>
                    <li>✅ Intervenants, Événements, Infos pratiques</li>
                    <li>✅ Paramètres et gestion des utilisateurs</li>
                  </>) : (<>
                    <li>✅ Accès en lecture seule à TOUTES les inscriptions</li>
                    <li>❌ Aucune action (suppression/modification) autorisée</li>
                    <li>❌ Pas d'accès aux autres sections</li>
                  </>)}
                </ul>

              </div>
              <div style={s.actions}>
                <button type="button" onClick={() => setShowModal(false)} style={s.cancelBtn}>Annuler</button>
                <button type="submit" disabled={isPending} style={s.submitBtn}>{isPending ? 'Enregistrement...' : editUser ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, any> = {
  header: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem', marginBottom:'2rem' },
  title: { fontFamily:'var(--font-title)', fontSize:'2rem', fontWeight:'800', color:'var(--text-dark)', margin:0 },
  subtitle: { color:'var(--text-muted)', marginTop:'0.25rem' },
  addBtn: { display:'flex', alignItems:'center', padding:'0.7rem 1.25rem', background:'var(--primary)', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'700', fontSize:'0.9rem' },
  card: { background:'#fff', border:'1px solid #E2E8F0', borderRadius:'10px', padding:'1.5rem', marginBottom:'1.5rem' },
  cardTitle: { margin:'0 0 1rem', fontWeight:'700', fontSize:'1.05rem', color:'#1E293B' },
  tableHeader: { marginBottom:'1rem' },
  rolesGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:'1rem' },
  roleCard: { background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:'8px', padding:'1.25rem' },
  roleDesc: { fontSize:'0.82rem', color:'#64748B', margin:'0', lineHeight:'1.5' },
  table: { width:'100%', borderCollapse:'collapse' },
  th: { textAlign:'left', padding:'0.75rem 1rem', fontSize:'0.78rem', fontWeight:'700', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid #E2E8F0', background:'#F8FAFC' },
  tr: { borderBottom:'1px solid #F1F5F9' },
  td: { padding:'0.9rem 1rem', fontSize:'0.9rem', color:'#1E293B', verticalAlign:'middle' },
  avatar: { width:'32px', height:'32px', borderRadius:'50%', background:'rgba(99,102,241,0.1)', color:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center' },
  badge: { display:'inline-flex', alignItems:'center', gap:'0.3rem', padding:'0.25rem 0.7rem', borderRadius:'50px', fontSize:'0.78rem', fontWeight:'700' },
  editBtn: { background:'#EFF6FF', color:'#3B82F6', border:'none', borderRadius:'6px', padding:'0.4rem 0.6rem', cursor:'pointer' },
  deleteBtn: { background:'#FEF2F2', color:'#EF4444', border:'none', borderRadius:'6px', padding:'0.4rem 0.6rem', cursor:'pointer' },
  empty: { padding:'2.5rem', textAlign:'center', color:'#94A3B8', fontStyle:'italic' },
  overlay: { position:'fixed', inset:0, background:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
  modal: { background:'#fff', borderRadius:'12px', width:'100%', maxWidth:'480px', boxShadow:'0 25px 50px rgba(0,0,0,0.2)' },
  modalHeader: { padding:'1.25rem 1.5rem', borderBottom:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' },
  closeBtn: { background:'none', border:'none', cursor:'pointer', color:'#64748B', display:'flex', alignItems:'center', fontSize:'1rem' },
  modalBody: { padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  field: { display:'flex', flexDirection:'column', gap:'0.3rem' },
  label: { fontSize:'0.78rem', fontWeight:'700', color:'#475569', textTransform:'uppercase', letterSpacing:'0.04em' },
  input: { padding:'0.6rem 0.85rem', border:'1px solid #CBD5E1', borderRadius:'6px', fontSize:'0.9rem', color:'#1E293B', background:'#F8FAFC', width:'100%', boxSizing:'border-box' },
  preview: { background:'#F8FAFC', border:'1.5px solid', borderRadius:'8px', padding:'0.85rem 1rem' },
  actions: { display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.25rem' },
  cancelBtn: { padding:'0.6rem 1.2rem', background:'#F1F5F9', color:'#475569', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'600' },
  submitBtn: { padding:'0.6rem 1.5rem', background:'var(--primary)', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700' },
  errorBox: { background:'#FEF2F2', border:'1px solid #FECACA', color:'#B91C1C', padding:'0.75rem 1rem', borderRadius:'6px', fontSize:'0.87rem' },
};
