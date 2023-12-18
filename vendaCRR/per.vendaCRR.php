<?php

session_cache_limiter(1);
ob_start();
session_start();
include_once 'class.crud.php';

extract($_POST);

class vendaCRR extends crud
{

    function getValores($param)
    {
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
            $vendas[$value->ID_VENDEDOR] = array(
                'CPF' => $value->CPF,
                'LOGIN' => $value->LOGIN,
                'VENDA' => $value->VALOR,
                'DEVOLUCAO' => $devolucao[0]->VALOR,
                'TOTAL' => $value->VALOR - $devolucao[0]->VALOR
            );
        }

        echo json_encode($vendas);
    }


    function getFuncionario()
    {

        parent::getFuncionario();
        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        $vendas = array();

        foreach ($rs as $value) {
            $vendas[$value->CPF] = $value;
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
