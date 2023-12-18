<?php

include_once 'class.sociedade.php';
extract($_POST);

/**
 * connectar com o banco
 */
class ConexaoFirebird {


  public static function getConectar($id_sociedade) {
    try {
      if (!isset($pdo)) {

        //Chama a class sociedade, que conecta ao banco de dados e retorna a loja
        $sociedade = new Sociedade();
        $sociedade->getLoja($id_sociedade);

        $ln = $sociedade->pdo->fetch(PDO::FETCH_OBJ);
        $host = $ln->endereco;
        $banco = $ln->banco;


        //resome o host para IP
        $IPAddress = gethostbyname($host);
      }
      //  echo $servidor . ' ' . $banco;

      $Port = '3050';
      //ping na porta 3050 do host tempo de respota de 0.9 segundos
      $fp = @fsockopen($IPAddress, $Port, $errno, $errstr, (float) 0.9);

      if (!$fp) {
        return false;
      } else {
// $pdo = new PDO("firebird:dbname=$servidor:$banco;charset=utf8;", "SYSDBA", base64_decode('MTUyMEFsdmVz'), array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $pdo = new PDO("firebird:dbname=$host:$banco;charset=utf8;", "SYSDBA", base64_decode('MTUyMEFsdmVz'), array(PDO::ATTR_PERSISTENT => true ));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        //fclose($fp);
        return $pdo;
      }
    } catch (PDOException $erro) {
      die('Servidor não está respondendo ' . $erro->getMessage());
    }
  }

}

