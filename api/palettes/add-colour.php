<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Adds a user-owned colour to a user-owned palette.
 *
 * @return void
 */
function handlePaletteAddColour(): void
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

    $colourStmt = $db->prepare('SELECT id FROM colours WHERE id = :id AND user_id = :user_id LIMIT 1');
    $colourStmt->execute([':id' => $colourId, ':user_id' => $userId]);
    if (!$colourStmt->fetch()) {
        jsonResponse(['error' => 'Colour not found'], 404);
    }

    $orderStmt = $db->prepare('SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM palette_colours WHERE palette_id = :palette_id');
    $orderStmt->execute([':palette_id' => $paletteId]);
    $nextOrder = (int) $orderStmt->fetch()['next_order'];

    $insertStmt = $db->prepare(
        'INSERT IGNORE INTO palette_colours (palette_id, colour_id, sort_order)
         VALUES (:palette_id, :colour_id, :sort_order)'
    );
    $insertStmt->execute([
        ':palette_id' => $paletteId,
        ':colour_id' => $colourId,
        ':sort_order' => $nextOrder,
    ]);

    jsonResponse(['success' => true]);
}

handlePaletteAddColour();
