'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminActionButtons from './AdminActionButtons';


interface InscriptionsClientProps {
  debatData: any[];
  cifData: any[];
  deleguesData: any[];
}

type ActiveTab = 'debat' | 'cif' | 'delegues';

const formatDate = (isoString: string) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

export default function InscriptionsClient({ debatData, cifData, deleguesData }: InscriptionsClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('debat');
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    // Mode lecture seule si rôle hébergement
    const match = document.cookie.match(/admin_role=([^;]+)/);
    if (match && match[1] === 'hebergement') setReadOnly(true);
  }, []);

  // ─── DEBAT FILTERS ───────────────────────────────────────────
  const [debatSearch, setDebatSearch] = useState('');
  const [debatType, setDebatType] = useState('');
  const [debatPays, setDebatPays] = useState('');
  const [debatGenre, setDebatGenre] = useState('');
  const [debatDateFrom, setDebatDateFrom] = useState('');
  const [debatDateTo, setDebatDateTo] = useState('');
  const [debatSort, setDebatSort] = useState<'newest' | 'oldest' | 'name'>('newest');

  // ─── CIF FILTERS ─────────────────────────────────────────────
  const [cifSearch, setCifSearch] = useState('');
  const [cifStatut, setCifStatut] = useState('');
  const [cifPays, setCifPays] = useState('');
  const [cifDeplacement, setCifDeplacement] = useState('');
  const [cifAge, setCifAge] = useState('');
  const [cifDateFrom, setCifDateFrom] = useState('');
  const [cifDateTo, setCifDateTo] = useState('');
  const [cifSort, setCifSort] = useState<'newest' | 'oldest' | 'name'>('newest');

  // ─── DELEGUES FILTERS ────────────────────────────────────────
  const [delSearch, setDelSearch] = useState('');
  const [delStatut, setDelStatut] = useState('');
  const [delPays, setDelPays] = useState('');
  const [delMandat, setDelMandat] = useState('');
  const [delDateFrom, setDelDateFrom] = useState('');
  const [delDateTo, setDelDateTo] = useState('');
  const [delSort, setDelSort] = useState<'newest' | 'oldest' | 'name'>('newest');

  // ─── UNIQUE VALUES FOR DROPDOWNS ─────────────────────────────
  const debatTypes = useMemo(() => [...new Set(debatData.map(r => r.type_participant).filter(Boolean))].sort(), [debatData]);
  const debatPaysList = useMemo(() => [...new Set(debatData.map(r => r.ville_pays?.split(',').pop()?.trim()).filter(Boolean))].sort(), [debatData]);
  const cifStatuts = useMemo(() => [...new Set(cifData.map(r => r.statut).filter(Boolean))].sort(), [cifData]);
  const cifPaysList = useMemo(() => [...new Set(cifData.map(r => r.ville_pays?.split(',').pop()?.trim()).filter(Boolean))].sort(), [cifData]);
  const cifDeplacements = useMemo(() => [...new Set(cifData.map(r => r.moyen_deplacement).filter(Boolean))].sort(), [cifData]);
  const cifAges = useMemo(() => [...new Set(cifData.map(r => r.tranche_age).filter(Boolean))].sort(), [cifData]);
  const delPaysList = useMemo(() => [...new Set(deleguesData.map(r => r.pays).filter(Boolean))].sort(), [deleguesData]);
  const delMandats = useMemo(() => [...new Set(deleguesData.map(r => r.mandat).filter(Boolean))].sort(), [deleguesData]);

  // ─── SORT HELPER ─────────────────────────────────────────────
  const sortRows = (rows: any[], sort: string) => {
    const arr = [...rows];
    if (sort === 'newest') return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (sort === 'oldest') return arr.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    if (sort === 'name') return arr.sort((a, b) => (a.nom_prenom || '').localeCompare(b.nom_prenom || ''));
    return arr;
  };

  const inDateRange = (isoString: string, from: string, to: string) => {
    if (!from && !to) return true;
    const d = new Date(isoString).getTime();
    if (from && d < new Date(from).getTime()) return false;
    if (to && d > new Date(to + 'T23:59:59').getTime()) return false;
    return true;
  };

  // ─── FILTERED DATA ───────────────────────────────────────────
  const filteredDebat = useMemo(() => {
    let rows = debatData.filter(r => {
      const q = debatSearch.toLowerCase();
      const matchSearch = !q || [r.nom_prenom, r.email, r.telephone, r.organisation, r.ville_pays].some(v => v?.toLowerCase().includes(q));
      const matchType = !debatType || r.type_participant === debatType;
      const matchPays = !debatPays || r.ville_pays?.includes(debatPays);
      const matchGenre = !debatGenre || r.genre === debatGenre;
      const matchDate = inDateRange(r.created_at, debatDateFrom, debatDateTo);
      return matchSearch && matchType && matchPays && matchGenre && matchDate;
    });
    return sortRows(rows, debatSort);
  }, [debatData, debatSearch, debatType, debatPays, debatGenre, debatDateFrom, debatDateTo, debatSort]);

  const filteredCif = useMemo(() => {
    let rows = cifData.filter(r => {
      const q = cifSearch.toLowerCase();
      const matchSearch = !q || [r.nom_prenom, r.email, r.whatsapp, r.etablissement, r.ville_pays].some(v => v?.toLowerCase().includes(q));
      const matchStatut = !cifStatut || r.statut === cifStatut;
      const matchPays = !cifPays || r.ville_pays?.includes(cifPays);
      const matchDep = !cifDeplacement || r.moyen_deplacement === cifDeplacement;
      const matchAge = !cifAge || r.tranche_age === cifAge;
      const matchDate = inDateRange(r.created_at, cifDateFrom, cifDateTo);
      return matchSearch && matchStatut && matchPays && matchDep && matchAge && matchDate;
    });
    return sortRows(rows, cifSort);
  }, [cifData, cifSearch, cifStatut, cifPays, cifDeplacement, cifAge, cifDateFrom, cifDateTo, cifSort]);

  const filteredDelegues = useMemo(() => {
    let rows = deleguesData.filter(r => {
      const q = delSearch.toLowerCase();
      const matchSearch = !q || [r.nom_prenom, r.email, r.telephone, r.structure, r.pays].some(v => v?.toLowerCase().includes(q));
      const matchStatut = !delStatut || r.statut === delStatut;
      const matchPays = !delPays || r.pays === delPays;
      const matchMandat = !delMandat || r.mandat === delMandat;
      const matchDate = inDateRange(r.created_at, delDateFrom, delDateTo);
      return matchSearch && matchStatut && matchPays && matchMandat && matchDate;
    });
    return sortRows(rows, delSort);
  }, [deleguesData, delSearch, delStatut, delPays, delMandat, delDateFrom, delDateTo, delSort]);

  const resetDebat = () => { setDebatSearch(''); setDebatType(''); setDebatPays(''); setDebatGenre(''); setDebatDateFrom(''); setDebatDateTo(''); setDebatSort('newest'); };
  const resetCif = () => { setCifSearch(''); setCifStatut(''); setCifPays(''); setCifDeplacement(''); setCifAge(''); setCifDateFrom(''); setCifDateTo(''); setCifSort('newest'); };
  const resetDel = () => { setDelSearch(''); setDelStatut(''); setDelPays(''); setDelMandat(''); setDelDateFrom(''); setDelDateTo(''); setDelSort('newest'); };

  const hasDebatFilters = debatSearch || debatType || debatPays || debatGenre || debatDateFrom || debatDateTo;
  const hasCifFilters = cifSearch || cifStatut || cifPays || cifDeplacement || cifAge || cifDateFrom || cifDateTo;
  const hasDelFilters = delSearch || delStatut || delPays || delMandat || delDateFrom || delDateTo;

  return (
    <div>
      {/* TABS */}
      <div style={s.tabBar}>
        {(['debat', 'cif', 'delegues'] as ActiveTab[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            ...s.tab,
            ...(activeTab === tab ? s.tabActive : {})
          }}>
            {tab === 'debat' && `🎤 Débat (${filteredDebat.length}/${debatData.length})`}
            {tab === 'cif' && `🎓 CIF (${filteredCif.length}/${cifData.length})`}
            {tab === 'delegues' && `🏛️ Délégués (${filteredDelegues.length}/${deleguesData.length})`}
          </button>
        ))}
      </div>

      {/* ─── DEBAT TAB ─────────────────────────────────────────── */}
      {activeTab === 'debat' && (
        <div>
          <FilterBar onReset={resetDebat} hasFilters={!!hasDebatFilters} count={filteredDebat.length} total={debatData.length}>
            <SearchInput value={debatSearch} onChange={setDebatSearch} placeholder="Nom, email, téléphone, organisation..." />
            <Select value={debatType} onChange={setDebatType} label="Type de participant" options={debatTypes} />
            <Select value={debatPays} onChange={setDebatPays} label="Pays" options={debatPaysList} />
            <Select value={debatGenre} onChange={setDebatGenre} label="Genre" options={['Homme', 'Femme']} />
            <DateRange from={debatDateFrom} to={debatDateTo} onFrom={setDebatDateFrom} onTo={setDebatDateTo} />
            <SortSelect value={debatSort} onChange={setDebatSort} />
          </FilterBar>

          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Date', 'N° Place', 'Photo', 'Nom & Prénom', 'Genre', 'Type', 'Organisation', 'Pays/Ville', 'Contact', ...(!readOnly ? ['Actions'] : [])].map(h => (

                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDebat.length > 0 ? filteredDebat.map((row: any) => (
                  <tr key={row.id} style={s.tr}>
                    <td style={s.td}><span style={s.dateText}>{formatDate(row.created_at)}</span></td>
                    <td style={s.td}>
                      {row.numero_chaise ? <span style={{...s.badge, background: 'rgba(16,185,129,0.1)', color:'#10B981'}}>#{row.numero_chaise}</span> : '—'}
                    </td>
                    <td style={s.td}>
                      {row.photo_profil ? (
                        <a href={row.photo_profil} target="_blank" rel="noopener noreferrer">
                          <img src={row.photo_profil} alt="Profil" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }} />
                        </a>
                      ) : '—'}
                    </td>
                    <td style={{...s.td, fontWeight: '600'}}>{row.nom_prenom}</td>
                    <td style={s.td}><span style={{...s.badge, background: row.genre === 'Femme' ? 'rgba(236,72,153,0.1)' : 'rgba(99,102,241,0.1)', color: row.genre === 'Femme' ? '#EC4899' : '#6366F1'}}>{row.genre}</span></td>
                    <td style={s.td}>
                      <span style={s.badge}>{row.type_participant?.replace(/_/g,' ')}</span>
                      {row.poste && <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{row.poste}</div>}
                    </td>

                    <td style={s.td}>{row.organisation}</td>
                    <td style={s.td}>{row.ville_pays}</td>
                    <td style={s.td}>
                      <div>{row.telephone}</div>
                      <div style={{fontSize:'0.8rem',color:'#94A3B8'}}>{row.email}</div>
                    </td>
                    {!readOnly && <td style={s.td}><AdminActionButtons id={row.id} table="inscriptions_debat" data={row} /></td>}
                  </tr>
                )) : <EmptyRow cols={readOnly ? 8 : 9} />}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── CIF TAB ───────────────────────────────────────────── */}
      {activeTab === 'cif' && (
        <div>
          <FilterBar onReset={resetCif} hasFilters={!!hasCifFilters} count={filteredCif.length} total={cifData.length}>
            <SearchInput value={cifSearch} onChange={setCifSearch} placeholder="Nom, email, WhatsApp, établissement..." />
            <Select value={cifStatut} onChange={setCifStatut} label="Statut paiement" options={cifStatuts} />
            <Select value={cifPays} onChange={setCifPays} label="Pays" options={cifPaysList} />
            <Select value={cifDeplacement} onChange={setCifDeplacement} label="Moyen de déplacement" options={cifDeplacements} />
            <Select value={cifAge} onChange={setCifAge} label="Tranche d'âge" options={cifAges} />
            <DateRange from={cifDateFrom} to={cifDateTo} onFrom={setCifDateFrom} onTo={setCifDateTo} />
            <SortSelect value={cifSort} onChange={setCifSort} />
          </FilterBar>

          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Date', 'Nom & Prénom', 'Statut', 'Pays/Ville', 'Âge', 'Déplacement', 'Arrivée → Départ', 'Contact', ...(!readOnly ? ['Actions'] : [])].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCif.length > 0 ? filteredCif.map((row: any) => (
                  <tr key={row.id} style={s.tr}>
                    <td style={s.td}><span style={s.dateText}>{formatDate(row.created_at)}</span></td>
                    <td style={{...s.td, fontWeight:'600'}}>{row.nom_prenom}</td>
                    <td style={s.td}>
                      <span style={{...s.badge, 
                        background: row.statut === 'Payé & Confirmé' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                        color: row.statut === 'Payé & Confirmé' ? '#10B981' : '#F59E0B'
                      }}>{row.statut}</span>
                    </td>
                    <td style={s.td}>{row.ville_pays}</td>
                    <td style={s.td}>{row.tranche_age}</td>
                    <td style={s.td}><strong>{row.moyen_deplacement}</strong></td>
                    <td style={s.td}><span style={{fontSize:'0.85rem'}}>{row.date_arrivee} → {row.date_depart}</span></td>
                    <td style={s.td}>
                      <div>{row.whatsapp}</div>
                      <div style={{fontSize:'0.8rem',color:'#94A3B8'}}>{row.email}</div>
                    </td>
                    {!readOnly && <td style={s.td}><AdminActionButtons id={row.id} table="inscriptions_cif" data={row} currentStatus={row.statut} /></td>}
                  </tr>
                )) : <EmptyRow cols={readOnly ? 8 : 9} />}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── DELEGUES TAB ──────────────────────────────────────── */}
      {activeTab === 'delegues' && (
        <div>
          <FilterBar onReset={resetDel} hasFilters={!!hasDelFilters} count={filteredDelegues.length} total={deleguesData.length}>
            <SearchInput value={delSearch} onChange={setDelSearch} placeholder="Nom, email, téléphone, structure..." />
            <Select value={delStatut} onChange={setDelStatut} label="Statut" options={['en_attente', 'valide', 'rejete']} displayMap={{en_attente:'En attente', valide:'Validé', rejete:'Rejeté'}} />
            <Select value={delPays} onChange={setDelPays} label="Pays" options={delPaysList} />
            <Select value={delMandat} onChange={setDelMandat} label="Mandat" options={delMandats} />
            <DateRange from={delDateFrom} to={delDateTo} onFrom={setDelDateFrom} onTo={setDelDateTo} />
            <SortSelect value={delSort} onChange={setDelSort} />
          </FilterBar>

          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Date', 'Nom & Prénom', 'Structure', 'Pays', 'Mandat', 'Délégués', 'Contact', 'Statut', ...(!readOnly ? ['Actions'] : [])].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDelegues.length > 0 ? filteredDelegues.map((row: any) => (
                  <tr key={row.id} style={s.tr}>
                    <td style={s.td}><span style={s.dateText}>{formatDate(row.created_at)}</span></td>
                    <td style={{...s.td, fontWeight:'600'}}>{row.nom_prenom}</td>
                    <td style={s.td}>{row.structure}</td>
                    <td style={s.td}>{row.pays}</td>
                    <td style={s.td}><span style={s.badge}>{row.mandat}</span></td>
                    <td style={s.td}><span style={{...s.badge, background:'rgba(99,102,241,0.1)',color:'#6366F1'}}>{row.nombre_delegues || 1}</span></td>
                    <td style={s.td}>
                      <div>{row.telephone}</div>
                      <div style={{fontSize:'0.8rem',color:'#94A3B8'}}>{row.email}</div>
                    </td>
                    <td style={s.td}>
                      <span style={{...s.badge,
                        background: row.statut === 'valide' ? 'rgba(16,185,129,0.1)' : row.statut === 'rejete' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: row.statut === 'valide' ? '#10B981' : row.statut === 'rejete' ? '#EF4444' : '#F59E0B'
                      }}>
                        {row.statut === 'valide' ? '✓ Validé' : row.statut === 'rejete' ? '✗ Rejeté' : '⏳ En attente'}
                      </span>
                    </td>
                    {!readOnly && <td style={s.td}><AdminActionButtons id={row.id} table="delegues_congres" data={row} currentStatus={row.statut} /></td>}
                  </tr>
                )) : <EmptyRow cols={readOnly ? 8 : 9} />}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function FilterBar({ children, onReset, hasFilters, count, total }: {
  children: React.ReactNode; onReset: () => void; hasFilters: boolean; count: number; total: number;
}) {
  return (
    <div style={s.filterPanel}>
      <div style={s.filterHeader}>
        <span style={s.filterTitle}>🔍 Filtres avancés</span>
        <span style={s.filterCount}>
          {hasFilters ? (
            <><span style={{color: count < total ? '#F59E0B' : '#10B981', fontWeight:'700'}}>{count}</span> / {total} résultats</>
          ) : (
            <span style={{color:'#94A3B8'}}>{total} entrées</span>
          )}
        </span>
        {hasFilters && (
          <button onClick={onReset} style={s.resetBtn}>✕ Réinitialiser</button>
        )}
      </div>
      <div style={s.filterGrid}>
        {children}
      </div>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={s.filterItem}>
      <label style={s.filterLabel}>🔎 Recherche globale</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={s.input}
      />
    </div>
  );
}

