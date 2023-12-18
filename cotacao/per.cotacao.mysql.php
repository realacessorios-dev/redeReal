<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ERROR);

session_cache_limiter(1);
ob_start(); /* Evitando warning */
session_start();
include_once './class.crud.mysql.php';
extract($_POST);

class Cotacao extends crudMysql {

    function getLojas() {
        include_once '../connect/class.sociedade.php';
        $lojas = new Sociedade();
        $lojas->getListaLojaSiraSelect();
    }

    public function getPedidoSira($param) {
        parent::getPedidoSira($param);
        $this->retornoJson();
    }

    public function getCotacao($param) {
        parent::getCotacao($param);
        $this->retornoJson();
    }

    public function getCotacaoTranfer($param) {
        $this->tranferirCotacaoParaLoja($param);
        echo '{"ok":"ok"}';
    }

    public function tranferirCotacaoParaLoja($param) {
        include_once '../connect/class.connect_firebird.php';

        parent::getCotacaoTranfer($param);
        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        parent::getCotadoresPorCotacao($param);
        $cotadores = $this->pdo->fetchAll(PDO::FETCH_OBJ);


        //print_r($rs);

        $idSociedade = $rs[0]->id_sociedade;
        $idCompras = $rs[0]->id_compras;

        $con = ConexaoFirebird::getConectar($idSociedade);

        $sql = 'select json from compras where id_compras = ' . $idCompras;

        $pdo = $con->prepare($sql);
        $pdo->execute();
        $rsJson = $pdo->fetch(PDO::FETCH_OBJ);

        if (!isset($rsJson)) {
            $comprasJson = [];
        } else {
            $comprasJson = json_decode($rsJson->JSON);
        }

        if (!isset($comprasJson->COTACAO)) {
            $comprasJson->COTACAO = [
                "DATA" => date('d/m/Y'),
                "HORA" => date('h:i'),
                "COTADORES" => $cotadores
            ];
        } else {
            $comprasJson->COTACAO = [
                "DATA" => date('d/m/Y'),
                "HORA" => date('h:i'),
                "COTADORES" => $cotadores
            ];
        }

        $comprasJson = json_encode($comprasJson);

        $sql = "update compras set json =:json where id_compras =:id_compras";
        $pdo = $con->prepare($sql);
        $pdo->execute(["json" => $comprasJson, "id_compras" => $idCompras]);


        //update dos custo e id_cotador
        foreach ($rs as $ln) {
            $sql = "update itens_compras
                      set custo = $ln->valor,
                      id_cotador = $ln->id_representante
                    where id_compras = $ln->id_compras
                    and cod_produto = $ln->cod_produto";
            $pdo = $con->prepare($sql);
            $pdo->execute();
        }
    }

    public function getCotadores($param) {
        parent::getCotadores($param);
        $rs = $this->pdo->fetchAll(PDO::FETCH_ASSOC);
        $listCotador = $rs;

        foreach ($rs as $key => $value) {
            $p['num_cotacao'] = $value['num_cotacao'];
            $p['id_cotadores'] = $value['id_cotadores'];

            parent::getTotalItensGanhos($p);
            $total = $this->pdo->fetchAll(PDO::FETCH_ASSOC);

            $listCotador[$key]['qto'] = $total[0]['qto'];
            $listCotador[$key]['total'] = $total[0]['total'];
        }

        echo json_encode($listCotador);
    }

    public function getRepresentante() {
        parent::getRepresentante();
        $this->retornoJson();
    }

    public function deleteCotacao($param) {
        try {
            parent::deleteCotacao($param);
            echo '{"msg":"ok"}';
        } catch (Exception $exc) {
            echo '{"msg":"erro"}';
        }
    }

