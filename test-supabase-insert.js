const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://dauwutgpuexqbnykwcio.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdXd1dGdwdWV4cWJueWt3Y2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzIxOTEsImV4cCI6MjA5ODc0ODE5MX0.47NcRdje-wzLxVlTlbHUIhsAwiFVjEj3LtlA25XTHd4'
);
async function run() {
  const { data, error } = await supabase.from('inscriptions_debat').insert([{
    nom_prenom: "Test Insert",
    genre: "M",
    organisation: "Test Org",
    fonction: "Test",
    type_participant: "etudiant",
    ville_pays: "Paris",
    telephone: "12345",
    email: "test@test.com",
    participer_cif: "oui"
  }]).select();
  console.log({ data, error });
}
run();