function Select({ value, onChange, label, options, displayMap }: {
  value: string; onChange: (v: string) => void; label: string; options: string[]; displayMap?: Record<string, string>;
}) {
  return (
    <div style={s.filterItem}>
      <label style={s.filterLabel}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={s.input}>
        <option value="">— Tous —</option>
        {options.map(o => <option key={o} value={o}>{displayMap?.[o] || o}</option>)}
      </select>
    </div>
  );
}

function DateRange({ from, to, onFrom, onTo }: { from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void }) {
  return (
    <>
      <div style={s.filterItem}>
        <label style={s.filterLabel}>📅 Date début</label>
        <input type="date" value={from} onChange={e => onFrom(e.target.value)} style={s.input} />
      </div>
      <div style={s.filterItem}>
        <label style={s.filterLabel}>📅 Date fin</label>
        <input type="date" value={to} onChange={e => onTo(e.target.value)} style={s.input} />
      </div>
    </>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: any) => void }) {
  return (
    <div style={s.filterItem}>
      <label style={s.filterLabel}>↕ Trier par</label>
      <select value={value} onChange={e => onChange(e.target.value)} style={s.input}>
        <option value="newest">Plus récent d'abord</option>
        <option value="oldest">Plus ancien d'abord</option>
        <option value="name">Nom (A → Z)</option>
      </select>
    </div>
  );
}

