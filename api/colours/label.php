<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Updates the label of a saved colour.
 *
 * @return void
 */
function handleColourLabel(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $id = (int) ($input['id'] ?? 0);
    $label = trim((string) ($input['label'] ?? ''));

    if ($id <= 0) {
        jsonResponse(['error' => 'Invalid colour id'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('UPDATE colours SET label = :label WHERE id = :id AND user_id = :user_id');
    $stmt->execute([
        ':label' => $label === '' ? null : $label,
        ':id' => $id,
        ':user_id' => $userId,
    ]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Colour not found'], 404);
    }

    jsonResponse(['success' => true]);
}

handleColourLabel();
