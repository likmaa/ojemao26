import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function HebergementPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('admin_role')?.value;
  const auth = cookieStore.get('admin_authenticated')?.value;

  if (auth !== 'true') redirect('/admin/login');
  if (role !== 'hebergement' && role !== 'admin') redirect('/admin');

  // Fetch CIF avec hébergement
  const { data: cifData } = await supabase
    .from('inscriptions_cif')
    .select('id, nom_prenom, email, whatsapp, ville_pays, moyen_deplacement, date_arrivee, date_depart, statut, created_at')
    .order('date_arrivee', { ascending: true });

  // Fetch délégués
  const { data: deleguesData } = await supabase
    .from('delegues_congres')
    .select('id, nom_prenom, email, telephone, pays, structure, nombre_delegues, statut, created_at')
    .order('created_at', { ascending: false });

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const cif = cifData || [];
  const delegues = deleguesData || [];
  const avion = cif.filter(r => r.moyen_deplacement?.toLowerCase().includes('avion'));
  const autres = cif.filter(r => !r.moyen_deplacement?.toLowerCase().includes('avion'));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HEADER */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,165,233,0.1)', color: '#0EA5E9', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          🛏️ Espace Hébergement
        </div>
        <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
          Gestion de l'hébergement
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Vue des participants nécessitant un hébergement</p>
      </div>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { v: cif.length, l: 'Participants CIF', c: '#0EA5E9' },
          { v: avion.length, l: 'Voyagent en avion', c: '#8B5CF6' },
          { v: autres.length, l: 'Autre moyen', c: '#10B981' },
          { v: delegues.filter(d => d.statut === 'valide').length, l: 'Délégués validés', c: '#F59E0B' },
        ].map(stat => (
          <div key={stat.l} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '1.25rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: '800', color: stat.c }}>{stat.v}</div>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.l}</div>
          </div>
        ))}
      </div>

      {/* TABLE CIF */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: '#1E293B' }}>🎓 Participants CIF — Logistique ({cif.length})</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                {['Nom & Prénom', 'Pays/Ville', 'Moyen', 'Arrivée', 'Départ', 'Nuits', 'Statut', 'Contact'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cif.length > 0 ? cif.map(row => {
                const nights = row.date_arrivee && row.date_depart
                  ? Math.ceil((new Date(row.date_depart).getTime() - new Date(row.date_arrivee).getTime()) / 86400000)
                  : null;
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#1E293B' }}>{row.nom_prenom}</td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#475569' }}>{row.ville_pays}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ background: row.moyen_deplacement?.toLowerCase().includes('avion') ? 'rgba(139,92,246,0.1)' : 'rgba(16,185,129,0.1)', color: row.moyen_deplacement?.toLowerCase().includes('avion') ? '#8B5CF6' : '#10B981', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700' }}>
                        {row.moyen_deplacement?.toLowerCase().includes('avion') ? '✈️' : '🚗'} {row.moyen_deplacement}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>{formatDate(row.date_arrivee)}</td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>{formatDate(row.date_depart)}</td>
                    <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                      {nights !== null ? <span style={{ fontWeight: '700', color: '#0EA5E9' }}>{nights}n</span> : '—'}
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span style={{ background: row.statut === 'Payé & Confirmé' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: row.statut === 'Payé & Confirmé' ? '#10B981' : '#F59E0B', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                        {row.statut === 'Payé & Confirmé' ? '✓ Confirmé' : '⏳ En attente'}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#64748B' }}>
                      <div>{row.whatsapp}</div>
                      <div style={{ fontSize: '0.78rem' }}>{row.email}</div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={8} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>Aucun participant CIF.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE DELEGUES */}
      <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
          <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.1rem', color: '#1E293B' }}>🏛️ Délégués Statutaires ({delegues.length})</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr>
                {['Nom & Prénom', 'Structure', 'Pays', 'Nb. délégués', 'Statut', 'Contact'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {delegues.length > 0 ? delegues.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#1E293B' }}>{row.nom_prenom}</td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#475569' }}>{row.structure}</td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.9rem', color: '#475569' }}>{row.pays}</td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'center' }}>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: '#6366F1', padding: '0.2rem 0.6rem', borderRadius: '50%', fontSize: '0.9rem', fontWeight: '800' }}>{row.nombre_delegues || 1}</span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{ background: row.statut === 'valide' ? 'rgba(16,185,129,0.1)' : row.statut === 'rejete' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: row.statut === 'valide' ? '#10B981' : row.statut === 'rejete' ? '#EF4444' : '#F59E0B', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' }}>
                      {row.statut === 'valide' ? '✓ Validé' : row.statut === 'rejete' ? '✗ Rejeté' : '⏳ En attente'}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.85rem', color: '#64748B' }}>
                    <div>{row.telephone}</div>
                    <div style={{ fontSize: '0.78rem' }}>{row.email}</div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>Aucun délégué.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
