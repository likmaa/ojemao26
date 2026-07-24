'use server';

import { supabase, supabaseAdmin, isSupabaseConfigured } from './supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { sendConfirmationEmail } from './mailer';

// ============================================================
// Vérification auth admin
// ============================================================
async function checkAdminAuth() {
  const adminAuth = (await cookies()).get('admin_authenticated')?.value;
  if (adminAuth !== 'true') {
    throw new Error('Non autorisé');
  }
}

// ============================================================
// INSCRIPTIONS — Delete
// ============================================================
export async function deleteInscription(id: string, table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres') {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la suppression' };
  }
}

// ============================================================
// INSCRIPTIONS — Update status
// ============================================================
export async function updateStatus(id: string, table: 'inscriptions_cif', newStatus: string) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    const { error } = await supabaseAdmin.from(table).update({ statut: newStatus }).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la mise à jour' };
  }
}

// ============================================================
// INSCRIPTIONS — Update generic fields
// ============================================================
export async function updateInscription(
  id: string,
  table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres',
  data: Record<string, any>
) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    const { id: _id, created_at: _created_at, scanne_le: _scanne_le, ...updateFields } = data;
    const { error } = await supabaseAdmin.from(table).update(updateFields).eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la modification' };
  }
}

// ============================================================
// INSCRIPTIONS — Create participant manually by admin
// ============================================================
export async function addInscriptionByAdmin(
  table: 'inscriptions_debat' | 'inscriptions_cif' | 'delegues_congres',
  data: Record<string, any>
) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    // For debate table, calculate numero_chaise if not explicitly set
    if (table === 'inscriptions_debat' && !data.numero_chaise) {
      const { count } = await supabaseAdmin
        .from('inscriptions_debat')
        .select('*', { count: 'exact', head: true });
      data.numero_chaise = (count || 0) + 1;
    }

    const { data: inserted, error } = await supabaseAdmin.from(table).insert([data]).select();
    if (error) throw error;

    revalidatePath('/admin/inscriptions');
    return { success: true, data: inserted?.[0] };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de l'ajout du participant" };
  }
}

