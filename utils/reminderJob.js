const cron = require('node-cron');
const pool = require('../config/db');
const sendEmail = require('./sendEmail');

/**
 * Job care rulează zilnic și trimite remindere pentru programările
 * care sunt mâine sau azi (în funcție de configurație).
 */
function startReminderJob(options = {}) {
  const schedule = options.schedule || '0 8 * * *'; // 08:00 în fiecare zi
  const tz = options.timezone || 'Europe/Bucharest';

  try {
    cron.schedule(schedule, async () => {
      console.log('[reminderJob] Verific programări pentru remindere...');

      const query = `
        SELECT * FROM programari
        WHERE status IN ('pending', 'confirmed')
          AND (
            data = CURRENT_DATE
            OR data = CURRENT_DATE + INTERVAL '1 day'
          )
      `;

      try {
        const { rows } = await pool.query(query);
        if (!rows || rows.length === 0) {
          console.log('[reminderJob] Niciun reminder de trimis.');
          return;
        }

        for (const p of rows) {
          if (!p.email) continue;

          const when = (new Date(p.data)).toLocaleDateString();
          const subject = `Reminder programare - Clinica Mobila`;
          const text = `Bună ${p.nume} ${p.prenume},\n\nAceasta este o reamintire pentru programarea ta pentru ${p.specialitate} cu ${p.medic} programată pentru data ${p.data} la ora ${p.ora}.\n\nDacă trebuie să anulezi sau modifici, contactează-ne.\n\nMulțumim,\nEchipa Clinica Mobila`;

          sendEmail({ to: p.email, subject, text }).catch(err => console.error('[reminderJob] Eroare trimitere email:', err.message));
        }

      } catch (err) {
        console.error('[reminderJob] Eroare la interogare:', err.message);
      }
    }, { timezone: tz });

    console.log(`[reminderJob] Programat la '${schedule}' timezone='${tz}'`);
  } catch (err) {
    console.error('[reminderJob] Nu am putut porni job-ul:', err.message);
  }
}

module.exports = { startReminderJob };
