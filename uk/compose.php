<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/PHPMailer/src/Exception.php';
require 'vendor/PHPMailer/src/PHPMailer.php';
require 'vendor/PHPMailer/src/SMTP.php';

$config = [
    'smtp' => [
        'host' => 'smtps.swissinfocloud.ch',
        'user' => 'support@cepheus-pay.com',
        'passwd' => 'Olovo860Rang^'
    ],

    'form' => [
        'cv' => [
            'subject' => 'CV form',
            'from' => [
                'email' => 'info@cepheus-pay.com',
                'name' => 'Cepheus - Canada'
            ],
            'to' => [
                'info@cepheus-pay.com'
            ]
        ],
        'subscribe' => [
            'subject' => 'Subscribe form',
            'from' => [
                'email' => 'info@cepheus-pay.com',
                'name' => 'Cepheus - Canada'
            ],
            'to' => [
                'info@cepheus-pay.com'
            ]
        ]
    ]
];

$formName = $_POST['form'] ?? null;

if (!isset($config['form'][$formName])) {
    return 'ERROR';
}

unset($_POST['form']);

$mail = new PHPMailer(true);
try {
    //Server settings
    /*$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtps.swissinfocloud.ch';              //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'support@cepheus-pay.com';              //SMTP username
    $mail->Password   = 'Olovo860Rang^';                        //SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
    $mail->Port       = 587;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
*/

    $body = [];

    foreach ($_POST as $key => $value) {
        $body[] = $key.': '.$value;
    }

    if (isset($_FILES['uploadFile'])) {
        // Some more validate???
        if (is_uploaded_file($_FILES['uploadFile']['tmp_name'])) {
            $mail->addAttachment($_FILES['uploadFile']['tmp_name'], basename($_FILES['uploadFile']['name']));
        }
    }

    $mailConfig = $config['form'][$formName];

    $mail->setFrom($mailConfig['from']['email'], $mailConfig['from']['name']);
    foreach ($mailConfig['to'] as $to) {
        $mail->addAddress($to);
    }

    $mail->Body = implode("\n", $body);
    $mail->Subject = $mailConfig['subject'];

    $mail->send();
    echo 'OK';
} catch (Exception $e) {
    print_r($e);
    echo 'ERROR';
}
