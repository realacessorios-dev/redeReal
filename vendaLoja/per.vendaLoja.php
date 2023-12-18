<?php

session_cache_limiter(1);
ob_start(); /* Evitando warning */
session_start();


include_once 'sql.vendaLoja.php';
include_once '../DM/prepareSql.php';

extract($_POST);

class vendaLoja {

    private $conexao;
    private $SqlvendaLoja;

    function __construct($id_sociedade) {
        $this->conexao = ConexaoFirebird::getConectar($id_sociedade);
        if (!$this->conexao) {
            die('{"loja":"off"}');
            return false;
        }

        //instancia da class        
        $this->SqlvendaLoja = new SqlVendaLoja($this->conexao);
    }

    function getAcumulado($param) {

        die('{"aaa":"bb"}');
        
        $call = $this->sqlMDC->acuVendaMes($param);
        $venda = $call->pdo->fetchAll(PDO::FETCH_OBJ);

        $vendas = [];

        foreach ($venda as $ln)
            $vendas[$ln->TIPO_PAGAMENTO] = $ln;

        $call = $this->sqlMDC->acuDevolucaoDH_CA_CH_Mes($param);
        $devDH = $call->pdo->fetchAll(PDO::FETCH_OBJ);

        $call = $this->sqlMDC->acuDevolucaoPedido_Mes($param);
        $devPedido = $call->pdo->fetch(PDO::FETCH_OBJ);

//        print_r($devPedido);

        if (floatval($devPedido->VALOR) != 0)
            $devDH[4] = (object) ['TIPO_PAGAMENTO' => 4, 'VALOR' => $devPedido->VALOR];


        foreach ($devDH as $ln)
            $vendas[$ln->TIPO_PAGAMENTO]->DEVOLUCAO = $ln->VALOR;

        $vendas['devProd'] = $this->sqlMDC->acuDevolucaoProdutoMes($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR;

        return $vendas;
    }

}

/**/


if (isset($redeReal)) {
    if ($redeReal == $_SESSION['redeReal']) {
        $class = new $class($id_sociedade);
        $class->$call(@$param);
    }
}
