'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaDownload, FaShareAlt, FaImage, FaSyncAlt, FaArrowLeft, FaCheckCircle, FaSlidersH } from 'react-icons/fa';

interface GabaritPreset {
  id: string;
  name: string;
  subtitle: string;
  imageSrc: string;
  defaultPhotoX: number;
  defaultPhotoY: number;
  defaultPhotoRadius: number;
  defaultNameY: number;
  defaultRoleY: number;
  defaultTextColor: string;
}

const PRESETS: GabaritPreset[] = [
  {
    id: 'debat',
    name: 'Débat de Cotonou (D2C26)',
    subtitle: 'Samedi 25 Juillet 2026 • Bénin Royal Hôtel',
    imageSrc: '/images/gabarit-debat.png',
    defaultPhotoX: 540,
    defaultPhotoY: 540,
    defaultPhotoRadius: 145,
    defaultNameY: 740,
    defaultRoleY: 780,
    defaultTextColor: '#FFFFFF',
  },
  {
    id: 'cif',
    name: 'Congrès & Colloque CIF 2026',
    subtitle: '24 au 28 Juillet 2026 • Direct Aid Cotonou',
    imageSrc: '/images/gabarit-cif.png',
    defaultPhotoX: 540,
    defaultPhotoY: 460,
    defaultPhotoRadius: 160,
    defaultNameY: 740,
    defaultRoleY: 780,
    defaultTextColor: '#0F172A',
  },
];

