<?php

include_once '../../superClass/connect/class.connect_firebird.php';

class ContasPagar {

    private $con;
    public $pdo;

    function __construct($id_sociedade) {
        $this->con = ConexaoFirebird::getConectar($id_sociedade);
        if (!$this->con) {
            die('{"loja":"off"}');
            return false;
        }
    }

    function getFornecedores() {
        $sql = "SELECT ID_FORNECEDOR, NOME_FANTAZIA||' - '||
	    CGC_FORNECEDOR AS NOME_FANTAZIA FROM FORNECEDOR
	    WHERE NOME_FANTAZIA IS NOT NULL ORDER BY NOME_FANTAZIA";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getPlacaVeiculos() {
        $sql = "SELECT VEI_ID, VEI_PLACA FROM VEICULOS ORDER BY VEI_PLACA";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getCP($DT_INICIO, $DT_FIM, $TIPO, $ID_FORNECEDOR, $NR_NF) {
        $where = ' WHERE DATA_VENCIMENTO BETWEEN :DT_INICIO AND :DT_FIM ';
        if ($ID_FORNECEDOR != '') {
            $ID_FORNECEDOR = implode(',', $ID_FORNECEDOR);
            $where .= " AND ID_FORNECEDOR IN ($ID_FORNECEDOR) ";
        }
        if ($NR_NF != '') {
            $where .= " AND NUM_NOTA_FISCAL LIKE '$NR_NF%' ";
        }
        if (trim($TIPO) != '0') {
            if (trim($TIPO) == 'BOL') {
                $where .= " AND (TIPO ='BOL' OR TIPO IS NULL) ";
            } else {
                $where .= " AND TIPO = '$TIPO' ";
            }
        }
        $sql = "SELECT * FROM (SELECT A.COD_FATURA, A.DATA_CORREIO, A.DATA_QUITACAO, A.DATA_VENCIMENTO,
	        A.VALOR, B.NUM_NOTA_FISCAL, C.NOME_FANTAZIA, B.DATA_ENTRADA,
	        TRIM(COALESCE(A.TIPO, 'BOL')) TIPO, A.ID_FAVORECIDO, B.ID_FORNECEDOR, ID_FATURAS_APAGAR
	        FROM FATURAS_APAGAR A, ENTRADA_NOTA_FISCAL B, FORNECEDOR C
	        WHERE A.ID_NOTA_FISCAL = B.ID_NOTA_FISCAL AND B.ID_FORNECEDOR = C.ID_FORNECEDOR 
                
            UNION ALL
            
            SELECT A.COD_FATURA, A.DATA_CORREIO, A.DATA_QUITACAO, A.DATA_VENCIMENTO,
            A.VALOR, B.NUM_NOTA, C.NOME_FANTAZIA, B.DATA_ENTRADA,
            TRIM(COALESCE(A.TIPO, 'BOL')) TIPO, A.ID_FAVORECIDO, A.ID_FORNECEDOR, ID_FATURAS_APAGAR
            FROM FATURAS_APAGAR A, NF_ENTRADA_MANIFESTO B, FORNECEDOR C
	        WHERE A.ID_NOTA_FISCAL = B.ID_MANIFESTO
            AND B.ID_FORNECEDOR = C.ID_FORNECEDOR)
            
            $where

            ORDER BY DATA_VENCIMENTO, TIPO, VALOR";

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->bindParam(':DT_INICIO', $DT_INICIO, PDO::PARAM_STR);
        $this->pdo->bindParam(':DT_FIM', $DT_FIM, PDO::PARAM_STR);
//    die($sql);
        $this->pdo->execute();
    }

