<?php
/**
 * Authentication API - PHP Backend für User Management
 * Route: /api/auth/<action>
 */

// Error Reporting aktivieren für Debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// SQLite Datenbank Pfad (in httpdocs/data/ damit Webserver schreiben kann)
// Von public/api/auth.php -> ../data/users.sqlite
$dbPath = dirname(__DIR__) . '/data/users.sqlite';

// Response Helper
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Datenbank-Verbindung
function getDB() {
    global $dbPath;

    // Erstelle Datenbank wenn nicht vorhanden
    if (!file_exists($dbPath)) {
        $dbDir = dirname($dbPath);
        if (!is_dir($dbDir)) {
            mkdir($dbDir, 0755, true);
        }

        $db = new PDO('sqlite:' . $dbPath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Erstelle Tabellen
        $db->exec('
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        ');

        $db->exec('
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                email TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                remember_me INTEGER DEFAULT 0,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ');

        return $db;
    }

    try {
        $db = new PDO('sqlite:' . $dbPath);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $e) {
        respond(['error' => 'Database connection failed', 'path' => $dbPath, 'details' => $e->getMessage()], 500);
    }
}

// Token aus Header oder Query-Parameter holen
function getToken() {
    // Authorization Header
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (preg_match('/Bearer\s+(.+)/', $auth, $matches)) {
            return $matches[1];
        }
    }

    // Query Parameter (Fallback für nginx/Plesk)
    if (isset($_GET['token'])) {
        return $_GET['token'];
    }

    return null;
}

// Session validieren
function validateSession($token) {
    $db = getDB();
    $stmt = $db->prepare('
        SELECT s.*, u.id as user_id, u.email, u.name
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > datetime("now")
    ');
    $stmt->execute([$token]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Extrahiere Aktion aus Request URI
$requestUri = $_SERVER['REQUEST_URI'];
$action = '';

// /api/auth/register -> register
if (preg_match('#/api/auth/([^?]+)#', $requestUri, $matches)) {
    $action = $matches[1];
}

$method = $_SERVER['REQUEST_METHOD'];

// ==================== POST /register ====================
if ($method === 'POST' && $action === 'register') {
    // Lese Input - unterstütze mehrere Formate
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    // Fallback zu $_POST wenn JSON leer ist
    if (empty($input)) {
        $input = $_POST;
    }

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $name = $input['name'] ?? '';

    // Debug (kann später entfernt werden)
    if (empty($email) || empty($password) || empty($name)) {
        respond([
            'error' => 'Email, password, and name are required',
            'debug' => [
                'raw_input_length' => strlen($rawInput),
                'parsed_input' => $input,
                'post' => $_POST,
                'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set'
            ]
        ], 400);
    }


    $db = getDB();

    // Prüfe ob Email bereits existiert
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        respond(['error' => 'Email already registered'], 400);
    }

    // Erstelle User
    $userId = bin2hex(random_bytes(16));
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $db->prepare('
        INSERT INTO users (id, email, password_hash, name, created_at)
        VALUES (?, ?, ?, ?, datetime("now"))
    ');
    $stmt->execute([$userId, $email, $passwordHash, $name]);

    // Erstelle Session
    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));

    $stmt = $db->prepare('
        INSERT INTO sessions (token, user_id, email, expires_at, created_at)
        VALUES (?, ?, ?, ?, datetime("now"))
    ');
    $stmt->execute([$token, $userId, $email, $expiresAt]);

    respond([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $name,
            'attributes' => ['name' => $name]
        ]
    ]);
}

// ==================== POST /login ====================
if ($method === 'POST' && $action === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $rememberMe = $input['rememberMe'] ?? false;

    if (empty($email) || empty($password)) {
        respond(['error' => 'Email and password are required'], 400);
    }

    $db = getDB();

    // Finde User
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password_hash'])) {
        respond(['error' => 'Invalid email or password'], 401);
    }

    // Erstelle Session
    $token = bin2hex(random_bytes(32));
    $expiryDays = $rememberMe ? 30 : 7;
    $expiresAt = date('Y-m-d H:i:s', strtotime("+{$expiryDays} days"));

    $stmt = $db->prepare('
        INSERT INTO sessions (token, user_id, email, expires_at, remember_me, created_at)
        VALUES (?, ?, ?, ?, ?, datetime("now"))
    ');
    $stmt->execute([$token, $user['id'], $user['email'], $expiresAt, $rememberMe ? 1 : 0]);

    respond([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'attributes' => ['name' => $user['name']]
        ]
    ]);
}

// ==================== GET /me (current user) ====================
if ($method === 'GET' && ($action === 'me' || $action === 'validate')) {
    $token = getToken();

    if (!$token) {
        respond(['error' => 'No token provided'], 401);
    }

    $session = validateSession($token);

    if (!$session) {
        respond(['error' => 'Invalid or expired session'], 401);
    }

    respond([
        'user' => [
            'id' => $session['user_id'],
            'email' => $session['email'],
            'name' => $session['name'],
            'attributes' => ['name' => $session['name']]
        ]
    ]);
}

// ==================== POST /logout ====================
if ($method === 'POST' && $action === 'logout') {
    $token = getToken();

    if ($token) {
        $db = getDB();
        $stmt = $db->prepare('DELETE FROM sessions WHERE token = ?');
        $stmt->execute([$token]);
    }

    respond(['success' => true]);
}

// Unbekannte Route
respond(['error' => 'Invalid endpoint', 'uri' => $requestUri, 'action' => $action, 'method' => $method], 404);
