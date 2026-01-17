<?php
/**
 * Vollständiger API Test
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test 1: Pfade
$currentDir = __DIR__;
$env1 = dirname(dirname($currentDir)) . '/.env';  // 2 Ebenen hoch (httpdocs/.env)
$env2 = dirname(dirname(dirname($currentDir))) . '/.env';  // 3 Ebenen hoch (cogyn.app/.env)

// Test 2: .env laden
function loadEnvFromPath($path) {
    $config = [];
    if (file_exists($path)) {
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            list($key, $value) = explode('=', $line, 2);
            $config[trim($key)] = trim($value);
        }
    }
    return $config;
}

$config1 = loadEnvFromPath($env1);
$config2 = loadEnvFromPath($env2);

// Test 3: cURL Test zu OpenAI
$testKey = $config2['OPENAI_API_KEY'] ?? $config1['OPENAI_API_KEY'] ?? null;
$curlWorks = function_exists('curl_init');
$curlTest = null;

if ($testKey && $curlWorks) {
    $ch = curl_init('https://api.openai.com/v1/models');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $testKey
        ],
        CURLOPT_TIMEOUT => 5
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    $curlTest = [
        'http_code' => $httpCode,
        'success' => $httpCode === 200,
        'error' => $curlError ?: null,
        'response_length' => strlen($response)
    ];
}

echo json_encode([
    'status' => 'ok',
    'current_file' => __FILE__,
    'current_dir' => $currentDir,
    'paths' => [
        'env_httpdocs' => $env1,
        'env_vhost_root' => $env2
    ],
    'env_httpdocs' => [
        'exists' => file_exists($env1),
        'readable' => is_readable($env1),
        'has_openai_key' => isset($config1['OPENAI_API_KEY']),
        'key_length' => isset($config1['OPENAI_API_KEY']) ? strlen($config1['OPENAI_API_KEY']) : 0
    ],
    'env_vhost_root' => [
        'exists' => file_exists($env2),
        'readable' => is_readable($env2),
        'has_openai_key' => isset($config2['OPENAI_API_KEY']),
        'key_length' => isset($config2['OPENAI_API_KEY']) ? strlen($config2['OPENAI_API_KEY']) : 0
    ],
    'recommended_env' => $env2,
    'php_info' => [
        'curl_enabled' => $curlWorks,
        'allow_url_fopen' => ini_get('allow_url_fopen') ? true : false,
        'php_version' => phpversion()
    ],
    'openai_api_test' => $curlTest
], JSON_PRETTY_PRINT);
