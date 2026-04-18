<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/config.php';

/**
 * Returns public app config only.
 *
 * @return void
 */
function handleAppConfig(): void
{
    $config = getConfig();
    echo json_encode(['app' => $config['app']]);
}

handleAppConfig();
