<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';

/**
 * Streams a user's non-expired image by id.
 *
 * @return void
 */
function handleImageServe(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    $userId = requireAuth();
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => 'Invalid image id']);
        exit;
    }

    $db = getDB();
    $stmt = $db->prepare(
        'SELECT filename FROM images WHERE id = :id AND user_id = :user_id AND expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([
        ':id' => $id,
        ':user_id' => $userId,
    ]);
    $row = $stmt->fetch();

    if (!$row) {
        http_response_code(404);
        echo json_encode(['error' => 'Image not found']);
        exit;
    }

    $path = dirname(__DIR__, 2) . '/uploads/' . basename((string) $row['filename']);
    if (!is_file($path)) {
        http_response_code(404);
        echo json_encode(['error' => 'Image file missing']);
        exit;
    }

    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($path));
    readfile($path);
    exit;
}

handleImageServe();
