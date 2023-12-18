<?php

include_once '../connect/class.connect_mysql.php';

class crudMysql
{

    private $con;
    public $pdo;

    function __construct()
    {
        $this->con = ConexaoMysql::getConectar();
    }

    function retornoJson()
    {
        $rs = $this->pdo->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rs);
    }

    function prepareSQL($sql, $param)
    {
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

    function insert($tabela, $arrayCampos)
    {

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

        //    die($sql);

        try {
            $this->pdo->execute($insert);
            return 1;
        } catch (PDOException $e) {
            die($e);
        }
    }

    /**
     *
     * @param type $tabela
     * @param type $arrayCampos
     * @param type $where_and
     * exemplo do Where_and-> campo = :campo and campo1 = :campo2
     * não é preciso passar a sintaxe where
     * @example <br>
     * param = [campo1:'eu', campo2:'vc'];
     * update('tabela',param, 'id=1') 
     * @return type
     */
    function update($tabela, $arrayCampos, $where_and)
    {
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

    //ver. esse codigo é para firebird tem que fazer para mysql
    function duplicity($param)
    {
        $sql = "select " . $param['field'] . " from " . $param['table'] .
            " where " . $param['field'] . " = '" . $param['value'] . " limit 1 '";

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $rs = $this->pdo->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rs);
    }

    function getPedidoSira($param)
    {
        $sql = "select id_sira_compras, id_sociedade, id_marca, valor, data, comprador 
		from sira_compras
		where id_sira_compras = :id_sira_compras";
        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getCotacao($param)
    {
        $sql = "select a.num_cotacao, a.data, a.marca, a.finalizacao, a.id_sociedade, a.id_compras, b.loja, a.status
	     from cotacao_cabecalho a, sociedade b
	     where a.id_sociedade = b.id_sociedade
	     and a.status = :status
             order by a.num_cotacao desc
             LIMIT :limit, 10";

        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getCotacaoTranfer($param)
    {
        $sql = "select a.id_representante, b.nome, c.cod_produto, c.valor, c.ganho, d.id_sociedade, d.id_compras
                from cotacao_cotadores a, cotacao_representante b, cotacao_itens c, cotacao_cabecalho d
                where a.id_representante = b.id_representante
                and c.id_cotadores = a.id_cotadores
                and c.num_cotacao = a.num_cotacao
                and a.num_cotacao = :num_cotacao
                and c.ganho = 'sim'
                and d.num_cotacao = a.num_cotacao";
        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getCotadoresPorCotacao($param)
    {
        $sql = "SELECT b.id_representante id_cotador, b.nome 
                FROM cotacao_cotadores a, cotacao_representante b 
                WHERE a.id_representante = b.id_representante
                AND a.num_cotacao = :num_cotacao";
        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getCotadores($param)
    {
        //    $sql = "SELECT a.id_cotadores, a.codigo_envio, a.finalizado, a.num_cotacao, a.id_representante, 
        //                   a.envio_email, a.email_pedido, a.trasferencia, b.nome, b.email 
        //		   FROM cotacao_cotadores a, cotacao_representante b
        //		   where a.id_representante = b.id_representante
        //		   and num_cotacao = :num_cotacao";
        $sql = "select a.id_cotadores, a.codigo_envio, a.finalizado, a.num_cotacao, a.id_representante, 
                   a.envio_email, a.email_recebido, a.email_pedido, a.pedido_recebido, a.trasferencia, b.nome, b.email, c.id_sociedade 
		   from cotacao_cotadores a, cotacao_representante b, cotacao_cabecalho c
		   where a.id_representante = b.id_representante
		   and c.num_cotacao = a.num_cotacao
           and a.num_cotacao = :num_cotacao";
        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getRepresentante()
    {
        $sql = "select id_representante, nome, email from cotacao_representante";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getItensSira($param)
    {
        $sql = "select cod_produto, desc_produto, quantidade, carro, num_fabricante, num_fabricante2
            from sira_itens_compras
            where id_sira_compras = :id_compras";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function deleteCotacao($param)
    {

        $sql = 'delete from cotacao_itens
            where num_cotacao = :num_cotacao';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $sql = 'delete from cotacao_produto
            where num_cotacao = :num_cotacao';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $sql = 'delete from cotacao_cabecalho
            where num_cotacao = :num_cotacao';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $sql = 'delete from cotacao_obs
            where num_cotacao = :num_cotacao';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function insertCotacao($param)
    {
        $sql = "select num_cotacao from cotacao_cabecalho
             where id_sociedade = :id_sociedade
	     and id_compras = :id_compras";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        if (isset($rs[0]->num_cotacao)) {
            die('{"erro":"Já tem uma cotação com está compra"}');
        }

        $sql = "insert into cotacao_cabecalho
	(data, marca, finalizacao, id_sociedade, id_compras)
	values
	(CURRENT_DATE(), :marca, :finalizacao, :id_sociedade, :id_compras)";

        $sql = $this->prepareSQL($sql, $param);

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
        return $this->con->lastInsertId();
    }

    function insertProduto($param)
    {
        $sql = "insert into cotacao_produto values 
        (:COD_PRODUTO, :DESC_PRODUTO, :QUANTIDADE, :CARRO, :NUM_FABRICANTE, :NUM_FABRICANTE2, :NUM_COTACAO, :FOTO)";
        $sql = $this->prepareSQL($sql, $param);
        //echo ($sql);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getProdutoCotacao($param)
    {
        $sql = "SELECT cod_produto, desc_produto, qto, carro, num_fabricante, num_fabricante2
        FROM cotacao_produto
        where num_cotacao = :num_cotacao";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getProdutoPorCotador($param)
    {
        $sql = "select a.desc_produto, a.qto, a.carro, a.num_fabricante, a.num_fabricante2, b.valor
	    from cotacao_produto a,  cotacao_itens b
	    where a.cod_produto = b.cod_produto 
	    and b.id_cotadores = :id_cotadores
	    and a.num_cotacao = :num_cotacao";
        if ($param['tipo'] == 'all')
            $sql .= " and b.ganho in('sim','nao')";
        else
            $sql .= " and b.ganho = 'sim'";

        $sql = $this->prepareSQL($sql, $param);

        //echo $sql;

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getNumFabricanteGanho($param)
    {
        $sql = "select a.cod_produto, a.num_fabricante, b.valor, a.qto
	    from cotacao_produto a,  cotacao_itens b
	    where a.cod_produto = b.cod_produto 
	    and b.id_cotadores = :id_cotadores
	    and a.num_cotacao = :num_cotacao
            and b.ganho = 'sim'";

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function insertCotadores($param)
    {
        $sql = "select num_cotacao from cotacao_cotadores
	        where num_cotacao = :num_cotacao
		and id_representante = :id_representante
                limit 1";

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $rs = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        if (isset($rs[0]->num_cotacao)) {
            die('{"erro":"O cotador seleciona já está na lista de cotação"}');
        }

        $sql = "insert into cotacao_cotadores
	(num_cotacao, id_representante, codigo_envio)
	values
	(:num_cotacao, :id_representante, :codigo_envio)";

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getTotalItensGanhos($param)
    {
        $sql = "SELECT count(*) as qto, 
            (select sum(a.qto * b.valor)
                    from cotacao_produto a,  cotacao_itens b
                    where a.cod_produto = b.cod_produto 
                    and b.id_cotadores = :id_cotadores
                    and a.num_cotacao = :num_cotacao
                    and b.ganho = 'sim') as total
            FROM cotacao_itens
            where id_cotadores = :id_cotadores
            and num_cotacao = :num_cotacao
            and ganho = 'sim'";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getTotalItensCotados($param)
    {
        $sql = "SELECT count(*) as qto, 
            (select sum(a.qto * b.valor)
	from cotacao_produto a,  cotacao_itens b
	where a.cod_produto = b.cod_produto 
	and b.id_cotadores = :id_cotadores
	and a.num_cotacao = :num_cotacao) as total
	FROM cotacao_itens
	where id_cotadores = :id_cotadores
	and num_cotacao = :num_cotacao";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function retirarCotador($param)
    {
        $sql = "delete from cotacao_cotadores
            where num_cotacao = :num_cotacao
            and id_representante = :id_representante";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();


        $sql = "delete from cotacao_itens
              where num_cotacao = :num_cotacao
              and id_cotadores = (select id_cotadores 
              from cotacao_cotadores
              where num_cotacao = :num_cotacao
              and id_representante = :id_representante)";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function updateStatusCotacao($param)
    {
        $sql = "update  cotacao_cabecalho
              set  status =  :status 
	      where  num_cotacao = :num_cotacao";
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getLoja($param)
    {
        $sql = 'select razao_social, endereco, bairro, cidade, cep, cnjp, incricao, telefone 
      from loja
      where id_sociedade = :id_sociedade';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getDadosForCotador($param)
    {
        $sql = 'select codigo_envio, num_cotacao, nome, email
            from cotacao_cotadores a, cotacao_representante b
            where a.id_representante = b.id_representante
            and id_cotadores = :id_cotadores';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function setDateSendEmail($param)
    {
        $sql = 'update cotacao_cotadores
            set envio_email = CURRENT_DATE()
            where codigo_envio = :codigo_envio';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function setPedidoSendEmail($param)
    {
        $sql = 'update cotacao_cotadores
            set email_pedido = CURRENT_DATE()
            where codigo_envio = :codigo_envio';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getProdutoForComparar($param)
    {
        $sql = 'select a.valor, a.ganho, c.nome
                from cotacao_itens a, cotacao_cotadores b, cotacao_representante c
                where c.id_representante = b.id_representante
                and b.id_cotadores = a.id_cotadores
                and a.num_cotacao = :num_cotacao
                and a.cod_produto = :cod_produto';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getProdutoPorCotadores($param)
    {
        $retorno = array();

        $sql = 'select id_cotadores, nome
                from cotacao_cotadores a, cotacao_representante b
                where a.id_representante = b.id_representante
                and a.num_cotacao = :num_cotacao';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
        $retorno['cotadores'] = $this->pdo->fetchAll(PDO::FETCH_OBJ);



        $sql = 'select cod_produto, id_cotadores, valor, ganho from cotacao_itens
                where num_cotacao = :num_cotacao';
        //                and  cod_produto = :cod_produto';

        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        $retorno['itens'] = $this->pdo->fetchAll(PDO::FETCH_OBJ);

        return $retorno;
    }

    function updateItenCotado($param)
    {
        $sql = 'update  cotacao_itens 
		 set  ganho = :ganho 
		where  id_cotadores = :id_cotadores 
		and cod_produto = :cod_produto 
		and num_cotacao = :num_cotacao';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function updateInsertOBS($param)
    {
        $sql = 'update cotacao_obs
                set obs = :obs
                where codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();

        if ($this->pdo->rowCount() == 0) {
            $sql = 'insert into cotacao_obs value (:id, :num_cotacao, :obs)';
            $sql = $this->prepareSQL($sql, $param);
            $this->pdo = $this->con->prepare($sql);
            $this->pdo->execute();
        }
    }

    function deleteOBS($param)
    {
        $sql = 'delete from cotacao_obs 
                where codigo_envio = :id';
        $sql = $this->prepareSQL($sql, $param);
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }
}
