#!/bin/bash
# =====================================================
# Cogyn Deployment Script
# Kopiert Frontend-Änderungen und erstellt Upload-ZIP
# =====================================================

echo "🚀 Cogyn Deployment Script"
echo "=========================="

# Pfade
AI_EDU="/Users/leonard/Documents/ai-education"
BACKEND="/Users/leonard/Documents/cogyn-backend"
OUTPUT="/Users/leonard/Documents"

# 1. Frontend-Dateien zum Backend kopieren
echo ""
echo "📁 Kopiere Frontend-Dateien..."

# Hauptdateien
cp "$AI_EDU/index.html" "$BACKEND/public/"
cp "$AI_EDU/login.html" "$BACKEND/public/"
cp "$AI_EDU/styles.css" "$BACKEND/public/"
cp "$AI_EDU/script.js" "$BACKEND/public/"
cp "$AI_EDU/login-script.js" "$BACKEND/public/"
cp "$AI_EDU/splash-animation.css" "$BACKEND/public/"
cp "$AI_EDU/splash-animation.js" "$BACKEND/public/"
cp "$AI_EDU/graph-renderer.js" "$BACKEND/public/"
cp "$AI_EDU/feedback-templates.js" "$BACKEND/public/"
cp "$AI_EDU/task-variations.js" "$BACKEND/public/"
cp "$AI_EDU/test-data.js" "$BACKEND/public/"
cp "$AI_EDU/topic-data.js" "$BACKEND/public/"
cp "$AI_EDU/tutor-model.js" "$BACKEND/public/"
cp "$AI_EDU/tutor-view.js" "$BACKEND/public/"

# Unterordner
cp -r "$AI_EDU/ai/"* "$BACKEND/public/ai/"
cp -r "$AI_EDU/auth/"* "$BACKEND/public/auth/"
cp -r "$AI_EDU/config/"* "$BACKEND/public/config/"
cp -r "$AI_EDU/data/"* "$BACKEND/public/data/"
cp -r "$AI_EDU/tracking/"* "$BACKEND/public/tracking/"

echo "✅ Frontend-Dateien kopiert"

# 2. Git commit und push (Backend)
echo ""
echo "📤 Git Push zum Server..."
cd "$BACKEND"
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "   (Keine Änderungen zum committen)"
git push origin master

# 3. ZIP für manuellen Upload erstellen (nur public/ Ordner)
echo ""
echo "📦 Erstelle Upload-ZIP..."
cd "$BACKEND"
rm -f "$OUTPUT/cogyn-public-update.zip"
zip -r "$OUTPUT/cogyn-public-update.zip" public/ -x "*.DS_Store"

echo ""
echo "✅ Deployment vorbereitet!"
echo ""
echo "📍 ZIP für Upload: $OUTPUT/cogyn-public-update.zip"
echo ""
echo "Falls Auto-Deploy nicht aktiv ist:"
echo "1. Gehe in Plesk → Files → httpdocs"
echo "2. Lösche den 'public' Ordner"
echo "3. Lade cogyn-public-update.zip hoch"
echo "4. Entpacke die ZIP"
echo ""
