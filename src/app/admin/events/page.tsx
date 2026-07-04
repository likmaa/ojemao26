'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { FaUpload, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';

export default function AdminEvents() {
  const [uploadingDebat, setUploadingDebat] = useState(false);
  const [uploadingCif, setUploadingCif] = useState(false);
  const [debatPreview, setDebatPreview] = useState('/images/affiche-d1.jpg');
  const [cifPreview, setCifPreview] = useState('/images/affiche-co1.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      const { data } = await supabase.from('events').select('*');
      if (data) {
        const d = data.find(e => e.title === 'debat');
        if (d?.image_url) setDebatPreview(d.image_url);
        
        const c = data.find(e => e.title === 'cif');
        if (c?.image_url) setCifPreview(c.image_url);
      }
      setLoading(false);
    }
    loadImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventType: 'debat' | 'cif') => {
    try {
      if (eventType === 'debat') setUploadingDebat(true);
      if (eventType === 'cif') setUploadingCif(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('Vous devez sélectionner une image à uploader.');
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${eventType}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('speakers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('speakers').getPublicUrl(fileName);
      const newUrl = data.publicUrl;
      
      const { data: existing, error: selectError } = await supabase.from('events').select('id').eq('title', eventType).maybeSingle();
      if (selectError) throw selectError;
      
      if (existing) {
        const { error: updateError } = await supabase.from('events').update({ image_url: newUrl }).eq('id', existing.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('events').insert([
          { title: eventType, image_url: newUrl, date_badge: '', description: '', link_url: '' }
        ]);
        if (insertError) throw insertError;
      }

      if (eventType === 'debat') setDebatPreview(newUrl);
      if (eventType === 'cif') setCifPreview(newUrl);

      alert('Image mise à jour avec succès !');
    } catch (error: any) {
      alert(error.message || 'Erreur lors de l\'upload de l\'image.');
      console.error(error);
    } finally {
      if (eventType === 'debat') setUploadingDebat(false);
      if (eventType === 'cif') setUploadingCif(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Changer les affiches</h1>
          <p style={styles.subtitle}>Modifiez uniquement les images des événements sur la page d'accueil et les pages de détails.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Chargement des affiches...</div>
      ) : (
        <div style={styles.container}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Affiche Débat de Cotonou</h3>
            <div style={styles.previewContainer}>
              <Image src={debatPreview} alt="Aperçu Débat" fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'debat')}
                disabled={uploadingDebat}
                style={{ display: 'none' }}
                id="upload-debat"
              />
              <label htmlFor="upload-debat" style={styles.uploadBtn}>
                {uploadingDebat ? <FaSpinner className="fa-spin" /> : <FaUpload />}
                {uploadingDebat ? ' Upload en cours...' : ' Remplacer l\'affiche'}
              </label>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Affiche Colloque CIF & Congrès</h3>
            <div style={styles.previewContainer}>
              <Image src={cifPreview} alt="Aperçu CIF" fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'cif')}
                disabled={uploadingCif}
                style={{ display: 'none' }}
                id="upload-cif"
              />
              <label htmlFor="upload-cif" style={styles.uploadBtn}>
                {uploadingCif ? <FaSpinner className="fa-spin" /> : <FaUpload />}
                {uploadingCif ? ' Upload en cours...' : ' Remplacer l\'affiche'}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#0A1628',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#475569',
    fontSize: '1.1rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#0A1628',
    marginBottom: '1rem',
  },
  previewContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '250px',
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: '#64748B',
    marginBottom: '1.5rem',
  },
  uploadArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--primary)',
    color: '#FFFFFF',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    width: '100%',
    transition: 'background-color 0.2s',
  }
};
