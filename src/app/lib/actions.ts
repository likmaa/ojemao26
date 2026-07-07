'use server';

import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import { InscriptionDebatInput, InscriptionCifInput, InscriptionDelegueInput } from './types';
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import { sendConfirmationEmail, sendFocalPointNotification } from './mailer';

// Admin Authentication Action
export async function authenticateAdmin(prevState: any, formData: FormData) {
  const password = formData.get('password') as string;
  const adminPassword = process.env.ADMIN_PASSWORD || 'ojemao2026';

  if (password === adminPassword) {
    (await cookies()).set('admin_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return { success: true };
  }

  return { success: false, error: 'Mot de passe incorrect.' };
}

export async function logoutAdmin() {
  (await cookies()).delete('admin_authenticated');
}

// Local storage fallback helper
async function saveToLocalJson(fileName: string, data: any) {
  try {
    const dirPath = path.join(process.cwd(), 'submissions');
    // Ensure dir exists
    await fs.mkdir(dirPath, { recursive: true });
    
    const filePath = path.join(dirPath, fileName);
    let existingData = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      existingData = JSON.parse(fileContent);
    } catch (e) {
      // File doesn't exist yet, start with empty array
    }
    
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      ...data
    };
    
    existingData.push(newEntry);
    await fs.writeFile(filePath, JSON.stringify(existingData, null, 2), 'utf-8');
    return newEntry;
  } catch (error) {
    console.error('Failed to save locally:', error);
    throw new Error('Erreur de stockage local.');
  }
}

