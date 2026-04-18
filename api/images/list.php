<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Lists non-expired images for the authenticated user.
 *
 * @return void
 */
function handleImageList(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $db = getDB();
    $stmt = $db->prepare(
        'SELECT id, filename, label, captured_at, expires_at
         FROM images
         WHERE user_id = :user_id AND expires_at > NOW()
         ORDER BY captured_at DESC'
    );
    $stmt->execute([':user_id' => $userId]);

    jsonResponse(['images' => $stmt->fetchAll()]);
}

handleImageList();
