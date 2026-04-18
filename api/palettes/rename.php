<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Renames a user-owned palette.
 *
 * @return void
 */
function handlePaletteRename(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $id = (int) ($input['id'] ?? 0);
    $name = trim((string) ($input['name'] ?? ''));

    if ($id <= 0 || $name === '') {
        jsonResponse(['error' => 'Invalid palette data'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('UPDATE palettes SET name = :name WHERE id = :id AND user_id = :user_id');
    $stmt->execute([
        ':name' => $name,
        ':id' => $id,
        ':user_id' => $userId,
    ]);

    if ($stmt->rowCount() === 0) {
        jsonResponse(['error' => 'Palette not found'], 404);
    }

    jsonResponse(['success' => true]);
}

handlePaletteRename();
