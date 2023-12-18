<?php

require "../plugins/PHPMailer_v5.1/class.phpmailer.php";

extract($_POST);

$bodyEmail = file_get_contents('bodyEmail.html');

$bodyEmail = str_replace('{razao_social}', $loja, $bodyEmail);
$bodyEmail = str_replace('{telefone}', $tel, $bodyEmail);
$bodyEmail = str_replace('{endereco}', $endereco, $bodyEmail);
$bodyEmail = str_replace('{cidade}', $cidade, $bodyEmail);
$bodyEmail = str_replace('{cep}', $cep, $bodyEmail);
$bodyEmail = str_replace('{historico}', $historico, $bodyEmail);

// Estrutura HTML da mensagem
$msg = '<!DOCTYPE html lang="pt-br">';
$msg .= "<html>";
$msg .= '<head><meta charset="UTF-8"></head>';
$msg .= "<body>";
//$msg .= $mensagem;
$msg .= $bodyEmail;
$msg .= "</body>";
$msg .= "</html>";

// Abaixo começaremos a utilizar o PHPMailer.

$mail = new PHPMailer(); //
$mail->Mailer = "smtp";

$mail->IsHTML(true); //
$mail->CharSet = "utf-8";
// Define que os emails enviadas utilizarão SMTP Seguro tls
//$mail->SMTPSecure = "tls";
// Define que o Host que enviará a mensagem é o Gmail
$mail->Host = "smtp.reallatas.com.br";

//Define a porta utilizada pelo Gmail para o envio autenticado
$mail->Port = "587";

// Deine que a mensagem utiliza método de envio autenticado
$mail->SMTPAuth = "true";

// Define o usuário do gmail autenticado responsável pelo envio
$mail->Username = "webmaster@reallatas.com.br";

// Define a senha deste usuário citado acima
$mail->Password = "alves152056";

// Defina o email e o nome que aparecerá como remetente no cabeçalho
$mail->From = "webmaster@reallatas.com.br"; //quem manda
$mail->FromName = "Real Acessórios";

// Define o destinatário que receberá a mensagem


$emails = explode(',', $email);

foreach ($emails as $key => $value) {
//  echo trim(strtolower($value));
  $mail->AddAddress(trim(strtolower($value)));
}

//$mail->AddAddress("XICOAS@GMAIL.COM");
//$mail->AddAddress("DFFRANCISCO@GMAIL.COM");


/*
  Define o email que receberá resposta desta
  mensagem, quando o destinatário responder
 */
$mail->AddReplyTo($mailComprador, $mail->FromName);

// Assunto da mensagem
$mail->Subject = $assunto . "Real Acessórios";

// Toda a estrutura HTML e corpo da mensagem
$mail->Body = $msg;

// Controle de erro ou sucesso no envio
if (!$mail->Send()) {
  echo '{"erro":"Email com problema. Não foi enviado"}' . $mail->ErrorInfo;
} else {
  echo '{"ok":"ok"}';
}




