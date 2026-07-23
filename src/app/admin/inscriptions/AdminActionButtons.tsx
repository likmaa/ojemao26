'use client';

import { useState } from 'react';
import { deleteInscription, updateStatus, validerDelegue, updateInscription } from '@/app/lib/admin-actions';
import { FaTrash, FaCheck, FaEye, FaTimes, FaTicketAlt, FaFileAlt, FaEdit } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

interface AdminActionButtonsProps {
  id: string;
  table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres';
  data: any; // Full row data
  currentStatus?: string; // For CIF
}

const fieldLabels: Record<string, string> = {
  nom_prenom: 'Nom & Prénom',
  genre: 'Genre',
  email: 'Adresse Email',
  telephone: 'Téléphone',
  whatsapp: 'Numéro WhatsApp',
  ville_pays: 'Ville & Pays',
  pays: 'Pays',
  organisation: 'Organisation',
  etablissement: 'Établissement / Organisation',
  structure: 'Structure représentée',
  type_participant: 'Type de participant',
  poste: 'Poste / Sous-commission',
  mandat: 'Mandat / Fonction',
  numero_chaise: 'N° de Place',
  immatriculation: 'Matricule',
  organe_presse: 'Organe de presse',
  participer_cif: 'Participer au CIF',
  photo_profil: 'URL Photo de profil',
  tranche_age: "Tranche d'âge",
  statut: 'Statut',
  association: 'Association',
  moyen_deplacement: 'Moyen de déplacement',
  date_arrivee: "Date & Heure d'arrivée",
  date_depart: "Date & Heure de départ",
  comment_connu: 'Comment connu',
  attente: 'Attentes',
  nombre_delegues: 'Nombre de délégués',
};

