<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Deletes a saved colour owned by the user.
 *
 * @return void
 */
function handleColourDelete(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $id = (int) ($input['id'] ?? 0);

    if ($id <= 0) {
        jsonResponse(['error' => 'Invalid colour id'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('DELETE FROM colours WHERE id = :id AND user_id = :user_id');
    $stmt->execute([
        ':id' => $id,
        ':user_id' => $userId,
    ]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Colour not found'], 404);
    }

    jsonResponse(['success' => true]);
}

handleColourDelete();
