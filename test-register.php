<?php
/**
 * Testet den Register-Endpoint direkt
 */
header('Content-Type: application/json');

$authUrl = 'http' . (isset($_SERVER['HTTPS']) ? 's' : '') . '://' . $_SERVER['HTTP_HOST'] . '/api/auth/register';

// Test-User Daten
$testData = [
    'email' => 'test_' . time() . '@example.com',
    'password' => 'TestPassword123!',
    'name' => 'Test User'
];

echo json_encode([
    'test' => 'Registrierung wird getestet...',
    'url' => $authUrl,
    'test_data' => [
        'email' => $testData['email'],
        'name' => $testData['name']
    ]
], JSON_PRETTY_PRINT);

echo "\n\n---RESULT---\n\n";

// Sende POST Request
$ch = curl_init($authUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($testData),
    CURLOPT_TIMEOUT => 10
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    echo json_encode(['error' => 'cURL error: ' . $error], JSON_PRETTY_PRINT);
    exit;
}

echo "HTTP Code: $httpCode\n\n";

$data = json_decode($response, true);
echo json_encode($data, JSON_PRETTY_PRINT);
