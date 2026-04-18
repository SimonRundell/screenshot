<?php
require_once __DIR__ . '/config.php';

$config = getConfig();
$allowedOrigin = rtrim((string) ($config['app']['url'] ?? 'https://screencapture.codemonkey.design'), '/');

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . $allowedOrigin);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
