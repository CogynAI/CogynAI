#!/bin/bash
# =====================================================
# Cogyn Direct SFTP Deployment
# Lädt Dateien direkt auf den Plesk Server
# =====================================================

SERVER="78.46.108.153"
USER="cogyn.app_9tkm"
REMOTE_PATH="/httpdocs"

echo "🚀 Deploying direkt zu cogyn.app..."
echo ""

# SFTP Batch Commands
sftp $USER@$SERVER <<EOF
cd $REMOTE_PATH
put index.html
put login.html
put script.js
put styles.css
put login-script.js
put logo.png
put splash-animation.css
put splash-animation.js
put feedback-templates.js
put test-data.js
put task-variations.js
put topic-data.js
put graph-renderer.js
put tutor-model.js
put tutor-view.js

-mkdir config
cd config
put config/aws-config.js
cd ..

-mkdir auth
cd auth
put auth/auth-service.js
put auth/auth-mock.js
cd ..

-mkdir data
cd data
put data/schemas.js
put data/db-mock.js
put data/dynamodb-adapter.js
put data/db-service.js
put data/competency-schema.js
cd ..

-mkdir tracking
cd tracking
put tracking/competency-tracker.js
put tracking/performance-tracker.js
put tracking/behavior-tracker.js
put tracking/strength-weakness-tracker.js
cd ..

-mkdir ai
cd ai
put ai/data-aggregator.js
put ai/prompt-advisor.js
cd ..

-mkdir api
cd api
-mkdir ai
cd ai
put api/ai/chat.php
cd ../..

bye
EOF

echo ""
echo "✅ Deployment abgeschlossen!"
echo ""
echo "⚠️  WICHTIG: .env Datei Setup"
echo "============================================"
echo "Die .env muss AUSSERHALB von httpdocs liegen."
echo ""
echo "Manuelle Schritte:"
echo "1. Per SFTP verbinden: sftp $USER@$SERVER"
echo "2. Eine Ebene über httpdocs gehen: cd .."
echo "3. .env Datei erstellen mit:"
echo "   OPENAI_API_KEY=dein-openai-key"
echo ""
