<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Updates a label on a user's image.
 *
 * @return void
 */
function handleImageLabel(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $id = (int) ($input['id'] ?? 0);
    $label = trim((string) ($input['label'] ?? ''));

    if ($id <= 0) {
        jsonResponse(['error' => 'Invalid image id'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('UPDATE images SET label = :label WHERE id = :id AND user_id = :user_id');
    $stmt->execute([
        ':label' => $label === '' ? null : $label,
        ':id' => $id,
        ':user_id' => $userId,
    ]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Image not found'], 404);
    }

    jsonResponse(['success' => true]);
}

handleImageLabel();
