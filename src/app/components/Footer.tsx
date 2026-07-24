import Link from 'next/link';
import Image from 'next/image';
import { FaPhoneAlt, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Col 1: About / Branding */}
          <div style={styles.col}>
            <Image
              src="/images/logo.png"
              alt="OJEMAO 2026 Logo"
              width={160}
              height={55}
              style={{ objectFit: 'contain', marginBottom: '0.5rem' }}
            />
            <p style={styles.aboutText}>
              Événements institutionnels portés par l'Association des Intellectuels Musulmans du Bénin (AIMB), l'ACEEMUB, l'OJEMAO et le RAI-Bénin à Cotonou.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Événements</h4>
            <div style={styles.links}>
              <Link href="/evenement/debat" style={styles.link}>Débat de Cotonou (D2C26)</Link>
              <Link href="/evenement/cif" style={styles.link}>Congrès & Colloque (CIF)</Link>
              <Link href="/programme" style={styles.link}>Programme complet</Link>
              <Link href="/intervenants" style={styles.link}>Intervenants officiels</Link>
            </div>
          </div>

          {/* Col 3: Resources */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Inscriptions & Outils</h4>
            <div style={styles.links}>
              <Link href="/inscription/debat" style={styles.link}>S'inscrire au Débat (Gratuit)</Link>
              <Link href="/inscription/cif" style={styles.link}>Réserver pour le CIF (Colloque)</Link>
              <Link href="/j-y-serai" style={{ ...styles.link, color: '#38BDF8', fontWeight: 'bold' }}>Créer mon Affiche "J'y serai"</Link>
              <Link href="/partenaires" style={styles.link}>Devenir Partenaire</Link>
              <Link href="/contact" style={styles.link}>Infos & Hébergements</Link>
            </div>
          </div>

          {/* Col 4: Partners / Logos */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Organisateurs</h4>
            
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem', alignItems: 'center' }}>
              {[
                "logo_ojemao.webp",
                "logo_aimb.webp",
                "logo_aceemub.webp",
                "logo_raibenin.webp"
              ].map((name, i) => (
                <div key={i} style={{ position: 'relative', height: '40px', width: '90px' }}>
                  <Image src={`/images/organisateurs/${name}`} alt={`Organisateur ${i + 1}`} fill style={{ objectFit: 'contain' }} sizes="90px" />
                </div>
              ))}
            </div>

            <p style={{...styles.organizerText, fontSize: '0.75rem'}}>
              OJEMAO • AIMB • ACEEMUB • RAI-BÉNIN
            </p>
            
            <div style={styles.contactInfo}>
              <p style={{ ...styles.contactItem, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaPhoneAlt size={12} color="var(--primary)" /> 
                <a href="tel:+2290169506246" style={{ color: 'inherit', textDecoration: 'none' }}>+229 0169506246</a>
              </p>
              <Link href="https://wa.me/2290169506246" target="_blank" rel="noopener noreferrer" style={styles.whatsappLink}>
                <FaWhatsapp size={16} /> Discuter sur WhatsApp
              </Link>
              <p style={{ ...styles.contactItem, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FaMapMarkerAlt size={12} color="var(--accent)" /> Cotonou, Bénin
              </p>
            </div>
          </div>
        </div>

        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} OJEMAO. Tous droits réservés. Conception et réalisation minimaliste officielle.
          </p>
          <div style={styles.bottomLinks}>
            <Link href="/mentions-legales" style={styles.bottomLink}>Données personnelles</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    color: 'var(--text-muted)',
    padding: '4rem 0 2rem 0',
    width: '100%',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3rem',
  },
  col: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  logoBadge: {
    background: 'var(--primary)',
    padding: '0.4rem 1.1rem',
    width: 'fit-content',
  },
  logoText: {
    fontFamily: 'var(--font-title)',
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.05em',
    color: '#FFFFFF',
  },
  aboutText: {
    fontSize: '0.85rem',
    lineHeight: '1.6',
    color: 'var(--text-muted)',
  },
  colTitle: {
    fontFamily: 'var(--font-title)',
    color: 'var(--text-dark)',
    fontSize: '0.9rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  links: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  link: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    transition: 'color 0.15s ease',
    width: 'fit-content',
    borderBottom: '1px solid transparent',
    paddingBottom: '2px',
  },
  organizerText: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--text-dark)',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.4rem',
    fontSize: '0.8rem',
    marginTop: '0.5rem',
  },
  contactItem: {
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  whatsappLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    color: '#25D366', // WhatsApp Brand Color
    fontWeight: '600',
    fontSize: '0.8rem',
    textDecoration: 'none',
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
  },
  bottomBar: {
    borderTop: '1px solid #E2E8F0',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  copyright: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  bottomLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  bottomLink: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};
