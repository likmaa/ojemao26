const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncDebatToCif() {
  console.log('=== VERIFICATION DES DÉBATS AVEC PARTICIPER_CIF = OUI ===');
  const { data: debatData } = await supabaseAdmin
    .from('inscriptions_debat')
    .select('*')
    .eq('participer_cif', 'oui');

  const { data: cifData } = await supabaseAdmin.from('inscriptions_cif').select('*');

  console.log(`Trouvé ${debatData ? debatData.length : 0} inscrits au Débat ayant coché CIF = oui.`);

  const existingEmails = new Set((cifData || []).map(r => r.email ? r.email.toLowerCase().trim() : '').filter(Boolean));
  const existingPhones = new Set((cifData || []).map(r => r.whatsapp ? r.whatsapp.replace(/\s+/g, '').replace(/\+/g, '') : '').filter(Boolean));
  const existingNames = new Set((cifData || []).map(r => r.nom_prenom ? r.nom_prenom.toLowerCase().trim() : '').filter(Boolean));

  const toInsert = [];

  for (const d of (debatData || [])) {
    const cleanEmail = d.email ? d.email.toLowerCase().trim() : '';
    const cleanPhone = d.telephone ? d.telephone.replace(/\s+/g, '').replace(/\+/g, '') : '';
    const cleanName = d.nom_prenom ? d.nom_prenom.toLowerCase().trim() : '';

    let isDuplicate = false;
    if (cleanEmail && existingEmails.has(cleanEmail)) isDuplicate = true;
    if (cleanPhone && existingPhones.has(cleanPhone)) isDuplicate = true;
    if (cleanName && existingNames.has(cleanName)) isDuplicate = true;

    if (!isDuplicate) {
      toInsert.push({
        nom_prenom: d.nom_prenom,
        genre: d.genre === 'Femme' ? 'F' : 'M',
        tranche_age: '26_35',
        ville_pays: d.ville_pays || 'Cotonou, Bénin',
        statut: 'En attente de paiement',
        etablissement: d.fonction || d.organisation || d.poste || 'Participant Débat',
        whatsapp: d.telephone || '—',
        email: d.email || '',
        association: d.organisation || 'Inscrit Débat',
        moyen_deplacement: 'bus_car',
        date_arrivee: '24/07/2026',
        date_depart: '28/07/2026',
        comment_connu: 'Via Inscription Débat (Admin)',
      });
    }
  }

  console.log(`Manquants dans la table CIF: ${toInsert.length}`);
  toInsert.forEach(t => console.log(`➕ Sync vers CIF: ${t.nom_prenom} (${t.email || t.whatsapp})`));

  if (toInsert.length > 0) {
    const { data: inserted, error } = await supabaseAdmin.from('inscriptions_cif').insert(toInsert).select();
    if (error) {
      console.error('Erreur lors du sync:', error.message);
    } else {
      console.log(`🎉 SUCCÈS : ${inserted.length} inscrit(s) Débat ont été synchronisés dans la table CIF !`);
    }
  }
}

syncDebatToCif();
