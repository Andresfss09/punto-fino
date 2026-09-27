import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Leer .env del frontend
let envContent = '';
try {
  envContent = fs.readFileSync('.env', 'utf8');
} catch (e) {
  console.error('No se pudo leer .env');
  process.exit(1);
}

const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*(.+)/);

const supabaseUrl = urlMatch ? urlMatch[1].trim() : '';
const supabaseKey = keyMatch ? keyMatch[1].trim() : '';

console.log('====================================================');
console.log('🔍 PRUEBA DE CONEXIÓN A SUPABASE · PUNTO FINO');
console.log('====================================================');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseKey ? supabaseKey.substring(0, 20) + '...' : '(Vacía)');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.log('\n⚠️ ESTADO: Las credenciales en el archivo en disco aún tienen los valores por defecto.');
  console.log('👉 Asegúrate de guardar los cambios en "frontend/.env" con (Ctrl + S).');
  process.exit(0);
}

async function testConnection() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('\n1. Probando tabla "services"...');
    const { data: services, error: sErr } = await supabase.from('services').select('*').limit(5);
    if (sErr) {
      console.error('❌ Error en "services":', sErr.message);
    } else {
      console.log(`✅ Tabla "services" conectada con éxito. Registros encontrados: ${services?.length || 0}`);
      services?.forEach(s => console.log(`   - ${s.name} ($${s.price?.toLocaleString('es-CO')})`));
    }

    console.log('\n2. Probando tabla "barbers"...');
    const { data: barbers, error: bErr } = await supabase.from('barbers').select('*').limit(5);
    if (bErr) {
      console.error('❌ Error en "barbers":', bErr.message);
    } else {
      console.log(`✅ Tabla "barbers" conectada con éxito. Registros encontrados: ${barbers?.length || 0}`);
      barbers?.forEach(b => console.log(`   - ${b.name}`));
    }

    console.log('\n3. Probando tabla "appointments"...');
    const { data: appointments, error: aErr } = await supabase.from('appointments').select('*').limit(3);
    if (aErr) {
      console.error('❌ Error en "appointments":', aErr.message);
    } else {
      console.log(`✅ Tabla "appointments" conectada con éxito. Citas registradas: ${appointments?.length || 0}`);
    }

    console.log('\n🎉 ¡CONEXIÓN EXITOSA! Supabase está activo y conectado al frontend.');
  } catch (error) {
    console.error('\n❌ Error de red o credenciales:', error.message);
  }
}

testConnection();