export default function AdminActionButtons({ id, table, data, currentStatus }: AdminActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = () => {
    const initial = { ...data };
    delete initial.id;
    delete initial.created_at;
    delete initial.scanne_le;
    setEditFormData(initial);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (key: string, value: any) => {
    setEditFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateInscription(id, table, editFormData);
    if (res.success) {
      setIsEditModalOpen(false);
    } else {
      alert(res.error || 'Erreur lors de la modification.');
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette inscription définitivement ?')) return;
    
    setIsDeleting(true);
    const res = await deleteInscription(id, table);
    if (!res.success) {
      alert(res.error);
    }
    setIsDeleting(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (table !== 'inscriptions_cif') return;
    
    setIsUpdating(true);
    const res = await updateStatus(id, table, newStatus);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  const handleValidateDelegue = async () => {
    if (!window.confirm('Voulez-vous valider ce délégué ? Un email officiel lui sera envoyé immédiatement.')) return;
    
    setIsUpdating(true);
    const res = await validerDelegue(id);
    if (!res.success) {
      alert(res.error);
    }
    setIsUpdating(false);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ ...btnStyle, background: '#EFF6FF', color: '#3B82F6' }}
          title="Voir les détails"
        >
          <FaEye />
        </button>

        <button 
          onClick={handleOpenEdit}
          style={{ ...btnStyle, background: '#FEF3C7', color: '#D97706' }}
          title="Modifier l'inscription"
        >
          <FaEdit />
        </button>

        {table === 'inscriptions_debat' && (
          <button 
            onClick={() => setIsPassModalOpen(true)}
            style={{ ...btnStyle, background: '#FDF4FF', color: '#C026D3' }}
            title="Voir le Passe"
          >
            <FaTicketAlt />
          </button>
        )}

        {table === 'inscriptions_cif' && currentStatus === 'En attente de paiement' && (
          <button 
            onClick={() => handleStatusChange('Payé & Confirmé')}
            disabled={isUpdating}
            style={{ ...btnStyle, background: '#ECFDF5', color: '#10B981' }}
            title="Marquer comme payé"
          >
            {isUpdating ? '...' : <FaCheck />}
          </button>
        )}

        {table === 'delegues_congres' && currentStatus === 'en_attente' && (
          <button 
            onClick={handleValidateDelegue}
            disabled={isUpdating}
            style={{ ...btnStyle, background: '#ECFDF5', color: '#10B981' }}
            title="Valider et envoyer l'email"
          >
            {isUpdating ? '...' : <FaCheck />}
          </button>
        )}

        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          style={{ ...btnStyle, background: '#FEF2F2', color: '#EF4444' }}
          title="Supprimer"
        >
          {isDeleting ? '...' : <FaTrash />}
        </button>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Détails de l'inscription</h3>
              <button onClick={() => setIsModalOpen(false)} style={closeBtnStyle}>
                <FaTimes />
              </button>
            </div>
            
            <div style={modalBodyStyle}>
              {Object.entries(data).map(([key, value]) => {
                if (key === 'id') return null; // Hide ID
                
                return (
                  <div key={key} style={detailRowStyle}>
                    <strong style={detailKeyStyle}>{key.replace(/_/g, ' ')} :</strong>
                    {key.includes('url') && value ? (
                      <a href={value as string} target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
                        Voir le document <FaFileAlt />
                      </a>
                    ) : key === 'photo_profil' && value ? (
                      <div>
                        <a href={value as string} target="_blank" rel="noopener noreferrer">
                          <img src={value as string} alt="Photo de profil" style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                        </a>
                      </div>
                    ) : (
                      <span style={detailValueStyle}>
                        {value !== null && value !== undefined && value !== '' ? String(value) : <em style={{color: '#94A3B8'}}>Non renseigné</em>}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div style={modalFooterStyle}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {isPassModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '400px' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Passe d'Accès (D2C26)</h3>
              <button onClick={() => setIsPassModalOpen(false)} style={closeBtnStyle}>
                <FaTimes />
              </button>
            </div>
            
            <div style={{ ...modalBodyStyle, background: '#F8FAFC', padding: '2rem' }}>
              <div style={{
                background: 'white', 
                border: '2px dashed #CBD5E1', 
                borderRadius: '12px', 
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  D2C26-CIF & Congrès
                </div>
                <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', color: '#0F172A' }}>
                  {data.nom_prenom}
                </h4>
                
                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748B' }}>Numéro de Place</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10B981', lineHeight: '1' }}>
                    {data.numero_chaise || '-'}
                  </div>
                </div>
                
                <div style={{ margin: '1rem 0' }}>
                  <QRCodeCanvas 
                    value={`https://ojemao26.com/admin/verify?id=${data.id}`}
                    size={150}
                    level={"H"}
                    includeMargin={true}
                    style={{ margin: '0 auto', display: 'block' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.5rem' }}>Scanner pour vérifier l'accès</div>
                </div>

                {data.immatriculation && (
                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Matricule</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3B82F6' }}>
                      {data.immatriculation}
                    </div>
                  </div>
                )}
                
                <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '1.5rem', background: '#F1F5F9', padding: '0.5rem', borderRadius: '4px' }}>
                  {data.type_participant.replace(/_/g, ' ').toUpperCase()}
                </div>
              </div>
            </div>
            
            <div style={modalFooterStyle}>
              <button onClick={() => setIsPassModalOpen(false)} style={{ padding: '0.5rem 1rem', background: '#64748B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}>
                Fermer
              </button>
              <button onClick={() => window.print()} style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, maxWidth: '650px' }}>
            <div style={modalHeaderStyle}>
              <h3 style={{ margin: 0 }}>Modifier l'inscription</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={closeBtnStyle}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', margin: 0 }}>
              <div style={{ ...modalBodyStyle, gap: '1rem' }}>
                {Object.entries(editFormData).map(([key, val]) => {
                  const label = fieldLabels[key] || key.replace(/_/g, ' ').toUpperCase();
                  
                  if (key === 'genre') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="Homme">Homme</option>
                          <option value="Femme">Femme</option>
                          <option value="M">Masculin (M)</option>
                          <option value="F">Féminin (F)</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'participer_cif') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || 'non'}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="oui">Oui</option>
                          <option value="non">Non</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'statut' && table === 'inscriptions_cif') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="En attente de paiement">En attente de paiement</option>
                          <option value="Payé & Confirmé">Payé & Confirmé</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'statut' && table === 'delegues_congres') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || 'en_attente'}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="en_attente">En attente</option>
                          <option value="valide">Validé</option>
                          <option value="rejete">Rejeté</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'type_participant' && table === 'inscriptions_debat') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
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
                    );
                  }

                  if (key === 'tranche_age') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="moins_18">Moins de 18 ans</option>
                          <option value="18_25">18 à 25 ans</option>
                          <option value="26_35">26 à 35 ans</option>
                          <option value="plus_35">Plus de 35 ans</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'moyen_deplacement') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <select
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={inputStyle}
                        >
                          <option value="avion">Avion</option>
                          <option value="bus_car">Bus / Car (transport commun)</option>
                          <option value="voiture_perso">Voiture personnelle</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                    );
                  }

                  if (typeof val === 'number') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <input
                          type="number"
                          value={val ?? ''}
                          onChange={e => handleEditChange(key, e.target.valueAsNumber || 0)}
                          style={inputStyle}
                        />
                      </div>
                    );
                  }

                  if (key === 'attente') {
                    return (
                      <div key={key} style={fieldContainerStyle}>
                        <label style={labelStyle}>{label}</label>
                        <textarea
                          rows={3}
                          value={val || ''}
                          onChange={e => handleEditChange(key, e.target.value)}
                          style={{ ...inputStyle, resize: 'vertical' }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={key} style={fieldContainerStyle}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        type="text"
                        value={val ?? ''}
                        onChange={e => handleEditChange(key, e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={modalFooterStyle}>
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  style={{ padding: '0.5rem 1rem', background: '#64748B', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem' }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving} 
                  style={{ padding: '0.5rem 1.25rem', background: '#D97706', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const btnStyle = {
  border: 'none',
  borderRadius: '4px',
  padding: '0.4rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s',
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

const detailRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  borderBottom: '1px solid #F1F5F9',
  paddingBottom: '0.5rem',
};

const detailKeyStyle: React.CSSProperties = {
  textTransform: 'capitalize',
  color: '#475569',
  fontSize: '0.85rem',
  marginBottom: '0.25rem',
};

const detailValueStyle: React.CSSProperties = {
  color: '#0F172A',
  fontWeight: '500',
  wordBreak: 'break-word',
};

const modalFooterStyle: React.CSSProperties = {
  padding: '1rem 1.5rem',
  borderTop: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'flex-end',
};
