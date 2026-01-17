# 🔧 Cogyn.app - Ionos /defaultsite Problem beheben

## Problem-Diagnose

Das `/defaultsite` Problem tritt auf, weil:

1. **Zwei verschiedene Server-IPs**:
   - FTP Server: `78.46.108.153` (nginx)
   - Web Server: `217.160.0.145` (Apache)

2. **Alte Ionos Default-Datei auf dem Apache-Server**:
   - Enthält: `<meta http-equiv="Refresh" content="0;url=defaultsite" />`
   - Wird bei bestimmten Zugriffswegen (z.B. über HTTP oder ohne korrekten Virtual Host) ausgeliefert

3. **Virtual Host Konfiguration**:
   - HTTPS über nginx funktioniert ✓
   - Direkte IP-Zugriffe oder HTTP-Zugriffe können auf alte Konfiguration zeigen ✗

## ✅ Sofort-Lösung (Tablet/Mobile)

### Schritt 1: HTTPS erzwingen
Stelle sicher, dass auf dem Tablet **nur HTTPS** verwendet wird:

1. Öffne **HTTPS**://cogyn.app (mit HTTPS!)
2. Setze ein Lesezeichen für `https://cogyn.app` (NICHT `http://cogyn.app`)
3. Lösche alte Lesezeichen die `http://` verwenden

### Schritt 2: DNS-Cache leeren (Tablet)

**iOS/iPadOS:**
- Einstellungen → Safari → Verlauf und Websitedaten löschen
- Oder: Einstellungen → Allgemein → iPhone/iPad übertragen/zurücksetzen → Zurücksetzen → Netzwerkeinstellungen zurücksetzen

**Android:**
- Chrome: Einstellungen → Datenschutz → Browserdaten löschen → "cogyn.app" auswählen
- Oder: Einstellungen → Netzwerk → DNS-Cache leeren

### Schritt 3: Privater Modus testen
1. Öffne **neues privates/Inkognito-Fenster**
2. Gehe zu: `https://cogyn.app` (mit HTTPS!)
3. Sollte jetzt funktionieren

## 🔧 Dauerhafte Lösung - Plesk Konfiguration

Du musst in **Plesk direkt** folgende Einstellungen prüfen/ändern:

### 1. Plesk Login
- URL: https://cogyn.app:8443 oder über Ionos-Portal
- Benutzername: (dein Plesk-Admin)
- Passwort: (dein Plesk-Passwort)

### 2. Domain-Einstellungen prüfen

1. Gehe zu: **Websites & Domains** → **cogyn.app**
2. Klicke auf: **Hosting-Einstellungen**
3. Prüfe folgende Werte:

   #### Document Root:
   ```
   httpdocs/public
   ```
   ✓ Sollte bereits so sein (laut deiner Aussage)

   #### Apache & nginx Einstellungen:
   - **nginx Unterstützung**: ✓ Aktiviert
   - **nginx als Proxy nutzen**: ✓ Aktiviert
   - **"Dateien bereitstellen durch"**: nginx + Apache

### 3. SSL/HTTPS Konfiguration

1. Gehe zu: **Websites & Domains** → **cogyn.app** → **SSL/TLS-Zertifikate**
2. Prüfe:
   - ✓ SSL-Zertifikat ist installiert
   - ✓ "Alle Nicht-SSL-Verbindungen zu SSL umleiten" ist **AKTIVIERT**

3. Falls nicht aktiviert:
   - Aktiviere: **"Nicht-SSL-Verbindungen zu SSL umleiten (HTTP → HTTPS)"**
   - Speichern

### 4. Apache & nginx Direktiven prüfen

1. Gehe zu: **Websites & Domains** → **cogyn.app** → **Apache & nginx Einstellungen**

2. Unter **"Zusätzliche nginx-Direktiven"** füge hinzu:
   ```nginx
   # Force HTTPS
   if ($scheme != "https") {
       return 301 https://$server_name$request_uri;
   }

   # Prevent defaultsite redirect
   location = /defaultsite {
       return 301 https://cogyn.app/login.html;
   }
   ```

3. Unter **"Zusätzliche Apache-Direktiven"** füge hinzu:
   ```apache
   # Force HTTPS
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

4. **Speichern** und **Apache/nginx neu starten**

### 5. Default-Domain prüfen

1. Gehe zu: **Tools & Einstellungen** → **Server-Einstellungen** → **Standard-Website**
2. Stelle sicher, dass **cogyn.app** (nicht "Default Site") als Standard konfiguriert ist

### 6. Virtual Host Template prüfen (Erweitert)

Falls du SSH-Zugriff hast:

```bash
# Prüfe nginx vhost config
cat /etc/nginx/plesk.conf.d/vhosts/cogyn.app.conf

# Prüfe Apache vhost config
cat /etc/apache2/sites-available/cogyn.app.conf
```

Suche nach veralteten `DocumentRoot` oder `redirect` Anweisungen.

## 🧪 Test nach Änderungen

1. **Leere alle Caches** (Browser, DNS, Server)
2. Teste in **Inkognito-Modus**:
   - `http://cogyn.app` → sollte zu `https://cogyn.app` weiterleiten
   - `https://cogyn.app` → sollte zur Login/App-Seite gehen
   - `https://cogyn.app/defaultsite` → sollte zu `/login.html` weiterleiten

## 📞 Falls nichts hilft: Ionos Support kontaktieren

Wenn die obigen Schritte nicht helfen:

1. **Ionos Support anrufen**: 0721 170 70 (Deutschland)
2. Sage dem Support:
   - "Die Domain cogyn.app leitet zu einer alten `/defaultsite` Seite weiter"
   - "Document Root ist korrekt auf `httpdocs/public` gesetzt"
   - "Ich vermute ein Problem mit der Virtual Host Konfiguration oder Apache/nginx Setup"
   - "IP 217.160.0.145 liefert eine alte Ionos Default-Seite aus"

3. Bitte um:
   - Prüfung der nginx/Apache Virtual Host Konfiguration
   - Sicherstellen, dass keine alte index.html im DocumentRoot liegt
   - Bestätigung, dass alle Domains auf das korrekte httpdocs/public verweisen

## 🚨 Notfall-Workaround

Falls nichts funktioniert, kannst du temporär:

1. **Subdomain verwenden**: `app.cogyn.app` statt `cogyn.app`
   - Richte in Plesk eine neue Subdomain ein
   - Zeige sie auf `httpdocs/public`
   - Funktioniert als temporärer Workaround

2. **Direct IP mit /public**: `http://78.46.108.153/public/` (nicht schön, aber funktioniert)

---

**Zusammenfassung:**
- Hauptproblem: Alte Ionos Default-Datei auf Apache-Server
- Kurzfristig: Nur HTTPS verwenden, DNS-Cache leeren
- Langfristig: Plesk-Konfiguration anpassen (siehe oben)
- Falls alles fehlschlägt: Ionos Support kontaktieren
