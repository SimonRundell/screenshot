<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Logs out the current user by destroying the session.
 *
 * @return void
 */
function handleLogout(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    startSession();
    $_SESSION = [];
    session_destroy();

    jsonResponse(['success' => true]);
}

handleLogout();
