<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Saves a colour for the authenticated user.
 *
 * @return void
 */
function handleColourSave(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $input = readJsonInput();

    $hex = strtolower(trim((string) ($input['hex'] ?? '')));
    $rgbR = (int) ($input['rgb_r'] ?? -1);
    $rgbG = (int) ($input['rgb_g'] ?? -1);
    $rgbB = (int) ($input['rgb_b'] ?? -1);
    $hslH = (int) ($input['hsl_h'] ?? -1);
    $hslS = (int) ($input['hsl_s'] ?? -1);
    $hslL = (int) ($input['hsl_l'] ?? -1);
    $imageId = isset($input['image_id']) ? (int) $input['image_id'] : null;
    $label = trim((string) ($input['label'] ?? ''));

    if (!preg_match('/^#[0-9a-f]{6}$/', $hex) || $rgbR < 0 || $rgbR > 255 || $rgbG < 0 || $rgbG > 255 ||
        $rgbB < 0 || $rgbB > 255 || $hslH < 0 || $hslH > 360 || $hslS < 0 || $hslS > 100 || $hslL < 0 || $hslL > 100) {
        jsonResponse(['error' => 'Invalid colour payload'], 422);
    }

    $db = getDB();
    if ($imageId !== null && $imageId > 0) {
        $imageStmt = $db->prepare('SELECT id FROM images WHERE id = :id AND user_id = :user_id LIMIT 1');
        $imageStmt->execute([':id' => $imageId, ':user_id' => $userId]);
        if (!$imageStmt->fetch()) {
            jsonResponse(['error' => 'Invalid image id'], 422);
        }
    } else {
        $imageId = null;
    }

    $stmt = $db->prepare(
        'INSERT INTO colours (user_id, image_id, hex, rgb_r, rgb_g, rgb_b, hsl_h, hsl_s, hsl_l, label)
         VALUES (:user_id, :image_id, :hex, :rgb_r, :rgb_g, :rgb_b, :hsl_h, :hsl_s, :hsl_l, :label)'
    );
    $stmt->execute([
        ':user_id' => $userId,
        ':image_id' => $imageId,
        ':hex' => $hex,
        ':rgb_r' => $rgbR,
        ':rgb_g' => $rgbG,
        ':rgb_b' => $rgbB,
        ':hsl_h' => $hslH,
        ':hsl_s' => $hslS,
        ':hsl_l' => $hslL,
        ':label' => $label === '' ? null : $label,
    ]);

    $id = (int) $db->lastInsertId();
    $newStmt = $db->prepare('SELECT * FROM colours WHERE id = :id LIMIT 1');
    $newStmt->execute([':id' => $id]);

    jsonResponse(['success' => true, 'colour' => $newStmt->fetch()]);
}

handleColourSave();
