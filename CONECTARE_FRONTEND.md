# 🔗 Conectează Frontend la Backend Render

Ghid pentru a conecta aplicația React (Frontend) pe Render cu Backend-ul pe Render.

---

## 📝 Frontend Setup

### 1. Actualizează `.env` (Frontend)

Fișierul `frontend/.env` (sau `.env.production`):

```env
REACT_APP_BACKEND_URL=https://clinic-mobila-backend.onrender.com
```

**Obs:** 
- Local development: `http://localhost:3000`
- Production (Render): `https://clinic-mobila-backend.onrender.com`

### 2. Asigură-te că Fetch URL e corect

În fișierul `src/pages/Programare.jsx`:

```javascript
// ✅ Trebuie să fie:
const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/programari`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});

// ❌ NU:
const response = await fetch('http://localhost:3000/api/programari', {...})
```

### 3. Deploy Frontend pe Render

#### Opțiunea A: Render.yaml (Recomanda)

Crea `frontend/render.yaml`:

```yaml
services:
  - type: web
    name: clinic-mobila-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: build
    envVars:
      - key: REACT_APP_BACKEND_URL
        value: https://clinic-mobila-backend.onrender.com
```

#### Opțiunea B: Manual via Dashboard

1. **Render Dashboard → New +** → **Static Site**
2. **Conectează GitHub** → selectează repo
3. **Configurare:**
   ```
   Name:               clinic-mobila-frontend
   Build Command:      npm run build
   Publish Directory:  build
   ```
4. **Environment Variables:**
   ```
   REACT_APP_BACKEND_URL = https://clinic-mobila-backend.onrender.com
   ```
5. **Create Static Site**

---

## 🔗 CORS Configuration

Backend-ul trebuie să accepte requesturi din Frontend. Verifică `server.js`:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://clinic-mobila.onrender.com',  // Frontend URL
  process.env.FRONTEND_URL
];
```

Asigură-te că **Frontend URL pe Render e în lista CORS!**

---

## 🧪 Test Conexiune

### 1. Test Backend Health

```bash
# Trebui să returneze 200 OK
curl https://clinic-mobila-backend.onrender.com/health
```

### 2. Test API Call

```bash
curl -X POST https://clinic-mobila-backend.onrender.com/api/programari \
  -H "Content-Type: application/json" \
  -d '{"nume":"Test","prenume":"User",...}'
```

### 3. Check Browser Console

Frontend în Render → Open in Browser
- Deschide DevTools (F12)
- Network tab → Post /api/programari
- Verifica response + headers

---

## 🚨 Troubleshooting

### CORS Error: "Access-Control-Allow-Origin"

**Cauza:** Frontend URL nu e în CORS whitelist

**Soluție:**
1. Mergi Dashboard → clinic-mobila-backend
2. Environment → Add `FRONTEND_URL`
3. Valoare: `https://clinic-mobila.onrender.com` (exact URL-ul din browser)
4. Redeploy

### 404 "Cannot POST /api/programari"

**Cauza:** Backend URL incorect

**Soluție:**
1. Frontend: `env.example`:
   ```
   REACT_APP_BACKEND_URL=https://clinic-mobila-backend.onrender.com
   ```
2. Rebuild & redeploy frontend

### "ERR_FETCH_FAILED"

**Cauza:** Backend nu e live

**Soluție:**
1. Check Dashboard → clinic-mobila-backend
2. Status trebuie verde (Live)
3. Verify logs pentru erori
4. Test: `curl https://clinic-mobila-backend.onrender.com`

---

## 📡 Network Flow

```
BROWSER (clinic-mobila.onrender.com)
    ↓
    XMLHttpRequest / fetch()
    ↓
POST /api/programari
    ↓
CORS Check ← (check FRONTEND_URL)
    ↓
BACKEND (clinic-mobila-backend.onrender.com)
    ↓
Database (PostgreSQL Render)
    ↓
Email (SMTP)
    ↓
RESPONSE →  FRONTEND
```

---

## 🔐 Environment Variables Overview

### Backend (Render)
```
DATABASE_URL = postgresql://...
BACKEND_URL = https://clinic-mobila-backend.onrender.com
FRONTEND_URL = https://clinic-mobila.onrender.com ← UPDATE THIS
SMTP_* = Gmail credentials
NODE_ENV = production
```

### Frontend (Render)
```
REACT_APP_BACKEND_URL = https://clinic-mobila-backend.onrender.com
```

---

## ✅ Deployment Checklist

- [ ] Backend deployed pe Render (Live status)
- [ ] PostgreSQL database inițializat
- [ ] Email (SMTP) configurat
- [ ] Frontend `.env` cu correct BACKEND_URL
- [ ] Frontend build succesful
- [ ] CORS whitelist include Frontend URL
- [ ] Test curl POST /api/programari
- [ ] Test browser form submit
- [ ] Verifică primire email notificare
- [ ] Check logs pentru erori

---

## 🎯 Final URLs

```
Frontend:  https://clinic-mobila.onrender.com
Backend:   https://clinic-mobila-backend.onrender.com
Database:  dpg-xxxxxxx.oregon-postgres.render.com
API Base:  https://clinic-mobila-backend.onrender.com/api
```

---

## 📊 Testing Matrix

| Endpoint | Method | Expected | Status |
|----------|--------|----------|--------|
| `/health` | GET | `{"status":"OK"}` | 200 |
| `/` | GET | Status message | 200 |
| `/api/programari` | GET | Array of appointments | 200 |
| `/api/programari` | POST | New appointment | 201 |

---

**Frontend și Backend sunt acum conectate pe Render!** 🎉
