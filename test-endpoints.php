<?php
/**
 * Testet ob die Endpoint-Dateien existieren und funktionieren
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Endpoint Test</h1>";

$endpoints = [
    'register' => 'https://cogyn.app/api/auth/register.php',
    'login' => 'https://cogyn.app/api/auth/login.php',
    'me' => 'https://cogyn.app/api/auth/me.php',
];

foreach ($endpoints as $name => $url) {
    echo "<h2>Testing: $name</h2>";
    echo "URL: $url<br>";

    $testData = json_encode([
        'email' => 'test_' . time() . '@example.com',
        'password' => 'Test123!',
        'name' => 'Test User'
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => $testData,
        CURLOPT_TIMEOUT => 10
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "HTTP Code: <strong>$httpCode</strong><br>";

    if ($httpCode === 200) {
        echo "<span style='color: green;'>✅ SUCCESS</span><br>";
    } else {
        echo "<span style='color: red;'>❌ FAILED</span><br>";
    }

    echo "Response: <pre>" . htmlspecialchars($response) . "</pre>";
    echo "<hr>";
}

// Test auch die .php Endung direkt im Browser
echo "<h2>File Check</h2>";
$files = [
    '/var/www/vhosts/cogyn.app/httpdocs/public/api/auth/register.php',
    '/var/www/vhosts/cogyn.app/httpdocs/public/api/auth/login.php',
    '/var/www/vhosts/cogyn.app/httpdocs/public/api/auth/me.php',
];

foreach ($files as $file) {
    $exists = file_exists($file);
    $color = $exists ? 'green' : 'red';
    $icon = $exists ? '✅' : '❌';
    echo "<span style='color: $color;'>$icon</span> $file<br>";
}
