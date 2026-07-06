import Link from 'next/link';
import Image from 'next/image';
import { FaUsers, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaInfoCircle } from 'react-icons/fa';
import { supabase } from '@/app/lib/supabase';

export const revalidate = 0;

const focalPoints = [
  { flag: '🇧🇯', country: 'Bénin', name: 'El Hadj Soulémane', phone: '+229 97 12 34 56', wa: '22997123456' },
  { flag: '🇹🇬', country: 'Togo', name: 'Ibrahim Touré', phone: '+228 90 12 34 56', wa: '22890123456' },
  { flag: '🇨🇮', country: 'Côte d\'Ivoire', name: 'Amadou Koné', phone: '+225 07 12 34 56 78', wa: '2250712345678' },
  { flag: '🇲🇱', country: 'Mali', name: 'Ousmane Maïga', phone: '+223 70 12 34 56', wa: '22370123456' },
  { flag: '🇳🇪', country: 'Niger', name: 'Abdoul Karim', phone: '+227 90 12 34 56', wa: '22790123456' },
  { flag: '🇧🇫', country: 'Burkina Faso', name: 'Moussa Sawadogo', phone: '+226 70 12 34 56', wa: '22670123456' },
  { flag: '🇸🇳', country: 'Sénégal', name: 'Cheikh Diallo', phone: '+221 77 123 45 67', wa: '221771234567' },
  { flag: '🇬🇳', country: 'Guinée', name: 'Mamadou Barry', phone: '+224 620 12 34 56', wa: '224620123456' },
];

