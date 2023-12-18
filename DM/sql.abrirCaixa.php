<?php

include_once '../DM/prepareSql.php';

class SqlAbrirCaixa {

    private $conexao;

    function __construct($conexao) {
        $this->conexao = $conexao;
    }

    function getCaixas() {
        $sql = 'SELECT A.HORA_ABERTURA, A.HORA_FECHAMENTO, A.ID_ABERTURA_CAIXA, B.LOGIN, B.CPF, A.STATUS
                FROM ABERTURA_CAIXA A, FUNCIONARIO B
                WHERE A.DATA_ABERTURA = CURRENT_DATE
                AND B.COD_FUNCIONARIO = A.COD_FUNCIONARIO';
        return executa::SQL($this->conexao, $sql, []);
    }

    function getMDC() {
        $sql = 'SELECT trim(STATOS) STATOS, DATA, OPEN_CLOSE FROM MDC
                WHERE DATA = CURRENT_DATE';
        return executa::SQL($this->conexao, $sql, []);
    }

    function verificaCaixaAberto($param) {
        $sql = 'SELECT ID_ABERTURA_CAIXA FROM ABERTURA_CAIXA
                WHERE DATA_FECHAMENTO IS NULL
                AND DATA_ABERTURA = CURRENT_DATE
                AND COD_FUNCIONARIO = :COD_FUNCIONARIO';
        return executa::SQL($this->conexao, $sql, $param);
    }

    function abrirCaixa($param) {
        $sql = 'INSERT INTO ABERTURA_CAIXA
                (COD_FUNCIONARIO, DATA_ABERTURA, HORA_ABERTURA, STATUS, TROCO, USUARIO)
                VALUES
                (:COD_FUNCIONARIO, CURRENT_DATE, current_time, 1, :TROCO, :USUARIO)';
        return executa::SQL($this->conexao, $sql, $param);
    }

    function fecharCaixa($param) {
        $sql = 'UPDATE ABERTURA_CAIXA
                SET DATA_FECHAMENTO = CURRENT_DATE,
                        HORA_FECHAMENTO = current_time,
                        STATUS = 2
                WHERE ID_ABERTURA_CAIXA = :ID_ABERTURA_CAIXA';
        return executa::SQL($this->conexao, $sql, $param);
    }

}
