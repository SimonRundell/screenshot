<?php
require_once __DIR__ . '/config.php';

/**
 * Starts the PHP session and sets cookie parameters from config.
 *
 * @return void
 */
function startSession(): void
{
    $cfg = getConfig()['app'];
    session_set_cookie_params([
        'lifetime' => (int) $cfg['session_lifetime_seconds'],
        'path' => '/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Returns the currently authenticated user_id, or terminates with 401.
 *
 * @return int
 */
function requireAuth(): int
{
    startSession();
    if (empty($_SESSION['user_id'])) {
        http_response_code(401);
        die(json_encode(['error' => 'Unauthenticated']));
    }

    return (int) $_SESSION['user_id'];
}
