<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../mail.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../config.php';

/**
 * Handles user registration and sends a verification email.
 *
 * @return void
 */
function handleRegister(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $input = readJsonInput();
    $username = trim((string) ($input['username'] ?? ''));
    $email = strtolower(trim((string) ($input['email'] ?? '')));
    $password = (string) ($input['password'] ?? '');

    if ($username === '' || $email === '' || strlen($password) < 8 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid input data'], 422);
    }

    $db = getDB();
    $existsStmt = $db->prepare('SELECT id FROM users WHERE username = :username OR email = :email LIMIT 1');
    $existsStmt->execute([':username' => $username, ':email' => $email]);
    if ($existsStmt->fetch()) {
        jsonResponse(['error' => 'Username or email already exists'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $token = generateToken();
    $app = getConfig()['app'];
    $verifyUrl = rtrim($app['url'], '/') . '/verify/' . $token;

    $insertStmt = $db->prepare(
        'INSERT INTO users (username, email, password_hash, verified, verification_token, verification_expires)
         VALUES (:username, :email, :password_hash, 0, :token, DATE_ADD(NOW(), INTERVAL 24 HOUR))'
    );
    $insertStmt->execute([
        ':username' => $username,
        ':email' => $email,
        ':password_hash' => $passwordHash,
        ':token' => $token,
    ]);

    $subject = 'Verify your ScreenCapture account';
    $bodyHtml = '<p>Hello ' . htmlspecialchars($username, ENT_QUOTES, 'UTF-8') . ',</p>' .
        '<p>Please verify your account by clicking the link below:</p>' .
        '<p><a href="' . htmlspecialchars($verifyUrl, ENT_QUOTES, 'UTF-8') . '">Verify Account</a></p>';

    try {
        sendMail($email, $username, $subject, $bodyHtml);
    } catch (Exception $exception) {
        jsonResponse(['error' => 'Registration succeeded but verification email failed to send'], 500);
    }

    jsonResponse(['success' => true, 'message' => 'Check your email to verify your account']);
}

handleRegister();
