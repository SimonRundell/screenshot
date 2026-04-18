<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';

/**
 * Lists colours for the authenticated user, optionally by image.
 *
 * @return void
 */
function handleColourList(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    $imageId = isset($_GET['image_id']) ? (int) $_GET['image_id'] : null;

    $db = getDB();
    if ($imageId !== null && $imageId > 0) {
        $stmt = $db->prepare('SELECT * FROM colours WHERE user_id = :user_id AND image_id = :image_id ORDER BY saved_at DESC');
        $stmt->execute([
            ':user_id' => $userId,
            ':image_id' => $imageId,
        ]);
    } else {
        $stmt = $db->prepare('SELECT * FROM colours WHERE user_id = :user_id ORDER BY saved_at DESC');
        $stmt->execute([':user_id' => $userId]);
    }

    jsonResponse(['colours' => $stmt->fetchAll()]);
}

handleColourList();
