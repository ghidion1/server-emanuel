# Backend Clinic-Mobila 🏥

Server Node.js + Express.js pentru gestionarea programărilor medicale.

## 📋 Arhitectura

```
server.js (Express app principal)
├── routes/programari.js (endpoint-uri API)
├── controllers/programariController.js (logică business)
├── models/Programare.js (operații DB)
├── middleware/ (validare, autentificare)
├── config/db.js (conexiune PostgreSQL)
├── utils/sendEmail.js (notificări email)
└── db-init.sql (schema bază de date)
```

## 🚀 Setup

### 1. Instalare dependențe
```bash
npm install
```

### 2. Configurare bază de date PostgreSQL

```bash
# Crează baza de date
createdb clinic_mobila

# Inițializează tabela
psql clinic_mobila < db-init.sql
```

### 3. Configurare variabile de mediu

Copiază `.env.example` ca `.env` și completează:

```bash
cp .env.example .env
```

Editează `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clinic_mobila
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Email Config (Gmail cu App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@clinicmobila.md
```

### 4. Pornire server
```bash
npm start
```

Server porneaza pe `http://localhost:5000`

## 📡 API Endpoints

### POST `/api/programari` - Crează programare
```bash
curl -X POST http://localhost:5000/api/programari \
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

**Răspuns Success (201):**
```json
{
  "message": "Programarea a fost trimisă cu succes!",
  "data": {
    "id": 1,
    "nume": "Popescu",
    ...
  }
}
```

### GET `/api/programari` - Listează programări
```bash
curl http://localhost:5000/api/programari
```

## 🔧 Variabile Mediu Necesare

| Variabilă | Exemple | Descriere |
|-----------|---------|-----------|
| `DATABASE_URL` | `postgresql://user:pass@localhost/clinic_mobila` | Conexiune PostgreSQL |
| `PORT` | `5000` | Port server |
| `NODE_ENV` | `development`, `production` | Mediu execuție |
| `BACKEND_URL` | `http://localhost:5000` | URL backend (pentru logs) |
| `FRONTEND_URL` | `http://localhost:3000` | URL frontend (pentru CORS) |
| `SMTP_HOST` | `smtp.gmail.com` | Host email |
| `SMTP_PORT` | `587` | Port SMTP |
| `SMTP_USER` | `your-email@gmail.com` | Utilizator email |
| `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | App Password Gmail |
| `ADMIN_EMAIL` | `admin@clinicmobila.md` | Email administrator |

## 📧 Configurare Gmail cu App Password

1. Activează 2FA pe Google Account
2. Mergi la [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Selectează "Mail" și "Windows Computer"
4. Copiază password-ul generat (format: `xxxx xxxx xxxx xxxx`)
5. Folosește această parolă ca `SMTP_PASS` în `.env`

## 📝 Validare

- **Nume/Prenume**: Required, trim
- **Specialitate**: Required, selectare din listă
- **Medic**: Required, selectare dinamică după specialitate
- **Data**: Required, format YYYY-MM-DD, minim azi
- **Ora**: Required, format HH:MM
- **Telefon**: Required, 6-20 caractere
- **Email**: Optional, dacă completat trebuie valid
- **Motiv**: Optional
- **Mesaj**: Optional

## 🐛 Troubleshooting

### "Eroare conexiune bază de date"
```bash
# Verifică dacă PostgreSQL rulează
psql -U postgres -d clinic_mobila

# Verifica DATABASE_URL în .env
echo $DATABASE_URL
```

### "SMTP config eroare"
- Asigură-te că app password e corect (nu parola Google)
- Asigură-te că 2FA e activat pe Google Account
- Verifica SMTP_HOST, SMTP_PORT, SMTP_USER în .env

### CORS errors
- Verifica FRONTEND_URL în .env
- Asigură-te că frontend face fetch cu URL corect

## 🔐 Security Notes

- Nu comita `.env` (e în .gitignore)
- Folosește environment variables pentru ALL credentials
- SMTP_PASS nu ar trebui logat
- Validează TOATE inputurile din frontend 
- SQL injection e prevenit cu parameterized queries

## 📚 Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL 12+
- **Email**: Nodemailer
- **Validation**: Regex
- **CORS**: Enabled cu whitelist

## ✅ Checklist Deploy

- [ ] DATABASE_URL configurat (PostgreSQL in cloud)
- [ ] SMTP credentials setate (Gmail sau Mailgun)
- [ ] PORT configurat (default 5000)
- [ ] FRONTEND_URL in CORS whitelist
- [ ] NODE_ENV=production
- [ ] db-init.sql ejecutat pe baza de date
- [ ] Test curl POST /api/programari
- [ ] Logs monitorizate pentru erori
