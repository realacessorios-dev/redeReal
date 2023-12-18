<?php

include_once '../../superClass/connect/class.connect_firebird.php';

class GerenciarContasApagar {

  private $con;
  public $pdo;

  function __construct($id_sociedade) {
    $this->con = ConexaoFirebird::getConectar($id_sociedade);
    if (!$this->con) {
      die('{"loja":"off"}');
      return false;
    }
  }

  function insert($tabela, $arrayCampos) {

    $sql = "INSERT INTO $tabela ";

    unset($arrayCampos['ax']);
    unset($arrayCampos['id_sociedade']);

    $campNome = '(';
    $campNomeValue = '(';

    foreach ($arrayCampos as $key => $value) {
      $campNome .= $key . ', ';
      $campNomeValue .= ":$key" . ', ';
      $insert[":$key"] = mb_strtoupper($value, 'utf-8');
    }

    $sql = $sql . substr($campNome, 0, -2) . ') values ' . substr($campNomeValue, 0, -2) . ')';

    $this->pdo = $this->con->prepare($sql);
    try {
      $this->pdo->execute($insert);
      return array('ok' => $this->pdo->rowCount(), 'error' => ''); //'{"retorno":"' . $this->pdo->rowCount() . '"}';
    } catch (PDOException $e) {
      return array('ok' => '', 'error' => $e->errorCode());
    }
  }

