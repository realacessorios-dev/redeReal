
<?php

/*
  Supondo que o arquivo esteja dentro do
  diretório raíz e sub-diretório phpmailer/
 */
require "class.phpmailer.php";

// Estrutura HTML da mensagem
$msg = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">";
$msg .= "<html>";
$msg .= "<head></head>";
$msg .= "<body>";
//$msg .= $mensagem;
$msg .= 'Isso é um pequeno teste de email';
$msg .= "</body>";
$msg .= "</html>";

// Abaixo começaremos a utilizar o PHPMailer.

/*
  Aqui criamos uma nova instância da classe como $mail.
  Todas as características, funções e métodos da classe
  poderão ser acessados através da variável (objeto) $mail.
 */
$mail = new PHPMailer(); //
// Define o método de envio
$mail->Mailer = "smtp";

// Define que a mensagem poderá ter formatação HTML
$mail->IsHTML(true); //
// Define que a codificação do conteúdo da mensagem será utf-8
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
$mail->FromName = "Francisco Alves";

// Define o destinatário que receberá a mensagem
$mail->AddAddress("xicoas@gmail.com");
$mail->AddAddress("dffrancisco@gmail.com");

$mail->AddAttachment('mpdf.pdf');

/*
  Define o email que receberá resposta desta
  mensagem, quando o destinatário responder
 */
$mail->AddReplyTo($mail->From, $mail->FromName);

// Assunto da mensagem
$mail->Subject = "Esse email é um teste";

// Toda a estrutura HTML e corpo da mensagem
$mail->Body = $msg;

// Controle de erro ou sucesso no envio
if (!$mail->Send()) {
  echo "Erro de envio: " . $mail->ErrorInfo;
} else {
  echo "Mensagem enviada com sucesso!";
}
?>
