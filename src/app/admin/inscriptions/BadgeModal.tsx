'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaDownload, FaPrint, FaSearchPlus, FaSearchMinus, FaArrowsAlt, FaUpload, FaIdCard } from 'react-icons/fa';

interface BadgeModalProps {
  data: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeModal({ data, isOpen, onClose }: BadgeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Template state
  const [templateType, setTemplateType] = useState<'co' | 'cif' | 'debat'>('co');
  
  // Participant text state
  const [nameText, setNameText] = useState(data.nom_prenom || '');
  const [roleText, setRoleText] = useState(data.type_participant || data.etablissement || 'COMITÉ D\'ORGANISATION');
  const [fontSize, setFontSize] = useState(42);
  const [textColor, setTextColor] = useState('#000000');

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string>(data.photo_profil || '');
  const [photoScale, setPhotoScale] = useState(1.0);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);

  const [imageLoaded, setImageLoaded] = useState(false);
  const photoImgRef = useRef<HTMLImageElement | null>(null);

  // Sync state when props change
  useEffect(() => {
    setNameText(data.nom_prenom || '');
    setPhotoUrl(data.photo_profil || '');
    setPhotoScale(1.0);
    setPhotoOffsetX(0);
    setPhotoOffsetY(0);
  }, [data]);

  // Load photo element when photoUrl changes
  useEffect(() => {
    if (photoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = photoUrl;
      img.onload = () => {
        photoImgRef.current = img;
        setImageLoaded(true);
      };
      img.onerror = () => {
        photoImgRef.current = null;
        setImageLoaded(false);
      };
    } else {
      photoImgRef.current = null;
      setImageLoaded(false);
    }
  }, [photoUrl]);

  // Draw canvas on any change
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const templateSrc = templateType === 'co' 
      ? '/images/gabarit-co.png' 
      : templateType === 'cif' 
        ? '/images/gabarit-cif.png' 
        : '/images/gabarit-debat.png';

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = templateSrc;

