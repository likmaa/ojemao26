'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPass } from '@/app/lib/admin-actions';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Link from 'next/link';

function VerifyContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [participantData, setParticipantData] = useState<any>(null);

  useEffect(() => {
    if (idFromUrl) {
      handleVerification(idFromUrl);
    } else {
      // Initialize Scanner if no ID is present
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          // Si l'URL scannée ressemble à https://.../verify?id=UUID
          try {
            const url = new URL(decodedText);
            const scannedId = url.searchParams.get('id');
            if (scannedId) {
              scanner.clear();
              handleVerification(scannedId);
            } else {
              setStatus('error');
              setMessage('QR Code invalide: ID introuvable.');
            }
          } catch (e) {
            // Si c'est juste un ID brut
            scanner.clear();
            handleVerification(decodedText);
          }
        },
        (err) => {
          // Ignore scanner errors as they happen constantly during scanning
        }
      );

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [idFromUrl]);

  const handleVerification = async (id: string) => {
    setStatus('loading');
    const res = await verifyPass(id);
    
    if (res.success) {
      setStatus('success');
      setParticipantData(res.data);
      setMessage('Passe Valide !');
    } else {
      setStatus('error');
      setMessage(res.error || 'Erreur lors de la vérification.');
      if (res.data) setParticipantData(res.data);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', background: '#F8FAFC', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', color: '#0F172A', margin: 0 }}>Vérification des Passes</h1>
          <Link href="/admin/inscriptions" style={{ color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem' }}>
            Retour à l'Admin
          </Link>
        </div>

        {status === 'idle' && !idFromUrl && (
          <div>
            <p style={{ color: '#64748B', marginBottom: '1rem', textAlign: 'center' }}>Veuillez scanner le QR Code du participant.</p>
            <div id="reader" style={{ width: '100%' }}></div>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
            Vérification en cours...
          </div>
        )}

        {status === 'success' && participantData && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1rem auto' }}>
              ✓
            </div>
            <h2 style={{ color: '#10B981', margin: '0 0 1rem 0' }}>{message}</h2>
            
            <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '8px', textAlign: 'left' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#0F172A', fontWeight: 'bold' }}>{participantData.nom_prenom}</p>
              
              {participantData.is_cif ? (
                <>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Événement :</strong> Colloque (CIF)</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Profil :</strong> {participantData.statut}</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Délégation :</strong> {participantData.association || participantData.etablissement}</p>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Événement :</strong> Débat de Cotonou</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Profil :</strong> {participantData.type_participant}</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Place :</strong> <span style={{ fontSize: '1.5rem', color: '#10B981', fontWeight: 'bold' }}>N° {participantData.numero_chaise}</span></p>
                  {participantData.immatriculation && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Matricule :</strong> {participantData.immatriculation}</p>
                  )}
                </>
              )}
            </div>

            <button onClick={() => window.location.href = '/admin/verify'} style={{ marginTop: '2rem', width: '100%', padding: '1rem', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>
              Scanner un autre passe
            </button>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 1rem auto' }}>
              ✕
            </div>
            <h2 style={{ color: '#EF4444', margin: '0 0 1rem 0' }}>{message}</h2>

            {participantData && (
              <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', opacity: 0.7 }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#0F172A', fontWeight: 'bold' }}>{participantData.nom_prenom}</p>
                
                {participantData.is_cif ? (
                  <>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Événement :</strong> Colloque (CIF)</p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Profil :</strong> {participantData.statut}</p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Délégation :</strong> {participantData.association || participantData.etablissement}</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Événement :</strong> Débat de Cotonou</p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Profil :</strong> {participantData.type_participant}</p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}><strong>Place :</strong> N° {participantData.numero_chaise}</p>
                  </>
                )}
                
                {participantData.scanne_le && (
                  <p style={{ margin: '1rem 0 0 0', color: '#EF4444', fontWeight: 'bold', textAlign: 'center' }}>
                    ⚠️ SCANNÉ LE {new Date(participantData.scanne_le).toLocaleString('fr-FR')}
                  </p>
                )}
              </div>
            )}

            <button onClick={() => window.location.href = '/admin/verify'} style={{ marginTop: '2rem', width: '100%', padding: '1rem', background: '#64748B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem' }}>
              Retour au Scanner
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Chargement...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
