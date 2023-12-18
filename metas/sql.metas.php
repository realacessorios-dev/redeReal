<?php

include_once 'prepareSql.php';

class SqlMetas
{

    private $conexao;

    function __construct($conexao)
    {
        $this->conexao = $conexao;
    }

    function getMeta($param)
    {
        $sql = 'select b.loja, a.geral, mercado, mecanica 
                from meta_loja a, sociedade b
                where a.id_sociedade = b.id_sociedade
                and mes = extract(month from :DT_INICIAL) 
                and ano = extract(year from :DT_INICIAL)
                and a.id_sociedade = :id_sociedade';
        return executa::SQL($this->conexao, $sql, $param);
    }
}

class SqlMetasFireBird
{

    private $conexao;

    function __construct($conexao)
    {
        $this->conexao = $conexao;
    }


    function getVendas($param)
    {


        $sql = "SELECT  
                    COALESCE(SUM(A.VALOR + A.VALOR_MONTAGEN) - (
                        SELECT COALESCE(SUM(A.VALOR - A.DESCONTO), 0) AS VALOR
                        FROM DEVOLUCAO A, CLIENTE C
                        WHERE A.ID_CLIENTE = C.ID_CLIENTE
                        AND A.DATA BETWEEN :beginDate AND :endDate),0) AS VALOR, 
                        CURRENT_DATE AS DATA, CURRENT_TIME AS HORA
                    FROM CAIXA A,  CLIENTE D
                    WHERE A.ID_CLIENTE = D.ID_CLIENTE
                    AND D.MESMO_GRUPO = 0
                    AND A.TIPO_PAGAMENTO NOT IN('S', 'M')
                    AND A.DATA BETWEEN :beginDate AND :endDate";

        return executa::SQL($this->conexao, $sql, $param)->pdo->fetch(PDO::FETCH_OBJ);
    }


    function acuVendaMes($param)
    {
        $sql = "SELECT TRIM(B.TIPO_PAGAMENTO) TIPO_PAGAMENTO, SUM(B.VALOR) VALOR,0 DEVOLUCAO, C.DESCRICAO_PAGAMENTO
                FROM CAIXA A, TIPO_PAGAMENTO_CAIXA B, DESCRICAO_TIPO_PAGAMENTO C
                WHERE A.NUM_ORCAMENTO = B.NUM_ORCAMENTO
                AND C.COD_TIPO_PAGAMENTO2 = B.TIPO_PAGAMENTO
                AND B.DATA = A.DATA
                AND A.data BETWEEN :DT_INICIAL AND :DT_FINAL
                GROUP BY B.TIPO_PAGAMENTO ,C.DESCRICAO_PAGAMENTO";
        return executa::SQL($this->conexao, $sql, $param);
    }

    function acuDevolucaoDH_CA_CH_Mes($param)
    {
        $sql = 'SELECT COALESCE(SUM(VALOR),0) VALOR
                FROM DEVOLUCAO_CAIXA A
                WHERE A.data BETWEEN :DT_INICIAL AND :DT_FINAL';
        return executa::SQL($this->conexao, $sql, $param);
    }

    function acuDevolucaoPedido_Mes($param)
    {
        $sql = "SELECT COALESCE(SUM(A.VALOR),0) VALOR
                FROM DEVOLUCAO A, CAIXA B
                WHERE A.data BETWEEN :DT_INICIAL AND :DT_FINAL
                AND A.DATA_VENDA = B.DATA
                AND A.NUM_ORCAMENTO = B.NUM_ORCAMENTO
                AND B.TIPO_PAGAMENTO = '4'";
        return executa::SQL($this->conexao, $sql, $param);
    }

    function vendaEmpresa($param)
    {
        $sql = 'select  SUM(A.valor + a.valor_montagen) -
                (SELECT SUM(A.VALOR - A.DESCONTO) AS VALOR
                FROM DEVOLUCAO A, CLIENTE C
                WHERE A.ID_CLIENTE = C.ID_CLIENTE
                and A.COD_FUNCIONARIO = 0
                AND A.data BETWEEN :DT_INICIAL AND :DT_FINAL) valor

                from CAIXA A, funcionario B, cargo C, CLIENTE D
                where A.id_vendedor = B.cod_funcionario
                AND A.ID_CLIENTE = D.ID_CLIENTE
                AND D.MESMO_GRUPO = 0
                AND B.id_cargo = C.id_cargo
                AND A.data BETWEEN :DT_INICIAL AND :DT_FINAL
                and a.id_vendedor = 0';
        return executa::SQL($this->conexao, $sql, $param);
    }

    function getMecanica($param)
    {
        $sql = "SELECT SUM(A.QTO * A.VALOR) AS VALOR
                    FROM ITENS_CAIXA A, PRODUTO B, CAIXA C, MARCA E
                    WHERE B.ID_MARCA = E.ID_MARCA
                    AND A.NUM_ORCAMENTO = C.NUM_ORCAMENTO
                    AND A.DATA = C.DATA
                    AND A.COD_PRODUTO = B.COD_PRODUTO
                    AND E.ID_MARCA_GRUPO = 1
                    AND A.DATA BETWEEN :DT_INICIAL AND :DT_FINAL
                    AND C.TIPO_PAGAMENTO <> '0'";
        return executa::SQL($this->conexao, $sql, $param);
    }

    function getMecanicaDevolucao($param)
    {
        $sql = "SELECT SUM((A.VALOR * A.QUANTIDADE)- A.DESCONTO ) DEVOLUCAO FROM
                ITENS_DEVOLUCAO A, PRODUTO B, MARCA C
                WHERE A.DATA BETWEEN :DT_INICIAL AND :DT_FINAL
                AND A.COD_PRODUTO = B.COD_PRODUTO
                AND C.ID_MARCA = B.ID_MARCA
                AND C.ID_MARCA_GRUPO = 1";
        return executa::SQL($this->conexao, $sql, $param);
    }
}
