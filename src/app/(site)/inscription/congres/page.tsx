'use client';

import { useActionState, useRef, useState } from 'react';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { submitInscriptionCongres } from '@/app/lib/actions';
import FormField from '@/app/components/FormField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function InscriptionCongres() {
  const [state, formAction, pending] = useActionState(submitInscriptionCongres, null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [telephone, setTelephone] = useState(state?.fields?.telephone || '');
  const [clientError, setClientError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError('');
    const form = e.currentTarget;
    const missionFile = (form.elements.namedItem('document_mission') as HTMLInputElement)?.files?.[0];
    const identiteFile = (form.elements.namedItem('document_identite') as HTMLInputElement)?.files?.[0];

    const MAX_SIZE = 4 * 1024 * 1024; // 4 MB

    if (missionFile && missionFile.size > MAX_SIZE) {
      e.preventDefault();
      setClientError('L\'ordre de mission est trop volumineux (maximum 4 Mo).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (identiteFile && identiteFile.size > MAX_SIZE) {
      e.preventDefault();
      setClientError('La pièce d\'identité est trop volumineuse (maximum 4 Mo).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  return (
    <main style={styles.page} className="animate-fade-in">
      <div style={styles.container}>
        {/* En-tête */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <div style={styles.logoInitials}>
              <span style={{ color: '#FCD34D' }}>O</span>
              <span style={{ color: '#10B981' }}>J</span>
              <span style={{ color: '#3B82F6' }}>E</span>
            </div>
            <h1 style={styles.title}>Congrès (Délégués)</h1>
          </div>
          <p style={styles.subtitle}>Enregistrement Officiel des Délégations - OJEMAO</p>
        </div>

        {/* Formulaire */}
        <div style={styles.formCard}>
          {state?.success ? (
            <div style={styles.successMessage}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={{ color: '#10B981', marginBottom: '1rem' }}>Dossier Soumis !</h2>
              <p style={{ color: '#475569', marginBottom: '2rem' }}>
                {state.message}
              </p>
              <Link href="/" style={styles.backButton}>
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <form action={formAction} onSubmit={handleSubmit} style={styles.form}>
              {(clientError || state?.error) && (
                <div style={styles.errorMessage}>
                  ⚠️ {clientError || state?.error}
                </div>
              )}

              {/* SECTION 1: Identité & Fonction */}
              <h3 style={styles.sectionTitle}>1. Informations du Délégué</h3>
              
              <div style={styles.grid}>
                <FormField
                  label="Nom et Prénoms"
                  name="nom_prenom"
                  required={true}
                  placeholder="Votre nom complet"
                  defaultValue={state?.fields?.nom_prenom}
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Pays"
                  name="pays"
                  required={true}
                  placeholder="Ex: Bénin, Togo, France..."
                  defaultValue={state?.fields?.pays}
                />

                <FormField
                  label="Structure Représentée"
                  name="structure"
                  required={true}
                  placeholder="Ex: Section OJEMAO Bénin, ONG Partenaire..."
                  defaultValue={state?.fields?.structure}
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Fonction / Poste (Mandat)"
                  name="mandat"
                  required={true}
                  placeholder="Ex: Secrétaire Général, Président..."
                  defaultValue={state?.fields?.mandat}
                />

                <div style={styles.phoneGroup}>
                  <label style={styles.phoneLabel}>Numéro de Téléphone (WhatsApp) *</label>
                  <PhoneInput
                    international
                    defaultCountry="BJ"
                    value={telephone}
                    onChange={(val) => setTelephone(val || '')}
                    className="phone-input-container"
                    style={styles.phoneInput}
                  />
                  <input type="hidden" name="telephone" value={telephone} />
                </div>
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Adresse Email"
                  name="email"
                  type="email"
                  required={true}
                  placeholder="votre.email@exemple.com"
                  defaultValue={state?.fields?.email}
                />
                
                <div style={{ display: 'none' }}></div>
              </div>

              {/* SECTION 2: Fichiers & Justificatifs */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>2. Justificatifs & Documents</h3>
              
              <div style={styles.fileUploadContainer}>
                <label style={styles.fileLabel}>
                  <strong>Ordre de Mission</strong> ou Lettre d'accréditation (PDF, JPG, PNG) *
                </label>
                <input 
                  type="file" 
                  name="document_mission" 
                  accept=".pdf,image/png,image/jpeg" 
                  required 
                  style={styles.fileInput}
                />
              </div>

              <div style={styles.fileUploadContainer}>
                <label style={styles.fileLabel}>
                  <strong>Pièce d'Identité</strong> ou Passeport (PDF, JPG, PNG) *
                </label>
                <input 
                  type="file" 
                  name="document_identite" 
                  accept=".pdf,image/png,image/jpeg" 
                  required 
                  style={styles.fileInput}
                />
              </div>

              {/* SECTION 3: Validation */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>3. Validation</h3>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                {pending ? 'Envoi en cours (avec fichiers)...' : "Soumettre mon dossier de délégation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
  },
  container: {
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  header: {
    textAlign: 'center' as const,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  logoInitials: {
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '-2px',
    background: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0F172A',
    margin: 0,
  },
  subtitle: {
    color: '#475569',
    fontSize: '1.2rem',
    margin: 0,
  },
  formCard: {
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#1E293B',
    fontWeight: '700',
    margin: '1rem 0 0.5rem 0',
  },
  sectionDivider: {
    height: '2px',
    background: 'linear-gradient(to right, #E2E8F0, transparent)',
    margin: '1.5rem 0',
  },
  phoneGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  phoneLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
  },
  phoneInput: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    background: '#F8FAFC',
    fontSize: '1rem',
    transition: 'all 0.2s',
  },
  fileUploadContainer: {
    background: '#F1F5F9',
    border: '1px dashed #94A3B8',
    borderRadius: '8px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  fileLabel: {
    color: '#334155',
    fontSize: '0.95rem',
  },
  fileInput: {
    marginTop: '0.5rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1.2rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    background: 'linear-gradient(to right, #3B82F6, #2563EB)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
  },
  successMessage: {
    textAlign: 'center' as const,
    padding: '3rem 1rem',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#ECFDF5',
    color: '#10B981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    margin: '0 auto 1.5rem auto',
  },
  errorMessage: {
    padding: '1rem',
    background: '#FEF2F2',
    color: '#EF4444',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontWeight: '600',
  },
  backButton: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: '#F1F5F9',
    color: '#475569',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'background 0.2s',
  }
};
