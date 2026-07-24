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

async function checkColumns() {
  console.log('=== TEST DES TABLES POUR LE SCANNER DE QR CODE ===');
  
  const tables = ['inscriptions_debat', 'inscriptions_cif', 'delegues_congres'];

  for (const t of tables) {
    const { data, error } = await supabaseAdmin.from(t).select('id, scanne_le').limit(1);
    if (error) {
      console.log(`❌ Table ${t} : ERREUR (${error.message})`);
      if (error.message.includes('scanne_le')) {
        console.log(`   -> Ajout de la colonne scanne_le à la table ${t}...`);
      }
    } else {
      console.log(`✅ Table ${t} : Colonne scanne_le OK (existant)`);
    }
  }
}

checkColumns();
