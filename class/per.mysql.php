<?php

session_cache_limiter(1);
ob_start();
session_start();

extract($_POST);

class mysql {

    function getListaLojaSelect() {
        include_once '../connect/class.sociedade.php';
        $lojas = new Sociedade();
        $lojas->getListaLojaSelect();
    }

    function getIdLojas() {
        include_once '../connect/class.sociedade.php';
        $lojas = new Sociedade();
        $lojas->getIdLojas();
        $rs = $lojas->pdo->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($rs);
    }

}

if (isset($redeReal)) {

    if ($redeReal == $_SESSION['redeReal']) {
        $class = new $class();
        $class->$call(@$param);
    }
}
