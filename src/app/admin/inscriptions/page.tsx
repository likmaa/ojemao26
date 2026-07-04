import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/app/lib/supabase';
import fs from 'fs/promises';
import path from 'path';
import ExportButtons from '@/app/admin/ExportButtons';
import AdminActionButtons from '@/app/admin/inscriptions/AdminActionButtons';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to load fallback JSON data
async function loadLocalJson(fileName: string) {
  try {
    const filePath = path.join(process.cwd(), 'submissions', fileName);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return [];
  }
}

export default async function AdminDashboard() {
  // 1. Check authentication
  const cookieStore = await cookies();
  if (cookieStore.get('admin_authenticated')?.value !== 'true') {
    redirect('/admin/login');
  }

  // 2. Fetch Data
  let debatData = [];
  let cifData = [];
  let deleguesData = [];
  let mode = 'local';

  if (isSupabaseConfigured()) {
    mode = 'supabase';
    
    // Fetch Débat
    const { data: dData, error: dErr } = await supabase
      .from('inscriptions_debat')
      .select('*')
      .order('created_at', { ascending: false });
    if (!dErr && dData) debatData = dData;

    // Fetch CIF
    const { data: cData, error: cErr } = await supabase
      .from('inscriptions_cif')
      .select('*')
      .order('created_at', { ascending: false });
    if (!cErr && cData) cifData = cData;

    // Fetch Délégués
    const { data: delData, error: delErr } = await supabase
      .from('delegues_congres')
      .select('*')
      .order('created_at', { ascending: false });
    if (!delErr && delData) deleguesData = delData;
  } else {
    // Local fallback
    debatData = await loadLocalJson('debat_submissions.json');
    cifData = await loadLocalJson('cif_submissions.json');
    deleguesData = await loadLocalJson('delegues_submissions.json');
    
    // Sort local data newest first
    const sortFn = (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    debatData.sort(sortFn);
    cifData.sort(sortFn);
    deleguesData.sort(sortFn);
  }

  // Format date helper
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* HEADER SECTION */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Tableau de bord des inscriptions</h1>
          <p style={styles.pageSubtitle}>
            Source de données : <span style={{ fontWeight: 'bold', color: mode === 'supabase' ? 'var(--primary)' : 'var(--accent)' }}>
              {mode === 'supabase' ? 'Base de données Supabase' : 'Stockage Local (Fichiers JSON)'}
            </span>
          </p>
          <div style={{ marginTop: '1rem' }}>
            <ExportButtons debatData={debatData} cifData={cifData} deleguesData={deleguesData} />
          </div>
        </div>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{debatData.length}</div>
            <div style={styles.statLabel}>Inscrits Débat</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{cifData.length}</div>
            <div style={styles.statLabel}>Inscrits CIF</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{deleguesData.reduce((acc: number, cur: any) => acc + (parseInt(cur.nombre_delegues) || 1), 0)}</div>
            <div style={styles.statLabel}>Délégués déclarés</div>
          </div>
        </div>
      </div>

      {/* TABS (Native CSS only for simplicity) */}
      <div style={styles.tablesContainer}>
        
        {/* TABLE DEBAT */}
        <div style={styles.tableSection}>
          <h2 style={styles.tableTitle}>Inscriptions : Débat de Cotonou</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Nom & Prénom</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Organisation</th>
                  <th style={styles.th}>Pays/Ville</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {debatData.length > 0 ? debatData.map((row: any) => (
                  <tr key={row.id} style={styles.tr}>
                    <td style={styles.td}>{formatDate(row.created_at)}</td>
                    <td style={{...styles.td, fontWeight: '600'}}>{row.nom_prenom}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{row.type_participant}</span>
                    </td>
                    <td style={styles.td}>{row.organisation}</td>
                    <td style={styles.td}>{row.ville_pays}</td>
                    <td style={styles.td}>
                      <div>{row.telephone}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{row.email}</div>
                    </td>
                    <td style={styles.td}>
                      <AdminActionButtons id={row.id} table="inscriptions_debat" data={row} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={styles.emptyState}>Aucune inscription pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE CIF */}
        <div style={styles.tableSection}>
          <h2 style={styles.tableTitle}>Inscriptions : Colloque International (CIF)</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Nom & Prénom</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Pays/Ville</th>
                  <th style={styles.th}>Voyage</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cifData.length > 0 ? cifData.map((row: any) => (
                  <tr key={row.id} style={styles.tr}>
                    <td style={styles.td}>{formatDate(row.created_at)}</td>
                    <td style={{...styles.td, fontWeight: '600'}}>{row.nom_prenom}</td>
                    <td style={styles.td}>{row.statut}</td>
                    <td style={styles.td}>{row.ville_pays}</td>
                    <td style={styles.td}>
                      <div><strong style={{color:'var(--accent)'}}>{row.moyen_deplacement}</strong></div>
                      <div style={{fontSize: '0.8rem'}}>{row.date_arrivee} ➔ {row.date_depart}</div>
                    </td>
                    <td style={styles.td}>
                      <div>{row.whatsapp}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{row.email}</div>
                    </td>
                    <td style={styles.td}>
                      <AdminActionButtons id={row.id} table="inscriptions_cif" data={row} currentStatus={row.statut} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={styles.emptyState}>Aucune inscription pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE DELEGUES */}
        <div style={styles.tableSection}>
          <h2 style={styles.tableTitle}>Recensements : Délégués Statutaires</h2>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Nom & Prénom</th>
                  <th style={styles.th}>Structure</th>
                  <th style={styles.th}>Pays</th>
                  <th style={styles.th}>Fonction</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deleguesData.length > 0 ? deleguesData.map((row: any) => (
                  <tr key={row.id} style={styles.tr}>
                    <td style={styles.td}>{formatDate(row.created_at)}</td>
                    <td style={{...styles.td, fontWeight: '600'}}>{row.nom_prenom}</td>
                    <td style={styles.td}>{row.structure}</td>
                    <td style={styles.td}>{row.pays}</td>
                    <td style={styles.td}>
                      <span style={{...styles.badge, background: 'rgba(3,67,137,0.1)'}}>
                        {row.mandat}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div>{row.telephone}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{row.email}</div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge, 
                        background: row.statut === 'valide' ? 'rgba(16, 185, 129, 0.1)' : row.statut === 'rejete' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: row.statut === 'valide' ? '#10B981' : row.statut === 'rejete' ? '#EF4444' : '#F59E0B'
                      }}>
                        {row.statut === 'valide' ? 'Validé' : row.statut === 'rejete' ? 'Rejeté' : 'En attente'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <AdminActionButtons id={row.id} table="delegues_congres" data={row} currentStatus={row.statut} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={styles.emptyState}>Aucun recensement pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '2rem',
    marginBottom: '1rem',
  },
  pageTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '0.5rem',
  },
  pageSubtitle: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
  statsContainer: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap' as const,
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: '1.25rem 2rem',
    borderRadius: '8px',
    minWidth: '150px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statValue: {
    fontFamily: 'var(--font-title)',
    fontSize: '2rem',
    fontWeight: '800',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
  },
  tablesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '3rem',
  },
  tableSection: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  tableTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '900px', // Ensures table is scrollable if screen is too small
  },
  th: {
    textAlign: 'left' as const,
    padding: '1rem 1.5rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
    transition: 'background-color 0.15s ease',
  },
  td: {
    padding: '1rem 1.5rem',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    verticalAlign: 'middle' as const,
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: 'rgba(3,67,137,0.1)',
    color: 'var(--secondary)',
    textTransform: 'uppercase' as const,
  },
  numberBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#FFF',
    fontWeight: '700',
    fontSize: '0.9rem',
    marginRight: '0.5rem',
  },
  emptyState: {
    padding: '3rem',
    textAlign: 'center' as const,
    color: 'var(--text-muted)',
    fontStyle: 'italic' as const,
  },
};
