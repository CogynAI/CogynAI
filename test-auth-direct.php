<?php
/**
 * Testet auth.php DIREKT (ohne URL Rewriting)
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== DIRECT AUTH.PHP TEST ===\n\n";

// Simuliere einen POST Request direkt in auth.php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REQUEST_URI'] = '/api/auth/register';

// Test-Daten
$testData = [
    'email' => 'directtest_' . time() . '@example.com',
    'password' => 'TestPassword123!',
    'name' => 'Direct Test User'
];

// Simuliere JSON Input
file_put_contents('php://input', json_encode($testData));

echo "Test Data:\n";
echo json_encode($testData, JSON_PRETTY_PRINT) . "\n\n";

echo "=== OUTPUT VON AUTH.PHP ===\n\n";

// Capture Output
ob_start();

try {
    include(__DIR__ . '/api/auth.php');
} catch (Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString();
}

$output = ob_get_clean();
echo $output;
