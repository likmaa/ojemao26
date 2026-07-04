'use server';

import { supabase, isSupabaseConfigured } from './supabase';
import { revalidatePath } from 'next/cache';

// Verify admin auth
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const adminAuth = (await cookies()).get('admin_authenticated')?.value;
  if (adminAuth !== 'true') {
    throw new Error('Non autorisé');
  }
}

import { sendConfirmationEmail } from './mailer';

export async function deleteInscription(id: string, table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres') {
  await checkAdminAuth();
  
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting:', error);
    return { success: false, error: error.message || 'Erreur lors de la suppression' };
  }
}

export async function updateStatus(id: string, table: 'inscriptions_cif', newStatus: string) {
  await checkAdminAuth();
  
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  try {
    const { error } = await supabase.from(table).update({ statut: newStatus }).eq('id', id);
    if (error) throw error;
    
    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating status:', error);
    return { success: false, error: error.message || 'Erreur lors de la mise à jour' };
  }
}

export async function verifyPass(id: string) {
  await checkAdminAuth();
  
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  try {
    // Check if the pass exists in debat
    let tableName = 'inscriptions_debat';
    let { data: passData, error: findError } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !passData) {
      // Check in CIF
      tableName = 'inscriptions_cif';
      const { data: cifData, error: cifError } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
        
      if (cifError || !cifData) {
        return { success: false, error: 'Billet introuvable ou invalide.' };
      }
      passData = cifData;
    }

    // Add a display field for the scanner UI
    passData.is_cif = tableName === 'inscriptions_cif';

    // Check if already scanned
    if (passData.scanne_le) {
      return { 
        success: false, 
        error: `Ce passe a déjà été scanné le ${new Date(passData.scanne_le).toLocaleString('fr-FR')}.`,
        data: passData
      };
    }

    // Mark as scanned
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ scanne_le: new Date().toISOString() })
      .eq('id', id);

    if (updateError) throw updateError;

    revalidatePath('/admin/inscriptions');
    return { success: true, data: passData };
  } catch (error: any) {
    console.error('Error verifying pass:', error);
    return { success: false, error: error.message || 'Erreur lors de la vérification' };
  }
}

export async function validerDelegue(id: string) {
  await checkAdminAuth();
  
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase n'est pas configuré" };
  }

  try {
    // 1. Get delegate info
    const { data: delegue, error: fetchError } = await supabase
      .from('delegues_congres')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !delegue) {
      throw new Error('Délégué introuvable');
    }

    // 2. Update status
    const { error: updateError } = await supabase
      .from('delegues_congres')
      .update({ statut: 'valide' })
      .eq('id', id);

    if (updateError) throw updateError;

    // 3. Send Email
    await sendConfirmationEmail({
      to: delegue.email,
      nom: delegue.nom_prenom,
      eventName: 'Congrès (Délégué)',
      details: delegue
    });

    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    console.error('Error validating delegate:', error);
    return { success: false, error: error.message || 'Erreur lors de la validation' };
  }
}
