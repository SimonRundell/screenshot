<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Deletes a user's image file and row.
 *
 * @return void
 */
function handleImageDelete(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $id = (int) ($input['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['error' => 'Invalid image id'], 422);
    }

    $db = getDB();
    $selectStmt = $db->prepare('SELECT filename FROM images WHERE id = :id AND user_id = :user_id LIMIT 1');
    $selectStmt->execute([
        ':id' => $id,
        ':user_id' => $userId,
    ]);
    $image = $selectStmt->fetch();

    if (!$image) {
        jsonResponse(['error' => 'Image not found'], 404);
    }

    $path = dirname(__DIR__, 2) . '/uploads/' . basename((string) $image['filename']);
    if (is_file($path)) {
        @unlink($path);
    }

    $deleteStmt = $db->prepare('DELETE FROM images WHERE id = :id AND user_id = :user_id');
    $deleteStmt->execute([
        ':id' => $id,
        ':user_id' => $userId,
    ]);

    jsonResponse(['success' => true]);
}

handleImageDelete();
