<?php

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


//include_once '../connect/class.connect_mysql.php';
include_once '../../superClass/connect/class.connect_mysql.php';
include_once '../../superClass/connect/class.connect_firebird.php';
include_once '../DM/prepareSql.php';
include_once 'sql.metas.php';
include_once '../vendaVendedor/class.crud.php';
//include_once '../connect/class.sociedade.php';



$ax = '';
extract($_POST);

class Metas
{

    private $conexao;
    private $sqlMetas;
    private $sqlVendaVendedor;
    private $sqlSociedade;

    function __construct()
    {
        $this->conexao = ConexaoMysql::getConectar();
        if (!$this->conexao) {
            die('{"loja":"off"}');
            return false;
        }

        //instancia da class        
        $this->sqlMetas = new SqlMetas($this->conexao);
        $this->sqlSociedade = new Sociedade();
        //$this->sqlVendaVendedor = new crud($id_sociedade);
    }

    function getValores($param)
    {


        $conct = ConexaoFirebird::getConectar($param['id_sociedade']);

        $fireBird = new SqlMetasFireBird($conct);

        $param['endDate'] = date("Y/m/t", strtotime($param['beginDate']));

        $dt = [];


        $dt['vendas'] =  $fireBird->getVendas($param);

        // $dt['mecanica'] = ( $fireBird->getMecanica($param)->VALOR -  $fireBird->getMecanicaDevolucao($param)->DEVOLUCAO);
        // $dt['mercado'] =  $fireBird->vendaEmpresa($param)->VALOR;

        // $dt['montagem'] =  $fireBird->getVendaMontagem($param)->VALOR;
        // $dt['mediaHoraDia'] = $this->mediaHoraDia($param);

        // $param['beginDate'] = date('Y/m/') . '01';

        // $dt['vendasAcu'] =  $fireBird->getVendas($param)->VALOR;
        // $dt['mercadoAcu'] =  $fireBird->vendaEmpresa($param)->VALOR;
        // $dt['montagemAcu'] =  $fireBird->getVendaMontagem($param)->VALOR;
        // $dt['mecanicaAcu'] = ( $fireBird->getMecanica($param)->VALOR -  $fireBird->getMecanicaDevolucao($param)->DEVOLUCAO);


        // if ($param['mediaAllDia'] == 'true')
        //     $dt['mediaHoraAcu'] = $this->getMediaAllDia($param);


        echo json_encode($dt);
    }


    function getMetas($param)
    {

        //$param['id_sociedade'] = 16;


        $call = $this->sqlMetas->getMeta($param);
        $meta = $call->pdo->fetch(PDO::FETCH_OBJ);

        $conct = ConexaoFirebird::getConectar($param['id_sociedade']);

        $fireBird = new SqlMetasFireBird($conct);

        $call = $fireBird->acuVendaMes($param);
        $venda = $call->pdo->fetchAll(PDO::FETCH_OBJ);

        $vendas = [];
        $valor = 0;

        foreach ($venda as $ln) {
            if (in_array($ln->TIPO_PAGAMENTO, [1, 2, 3, 4, 6, 7, 8]))
                $valor += floatval($ln->VALOR) - floatval($ln->DEVOLUCAO);
        }


        //print_r($fireBird->acuDevolucaoPedido_Mes($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR);

        $valor = $valor - $fireBird->acuDevolucaoDH_CA_CH_Mes($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR -
            $fireBird->acuDevolucaoPedido_Mes($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR;

        $mecanica = floatval($fireBird->getMecanica($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR) -
            floatval($fireBird->getMecanicaDevolucao($param)->pdo->fetch(PDO::FETCH_OBJ)->DEVOLUCAO);


        $dados = (object) [];

        $dados->venda_geral = $valor;
        $dados->venda_mercado = floatval($fireBird->vendaEmpresa($param)->pdo->fetch(PDO::FETCH_OBJ)->VALOR);
        $dados->loja = @$meta->loja;
        $dados->meta_geral = floatval(@$meta->geral);
        $dados->meta_mercado = floatval(@$meta->mercado);
        $dados->meta_mecanica = floatval(@$meta->mecanica);
        $dados->id_sociedade = $param['id_sociedade'];
        $dados->mecanica = $mecanica;

        echo json_encode($dados);
    }

    function exemplo($param)
    {

        $this->sqlSociedade->getLojas();
        $lojas = $this->sqlSociedade->pdo->fetchAll(PDO::FETCH_OBJ);


        $sqlSoc = new crud($lojas[0]->id_sociedade);

        $sqlSoc->getVendaVendedor(['dtInicial' => '2019/04/01', 'dtFinal' => '2019/04/03']);
        $rs = $sqlSoc->pdo->fetchAll(PDO::FETCH_OBJ);

        //        echo json_encode($lojas[0]);
        echo json_encode($rs);


        //        foreach ($lojas as $ln) {
        //               
        //        }
        //        echo json_encode($rs);
        //        $call = $this->sqlMetas->exemplo($param);
        //        retorno::json($call);
    }
}

$class = new $class();
$class->$call(@$param);
