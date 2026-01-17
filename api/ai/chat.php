<?php
/**
 * Cogyn AI Proxy - Leitet Anfragen an OpenAI/Anthropic weiter
 * Der API-Key bleibt auf dem Server und wird nie an den Client gesendet
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Nur POST erlaubt
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// .env laden
function loadEnv() {
    // Von public/api/ai/chat.php -> 4 Ebenen hoch zu /var/www/vhosts/cogyn.app/.env
    $envFile = dirname(dirname(dirname(dirname(__DIR__)))) . '/.env';
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

$config = loadEnv();

// API Keys aus .env
$openaiKey = $config['OPENAI_API_KEY'] ?? '';
$anthropicKey = $config['ANTHROPIC_API_KEY'] ?? '';

// Response Helper
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

// Input lesen
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    respond(['error' => 'Invalid JSON input'], 400);
}

$provider = $input['provider'] ?? 'openai';
$messages = $input['messages'] ?? [];
$model = $input['model'] ?? null;
$maxTokens = $input['max_tokens'] ?? $input['max_completion_tokens'] ?? 4096;
$temperature = $input['temperature'] ?? 0.7;

// Zusätzliche OpenAI-spezifische Parameter
$tools = $input['tools'] ?? null;
$toolChoice = $input['tool_choice'] ?? null;
$responseFormat = $input['response_format'] ?? null;

if (empty($messages)) {
    respond(['error' => 'Messages are required'], 400);
}

// ==================== OpenAI ====================
if ($provider === 'openai') {
    if (empty($openaiKey)) {
        respond(['error' => 'OpenAI API key not configured on server'], 500);
    }
    
    $model = $model ?? 'gpt-4o-mini';
    
    $payload = [
        'model' => $model,
        'messages' => $messages,
        'max_completion_tokens' => $maxTokens,
        'temperature' => $temperature
    ];
    
    // Optionale Parameter hinzufügen
    if ($tools) {
        $payload['tools'] = $tools;
    }
    if ($toolChoice) {
        $payload['tool_choice'] = $toolChoice;
    }
    if ($responseFormat) {
        $payload['response_format'] = $responseFormat;
    }
    
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $openaiKey
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 120
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        respond(['error' => 'Request failed: ' . $error], 500);
    }
    
    $data = json_decode($response, true);
    
    if ($httpCode !== 200) {
        respond([
            'error' => $data['error']['message'] ?? 'OpenAI API error',
            'details' => $data
        ], $httpCode);
    }
    
    respond($data);
}

// ==================== Anthropic ====================
if ($provider === 'anthropic') {
    if (empty($anthropicKey)) {
        respond(['error' => 'Anthropic API key not configured on server'], 500);
    }
    
    $model = $model ?? 'claude-3-5-sonnet-20241022';
    
    // Konvertiere OpenAI-Format zu Anthropic-Format
    $systemMessage = '';
    $anthropicMessages = [];
    
    foreach ($messages as $msg) {
        if ($msg['role'] === 'system') {
            $systemMessage = $msg['content'];
        } else {
            $anthropicMessages[] = [
                'role' => $msg['role'],
                'content' => $msg['content']
            ];
        }
    }
    
    $payload = [
        'model' => $model,
        'max_tokens' => $maxTokens,
        'messages' => $anthropicMessages
    ];
    
    if ($systemMessage) {
        $payload['system'] = $systemMessage;
    }
    
    // Tools für Anthropic
    if ($tools) {
        $payload['tools'] = $tools;
    }
    if ($toolChoice) {
        $payload['tool_choice'] = $toolChoice;
    }
    
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-api-key: ' . $anthropicKey,
            'anthropic-version: 2023-06-01'
        ],
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_TIMEOUT => 120
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        respond(['error' => 'Request failed: ' . $error], 500);
    }
    
    $data = json_decode($response, true);
    
    if ($httpCode !== 200) {
        respond([
            'error' => $data['error']['message'] ?? 'Anthropic API error',
            'details' => $data
        ], $httpCode);
    }
    
    // Konvertiere Anthropic-Response zu OpenAI-ähnlichem Format für Frontend-Kompatibilität
    $openaiFormat = [
        'id' => $data['id'] ?? 'msg_' . time(),
        'object' => 'chat.completion',
        'model' => $data['model'] ?? $model,
        'choices' => [
            [
                'index' => 0,
                'message' => [
                    'role' => 'assistant',
                    'content' => ''
                ],
                'finish_reason' => $data['stop_reason'] ?? 'stop'
            ]
        ],
        'usage' => [
            'prompt_tokens' => $data['usage']['input_tokens'] ?? 0,
            'completion_tokens' => $data['usage']['output_tokens'] ?? 0,
            'total_tokens' => ($data['usage']['input_tokens'] ?? 0) + ($data['usage']['output_tokens'] ?? 0)
        ]
    ];
    
    // Extrahiere Content aus Anthropic-Response
    if (isset($data['content']) && is_array($data['content'])) {
        foreach ($data['content'] as $block) {
            if ($block['type'] === 'text') {
                $openaiFormat['choices'][0]['message']['content'] = $block['text'];
                break;
            } elseif ($block['type'] === 'tool_use') {
                // Tool-Aufruf
                $openaiFormat['choices'][0]['message']['tool_calls'] = [
                    [
                        'id' => $block['id'],
                        'type' => 'function',
                        'function' => [
                            'name' => $block['name'],
                            'arguments' => json_encode($block['input'])
                        ]
                    ]
                ];
                $openaiFormat['choices'][0]['finish_reason'] = 'tool_calls';
            }
        }
    }
    
    respond($openaiFormat);
}

// Unbekannter Provider
respond(['error' => 'Unknown provider: ' . $provider], 400);
