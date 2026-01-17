<?php
/**
 * Cogyn Auth API - Standalone (ohne Laravel)
 * Einfache REST API für Authentifizierung
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Konfiguration aus .env laden (vereinfacht)
function loadEnv() {
    // .env liegt in httpdocs (1 Ebene über public/)
    // public/api/auth/index.php -> suche in httpdocs/.env
    $envFile = dirname(dirname(dirname(__DIR__))) . '/.env';
    $config = [];
    
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            list($key, $value) = explode('=', $line, 2);
            $config[trim($key)] = trim($value);
        }
    }
    
    return $config;
}

$config = loadEnv();

// Datenbank-Verbindung
function getDB() {
    global $config;
    
    $host = $config['DB_HOST'] ?? 'localhost';
    $dbname = $config['DB_DATABASE'] ?? '';
    $username = $config['DB_USERNAME'] ?? '';
    $password = $config['DB_PASSWORD'] ?? '';
    
    try {
        $pdo = new PDO(
            "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
            $username,
            $password,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Datenbankverbindung fehlgeschlagen: ' . $e->getMessage()]);
        exit;
    }
}

// Tabellen erstellen falls nicht vorhanden
function ensureTables($pdo) {
    // Nutze utf8 statt utf8mb4 für längere Index-Keys (ältere MySQL/MariaDB Kompatibilität)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            email VARCHAR(191) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            age INT NULL,
            email_verified TINYINT(1) DEFAULT 1,
            last_login DATETIME NULL,
            profile_data TEXT NULL,
            settings TEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS sessions (
            token VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            email VARCHAR(191) NOT NULL,
            expires_at DATETIME NOT NULL,
            remember_me TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_user (user_id),
            INDEX idx_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
}

// Token aus Header extrahieren (mehrere Fallbacks für verschiedene Server-Configs)
function getBearerToken() {
    $auth = '';
    
    // 1. Standard getallheaders()
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
    } elseif (isset($headers['authorization'])) {
        $auth = $headers['authorization'];
    }
    
    // 2. $_SERVER Varianten (Apache/nginx)
    if (empty($auth) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (empty($auth) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    
    // 3. Apache-spezifisch
    if (empty($auth) && function_exists('apache_request_headers')) {
        $apacheHeaders = apache_request_headers();
        $auth = $apacheHeaders['Authorization'] ?? $apacheHeaders['authorization'] ?? '';
    }
    
    // 4. Query-Parameter als Fallback (für problematische Proxy-Configs)
    if (empty($auth) && isset($_GET['token'])) {
        return $_GET['token'];
    }
    
    if (preg_match('/Bearer\s+(.+)/i', $auth, $matches)) {
        return $matches[1];
    }
    return null;
}

// Zufälligen Token generieren
function generateToken($length = 64) {
    return bin2hex(random_bytes($length / 2));
}

// User ID generieren
function generateUserId() {
    return 'user_' . time() . '_' . bin2hex(random_bytes(4));
}

// JSON Input lesen
function getJsonInput() {
    $json = file_get_contents('php://input');
    return json_decode($json, true) ?? [];
}

// Response senden
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// ==================== ROUTING ====================

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Pfad extrahieren (entferne Query-String und Basis-Pfad)
$path = parse_url($uri, PHP_URL_PATH);
$path = preg_replace('#^/api/auth#', '', $path);
$path = rtrim($path, '/');

$pdo = getDB();
ensureTables($pdo);

// ==================== ENDPOINTS ====================

// POST /register
if ($method === 'POST' && $path === '/register') {
    $input = getJsonInput();
    
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $name = trim($input['name'] ?? '');
    $age = isset($input['age']) ? intval($input['age']) : null;
    
    // Validierung
    if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(['error' => 'Ungültige E-Mail-Adresse'], 400);
    }
    if (strlen($password) < 8) {
        respond(['error' => 'Passwort muss mindestens 8 Zeichen lang sein'], 400);
    }
    if (!$name) {
        respond(['error' => 'Name ist erforderlich'], 400);
    }
    if ($age !== null && ($age < 10 || $age > 99)) {
        respond(['error' => 'Alter muss zwischen 10 und 99 Jahren liegen'], 400);
    }
    
    // Prüfe ob Email existiert
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        respond(['error' => 'Ein Benutzer mit dieser E-Mail existiert bereits'], 409);
    }
    
    // User erstellen
    $userId = generateUserId();
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare('
        INSERT INTO users (id, email, password_hash, name, age) 
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([$userId, $email, $passwordHash, $name, $age]);
    
    // Session erstellen
    $token = generateToken();
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
    
    $stmt = $pdo->prepare('
        INSERT INTO sessions (token, user_id, email, expires_at, remember_me) 
        VALUES (?, ?, ?, ?, 0)
    ');
    $stmt->execute([$token, $userId, $email, $expiresAt]);
    
    respond([
        'success' => true,
        'user' => [
            'userId' => $userId,
            'email' => $email,
            'name' => $name,
            'age' => $age
        ],
        'token' => $token,
        'message' => 'Registrierung erfolgreich!'
    ], 201);
}

// POST /login
if ($method === 'POST' && $path === '/login') {
    $input = getJsonInput();
    
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';
    $rememberMe = $input['rememberMe'] ?? false;
    
    if (!$email || !$password) {
        respond(['error' => 'Email und Passwort sind erforderlich'], 400);
    }
    
    // User finden
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        respond(['error' => 'Ungültige E-Mail oder Passwort'], 401);
    }
    
    // Last login aktualisieren
    $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    // Session erstellen
    $token = generateToken();
    $expiryDays = $rememberMe ? 30 : 1;
    $expiresAt = date('Y-m-d H:i:s', strtotime("+$expiryDays days"));
    
    $stmt = $pdo->prepare('
        INSERT INTO sessions (token, user_id, email, expires_at, remember_me) 
        VALUES (?, ?, ?, ?, ?)
    ');
    $stmt->execute([$token, $user['id'], $email, $expiresAt, $rememberMe ? 1 : 0]);
    
    respond([
        'success' => true,
        'user' => [
            'userId' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'age' => $user['age'],
            'attributes' => [
                'name' => $user['name'],
                'age' => $user['age']
            ]
        ],
        'session' => [
            'token' => $token,
            'expiresAt' => $expiresAt,
            'rememberMe' => (bool)$rememberMe
        ]
    ]);
}

// POST /logout
if ($method === 'POST' && $path === '/logout') {
    $token = getBearerToken();
    
    if ($token) {
        $stmt = $pdo->prepare('DELETE FROM sessions WHERE token = ?');
        $stmt->execute([$token]);
    }
    
    respond(['success' => true, 'message' => 'Erfolgreich abgemeldet']);
}

// GET /me
if ($method === 'GET' && $path === '/me') {
    $token = getBearerToken();
    
    if (!$token) {
        respond(['error' => 'Nicht authentifiziert'], 401);
    }
    
    // Session validieren
    $stmt = $pdo->prepare('
        SELECT s.*, u.* FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.token = ? AND s.expires_at > NOW()
    ');
    $stmt->execute([$token]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$data) {
        respond(['error' => 'Session abgelaufen oder ungültig'], 401);
    }
    
    respond([
        'success' => true,
        'user' => [
            'userId' => $data['user_id'],
            'email' => $data['email'],
            'name' => $data['name'],
            'age' => $data['age'],
            'attributes' => [
                'name' => $data['name'],
                'age' => $data['age']
            ]
        ],
        'session' => [
            'token' => $data['token'],
            'expiresAt' => $data['expires_at'],
            'rememberMe' => (bool)$data['remember_me']
        ]
    ]);
}

// GET /validate
if ($method === 'GET' && $path === '/validate') {
    $token = getBearerToken();
    
    if (!$token) {
        respond(['valid' => false]);
    }
    
    $stmt = $pdo->prepare('
        SELECT s.user_id, u.email, u.name FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.token = ? AND s.expires_at > NOW()
    ');
    $stmt->execute([$token]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$data) {
        respond(['valid' => false]);
    }
    
    respond([
        'valid' => true,
        'user' => [
            'userId' => $data['user_id'],
            'email' => $data['email'],
            'name' => $data['name']
        ]
    ]);
}

// POST /check-email
if ($method === 'POST' && $path === '/check-email') {
    $input = getJsonInput();
    $email = strtolower(trim($input['email'] ?? ''));
    
    if (!$email) {
        respond(['error' => 'Email ist erforderlich'], 400);
    }
    
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    
    respond(['exists' => (bool)$stmt->fetch()]);
}

// 404 für unbekannte Routen
respond(['error' => 'Endpoint nicht gefunden', 'path' => $path, 'method' => $method], 404);
