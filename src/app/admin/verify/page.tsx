'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPass } from '@/app/lib/admin-actions';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';
import { FaQrcode, FaSearch, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaArrowLeft, FaSyncAlt } from 'react-icons/fa';

function extractIdFromText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  
  // Try UUID regex directly (e.g. 8-4-4-4-12)
  const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = trimmed.match(uuidRegex);
  if (match) {
    return match[0];
  }

  // Try URL searchParams
  try {
    const url = new URL(trimmed);
    const idParam = url.searchParams.get('id') || url.searchParams.get('code');
    if (idParam) return idParam;
  } catch (e) {
    // Ignore invalid URL
  }

  return trimmed;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [participantData, setParticipantData] = useState<any>(null);
  const [manualInput, setManualInput] = useState('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (idFromUrl) {
      handleVerification(idFromUrl);
    } else {
      // Clear reader DOM container before initializing
      const readerElem = document.getElementById("reader");
      if (readerElem) {
        readerElem.innerHTML = "";
      }

      try {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true
          },
          false
        );

        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => {
            const cleanQuery = extractIdFromText(decodedText);
            if (cleanQuery) {
              if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
                scannerRef.current = null;
              }
              handleVerification(cleanQuery);
            } else {
              setStatus('error');
              setMessage('QR Code invalide ou ID introuvable.');
            }
          },
          () => {
            // Ignore frame errors
          }
        );
      } catch (err) {
        console.error("Erreur d'initialisation du scanner:", err);
      }

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
          scannerRef.current = null;
        }
      };
    }
  }, [idFromUrl]);

  const handleVerification = async (query: string) => {
    if (!query.trim()) return;
    setStatus('loading');
    const res = await verifyPass(query);
    
    if (res.success) {
      setStatus('success');
      setParticipantData(res.data);
      setMessage('✅ PASSE VALIDE — ENTRÉE AUTORISÉE');
    } else {
      setStatus('error');
      setMessage(res.error || 'Erreur lors de la vérification.');
      if (res.data) setParticipantData(res.data);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleVerification(manualInput.trim());
    }
  };

  const resetScanner = () => {
    setStatus('idle');
    setMessage('');
    setParticipantData(null);
    setManualInput('');
    window.location.href = '/admin/verify';
  };

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem', background: '#F1F5F9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', background: '#ECFDF5', color: '#10B981', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <FaQrcode />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', color: '#0F172A', margin: 0, fontWeight: '800' }}>Scanner de QR Code</h1>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>Vérification des billets & contrôle d'accès</p>
            </div>
          </div>
          <Link href="/admin/inscriptions" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}>
            <FaArrowLeft /> Admin
          </Link>
        </div>

        {/* Manual search bar */}
        <form onSubmit={handleManualSubmit} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Rechercher par ID, Email, Nom ou Téléphone..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0.75rem 1.25rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            <FaSearch /> Vérifier
          </button>
        </form>

        {status === 'idle' && !idFromUrl && (
          <div>
            <p style={{ color: '#64748B', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
              Placez le QR code du participant devant la caméra :
            </p>
            <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E2E8F0' }}></div>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontWeight: '600' }}>Vérification du passe en cours...</p>
          </div>
        )}

        {status === 'success' && participantData && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem auto' }}>
              <FaCheckCircle />
            </div>
            <h2 style={{ color: '#10B981', margin: '0 0 1.25rem 0', fontSize: '1.3rem', fontWeight: '800' }}>{message}</h2>
            
            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Nom & Prénom</span>
                <p style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: '800' }}>{participantData.nom_prenom}</p>
              </div>

              {participantData.is_cif ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Événement</span>
                      <p style={{ margin: 0, color: '#475569', fontWeight: '600' }}>Colloque International (CIF)</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Statut paiement</span>
                      <p style={{ margin: 0, color: '#10B981', fontWeight: '700' }}>{participantData.statut || 'Valide'}</p>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Organisation / Fonction</span>
                    <p style={{ margin: 0, color: '#475569' }}>{participantData.etablissement || participantData.association || '—'}</p>
                  </div>
                </>
              ) : participantData.is_delegue ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Événement</span>
                      <p style={{ margin: 0, color: '#475569', fontWeight: '600' }}>Congrès (Délégué)</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Pays / Structure</span>
                      <p style={{ margin: 0, color: '#475569', fontWeight: '600' }}>{participantData.pays} - {participantData.structure}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Événement</span>
                      <p style={{ margin: 0, color: '#475569', fontWeight: '600' }}>Débat de Cotonou (D2C26)</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Numéro de Place</span>
                      <p style={{ margin: 0, color: '#10B981', fontWeight: '900', fontSize: '1.2rem' }}>#{participantData.numero_chaise || '—'}</p>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: '700' }}>Type de participant</span>
                    <p style={{ margin: 0, color: '#475569' }}>{participantData.type_participant} {participantData.poste ? `(${participantData.poste})` : ''}</p>
                  </div>
                </>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Contact</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{participantData.telephone || participantData.whatsapp || '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Email</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569' }}>{participantData.email || '—'}</p>
                </div>
              </div>
            </div>

            <button onClick={resetScanner} style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem', background: '#10B981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FaSyncAlt /> Scanner / Vérifier un autre passe
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1rem auto' }}>
              <FaTimesCircle />
            </div>
            <h2 style={{ color: '#EF4444', margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '800' }}>{message}</h2>

            {participantData && (
              <div style={{ background: '#FFF5F5', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', border: '1px solid #FEE2E2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#991B1B', fontWeight: 'bold' }}>{participantData.nom_prenom}</p>
                
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#7F1D1D' }}>
                  <strong>Événement :</strong> {participantData.is_cif ? 'Colloque (CIF)' : participantData.is_delegue ? 'Congrès' : 'Débat de Cotonou'}
                </p>

                {participantData.scanne_le && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#991B1B', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaExclamationTriangle color="#EF4444" /> DÉJÀ SCANNÉ LE {new Date(participantData.scanne_le).toLocaleString('fr-FR')}
                  </div>
                )}
              </div>
            )}

            <button onClick={resetScanner} style={{ marginTop: '1.5rem', width: '100%', padding: '0.9rem', background: '#64748B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <FaSyncAlt /> Réessayer le Scanner
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Chargement du scanner...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
