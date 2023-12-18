<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once 'class.contas_pagar.php';
include_once '../DM/class.favorecido.php';
include_once '../DM/class.fornecedor.php';

$ax = '';
extract($_POST);

$contasPagar = new ContasPagar($id_sociedade);
$favorecido = new Favorecido($id_sociedade);
$fornecedor = new Fornecedores($id_sociedade);

if ($ax == 'getPlacaVeiculos') {
  $contasPagar->getPlacaVeiculos();
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getCP') {
  $contasPagar->getCP($DT_INICIO, $DT_FIM, $TIPO, $ID_FORNECEDOR, $NR_NF);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getLicenciamento') {
  $contasPagar->getLicenciamento($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getSeguro') {
  $contasPagar->getSeguro($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getIPVA_cotaUnica') {
  $contasPagar->getIPVA_cotaUnica($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getIPVA_parcela1') {
  $contasPagar->getIPVA_parcela1($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getIPVA_parcela2') {
  $contasPagar->getIPVA_parcela2($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getIPVA_parcela3') {
  $contasPagar->getIPVA_parcela3($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getPlacasMultas') {
  $contasPagar->getPlacasMultas($DT_INICIO, $DT_FIM, $PLACAS);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getManutencoes') {
  $contasPagar->getManutencoes($DT_INICIO, $DT_FIM);
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

// FORNECEDORES
if ($ax == 'getFornecedores') {
  $contasPagar->getFornecedores();
  $retorno = $contasPagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}
if ($ax == 'getFornecedor') {
  $fornecedor->getFornecedor($id_fornecedor);
  $retorno = $fornecedor->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

// FAVORECIDO
if ($ax == 'getFavorecido') {
  $favorecido->getFavorecido($id_favorecido);
  $retorno = $favorecido->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}
