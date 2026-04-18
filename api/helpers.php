<?php

/**
 * Reads JSON input from request body and returns an array.
 *
 * @return array<string, mixed>
 */
function readJsonInput(): array
{
    $raw = (string) file_get_contents('php://input');
    if ($raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Sends a JSON response and exits.
 *
 * @param array<string, mixed> $payload
 * @param int $statusCode
 * @return void
 */
function jsonResponse(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

/**
 * Builds a random token using secure bytes.
 *
 * @return string
 */
function generateToken(): string
{
    return bin2hex(random_bytes(32));
}
