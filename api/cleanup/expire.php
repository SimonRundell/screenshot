<?php
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../config.php';

const CLEANUP_ON_LOGIN = true;

/**
 * Deletes expired images from disk and database.
 *
 * @param bool $writeLog Whether to append run details to log file.
 * @return array<string, int>
 */
function runImageExpiryCleanup(bool $writeLog = true): array
{
    $db = getDB();
    $selectStmt = $db->prepare('SELECT id, filename FROM images WHERE expires_at < NOW()');
    $selectStmt->execute();
    $expired = $selectStmt->fetchAll();

    $uploadDir = dirname(__DIR__, 2) . '/uploads';
    $removedFiles = 0;

    foreach ($expired as $row) {
        $filename = basename((string) $row['filename']);
        $path = $uploadDir . '/' . $filename;
        if (is_file($path) && @unlink($path)) {
            $removedFiles++;
        }
    }

    $deleteStmt = $db->prepare('DELETE FROM images WHERE expires_at < NOW()');
    $deleteStmt->execute();
    $deletedRows = $deleteStmt->rowCount();

    $result = [
        'matched' => count($expired),
        'files_deleted' => $removedFiles,
        'rows_deleted' => $deletedRows,
    ];

    if ($writeLog) {
        $line = sprintf(
            "[%s] matched=%d files_deleted=%d rows_deleted=%d\n",
            date('Y-m-d H:i:s'),
            $result['matched'],
            $result['files_deleted'],
            $result['rows_deleted']
        );
        file_put_contents(__DIR__ . '/expire.log', $line, FILE_APPEND);
    }

    return $result;
}

if (PHP_SAPI === 'cli') {
    $result = runImageExpiryCleanup(true);
    echo json_encode(['success' => true, 'result' => $result], JSON_PRETTY_PRINT) . PHP_EOL;
    exit;
}
