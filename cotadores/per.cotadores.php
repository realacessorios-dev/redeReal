<?php

include_once './class.cotadores.php';
extract($_POST);

class Cotadores extends Crud {

    public function getCotacao($param) {
        $json = [];
        parent::getCotacao($param);
        $getCotacao = $this->pdo->fetchAll(PDO::FETCH_OBJ);


        if ($getCotacao[0]->email_recebido == '0000-00-00 00:00:00')
            parent::confirmaCotacao($param);


        $json['cotacao'] = $getCotacao[0];

        parent::getLoja($getCotacao[0]);
        $getLoja = $this->pdo->fetchAll(PDO::FETCH_OBJ);
        $json['loja'] = $getLoja[0];

        parent::getProdutos($getCotacao[0]);
        $getProdutos = $this->pdo->fetchAll(PDO::FETCH_OBJ);
        $json['produtos'] = $getProdutos;


        echo json_encode($json);
        // $this->retornoJson();
    }

    public function updateValor($param) {
        parent::updateValor($param);
    }

    public function finalizarCotacao($param) {
        $r = parent::finalizarCotacao($param);

        echo '{"ok":"ok"}';
    }

    public function getProdutoGanhoID($param) {

        include_once '../class/encrypt.php';
        $dados = explode('|', realDecryp($param['id'], '152056'));

        $rs = array();
        
        $param['id_representante'] = $dados[4];
        $param['id'] = $dados[2];
        $param['num_pedido'] = $dados[1];
        $param['id_sociedade'] = $dados[0];


        parent::getProdutoGanhoID($param);
        $rs['produto'] = $this->pdo->fetchAll(PDO::FETCH_ASSOC);

        parent::getLoja($param);
        $rs['loja'] = $this->pdo->fetchAll(PDO::FETCH_ASSOC);

        parent::getOBS($param);
        $rs['obs'] = $this->pdo->fetch(PDO::FETCH_ASSOC);


        $rs['num_pedido'] = $dados[1];
        $rs['data'] = $dados[3];

        parent::confirmaPedido($param);

        echo json_encode($rs);
    }

    public function gerenciarMeuCodigo($param) {
        try {
            parent::gerenciarMeuCodigo($param);

            echo '{"cod_produto":"' . $param['cod_produto'] . '"}';
        } catch (Exception $exc) {
            echo '{"erro":"falha ao inserir, tente novamente"}';
        }
    }

}

$class = new $class();
$class->$call(@$param);
