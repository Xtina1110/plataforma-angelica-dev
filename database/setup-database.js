/**
 * Script para crear todas las tablas en Supabase
 * Ejecutar con: node database/setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const supabaseUrl = 'https://kolciyzkuvcwzegsomww.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbGNpeXprdXZjd3plZ3NvbXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODY0NTAsImV4cCI6MjA2NjM2MjQ1MH0.n6HbwCXo3lGW9gBSAUAbOufZf9UBmEvkeEX891dnswg';

// IMPORTANTE: Para ejecutar SQL DDL necesitamos la service_role key
// La anon key solo permite operaciones de datos, no DDL
console.log('⚠️  IMPORTANTE: Este script requiere la SERVICE_ROLE_KEY de Supabase');
console.log('⚠️  La anon key no tiene permisos para crear tablas');
console.log('');
console.log('📋 INSTRUCCIONES:');
console.log('1. Ve a tu proyecto en Supabase Dashboard');
console.log('2. Settings → API → Project API keys');
console.log('3. Copia la "service_role" key (⚠️ NO la compartas públicamente)');
console.log('4. Ejecuta: SERVICE_ROLE_KEY=tu_key node database/setup-database.js');
console.log('');
console.log('O mejor aún:');
console.log('1. Ve a Supabase Dashboard → SQL Editor');
console.log('2. Copia el contenido de database/schema.sql');
console.log('3. Pégalo y ejecuta "Run"');
console.log('');

// Verificar si se proporcionó la service_role key
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.log('❌ No se proporcionó SERVICE_ROLE_KEY');
  console.log('');
  console.log('🔧 SOLUCIÓN MÁS FÁCIL:');
  console.log('1. Abre: https://supabase.com/dashboard/project/kolciyzkuvcwzegsomww/sql/new');
  console.log('2. Copia el contenido de: database/schema.sql');
  console.log('3. Pégalo en el editor SQL');
  console.log('4. Click en "Run"');
  console.log('');
  process.exit(1);
}

// Crear cliente con service_role key
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  try {
    console.log('🚀 Iniciando configuración de base de datos...\n');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Archivo SQL cargado:', sqlPath);
    console.log('📏 Tamaño:', sql.length, 'caracteres\n');

    // Dividir el SQL en statements individuales
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log('📊 Total de statements a ejecutar:', statements.length, '\n');

    // Ejecutar cada statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Mostrar progreso
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');
      console.log(`[${i + 1}/${statements.length}] Ejecutando: ${preview}...`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log('  ❌ Error:', error.message);
          errorCount++;
        } else {
          console.log('  ✅ OK');
          successCount++;
        }
      } catch (err) {
        console.log('  ❌ Error:', err.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMEN:');
    console.log('✅ Exitosos:', successCount);
    console.log('❌ Errores:', errorCount);
    console.log('📝 Total:', statements.length);
    console.log('='.repeat(50) + '\n');

    if (errorCount === 0) {
      console.log('🎉 ¡Base de datos configurada exitosamente!');
    } else {
      console.log('⚠️  Algunos statements fallaron. Revisa los errores arriba.');
    }

  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar
setupDatabase();

