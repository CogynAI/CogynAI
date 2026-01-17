<?php
/**
 * Zeigt die aktuelle Version von chat.php
 */
header('Content-Type: application/json');

$chatPhpPath = __DIR__ . '/api/ai/chat.php';

if (!file_exists($chatPhpPath)) {
    echo json_encode([
        'error' => 'chat.php not found',
        'expected_path' => $chatPhpPath,
        'current_dir' => __DIR__
    ], JSON_PRETTY_PRINT);
    exit;
}

$content = file_get_contents($chatPhpPath);
$lines = explode("\n", $content);

// Finde Zeile mit max_tokens oder max_completion_tokens
$relevantLines = [];
foreach ($lines as $num => $line) {
    if (strpos($line, 'max_tokens') !== false || strpos($line, 'max_completion_tokens') !== false) {
        $relevantLines[$num + 1] = trim($line);
    }
}

echo json_encode([
    'status' => 'ok',
    'chat_php_path' => $chatPhpPath,
    'file_exists' => true,
    'file_size' => filesize($chatPhpPath),
    'last_modified' => date('Y-m-d H:i:s', filemtime($chatPhpPath)),
    'lines_with_max_tokens' => $relevantLines,
    'line_90_preview' => isset($lines[89]) ? trim($lines[89]) : 'N/A'
], JSON_PRETTY_PRINT);
