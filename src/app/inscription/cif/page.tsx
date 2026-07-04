'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { submitInscriptionCif } from '../../lib/actions';
import FormField from '../../components/FormField';

export default function InscriptionCif() {
  const [state, formAction, pending] = useActionState(submitInscriptionCif, null);

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
            <span style={styles.badge}>CIF 2026</span>
            <h1 style={styles.title}>Colloque International (CIF)</h1>
            <p style={styles.subtitle}>
              Formulaire de réservation — Participation avec règlement sur place
            </p>
            <div style={styles.dateBanner}>
              📅 26 au 28 Juillet 2026 | 📍 Cotonou, ONG Direct Aid
            </div>
          </header>

          {state?.success ? (
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <h2 style={styles.successTitle}>Réservation enregistrée !</h2>
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

              {/* SECTION 1: Informations Personnelles */}
              <h3 style={styles.sectionTitle}>1. Informations Personnelles</h3>
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
                  label="Tranche d'âge"
                  name="tranche_age"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez votre âge"
                  options={[
                    { value: 'moins_18', label: 'Moins de 18 ans' },
                    { value: '18_25', label: '18 à 25 ans' },
                    { value: '26_35', label: '26 à 35 ans' },
                    { value: 'plus_35', label: 'Plus de 35 ans' },
                  ]}
                />

                <FormField
                  label="Ville & Pays de résidence"
                  name="ville_pays"
                  required={true}
                  placeholder="Ex: Porto-Novo, Bénin"
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Statut professionnel / social"
                  name="statut"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez"
                  options={[
                    { value: 'etudiant', label: 'Étudiant' },
                    { value: 'jeune_cadre', label: 'Jeune Cadre / Professionnel' },
                    { value: 'militant', label: 'Militant Associatif' },
                    { value: 'autre', label: 'Autre' },
                  ]}
                />

                <FormField
                  label="Établissement, École ou Organisation"
                  name="etablissement"
                  required={true}
                  placeholder="Ex: UAC, ENEAM, Nom Entreprise/ONG"
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Numéro WhatsApp"
                  name="whatsapp"
                  type="tel"
                  required={true}
                  placeholder="Ex: +229 95 00 00 00"
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
                  label="Association d'appartenance"
                  name="association"
                  type="select"
                  required={true}
                  placeholder="Sélectionnez"
                  options={[
                    { value: 'aceemub', label: 'ACEEMUB' },
                    { value: 'ojemao', label: 'OJEMAO' },
                    { value: 'aimb', label: 'AIMB' },
                    { value: 'aucune', label: 'Aucune association' },
                    { value: 'autre', label: 'Autre' },
                  ]}
                />

                <FormField
                  label="Comment as-tu connu le CIF ?"
                  name="comment_connu"
                  type="select"
                  required={true}
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

              {/* SECTION 2: Logistique & Voyage */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>2. Logistique & Voyage (Voyageurs)</h3>
              <p style={styles.sectionSubtitle}>
                Ces informations aident nos comités d'accueil à planifier votre arrivée à Cotonou si vous venez d'autres régions ou pays.
              </p>

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
                  placeholder="Ex: 24/07 à 18h00 ou Vol n°..."
                />
              </div>

              <div style={styles.grid}>
                <FormField
                  label="Date & Heure de départ prévues"
                  name="date_depart"
                  required={true}
                  placeholder="Ex: 29/07 à 10h00"
                />

                <div style={{ display: 'none' }}></div> {/* Empty slot for alignment */}
              </div>

              {/* SECTION 3: Attentes & Soumission */}
              <div style={styles.sectionDivider}></div>
              <h3 style={styles.sectionTitle}>3. Vos attentes</h3>

              <FormField
                label="Qu'attendez-vous de ce colloque en une phrase ? (facultatif)"
                name="attente"
                type="textarea"
                required={false}
                placeholder="Décrivez brièvement vos attentes ou ce que vous espérez apprendre..."
              />

              <div style={styles.consentContainer}>
                <input type="checkbox" id="consent" required style={styles.checkbox} />
                <label htmlFor="consent" style={styles.consentLabel}>
                  J'accepte que mes données soient collectées pour les besoins d'organisation et je m'engage à régler mes frais de participation à mon arrivée sur le site.
                </label>
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn btn-accent"
                style={styles.submitBtn}
              >
                {pending ? 'Enregistrement en cours...' : "Confirmer ma réservation"}
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
    background: 'rgba(232, 131, 42, 0.15)',
    border: '1px solid rgba(232, 131, 42, 0.3)',
    color: 'var(--accent)',
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
    background: 'rgba(232, 131, 42, 0.15)',
    border: '2px solid var(--accent)',
    color: '#FDBA74',
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
