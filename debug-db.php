<?php
/**
 * Database Debug - Prüft Permissions und Schreibrechte
 */
header('Content-Type: application/json');

$dbPath = __DIR__ . '/data/users.sqlite';
$dbDir = dirname($dbPath);

$result = [
    'status' => 'checking',
    'db_path' => $dbPath,
    'db_dir' => $dbDir,
    'checks' => []
];

// Check 1: Verzeichnis existiert
$result['checks']['dir_exists'] = is_dir($dbDir);

// Check 2: Verzeichnis beschreibbar
$result['checks']['dir_writable'] = is_writable($dbDir);

// Check 3: Datenbank existiert
$result['checks']['db_exists'] = file_exists($dbPath);

// Check 4: Datenbank beschreibbar (wenn sie existiert)
if (file_exists($dbPath)) {
    $result['checks']['db_writable'] = is_writable($dbPath);
    $result['checks']['db_size'] = filesize($dbPath);
}

// Check 5: Versuche Verzeichnis zu erstellen
if (!is_dir($dbDir)) {
    $created = @mkdir($dbDir, 0755, true);
    $result['checks']['dir_created'] = $created;
}

// Check 6: Versuche Datenbank zu erstellen/öffnen
try {
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Erstelle Tabellen wenn nicht vorhanden
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

    // Teste Schreibzugriff
    $testId = 'test_' . time();
    $db->exec("INSERT INTO users (id, email, password_hash, name) VALUES ('$testId', 'test@test.com', 'hash', 'Test')");
    $db->exec("DELETE FROM users WHERE id = '$testId'");

    $result['checks']['db_connection'] = true;
    $result['checks']['db_write_test'] = true;
    $result['status'] = 'ok';

    // Zähle User
    $stmt = $db->query('SELECT COUNT(*) as count FROM users');
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    $result['user_count'] = $count['count'];

} catch (PDOException $e) {
    $result['checks']['db_connection'] = false;
    $result['checks']['error'] = $e->getMessage();
    $result['status'] = 'error';
}

// Check 7: PHP Permissions
$result['php_info'] = [
    'user' => get_current_user(),
    'uid' => getmyuid(),
    'gid' => getmygid(),
];

echo json_encode($result, JSON_PRETTY_PRINT);
