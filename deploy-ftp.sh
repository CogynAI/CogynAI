#!/bin/bash
# =====================================================
# Cogyn FTP Deployment Script
# Lädt Frontend-Dateien direkt auf den Server hoch
# =====================================================

set -e

echo "🚀 Cogyn FTP Deployment Script"
echo "=============================="

# Server-Konfiguration
FTP_HOST="78.46.108.153"
FTP_USER="cogyn.app_9tkm"
FTP_PASS='!ni29NHt_'
REMOTE_DIR="/httpdocs/public"

# Lokales Verzeichnis
LOCAL_DIR="/Users/leonard/Documents/ai-education"

# Dateien zum Hochladen
FILES=(
    "index.html"
    "login.html"
    "styles.css"
    "script.js"
    "login-script.js"
    "splash-animation.css"
    "splash-animation.js"
    "graph-renderer.js"
    "feedback-templates.js"
    "task-variations.js"
    "test-data.js"
    "topic-data.js"
    "tutor-model.js"
    "tutor-view.js"
    "logo.png"
    "logo_2.png"
)

# Ordner zum Hochladen
DIRS=(
    "ai"
    "auth"
    "config"
    "data"
    "tracking"
    "api/auth"
    "api/ai"
)

echo ""
echo "📁 Lade Einzeldateien hoch..."

for file in "${FILES[@]}"; do
    if [ -f "$LOCAL_DIR/$file" ]; then
        echo "   ↑ $file"
        curl -s --ftp-create-dirs -T "$LOCAL_DIR/$file" \
            --user "$FTP_USER:$FTP_PASS" \
            "ftp://$FTP_HOST$REMOTE_DIR/$file"
    else
        echo "   ⚠️ $file nicht gefunden, überspringe..."
    fi
done

echo ""
echo "📂 Lade Ordner hoch..."

for dir in "${DIRS[@]}"; do
    if [ -d "$LOCAL_DIR/$dir" ]; then
        echo "   📁 $dir/"
        # Erstelle Remote-Verzeichnis (inkl. Unterverzeichnisse)
        curl -s --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" \
            "ftp://$FTP_HOST$REMOTE_DIR/$dir/" -Q "NOOP" 2>/dev/null || true
        
        # Lade alle Dateien im Ordner hoch
        for file in "$LOCAL_DIR/$dir"/*; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                echo "      ↑ $dir/$filename"
                curl -s --ftp-create-dirs -T "$file" \
                    --user "$FTP_USER:$FTP_PASS" \
                    "ftp://$FTP_HOST$REMOTE_DIR/$dir/$filename"
            fi
        done
    fi
done

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "🌐 Website: https://cogyn.app"
echo "   (oder direkt: http://78.46.108.153)"
echo ""
