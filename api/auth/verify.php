<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Verifies a user account using a token.
 *
 * @return void
 */
function handleVerify(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $token = trim((string) ($_GET['token'] ?? ''));
    if ($token === '') {
        jsonResponse(['error' => 'Missing token'], 422);
    }

    $db = getDB();
    $selectStmt = $db->prepare(
        'SELECT id FROM users WHERE verification_token = :token AND verification_expires > NOW() LIMIT 1'
    );
    $selectStmt->execute([':token' => $token]);
    $row = $selectStmt->fetch();

    if (!$row) {
        jsonResponse(['error' => 'Invalid or expired token'], 400);
    }

    $updateStmt = $db->prepare(
        'UPDATE users SET verified = 1, verification_token = NULL, verification_expires = NULL WHERE id = :id'
    );
    $updateStmt->execute([':id' => $row['id']]);

    jsonResponse(['success' => true]);
}

handleVerify();