// 1. Débat de Cotonou Submission Action
export async function submitInscriptionDebat(prevState: any, formData: FormData) {
  const nom_prenom = formData.get('nom_prenom') as string;
  const genre = formData.get('genre') as string;
  const organisation = formData.get('organisation') as string;
  const fonction = formData.get('fonction') as string;
  const type_participant = formData.get('type_participant') as string;
  const ville_pays = formData.get('ville_pays') as string;
  const telephone = formData.get('telephone') as string;
  const email = formData.get('email') as string;
  const organe_presse = formData.get('organe_presse') as string || undefined;
  const participer_cif = formData.get('participer_cif') as string;
  const consent = formData.get('consent') as string;
  const poste = formData.get('poste') as string || undefined;

  // Extra CIF fields
  const tranche_age = formData.get('tranche_age') as string;
  const association = formData.get('association') as string;
  const moyen_deplacement = formData.get('moyen_deplacement') as string;
  const comment_connu = formData.get('comment_connu') as string;
  const date_arrivee = formData.get('date_arrivee') as string;
  const date_depart = formData.get('date_depart') as string;
  const attente = formData.get('attente') as string || undefined;

  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const recaptchaValue = formData.get('g-recaptcha-response') as string;

  // Simple validation
  if (!nom_prenom || !genre || !type_participant || !ville_pays || !telephone || !email || !participer_cif) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.', fields };
  }
  if (!consent) {
    return { success: false, error: 'Vous devez accepter les conditions (usage des données) pour valider votre inscription.', fields };
  }
  if (!recaptchaValue) {
    return { success: false, error: 'Veuillez valider le reCAPTCHA (Je ne suis pas un robot).', fields };
  }

  // Verifier le reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Clé de test par défaut
  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaValue}`,
    });
    const recaptchaJson = await recaptchaRes.json();
    if (!recaptchaJson.success) {
      return { success: false, error: 'La validation reCAPTCHA a échoué.', fields };
    }
  } catch (e) {
    return { success: false, error: 'Erreur lors de la validation reCAPTCHA.', fields };
  }


  const data: InscriptionDebatInput = {
    nom_prenom,
    genre,
    organisation,
    fonction,
    type_participant,
    ville_pays,
    telephone,
    email,
    organe_presse,
    participer_cif,
    poste,
  };

  if (isSupabaseConfigured()) {
    try {
      // Check for duplicates
      const { data: existing } = await supabaseAdmin
        .from('inscriptions_debat')
        .select('id')
        .or(`email.eq.${email},telephone.eq.${telephone},nom_prenom.eq.${nom_prenom}`);

      if (existing && existing.length > 0) {
        return { success: false, error: 'Une inscription existe déjà avec ce nom, email ou numéro de téléphone.', fields };
      }

      // Seat numbering and quota logic
      const isPriority = ['ong_asso', 'religieux_commu', 'institution_partenaire', 'comite_orga', 'comite_scientifique'].includes(type_participant);
      
      let numero_chaise = 0;
      
      if (isPriority) {
        // Count existing priority seats (1 to 100)
        const { count, error: countError } = await supabaseAdmin
          .from('inscriptions_debat')
          .select('*', { count: 'exact', head: true })
          .lte('numero_chaise', 100);
          
        if (countError) throw countError;
        
        const priorityCount = count || 0;
        if (priorityCount >= 100) {
          return { success: false, error: 'Désolé, le quota des 100 places réservées aux leaders et comités est atteint. Veuillez choisir un profil standard (ex: Société Civile, Universitaire).', fields };
        }
        numero_chaise = priorityCount + 1;
      } else {
        // Standard seats (> 100)
        const { data: maxSeatData, error: maxError } = await supabaseAdmin
          .from('inscriptions_debat')
          .select('numero_chaise')
          .gt('numero_chaise', 100)
          .order('numero_chaise', { ascending: false })
          .limit(1);
          
        if (maxError) throw maxError;
        
        if (maxSeatData && maxSeatData.length > 0 && maxSeatData[0].numero_chaise) {
          numero_chaise = maxSeatData[0].numero_chaise + 1;
        } else {
          numero_chaise = 101; // Start at 101 for the first standard participant
        }
      }

      data.numero_chaise = numero_chaise;

      // Matricule logic
      if (type_participant === 'comite_orga' && poste) {
        data.immatriculation = `CO-${poste}`;
      } else if (type_participant === 'comite_scientifique' && poste) {
        data.immatriculation = `CS-${poste}`;
      }

      const { data: insertedData, error } = await supabaseAdmin.from('inscriptions_debat').insert([data]).select();
      if (error) throw error;
      
      const insertedRow = insertedData[0];

      // Envoi de l'email de confirmation au participant
      await sendConfirmationEmail({
        to: email,
        nom: nom_prenom,
        eventName: 'Débat de Cotonou',
        details: { ...data, id: insertedRow.id }
      });

      // Notification du point focal du pays de l'inscrit (silencieux, n'interrompt pas l'inscription)
      try {
        const countryKeywords = ville_pays.split(',').map((s: string) => s.trim()).filter(Boolean);
        const countryName = countryKeywords[countryKeywords.length - 1]; // Dernière partie = pays
        if (countryName) {
          const { data: focalPoints } = await supabaseAdmin
            .from('focal_points')
            .select('name, email, country')
            .not('email', 'is', null)
            .ilike('country', `%${countryName}%`)
            .limit(1);
          if (focalPoints && focalPoints.length > 0 && focalPoints[0].email) {
            const fp = focalPoints[0];
            await sendFocalPointNotification({
              focalPointEmail: fp.email,
              focalPointName: fp.name,
              country: fp.country,
              participant: { nom: nom_prenom, email, telephone, ville_pays, statut: type_participant, organisation },
              eventName: 'Débat de Cotonou',
            });
          }
        }
      } catch (fpError) {
        console.warn('Notification point focal échouée (non bloquante):', fpError);
      }

      // Auto-inscription au CIF si demandé
      if (participer_cif === 'oui') {
        const cifData: InscriptionCifInput = {
          nom_prenom,
          genre,
          tranche_age: tranche_age || 'Non précisé (Via Débat)',
          ville_pays,
          statut: type_participant,
          etablissement: organisation,
          whatsapp: telephone,
          email,
          association: association || organisation,
          attente: attente || 'Inscrit depuis le formulaire du Débat',
          moyen_deplacement: moyen_deplacement || 'Non précisé',
          date_arrivee: date_arrivee || 'Non précisé',
          date_depart: date_depart || 'Non précisé',
          comment_connu: comment_connu || 'Formulaire Débat',
        };
        // We ignore the duplicate check error here to let the main registration succeed even if they were already in CIF
        const { data: insertedCifData } = await supabaseAdmin.from('inscriptions_cif').insert([cifData]).select();
        
        if (insertedCifData && insertedCifData.length > 0) {
          await sendConfirmationEmail({
            to: email,
            nom: nom_prenom,
            eventName: 'Colloque International de Formation (CIF)',
            details: { ...cifData, id: insertedCifData[0].id }
          });
        }
      }

      return { success: true, message: 'Votre inscription au Débat de Cotonou a été enregistrée avec succès !' };
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: `Erreur d'accès à la base de données. L'administrateur doit désactiver le RLS (Row Level Security) sur Supabase.` };
    }
  } else {
    // Save to local JSON file
    try {
      await saveToLocalJson('debat_submissions.json', data);
      return { 
        success: true, 
        message: 'Inscription enregistrée localement (mode développement). Configurez Supabase pour la production.' 
      };
    } catch (e) {
      return { success: false, error: 'Erreur lors de la sauvegarde des données.' };
    }
  }
}

// 2. CIF Submission Action
export async function submitInscriptionCif(prevState: any, formData: FormData) {
  const nom_prenom = formData.get('nom_prenom') as string;
  const genre = formData.get('genre') as string;
  const tranche_age = formData.get('tranche_age') as string;
  const ville_pays = formData.get('ville_pays') as string;
  const statut = formData.get('statut') as string;
  const etablissement = formData.get('etablissement') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const email = formData.get('email') as string;
  const association = formData.get('association') as string;
  const attente = formData.get('attente') as string || undefined;
  const moyen_deplacement = formData.get('moyen_deplacement') as string;
  const date_arrivee = formData.get('date_arrivee') as string;
  const date_depart = formData.get('date_depart') as string;
  const comment_connu = formData.get('comment_connu') as string;
  const consent = formData.get('consent') as string;

  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;
  const recaptchaValue = formData.get('g-recaptcha-response') as string;

  // Simple validation
  if (!nom_prenom || !genre || !tranche_age || !ville_pays || !statut || !etablissement || !whatsapp || !email || !association || !attente || !moyen_deplacement || !date_arrivee || !date_depart || !comment_connu) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.', fields };
  }
  if (!consent) {
    return { success: false, error: 'Vous devez accepter les conditions (usage des données) pour valider votre inscription.', fields };
  }
  if (!recaptchaValue) {
    return { success: false, error: 'Veuillez valider le reCAPTCHA.', fields };
  }

  // Verifier le reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaValue}`,
    });
    const recaptchaJson = await recaptchaRes.json();
    if (!recaptchaJson.success) {
      return { success: false, error: 'La validation reCAPTCHA a échoué.', fields };
    }
  } catch (e) {
    return { success: false, error: 'Erreur lors de la validation reCAPTCHA.', fields };
  }

  const data: InscriptionCifInput = {
    nom_prenom,
    genre,
    tranche_age,
    ville_pays,
    statut,
    etablissement,
    whatsapp,
    email,
    association,
    attente,
    moyen_deplacement,
    date_arrivee,
    date_depart,
    comment_connu,
  };

  if (isSupabaseConfigured()) {
    try {
      // Check for duplicates
      const { data: existing } = await supabaseAdmin
        .from('inscriptions_cif')
        .select('id')
        .or(`email.eq.${email},whatsapp.eq.${whatsapp},nom_prenom.eq.${nom_prenom}`);

      if (existing && existing.length > 0) {
        return { success: false, error: 'Une inscription existe déjà avec ce nom, email ou numéro WhatsApp.' };
      }

      const { data: insertedData, error } = await supabaseAdmin.from('inscriptions_cif').insert([data]).select();
      if (error) throw error;
      
      const insertedRow = insertedData[0];

      await sendConfirmationEmail({
        to: email,
        nom: nom_prenom,
        eventName: 'Colloque International de Formation (CIF)',
        details: { ...data, id: insertedRow.id }
      });

      // Notification du point focal du pays de l'inscrit (silencieux)
      try {
        const countryKeywords = ville_pays.split(',').map((s: string) => s.trim()).filter(Boolean);
        const countryName = countryKeywords[countryKeywords.length - 1];
        if (countryName) {
          const { data: focalPoints } = await supabaseAdmin
            .from('focal_points')
            .select('name, email, country')
            .not('email', 'is', null)
            .ilike('country', `%${countryName}%`)
            .limit(1);
          if (focalPoints && focalPoints.length > 0 && focalPoints[0].email) {
            const fp = focalPoints[0];
            await sendFocalPointNotification({
              focalPointEmail: fp.email,
              focalPointName: fp.name,
              country: fp.country,
              participant: { nom: nom_prenom, email, whatsapp, ville_pays, statut, organisation: etablissement },
              eventName: 'Colloque International de Formation (CIF)',
            });
          }
        }
      } catch (fpError) {
        console.warn('Notification point focal CIF échouée (non bloquante):', fpError);
      }

      return { success: true, message: 'Votre inscription au CIF a été enregistrée avec succès !' };
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: `Erreur d'accès à la base de données. L'administrateur doit désactiver le RLS (Row Level Security) sur Supabase.` };
    }
  } else {
    // Save to local JSON file
    try {
      await saveToLocalJson('cif_submissions.json', data);
      return { 
        success: true, 
        message: 'Réservation enregistrée localement (mode développement). Le paiement se fera sur place.' 
      };
    } catch (e) {
      return { success: false, error: 'Erreur lors de la sauvegarde des données.' };
    }
  }
}

