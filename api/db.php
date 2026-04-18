<?php
require_once __DIR__ . '/config.php';

/**
 * Returns a PDO database connection using credentials from .config.json.
 * Uses a static variable to act as a singleton within a request.
 *
 * @return PDO
 */
function getDB(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $cfg = getConfig()['db'];
        $dsn = "mysql:host={$cfg['host']};dbname={$cfg['name']};charset=utf8mb4";
        $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    return $pdo;
}
