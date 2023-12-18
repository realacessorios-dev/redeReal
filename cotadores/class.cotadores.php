<?php

include_once '../connect/class.connect_mysql.php';

class Crud {

    private $con;
    public $pdo;

    function __construct() {
        $this->con = ConexaoMysql::getConectar();
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

        return strtr($sql, $new);
    }

    function getCotacao($param) {
        $sql = 'select a.id_cotadores, a.id_representante, a.num_cotacao, b.marca, b.finalizacao, b.id_sociedade, b.status, a.email_recebido
                from cotacao_cotadores a, cotacao_cabecalho b
                where a.num_cotacao = b.num_cotacao 
                and  codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getLoja($param) {
        $sql = 'select razao_social, endereco, bairro, cidade, cep, cnjp, incricao, telefone 
      from loja
      where id_sociedade = :id_sociedade';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getProdutos($param) {
//        $sql = "select a.cod_produto, a.foto, a.desc_produto, a.qto, a.carro, a.num_fabricante, a.num_fabricante2, b.valor
//                    from cotacao_produto a left join cotacao_itens b
//		    on a.cod_produto = b.cod_produto
//		    and b.id_cotadores = :id_cotadores	 
//		   where a.num_cotacao = :num_cotacao
//                   order by a.carro, a.desc_produto";

        $sql = 'select a.cod_produto, a.foto, a.desc_produto, a.qto, a.carro, a.num_fabricante, a.num_fabricante2, b.valor, c.meu_codigo
          from cotacao_produto a left join cotacao_itens b
		    on a.cod_produto = b.cod_produto
		    and b.id_cotadores = :id_cotadores
		   left join cotacao_meu_codigo c
		    on c.cod_produto = a.cod_produto
		    and c.id_representante = :id_representante		   
		 
                    where a.num_cotacao = :num_cotacao
                order by a.carro, a.desc_produto';


        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function updateValor($param) {

        if ($param['VALOR'] == '0.00' || $param['VALOR'] == '0' || $param['VALOR'] == 'NaN') {
            $sql = "DELETE FROM cotacao_itens
                    WHERE id_cotadores = :ID_COTADORES 
		    AND cod_produto = :COD_PRODUTO 
		    AND num_cotacao = :NUM_COTACAO";
            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);
            $this->pdo->execute();
            //echo '{"ok":"delete"}';
        } else {

            $sql = "UPDATE cotacao_itens 
			SET valor = :VALOR 
			WHERE id_cotadores = :ID_COTADORES 
			AND cod_produto = :COD_PRODUTO 
			AND num_cotacao = :NUM_COTACAO";

            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);

            $this->pdo->execute();

            $row = $this->pdo->rowCount();
            //echo '{"ok":"update ' . $row . '"}';
            // o row retorna true se foi feito update, false se não for feito update.
            if ($row == '0') {
                $sql = "INSERT INTO cotacao_itens
                             (id_cotadores, cod_produto, num_cotacao, valor)
                             VALUES 
                             (:ID_COTADORES, :COD_PRODUTO, :NUM_COTACAO, :VALOR)";

                $sql = $this->prepareSQL($sql, $param);
                $this->pdo = $this->con->prepare($sql);
                $this->pdo->execute();
                //  echo '{"ok":"inset"}';
            }
        } // fim else
        echo '{"ok":"ok"}';
    }

    function finalizarCotacao($param) {
        $sql = 'UPDATE  cotacao_cotadores 
		SET  finalizado = CURRENT_DATE()
		WHERE  id_cotadores = :id_cotadores';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
        return $this->pdo->rowCount();
    }

    function confirmaCotacao($param) {
        $sql = 'update cotacao_cotadores 
                set email_recebido = CURRENT_TIMESTAMP()
                where codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function confirmaPedido($param) {
        $sql = 'select pedido_recebido
                from cotacao_cotadores a, cotacao_cabecalho b
                where a.num_cotacao = b.num_cotacao 
                and  codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $rs = $this->pdo->fetch(PDO::FETCH_OBJ);

        if ($rs->pedido_recebido == '0000-00-00 00:00:00') {

            $sql = 'update cotacao_cotadores 
                set pedido_recebido = CURRENT_TIMESTAMP()
                where codigo_envio = :id';
            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);
            $this->pdo->execute();
        }
    }

    function getProdutoGanhoID($param) {
//        $sql = 'select a.desc_produto, a.qto, a.carro, a.num_fabricante, a.num_fabricante2, b.valor
//	    from cotacao_produto a, cotacao_itens b, cotacao_cotadores c
//	    where a.cod_produto = b.cod_produto 
//	    and b.id_cotadores = c.id_cotadores
//	    and a.num_cotacao = c.num_cotacao
//	    and b.ganho = "sim"
//	    and c.codigo_envio = :id';

        $sql = 'select a.desc_produto, a.qto, a.carro, a.num_fabricante, a.num_fabricante2, b.valor, e.meu_codigo
	    from cotacao_itens b, cotacao_cotadores c, cotacao_produto a
	    left join cotacao_meu_codigo e
		    on e.cod_produto = a.cod_produto
		    and e.id_representante = :id_representante
	    where a.cod_produto = b.cod_produto 
	    and b.id_cotadores = c.id_cotadores
	    and a.num_cotacao = c.num_cotacao
	    and b.ganho = "sim"
	    and c.codigo_envio = :id';

        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getOBS($param) {
        $sql = 'select obs from cotacao_obs 
                where codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function gerenciarMeuCodigo($param) {

        if (trim($param['meu_codigo'] == '')) {

            $sql = 'delete from cotacao_meu_codigo 
                   where cod_produto = :cod_produto
                   and id_representante = :id_representante';
            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);
            $this->pdo->execute();
        } else {

            $sql = 'update cotacao_meu_codigo 
                set meu_codigo = :meu_codigo
                where cod_produto = :cod_produto
                and id_representante = :id_representante';
            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);
            $this->pdo->execute();

            if ($this->pdo->rowCount() == 0) {
                $sql = 'insert into cotacao_meu_codigo
                value(:cod_produto, :id_representante, :meu_codigo)';
                $sql = $this->prepareSQL($sql, $param);
                $this->pdo = $this->con->prepare($sql);
                $this->pdo->execute();
            }
        }
    }

}
