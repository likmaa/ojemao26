'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { submitInscriptionDelegue } from '@/app/lib/actions';
import FormField from '@/app/components/FormField';

export default function InscriptionDelegues() {
  const [state, formAction, pending] = useActionState(submitInscriptionDelegue, null);

  return (
    <main style={styles.page} className="grid-bg theme-dark animate-fade-in">
      <div style={styles.overlay}></div>

      <div style={styles.container} className="animate-slide-up">
        {/* Back Link */}
        <div style={styles.navContainer}>
          <Link href="/" style={styles.backLink}>
            ← Retour à l'accueil
          </Link>
        </div>

        <div style={styles.formCard} className="glass">
          <header style={styles.header}>
            <span style={styles.badge}>OJEMAO Congrès</span>
            <h1 style={styles.title}>Espace Délégués</h1>
            <p style={styles.subtitle}>
              Formulaire de recensement des délégués statutaires (Accès Privé)
            </p>
            <div style={styles.dateBanner}>
              📅 26 au 28 Juillet 2026 | 📍 Cotonou, ONG Direct Aid
            </div>
          </header>

          {state?.success ? (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.successTitle}>Recensement validé !</h2>
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

              {/* SECTION 1: Détails de la délégation */}
              <h3 style={styles.sectionTitle}>1. Structure & Mandat</h3>
              <div style={styles.grid}>
                <FormField
                  label="Structure ou Organisation d'origine & Pays"
                  name="structure_pays"
                  required={true}
                  placeholder="Ex: ACEEMUB (Bénin), AEEMCI (Côte d'Ivoire)"
                />

                <FormField
                  label="Qualité / Mandat du délégué"
                  name="mandat"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez"
                  options={[
                    { value: 'delegue_statutaire', label: 'Délégué Statutaire' },
                    { value: 'observateur', label: 'Observateur' },
                    { value: 'invite_special', label: 'Invité Spécial' },
                  ]}
                />
              </div>

              {/* SECTION 2: Informations Personnelles */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>2. Identité du Délégué</h3>
              <div style={styles.grid}>
                <FormField
                  label="Nom & Prénom"
                  name="nom_prenom"
                  required={true}
                  placeholder="Ex: Malik Kouton"
                />

                <FormField
                  label="Fonction au sein de la structure"
                  name="fonction"
                  required={false}
                  placeholder="Ex: Secrétaire Général, Président..."
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Numéro Téléphone (WhatsApp)"
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

              <div style={styles.grid}>
                <FormField
                  label="Nombre total de délégués représentés"
                  name="nombre_delegues"
                  type="number"
                  required={true}
                  defaultValue={1}
                  infoText="Nombre de personnes qui voyagent ou composent votre délégation directe"
                />

                <FormField
                  label="Besoin d'hébergement à Cotonou ?"
                  name="besoin_hebergement"
                  type="radio"
                  required={true}
                  options={[
                    { value: 'oui', label: 'Oui, hébergement requis' },
                    { value: 'non', label: 'Non, je me prends en charge' },
                  ]}
                  defaultValue="non"
                />
              </div>

              {/* SECTION 3: Logistique & Voyage */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>3. Logistique & Voyage</h3>
              <div style={styles.grid}>
                <FormField
                  label="Moyen de déplacement prévu"
                  name="moyen_deplacement"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez"
                  options={[
                    { value: 'avion', label: 'Avion' },
                    { value: 'bus_car', label: 'Bus / Car (transport commun)' },
                    { value: 'voiture_perso', label: 'Voiture personnelle' },
                    { value: 'autre', label: 'Autre' },
                  ]}
                />

                <FormField
                  label="Date & Heure d'arrivée prévues"
                  name="date_arrivee"
                  required={true}
                  placeholder="Ex: 25/07 à 14h00"
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Date & Heure de départ prévues"
                  name="date_depart"
                  required={true}
                  placeholder="Ex: 29/07 à 09h00"
                />

                <div style={{ display: 'none' }}></div>
              </div>

              {/* SECTION 4: Sécurité & Validation */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>4. Code de validation</h3>
              <p style={styles.sectionSubtitle}>
                Veuillez saisir le code confidentiel fourni par la coordination générale pour valider votre recensement.
              </p>

              <div style={{ maxWidth: '300px' }}>
                <FormField
                  label="Code de validation"
                  name="code_validation"
                  required={true}
                  placeholder="Entrez le code"
                />
              </div>

              <div style={styles.consentContainer}>
                <input type="checkbox" id="consent" required style={styles.checkbox} />
                <label htmlFor="consent" style={styles.consentLabel}>
                  Je confirme l'exactitude des informations fournies pour le compte de ma délégation.
                </label>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn btn-primary"
                style={styles.submitBtn}
              >
                {pending ? 'Enregistrement...' : 'Enregistrer ma délégation'}
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
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#FFF',
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
  sectionTitle: {
    fontFamily: 'var(--font-outfit)',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#FFF',
    marginBottom: '1rem',
    textAlign: 'left' as const,
  },
  sectionSubtitle: {
    fontSize: '0.85rem',
    color: '#94A3B8',
    marginBottom: '1.25rem',
    textAlign: 'left' as const,
    lineHeight: '1.4',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: 'rgba(255, 255, 255, 0.08)',
    margin: '1.5rem 0',
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
    background: 'rgba(255, 255, 255, 0.05)',
    border: '2px solid #FFF',
    color: '#FFF',
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
