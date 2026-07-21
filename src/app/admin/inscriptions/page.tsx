import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/app/lib/supabase';
import fs from 'fs/promises';
import path from 'path';
import ExportButtons from '@/app/admin/ExportButtons';
import InscriptionsClient from './InscriptionsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const cookieStore = await cookies();
  if (cookieStore.get('admin_authenticated')?.value !== 'true') {
    redirect('/admin/login');
  }

  let debatData: any[] = [];
  let cifData: any[] = [];
  let deleguesData: any[] = [];
  let mode = 'local';

  if (isSupabaseConfigured()) {
    mode = 'supabase';
    const { data: dData, error: dErr } = await supabase.from('inscriptions_debat').select('*').order('created_at', { ascending: false });
    if (!dErr && dData) debatData = dData;
    const { data: cData, error: cErr } = await supabase.from('inscriptions_cif').select('*').order('created_at', { ascending: false });
    if (!cErr && cData) cifData = cData;
    const { data: delData, error: delErr } = await supabase.from('delegues_congres').select('*').order('created_at', { ascending: false });
    if (!delErr && delData) deleguesData = delData;
  } else {
    debatData = await loadLocalJson('debat_submissions.json');
    cifData = await loadLocalJson('cif_submissions.json');
    deleguesData = await loadLocalJson('delegues_submissions.json');
    const sortFn = (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    debatData.sort(sortFn); cifData.sort(sortFn); deleguesData.sort(sortFn);
  }

  const totalDelegues = deleguesData.reduce((acc: number, cur: any) => acc + (parseInt(cur.nombre_delegues) || 1), 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* HEADER */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Tableau de bord des inscriptions</h1>
          <p style={styles.pageSubtitle}>
            Source : <span style={{ fontWeight: 'bold', color: mode === 'supabase' ? 'var(--primary)' : 'var(--accent)' }}>
              {mode === 'supabase' ? '🟢 Supabase (live)' : '🟡 Stockage local (JSON)'}
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
            <div style={styles.statValue}>{totalDelegues}</div>
            <div style={styles.statLabel}>Délégués déclarés</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{debatData.length + cifData.length + deleguesData.length}</div>
            <div style={styles.statLabel}>Total inscriptions</div>
          </div>
        </div>
      </div>

      {/* FILTRES + TABLES (Client Component) */}
      <InscriptionsClient
        debatData={debatData}
        cifData={cifData}
        deleguesData={deleguesData}
      />
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
    borderRadius: '10px',
    minWidth: '140px',
    textAlign: 'center' as const,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  statValue: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.2rem',
    fontWeight: '800',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
};
