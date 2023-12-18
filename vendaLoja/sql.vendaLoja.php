<?php

include_once '../../superClass/connect/class.connect_firebird.php';
include_once '../DM/prepareSql.php';

class SqlVendaLoja {

    private $conexao;

    function __construct($conexao) {
        $this->conexao = $conexao;
    }

    function getMontagem($param) {
        $sql = 'select distinct(a.id_montador), sum(a.valor) as valor, c.login
                    from repo_ordemdeservico a, funcionario c
                    where a.id_montador = c.cod_funcionario
                    AND data between :dtInical and :dtFinal
                    group by a.id_montador, c.login';
        return executa::SQL($this->conexao, $sql, $param);
    }

}
