# ⚡ Quick Reference - Local vs Render

## 🏠 LOCAL Development

```bash
# Setup
npm install
cp .env.example .env

# .env local:
DATABASE_URL=postgresql://postgres:password@localhost:5432/clinic_mobila
PORT=3000
NODE_ENV=development
BACKEND_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

**Start:**
```bash
npm start
```

**URLs:**
- Backend: `http://localhost:3000`
- Database: `postgresql://localhost:5432/clinic_mobila`
- Health: `http://localhost:3000/`

**Test:**
```bash
curl http://localhost:3000/
# {"status":"OK","message":"Server funcționează!"}
```

---

## 🚀 RENDER Deployment

```
Dashboard: https://dashboard.render.com
```

### Database Setup

**PostgreSQL Connection String:**
```
postgresql://clinic_user:PASSWORD@dpg-xxxxxxx.oregon-postgres.render.com/clinic_mobila
```

**Inițializare schema:**
```bash
psql postgresql://clinic_user:PASSWORD@dpg-xxxxxxx.oregon-postgres.render.com/clinic_mobila < db-init.sql
```

### Web Service URLs

**After Deploy:**
- Backend: `https://clinic-mobila-backend.onrender.com`
- Health: `https://clinic-mobila-backend.onrender.com/health`
- API: `https://clinic-mobila-backend.onrender.com/api/programari`

### Environment Variables (Render Dashboard)

| Variabilă | Valoare |
|-----------|---------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://clinic_user:PASSWORD@dpg-xxxxxxx.oregon-postgres.render.com/clinic_mobila` |
| `BACKEND_URL` | `https://clinic-mobila-backend.onrender.com` |
| `FRONTEND_URL` | `https://clinic-mobila.onrender.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your-email@gmail.com` |
| `SMTP_PASS` | `xxxx xxxx xxxx xxxx` |
| `ADMIN_EMAIL` | `admin@clinicmobila.md` |

---

## 🔄 Update Backend pe Render

```bash
# Local changes
git add .
git commit -m "Update backend"
git push origin main

# Render detectează push automat
# Dashboard → Services → clinic-mobila-backend
# Status: Deploying... → Live (verde)
```

---

## 🧪 Test API Endpoints

### POST - Crează programare

**Local:**
```bash
curl -X POST http://localhost:3000/api/programari \
  -H "Content-Type: application/json" \
  -d '{
    "nume": "Popescu",
    "prenume": "Ion",
    "specialitate": "Cardiologie",
    "medic": "Mihail Curudimov",
    "data": "2026-03-15",
    "ora": "10:30",
    "telefon": "+37369123456",
    "email": "ion@gmail.com",
    "motiv": "Inspecție cardiacă",
    "mesaj": "Pacient diabetic"
  }'
```

**Render:**
```bash
curl -X POST https://clinic-mobila-backend.onrender.com/api/programari \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### GET - Listează programări

**Local:**
```bash
curl http://localhost:3000/api/programari
```

**Render:**
```bash
curl https://clinic-mobila-backend.onrender.com/api/programari
```

---

## 📊 Database Comparison

| Aspect | Local | Render |
|--------|-------|--------|
| **Type** | PostgreSQL local | PostgreSQL Render |
| **Host** | `localhost` | `dpg-xxxxxxx.oregon-postgres.render.com` |
| **Port** | `5432` | `5432` |
| **SSL** | Optional | Required (enforced) |
| **Backup** | Manual | Optional (paid plans) |
| **Access** | Local network | Internet + credentials |

---

## 🔒 Security Checklist

- ✅ `.env` is in `.gitignore` - nu se commit-ează
- ✅ PASSWORD në DATABASE_URL - nu e în repo
- ✅ SMTP_PASS - nu se log-ează in Render
- ✅ HTTPS - automat pe Render
- ✅ SSL Database - enforced pe Render
- ✅ CORS Whitelist - doar domenii permise

---

## ⚡ Performance Notes

**Local:**
- Instant response (no latency)
- Good for development
- Reset database anytime

**Render:**
- ~100-200ms latency (network)
- Auto-scaling on paid plans
- Database backups available
- Built-in monitoring

---

## 📞 Render Status

- Dashboard: https://dashboard.render.com
- Status Page: https://status.render.com
- Logs: Dashboard → Service → Logs

---

## 🎯 Workflow

### Development (Local)
```bash
npm start
# Test localhost:3000
# Edit code
# Commit changes
```

### Production (Render)
```bash
git push origin main
# Render auto-detects
# Triggers build & deploy
# Monitor at dashboard.render.com
```

---

## ✨ Common Tasks

### Change Frontend URL on Render
```
Dashboard → Services → clinic-mobila-backend
→ Environment → Edit FRONTEND_URL
→ Save & auto-redeploy
```

### Check Server Logs
```
Dashboard → Services → clinic-mobila-backend → Logs
Search for: "Server portat", "SMTP", "Error"
```

### Restart Server
```
Dashboard → Services → clinic-mobila-backend
→ Top-right menu → Restart
```

### Reset Database
```
Dashboard → Databases → clinic-mobila-db
→ Delete & Recreate
→ Rerun db-init.sql
```

---

**Ready to deploy!** 🚀