    function getLicenciamento($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_LICENCIAMENTO_DT DATA_VENCIMENTO, VEI_DOC_LICENCIAMENTO_VL AS VALOR,
			'LICENCIAMENTO '||EXTRACT(YEAR FROM VEI_DOC_LICENCIAMENTO_DT)||' - '||
			B.VEI_MARCA_MODELO||', PLACA: '||B.VEI_PLACA AS DESCRICAO
			FROM VEICULO_DOCUMENTOS A, VEICULOS B
			WHERE (VEI_DOC_LICENCIAMENTO_DT BETWEEN '$DT_INICIO' AND '$DT_FIM')
			AND B.VEI_ID = A.VEI_DOC_ID_VEICULO
			AND B.VEI_CATEGORIA <> 'VEN' $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getSeguro($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_SEGURO_DT DATA_VENCIMENTO, VEI_DOC_SEGURO_VL AS VALOR,
	    'SEGURO '||EXTRACT(YEAR FROM VEI_DOC_SEGURO_DT)||' - '||VEI_MARCA_MODELO||', PLACA: '||VEI_PLACA AS DESCRICAO
	    FROM VEICULO_DOCUMENTOS A, VEICULOS B
	    WHERE VEI_DOC_SEGURO_DT IS NOT NULL
	    AND (VEI_DOC_SEGURO_DT BETWEEN '$DT_INICIO' AND '$DT_FIM')
			AND B.VEI_ID = A.VEI_DOC_ID_VEICULO
			AND B.VEI_CATEGORIA <> 'VEN' $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getIPVA_cotaUnica($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_IPVA_DT DATA_VENCIMENTO, VEI_DOC_IPVA_VL AS VALOR,
	    'IPVA '||EXTRACT(YEAR FROM VEI_DOC_IPVA_DT)||' - '||VEI_MARCA_MODELO||', PLACA: '||VEI_PLACA||', COTA ÚNICA' AS DESCRICAO
	    FROM VEICULO_DOCUMENTOS, VEICULOS
	    WHERE (VEI_ID = VEI_DOC_ID_VEICULO AND VEI_CATEGORIA <> 'VEN') AND VEI_DOC_IPVA_VL IS NOT NULL
	    AND (VEI_DOC_IPVA_DT BETWEEN '$DT_INICIO' AND '$DT_FIM') $WHERE";
        $this->pdo = $this->con->prepare($sql);
//    die($sql);
        $this->pdo->execute();
    }

    function getIPVA_parcela1($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_IPVA_DT1 DATA_VENCIMENTO, VEI_DOC_IPVA_VL1 AS VALOR,
	    'IPVA 1ª PARCELA '||EXTRACT(YEAR FROM VEI_DOC_IPVA_DT1)||' - '||
	    VEI_MARCA_MODELO||', PLACA: '||VEI_PLACA AS DESCRICAO
	    FROM VEICULO_DOCUMENTOS, VEICULOS
	    WHERE (VEI_ID = VEI_DOC_ID_VEICULO) AND VEI_DOC_IPVA_VL1 IS NOT NULL AND VEI_CATEGORIA <> 'VEN'
	    AND (VEI_DOC_IPVA_DT1 BETWEEN '$DT_INICIO' AND '$DT_FIM') $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getIPVA_parcela2($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_IPVA_DT2 DATA_VENCIMENTO, VEI_DOC_IPVA_VL2 AS VALOR,
	    'IPVA 2ª PARCELA '||EXTRACT(YEAR FROM VEI_DOC_IPVA_DT2)||' - '||
	    VEI_MARCA_MODELO||', PLACA: '||VEI_PLACA AS DESCRICAO
	    FROM VEICULO_DOCUMENTOS, VEICULOS
	    WHERE (VEI_ID = VEI_DOC_ID_VEICULO) AND VEI_DOC_IPVA_VL2 IS NOT NULL AND VEI_CATEGORIA <> 'VEN'
	    AND (VEI_DOC_IPVA_DT2 BETWEEN '$DT_INICIO' AND '$DT_FIM') $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getIPVA_parcela3($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (VEI_DOC_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT VEI_DOC_IPVA_DT3 DATA_VENCIMENTO, VEI_DOC_IPVA_VL3 AS VALOR,
	    'IPVA 3ª PARCELA '||EXTRACT(YEAR FROM VEI_DOC_IPVA_DT3)||' - '||
	    VEI_MARCA_MODELO||', PLACA: '||VEI_PLACA AS DESCRICAO
	    FROM VEICULO_DOCUMENTOS, VEICULOS
	    WHERE (VEI_ID = VEI_DOC_ID_VEICULO) AND VEI_DOC_IPVA_VL3 IS NOT NULL AND VEI_CATEGORIA <> 'VEN'
	    AND (VEI_DOC_IPVA_DT3 BETWEEN '$DT_INICIO' AND '$DT_FIM') $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getManutencoes($DT_INICIO, $DT_FIM) {
        $sql = "SELECT VEI_MAN_ID, VEI_MAN_ID_VEICULO, VEI_MAN_DATA, VEI_MAN_TIPO,
	    VEI_MAN_ITEM, VEI_MAN_KM_ATUAL, VEI_MAN_KM_FUTURO, TRIM(VEI_MAN_FORMA_PAGTO) VEI_MAN_FORMA_PAGTO,
	    VEI_MAN_VALOR, VEI_MAN_OBS
	    FROM VEICULO_MANUTENCAO
	    WHERE (VEI_MAN_FORMA_PAGTO <> 'DIN') AND (VEI_MAN_DATA BETWEEN '$DT_INICIO' AND '$DT_FIM') ORDER BY VEI_MAN_DATA, VEI_MAN_FORMA_PAGTO";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    function getPlacasMultas($DT_INICIO, $DT_FIM, $PLACAS) {
        $WHERE = '';
        if ($PLACAS != '') {
            $PLACAS = implode(',', $PLACAS);
            $WHERE = " AND (A.MUL_ID_VEICULO IN ($PLACAS))";
        }
        $sql = "SELECT A.MUL_VALOR VALOR, A.MUL_DATA DATA_VENCIMENTO,
	    B.VEI_MARCA_MODELO, TRIM(B.VEI_PLACA) VEI_PLACA, C.LOGIN MOTORISTA
	    FROM VEICULO_MULTAS A, VEICULOS B, FUNCIONARIO C
	    WHERE B.VEI_ID = A.MUL_ID_VEICULO
	    AND (MUL_DATA BETWEEN :DT_INICIO AND :DT_FIM)
	    AND A.MUL_ID_FUNCIONARIO = C.COD_FUNCIONARIO $WHERE";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->bindParam(':DT_INICIO', $DT_INICIO, PDO::PARAM_STR);
        $this->pdo->bindParam(':DT_FIM', $DT_FIM, PDO::PARAM_STR);
        $this->pdo->execute();
//    echo $sql;
    }

}