function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>
        Aucun résultat ne correspond aux filtres appliqués.
      </td>
    </tr>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },
  tab: {
    padding: '0.6rem 1.25rem',
    border: '2px solid #E2E8F0',
    borderRadius: '8px',
    background: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#64748B',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'var(--primary)',
    borderColor: 'var(--primary)',
    color: '#FFFFFF',
  },
  filterPanel: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    padding: '1.25rem',
    marginBottom: '1rem',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
  },
  filterTitle: {
    fontWeight: '700',
    fontSize: '0.95rem',
    color: '#1E293B',
  },
  filterCount: {
    fontSize: '0.85rem',
    color: '#64748B',
    marginLeft: 'auto',
  },
  resetBtn: {
    padding: '0.3rem 0.85rem',
    background: '#FEF2F2',
    color: '#EF4444',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  filterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  filterItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.3rem',
  },
  filterLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  input: {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #CBD5E1',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#1E293B',
    background: '#FFFFFF',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '1000px',
  },
  th: {
    textAlign: 'left' as const,
    padding: '0.85rem 1rem',
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '2px solid #E2E8F0',
    background: '#F8FAFC',
    whiteSpace: 'nowrap' as const,
  },
  tr: {
    borderBottom: '1px solid #F1F5F9',
  },
  td: {
    padding: '0.85rem 1rem',
    fontSize: '0.9rem',
    color: '#1E293B',
    verticalAlign: 'middle' as const,
  },
  badge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '50px',
    fontSize: '0.72rem',
    fontWeight: '700',
    backgroundColor: 'rgba(3,67,137,0.08)',
    color: '#034389',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap' as const,
  },
  dateText: {
    fontSize: '0.8rem',
    color: '#64748B',
    whiteSpace: 'nowrap' as const,
  },
};
