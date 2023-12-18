<?php

//include_once '../class/class.connect_firebird.php';
include_once '../../superClass/connect/class.connect_firebird.php';

class crud {

    private $con;
    public $pdo;

    function __construct($id_sociedade) {
        $this->con = ConexaoFirebird::getConectar($id_sociedade);
        if (!$this->con) {
            die('{"loja":"off"}');
            return false;
        }
    }

    function retornoJson() {
        $rs = $this->pdo->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rs);
    }

    function prepareSQL($sql, $param) {
        $new = array();

        //  print_r($param);
        foreach ($param as $id => $value) {
            // echo is_numeric($value).'<br>';
//      if (gettype($value) == 'string')
            if (!is_numeric($value))
                $value = "'" . addslashes($value) . "'";
            $new[":$id"] = $value;
        }
//print_r($new);
//die('');
        return strtr($sql, $new);
    }

    function getVendaVendedor($param) {
        $sql = "select  DISTINCT(B.LOGIN), a.ID_VENDEDOR, C.descricao AS Cargo,
                SUM(A.valor + a.valor_montagen) AS VALOR, A.mes, A.ano
                from CAIXA A, funcionario B, cargo C, CLIENTE D
                where A.id_vendedor = B.cod_funcionario
                AND A.ID_CLIENTE = D.ID_CLIENTE
                AND D.MESMO_GRUPO = 0
                AND B.id_cargo = C.id_cargo
                AND A.data between :dtInicial and :dtFinal
                group BY B.LOGIN, C.DESCRICAO, a.id_vendedor, A.MES, A.ANO
                ORDER BY B.LOGIN";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getDevolucao($param) {
//    $sql = 'SELECT SUM(A.VALOR - A.DESCONTO) AS VALOR
//            FROM DEVOLUCAO A, CLIENTE C
//            WHERE A.ID_CLIENTE = C.ID_CLIENTE
//            and A.COD_FUNCIONARIO = :ID_VENDEDOR
//            AND A.MES = :MES
//            AND A.ANO = :ANO';
//    $sql = $this->prepareSQL($sql, $param);
//    $this->pdo = $this->con->prepare($sql);
//    $this->pdo->execute();


        $sql = "SELECT coalesce(SUM(A.VALOR - A.DESCONTO), 0) AS VALOR
            FROM DEVOLUCAO A, CLIENTE C
            WHERE A.ID_CLIENTE = C.ID_CLIENTE
            and A.COD_FUNCIONARIO = :ID_VENDEDOR
            AND A.data between :dtInicial and :dtFinal";

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();



        //02102170001105->Fabio
    }

    function getMontagem($param) {
        $sql = 'select distinct(a.id_montador), sum(a.valor) as valor, c.login
                    from repo_ordemdeservico a, funcionario c
                    where a.id_montador = c.cod_funcionario
                    AND data between :dtInicial and :dtFinal
                    group by a.id_montador, c.login';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getDevolucaoMontagem($param) {
        $sql = 'select a.id_montador, sum(b.valor_montagem) as valor
                from repo_ordemdeservico a, devolucao b
                where b.num_orcamento = a.num_orcamento
                and b.data_venda = a.data
                AND A.data between :dtInicial and :dtFinal
                and b.valor_montagem > 0
                and a.id_montador = :ID_MONTADOR
                group by a.id_montador';
        $sql = $this->prepareSQL($sql, $param);
        // echo $sql;
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

}
