<?php
/**
 * Zeigt welche Version von auth.php auf dem Server läuft
 */
header('Content-Type: application/json');

$authPhpPath = __DIR__ . '/api/auth.php';

if (!file_exists($authPhpPath)) {
    echo json_encode(['error' => 'auth.php not found', 'path' => $authPhpPath], JSON_PRETTY_PRINT);
    exit;
}

$content = file_get_contents($authPhpPath);

// Finde den $dbPath
$dbPathLine = '';
if (preg_match('/\$dbPath = (.+);/', $content, $matches)) {
    $dbPathLine = $matches[1];
}

echo json_encode([
    'status' => 'ok',
    'auth_php_path' => $authPhpPath,
    'file_size' => filesize($authPhpPath),
    'last_modified' => date('Y-m-d H:i:s', filemtime($authPhpPath)),
    'db_path_line' => $dbPathLine,
    'expected' => "dirname(__DIR__) . '/data/users.sqlite'"
], JSON_PRETTY_PRINT);
