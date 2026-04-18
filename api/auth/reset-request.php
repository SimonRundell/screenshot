<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../mail.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../config.php';

/**
 * Handles password reset token requests without revealing user existence.
 *
 * @return void
 */
function handleResetRequest(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $input = readJsonInput();
    $email = strtolower(trim((string) ($input['email'] ?? '')));

    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['success' => true]);
    }

    $db = getDB();
    $userStmt = $db->prepare('SELECT id, username, email FROM users WHERE email = :email LIMIT 1');
    $userStmt->execute([':email' => $email]);
    $user = $userStmt->fetch();

    if ($user) {
        $token = generateToken();
        $updateStmt = $db->prepare(
            'UPDATE users SET reset_token = :token, reset_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = :id'
        );
        $updateStmt->execute([
            ':token' => $token,
            ':id' => $user['id'],
        ]);

        $app = getConfig()['app'];
        $resetUrl = rtrim($app['url'], '/') . '/reset/' . $token;
        $subject = 'Reset your ScreenCapture password';
        $bodyHtml = '<p>Hello ' . htmlspecialchars($user['username'], ENT_QUOTES, 'UTF-8') . ',</p>' .
            '<p>You can reset your password using this link:</p>' .
            '<p><a href="' . htmlspecialchars($resetUrl, ENT_QUOTES, 'UTF-8') . '">Reset Password</a></p>';

        try {
            sendMail($user['email'], $user['username'], $subject, $bodyHtml);
        } catch (Exception $exception) {
            // Intentionally ignored to prevent user enumeration.
        }
    }

    jsonResponse(['success' => true]);
}

handleResetRequest();
