<?php

include_once('class.connect_firebird.php');

class index {

  public $pdo;
  private $con;

  public function __construct($id_sociedade) {
    $this->con = ConexaoFirebird::getConectar($id_sociedade);
    if (!$this->con) {
      die('{"loja":"off"}');
      return false;
    }
  }

  public function getDataHoraServidor() {
    $sql = 'SELECT
            EXTRACT(DAY FROM CURRENT_DATE) AS DIA,
            EXTRACT(MONTH FROM CURRENT_DATE) AS MES,
            EXTRACT(YEAR FROM CURRENT_DATE) AS ANO,
            EXTRACT(HOUR FROM CURRENT_TIME) AS H,
            EXTRACT(MINUTE FROM CURRENT_TIME) AS M,
            EXTRACT(SECOND FROM CURRENT_TIME) AS S
            FROM RDB$DATABASE';
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  public function getEmpresa() {
//      $sql = "SELECT SUBSTRING(A.RAZAO_SOCIAL FROM 1 FOR 35) AS RAZAO_SOCIAL, A.INSCRICAO, A.ENDERECO, A.CGC_EMPRESA "
//              . "FROM empresa A, CIDADES B "
//              . "WHERE A.COD_CIDADE = B.COD_CIDADE";

    $sql = "SELECT BAIRRO, CEP, CGC_EMPRESA, ENDERECO, BAIRRO, INSCRICAO, NOME_FANTAZIA, B.DESCRICAO AS CIDADE, B.UF, DESCONTO_GERAL,
            SUBSTRING(RAZAO_SOCIAL FROM 1 FOR 35) AS RAZAO_SOCIAL, TELEFONE1
            FROM EMPRESA A, CIDADES B
            WHERE A.COD_CIDADE = B.COD_CIDADE";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  public function getDuplicado($tabela, $campo, $valor) {
    $sql = "SELECT FIRST 1 $campo FROM $tabela
            WHERE $campo = '$valor'";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

}
