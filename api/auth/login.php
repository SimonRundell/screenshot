<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../cleanup/expire.php';

/**
 * Authenticates a verified user and starts a session.
 *
 * @return void
 */
function handleLogin(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $input = readJsonInput();
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $password = (string) ($input['password'] ?? '');

    if ($email === '' || $password === '') {
        jsonResponse(['error' => 'Email and password are required'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, email, password_hash, verified FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    if ((int) $user['verified'] !== 1) {
        jsonResponse(['error' => 'Please verify your email first'], 403);
    }

    startSession();
    $_SESSION['user_id'] = (int) $user['id'];

    if (CLEANUP_ON_LOGIN) {
        runImageExpiryCleanup(true);
    }

    jsonResponse([
        'success' => true,
        'user' => [
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
        ],
    ]);
}

handleLogin();
