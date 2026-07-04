'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';

type Accommodation = {
  id: string;
  name: string;
  description: string;
  distance: string;
};

type Contact = {
  id: string;
  label: string;
  value: string;
  icon_type: string;
};

export default function InfosAdminPage() {
  const [activeTab, setActiveTab] = useState<'accommodations' | 'contacts'>('accommodations');
  
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for accommodations
  const [hotelForm, setHotelForm] = useState({ id: '', name: '', description: '', distance: '' });
  
  // Form states for contacts
  const [contactForm, setContactForm] = useState({ id: '', label: '', value: '', icon_type: 'phone' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: accData } = await supabase.from('accommodations').select('*').order('created_at', { ascending: true });
    if (accData) setAccommodations(accData);

    const { data: conData } = await supabase.from('contacts').select('*').order('created_at', { ascending: true });
    if (conData) setContacts(conData);
    setLoading(false);
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hotelForm.id) {
      const { error } = await supabase.from('accommodations').update({
        name: hotelForm.name,
        description: hotelForm.description,
        distance: hotelForm.distance
      }).eq('id', hotelForm.id);
      if (error) alert("Erreur lors de la modification : " + error.message);
    } else {
      const { error } = await supabase.from('accommodations').insert([{
        name: hotelForm.name,
        description: hotelForm.description,
        distance: hotelForm.distance
      }]);
      if (error) alert("Erreur lors de l'ajout : " + error.message);
    }
    setHotelForm({ id: '', name: '', description: '', distance: '' });
    fetchData();
  };

  const handleDeleteHotel = async (id: string) => {
    if (confirm('Supprimer cet hébergement ?')) {
      const { error } = await supabase.from('accommodations').delete().eq('id', id);
      if (error) alert("Erreur lors de la suppression : " + error.message);
      fetchData();
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.id) {
      const { error } = await supabase.from('contacts').update({
        label: contactForm.label,
        value: contactForm.value,
        icon_type: contactForm.icon_type
      }).eq('id', contactForm.id);
      if (error) alert("Erreur lors de la modification : " + error.message);
    } else {
      const { error } = await supabase.from('contacts').insert([{
        label: contactForm.label,
        value: contactForm.value,
        icon_type: contactForm.icon_type
      }]);
      if (error) alert("Erreur lors de l'ajout : " + error.message);
    }
    setContactForm({ id: '', label: '', value: '', icon_type: 'phone' });
    fetchData();
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Supprimer ce contact ?')) {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) alert("Erreur lors de la suppression : " + error.message);
      fetchData();
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Gestion des Infos Pratiques</h1>
        <p style={styles.subtitle}>Gérez les hébergements recommandés et les contacts officiels.</p>
      </header>

      <div style={styles.tabsContainer}>
        <button 
          style={{...styles.tab, ...(activeTab === 'accommodations' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('accommodations')}
        >
          🏨 Hébergements
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'contacts' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('contacts')}
        >
          📞 Contacts du Comité
        </button>
      </div>

      <div style={styles.contentArea}>
        {loading ? (
          <div style={styles.loading}>Chargement des données...</div>
        ) : (
          <>
            {/* ACCOMMODATIONS TAB */}
            {activeTab === 'accommodations' && (
              <div style={styles.grid}>
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>{hotelForm.id ? 'Modifier' : 'Ajouter'} un hébergement</h2>
                  <form onSubmit={handleSaveHotel} style={styles.form}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nom de l'hôtel / résidence</label>
                      <input type="text" value={hotelForm.name} onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Distance / Situation (ex: Sur le site, 5 min)</label>
                      <input type="text" value={hotelForm.distance} onChange={(e) => setHotelForm({...hotelForm, distance: e.target.value})} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Description & Services</label>
                      <textarea value={hotelForm.description} onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})} style={styles.textarea} required rows={3} />
                    </div>
                    <div style={styles.formActions}>
                      {hotelForm.id && (
                        <button type="button" onClick={() => setHotelForm({ id: '', name: '', description: '', distance: '' })} style={styles.cancelBtn}>Annuler</button>
                      )}
                      <button type="submit" style={styles.submitBtn}>Enregistrer</button>
                    </div>
                  </form>
                </div>

                <div style={styles.listSection}>
                  <h2 style={styles.sectionTitle}>Liste des Hébergements</h2>
                  <div style={styles.list}>
                    {accommodations.map(acc => (
                      <div key={acc.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                          <h3 style={styles.cardTitle}>{acc.name}</h3>
                          <span style={styles.badge}>{acc.distance}</span>
                        </div>
                        <p style={styles.cardText}>{acc.description}</p>
                        <div style={styles.cardActions}>
                          <button onClick={() => setHotelForm(acc)} style={styles.editBtn}>✏️ Modifier</button>
                          <button onClick={() => handleDeleteHotel(acc.id)} style={styles.deleteBtn}>🗑️ Supprimer</button>
                        </div>
                      </div>
                    ))}
                    {accommodations.length === 0 && <p style={styles.empty}>Aucun hébergement enregistré.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* CONTACTS TAB */}
            {activeTab === 'contacts' && (
              <div style={styles.grid}>
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>{contactForm.id ? 'Modifier' : 'Ajouter'} un contact</h2>
                  <form onSubmit={handleSaveContact} style={styles.form}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Libellé (ex: SECRÉTARIAT GÉNÉRAL)</label>
                      <input type="text" value={contactForm.label} onChange={(e) => setContactForm({...contactForm, label: e.target.value})} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Valeur (ex: +229 90 00 00 00)</label>
                      <input type="text" value={contactForm.value} onChange={(e) => setContactForm({...contactForm, value: e.target.value})} style={styles.input} required />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Type (Icône)</label>
                      <select value={contactForm.icon_type} onChange={(e) => setContactForm({...contactForm, icon_type: e.target.value})} style={styles.select}>
                        <option value="phone">Téléphone / WhatsApp</option>
                        <option value="email">Email</option>
                        <option value="location">Lieu</option>
                      </select>
                    </div>
                    <div style={styles.formActions}>
                      {contactForm.id && (
                        <button type="button" onClick={() => setContactForm({ id: '', label: '', value: '', icon_type: 'phone' })} style={styles.cancelBtn}>Annuler</button>
                      )}
                      <button type="submit" style={styles.submitBtn}>Enregistrer</button>
                    </div>
                  </form>
                </div>

                <div style={styles.listSection}>
                  <h2 style={styles.sectionTitle}>Liste des Contacts</h2>
                  <div style={styles.list}>
                    {contacts.map(contact => (
                      <div key={contact.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                          <h3 style={styles.cardTitle}>{contact.icon_type === 'phone' ? '📞' : contact.icon_type === 'email' ? '📧' : '📍'} {contact.label}</h3>
                        </div>
                        <p style={styles.cardText}><strong style={{color: 'var(--primary)'}}>{contact.value}</strong></p>
                        <div style={styles.cardActions}>
                          <button onClick={() => setContactForm(contact)} style={styles.editBtn}>✏️ Modifier</button>
                          <button onClick={() => handleDeleteContact(contact.id)} style={styles.deleteBtn}>🗑️ Supprimer</button>
                        </div>
                      </div>
                    ))}
                    {contacts.length === 0 && <p style={styles.empty}>Aucun contact enregistré.</p>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
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
  tabsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '1rem',
  },
  tab: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#475569',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    background: 'var(--primary)',
    color: '#FFFFFF',
    border: '1px solid var(--primary)',
  },
  contentArea: {
    minHeight: '400px',
  },
  loading: {
    padding: '3rem',
    textAlign: 'center' as const,
    color: '#64748B',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  formSection: {
    background: '#FFFFFF',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  listSection: {},
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '1.5rem',
    color: '#0A1628',
    borderBottom: '1px solid #F1F5F9',
    paddingBottom: '0.75rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  inputGroup: {
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
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical' as const,
  },
  select: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #CBD5E1',
    fontSize: '0.95rem',
    outline: 'none',
    background: '#FFFFFF',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitBtn: {
    flex: 1,
    padding: '0.75rem',
    background: 'var(--primary)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    background: '#F1F5F9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  card: {
    background: '#FFFFFF',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0A1628',
  },
  badge: {
    background: 'rgba(56, 165, 84, 0.1)',
    color: 'var(--primary)',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  cardText: {
    color: '#475569',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  cardActions: {
    display: 'flex',
    gap: '1rem',
    borderTop: '1px solid #F1F5F9',
    paddingTop: '0.75rem',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#034389',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#EF4444',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  empty: {
    color: '#94A3B8',
    textAlign: 'center' as const,
    padding: '2rem',
    border: '1px dashed #CBD5E1',
    borderRadius: '8px',
  },
};