    public function insertCotacao($param) {
        try {
            $lastID = parent::insertCotacao($param);

            if ($param['sira'] == 'nao') {
                include_once './class.crud.firebird.php';
                $firebird = new crudFirebird($param['id_sociedade']);
                $firebird->getItensCompra($param);
                $rs = $firebird->pdo->fetchAll(PDO::FETCH_ASSOC);
                foreach ($rs as $value) {
                    $value['NUM_COTACAO'] = $lastID;
                    parent::insertProduto($value);
                }
            }

            //produto do sira
            if ($param['sira'] == 'sim') {
                parent::getItensSira($param);
                $rs = $this->pdo->fetchAll(PDO::FETCH_ASSOC);

                //  print_r($rs);



                foreach ($rs as $value) {
                    $value['NUM_COTACAO'] = $lastID;
                    $value['FOTO'] = '';
                    parent::insertProduto(array_change_key_case($value, CASE_UPPER));
                }
            }

            echo '{"id":"' . $lastID . '"}';
        } catch (Exception $exc) {
            echo '{"erro":"Problema ao criar nova cotação"}';
        }
    }

    public function getProdutoCotacao($param) {
        parent::getProdutoCotacao($param);
        $this->retornoJson();
    }

    public function insertCotadores($param) {
        try {

            $p = array();
            foreach ($param['frm'] as &$value) {
                $aux = $value['value'] . time() . date('Ymd');
                $codigo = substr(md5($aux), 0, 14);

                $p['num_cotacao'] = $param['num_cotacao'];
                $p['id_representante'] = $value['value'];
                $p['codigo_envio'] = $codigo;
                parent::insertCotadores($p);
            }

            echo '{"num_cotacao":"' . $param['num_cotacao'] . '"}';
        } catch (Exception $exc) {
            die('{"erro":"Problema ao inserir os cotadores"}');
        }
    }

    public function getTotalItensCotados($param) {

        foreach ($param['dadosCotadores'] as $value) {

            $p['id_cotadores'] = $value['id_cotadores'];
            $p['num_cotacao'] = $param['num_cotacao'];
            parent::getTotalItensCotados($p);
            $total = $this->pdo->fetchAll(PDO::FETCH_ASSOC);

            $resultado[$value['id']]['id'] = $value['id'];
            $resultado[$value['id']]['c_qto'] = $total[0]['qto'];
            $resultado[$value['id']]['c_total'] = $total[0]['total'];
        }
        echo json_encode($resultado);
//parent::getTotalItensCotados($param);
    }

    public function getProdutoPorCotador($param) {
        parent::getProdutoPorCotador($param);
        $this->retornoJson();
    }

    public function retirarCotador($param) {
        try {
            parent::retirarCotador($param);
            echo '{"ok":"ok"}';
        } catch (Exception $exc) {
            echo '{"erro":"Erro ao retirar o cotador"}';
        }
    }

    public function updateStatusCotacao($param) {

        try {
            parent::updateStatusCotacao($param);

            $this->tranferirCotacaoParaLoja($param);

            echo '{"ok":"ok"}';
        } catch (Exception $exc) {
            echo '{"erro":"Erro ao mudar status da cotação"}';
        }
    }

