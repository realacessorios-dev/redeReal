<?php

include_once '../../superClass/connect/class.connect_firebird.php';

class Favorecido {

  private $con;
  public $pdo;

  function __construct($id_sociedade) {
    $this->con = ConexaoFirebird::getConectar($id_sociedade);
    if (!$this->con) {
      die('{"loja":"off"}');
      return false;
    }
  }

  function getFavorecidos($loc) {
    $where = 'WHERE 1=1';
    if ($loc != '') {
      $parte = explode(' ', $loc);
      for ($i = 0; $i < sizeof($parte); $i++) {
        $where .= " AND COALESCE(A.CD_BANCO,'') ||' '|| COALESCE(B.DS_BANCO,'') ||' '|| COALESCE(B.SG_BANCO,'') ||' '|| COALESCE(A.CD_AGENCIA,'') ||' '|| COALESCE(A.NR_CONTA,'') ||' '|| COALESCE(UPPER(A.NM_FAVORECIDO),'') ||' '|| COALESCE(A.TP_VINCULO,'') ||' '|| COALESCE(A.NM_MATRIZ,'') LIKE '%" . strtoupper($parte[$i]) . "%'";
      }
    }
    $sql = "SELECT
              A.ID_FAVORECIDO,
              TRIM(A.CD_BANCO) CD_BANCO,
              B.DS_BANCO,
              B.SG_BANCO,
              A.CD_AGENCIA,
              A.NR_CONTA,
              TRIM(A.CD_OPERACAO) CD_OPERACAO,
              A.NM_FAVORECIDO,
              TRIM(A.TP_VINCULO) TP_VINCULO,
              TRIM(A.NR_CPF) NR_CPF,
              TRIM(A.NR_CNPJ) NR_CNPJ,
              A.NM_MATRIZ,
              A.TX_OBS
            FROM FAVORECIDOS A
            LEFT JOIN BANCOS B ON B.CD_BANCO = A.CD_BANCO
            $where
            ORDER BY NM_FAVORECIDO";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function getFavorecido($id_favorecido) {
    $sql = "SELECT
              A.ID_FAVORECIDO,
              TRIM(A.CD_BANCO) CD_BANCO,
              B.DS_BANCO,
              B.SG_BANCO,
              A.CD_AGENCIA,
              A.NR_CONTA,
              TRIM(A.CD_OPERACAO) CD_OPERACAO,
              A.NM_FAVORECIDO,
              TRIM(A.TP_VINCULO) TP_VINCULO,
              TRIM(A.NR_CPF) NR_CPF,
              TRIM(A.NR_CNPJ) NR_CNPJ,
              A.NM_MATRIZ,
              A.TX_OBS
            FROM FAVORECIDOS A
            LEFT JOIN BANCOS B ON B.CD_BANCO = A.CD_BANCO
            WHERE A.ID_FAVORECIDO = $id_favorecido
            ORDER BY NM_FAVORECIDO";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function addFavorecido($CD_BANCO, $CD_AGENCIA, $NR_CONTA, $CD_OPERACAO, $NM_FAVORECIDO, $TP_VINCULO, $NR_CPF, $NR_CNPJ, $NM_MATRIZ, $TX_OBS) {
    $sql = "INSERT INTO FAVORECIDOS 
          (CD_BANCO,   CD_AGENCIA,  NR_CONTA,  CD_OPERACAO,  NM_FAVORECIDO,  TP_VINCULO,  NR_CPF,  NR_CNPJ,  NM_MATRIZ,  TX_OBS) VALUES
          (:CD_BANCO, :CD_AGENCIA, :NR_CONTA, :CD_OPERACAO, :NM_FAVORECIDO, :TP_VINCULO, :NR_CPF, :NR_CNPJ, :NM_MATRIZ, :TX_OBS)";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->bindParam(':CD_BANCO', $CD_BANCO, PDO::PARAM_STR);
    $this->pdo->bindParam(':CD_AGENCIA', $CD_AGENCIA, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CONTA', $NR_CONTA, PDO::PARAM_STR);
    $this->pdo->bindParam(':CD_OPERACAO', $CD_OPERACAO, PDO::PARAM_STR);
    $this->pdo->bindParam(':NM_FAVORECIDO', $NM_FAVORECIDO, PDO::PARAM_STR);
    $this->pdo->bindParam(':TP_VINCULO', $TP_VINCULO, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CPF', $NR_CPF, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CNPJ', $NR_CNPJ, PDO::PARAM_STR);
    $this->pdo->bindParam(':NM_MATRIZ', $NM_MATRIZ, PDO::PARAM_STR);
    $this->pdo->bindParam(':TX_OBS', $TX_OBS, PDO::PARAM_STR);
    $this->pdo->execute();
  }

  function updFavorecido($ID_FAVORECIDO, $CD_BANCO, $CD_AGENCIA, $NR_CONTA, $CD_OPERACAO, $NM_FAVORECIDO, $TP_VINCULO, $NR_CPF, $NR_CNPJ, $NM_MATRIZ, $TX_OBS) {
    $sql = "UPDATE FAVORECIDOS SET
          CD_BANCO = :CD_BANCO,
          CD_AGENCIA = :CD_AGENCIA,
          NR_CONTA = :NR_CONTA,
          CD_OPERACAO = :CD_OPERACAO,
          NM_FAVORECIDO = :NM_FAVORECIDO,
          TP_VINCULO = :TP_VINCULO,
          NR_CPF = :NR_CPF,
          NR_CNPJ = :NR_CNPJ,
          NM_MATRIZ = :NM_MATRIZ,
          TX_OBS = :TX_OBS
          WHERE ID_FAVORECIDO = :ID_FAVORECIDO";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $this->pdo->bindParam(':ID_FAVORECIDO', $ID_FAVORECIDO, PDO::PARAM_INT);
    $this->pdo->bindParam(':CD_BANCO', $CD_BANCO, PDO::PARAM_STR);
    $this->pdo->bindParam(':CD_AGENCIA', $CD_AGENCIA, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CONTA', $NR_CONTA, PDO::PARAM_STR);
    $this->pdo->bindParam(':CD_OPERACAO', $CD_OPERACAO, PDO::PARAM_STR);
    $this->pdo->bindParam(':NM_FAVORECIDO', $NM_FAVORECIDO, PDO::PARAM_STR);
    $this->pdo->bindParam(':TP_VINCULO', $TP_VINCULO, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CPF', $NR_CPF, PDO::PARAM_STR);
    $this->pdo->bindParam(':NR_CNPJ', $NR_CNPJ, PDO::PARAM_STR);
    $this->pdo->bindParam(':NM_MATRIZ', $NM_MATRIZ, PDO::PARAM_STR);
    $this->pdo->bindParam(':TX_OBS', $TX_OBS, PDO::PARAM_STR);
    $this->pdo->execute();
  }

  /**
   * Lista fornecedores com dados de Favorecidos
   * @param type $loc Campos de busca: CGC_FORNECEDOR, RAZAO_SOCIAL, NOME_FANTAZIA, NOME REPRESENTANTE
   */
  function getFavorecidosOrFornecedores($loc) {
    $where = 'WHERE 1=1';
    if ($loc != '') {
      $parte = explode(' ', $loc);
      for ($i = 0; $i < sizeof($parte); $i++) {
        $where .= " AND COALESCE(A.CD_BANCO,'') || ' ' || COALESCE(B.DS_BANCO,'') || ' ' || COALESCE(B.SG_BANCO,'') || ' ' || COALESCE(A.CD_AGENCIA,'') || ' ' || COALESCE(A.NR_CONTA,'') || ' ' || COALESCE(UPPER(A.NM_FAVORECIDO),'') || ' ' || COALESCE(A.TP_VINCULO,'') || ' ' || COALESCE(A.NM_MATRIZ,'') LIKE '%" . strtoupper($parte[$i]) . "%'";
      }
    }
    $sql1 = "SELECT
              A.ID_FAVORECIDO,
              TRIM(A.CD_BANCO) CD_BANCO,
              B.DS_BANCO,
              B.SG_BANCO,
              A.CD_AGENCIA,
              A.NR_CONTA,
              TRIM(A.CD_OPERACAO) CD_OPERACAO,
              A.NM_FAVORECIDO,
              TRIM(A.TP_VINCULO) TP_VINCULO,
              TRIM(A.NR_CPF) NR_CPF,
              TRIM(A.NR_CNPJ) NR_CNPJ,
              A.NM_MATRIZ,
              A.TX_OBS
            FROM FAVORECIDOS A
            LEFT JOIN BANCOS B ON B.CD_BANCO = A.CD_BANCO
            $where";

    $where = 'WHERE NOME_FANTAZIA IS NOT NULL';
    if ($loc != '') {
      $parte = explode(' ', $loc);
      for ($i = 0; $i < sizeof($parte); $i++) {
        $where .= " AND COALESCE(CGC_FORNECEDOR,'') || ' ' || COALESCE(RAZAO_SOCIAL,'') || ' ' || COALESCE(NOME_FANTAZIA,'') LIKE '%" . $parte[$i] . "%'";
      }
    }
    $sql2 = "SELECT
            ID_FORNECEDOR ID_FAVORECIDO,
            '' CD_BANCO,
            '' DS_BANCO,
            '' SG_BANCO,
            '' CD_AGENCIA,
            '' NR_CONTA,
            '' CD_OPERACAO,
            NOME_FANTAZIA NM_FAVORECIDO,
            'FORNECEDOR' TP_VINCULO,
            '' NR_CPF,
            CGC_FORNECEDOR NR_CNPJ,
            RAZAO_SOCIAL NM_MATRIZ,
            '' TX_OBS
            FROM FORNECEDOR
            $where";
    $this->pdo = $this->con->prepare($sql1 . ' UNION ' . $sql2);
    $this->pdo->execute();
  }

}
