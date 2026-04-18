<?php
require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../config.php';

/**
 * Handles screenshot PNG uploads for authenticated users.
 *
 * @return void
 */
function handleImageUpload(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['error' => 'Method not allowed'], 405);
    }

    $userId = requireAuth();
    if (!isset($_FILES['screenshot'])) {
        jsonResponse(['error' => 'Missing screenshot upload'], 422);
    }

    $file = $_FILES['screenshot'];
    if (!is_array($file) || (int) $file['error'] !== UPLOAD_ERR_OK) {
        jsonResponse(['error' => 'Upload failed'], 400);
    }

    $appConfig = getConfig()['app'];
    $maxSize = ((int) $appConfig['max_image_size_mb']) * 1024 * 1024;
    if ((int) $file['size'] > $maxSize) {
        jsonResponse(['error' => 'File too large'], 413);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file((string) $file['tmp_name']);
    if ($mime !== 'image/png') {
        jsonResponse(['error' => 'Only PNG uploads are allowed'], 422);
    }

    $filename = $userId . '_' . uniqid('', true) . '.png';
    $uploadDir = dirname(__DIR__, 2) . '/uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $destination = $uploadDir . '/' . $filename;
    if (!move_uploaded_file((string) $file['tmp_name'], $destination)) {
        jsonResponse(['error' => 'Unable to save image'], 500);
    }

    $db = getDB();
    $stmt = $db->prepare(
        'INSERT INTO images (user_id, filename, captured_at, expires_at)
         VALUES (:user_id, :filename, NOW(), DATE_ADD(NOW(), INTERVAL :days DAY))'
    );
    $stmt->bindValue(':user_id', $userId, PDO::PARAM_INT);
    $stmt->bindValue(':filename', $filename, PDO::PARAM_STR);
    $stmt->bindValue(':days', (int) $appConfig['image_retention_days'], PDO::PARAM_INT);
    $stmt->execute();

    $id = (int) $db->lastInsertId();
    $infoStmt = $db->prepare('SELECT id, filename, label, captured_at, expires_at FROM images WHERE id = :id LIMIT 1');
    $infoStmt->execute([':id' => $id]);
    $image = $infoStmt->fetch();

    jsonResponse(['success' => true, 'image' => $image]);
}

handleImageUpload();