  /**
   *
   * @param type $tabela
   * @param type $arrayCampos
   * @param type $where_and
   * exemplo do Where_and-> campo = :campo and campo1 = :campo2
   * não é preciso passar a sintaxe where
   * @return type
   */
  function update($tabela, $arrayCampos, $where_and) {
    unset($arrayCampos['ax']);
    unset($arrayCampos['id_sociedade']);

    $sql = "UPDATE $tabela";
    $sqlCamp = '';
    foreach ($arrayCampos as $key => $value) {
      $sqlCamp .= $key . ' = :' . $key . ', ';
      $post[":$key"] = $value;
    }

    $sql = $sql . ' SET ' . substr($sqlCamp, 0, -2) . ' WHERE ' . $where_and;
    $this->pdo = $this->con->prepare($sql);
    try {
      $this->pdo->execute($post);
      return array('ok' => $this->pdo->rowCount(), 'error' => $this->pdo->errorCode()); //'{"retorno":"' . $this->pdo->rowCount() . '"}';
    } catch (PDOException $e) {
      return array('ok' => '', 'error' => $this->pdo->errorCode());
    }
  }

// nf
  function getNF($loc) {
    $parte = explode(' ', $loc);
    $where = '';
    for ($i = 0; $i < sizeof($parte); $i++) {
// $where .= " AND A.NUM_NOTA_FISCAL || C.RAZAO_SOCIAL || C.NOME_FANTAZIA || B.DATA_VENCIMENTO || B.VALOR LIKE '%" . $parte[$i] . "%'";
      $where .= "AND A.NUM_NOTA_FISCAL ||' '|| C.RAZAO_SOCIAL ||' '|| C.NOME_FANTAZIA ||' '||
            EXTRACT(DAY FROM B.DATA_VENCIMENTO) ||'/'||EXTRACT(MONTH FROM B.DATA_VENCIMENTO)||'/'||EXTRACT(YEAR FROM B.DATA_VENCIMENTO) ||' '||
            LPAD(EXTRACT(DAY FROM B.DATA_VENCIMENTO),2,'0') ||'/'|| LPAD(EXTRACT(MONTH FROM B.DATA_VENCIMENTO),2,'0')||'/'||EXTRACT(YEAR FROM B.DATA_VENCIMENTO)||' '||
            REPLACE(B.VALOR, '.', ',') LIKE REPLACE('%" . $parte[$i] . "%', '.', '')";
    }
    $sql = "
SELECT A.ID_NOTA_FISCAL, A.NUM_NOTA_FISCAL, C.RAZAO_SOCIAL, C.NOME_FANTAZIA, B.ID_FATURAS_APAGAR, COALESCE(B.DATA_QUITACAO, '')
DATA_QUITACAO, COALESCE(B.DATA_CORREIO, '') DATA_CORREIO, B.COD_FATURA, B.DATA_VENCIMENTO, B.VALOR, B.TIPO
FROM ENTRADA_NOTA_FISCAL A, FATURAS_APAGAR B, FORNECEDOR C
WHERE B.ID_NOTA_FISCAL = A.ID_NOTA_FISCAL AND C.ID_FORNECEDOR = A.ID_FORNECEDOR
$where
ORDER BY DATA_VENCIMENTO DESC, VALOR ASC";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function getCabecalho($id_nota_fiscal) {
    $sql = "SELECT B.NOME_FANTAZIA FORNECEDOR_FANTASIA, B.RAZAO_SOCIAL FORNECEDOR_RAZAO, A.NUM_NOTA_FISCAL, A.DATA_EMISSAO, A.DATA_ENTRADA, A.VALOR_NOTA_FISCAL, A.NUM_NOTIFICACAO,
            C.RAZAO_SOCIAL TRANSPORTADORA_RAZAO, A.DATA_ENTRADA_ESTADO
            FROM ENTRADA_NOTA_FISCAL A, FORNECEDOR B
            LEFT JOIN TRANSPORTADORA C ON C.ID_TRANSPORTADORA = A.ID_TRANPORTADORA
            WHERE B.ID_FORNECEDOR = A.ID_FORNECEDOR
            AND A.ID_NOTA_FISCAL = $id_nota_fiscal";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function getFaturas($id_nota_fiscal) {
    $sql = "SELECT ID_FATURAS_APAGAR, COD_FATURA, DATA_VENCIMENTO, VALOR, DATA_QUITACAO, QUITACAO, DATA_CORREIO, TRIM(TIPO) TIPO, ID_FAVORECIDO, ID_FORNECEDOR
            FROM FATURAS_APAGAR
            WHERE ID_NOTA_FISCAL = $id_nota_fiscal";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function postFatura($ID_FATURA, $DATA_VENCIMENTO, $VLR_FATURA, $DATA_CORREIO, $DATA_QUITACAO, $QUITACAO, $TIPO, $ID_FAVORECIDO, $VINCULO) {
    if ($DATA_CORREIO === '') {
      $DATA_CORREIO = "DATA_CORREIO = null";
    } else {
      $DATA_CORREIO = "DATA_CORREIO = '$DATA_CORREIO'";
    }
    if ($DATA_QUITACAO === '') {
      $DATA_QUITACAO = "DATA_QUITACAO = null";
    } else {
      $DATA_QUITACAO = "DATA_QUITACAO = '$DATA_QUITACAO'";
    }
    if ($QUITACAO === '') {
      $QUITACAO = "QUITACAO = null";
    } else {
      $QUITACAO = "QUITACAO = $QUITACAO";
    }
    if (substr($VINCULO, 0, 2) !== "FO") {
      if (($ID_FAVORECIDO === '') || ($TIPO != 'CHE' && $TIPO != 'DEP')) {
        $ID_FAVORECIDO = "ID_FAVORECIDO = null, ID_FORNECEDOR = null";
      } else {
        $ID_FAVORECIDO = "ID_FAVORECIDO = $ID_FAVORECIDO, ID_FORNECEDOR = null";
      }
    } else {
      if ($ID_FAVORECIDO == '') {
        $ID_FAVORECIDO = "ID_FAVORECIDO = null, ID_FORNECEDOR = null";
      } else {
        $ID_FAVORECIDO = "ID_FAVORECIDO = null, ID_FORNECEDOR = $ID_FAVORECIDO";
      }
    }
    $sql = "UPDATE FATURAS_APAGAR
            SET DATA_VENCIMENTO = '$DATA_VENCIMENTO', VALOR = $VLR_FATURA,
            $DATA_CORREIO, $DATA_QUITACAO, $QUITACAO, TIPO = '$TIPO', $ID_FAVORECIDO
            WHERE ID_FATURAS_APAGAR = $ID_FATURA";
    $this->pdo = $this->con->prepare($sql);
//    $this->pdo->execute();
//    return $this->pdo->rowCount();
    try {
      $this->pdo->execute();
      return array('ok' => $this->pdo->rowCount(), 'error' => $this->pdo->errorCode()); //'{"retorno":"' . $this->pdo->rowCount() . '"}';
    } catch (PDOException $e) {
      return array('ok' => '', 'error' => $this->pdo->errorCode());
    }
  }

  function getFatura($id_fatura) {
    $sql = "SELECT ID_FATURAS_APAGAR, COD_FATURA, DATA_VENCIMENTO, VALOR, DATA_QUITACAO, QUITACAO, DATA_CORREIO, TIPO
            FROM FATURAS_APAGAR
            WHERE ID_FATURAS_APAGAR = $id_fatura";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function setQuitacao($fatura) {
    $sql = "UPDATE FATURAS_APAGAR
            SET DATA_QUITACAO = CURRENT_DATE
            WHERE ID_FATURAS_APAGAR = $fatura";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  function setRecebimentoECT($fatura) {
    $sql = "UPDATE FATURAS_APAGAR
            SET DATA_CORREIO = CURRENT_DATE
            WHERE ID_FATURAS_APAGAR = $fatura";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

}
