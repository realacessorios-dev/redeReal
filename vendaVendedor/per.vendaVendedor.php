<?php

session_cache_limiter(1);
ob_start();
session_start();
include_once 'class.crud.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ERROR);

extract($_POST);

class vendaVendedor extends crud {

    function getValores($param) {
        parent::getVendaVendedor($param);

        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);
        $vendas = array();

        foreach ($rs as $key => $value) {
            //   echo $value->LOGIN;
            //parent::getDevolucao($value);
            $param['ID_VENDEDOR'] = $value->ID_VENDEDOR;
            parent::getDevolucao($param);

            $devolucao = $this->pdo->fetchAll(PDO::FETCH_OBJ);
            //print_r($devolucao[0]->VALOR);
            $vendas[$value->ID_VENDEDOR] = array('LOGIN' => $value->LOGIN, 'VENDA' => $value->VALOR, 'DEVOLUCAO' => $devolucao[0]->VALOR, 'TOTAL' => $value->VALOR - $devolucao[0]->VALOR);
        }

        echo json_encode($vendas);
    }

    function getValorMontagem($param) {
        parent::getMontagem($param);
        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);
        $vendas = array();

        foreach ($rs as $key => $value) {
            //   echo $value->LOGIN;
            $param['ID_MONTADOR'] = $value->ID_MONTADOR;
            parent::getDevolucaoMontagem($param);
            $devolucao = $this->pdo->fetchAll(PDO::FETCH_OBJ);
            //print_r($devolucao[0]->VALOR);
            $vendas[$value->ID_MONTADOR] = array('LOGIN' => $value->LOGIN, 'VENDA' => $value->VALOR, 'DEVOLUCAO' => $devolucao[0]->VALOR, 'TOTAL' => $value->VALOR - $devolucao[0]->VALOR);
        }
        echo json_encode($vendas);
    }

}

/**/

if (isset($redeReal)) {
    if ($redeReal == $_SESSION['redeReal']) {
        $class = new $class($id_sociedade);
        $class->$call(@$param);
    }
}
