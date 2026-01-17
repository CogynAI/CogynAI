<?php
/**
 * Super simpler Test - zeigt ALLE PHP Fehler
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 0);

echo "<h1>Auth.php Test</h1>";

echo "<h2>1. File Check</h2>";
$authFile = __DIR__ . '/api/auth.php';
echo "Auth file: $authFile<br>";
echo "Exists: " . (file_exists($authFile) ? 'YES' : 'NO') . "<br>";
echo "Readable: " . (is_readable($authFile) ? 'YES' : 'NO') . "<br>";
echo "<br>";

echo "<h2>2. Database Check</h2>";
$dbPath = __DIR__ . '/data/users.sqlite';
echo "DB Path: $dbPath<br>";
echo "Exists: " . (file_exists($dbPath) ? 'YES' : 'NO') . "<br>";
echo "Writable: " . (is_writable($dbPath) ? 'YES' : 'NO') . "<br>";
echo "<br>";

echo "<h2>3. Testing Register URL</h2>";
$registerUrl = 'https://cogyn.app/api/auth/register';

$testData = json_encode([
    'email' => 'test_' . time() . '@example.com',
    'password' => 'Test123!',
    'name' => 'Test User'
]);

echo "Sending POST to: $registerUrl<br>";
echo "Data: <pre>" . htmlspecialchars($testData) . "</pre>";

$ch = curl_init($registerUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => $testData,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_VERBOSE => true
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

echo "<h3>Response:</h3>";
echo "HTTP Code: $httpCode<br>";

if ($curlError) {
    echo "cURL Error: $curlError<br>";
}

echo "Response Body:<br>";
echo "<pre>" . htmlspecialchars($response) . "</pre>";

echo "<h2>4. Direct PHP Include Test</h2>";
echo "Trying to include auth.php directly...<br><br>";

// Backup original server vars
$originalMethod = $_SERVER['REQUEST_METHOD'] ?? null;
$originalUri = $_SERVER['REQUEST_URI'] ?? null;

// Set up for register
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/api/auth/register';
$_POST = [
    'email' => 'includetest_' . time() . '@example.com',
    'password' => 'Test123!',
    'name' => 'Include Test'
];

echo "Simulated POST data: <pre>" . print_r($_POST, true) . "</pre>";

ob_start();
try {
    include($authFile);
    $output = ob_get_clean();
    echo "Output from auth.php:<br><pre>" . htmlspecialchars($output) . "</pre>";
} catch (Throwable $e) {
    ob_end_clean();
    echo "<strong>ERROR:</strong> " . $e->getMessage() . "<br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}

// Restore
if ($originalMethod) $_SERVER['REQUEST_METHOD'] = $originalMethod;
if ($originalUri) $_SERVER['REQUEST_URI'] = $originalUri;
