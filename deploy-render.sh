#!/bin/bash

# Quick Deploy Script para Render
# Usul: bash deploy-render.sh

echo "🚀 Clinic Mobila Backend - Render Deploy Script"
echo "==============================================="
echo ""

# 1. Check da git
if ! command -v git &> /dev/null; then
    echo "❌ Git nu e instalat. Instaleaza git și reincearca."
    exit 1
fi

# 2. Check da .env
if [ ! -f .env ]; then
    echo "⚠️  .env nu exista. Kopiez .env.example..."
    cp .env.example .env
    echo "📝 Editeaza .env cu datele tale înainte de deploy!"
    exit 1
fi

# 3. Verifică dacă e git repo
if [ ! -d .git ]; then
    echo "🔧 Inițializez git repo..."
    git init
    git add .
    git commit -m "Initial commit - Clinic Mobila Backend"
fi

# 4. Verific variabile .env
echo "🔍 Verificand .env variables..."
required_vars=("DATABASE_URL" "SMTP_USER" "SMTP_PASS" "ADMIN_EMAIL")

for var in "${required_vars[@]}"; do
    if ! grep -q "^$var=" .env; then
        echo "❌ $var nu e configurata in .env"
        exit 1
    fi
done

echo "✅ .env variables OK"

# 5. Verific package.json
if [ ! -f package.json ]; then
    echo "❌ package.json nu gasit!"
    exit 1
fi

echo "✅ package.json OK"

# 6. Verific db-init.sql
if [ ! -f db-init.sql ]; then
    echo "❌ db-init.sql nu gasit!"
    exit 1
fi

echo "✅ db-init.sql OK"

# 7. Push pe GitHub
echo ""
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Clinic Mobila Backend - Ready for Render deploy" || true
git push origin main || git push

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Pași urmatori:"
echo "1. Mergi pe render.com"
echo "2. Conectează GitHub repo"
echo "3. Creează PostgreSQL database"
echo "4. Creează Web Service cu:"
echo "   - Build: npm install"
echo "   - Start: npm start"
echo "5. Seteaza Environment Variables (vezi DEPLOY_RENDER.md)"
echo "6. Deploy!"
echo ""