    function sendEmail($param) {
        require "../plugins/PHPMailer_v5.1/class.phpmailer.php";
        require_once '../class/encrypt.php';
        parent::getLoja($param);
        $loja = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        parent::getDadosForCotador($param);
        $dadosForCotador = $this->pdo->fetchAll(PDO::FETCH_OBJ);

//        print_r($dadosForCotador[0]->codigo_envio);
//        
//        die('');


        if ($param['assunto'] == 'Cotação') {
            $btn = '<br><br><a style="color:white;" href="http://www.redereal.com.br/cotadores/?id=' . $dadosForCotador[0]->codigo_envio . '" target="_blank"><div align="center" valign="middle" style="background: #0d47a1; padding: 8px 5px 5px; height: 20px; width: 36%; border-radius: 5px; margin-left: 30%;">
              Ver Cotação</div></a>';

            $msg = '<span style="font-size:17px">Olá ' . $dadosForCotador[0]->nome . '</span><br>';
            $msg .= '<span style="font-size:12px">Nº Cotação ' . $dadosForCotador[0]->num_cotacao . '<br>Qualquer dúvida entre em cotato com .: ' . $param['nome'] . '</span><br>';

            $msg .= '<br>' . $param['obs'];

            $msg .= $btn;
        }


        if ($param['assunto'] == 'Pedido') {
            date_default_timezone_set('America/Sao_Paulo');
            $data = date("d/m/Y H:i:s");

            $chave = $param['id_sociedade'] . '|' . $dadosForCotador[0]->num_cotacao . '|' . $dadosForCotador[0]->codigo_envio . '|' . $data . '|' . $param['id_representante'];
            $chave = realEncryp($chave, '152056');

            $btn = '<br><br><a style="color:white;" href="http://www.redereal.com.br/cotadores/produtos_ganhos.php?id=' . $chave . '" target="_blank"><div align="center" valign="middle" style="background: #00695c; padding: 8px 5px 5px; height: 20px; width: 46%; border-radius: 5px; margin-left: 27%;">
              Click para ver os produtos</div></a>';

            $msg = '<span style="font-size:17px">Olá ' . $dadosForCotador[0]->nome . '</span><br>';
            $msg .= '<span style="font-size:12px">Nº do Pedido ' . $dadosForCotador[0]->num_cotacao . '<br>Qualquer dúvida entre em cotato com .: ' . $param['nome'] . '</span><br>';

            $obs = trim($param['obs']);


            if (trim($obs) != '') {
                $param['id'] = $dadosForCotador[0]->codigo_envio;
                $param['num_cotacao'] = $dadosForCotador[0]->num_cotacao;
                parent::updateInsertOBS($param);
            } else {
                parent::deleteOBS($param);
            }


            $msg .= '<br>' . $obs;

            $msg .= $btn;
        }





        if ($param['assunto'] == 'Pedido2') {
            $param['tipo'] = 'sim';
            $param['num_cotacao'] = $dadosForCotador[0]->num_cotacao;
            parent::getProdutoPorCotador($param);
            $itensGanhos = $this->pdo->fetchAll(PDO::FETCH_OBJ);

            $produto = '<table style="border: 1px solid #ccc; width: 100%;">' .
                    '<tr>' .
                    '<th colspan="6">Itens do Pedido</th>' .
                    '</tr>' .
                    '<tr sytle="font-size: 12px; color: #3c3c3c; background: #dadada;">' .
                    '<th width="90" style="border: 1px solid #ccc;">Nº Fabricante</th>' .
                    '<th width="74" style="border: 1px solid #ccc;">Nº Fab 2</th>' .
                    '<th style="border: 1px solid #ccc;">Descrição Produto</th>' .
                    '<th width="112" style="border: 1px solid #ccc;">Carro</th>' .
                    '<th width="77" style="border: 1px solid #ccc;">Quant</th>' .
                    '<th width="77" style="border: 1px solid #ccc;">Valor</th>' .
                    '</tr>';
            $a = 0;

            foreach ($itensGanhos as $value) {

                if ($a % 2 == 0)
                    $produto .= '<tr>';
                else
                    $produto .= '<tr style="background: #ececec;">';
                $a++;

                $produto .= '<td class="first"><div align="left">' . $value->num_fabricante . '</div></td>' .
                        '<td>' . $value->num_fabricante2 . '&nbsp;</td>' .
                        '<td><div align="left">' . $value->desc_produto . '</div></td>' .
                        '<td><div align="left">' . $value->carro . '</div></td>' .
                        '<td class="last">' . $value->qto . '</td>' .
                        '<td class="last">' . $value->valor . '</td>' .
                        '</tr>';
            }

            $produto .= '</table>';
            $msg = '<span style="font-size:17px">Olá ' . $dadosForCotador[0]->nome . '</span><br>';
            $msg .= '<span style="font-size:12px">Segue dados para fazer o pedido conforme cotação Nº ' . $dadosForCotador[0]->num_cotacao . '<br>Qualquer dúvida entre em cotato com .: ' . $param['nome'] . '</span><br>';
            $msg .= '<br>' . $param['obs'];

            $msg .= $produto;
        } //fim pedido




        $bodyEmail = file_get_contents('bodyEmail.html');

        $bodyEmail = str_replace('{razao_social}', $loja[0]->razao_social, $bodyEmail);
        $bodyEmail = str_replace('{telefone}', $loja[0]->telefone, $bodyEmail);
        $bodyEmail = str_replace('{endereco}', $loja[0]->endereco, $bodyEmail);
        $bodyEmail = str_replace('{cidade}', $loja[0]->cidade, $bodyEmail);
        $bodyEmail = str_replace('{cep}', $loja[0]->cep, $bodyEmail);
        $bodyEmail = str_replace('{CNPJ}', $loja[0]->cnjp, $bodyEmail);



        $bodyEmail = str_replace('{msg}', $msg, $bodyEmail);
// Estrutura HTML da mensagem
        $msg = '<!DOCTYPE html lang="pt-br">';
        $msg .= "<html>";
        $msg .= '<head><meta charset="UTF-8"></head>';
        $msg .= "<body>";
        $msg .= $bodyEmail;
        $msg .= "</body>";
        $msg .= "</html>";

// Abaixo começaremos a utilizar o PHPMailer.

        $mail = new PHPMailer(true); //
        $mail->Mailer = "smtp";

        $mail->IsHTML(true); //
        $mail->CharSet = "utf-8";
        $mail->Host = "smtp.reallatas.com.br";
        $mail->Port = "587";
        $mail->SMTPAuth = "true";
        $mail->Username = "webmaster@reallatas.com.br";
        $mail->Password = "alves152056";
        $mail->From = "webmaster@reallatas.com.br"; //quem manda
        $mail->FromName = "Real Acessórios";

        $emails = explode(',', $dadosForCotador[0]->email);

        foreach ($emails as $key => $value) {
            $mail->AddAddress(trim(strtolower($value)));
        }
        $mail->AddReplyTo($param['emailComprador'], $param['nome']);

// Assunto da mensagem
        $mail->Subject = $param['assunto'] . ' ' . $loja[0]->razao_social;

// Toda a estrutura HTML e corpo da mensagem
        $mail->Body = $msg;

// Controle de erro ou sucesso no envio
        if (!$mail->Send()) {
            echo '{"erro":"Email com problema. Não foi enviado"}' . $mail->ErrorInfo;
        } else {

            if ($param['assunto'] == 'Cotação') {
                parent::setDateSendEmail($dadosForCotador[0]);
                echo '{"ok":"e-ct' . $dadosForCotador[0]->num_cotacao . $param['id_cotadores'] . '"}';
            }

            if ($param['assunto'] == 'Pedido') {
                parent::setPedidoSendEmail($dadosForCotador[0]);
                echo '{"ok":"e-pe' . $dadosForCotador[0]->num_cotacao . $param['id_cotadores'] . '"}';
            }
        }
    }

    public function getProdutoPorCotadores($param) {
        $r = parent::getProdutoPorCotadores($param);
        echo json_encode($r);
    }

    public function updateItenCotado($param) {
        parent::updateItenCotado($param);
        echo '{"ok":"ok"}';
    }

    public function getNumFabricanteGanho($param) {
        parent::getNumFabricanteGanho($param);
        $this->retornoJson();
    }

}

if (isset($redeReal)) {

    if ($redeReal == $_SESSION['redeReal']) {
        $class = new $class();
        $class->$call(@$param);
    }
//    else {
//        echo '{"loginErro":"finalizou", "loja":""}';
//    }
}
  


