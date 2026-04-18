<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Lists palettes with colours for the authenticated user.
 *
 * @return void
 */
function handlePaletteList(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $db = getDB();

    $paletteStmt = $db->prepare('SELECT id, name, created_at FROM palettes WHERE user_id = :user_id ORDER BY created_at DESC');
    $paletteStmt->execute([':user_id' => $userId]);
    $palettes = $paletteStmt->fetchAll();

    $colourStmt = $db->prepare(
        'SELECT c.*, pc.palette_id, pc.sort_order
         FROM palette_colours pc
         INNER JOIN colours c ON c.id = pc.colour_id
         INNER JOIN palettes p ON p.id = pc.palette_id
         WHERE p.user_id = :user_id
         ORDER BY pc.sort_order ASC, pc.id ASC'
    );
    $colourStmt->execute([':user_id' => $userId]);
    $rows = $colourStmt->fetchAll();

    $byPalette = [];
    foreach ($rows as $row) {
        $paletteId = (int) $row['palette_id'];
        if (!isset($byPalette[$paletteId])) {
            $byPalette[$paletteId] = [];
        }
        $byPalette[$paletteId][] = $row;
    }

    foreach ($palettes as &$palette) {
        $pid = (int) $palette['id'];
        $palette['colours'] = $byPalette[$pid] ?? [];
    }

    jsonResponse(['palettes' => $palettes]);
}

handlePaletteList();
