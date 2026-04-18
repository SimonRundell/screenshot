<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Removes a colour from a user-owned palette.
 *
 * @return void
 */
function handlePaletteRemoveColour(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();
    $paletteId = (int) ($input['palette_id'] ?? 0);
    $colourId = (int) ($input['colour_id'] ?? 0);

    if ($paletteId <= 0 || $colourId <= 0) {
        jsonResponse(['error' => 'Invalid palette or colour id'], 422);
    }

    $db = getDB();
    $paletteStmt = $db->prepare('SELECT id FROM palettes WHERE id = :id AND user_id = :user_id LIMIT 1');
    $paletteStmt->execute([':id' => $paletteId, ':user_id' => $userId]);
    if (!$paletteStmt->fetch()) {
        jsonResponse(['error' => 'Palette not found'], 404);
    }

    $deleteStmt = $db->prepare('DELETE FROM palette_colours WHERE palette_id = :palette_id AND colour_id = :colour_id');
    $deleteStmt->execute([
        ':palette_id' => $paletteId,
        ':colour_id' => $colourId,
    ]);

    jsonResponse(['success' => true]);
}

handlePaletteRemoveColour();
