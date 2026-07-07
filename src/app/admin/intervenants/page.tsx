'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { adminDeleteSpeaker } from '@/app/lib/admin-actions';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';


interface Speaker {
  id: string;
  name: string;
  title: string;
  role: string;
  category: string;
  image_url: string;
}

export default function AdminIntervenants() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    role: '',
    category: 'Experts',
    image_url: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchSpeakers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching speakers:', error);
      alert('Erreur lors du chargement des intervenants.');
    } else {
      setSpeakers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleOpenModal = (speaker?: Speaker) => {
    if (speaker) {
      setEditingSpeaker(speaker);
      setFormData({
        name: speaker.name,
        title: speaker.title,
        role: speaker.role,
        category: speaker.category,
        image_url: speaker.image_url,
      });
    } else {
      setEditingSpeaker(null);
      setFormData({ name: '', title: '', role: '', category: 'Experts', image_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpeaker(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à uploader.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('speakers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('speakers').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      alert('Image uploadée avec succès !');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'upload de l\'image.');
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Appel Server Action (supabaseAdmin) pour INSERT ou UPDATE
    const { adminSaveSpeaker } = await import('@/app/lib/admin-actions');
    const result = await adminSaveSpeaker({
      id: editingSpeaker?.id || undefined,
      nom: formData.name,
      titre: formData.title,
      bio: formData.role,
      photo_url: formData.image_url || undefined,
      pays: formData.category,
    });

    if (result?.error) {
      alert('Erreur lors de l\'enregistrement : ' + result.error);
      console.error(result.error);
    }

    handleCloseModal();
    fetchSpeakers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet intervenant ?')) {
      const result = await adminDeleteSpeaker(id);
      if (result?.error) {
        alert('Erreur lors de la suppression : ' + result.error);
      } else {
        fetchSpeakers();
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestion des Intervenants</h1>
          <p style={styles.subtitle}>Ajoutez et gérez les intervenants affichés sur le site public.</p>
        </div>
        <button onClick={() => handleOpenModal()} style={styles.addBtn} className="btn btn-primary">
          <FaPlus /> Ajouter un intervenant
        </button>
      </div>

      <div style={styles.tableContainer}>
        {loading && speakers.length === 0 ? (
          <div style={styles.loading}>
            <FaSpinner className="fa-spin" size={24} color="var(--primary)" />
            <span>Chargement...</span>
          </div>
        ) : speakers.length === 0 ? (
          <div style={styles.empty}>Aucun intervenant trouvé.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Photo</th>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Titre</th>
                <th style={styles.th}>Rôle</th>
                <th style={styles.th}>Catégorie</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => (
                <tr key={speaker.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.avatar}>
                      <Image 
                        src={speaker.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}&background=E2E8F0`}
                        alt={speaker.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td style={styles.td}><strong>{speaker.name}</strong></td>
                  <td style={styles.td}>{speaker.title}</td>
                  <td style={styles.td}>{speaker.role}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{speaker.category}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => handleOpenModal(speaker)} style={styles.editBtn} title="Modifier">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(speaker.id)} style={styles.deleteBtn} title="Supprimer">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              {editingSpeaker ? 'Modifier l\'intervenant' : 'Ajouter un intervenant'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nom complet</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={styles.input}
                  placeholder="ex: Dr. Bakary SAMBE"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Titre / Fonction</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={styles.input}
                  placeholder="ex: Président, Timbuktu Institute"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rôle dans l'événement</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={styles.input}
                  placeholder="ex: Expert & Panéliste"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Catégorie</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={styles.input}
                >
                  <option value="Dignitaires">Dignitaires</option>
                  <option value="Experts">Experts</option>
                  <option value="Leaders">Leaders Religieux & Associatifs</option>
                </select>
              </div>
              
              <div style={{ ...styles.formGroup, backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={styles.label}>Photo de l'intervenant (2 options)</label>
                
                {/* Option 1: File Upload */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Option 1 : Importer une image depuis votre ordinateur</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ fontSize: '0.85rem' }}
                  />
                  {uploadingImage && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', marginLeft: '0.5rem' }}>Upload en cours... <FaSpinner className="fa-spin" /></span>}
                </div>
                
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.75rem' }}>- OU -</div>

                {/* Option 2: URL Input */}
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.25rem' }}>Option 2 : Coller un lien direct vers une image (Optionnel)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    style={styles.input}
                    placeholder="https://..."
                  />
                </div>
                <small style={{ color: '#64748B', marginTop: '0.5rem', display: 'block' }}>
                  Astuce : Utilisez https://ui-avatars.com/api/?name=... si vous n'avez pas de photo.
                </small>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} style={styles.cancelBtn}>
                  Annuler
                </button>
                <button type="submit" disabled={loading || uploadingImage} style={styles.submitBtn}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#64748B',
    fontSize: '1rem',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    fontSize: '0.9rem',
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    minWidth: '800px',
  },
  thRow: {
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
  },
  th: {
    padding: '1rem',
    textAlign: 'left' as const,
    fontWeight: '600',
    color: '#475569',
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  tr: {
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#0F172A',
    verticalAlign: 'middle' as const,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    position: 'relative' as const,
    backgroundColor: '#E2E8F0',
  },
  badge: {
    backgroundColor: 'rgba(56, 165, 84, 0.1)',
    color: 'var(--primary)',
    padding: '0.25rem 0.75rem',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#3B82F6',
    cursor: 'pointer',
    padding: '0.25rem',
    fontSize: '1rem',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    padding: '0.25rem',
    fontSize: '1rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
    padding: '4rem',
    color: '#64748B',
  },
  empty: {
    padding: '4rem',
    textAlign: 'center' as const,
    color: '#64748B',
  },
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)',
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '0.95rem',
    width: '100%',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  submitBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: 'var(--primary)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  }
};
