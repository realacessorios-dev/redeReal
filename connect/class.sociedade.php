<?php

include_once('class.connect_mysql.php');

/**
 * Lista Lojas
 * @return Um select com rela��o de todas as loja disponives.
 *
 * Retorna Loja
 * @return Retorna Lista da loja que foi selecionada;
 *
 */
class Sociedade {

    private $con;
    public $pdo;

    public function __construct() {
        $this->con = ConexaoMysql::getConectar();
    }

    /**
     * @return Retorna Select com op��o da sociedade e uma op��o de todas as lojas
     * Op��o de Todas as Lojas esta setado com true caso queira mude para false.
     */
    public function getListaLojaSelect($OpcaoTodasLojas = TRUE) {

        $sql = "select loja, id_sociedade from sociedade order by loja";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();


        if ($OpcaoTodasLojas)
            $bloco = '<select name="loja" id="SelectLoja"><option value="0"><<  Todas Lojas  >></option>';
        else
            $bloco = '<select style="width:280px" name="loja" id="SelectLoja"><option value="-1"><<  Selecione um Loja  >></option>';


        while ($ln = $this->pdo->fetch(PDO::FETCH_OBJ)) {
            $bloco = $bloco . '<option value="' . $ln->id_sociedade . '">' . $ln->loja . '</option>';
        }

        $bloco = $bloco . '</select>';
        echo $bloco;
    }

    public function getListaLojaSiraSelect($OpcaoTodasLojas = TRUE) {


        $sql = "select loja, id_sociedade from sociedade order by loja";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();


        if ($OpcaoTodasLojas)
            $bloco = '<select style="width:99%" name="loja" id="SelectLoja"><option value="0"><<  Todas Lojas  >></option>';
        else
            $bloco = '<select style="width:280px" name="loja" id="SelectLoja"><option value="-1"><<  Selecione um Loja  >></option>';

        $bloco = $bloco . '<option value="sira">SIRA</option>';
        while ($ln = $this->pdo->fetch(PDO::FETCH_OBJ)) {
            $bloco = $bloco . '<option value="' . $ln->id_sociedade . '">' . $ln->loja . '</option>';
        }

        $bloco = $bloco . '</select>';
        echo $bloco;
    }

    public function getLojas() {
        $sql = "select id_sociedade, loja, telefone, cnpj from sociedade order by loja";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    public function getIdLojas() {
        $sql = "select id_sociedade, loja from sociedade order by loja";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    public function getLoja($id_sociedade) {
        $sql = "select banco,  endereco from sociedade
            where id_sociedade = $id_sociedade limit 1";
        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

    public function getLojaCabecalho($id_sociedade) {
        $sql = "select razao_social, endereco, bairro, cidade, cep, cnjp, incricao, telefone
  	    from loja
	    where id_sociedade = '$id_sociedade'";

        $this->pdo = $this->con->prepare($sql);
        $this->pdo->execute();
    }

}
