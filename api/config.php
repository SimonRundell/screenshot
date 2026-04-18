<?php
/**
 * Reads and parses the root .config.json file.
 * Returns the full config as an associative array.
 * Terminates with 500 if the file is missing or malformed.
 *
 * @return array<string, mixed>
 */
function getConfig(): array
{
    $path = dirname(__DIR__) . '/.config.json';
    if (!file_exists($path)) {
        http_response_code(500);
        die(json_encode(['error' => 'Configuration file not found']));
    }

    $config = json_decode((string) file_get_contents($path), true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($config)) {
        http_response_code(500);
        die(json_encode(['error' => 'Configuration file is invalid JSON']));
    }

    return $config;
}
