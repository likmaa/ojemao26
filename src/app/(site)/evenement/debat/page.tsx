import Link from 'next/link';
import Image from 'next/image';
import { FaYoutube, FaUsers, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { supabaseAdmin } from '@/app/lib/supabase';

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
  { flag: '🇬🇼', country: 'Guinée-Bissau', name: 'Sana Canté', phone: '+245 95 123 45 67', wa: '245951234567' },
];

export default async function DebatPage() {
  const { data: eventRow } = await supabaseAdmin.from('events').select('image_url').eq('title', 'debat').maybeSingle();
  const debatImage = eventRow?.image_url || '/images/affiche-d1.webp';

  const { data: dbFocalPoints } = await supabaseAdmin.from('focal_points').select('*').order('country', { ascending: true });
  const activeFocalPoints = dbFocalPoints && dbFocalPoints.length > 0 ? dbFocalPoints : focalPoints;

  return (
    <div style={styles.page} className="animate-fade-in">
      <div style={styles.container}>
        <header style={{ ...styles.header, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={styles.title}>Le Débat de Cotonou 2026</h1>
          <p style={{ ...styles.subtitle, textAlign: 'center' }}>
            Un espace d'échange intellectuel et de réflexion stratégique face aux enjeux contemporains.
          </p>
        </header>

        {/* Details Grid */}
        <section className="details-grid">
          <div style={styles.mainContent} className="glass main-content-box">
            <div style={{ width: '100%', marginBottom: '2.5rem', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0' }}>
              <Image
                src={debatImage}
                alt="Affiche Officielle Débat de Cotonou"
                width={800}
                height={800}
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>
            
            <h2 style={styles.sectionTitle}>Présentation générale</h2>
            <p style={styles.text}>
              Le Débat de Cotonou se veut une agora d'excellence réunissant universitaires, leaders d'opinion, chercheurs et représentants d'organisations islamiques. L'objectif est de dresser un diagnostic lucide et de proposer des pistes d'action concrètes face aux menaces sécuritaires de notre sous-région.
            </p>
            <p style={styles.text}>
              Cette journée d'échange mettra en lumière le rôle crucial que doivent jouer les intellectuels musulmans et les ONG pour cultiver la paix sociale et consolider la stabilité de nos États.
            </p>

            <h3 style={styles.subTitle}>Thématique centrale</h3>
            <blockquote style={styles.themeQuote}>
              « Unité et engagement pour la paix, la sécurité et la stabilité des États : responsabilités et contributions des intellectuels musulmans, des associations et ONG islamiques face aux défis du terrorisme »
            </blockquote>

            <h3 style={styles.subTitle}><FaUsers style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> Les Panels Thématiques et Intervenants</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={styles.panelCard}>
                <h4 style={styles.panelTitle}>Panel 1 : Terrorisme, radicalisation et extrémisme violent en Afrique de l’Ouest</h4>
                <p style={styles.panelModerator}><strong>Modération :</strong> Ali ZADA (ANACI/NIGER)</p>
                <ul style={styles.panelList}>
                  <li><strong>Dr. Hamidou MAGASSA</strong> : Facteurs socio-économiques, politiques et idéologiques du terrorisme.</li>
                  <li><strong>Dr. Bakary Sambe</strong> : Instrumentalisation de la religion à des fins violentes.</li>
                  <li><strong>Dr. Mamadou DIAMOUTENE</strong> : Impacts sur la cohésion sociale et la stabilité des États.</li>
                </ul>
              </div>

              <div style={styles.panelCard}>
                <h4 style={styles.panelTitle}>Panel 2 : Le rôle des intellectuels musulmans dans la construction de la paix</h4>
                <p style={styles.panelModerator}><strong>Modération :</strong> Prof. Ibrahim NAIMY (PCA - DICID)</p>
                <ul style={styles.panelList}>
                  <li><strong>Hassan Youssouf DIALLO</strong> : Fondements islamiques de la paix, de la justice et du vivre-ensemble.</li>
                  <li><strong>Imam BEN SALAH</strong> : Responsabilité intellectuelle et morale face à la radicalisation.</li>
                  <li><strong>Ibrahim MAIGA</strong> : Élaboration et diffusion de contre-discours crédibles.</li>
                </ul>
              </div>

              <div style={styles.panelCard}>
                <h4 style={styles.panelTitle}>Panel 3 : Associations et ONG islamiques face au terrorisme</h4>
                <p style={styles.panelModerator}><strong>Modération :</strong> Vassiriki TOURE (RCI)</p>
                <ul style={styles.panelList}>
                  <li><strong>Nouhoum BAGAYOKO</strong> : Actions communautaires de prévention de la radicalisation.</li>
                  <li><strong>Algérie (Représentant)</strong> : Encadrement et autonomisation des jeunes.</li>
                  <li><strong>Dr. Said THIERNO</strong> : Coopération avec l’État et les acteurs de la société civile.</li>
                </ul>
              </div>
            </div>

            <h3 style={styles.subTitle}><FaClock style={{ marginRight: '0.5rem', color: 'var(--accent)' }} /> Chronogramme Détaillé</h3>
            <div style={styles.timeline}>
              {/* 07:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>07h30 – 08h30</div>
                <div style={styles.timelineContent}>
                  <strong>Accueil et enregistrement des participants</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Installation des participants et distribution des badges</li>
                    <li>Networking et échanges informels</li>
                  </ul>
                </div>
              </div>
              {/* 08:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>08h30 – 08h45</div>
                <div style={styles.timelineContent}>
                  <strong>Ouverture officielle</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Lecture de versets du Saint Coran & Hymne national</li>
                    <li>Mot de bienvenue du Président de l'AIMB et du RAI-Bénin</li>
                  </ul>
                </div>
              </div>
              {/* 08:45 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>08h45 – 09h30</div>
                <div style={styles.timelineContent}>
                  <strong>Allocutions officielles</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Représentants UEMOA, CEDEAO, UNDP, OCI, DICID</li>
                    <li>S.E. Dr. Mohamed Ibn Chambas & Ministres de la République du Bénin</li>
                  </ul>
                </div>
              </div>
              {/* 09:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>09h30 – 10h15</div>
                <div style={styles.timelineContent}>
                  <strong>Présentation sur le thème principal du Débat de Cotonou</strong>
                  <ul style={styles.timelineSubList}>
                    <li><strong>Par :</strong> SAR (HRH) Lamido Sanusi Lamido</li>
                    <li><strong>Discutant :</strong> Prof. Hamdou Magassa (Mali)</li>
                    <li><strong>Facilitateur :</strong> Prof. Nassirou BAKO-ARIFARI</li>
                  </ul>
                </div>
              </div>
              {/* 10:15 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>10h15 – 10h30</div>
                <div style={styles.timelineContent}>☕ Pause Café</div>
              </div>
              {/* 10:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>10h30 – 10h45</div>
                <div style={styles.timelineContent}>
                  <strong>Cadrage des travaux</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Contexte, objectifs et méthodologie par les Présidents du Comité d'Organisation/Scientifique.</div>
                </div>
              </div>
              {/* 10:45 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>10h45 – 11h15</div>
                <div style={styles.timelineContent}><strong>Panel 1 :</strong> Terrorisme, radicalisation et extrémisme violent en Afrique de l’Ouest</div>
              </div>
              {/* 11:15 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>11h15 – 11h30</div>
                <div style={styles.timelineContent}>☕ Pause Café</div>
              </div>
              {/* 11:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>11h30 – 12h45</div>
                <div style={styles.timelineContent}><strong>Panel 2 :</strong> Le rôle des intellectuels musulmans dans la construction de la paix</div>
              </div>
              {/* 12:45 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>12h45 – 14h00</div>
                <div style={styles.timelineContent}>🍽️ Pause Déjeuner et Prière</div>
              </div>
              {/* 14:00 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>14h00 – 15h15</div>
                <div style={styles.timelineContent}><strong>Panel 3 :</strong> Associations et ONG islamiques face au terrorisme</div>
              </div>
              {/* 15:15 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>15h15 – 15h30</div>
                <div style={styles.timelineContent}>☕ Pause Café</div>
              </div>
              {/* 15:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>15h30 – 16h30</div>
                <div style={styles.timelineContent}>
                  <strong>Table ronde de synthèse</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Avec les universitaires, leaders religieux, responsables d'ONG et représentants institutionnels.</div>
                </div>
              </div>
              {/* 16:30 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>16h30 – 17h00</div>
                <div style={styles.timelineContent}>
                  <strong>Adoption des recommandations</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Présentation du rapport de synthèse</li>
                    <li>Validation des recommandations et feuille de route</li>
                  </ul>
                </div>
              </div>
              {/* 17:00 */}
              <div style={styles.timelineItem} className="timelineItem">
                <div style={styles.timelineDot}></div>
                <div style={styles.timelineTime}>17h00 – 17h30</div>
                <div style={styles.timelineContent}>
                  <strong>Cérémonie de clôture</strong>
                  <ul style={styles.timelineSubList}>
                    <li>Lecture du communiqué final (Déclaration de Cotonou)</li>
                    <li>Mot de clôture et Photo de famille</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 style={styles.subTitle}>Édition précédente (2017)</h3>
            <p style={styles.text}>Découvrez les moments forts du Débat de Cotonou de 2017 à travers ces vidéos :</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <iframe
                src="https://www.youtube.com/embed/c6GBhVnMx_A"
                title="Débat de Cotonou 2017 - Partie 1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              ></iframe>
              <iframe
                src="https://www.youtube.com/embed/lveFUIdYKmI"
                title="Débat de Cotonou 2017 - Partie 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              ></iframe>
            </div>
          </div>

          <div style={styles.sidebar}>
            {/* Info Box */}
            <div style={styles.sidebarBox} className="glass sidebar-box">
              <h3 style={styles.sidebarTitle}>Informations Clés</h3>
              <div style={styles.infoItemsGrid}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaCalendarAlt style={{ marginRight: '0.4rem' }} /> DATE</span>
                  <span style={styles.infoVal}>Samedi 25 Juillet 2026</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaMapMarkerAlt style={{ marginRight: '0.4rem' }} /> LIEU</span>
                  <span style={styles.infoVal}>Bénin Royal Hôtel, Cotonou</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}><FaTicketAlt style={{ marginRight: '0.4rem' }} /> ACCÈS</span>
                  <span style={styles.infoVal}>Gratuit (locaux) / 20 000 FCFA (internationaux)</span>
                </div>
              </div>
              
              <div style={{ marginTop: '1.5rem' }}>
                <span style={styles.infoLabel}><FaMapMarkerAlt style={{ marginRight: '0.4rem' }} /> CARTE DE LOCALISATION</span>
                <iframe
                  src="https://maps.google.com/maps?q=Benin%20Royal%20Hotel,%20Cotonou&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte Bénin Royal Hôtel"
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
            <div style={{ ...styles.sidebarBox, borderLeft: '4px solid var(--primary)', background: 'rgba(56, 165, 84, 0.03)' }} className="glass sidebar-box">
              <h3 style={styles.sidebarTitle}>Rejoindre l'événement</h3>
              <p style={styles.sidebarText}>
                Les places sont limitées en raison de la capacité d'accueil de la salle. Enregistrez-vous dès maintenant pour garantir votre accès.
              </p>
              <Link href="/inscription/debat" className="btn btn-primary" style={styles.ctaBtn}>
                S'inscrire à l'événement
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
    background: 'rgba(56, 165, 84, 0.08)',
    border: '1px solid rgba(56, 165, 84, 0.2)',
    color: 'var(--primary)',
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
  subTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'var(--text-dark)',
    marginTop: '2rem',
    marginBottom: '1rem',
  },
  youtubeLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-dark)',
    fontWeight: '600',
    fontSize: '1rem',
    textDecoration: 'none',
  },
  text: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: 'var(--text-muted)',
    marginBottom: '1.25rem',
  },
  themeQuote: {
    borderLeft: '4px solid var(--accent)',
    background: 'rgba(232, 131, 42, 0.04)',
    padding: '1.5rem',
    fontSize: '1.05rem',
    lineHeight: '1.6',
    fontWeight: '600',
    color: 'var(--accent)',
    margin: '1.5rem 0',
  },
  panelCard: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  panelTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--primary)',
    marginBottom: '0.5rem',
  },
  panelModerator: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem',
    fontStyle: 'italic',
  },
  panelList: {
    paddingLeft: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    fontSize: '0.9rem',
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
