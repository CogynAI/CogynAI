<?php
/**
 * ENV Debug Script - Zeigt wo die .env Datei sein sollte
 */
header('Content-Type: application/json');

// Pfad zur .env (wie in chat.php)
$envPath = dirname(dirname(__DIR__)) . '/.env';

// Lade .env
function loadEnv($path) {
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

$config = loadEnv($envPath);

echo json_encode([
    'status' => 'ok',
    'current_file' => __FILE__,
    'current_dir' => __DIR__,
    'env_path_expected' => $envPath,
    'env_exists' => file_exists($envPath),
    'env_readable' => file_exists($envPath) ? is_readable($envPath) : false,
    'openai_key_set' => isset($config['OPENAI_API_KEY']),
    'openai_key_length' => isset($config['OPENAI_API_KEY']) ? strlen($config['OPENAI_API_KEY']) : 0,
    'openai_key_prefix' => isset($config['OPENAI_API_KEY']) ? substr($config['OPENAI_API_KEY'], 0, 10) . '...' : null,
    'all_keys' => array_keys($config),
    'directory_structure' => [
        '__DIR__' => __DIR__,
        'parent1' => dirname(__DIR__),
        'parent2' => dirname(dirname(__DIR__))
    ]
], JSON_PRETTY_PRINT);
