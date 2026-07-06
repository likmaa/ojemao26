'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { submitInscriptionDebat } from '@/app/lib/actions';
import FormField from '@/app/components/FormField';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ReCAPTCHA from 'react-google-recaptcha';

export default function InscriptionDebat() {
  const [state, formAction, pending] = useActionState(submitInscriptionDebat, null);
  const [participantType, setParticipantType] = useState(state?.fields?.type_participant || '');
  const [phone, setPhone] = useState<string | undefined>(state?.fields?.telephone || '');
  const [participerCif, setParticiperCif] = useState(state?.fields?.participer_cif || 'non');
  const [poste, setPoste] = useState(state?.fields?.poste || '');

  const handleParticipantTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParticipantType(e.target.value);
    setPoste(''); // reset poste on type change
  };

  const comiteOrgaPostes = [
    { value: 'PCO', label: 'Président du Comité d\'Organisation (PCO)' },
    { value: 'SGO', label: 'Secrétaire Général à l\'Organisation (SGO)' },
    { value: 'SRFM', label: 'Secrétaire aux Ressources Financières et Matérielles (SRFM)' },
    { value: 'SAO', label: 'Secrétaire aux Affaires Organisation (SAO)' },
    { value: 'RIC', label: 'Responsable à l\'information et à la communication (RIC)' },
    { value: 'RRA', label: 'Responsable au Rapportage et aux Actes (RRA)' },
    { value: 'RPPP', label: 'Responsable au Programme, au Protocole et au Présidium (RPPP)' },
    { value: 'RSHA', label: 'Responsable à la Santé, à l\'Hygiène et à l\'Assainissement (RSHA)' },
    { value: 'RSAJ', label: 'Responsable à la Sécurité et aux Affaires Juridiques (RSAJ)' },
    { value: 'RMRF', label: 'Responsable à la Mobilisation des Ressources Financières (RMRF)' },
    { value: 'RCT', label: 'Responsable à Comptabilité et à la Trésorerie (RCT)' },
    { value: 'RL', label: 'Responsable à la Logistique (RL)' },
    { value: 'RTAH', label: 'Responsable au Transport, à l\'Accueil et à l\'Hébergement (RTAH)' },
    { value: 'RR', label: 'Responsable à la Restauration (RR)' },
    { value: 'RIECPA', label: 'Responsable à l\'Installation des Equipements... (RIECPA)' },
  ];

  const comiteScientifiquePostes = [
    { value: 'PCS', label: 'Président du Comité Scientifique (PCS)' },
    { value: 'SGCS', label: 'Secrétaire Général du Comité Scientifique (SGCS)' },
    { value: 'SGACS', label: 'Secrétaire Général Adjoint du Comité Scientifique (SGACS)' },
    { value: 'MCS', label: 'Membre du Comité Scientifique (MCS)' },
  ];

  return (
    <main style={styles.page} className="animate-fade-in">
      <div style={styles.container} className="animate-slide-up">
        {/* Back Link */}
        <div style={styles.navContainer}>
          <Link href="/inscription" style={styles.backLink}>
            ← Retour aux options
          </Link>
        </div>

        <div style={styles.formCard}>
          <header style={styles.header}>
            <span style={styles.badge}>D2C26</span>
            <h1 style={styles.title}>Débat de Cotonou</h1>
            <p style={styles.subtitle}>
              Formulaire de participation grand public
            </p>
            <div style={styles.dateBanner}>
              📅 Samedi 25 Juillet 2026 | 📍 Cotonou, Bénin Royal Hôtel
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
                  placeholder="Ex: Vahama KAMAGATE"
                  defaultValue={state?.fields?.nom_prenom}
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
                  defaultValue={state?.fields?.genre}
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Organisation / Institution"
                  name="organisation"
                  required={true}
                  placeholder="Nom de votre structure ou université"
                  defaultValue={state?.fields?.organisation}
                />

                <FormField
                  label="Fonction / Qualité"
                  name="fonction"
                  required={true}
                  placeholder="Ex: Enseignant, Président, Étudiant..."
                  defaultValue={state?.fields?.fonction}
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
                    <option value="" disabled style={{ background: '#FFFFFF', color: '#94A3B8' }}>
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
                      { value: 'comite_orga', label: 'Comité d\'organisation' },
                      { value: 'comite_scientifique', label: 'Comité scientifique' },
                    ].map((opt) => (
                      <option key={opt.value} value={opt.value} style={{ background: '#FFFFFF', color: 'var(--text-dark)' }}>
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
                  defaultValue={state?.fields?.ville_pays}
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
                    defaultValue={state?.fields?.organe_presse}
                  />
                </div>
              )}

              {/* Conditional Poste Field for Comites */}
              {(participantType === 'comite_orga' || participantType === 'comite_scientifique') && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div style={styles.selectWrapper}>
                    <label htmlFor="poste" style={styles.label}>
                      Poste au sein du comité <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <select
                      name="poste"
                      id="poste"
                      required
                      value={poste}
                      onChange={(e) => setPoste(e.target.value)}
                      style={styles.select as React.CSSProperties}
                      className="form-input-focus"
                    >
                      <option value="" disabled style={{ background: '#FFFFFF', color: '#94A3B8' }}>
                        Sélectionnez votre poste
                      </option>
                      {(participantType === 'comite_orga' ? comiteOrgaPostes : comiteScientifiquePostes).map((opt) => (
                        <option key={opt.value} value={opt.value} style={{ background: '#FFFFFF', color: 'var(--text-dark)' }}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div style={styles.grid}>
                <div style={styles.selectWrapper}>
                  <label htmlFor="telephone" style={styles.label}>
                    Téléphone WhatsApp <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input type="hidden" name="telephone" value={phone || ''} />
                  <PhoneInput
                    international
                    defaultCountry="BJ"
                    value={phone}
                    onChange={setPhone}
                    style={styles.phoneInput}
                    className="form-input-focus"
                    required
                  />
                </div>

                <FormField
                  label="Adresse Email"
                  name="email"
                  type="email"
                  required={true}
                  placeholder="Ex: contact@exemple.com"
                  defaultValue={state?.fields?.email}
                />
              </div>

              <div style={styles.selectWrapper}>
                <label style={styles.label}>
                  Souhaitez-vous également participer au Colloque International de Formation (CIF) du 26 au 28 Juillet ? <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { value: 'oui', label: 'Oui, je souhaite y participer' },
                    { value: 'non', label: 'Non, uniquement au Débat' },
                  ].map((opt) => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="participer_cif"
                        value={opt.value}
                        checked={participerCif === opt.value}
                        onChange={(e) => setParticiperCif(e.target.value)}
                        required
                        style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                      />
                      <span style={{ color: 'var(--text-dark)' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional CIF Fields */}
              {participerCif === 'oui' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out', marginTop: '1.5rem', padding: '1.5rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>
                    Complétez vos informations pour le CIF
                  </h3>
                  
                  <div style={styles.grid}>
                    <FormField
                      label="Tranche d'âge"
                      name="tranche_age"
                      type="select"
                      required={participerCif === 'oui'}
                      placeholder="Sélectionnez"
                      options={[
                        { value: '18-25', label: '18 - 25 ans' },
                        { value: '26-35', label: '26 - 35 ans' },
                        { value: '36-45', label: '36 - 45 ans' },
                        { value: '45+', label: 'Plus de 45 ans' },
                      ]}
                      defaultValue={state?.fields?.tranche_age}
                    />

                    <FormField
                      label="Avez-vous une association ?"
                      name="association"
                      type="select"
                      required={participerCif === 'oui'}
                      placeholder="Sélectionnez"
                      options={[
                        { value: 'membre', label: 'Oui, membre actif' },
                        { value: 'sympathisant', label: 'Oui, sympathisant' },
                        { value: 'aucune', label: 'Aucune association' },
                        { value: 'autre', label: 'Autre' },
                      ]}
                    />
                  </div>

                  <div style={styles.grid}>
                    <FormField
                      label="Moyen de déplacement prévu"
                      name="moyen_deplacement"
                      type="select"
                      required={participerCif === 'oui'}
                      placeholder="Sélectionnez"
                      options={[
                        { value: 'avion', label: 'Avion' },
                        { value: 'bus_car', label: 'Bus / Car (transport commun)' },
                        { value: 'voiture_perso', label: 'Voiture personnelle' },
                        { value: 'autre', label: 'Autre' },
                      ]}
                    />
                    
                    <FormField
                      label="Comment as-tu connu le CIF ?"
                      name="comment_connu"
                      type="select"
                      required={participerCif === 'oui'}
                      placeholder="Sélectionnez"
                      options={[
                        { value: 'reseaux_sociaux', label: 'Réseaux Sociaux' },
                        { value: 'bouche_oreille', label: 'Ami / Bouche à oreille' },
                        { value: 'affiche', label: 'Affiche ou Flyer' },
                        { value: 'structure_membre', label: 'Par une structure membre' },
                        { value: 'autre', label: 'Autre' },
                      ]}
                    />
                  </div>

                  <div style={styles.grid}>
                    <FormField
                      label="Date & Heure d'arrivée prévues"
                      name="date_arrivee"
                      required={participerCif === 'oui'}
                      placeholder="Ex: 24/07 à 18h00 ou Vol n°..."
                    />

                    <FormField
                      label="Date & Heure de départ prévues"
                      name="date_depart"
                      required={participerCif === 'oui'}
                      placeholder="Ex: 29/07 à 10h00"
                    />
                  </div>

                  <FormField
                    label="Qu'attendez-vous de ce colloque en une phrase ? (facultatif)"
                    name="attente"
                    type="textarea"
                    required={false}
                    placeholder="Décrivez brièvement vos attentes ou ce que vous espérez apprendre..."
                  />
                </div>
              )}

              <div style={{ padding: '1rem', background: '#F1F5F9', borderLeft: '4px solid #3B82F6', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.95rem', color: '#334155' }}>
                <strong>Note :</strong> L'accès au Débat est <strong>gratuit pour les résidents locaux (Bénin)</strong>. Les participants internationaux devront s'acquitter de frais de participation s'élevant à <strong>20 000 FCFA</strong>.
              </div>

              <div style={styles.consentContainer}>
                <input type="checkbox" id="consent" name="consent" required style={styles.checkbox} />
                <label htmlFor="consent" style={styles.consentLabel}>
                  J'accepte que mes données soient collectées pour les besoins d'organisation et de communication liés à l'événement.
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
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
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    background: '#FFFFFF',
  },
  container: {
    maxWidth: '900px',
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
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  formCard: {
    padding: '2rem 1.5rem',
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
    border: '1px solid rgba(226, 232, 240, 0.6)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2.5rem',
  },
  badge: {
    background: 'rgba(56, 165, 84, 0.08)',
    border: '1px solid rgba(56, 165, 84, 0.2)',
    color: 'var(--primary)',
    padding: '0.3rem 0.8rem',
    borderRadius: '0px',
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.25rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginTop: '0.5rem',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
  },
  dateBanner: {
    fontSize: '0.85rem',
    color: 'var(--text-dark)',
    background: '#F8FAFC',
    padding: '0.5rem 1rem',
    borderRadius: '0px',
    display: 'inline-block',
    marginTop: '1rem',
    fontWeight: '600',
    border: '1px solid #E2E8F0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
    gap: '0 1.25rem',
  },
  selectWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    marginBottom: '1.25rem',
  },
  label: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
    textAlign: 'left' as const,
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0px',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: 'var(--text-dark)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-inter)',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  errorAlert: {
    background: '#FEF2F2',
    borderLeft: '4px solid #EF4444',
    padding: '1rem',
    borderRadius: '0px',
    color: '#B91C1C',
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
    accentColor: 'var(--primary)',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  consentLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
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
    background: 'rgba(56, 165, 84, 0.08)',
    border: '2px solid var(--primary)',
    color: 'var(--primary)',
    fontSize: '2.5rem',
    lineHeight: '60px',
    margin: '0 auto 1.5rem auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '0.75rem',
  },
  successText: {
    color: 'var(--text-muted)',
    fontSize: '1rem',
    lineHeight: '1.5',
    maxWidth: '500px',
    margin: '0 auto 2rem auto',
  },
  successActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  phoneInput: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '0.8rem 1rem',
    width: '100%',
    color: '#0F172A',
    outline: 'none',
    transition: 'all 0.2s',
  }
};
