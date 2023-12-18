<?php

include_once('class.connect_mysql.php');

class Onde {

  private $CGC;
  private $id_sociedade;
  private $Razao;
  private $con;
  public $pdo;

  public function __construct() {
    $this->con = ConexaoMysql::getConectar();
  }

  public function getLoja($ip = '') {

    if ($ip == '')
      $ip_cliente = getenv('REMOTE_ADDR');
    else
      $ip_cliente = $ip;
    
    $retorno = '';

    $sqlSociedade = "select id_sociedade, endereco, cnpj, loja from sociedade";
    $this->pdo = $this->con->prepare($sqlSociedade);
    $this->pdo->execute();

    while ($ln = $this->pdo->fetch(PDO::FETCH_OBJ)) {
      $hostLoja = gethostbyname($ln->endereco);
      if ($hostLoja == $ip_cliente) {
        $retorno = $ln->id_sociedade;
        $this->CGC = $ln->cnpj;
        $this->id_sociedade = $ln->id_sociedade;
        $this->Razao = $ln->loja;
        break;
      }
    }

    if ($retorno != '') {
      return $retorno;
    } else {
      return 'false';
    }
  }

  public function GetCGCLoja() {
    return $this->CGC;
  }

  public function GetIdSociedadeLoja() {
    return $this->id_sociedade;
  }

  public function GetRazao() {
    return $this->Razao;
  }

}
