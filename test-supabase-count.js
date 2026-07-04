const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://dauwutgpuexqbnykwcio.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhdXd1dGdwdWV4cWJueWt3Y2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxNzIxOTEsImV4cCI6MjA5ODc0ODE5MX0.47NcRdje-wzLxVlTlbHUIhsAwiFVjEj3LtlA25XTHd4'
);
async function run() {
  const { data, count, error } = await supabase.from('inscriptions_debat').select('*', { count: 'exact' });
  console.log({ data, count, error });
}
run();