    bgImg.onload = () => {
      // 1. Draw Background Gabarit (1200 x 1800)
      ctx.clearRect(0, 0, 1200, 1800);
      ctx.drawImage(bgImg, 0, 0, 1200, 1800);

      // 2. Draw Photo in Circular Frame (Center: X=600, Y=508, Radius=305)
      if (photoImgRef.current) {
        ctx.save();

        // Create Circular Clip
        ctx.beginPath();
        ctx.arc(600, 508, 305, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const img = photoImgRef.current;
        const aspect = img.width / img.height;

        let drawW = 610 * photoScale;
        let drawH = (610 / aspect) * photoScale;

        if (aspect > 1) {
          drawH = 610 * photoScale;
          drawW = 610 * aspect * photoScale;
        }

        const drawX = 600 - drawW / 2 + photoOffsetX;
        const drawY = 508 - drawH / 2 + photoOffsetY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();
      }

      // 3. Draw Name inside white pill box (Center: X=600, Y=1179)
      if (nameText) {
        ctx.save();
        ctx.font = `900 ${fontSize}px Inter, Roboto, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nameText.toUpperCase(), 600, 1179);
        ctx.restore();
      }
    };
  }, [isOpen, templateType, nameText, fontSize, textColor, photoUrl, photoScale, photoOffsetX, photoOffsetY, imageLoaded]);

  if (!isOpen) return null;

  // Upload local photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPhotoUrl(evt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download high-resolution PNG
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const filename = `badge_${(nameText || 'co').toLowerCase().replace(/\s+/g, '_')}.png`;
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Print badge
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Impression Badge - ${nameText}</title>
            <style>
              @page { size: A6 portrait; margin: 0; }
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
              img { width: 100mm; height: 150mm; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FaIdCard style={{ color: '#10B981', fontSize: '1.4rem' }} />
            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '1.2rem', fontWeight: '800' }}>
              Générateur de Badge (Comité d'Organisation)
            </h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><FaTimes /></button>
        </div>

        {/* Content Body */}
        <div style={bodyStyle}>
          
          {/* Left Column: Canvas Preview */}
          <div style={previewColStyle}>
            <div style={canvasWrapperStyle}>
              <canvas
                ref={canvasRef}
                width={1200}
                height={1800}
                style={{ width: '100%', height: 'auto', borderRadius: '12px', display: 'block', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '1rem' }}>
              <button onClick={handleDownloadPng} style={downloadBtnStyle}>
                <FaDownload /> Télécharger PNG (HD)
              </button>
              <button onClick={handlePrint} style={printBtnStyle}>
                <FaPrint /> Imprimer le Badge
              </button>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div style={controlsColStyle}>
            
            {/* Section 1: Template */}
            <div style={controlGroupStyle}>
              <label style={labelStyle}>Modèle de Badge</label>
              <select 
                value={templateType} 
                onChange={(e) => setTemplateType(e.target.value as any)}
                style={selectStyle}
              >
                <option value="co">Comité d'Organisation (Gabarit CO)</option>
                <option value="cif">CIF 2026 (Colloque)</option>
                <option value="debat">Débat de Cotonou (D2C26)</option>
              </select>
            </div>

            {/* Section 2: Photo Controls */}
            <div style={controlGroupStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ ...labelStyle, margin: 0 }}>Photo de Profil</label>
                <label style={uploadLabelStyle}>
                  <FaUpload /> Importer Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {!photoUrl && (
                <p style={{ color: '#EF4444', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                  ⚠️ Aucune photo enregistrée. Veuillez importer une photo.
                </p>
              )}

              {photoUrl && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  
                  {/* Zoom Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span><FaSearchPlus /> Zoom Photo</span>
                      <span>{(photoScale * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={photoScale}
                      onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
                      style={rangeStyle}
                    />
                  </div>

                  {/* Horizontal Offset */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>↔️ Déplacement X</span>
                      <span>{photoOffsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-250"
                      max="250"
                      step="5"
                      value={photoOffsetX}
                      onChange={(e) => setPhotoOffsetX(parseInt(e.target.value))}
                      style={rangeStyle}
                    />
                  </div>

                  {/* Vertical Offset */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                      <span>↕️ Déplacement Y</span>
                      <span>{photoOffsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-250"
                      max="250"
                      step="5"
                      value={photoOffsetY}
                      onChange={(e) => setPhotoOffsetY(parseInt(e.target.value))}
                      style={rangeStyle}
                    />
                  </div>

                  {/* Reset Photo */}
                  <button 
                    onClick={() => { setPhotoScale(1.0); setPhotoOffsetX(0); setPhotoOffsetY(0); }}
                    style={resetBtnStyle}
                  >
                    Réinitialiser le cadrage
                  </button>
                </div>
              )}
            </div>

            {/* Section 3: Name & Typography */}
            <div style={controlGroupStyle}>
              <label style={labelStyle}>Nom & Prénom (Cadre)</label>
              <input
                type="text"
                value={nameText}
                onChange={(e) => setNameText(e.target.value)}
                style={inputStyle}
                placeholder="EX: KOUAMÉ JEAN-MARC"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569' }}>
                    <span>Taille Texte</span>
                    <span>{fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="28"
                    max="60"
                    step="2"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={rangeStyle}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Couleur Texte</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 99999,
  padding: '1rem',
};

const modalStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '900px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeBtnStyle: React.CSSProperties = {
  background: '#F1F5F9',
  border: 'none',
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#64748B',
};

const bodyStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  gap: '1.5rem',
};

const previewColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const canvasWrapperStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '320px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #E2E8F0',
};

const controlsColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const controlGroupStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '1rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '700',
  color: '#0F172A',
  marginBottom: '0.4rem',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #CBD5E1',
  fontSize: '0.9rem',
  background: 'white',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1px solid #CBD5E1',
  fontSize: '0.9rem',
};

const rangeStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '0.2rem',
  cursor: 'pointer',
};

const uploadLabelStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: '700',
  color: '#3B82F6',
  cursor: 'pointer',
};

const resetBtnStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #CBD5E1',
  borderRadius: '6px',
  padding: '0.4rem 0.6rem',
  fontSize: '0.75rem',
  color: '#64748B',
  cursor: 'pointer',
};

const downloadBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.75rem',
  background: '#10B981',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
};

const printBtnStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.75rem',
  background: '#3B82F6',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
};