export default async function CifPage() {
  const { data: eventRow } = await supabase.from('events').select('image_url').eq('title', 'cif').maybeSingle();
  const cifImage = eventRow?.image_url || '/images/affiche-co1.webp';

  const { data: dbFocalPoints } = await supabase.from('focal_points').select('*').order('country', { ascending: true });
  const activeFocalPoints = dbFocalPoints && dbFocalPoints.length > 0 ? dbFocalPoints : focalPoints;

  return (
    <div style={styles.page} className="animate-fade-in">
      <div style={styles.container}>
        <header style={{ ...styles.header, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={styles.title}>Congrès & Colloque (CIF) 2026</h1>
          <p style={{ ...styles.subtitle, textAlign: 'center' }}>
            Le rassemblement régional de la jeunesse musulmane pour se former, échanger et statuer.
          </p>
        </header>

        {/* Details Grid */}
        <section className="details-grid">
          <div style={styles.mainContent} className="glass main-content-box">
            <div style={{ width: '100%', marginBottom: '2.5rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0' }}>
              <Image
                src={cifImage}
                alt="Affiche Officielle Colloque et Congrès"
                width={800}
                height={800}
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
            <h2 style={styles.sectionTitle}>Présentation des deux Volets</h2>
            
            {/* Volet 1: Colloque CIF */}
            <div style={styles.sectionBlock}>
              <h3 style={styles.subTitle}>1. Le Colloque International de Formation (CIF)</h3>
              <p style={styles.text}>
                Le CIF est un espace <strong>ouvert au grand public, aux étudiants, aux jeunes cadres et aux militants</strong>. Il propose trois jours de panels interactifs, de conférences magistrales et d'ateliers pratiques menés par des experts sous-régionaux.
              </p>
              <blockquote style={styles.themeQuote}>
                <strong>Thème central :</strong> « La communauté médiane (Oumma Wasatiyya) : fondements islamiques, enjeux contemporains et pratiques de la jeunesse musulmane en Afrique de l'Ouest »
              </blockquote>
              <p style={styles.text}>
                L'objectif est d'outiller la jeunesse avec le concept du juste milieu (Wasatiyya) afin de prévenir les dérives extrémistes et de stimuler un engagement social et spirituel constructif.
              </p>
              
              <h4 style={{ ...styles.subTitle, marginTop: '2.5rem' }}><FaUsers style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> Les 7 Panels Thématiques</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 1</h5>
                  <p style={styles.panelDesc}>Conversations avec la Jeunesse Ouest-Africaine</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 2</h5>
                  <p style={styles.panelDesc}>Fondements théologiques de la Oumma Wasatiyya</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 3</h5>
                  <p style={styles.panelDesc}>Jeunesse musulmane & équilibre identitaire</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 4</h5>
                  <p style={styles.panelDesc}>Médianité et prévention des extrémismes</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 5</h5>
                  <p style={styles.panelDesc}>Islam, citoyenneté et cohésion sociale en Afrique de l’Ouest</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 6</h5>
                  <p style={styles.panelDesc}>Défis socio-économiques et autonomisation des jeunes</p>
                </div>
                <div style={styles.panelCard}>
                  <h5 style={styles.panelTitle}>Panel 7</h5>
                  <p style={styles.panelDesc}>Gouvernance et renforcement des organisations de jeunesse</p>
                </div>
              </div>
            </div>

            <div style={styles.sectionDivider}></div>

            {/* Volet 2: Le Congrès statutaire */}
            <div style={styles.sectionBlock}>
              <h3 style={styles.subTitle}>2. Le Congrès Statutaire de l'OJEMAO</h3>
              <p style={styles.text}>
                Le Congrès est un espace <strong>strictement réservé aux délégués officiels mandatés</strong> par les structures membres de l'Organisation de la Jeunesse Musulmane en Afrique de l'Ouest (OJEMAO).
              </p>
              <p style={styles.text}>
                Il sera consacré aux séances d'évaluation, à la présentation des bilans d'activité et financiers, aux réformes des textes et à l'élection du nouveau bureau exécutif de l'organisation.
              </p>
            </div>

            <div style={styles.sectionDivider}></div>

            <h3 style={styles.subTitle}><FaClock style={{ marginRight: '0.5rem', color: 'var(--accent)' }} /> Chronogramme Synthétique (3 Jours)</h3>
            
            <div style={styles.timeline}>
              {/* Jour 1 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>Jour 1 (26 Juillet)</div>
                <div style={styles.timelineContent}>
                  <strong>Fondements de la Oumma Wasatiyya et enjeux contemporains</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Matinée : Cérémonie d'ouverture, Conférence inaugurale et Panel 1</li>
                    <li>Après-midi : Panels 2 et 3</li>
                    <li>Soirée : Dîner, rencontres inter-pays et soirées culturelles</li>
                  </ul>
                </div>
              </div>
              
              {/* Jour 2 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>Jour 2 (27 Juillet)</div>
                <div style={styles.timelineContent}>
                  <strong>Prévention des extrémismes, cohésion sociale et engagement</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Matinée : Panels 4, 5 et 6</li>
                    <li>Après-midi : Deux séries d'Ateliers de Formation Pratiques en parallèle</li>
                    <li>Soirée : Élections statutaires (pour les congressistes)</li>
                  </ul>
                </div>
              </div>

              {/* Jour 3 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>Jour 3 (28 Juillet)</div>
                <div style={styles.timelineContent}>
                  <strong>Gouvernance, stratégies et Clôture</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Matinée : Panel 7 et Session Stratégique (Plan d'action 2026-2028)</li>
                    <li>Après-midi : Adoption du plan d'action, Cérémonie de Clôture</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.sidebar}>
            {/* Info Box */}
            <div style={styles.sidebarBox} className="glass sidebar-box">
              <h3 style={styles.sidebarTitle}>Informations Clés</h3>
              <div style={styles.infoItemsGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaCalendarAlt style={{ marginRight: '0.4rem' }} /> DATES</span>
                  <span style={styles.infoVal}>Dim. 26 au Mar. 28 Juillet 2026</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaMapMarkerAlt style={{ marginRight: '0.4rem' }} /> LIEU</span>
                  <span style={styles.infoVal}>Direct'Aid Fidjrossè (Ex AMA), Cotonou</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaTicketAlt style={{ marginRight: '0.4rem' }} /> ACCÈS COLLOQUE</span>
                  <span style={styles.infoVal}>10 000 FCFA (pour tous les participants)</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaInfoCircle style={{ marginRight: '0.4rem' }} /> ACCÈS CONGRÈS</span>
                  <span style={styles.infoVal}>Réservé aux délégués mandatés</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <span style={styles.infoLabel}><FaMapMarkerAlt style={{ marginRight: '0.4rem' }} /> CARTE DE LOCALISATION</span>
                <iframe
                  src="https://maps.google.com/maps?q=Direct%20Aid%20Fidjrosse%20Cotonou&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte Direct Aid Fidjrossè"
                ></iframe>
              </div>
            </div>

            {/* Focal Points Box */}
            <div style={styles.sidebarBox} className="glass sidebar-box">
              <h3 style={styles.sidebarTitle}>Points Focaux par Pays</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                Contactez les représentants officiels de votre pays pour toute question d'organisation :
              </p>
              <div style={styles.focalGrid}>
                {activeFocalPoints.map((fp, idx) => (
                  <div key={idx} style={styles.focalItem}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{fp.flag}</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{fp.country}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      {fp.name}
                    </div>
                    <a
                      href={`https://wa.me/${fp.wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.focalPhone}
                    >
                      WhatsApp : {fp.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--accent)', background: 'rgba(232, 131, 42, 0.03)' }} className="glass sidebar-box">
              <h3 style={styles.sidebarTitle}>Faire ma réservation</h3>
              <p style={styles.sidebarText}>
                Pour participer au Colloque (panels, ateliers et matériel), effectuez votre inscription en ligne. Les frais de participation sont fixés à <strong>10 000 FCFA</strong> pour tous. L'hébergement et la restauration sont pris en charge pour les participants validés par la délégation de leur pays, mais restent à la charge des participants non validés.
              </p>
              <Link href="/inscription/cif" className="btn btn-accent" style={styles.ctaBtn}>
                S'inscrire au CIF
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '4rem 0',
    minHeight: '80vh',
    background: '#FFFFFF',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.5rem',
    width: '100%',
  },
  header: {
    marginBottom: '3rem',
  },
  badge: {
    background: 'rgba(232, 131, 42, 0.08)',
    border: '1px solid rgba(232, 131, 42, 0.2)',
    color: 'var(--accent)',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.5rem',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '0.75rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    maxWidth: '800px',
    lineHeight: '1.6',
  },
  mainContent: {
    padding: '3rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.75rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1.5rem',
  },
  sectionBlock: {
    marginBottom: '1.5rem',
  },
  subTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1rem',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  themeQuote: {
    borderLeft: '4px solid var(--primary)',
    background: 'rgba(56, 165, 84, 0.04)',
    padding: '1.25rem 1.5rem',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: 'var(--text-dark)',
    margin: '1.25rem 0',
  },
  sectionDivider: {
    width: '100%',
    height: '1px',
    background: '#E2E8F0',
    margin: '2rem 0',
  },
  panelCard: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '1.25rem',
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '0.25rem',
  },
  panelDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-dark)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0',
    marginBottom: '3rem',
    marginLeft: '0.5rem',
    borderLeft: '2px solid rgba(56, 165, 84, 0.2)',
    position: 'relative' as const,
  },
  timelineItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    paddingLeft: '1.5rem',
    paddingBottom: '1.5rem',
    position: 'relative' as const,
  },
  timelineDot: {
    position: 'absolute' as const,
    left: '-6px',
    top: '0',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--primary)',
    boxShadow: '0 0 0 4px rgba(56, 165, 84, 0.1)',
  },
  timelineTime: {
    fontWeight: '800',
    color: 'var(--accent)',
    fontSize: '0.9rem',
    marginBottom: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  timelineContent: {
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    background: '#F8FAFC',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    marginTop: '0.25rem',
  },
  timelineSubList: {
    marginTop: '0.5rem',
    paddingLeft: '1rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    listStyleType: 'disc',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  sidebarBox: {
    padding: '2rem',
  },
  sidebarTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginBottom: '1.25rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  infoItemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    padding: '0.75rem',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
  },
  infoLabel: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--accent)',
    letterSpacing: '0.05em',
  },
  infoVal: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
  },
  focalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  },
  focalItem: {
    padding: '0.75rem',
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  focalPhone: {
    fontSize: '0.8rem',
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '0.25rem',
  },
  sidebarText: {
    fontSize: '0.85rem',
    lineHeight: '1.5',
    color: 'var(--text-muted)',
    marginBottom: '1.5rem',
  },
  ctaBtn: {
    width: '100%',
  },
};
