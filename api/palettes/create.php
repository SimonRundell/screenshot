<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Creates a new palette for the authenticated user.
 *
 * @return void
 */
function handlePaletteCreate(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $name = trim((string) ($input['name'] ?? ''));

    if ($name === '') {
        jsonResponse(['error' => 'Palette name is required'], 422);
    }

    $db = getDB();
    $stmt = $db->prepare('INSERT INTO palettes (user_id, name, created_at) VALUES (:user_id, :name, NOW())');
    $stmt->execute([
        ':user_id' => $userId,
        ':name' => $name,
    ]);

    $id = (int) $db->lastInsertId();
    $newStmt = $db->prepare('SELECT id, name, created_at FROM palettes WHERE id = :id LIMIT 1');
    $newStmt->execute([':id' => $id]);

    jsonResponse(['success' => true, 'palette' => $newStmt->fetch()]);
}

handlePaletteCreate();
