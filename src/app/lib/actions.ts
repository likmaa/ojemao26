'use server';

import { supabase, isSupabaseConfigured } from './supabase';
import { InscriptionDebatInput, InscriptionCifInput, InscriptionDelegueInput } from './types';
import fs from 'fs/promises';
import path from 'path';

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

  // Simple validation
  if (!nom_prenom || !genre || !type_participant || !ville_pays || !telephone || !email || !participer_cif) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
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
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('inscriptions_debat').insert([data]);
      if (error) throw error;
      return { success: true, message: 'Votre inscription au Débat de Cotonou a été enregistrée avec succès !' };
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: `Erreur lors de l'enregistrement : ${error.message}` };
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

  // Simple validation
  if (!nom_prenom || !genre || !tranche_age || !ville_pays || !statut || !whatsapp || !email || !association || !moyen_deplacement || !date_arrivee || !date_depart || !comment_connu) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
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
      const { error } = await supabase.from('inscriptions_cif').insert([data]);
      if (error) throw error;
      return { success: true, message: 'Votre réservation pour le CIF a été enregistrée avec succès ! Le paiement se fera sur place.' };
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: `Erreur lors de l'enregistrement : ${error.message}` };
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
export async function submitInscriptionDelegue(prevState: any, formData: FormData) {
  const structure_pays = formData.get('structure_pays') as string;
  const mandat = formData.get('mandat') as string;
  const nom_prenom = formData.get('nom_prenom') as string;
  const fonction = formData.get('fonction') as string;
  const telephone = formData.get('telephone') as string;
  const email = formData.get('email') as string;
  const nombre_delegues = parseInt(formData.get('nombre_delegues') as string || '1', 10);
  const besoin_hebergement = formData.get('besoin_hebergement') as string;
  const moyen_deplacement = formData.get('moyen_deplacement') as string;
  const date_arrivee = formData.get('date_arrivee') as string;
  const date_depart = formData.get('date_depart') as string;
  const code_validation = formData.get('code_validation') as string;

  // Simple validation
  if (!structure_pays || !mandat || !nom_prenom || !telephone || !email || !besoin_hebergement || !moyen_deplacement || !date_arrivee || !date_depart || !code_validation) {
    return { success: false, error: 'Veuillez remplir tous les champs obligatoires.' };
  }

  // Code validation check (e.g., standard code like "OJEMAO26" or "COTONOU26")
  // Let's check for "OJEMAO26" as a simple secure check, customizable by coordination.
  if (code_validation.trim().toUpperCase() !== 'OJEMAO26') {
    return { success: false, error: 'Code de validation incorrect. Veuillez contacter la coordination.' };
  }

  const data: InscriptionDelegueInput = {
    structure_pays,
    mandat,
    nom_prenom,
    fonction,
    telephone,
    email,
    nombre_delegues,
    besoin_hebergement,
    moyen_deplacement,
    date_arrivee,
    date_depart,
    code_validation,
  };

  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase.from('delegues_congres').insert([data]);
      if (error) throw error;
      return { success: true, message: 'Le recensement de votre délégation a été enregistré avec succès !' };
    } catch (error: any) {
      console.error('Supabase error:', error);
      return { success: false, error: `Erreur lors de l'enregistrement : ${error.message}` };
    }
  } else {
    // Save to local JSON file
    try {
      await saveToLocalJson('delegues_submissions.json', data);
      return { 
        success: true, 
        message: 'Recensement enregistré localement (mode développement).' 
      };
    } catch (e) {
      return { success: false, error: 'Erreur lors de la sauvegarde des données.' };
    }
  }
}
