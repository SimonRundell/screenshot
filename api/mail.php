<?php
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/config.php';

/**
 * Sends an email using SMTP credentials from .config.json.
 *
 * @param string $toEmail Recipient email address.
 * @param string $toName Recipient display name.
 * @param string $subject Email subject line.
 * @param string $bodyHtml HTML email body.
 * @return bool
 * @throws Exception
 */
function sendMail(string $toEmail, string $toName, string $subject, string $bodyHtml): bool
{
    $cfg = getConfig();
    $smtp = $cfg['smtp'];

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtp['user'];
    $mail->Password = $smtp['pass'];
    $mail->SMTPSecure = $smtp['encryption'];
    $mail->Port = (int) $smtp['port'];
    $mail->setFrom($smtp['from_address'], $smtp['from_name']);
    $mail->addAddress($toEmail, $toName);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $bodyHtml;

    return $mail->send();
}
