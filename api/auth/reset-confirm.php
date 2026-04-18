<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Confirms a password reset using token and new password.
 *
 * @return void
 */
function handleResetConfirm(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $input = readJsonInput();
    $token = trim((string) ($input['token'] ?? ''));
    $password = (string) ($input['password'] ?? '');

    if ($token === '' || strlen($password) < 8) {
        jsonResponse(['error' => 'Invalid token or password'], 422);
    }

    $db = getDB();
    $userStmt = $db->prepare('SELECT id FROM users WHERE reset_token = :token AND reset_expires > NOW() LIMIT 1');
    $userStmt->execute([':token' => $token]);
    $user = $userStmt->fetch();

    if (!$user) {
        jsonResponse(['error' => 'Invalid or expired token'], 400);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $updateStmt = $db->prepare(
        'UPDATE users SET password_hash = :password_hash, reset_token = NULL, reset_expires = NULL WHERE id = :id'
    );
    $updateStmt->execute([
        ':password_hash' => $hash,
        ':id' => $user['id'],
    ]);

    jsonResponse(['success' => true]);
}

handleResetConfirm();
