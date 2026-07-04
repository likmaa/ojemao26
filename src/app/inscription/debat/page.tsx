'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { submitInscriptionDebat } from '../../lib/actions';
import FormField from '../../components/FormField';

export default function InscriptionDebat() {
  const [state, formAction, pending] = useActionState(submitInscriptionDebat, null);
  const [participantType, setParticipantType] = useState('');

  const handleParticipantTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParticipantType(e.target.value);
  };

  return (
    <main style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.overlay}></div>

      <div style={styles.container} className="animate-slide-up">
        {/* Back Link */}
        <div style={styles.navContainer}>
          <Link href="/inscription" style={styles.backLink}>
            ← Retour aux options
          </Link>
        </div>

        <div style={styles.formCard} className="glass">
          <header style={styles.header}>
            <span style={styles.badge}>D2C26</span>
            <h1 style={styles.title}>Débat de Cotonou</h1>
            <p style={styles.subtitle}>
              Formulaire d'inscription — Accès gratuit pour le public
            </p>
            <div style={styles.dateBanner}>
              📅 Samedi 25 Juillet 2026 | 📍 Cotonou, ONG Direct Aid
            </div>
          </header>

          {state?.success ? (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.successTitle}>Inscription validée !</h2>
              <p style={styles.successText}>{state.message}</p>
              <div style={styles.successActions}>
                <Link href="/" className="btn btn-primary">
                  Retourner à l'accueil
                </Link>
              </div>
            </div>
          ) : (
            <form action={formAction} style={styles.form}>
              {state?.error && (
                <div style={styles.errorAlert}>
                  ❌ {state.error}
                </div>
              )}

              <div style={styles.grid}>
                <FormField
                  label="Nom & Prénom"
                  name="nom_prenom"
                  required={true}
                  placeholder="Ex: Malik Kouton"
                />

                <FormField
                  label="Genre"
                  name="genre"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez"
                  options={[
                    { value: 'M', label: 'Masculin' },
                    { value: 'F', label: 'Féminin' },
                  ]}
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Organisation / Institution"
                  name="organisation"
                  required={true}
                  placeholder="Nom de votre structure ou université"
                />

                <FormField
                  label="Fonction / Qualité"
                  name="fonction"
                  required={true}
                  placeholder="Ex: Enseignant, Président, Étudiant..."
                />
              </div>

              <div style={styles.grid}>
                <div style={styles.selectWrapper}>
                  <label htmlFor="type_participant" style={styles.label}>
                    Type de participant <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <select
                    name="type_participant"
                    id="type_participant"
                    required
                    value={participantType}
                    onChange={handleParticipantTypeChange}
                    style={styles.select as React.CSSProperties}
                    className="form-input-focus"
                  >
                    <option value="" disabled style={{ background: '#0A1628', color: '#64748B' }}>
                      Sélectionnez un profil
                    </option>
                    {[
                      { value: 'universitaire', label: 'Universitaire / Enseignant' },
                      { value: 'ong_asso', label: "Responsable d'ONG ou d'Association" },
                      { value: 'religieux_commu', label: 'Leader religieux ou communautaire' },
                      { value: 'institution_partenaire', label: 'Institution ou Partenaire technique' },
                      { value: 'media', label: 'Média / Journaliste' },
                      { value: 'societe_civile', label: 'Acteur de la Société Civile' },
                      { value: 'etudiant', label: 'Étudiant / Jeune' },
                    ].map((opt) => (
                      <option key={opt.value} value={opt.value} style={{ background: '#0A1628', color: '#FFFFFF' }}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <FormField
                  label="Ville & Pays de résidence"
                  name="ville_pays"
                  required={true}
                  placeholder="Ex: Cotonou, Bénin"
                />
              </div>

              {/* Conditional Media Field */}
              {participantType === 'media' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <FormField
                    label="Organe de presse / Média"
                    name="organe_presse"
                    required={true}
                    placeholder="Ex: ORTB, Golfe TV, Le Matinal..."
                  />
                </div>
              )}

              <div style={styles.grid}>
                <FormField
                  label="Numéro Téléphone (WhatsApp de préférence)"
                  name="telephone"
                  type="tel"
                  required={true}
                  placeholder="Ex: +229 90 00 00 00"
                />

                <FormField
                  label="Adresse Email"
                  name="email"
                  type="email"
                  required={true}
                  placeholder="Ex: contact@exemple.com"
                />
              </div>

              <FormField
                label="Souhaitez-vous également participer au Colloque International de Formation (CIF) du 26 au 28 Juillet ?"
                name="participer_cif"
                type="radio"
                required={true}
                options={[
                  { value: 'oui', label: 'Oui, je souhaite y participer' },
                  { value: 'non', label: 'Non, uniquement au Débat' },
                ]}
                defaultValue="non"
              />

              <div style={styles.consentContainer}>
                <input type="checkbox" id="consent" required style={styles.checkbox} />
                <label htmlFor="consent" style={styles.consentLabel}>
                  J'accepte que mes données soient collectées pour les besoins d'organisation et de communication liés à l'événement.
                </label>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                {pending ? 'Enregistrement en cours...' : "Valider mon inscription"}
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
    position: 'relative' as const,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
    overflowX: 'hidden' as const,
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 30%, rgba(7, 15, 27, 0.8) 100%)',
    pointerEvents: 'none' as const,
    zIndex: 1,
  },
  container: {
    position: 'relative' as const,
    zIndex: 2,
    maxWidth: '750px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  navContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '1.5rem',
  },
  backLink: {
    color: '#94A3B8',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  formCard: {
    padding: '3rem 2.5rem',
    borderRadius: '0px',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  badge: {
    background: 'rgba(27, 122, 61, 0.15)',
    border: '1px solid rgba(27, 122, 61, 0.3)',
    color: 'var(--primary)',
    padding: '0.3rem 0.8rem',
    borderRadius: '0px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  title: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '2.25rem',
    fontWeight: '800',
    color: '#FFF',
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94A3B8',
  },
  dateBanner: {
    fontSize: '0.85rem',
    color: '#E2E8F0',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.5rem 1rem',
    borderRadius: '0px',
    display: 'inline-block',
    marginTop: '1rem',
    fontWeight: '600',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '0 1.25rem',
  },
  selectWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  label: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#E2E8F0',
    textAlign: 'left' as const,
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: '#FFFFFF',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-inter)',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    borderLeft: '4px solid #EF4444',
    padding: '1rem',
    borderRadius: '0px',
    color: '#FCA5A5',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
    textAlign: 'left' as const,
  },
  consentContainer: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    margin: '1.5rem 0',
    textAlign: 'left' as const,
  },
  checkbox: {
    marginTop: '0.2rem',
    accentColor: 'var(--accent)',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  consentLabel: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    lineHeight: '1.4',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '0.9rem 1.5rem',
    fontSize: '1.05rem',
  },
  successContainer: {
    textAlign: 'center' as const,
    padding: '2rem 1rem',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '0px',
    background: 'rgba(45, 168, 90, 0.15)',
    border: '2px solid var(--primary)',
    color: '#4ADE80',
    fontSize: '2.5rem',
    lineHeight: '60px',
    margin: '0 auto 1.5rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#FFF',
    marginBottom: '0.75rem',
  },
  successText: {
    color: '#94A3B8',
    fontSize: '1rem',
    lineHeight: '1.5',
    maxWidth: '500px',
    margin: '0 auto 2rem auto',
  },
  successActions: {
    display: 'flex',
    justifyContent: 'center',
  },
};
