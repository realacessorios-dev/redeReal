<?php

include_once '../../superClass/connect/class.connect_firebird.php';
extract($_POST);

class Fornecedores {

  private $con;
  public $pdo;

  function __construct($id_sociedade) {
    $this->con = ConexaoFirebird::getConectar($id_sociedade);
    if (!$this->con) {
      die('{"loja":"off"}');
      return false;
    }
  }

  /**
   * Lista todos fornecedores cadastrados que tenham NOME_FANTAZIA
   */
  public function getFornecedores() {
    $sql = "SELECT ID_FORNECEDOR, NOME_FANTAZIA, CGC_FORNECEDOR FROM FORNECEDOR
            WHERE NOME_FANTAZIA IS NOT NULL
            ORDER BY NOME_FANTAZIA, CGC_FORNECEDOR";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  public function getFornecedor($id_fornecedor) {
    $sql = "SELECT ID_FORNECEDOR, CGC_FORNECEDOR, RAZAO_SOCIAL, NOME_FANTAZIA, INSC_ESTADUAL, ENDERECO,
            COD_CIDADE, BAIRRO, TELEFONE1, TELEFONE2, FAX, CEP, HOME_PAGE, EMAIL, CADASTRO, MUNICIPIO, CONTADO, ID_REPRESENTANTE, OBS
            FROM FORNECEDOR     
            WHERE NOME_FANTAZIA IS NOT NULL
            AND ID_FORNECEDOR = $id_fornecedor";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

}