export default function GenerateurAffiche() {
  const [selectedPreset, setSelectedPreset] = useState<GabaritPreset>(PRESETS[0]);
  const [name, setName] = useState('Dr. Amadou KOFFI');
  const [role, setRole] = useState('Participant • Bénin');
  const [userImage, setUserImage] = useState<HTMLImageElement | null>(null);

  // Photo controls
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);

  // Text controls
  const [textOffsetY, setTextOffsetY] = useState(0);
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState(38);

  const [downloaded, setDownloaded] = useState(false);
  const [overlayImage, setOverlayImage] = useState<HTMLImageElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load selected preset overlay image
  useEffect(() => {
    const img = new Image();
    img.src = selectedPreset.imageSrc;
    img.onload = () => {
      setOverlayImage(img);
      setTextColor(selectedPreset.defaultTextColor);
    };
  }, [selectedPreset]);

  // Load sample initial user photo
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    img.onload = () => setUserImage(img);
  }, []);

  // Handle image upload from computer or phone
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        setPhotoZoom(1);
        setPhotoOffsetX(0);
        setPhotoOffsetY(0);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Draw on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Clear canvas
    ctx.clearRect(0, 0, W, H);

    // 1. Draw User Photo in the background slot
    const targetX = selectedPreset.defaultPhotoX + photoOffsetX;
    const targetY = selectedPreset.defaultPhotoY + photoOffsetY;
    const radius = selectedPreset.defaultPhotoRadius;

    ctx.save();
    // Clip inside the circle if desired, or draw freely behind the overlay transparent window
    ctx.beginPath();
    ctx.arc(targetX, targetY, radius * photoZoom, 0, Math.PI * 2);
    ctx.clip();

    if (userImage) {
      const aspect = userImage.width / userImage.height;
      let drawW = radius * 2 * photoZoom;
      let drawH = drawW / aspect;

      if (drawH < radius * 2 * photoZoom) {
        drawH = radius * 2 * photoZoom;
        drawW = drawH * aspect;
      }

      const drawX = targetX - drawW / 2;
      const drawY = targetY - drawH / 2;
      ctx.drawImage(userImage, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // 2. Draw Official Overlay Gabarit PNG on top
    if (overlayImage) {
      ctx.drawImage(overlayImage, 0, 0, W, H);
    }

    // 3. Draw User Name & Role Text on top of Gabarit
    if (name) {
      const nameY = selectedPreset.defaultNameY + textOffsetY;
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = `800 ${textSize}px "Outfit", "Inter", sans-serif`;

      // Text shadow for high readability
      ctx.shadowColor = textColor === '#FFFFFF' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
      ctx.shadowBlur = 8;
      ctx.fillText(name.toUpperCase(), W / 2, nameY);

      if (role) {
        const roleY = selectedPreset.defaultRoleY + textOffsetY;
        ctx.font = `600 ${Math.round(textSize * 0.65)}px "Inter", sans-serif`;
        ctx.fillText(role, W / 2, roleY);
      }
      ctx.restore();
    }
  }, [selectedPreset, overlayImage, userImage, name, role, photoZoom, photoOffsetX, photoOffsetY, textOffsetY, textColor, textSize]);

  // Download Action
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Affiche-JySerai-${name.replace(/\s+/g, '_') || 'OJEMAO'}.png`;
    link.href = imageURI;
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  // WhatsApp Share Action
  const handleWhatsAppShare = () => {
    handleDownload();
    const text = encodeURIComponent(
      `🎉 Je serai présent(e) au ${selectedPreset.name} ! Créez vous aussi votre affiche personnalisée sur le site de l'OJEMAO 2026 : https://ojemao26.logitech.tech/j-y-serai`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        {/* Navigation Header */}
        <div style={styles.navBar}>
          <Link href="/" style={styles.backBtn}>
            <FaArrowLeft style={{ marginRight: '8px' }} /> Retour au site
          </Link>
        </div>

        <div style={styles.headerTitle}>
          <span style={styles.badgeTag}>Générateur Officiel OJEMAO 2026</span>
          <h1 style={styles.mainHeading}>Créez votre Affiche "J'y serai !" 🖼️</h1>
          <p style={styles.subHeading}>
            Générez votre visuel officiel avec les gabarits originaux du Débat et du Congrès & CIF 2026 en 2 clics !
          </p>
        </div>

        {/* Workspace Layout */}
        <div style={styles.workspace}>
          {/* Controls Panel */}
          <div style={styles.controlsCard}>
            <h2 style={styles.cardTitle}>1. Choisissez l'Événement</h2>
            <div style={styles.presetGrid}>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPreset(p)}
                  style={{
                    ...styles.presetBtn,
                    border: selectedPreset.id === p.id ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                    background: selectedPreset.id === p.id ? '#F0F9FF' : '#FFFFFF',
                  }}
                >
                  <strong style={{ color: '#0F172A', display: 'block', fontSize: '0.95rem' }}>{p.name}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{p.subtitle}</span>
                </button>
              ))}
            </div>

            <h2 style={{ ...styles.cardTitle, marginTop: '1.75rem' }}>2. Vos Informations</h2>
            
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Nom & Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dr. Amadou KOFFI"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Fonction / Statut / Pays</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex: Participant • Bénin / Délégué"
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Importer votre photo de profil</label>
              <label style={styles.uploadBtn}>
                <FaImage style={{ marginRight: '8px' }} /> Choisir ma photo
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Ajustements */}
            <div style={styles.adjustBox}>
              <h3 style={styles.adjustTitle}><FaSlidersH style={{ marginRight: '6px' }} /> Ajustements Cadrage & Texte</h3>
              
              <div style={styles.sliderGroup}>
                <label style={styles.sliderLabel}>Zoom Photo ({Math.round(photoZoom * 100)}%)</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  value={photoZoom}
                  onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                  style={styles.slider}
                />
              </div>

              <div style={styles.sliderGroup}>
                <label style={styles.sliderLabel}>Position Photo Horizontale</label>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="5"
                  value={photoOffsetX}
                  onChange={(e) => setPhotoOffsetX(parseInt(e.target.value))}
                  style={styles.slider}
                />
              </div>

              <div style={styles.sliderGroup}>
                <label style={styles.sliderLabel}>Position Photo Verticale</label>
                <input
                  type="range"
                  min="-250"
                  max="250"
                  step="5"
                  value={photoOffsetY}
                  onChange={(e) => setPhotoOffsetY(parseInt(e.target.value))}
                  style={styles.slider}
                />
              </div>

              <div style={styles.sliderGroup}>
                <label style={styles.sliderLabel}>Hauteur du Texte sur l'Affiche</label>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="5"
                  value={textOffsetY}
                  onChange={(e) => setTextOffsetY(parseInt(e.target.value))}
                  style={styles.slider}
                />
              </div>

              <div style={styles.sliderGroup}>
                <label style={styles.sliderLabel}>Couleur de la police du Nom</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {['#FFFFFF', '#0F172A', '#F59E0B', '#0EA5E9', '#10B981'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTextColor(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c,
                        border: textColor === c ? '3px solid #000000' : '1px solid #CBD5E1',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setPhotoZoom(1);
                  setPhotoOffsetX(0);
                  setPhotoOffsetY(0);
                  setTextOffsetY(0);
                  setTextColor(selectedPreset.defaultTextColor);
                }}
                style={styles.resetBtn}
              >
                <FaSyncAlt style={{ marginRight: '6px' }} /> Réinitialiser les réglages
              </button>
            </div>
          </div>

          {/* Canvas Preview & Export */}
          <div style={styles.previewCard}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '1rem' }}>
              Aperçu en direct (1080 x 1080 px)
            </h3>
            
            <div style={styles.canvasContainer}>
              <canvas ref={canvasRef} style={styles.canvasPreview} />
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
              <button onClick={handleDownload} style={styles.downloadBtn}>
                <FaDownload style={{ fontSize: '1.2rem' }} /> Télécharger mon Affiche (PNG HD)
              </button>

              <button onClick={handleWhatsAppShare} style={styles.whatsappBtn}>
                <FaShareAlt style={{ fontSize: '1.1rem' }} /> Partager sur WhatsApp
              </button>
            </div>

            {downloaded && (
              <div style={styles.successNotification}>
                <FaCheckCircle style={{ color: '#10B981', marginRight: '8px' }} /> Affiche enregistrée ! Vous pouvez maintenant la publier sur vos statuts WhatsApp et réseaux sociaux.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '2rem 1rem 4rem 1rem',
    fontFamily: 'var(--font-inter), sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  navBar: {
    marginBottom: '1.5rem',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#0F172A',
    fontWeight: '600',
    fontSize: '0.95rem',
    textDecoration: 'none',
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  badgeTag: {
    background: 'rgba(14, 165, 233, 0.1)',
    color: '#0EA5E9',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'inline-block',
    marginBottom: '0.75rem',
  },
  mainHeading: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#0F172A',
    margin: '0 0 0.5rem 0',
  },
  subHeading: {
    fontSize: '1.05rem',
    color: '#64748B',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  workspace: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
    gap: '2rem',
    alignItems: 'start',
  },
  controlsCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
  },
  previewCard: {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  presetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
  },
  presetBtn: {
    padding: '0.85rem',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
  },
  fieldGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.85rem 1rem',
    background: '#0F172A',
    color: '#FFFFFF',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s ease',
  },
  adjustBox: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    background: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  adjustTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  sliderGroup: {
    marginBottom: '0.85rem',
  },
  sliderLabel: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: '#64748B',
    marginBottom: '0.25rem',
  },
  slider: {
    width: '100%',
    accentColor: '#0EA5E9',
    cursor: 'pointer',
  },
  resetBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: '#64748B',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
    padding: 0,
  },
  canvasContainer: {
    width: '100%',
    maxWidth: '450px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
    border: '1px solid #CBD5E1',
  },
  canvasPreview: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  actionButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    background: '#0EA5E9',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
    transition: 'transform 0.1s ease',
  },
  whatsappBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.85rem',
    background: '#25D366',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  successNotification: {
    marginTop: '1.25rem',
    padding: '0.85rem 1rem',
    background: '#ECFDF5',
    color: '#065F46',
    borderRadius: '8px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
  },
};
