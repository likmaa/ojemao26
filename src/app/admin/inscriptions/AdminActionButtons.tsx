'use client';

import { useState } from 'react';
import { deleteInscription, updateStatus, validerDelegue } from '@/app/lib/admin-actions';
import { FaTrash, FaCheck, FaEye, FaTimes, FaTicketAlt, FaFileAlt } from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';

interface AdminActionButtonsProps {
  id: string;
  table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres';
  data: any; // Full row data
  currentStatus?: string; // For CIF
}

export default function AdminActionButtons({ id, table, data, currentStatus }: AdminActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

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
