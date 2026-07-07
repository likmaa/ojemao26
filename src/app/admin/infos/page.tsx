'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import {
  adminSaveAccommodation, adminDeleteAccommodation,
  adminSaveContact, adminDeleteContact,
  adminSaveFocalPoint, adminDeleteFocalPoint,
} from '@/app/lib/admin-actions';

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

type FocalPoint = {
  id: string;
  country: string;
  flag: string;
  name: string;
  phone: string;
  wa: string;
  email?: string;
};

export default function InfosAdminPage() {
  const [activeTab, setActiveTab] = useState<'accommodations' | 'contacts' | 'focal_points'>('accommodations');
  
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [focalPoints, setFocalPoints] = useState<FocalPoint[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for accommodations
  const [hotelForm, setHotelForm] = useState({ id: '', name: '', description: '', distance: '' });
  
  // Form states for contacts
  const [contactForm, setContactForm] = useState({ id: '', label: '', value: '', icon_type: 'phone' });

  // Form states for focal points
  const [focalForm, setFocalForm] = useState({ id: '', country: '', flag: '', name: '', phone: '', wa: '', email: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: accData } = await supabase.from('accommodations').select('*').order('created_at', { ascending: true });
    if (accData) setAccommodations(accData);

    const { data: conData } = await supabase.from('contacts').select('*').order('created_at', { ascending: true });
    if (conData) setContacts(conData);

    const { data: fpData } = await supabase.from('focal_points').select('*').order('country', { ascending: true });
    if (fpData) setFocalPoints(fpData);
    
    setLoading(false);
  };

  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminSaveAccommodation({
      id: hotelForm.id || undefined,
      name: hotelForm.name,
      description: hotelForm.description,
      distance: hotelForm.distance,
    });
    if (result?.error) alert("Erreur lors de l'enregistrement : " + result.error);
    setHotelForm({ id: '', name: '', description: '', distance: '' });
    fetchData();
  };

  const handleDeleteHotel = async (id: string) => {
    if (confirm('Supprimer cet hébergement ?')) {
      const result = await adminDeleteAccommodation(id);
      if (result?.error) alert("Erreur lors de la suppression : " + result.error);
      fetchData();
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminSaveContact({
      id: contactForm.id || undefined,
      label: contactForm.label,
      value: contactForm.value,
      icon_type: contactForm.icon_type,
    });
    if (result?.error) alert("Erreur lors de l'enregistrement : " + result.error);
    setContactForm({ id: '', label: '', value: '', icon_type: 'phone' });
    fetchData();
  };

  const handleDeleteContact = async (id: string) => {
    if (confirm('Supprimer ce contact ?')) {
      const result = await adminDeleteContact(id);
      if (result?.error) alert("Erreur lors de la suppression : " + result.error);
      fetchData();
    }
  };

  const handleSaveFocal = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminSaveFocalPoint({
      id: focalForm.id || undefined,
      country: focalForm.country,
      flag: focalForm.flag,
      name: focalForm.name,
      phone: focalForm.phone,
      wa: focalForm.wa,
      email: focalForm.email || undefined,
    });
    if (result?.error) alert("Erreur lors de l'enregistrement : " + result.error);
    setFocalForm({ id: '', country: '', flag: '', name: '', phone: '', wa: '', email: '' });
    fetchData();
  };

  const handleDeleteFocal = async (id: string) => {
    if (confirm('Supprimer ce point focal ?')) {
      const result = await adminDeleteFocalPoint(id);
      if (result?.error) alert("Erreur lors de la suppression : " + result.error);
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
        <button 
          style={{...styles.tab, ...(activeTab === 'focal_points' ? styles.activeTab : {})}}
          onClick={() => setActiveTab('focal_points')}
        >
          🌍 Points Focaux
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
            {/* FOCAL POINTS TAB */}
            {activeTab === 'focal_points' && (
              <div style={styles.grid}>
                <div style={styles.formSection}>
                  <h2 style={styles.sectionTitle}>{focalForm.id ? 'Modifier' : 'Ajouter'} un point focal</h2>
                  <form onSubmit={handleSaveFocal} style={styles.form}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Pays</label>
                      <input type="text" value={focalForm.country} onChange={(e) => setFocalForm({...focalForm, country: e.target.value})} style={styles.input} required placeholder="Ex: Bénin" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Drapeau (Emoji)</label>
                      <input type="text" value={focalForm.flag} onChange={(e) => setFocalForm({...focalForm, flag: e.target.value})} style={styles.input} required placeholder="Ex: 🇧🇯" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Nom du représentant</label>
                      <input type="text" value={focalForm.name} onChange={(e) => setFocalForm({...focalForm, name: e.target.value})} style={styles.input} required placeholder="Ex: El Hadj Soulémane" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Téléphone affiché</label>
                      <input type="text" value={focalForm.phone} onChange={(e) => setFocalForm({...focalForm, phone: e.target.value})} style={styles.input} required placeholder="Ex: +229 97 12 34 56" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>WhatsApp (Sans '+' ni espaces)</label>
                      <input type="text" value={focalForm.wa} onChange={(e) => setFocalForm({...focalForm, wa: e.target.value})} style={styles.input} required placeholder="Ex: 22997123456" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email du Point Focal (pour notifications automatiques)</label>
                      <input type="email" value={focalForm.email} onChange={(e) => setFocalForm({...focalForm, email: e.target.value})} style={styles.input} placeholder="Ex: focal@association.com" />
                    </div>
                    <div style={styles.formActions}>
                      {focalForm.id && (
                        <button type="button" onClick={() => setFocalForm({ id: '', country: '', flag: '', name: '', phone: '', wa: '', email: '' })} style={styles.cancelBtn}>Annuler</button>
                      )}
                      <button type="submit" style={styles.submitBtn}>Enregistrer</button>
                    </div>
                  </form>
                </div>

                <div style={styles.listSection}>
                  <h2 style={styles.sectionTitle}>Liste des Points Focaux</h2>
                  <div style={styles.list}>
                    {focalPoints.map(fp => (
                      <div key={fp.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                          <h3 style={styles.cardTitle}>{fp.flag} {fp.country}</h3>
                        </div>
                        <p style={styles.cardText}>
                          Représentant : <strong>{fp.name}</strong><br />
                          Tél : <span style={{color: 'var(--primary)'}}>{fp.phone}</span><br />
                          WhatsApp payload : <span style={{color: 'var(--accent)', fontSize: '0.85rem'}}>{fp.wa}</span><br />
                          {fp.email && <>
                            Email : <span style={{color: '#6366f1', fontSize: '0.85rem'}}>{fp.email}</span> <span style={{background:'rgba(99,102,241,0.1)',color:'#6366f1',padding:'1px 6px',borderRadius:'20px',fontSize:'0.75rem',fontWeight:'700'}}>✉ Notifs ON</span>
                          </>}
                        </p>
                        <div style={styles.cardActions}>
                          <button onClick={() => setFocalForm({...fp, email: fp.email || ''})} style={styles.editBtn}>✏️ Modifier</button>
                          <button onClick={() => handleDeleteFocal(fp.id)} style={styles.deleteBtn}>🗑️ Supprimer</button>
                        </div>
                      </div>
                    ))}
                    {focalPoints.length === 0 && <p style={styles.empty}>Aucun point focal enregistré.</p>}
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
