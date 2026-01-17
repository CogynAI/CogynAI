<?php
/**
 * Cogyn.app - Smart Router
 * Leitet Anfragen intelligent zur richtigen Seite weiter
 */

// Prüfe ob Token in Cookie existiert
$hasToken = isset($_COOKIE['auth_token']) && !empty($_COOKIE['auth_token']);

// Prüfe ob Token in LocalStorage existieren könnte (via Referer)
$fromApp = isset($_SERVER['HTTP_REFERER']) &&
           (strpos($_SERVER['HTTP_REFERER'], 'cogyn.app') !== false);

// Debug-Modus
$debug = isset($_GET['debug']);

if ($debug) {
    header('Content-Type: text/plain');
    echo "=== Cogyn Router Debug ===\n";
    echo "Request URI: " . $_SERVER['REQUEST_URI'] . "\n";
    echo "Has Token Cookie: " . ($hasToken ? 'YES' : 'NO') . "\n";
    echo "From App: " . ($fromApp ? 'YES' : 'NO') . "\n";
    echo "Referer: " . ($_SERVER['HTTP_REFERER'] ?? 'none') . "\n";
    echo "User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "\n";
    exit;
}

// Leite basierend auf Auth-Status weiter
if ($hasToken || $fromApp) {
    // Hat Token oder kommt von der App -> zur Hauptseite
    header('Location: /index.html');
} else {
    // Kein Token -> zur Login-Seite
    header('Location: /login.html');
}
exit;
?>
