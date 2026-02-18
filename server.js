// CommonJS
require('dotenv').config();
const express = require("express");
const cors = require("cors");

// Import routes
const programariRoutes = require("./routes/programari");
const adminRoutes = require("./routes/admin");
const { startReminderJob } = require('./utils/reminderJob');

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://clinicmobila.netlify.app',
  'https://clinic-mobila.onrender.com',
  'https://emanuel-cioburciu.md',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (like curl, mobile apps)
    if (!origin) {
      return callback(null, true);
    }
    
    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all *.onrender.com domains in production
    if (process.env.NODE_ENV === 'production' && origin.includes('.onrender.com')) {
      return callback(null, true);
    }

    // Log CORS rejection in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️  CORS request from: ${origin}`);
      // Allow all in development
      return callback(null, true);
    }
    
    console.warn(`❌ CORS blocked from: ${origin}`);
    callback(new Error('CORS not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// --- Routes ---
app.use('/api/programari', programariRoutes);
app.use('/api/admin', adminRoutes);

// --- Health Check Endpoint ---
app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server funcționează!", 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// --- Healthcheck para Render ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ 
    message: "Ruta nu există", 
    path: req.path,
    method: req.method 
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    message: "Eroare server",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║ 🏥 CLINIC MOBILA BACKEND              ║
║────────────────────────────────────────║
║ ✅ Server portat pe PORT ${PORT}          ${PORT > 9 ? '' : ' '}
║ 🌍 Environment: ${process.env.NODE_ENV || 'development'}
║ 📍 Backend URL: ${process.env.BACKEND_URL || `http://localhost:${PORT}`}
║ 🎯 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
║════════════════════════════════════════╝
  `);
  // Pornește job-ul de remindere (dacă este configurat)
  try {
    startReminderJob();
  } catch (err) {
    console.error('❌ Eroare la pornirea reminder job:', err.message);
  }
});

// Graceful shutdown (important pentru Render)
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido. Cerrando gracefully...');
  server.close(() => {
    console.log('✅ Server inchis');
    process.exit(0);
  });
});
