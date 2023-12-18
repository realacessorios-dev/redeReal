<?php

include_once 'class.gerenciar_contas_apagar.php';
include_once '../bancos/class.banco.php';
include_once '../favorecido/class.favorecido.php';
include_once '../fornecedores/class.fornecedor.php';

$ax = '';
extract($_POST);

$gerenciarContasApagar = new GerenciarContasApagar($id_sociedade);

if ($ax == 'getNF') {
  $gerenciarContasApagar->getNF($loc);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getCabecalho') {
  $gerenciarContasApagar->getCabecalho($id_nota_fiscal);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFaturas') {
  $gerenciarContasApagar->getFaturas($id_nota_fiscal);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFatura') {
  $gerenciarContasApagar->getFaturas($id_fatura);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'postFatura') {
  $gerenciarContasApagar->postFatura($ID_FATURA, $DATA_VENCIMENTO, $VLR_FATURA, $DATA_CORREIO, $DATA_QUITACAO, $QUITACAO, $TIPO, $ID_FAVORECIDO, $VINCULO);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

IF ($ax == 'getBancos') {
  $banco = new Bancos($id_sociedade);
  $banco->getBancos();
  $retorno = $banco->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFavorecidos') {
  $favorecido = new Favorecido($id_sociedade);
  $favorecido->getFavorecidos();
  $retorno = $favorecido->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFavorecido') {
  $favorecido = new Favorecido($id_sociedade);
  $favorecido->getFavorecido($id_favorecido);
  $retorno = $favorecido->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFavorecidosOrFornecedores') {
  $favorecido = new Favorecido($id_sociedade);
  $favorecido->getFavorecidosOrFornecedores($loc);
  $retorno = $favorecido->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'addFavorecido') {
  $favorecido = new Favorecido($id_sociedade);
  $favorecido->addFavorecido($CD_BANCO, $CD_AGENCIA, $NR_CONTA, $CD_OPERACAO, $NM_FAVORECIDO, $TP_VINCULO, $NR_CPF, $NR_CNPJ, $NM_MATRIZ, $TX_OBS);
  $retorno = $favorecido->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'setQuitacao') {
  $gerenciarContasApagar->setQuitacao($fatura);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'setRecebimentoECT') {
  $gerenciarContasApagar->setRecebimentoECT($fatura);
  $retorno = $gerenciarContasApagar->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

if ($ax == 'getFornecedor') {
  $fornecedor = new Fornecedores($id_sociedade);
  $fornecedor->getFornecedor($id_fornecedor);
  $retorno = $fornecedor->pdo->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($retorno);
}