// ============================================================
// INSCRIPTIONS — Upload photo from admin edit modal
// ============================================================
export async function uploadInscriptionPhoto(formData: FormData) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: "Fichier invalide" };
    }
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `admin_photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    
    const { data, error } = await supabaseAdmin.storage.from('badges').upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
    if (error) throw error;

    const { data: publicUrlData } = supabaseAdmin.storage.from('badges').getPublicUrl(fileName);
    return { success: true, url: publicUrlData.publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de l'envoi de la photo" };
  }
}

// ============================================================
// SCAN QR — Vérifier un passe
// ============================================================
export async function verifyPass(id: string) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    let tableName = 'inscriptions_debat';
    let { data: passData, error: findError } = await supabase
      .from(tableName).select('*').eq('id', id).single();

    if (findError || !passData) {
      tableName = 'inscriptions_cif';
      const { data: cifData, error: cifError } = await supabase
        .from(tableName).select('*').eq('id', id).single();
      if (cifError || !cifData) {
        return { success: false, error: 'Billet introuvable ou invalide.' };
      }
      passData = cifData;
    }

    passData.is_cif = tableName === 'inscriptions_cif';

    if (passData.scanne_le) {
      return {
        success: false,
        error: `Ce passe a déjà été scanné le ${new Date(passData.scanne_le).toLocaleString('fr-FR')}.`,
        data: passData
      };
    }

    const { error: updateError } = await supabaseAdmin
      .from(tableName).update({ scanne_le: new Date().toISOString() }).eq('id', id);
    if (updateError) throw updateError;

    revalidatePath('/admin/inscriptions');
    return { success: true, data: passData };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la vérification' };
  }
}

// ============================================================
// DÉLÉGUÉS — Valider et envoyer email
// ============================================================
export async function validerDelegue(id: string) {
  await checkAdminAuth();
  if (!isSupabaseConfigured()) return { success: false, error: "Supabase n'est pas configuré" };
  try {
    const { data: delegue, error: fetchError } = await supabase
      .from('delegues_congres').select('*').eq('id', id).single();
    if (fetchError || !delegue) throw new Error('Délégué introuvable');

    const { error: updateError } = await supabaseAdmin
      .from('delegues_congres').update({ statut: 'valide' }).eq('id', id);
    if (updateError) throw updateError;

    await sendConfirmationEmail({
      to: delegue.email,
      nom: delegue.nom_prenom,
      eventName: 'Congrès (Délégué)',
      details: delegue
    });

    revalidatePath('/admin/inscriptions');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Erreur lors de la validation' };
  }
}

// ============================================================
// HÉBERGEMENTS
// ============================================================
export async function adminSaveAccommodation(data: {
  id?: string; name: string; description: string; distance: string;
}) {
  await checkAdminAuth();
  if (data.id) {
    const { error } = await supabaseAdmin.from('accommodations')
      .update({ name: data.name, description: data.description, distance: data.distance })
      .eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('accommodations')
      .insert([{ name: data.name, description: data.description, distance: data.distance }]);
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function adminDeleteAccommodation(id: string) {
  await checkAdminAuth();
  const { error } = await supabaseAdmin.from('accommodations').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// ============================================================
// CONTACTS
// ============================================================
export async function adminSaveContact(data: {
  id?: string; label: string; value: string; icon_type: string;
}) {
  await checkAdminAuth();
  if (data.id) {
    const { error } = await supabaseAdmin.from('contacts')
      .update({ label: data.label, value: data.value, icon_type: data.icon_type })
      .eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('contacts')
      .insert([{ label: data.label, value: data.value, icon_type: data.icon_type }]);
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function adminDeleteContact(id: string) {
  await checkAdminAuth();
  const { error } = await supabaseAdmin.from('contacts').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// ============================================================
// POINTS FOCAUX
// ============================================================
export async function adminSaveFocalPoint(data: {
  id?: string; country: string; flag: string; name: string; phone: string; wa: string; email?: string;
}) {
  await checkAdminAuth();
  const payload = {
    country: data.country, flag: data.flag, name: data.name,
    phone: data.phone, wa: data.wa, email: data.email || null,
  };
  if (data.id) {
    const { error } = await supabaseAdmin.from('focal_points').update(payload).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('focal_points').insert([payload]);
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function adminDeleteFocalPoint(id: string) {
  await checkAdminAuth();
  const { error } = await supabaseAdmin.from('focal_points').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// ============================================================
// INTERVENANTS (speakers)
// ============================================================
export async function adminSaveSpeaker(data: {
  id?: string; nom: string; titre: string; bio: string; photo_url?: string; pays?: string; ordre?: number;
}) {
  await checkAdminAuth();
  const payload = {
    nom: data.nom, titre: data.titre, bio: data.bio,
    photo_url: data.photo_url || null, pays: data.pays || null, ordre: data.ordre ?? 0,
  };
  if (data.id) {
    const { error } = await supabaseAdmin.from('speakers').update(payload).eq('id', data.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('speakers').insert([payload]);
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function adminDeleteSpeaker(id: string) {
  await checkAdminAuth();
  const { error } = await supabaseAdmin.from('speakers').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

// ============================================================
// ÉVÉNEMENTS
// ============================================================
export async function adminSaveEvent(data: { id?: string; [key: string]: any; }) {
  await checkAdminAuth();
  const { id, ...payload } = data;
  if (id) {
    const { error } = await supabaseAdmin.from('events').update(payload).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabaseAdmin.from('events').insert([payload]);
    if (error) return { error: error.message };
  }
  return { success: true };
}

// ============================================================
// GESTION DES UTILISATEURS ADMIN (Rôles)
// ============================================================

async function hashPassword(password: string): Promise<string> {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(password + (process.env.ADMIN_PASSWORD || '') + 'ojemao_salt').digest('hex');
}

export async function createAdminUser(data: { username: string; password: string; role: 'admin' | 'hebergement' }) {
  await checkAdminAuth();
  const hash = await hashPassword(data.password);
  const { error } = await supabaseAdmin.from('admin_users').insert([{
    username: data.username.trim().toLowerCase(),
    password_hash: hash,
    role: data.role,
  }]);
  if (error) return { error: error.code === '23505' ? "Ce nom d'utilisateur existe déjà." : error.message };
  return { success: true };
}

export async function updateAdminUser(data: { id: string; username: string; role: 'admin' | 'hebergement'; password?: string }) {
  await checkAdminAuth();
  const payload: Record<string, any> = { username: data.username.trim().toLowerCase(), role: data.role };
  if (data.password) payload.password_hash = await hashPassword(data.password);
  const { error } = await supabaseAdmin.from('admin_users').update(payload).eq('id', data.id);
  if (error) return { error: error.code === '23505' ? "Ce nom d'utilisateur existe déjà." : error.message };
  return { success: true };
}

export async function deleteAdminUser(id: string) {
  await checkAdminAuth();
  const { error } = await supabaseAdmin.from('admin_users').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function authenticateWithRole(username: string, password: string) {
  const hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, role')
    .eq('username', username.trim().toLowerCase())
    .eq('password_hash', hash)
    .single();

  if (error || !data) return { success: false, error: 'Identifiants incorrects.' };

  const cookieStore = await cookies();
  const opts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' as const, maxAge: 60 * 60 * 24 * 7 };
  cookieStore.set('admin_authenticated', 'true', opts);
  cookieStore.set('admin_role', data.role, opts);
  cookieStore.set('admin_username', data.username, opts);

  return { success: true, role: data.role };
}
