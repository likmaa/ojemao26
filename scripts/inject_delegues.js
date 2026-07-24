const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
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

const candidates = [
  { nom: 'COULIBALY', prenom: 'Lalia Mardiya', carte: '', fonction: 'Participant(e)', contact: '+226 55 63 06 26', email: '', genre: 'F' },
  { nom: 'DAO', prenom: 'Mariame', carte: 'A3300072 du 31/03/25', fonction: 'Commerçante', contact: '+226 74 74 05 25', email: 'daomariame159@gmail.com', genre: 'F' },
  { nom: 'KONKOBO', prenom: 'Souleymane', carte: 'B14964718 du 20/11/2020', fonction: 'Professeur', contact: '+226 56 72 18 12', email: 'konsouley@gmail.com', genre: 'M' },
  { nom: 'LANKOANDE', prenom: 'Banlouan', carte: 'B15175649 du 20/08/2020', fonction: 'Entrepreneur', contact: '+226 57 72 51 13', email: 'mahmoudlankoande@gmail.com', genre: 'M' },
  { nom: 'NANA', prenom: 'Issa', carte: 'B18491586 du 17/07/2023', fonction: 'Professeur', contact: '+226 76 79 76 40', email: 'issanana756@gmail.com', genre: 'M' },
  { nom: 'OUEDRAOGO', prenom: 'Abdoul Aziz', carte: 'B11186308 du 12/04/2019', fonction: 'Logisticien', contact: '+226 72 38 35 60', email: 'oued3999@gmail.com', genre: 'M' },
  { nom: 'OUEDRAOGO', prenom: 'Cheick Oumar', carte: 'B10478785 du 13/08/2018', fonction: 'Professeur', contact: '+226 76 13 12 60', email: 'cheikh.oumar305@gmail.com', genre: 'M' },
  { nom: 'OUEDRAOGO', prenom: 'Mahamadi', carte: 'B14520692 du 20/06/2020', fonction: 'Médecin', contact: '+226 72 98 89 56', email: 'ouedraogomahamadi134@gmail.com', genre: 'M' },
  { nom: 'OUEDRAOGO', prenom: 'Mariam', carte: '', fonction: 'Participant(e)', contact: '+226 78 03 11 89', email: '', genre: 'F' },
  { nom: 'OUILY', prenom: 'Abdoul Fatahou', carte: 'B13045637 du 10/03/2020', fonction: 'Inspecteur', contact: '+226 76 60 71 20', email: 'ouiabdfatahou@gmail.com', genre: 'M' },
  { nom: 'SANFO', prenom: 'Amina Fadila', carte: '', fonction: 'Participant(e)', contact: '', email: '', genre: 'F' },
  { nom: 'SANOGO', prenom: 'Fati', carte: 'B12794383 du 13/07/2020', fonction: 'Participant(e)', contact: '+226 76 04 98 19', email: '', genre: 'F' },
  { nom: 'SAVADOGO', prenom: 'Yassia', carte: 'B13579726 du 22/09/2021', fonction: 'Enseignant', contact: '+226 77 12 43 47', email: 'lesage654@gmail.com', genre: 'M' },
  { nom: 'SODRE', prenom: 'Ali', carte: 'B19274153 du 04/12/2023', fonction: 'Etudiant', contact: '+226 76 15 50 42', email: 'badraalisodre@gmail.com', genre: 'M' },
  { nom: 'SORE', prenom: 'Bachirou', carte: '', fonction: 'Participant(e)', contact: '', email: '', genre: 'M' },
  { nom: 'TASSEMBEDO', prenom: 'Mohamadi', carte: 'B12829635', fonction: 'Etudiant', contact: '+226 72 70 96 84', email: '', genre: 'M' },
  { nom: 'TIENDREBEOGO', prenom: 'Idrissa', carte: 'B22015994 du 21/07/2025', fonction: 'Commerçant', contact: '+226 70 76 99 38', email: 'idrissakambo@gmail.com', genre: 'M' },
  { nom: 'TRAORE', prenom: 'Issouf', carte: 'B20285095 du 11/10/2024', fonction: 'Fonctionnaire', contact: '+226 71 19 24 24', email: 'issouftraorem@gmail.com', genre: 'M' },
  { nom: 'TRAORE', prenom: 'Pélagie', carte: 'B20119377 du 10/09/2024', fonction: 'Participant(e)', contact: '+226 64 42 02 19', email: '', genre: 'F' },
  { nom: 'WEDA', prenom: 'Karim', carte: 'A3383579 du 27/01/2024', fonction: 'Gestionnaire conflit', contact: '+226 70 54 86 86', email: 'wedakarim77@gmail.com', genre: 'M' },
  { nom: 'BANDE', prenom: 'Mme', carte: '', fonction: 'Participant(e)', contact: '', email: '', genre: 'F' }
];

async function updateCifFunctions() {
  console.log('=== MISE À JOUR DES FONCTIONS DANS INSCRIPTIONS_CIF ===');
  
  for (const c of candidates) {
    const fullName = `${c.nom} ${c.prenom}`.trim();
    const { data, error } = await supabaseAdmin
      .from('inscriptions_cif')
      .update({ etablissement: c.fonction })
      .eq('nom_prenom', fullName)
      .select();

    if (error) {
      console.error(`Erreur pour ${fullName}:`, error.message);
    } else {
      console.log(`✅ ${fullName} -> Établissement/Fonction mis à jour: "${c.fonction}"`);
    }
  }
}

updateCifFunctions();
