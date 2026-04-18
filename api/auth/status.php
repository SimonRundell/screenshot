<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Returns current authentication status and user data when authenticated.
 *
 * @return void
 */
function handleStatus(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    startSession();
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['authenticated' => false]);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, email FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => (int) $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['authenticated' => false]);
    }

    jsonResponse(['authenticated' => true, 'user' => $user]);
}

handleStatus();
