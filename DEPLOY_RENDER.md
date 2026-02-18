# 🚀 Deploy Clinic-Mobila Backend pe Render

Introducere completă pentru deploy pe [Render.com](https://render.com)

## 📋 Step-by-Step Setup

### 1️⃣ Crează cont Render
- Mergi pe [render.com](https://render.com)
- Înregistrează-te cu GitHub (recomanda se pentru auto-deploy)
- Conectează GitHub account

### 2️⃣ Creează PostgreSQL Database pe Render

1. **Dashboard → New +** → **PostgreSQL**
2. **Configurare:**
   - **Name**: `clinic-mobila-db`
   - **Database**: `clinic_mobila`
   - **User**: `clinic_user`
   - **Region**: `Oregon` (sau cea mai apropiată de tine)
   - **Plan**: `Free` (măcar pentru start)
3. **Create Database**
4. ⏳ **Așteaptă** ~2 min să se inițializeze
5. **Copiază Connection String** din `Connections`:
   ```
   postgresql://clinic_user:PASSWORD@dpg-xxx.oregon-postgres.render.com/clinic_mobila
   ```

### 3️⃣ Inițializează Schema DB

După ce DB-ul e creat:

```bash
# Copiază connection string de mai sus
export RENDER_DB_URL="postgresql://clinic_user:PASSWORD@dpg-xxx.oregon-postgres.render.com/clinic_mobila"

# Rulează schema init
psql $RENDER_DB_URL < db-init.sql
```

Sau din Render Dashboard → Database → Query Editor → Copy & paste conținutul din `db-init.sql`

### 4️⃣ Creează Web Service (Backend)

1. **Dashboard → New +** → **Web Service**
2. **Conectează GitHub**:
   - Selectează repo-ul `clinic-mobila`
   - Alege branch: `main`
3. **Configurare Service:**
   ```
   Name:              clinic-mobila-backend
   Environment:       Node
   Build Command:     npm install
   Start Command:     npm start
   Plan:              Free
   Region:            Oregon
   ```
4. **Environment Variables**:
   
   Adaugă manual:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgresql://clinic_user:PASSWORD@dpg-xxx.oregon-postgres.render.com/clinic_mobila` |
   | `BACKEND_URL` | `https://clinic-mobila-backend.onrender.com` |
   | `FRONTEND_URL` | `https://your-frontend.onrender.com` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | `your-email@gmail.com` |
   | `SMTP_PASS` | `xxxx xxxx xxxx xxxx` (App Password) |
   | `ADMIN_EMAIL` | `admin@clinicmobila.md` |

5. **Create Web Service**
6. ⏳ **Așteaptă deploy** (~3-5 min)

### 5️⃣ Test Backend

După deploy, ar trebui să găsești URL-ul:
```
https://clinic-mobila-backend.onrender.com
```

**Test:**
```bash
curl https://clinic-mobila-backend.onrender.com/

# Răspuns așteptat:
# {"status":"OK","message":"Server funcționează!","timestamp":"..."}
```

**Test POST:**
```bash
curl -X POST https://clinic-mobila-backend.onrender.com/api/programari \
  -H "Content-Type: application/json" \
  -d '{
    "nume": "Test",
    "prenume": "Render",
    "specialitate": "Cardiologie",
    "medic": "Mihail Curudimov",
    "data": "2026-03-15",
    "ora": "10:30",
    "telefon": "+37369123456",
    "email": "test@gmail.com",
    "motiv": "Test"
  }'

# Răspuns așteptat:
# {"message":"Programarea a fost trimisă cu succes!","data":{...}}
```

---

## 🔗 Actualizează Frontend

Acum că backend-ul e pe Render, actualizează frontend-ul:

**În `.env` de frontend:**
```env
REACT_APP_BACKEND_URL=https://clinic-mobila-backend.onrender.com
```

**Redeploy frontend** (dacă e și pe Render)

---

## ⚙️ Configurare Render (alternativ - manual via Dashboard)

Dacă nu vrei să folosești `render.yaml`:

1. **New Web Service**
2. **Connect GitHub repository**
3. **Configurare manuală în Dashboard** (ca mai sus)
4. **Environment → Environment Variables**

---

## 🔒 Gmail App Password Setup

Backend-ul trimite notificări email. Iată cum:

1. **Google Account → Security** ([myaccount.google.com/security](https://myaccount.google.com/security))
2. **2-Step Verification** - activează dacă nu e deja
3. **App passwords** → selectează "Mail" și "Windows Computer"
4. Google generate o parolă: `xxxx xxxx xxxx xxxx`
5. **Copiază aceasta in `SMTP_PASS`** pe Render

---

## 📊 Status Checks

**Render Dashboard → Services →  clinic-mobila-backend:**
- ✅ **Build Status**: `Success` (verde)
- ✅ **Status**: `Live` (verde)
- ✅ **Health**: `OK` (verde)

**Logs** (dacă ceva nu merge):
```
Render Dashboard → Services → clinic-mobila-backend → Logs
```

Cauta:
- ✅ `Server pornit pe PORT 3000`
- ✅ `SMTP conectat cu succes`
- ❌ `Eroare` = verifică .env vars

---

## 🚨 Troubleshooting

### "Build Failed"
```
→ Verifică package.json - toate deps sunt instalate
→ Verifică node version (trebuie 16+)
→ Check Render Logs
```

### "Deploy Failed"
```
→ Verifică DATABASE_URL - trebuie corect copiat
→ Verifică PORT - Render setează automat
→ Check Node version în render.yaml
```

### "Cannot connect to database"
```
→ DATABASE_URL incorect? (copy paste exact din Render PostgreSQL Connection String)
→ DB-ul e în alt Region decât Web Service?
→ Schema nu e inițializată? (db-init.sql)
```

### "Email nu se trimite"
```
→ SMTP_USER și SMTP_PASS corecti?
→ App Password (nu parola Google)?
→ Check Render Logs pentru SMTP errors
```

### "CORS Errors pe Frontend"
```
→ FRONTEND_URL setată corect?
→ Frontend URL nu e inclusă în CORS whitelist?
→ Redeploy backend după schimbarea URL-ului
```

---

## 🔄 Auto-Deploy Workflow

1. **Push code pe GitHub**:
   ```bash
   git add .
   git commit -m "Update backend config"
   git push origin main
   ```

2. **Render detectează push automat**
3. **Renders declanșează deploy**:
   - Rebuild
   - Restart service
   - Logs în Render Dashboard

---

## 💡 Database Backups

Render Free plan NU face automat backup. Pentru producție:

1. **Render PostgreSQL → Backups** (opțional, la planuri payante)
2. **Manual backup**:
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

---

## 🎯 Checklist Deploy

- [ ] Creat GitHub account cu repo
- [ ] PostgreSQL creat pe Render
- [ ] `db-init.sql` executat pe Render DB
- [ ] Web Service creat
- [ ] Toate env vars setate corect
- [ ] Deploy successful (verde pe Render)
- [ ] Test curl endpoint de lucru
- [ ] Frontend connect la backend URL
- [ ] Emails se trimit (check SMTP)
- [ ] Logs clean, fără errors

---

## 📞 Support Render

- Docs: [render.com/docs](https://render.com/docs)
- Status Page: [status.render.com](https://status.render.com)
- Support: [render.com/support](https://render.com/support)

---

## 🔐 Security Notes

- ✅ PASSWORD în DATABASE_URL e sigur (environment var)
- ✅ SMTP_PASS nu se log-ează
- ✅ HTTPS automat (Render)
- ✅ Database SSL: Render forțează SSL pe conexiuni
- ❌ Nu comita `.env` pe GitHub (e în .gitignore)

---

**Backend-ul tău e ready să flyp pe Render!** 🚀
