<?php
/**
 * Test-Script zum Überprüfen der .env Konfiguration
 */

header('Content-Type: application/json');

// .env laden (gleiche Logik wie chat.php)
function loadEnv() {
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

$envPath = dirname(dirname(dirname(__DIR__))) . '/.env';
$config = loadEnv();

$result = [
    'status' => 'ok',
    'env_path' => $envPath,
    'env_exists' => file_exists($envPath),
    'env_readable' => is_readable($envPath),
    'openai_key_set' => isset($config['OPENAI_API_KEY']),
    'openai_key_length' => isset($config['OPENAI_API_KEY']) ? strlen($config['OPENAI_API_KEY']) : 0,
    'openai_key_prefix' => isset($config['OPENAI_API_KEY']) ? substr($config['OPENAI_API_KEY'], 0, 7) . '...' : 'N/A',
    'anthropic_key_set' => isset($config['ANTHROPIC_API_KEY']),
    'current_dir' => __DIR__,
    'parent_dirs' => [
        'dir' => __DIR__,
        'parent1' => dirname(__DIR__),
        'parent2' => dirname(dirname(__DIR__)),
        'parent3' => dirname(dirname(dirname(__DIR__)))
    ]
];

echo json_encode($result, JSON_PRETTY_PRINT);