// 3. Délégués Submission Action
export async function submitInscriptionCongres(prevState: any, formData: FormData) {
  const pays = formData.get('pays') as string;
  const structure = formData.get('structure') as string;
  const mandat = formData.get('mandat') as string;
  const nom_prenom = formData.get('nom_prenom') as string;
  const telephone = formData.get('telephone') as string;
  const email = formData.get('email') as string;
  const recaptchaValue = formData.get('g-recaptcha-response') as string;

  const document_mission = formData.get('document_mission') as File | null;
  const document_identite = formData.get('document_identite') as File | null;

  const fields = { nom_prenom, pays, structure, mandat, telephone, email };

  // Simple validation
  if (!pays || !structure || !mandat || !nom_prenom || !telephone || !email) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.', fields };
  }
  
  if (!document_mission || document_mission.size === 0 || !document_identite || document_identite.size === 0) {
    return { success: false, error: 'Veuillez fournir l\'ordre de mission et la pièce d\'identité.', fields };
  }

  if (!recaptchaValue) {
    return { success: false, error: 'Veuillez valider le reCAPTCHA.', fields };
  }

  // Verifier le reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaValue}`,
    });
    const recaptchaJson = await recaptchaRes.json();
    if (!recaptchaJson.success) {
      return { success: false, error: 'La validation reCAPTCHA a échoué.', fields };
    }
  } catch (e) {
    return { success: false, error: 'Erreur lors de la validation reCAPTCHA.', fields };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase n\'est pas configuré. Veuillez configurer Supabase pour gérer les fichiers.', fields };
  }

  try {
    // Check for duplicates
    const { data: existing } = await supabaseAdmin
      .from('delegues_congres')
      .select('id')
      .or(`email.eq.${email},telephone.eq.${telephone},nom_prenom.eq.${nom_prenom}`);

    if (existing && existing.length > 0) {
      return { success: false, error: 'Un délégué existe déjà avec ce nom, email ou numéro de téléphone.', fields };
    }

    // Fonction d'upload
    const uploadFile = async (file: File, prefix: string) => {
      const ext = file.name.split('.').pop() || 'pdf';
      const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { data, error } = await supabaseAdmin.storage.from('documents_congres').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabaseAdmin.storage.from('documents_congres').getPublicUrl(fileName);
      return publicUrl;
    };

    // Upload des fichiers en parallèle
    const [missionUrl, identiteUrl] = await Promise.all([
      uploadFile(document_mission, 'mission'),
      uploadFile(document_identite, 'identite')
    ]);

    const data = {
      pays,
      structure,
      mandat,
      nom_prenom,
      telephone,
      email,
      document_mission_url: missionUrl,
      document_identite_url: identiteUrl,
      statut: 'en_attente'
    };

    const { error } = await supabaseAdmin.from('delegues_congres').insert([data]);
    if (error) throw error;

    // Pas d'email automatique, il sera envoyé après validation de l'admin.
    return { success: true, message: 'Votre dossier de délégation a été soumis avec succès. Il est en attente de validation par l\'administration. Vous recevrez un mail de confirmation après validation.' };
  } catch (error: any) {
    console.error('Supabase error:', error);
    return { success: false, error: error.message || 'Erreur lors de l\'enregistrement des données.', fields };
  }
}
