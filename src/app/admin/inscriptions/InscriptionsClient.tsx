'use client';

import { useState, useMemo, useEffect } from 'react';
import AdminActionButtons from './AdminActionButtons';
import { FaUserPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { addInscriptionByAdmin, uploadInscriptionPhoto } from '@/app/lib/admin-actions';

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

  // ─── ADD PARTICIPANT MODAL STATE ─────────────────────────────
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addCategory, setAddCategory] = useState<ActiveTab>('debat');
  const [addFormData, setAddFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

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

  const handleAddChange = (key: string, value: any) => {
    setAddFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddPhotoUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadInscriptionPhoto(formData);
    if (res.success && res.url) {
      handleAddChange('photo_profil', res.url);
    } else {
      alert(res.error || "Erreur lors du téléversement de la photo.");
    }
    setIsUploadingPhoto(false);
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.nom_prenom) {
      alert("Veuillez saisir le nom et le prénom.");
      return;
    }

    setIsSubmitting(true);

    let targetTable: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres' = 'inscriptions_debat';
    if (addCategory === 'cif') targetTable = 'inscriptions_cif';
    if (addCategory === 'delegues') targetTable = 'delegues_congres';

    const payload = { ...addFormData };

    if (addCategory === 'debat') {
      if (!payload.genre) payload.genre = 'Homme';
      if (!payload.type_participant) payload.type_participant = 'universitaire';
      if (!payload.participer_cif) payload.participer_cif = 'non';
      if (!payload.fonction) payload.fonction = payload.poste || payload.type_participant || payload.organisation || 'Participant';
    } else if (addCategory === 'cif') {
      if (!payload.genre) payload.genre = 'M';
      if (!payload.tranche_age) payload.tranche_age = '26_35';
      if (!payload.statut) payload.statut = 'Payé & Confirmé';
      if (!payload.moyen_deplacement) payload.moyen_deplacement = 'bus_car';
    } else if (addCategory === 'delegues') {
      if (!payload.statut) payload.statut = 'valide';
      if (!payload.nombre_delegues) payload.nombre_delegues = 1;
    }

    const res = await addInscriptionByAdmin(targetTable, payload);
    if (res.success) {
      setIsAddModalOpen(false);
      setAddFormData({});
    } else {
      alert(res.error || "Erreur lors de l'ajout du participant.");
    }
    setIsSubmitting(false);
  };

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

        {!readOnly && (
          <button
            onClick={() => {
              setAddCategory(activeTab);
              setAddFormData({});
              setIsAddModalOpen(true);
            }}
            style={{
              marginLeft: 'auto',
              padding: '0.6rem 1.25rem',
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(16,185,129,0.2)',
            }}
          >
            <FaUserPlus /> Ajouter un participant
          </button>
        )}
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
                  {['Date', 'Nom & Prénom', 'Type / Fonction', 'Statut de paiement', 'Pays/Ville', 'Âge', 'Déplacement', 'Arrivée → Départ', 'Contact', ...(!readOnly ? ['Actions'] : [])].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCif.length > 0 ? filteredCif.map((row: any) => (
                  <tr key={row.id} style={s.tr}>
                    <td style={s.td}><span style={s.dateText}>{formatDate(row.created_at)}</span></td>
                    <td style={{...s.td, fontWeight:'600'}}>{row.nom_prenom}</td>
                    <td style={s.td}><span style={{...s.badge, background: '#F1F5F9', color: '#475569'}}>{row.etablissement || '—'}</span></td>
                    <td style={s.td}>
                      <span style={{...s.badge, 
                        background: row.statut === 'Payé & Confirmé' ? 'rgba(16,185,129,0.1)' : row.statut === 'Exonéré' ? 'rgba(99,102,241,0.1)' : 'rgba(245,158,11,0.1)',
                        color: row.statut === 'Payé & Confirmé' ? '#10B981' : row.statut === 'Exonéré' ? '#6366F1' : '#F59E0B'
                      }}>
                        {row.statut === 'Payé & Confirmé' ? '✓ Payé & Confirmé' : row.statut === 'Exonéré' ? '🎁 Exonéré' : '⏳ ' + (row.statut || 'En attente')}
                      </span>
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
                )) : <EmptyRow cols={readOnly ? 9 : 10} />}
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

      {isAddModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '650px' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>➕ Ajouter un nouveau participant</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={closeBtnStyle}>
                <FaTimes />
              </button>
            </div>

            {/* Category Selector Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              {(['debat', 'cif', 'delegues'] as ActiveTab[]).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setAddCategory(tab);
                    setAddFormData({});
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: 'none',
                    borderBottom: addCategory === tab ? '3px solid #10B981' : 'none',
                    background: addCategory === tab ? '#FFFFFF' : 'transparent',
                    fontWeight: addCategory === tab ? '700' : '500',
                    color: addCategory === tab ? '#10B981' : '#64748B',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  {tab === 'debat' && '🎤 Débat (D2C26)'}
                  {tab === 'cif' && '🎓 CIF 2026'}
                  {tab === 'delegues' && '🏛️ Délégué Congrès'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveAdd} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: 0 }}>
              <div style={{ ...modalBodyStyle, gap: '1rem' }}>

                {/* Common field: Nom & Prénom */}
                <div style={fieldContainerStyle}>
                  <label style={labelStyle}>Nom & Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Koffi Marc BENIN"
                    value={addFormData.nom_prenom || ''}
                    onChange={e => handleAddChange('nom_prenom', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {addCategory === 'debat' && (
                  <>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Genre *</label>
                      <select
                        value={addFormData.genre || 'Homme'}
                        onChange={e => handleAddChange('genre', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Type de participant *</label>
                      <select
                        value={addFormData.type_participant || 'universitaire'}
                        onChange={e => handleAddChange('type_participant', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="universitaire">Universitaire / Enseignant</option>
                        <option value="ong_asso">Responsable d'ONG ou d'Association</option>
                        <option value="religieux_commu">Leader religieux ou communautaire</option>
                        <option value="institution_partenaire">Institution ou Partenaire technique</option>
                        <option value="media">Média / Journaliste</option>
                        <option value="societe_civile">Acteur de la Société Civile</option>
                        <option value="etudiant">Étudiant / Jeune</option>
                        <option value="comite_orga">Comité d'organisation</option>
                        <option value="comite_scientifique">Comité scientifique</option>
                      </select>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Poste / Sous-commission (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: Sous commission logistique"
                        value={addFormData.poste || ''}
                        onChange={e => handleAddChange('poste', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Fonction / Profession (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: Enseignant-Chercheur, Étudiant, Journaliste..."
                        value={addFormData.fonction || ''}
                        onChange={e => handleAddChange('fonction', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Organisation / Établissement *</label>
                      <input
                        type="text"
                        placeholder="Ex: Université d'Abomey-Calavi"
                        value={addFormData.organisation || ''}
                        onChange={e => handleAddChange('organisation', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Ville & Pays *</label>
                      <input
                        type="text"
                        placeholder="Ex: Cotonou, Bénin"
                        value={addFormData.ville_pays || ''}
                        onChange={e => handleAddChange('ville_pays', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Téléphone / WhatsApp *</label>
                      <input
                        type="text"
                        placeholder="Ex: +229 97 00 00 00"
                        value={addFormData.telephone || ''}
                        onChange={e => handleAddChange('telephone', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Adresse Email *</label>
                      <input
                        type="email"
                        placeholder="Ex: participant@gmail.com"
                        value={addFormData.email || ''}
                        onChange={e => handleAddChange('email', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Photo de profil</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {addFormData.photo_profil && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <img src={addFormData.photo_profil} alt="Profil" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 'bold' }}>✓ Photo chargée</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input
                            type="text"
                            placeholder="URL de la photo (https://...)"
                            value={addFormData.photo_profil || ''}
                            onChange={e => handleAddChange('photo_profil', e.target.value)}
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <label style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 0.75rem',
                            background: isUploadingPhoto ? '#94A3B8' : '#3B82F6',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: isUploadingPhoto ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap'
                          }}>
                            {isUploadingPhoto ? 'Envoi...' : <><FaUpload /> Importer</>}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingPhoto}
                              style={{ display: 'none' }}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleAddPhotoUpload(f);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Participer aussi au CIF ?</label>
                      <select
                        value={addFormData.participer_cif || 'non'}
                        onChange={e => handleAddChange('participer_cif', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="non">Non</option>
                        <option value="oui">Oui</option>
                      </select>
                    </div>
                  </>
                )}

                {addCategory === 'cif' && (
                  <>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Genre *</label>
                      <select
                        value={addFormData.genre || 'M'}
                        onChange={e => handleAddChange('genre', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="M">Masculin (M)</option>
                        <option value="F">Féminin (F)</option>
                      </select>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Tranche d'âge *</label>
                      <select
                        value={addFormData.tranche_age || '26_35'}
                        onChange={e => handleAddChange('tranche_age', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="moins_18">Moins de 18 ans</option>
                        <option value="18_25">18 à 25 ans</option>
                        <option value="26_35">26 à 35 ans</option>
                        <option value="plus_35">Plus de 35 ans</option>
                      </select>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Statut de paiement *</label>
                      <select
                        value={addFormData.statut || 'Payé & Confirmé'}
                        onChange={e => handleAddChange('statut', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="Payé & Confirmé">💳 Payé & Confirmé</option>
                        <option value="Exonéré">🎁 Exonéré</option>
                        <option value="En attente de paiement">⏳ En attente de paiement</option>
                      </select>
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Ville & Pays *</label>
                      <input
                        type="text"
                        placeholder="Ex: Cotonou, Bénin"
                        value={addFormData.ville_pays || ''}
                        onChange={e => handleAddChange('ville_pays', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Établissement / Organisation *</label>
                      <input
                        type="text"
                        placeholder="Ex: Faculté de Droit"
                        value={addFormData.etablissement || ''}
                        onChange={e => handleAddChange('etablissement', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Numéro WhatsApp *</label>
                      <input
                        type="text"
                        placeholder="Ex: +229 97 00 00 00"
                        value={addFormData.whatsapp || ''}
                        onChange={e => handleAddChange('whatsapp', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Adresse Email *</label>
                      <input
                        type="email"
                        placeholder="Ex: cif.participant@gmail.com"
                        value={addFormData.email || ''}
                        onChange={e => handleAddChange('email', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Association (Facultatif)</label>
                      <input
                        type="text"
                        placeholder="Ex: Club des Juristes"
                        value={addFormData.association || ''}
                        onChange={e => handleAddChange('association', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Moyen de déplacement</label>
                      <select
                        value={addFormData.moyen_deplacement || 'bus_car'}
                        onChange={e => handleAddChange('moyen_deplacement', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="bus_car">Bus / Car (transport commun)</option>
                        <option value="avion">Avion</option>
                        <option value="voiture_perso">Voiture personnelle</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={fieldContainerStyle}>
                        <label style={labelStyle}>Date d'arrivée</label>
                        <input
                          type="text"
                          placeholder="Ex: 24/07/2026 14:00"
                          value={addFormData.date_arrivee || ''}
                          onChange={e => handleAddChange('date_arrivee', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                      <div style={fieldContainerStyle}>
                        <label style={labelStyle}>Date de départ</label>
                        <input
                          type="text"
                          placeholder="Ex: 28/07/2026 10:00"
                          value={addFormData.date_depart || ''}
                          onChange={e => handleAddChange('date_depart', e.target.value)}
                          style={inputStyle}
                        />
                      </div>
                    </div>
                  </>
                )}

                {addCategory === 'delegues' && (
                  <>
                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Structure représentée *</label>
                      <input
                        type="text"
                        placeholder="Ex: Bureau National AIMB"
                        value={addFormData.structure || ''}
                        onChange={e => handleAddChange('structure', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Pays *</label>
                      <input
                        type="text"
                        placeholder="Ex: Bénin"
                        value={addFormData.pays || ''}
                        onChange={e => handleAddChange('pays', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Mandat / Fonction *</label>
                      <input
                        type="text"
                        placeholder="Ex: Président National"
                        value={addFormData.mandat || ''}
                        onChange={e => handleAddChange('mandat', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Téléphone / WhatsApp *</label>
                      <input
                        type="text"
                        placeholder="Ex: +229 97 00 00 00"
                        value={addFormData.telephone || ''}
                        onChange={e => handleAddChange('telephone', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Adresse Email *</label>
                      <input
                        type="email"
                        placeholder="Ex: delegue@aimb.org"
                        value={addFormData.email || ''}
                        onChange={e => handleAddChange('email', e.target.value)}
                        style={inputStyle}
                      />
                    </div>

                    <div style={fieldContainerStyle}>
                      <label style={labelStyle}>Statut *</label>
                      <select
                        value={addFormData.statut || 'valide'}
                        onChange={e => handleAddChange('statut', e.target.value)}
                        style={inputStyle}
                      >
                        <option value="valide">Validé</option>
                        <option value="en_attente">En attente</option>
                        <option value="rejete">Rejeté</option>
                      </select>
                    </div>
                  </>
                )}

              </div>

              <div style={modalFooterStyle}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', background: '#64748B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: '0.5rem 1.25rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {isSubmitting ? 'Ajout en cours...' : 'Ajouter le participant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

const modalHeaderStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  color: '#64748B',
};

const modalBodyStyle: React.CSSProperties = {
  padding: '1.5rem',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const modalFooterStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderTop: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'flex-end',
};

const fieldContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#475569',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: '4px',
  border: '1px solid #CBD5E1',
  fontSize: '0.95rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

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
