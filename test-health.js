#!/usr/bin/env node

/**
 * Script test pentru backend Clinic-Mobila
 * Verifica configurația și conexiunea la DB
 */

require('dotenv').config();
const pool = require('./config/db');

async function runTests() {
  console.log('🧪 Backend Health Check\n');

  // 1. Test variabile mediu
  console.log('1️⃣  Variabile Mediu:');
  const requiredVars = ['DATABASE_URL', 'ADMIN_EMAIL'];
  let envOK = true;
  requiredVars.forEach(v => {
    const val = process.env[v];
    const status = val ? '✅' : '❌';
    console.log(`  ${status} ${v}: ${val ? '✓' : 'MISSING'}`);
    if (!val) envOK = false;
  });

  if (!envOK) {
    console.log('\n⚠️  Unele variabile mediu sunt missing. Completeaza .env\n');
  }

  // 2. Test conexiune DB
  console.log('\n2️⃣  Conexiune Baza de Date:');
  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`  ✅ PostgreSQL conectat. Ora server: ${result.rows[0].now}`);
  } catch (err) {
    console.log(`  ❌ Eroare DB: ${err.message}`);
    console.log('  📝 Asigura-te ca PostgreSQL ruleaza si DATABASE_URL e corect');
  }

  // 3. Test tabel programari
  console.log('\n3️⃣  Tabel Programari:');
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'programari'
    `);
    if (result.rows.length > 0) {
      console.log('  ✅ Tabela programari exista cu coloane:');
      result.rows.forEach(col => {
        console.log(`     - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('  ❌ Tabela programari nu exista!');
      console.log('  📝 Ruleaza: psql clinic_mobila < db-init.sql');
    }
  } catch (err) {
    console.log(`  ❌ Eroare: ${err.message}`);
  }

  // 4. Test SMTP config
  console.log('\n4️⃣  Email Configuration:');
  const smtpVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'ADMIN_EMAIL'];
  let smtpOK = true;
  smtpVars.forEach(v => {
    const val = process.env[v];
    const status = val ? '✅' : '❌';
    const display = v === 'SMTP_PASS' ? (val ? 'SET' : 'MISSING') : (val || 'MISSING');
    console.log(`  ${status} ${v}: ${display}`);
    if (!val) smtpOK = false;
  });

  if (!smtpOK) {
    console.log('  ℹ️  Email optional - configureaza pentru notificari admin');
  }

  // 5. Test controllers
  console.log('\n5️⃣  Controllers:');
  try {
    const ctrl = require('./controllers/programariController');
    console.log(`  ✅ programariController loaded`);
    console.log(`     - createProgramare: ${typeof ctrl.createProgramare}`);
    console.log(`     - getProgramari: ${typeof ctrl.getProgramari}`);
  } catch (err) {
    console.log(`  ❌ Error loading controllers: ${err.message}`);
  }

  // 6. Test routes
  console.log('\n6️⃣  Routes:');
  try {
    const routes = require('./routes/programari');
    console.log(`  ✅ programari routes loaded`);
  } catch (err) {
    console.log(`  ❌ Error loading routes: ${err.message}`);
  }

  console.log('\n✨ Health check complete!\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
