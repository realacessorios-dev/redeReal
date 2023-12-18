<?php

session_cache_limiter(1);
ob_start(); /* Evitando warning */
session_start();
include_once('../connect/class.connect_mysql.php');
include_once '../connect/class.onde.php';

$gmtDate = gmdate("D, d M Y H:i:s");
header("Expires: {$gmtDate} GMT");
header("Last-Modified: {$gmtDate} GMT");


function prepareSQL($sql, $param) {
  $new = array();
  foreach ($param as $id => $value) {
    if (!is_numeric($value))
      $value = "'" . addslashes($value) . "'";
    $new[":$id"] = $value;
  }
//  print_r($new);
//  die(strtr($sql, $new));
  return strtr($sql, $new);
}

extract($_POST);

if ($ax == 'setLogin') {
  $con = ConexaoMysql::getConectar();

  $param['senha'] = base64_decode($param['senha']);

  $sql = "select id_usuario, loja, nome, restrito, id_sociedade, email 
          from usuario
	  where nome = :nome 
          and senha = :senha";

  $sql = prepareSQL($sql, $param);

  $pdo = $con->prepare($sql);
  $pdo->execute();

  $result = @$pdo->fetch(PDO::FETCH_OBJ);

  if (@$result->nome != '') {
    $aux = time() . date('Ymd');
    $codigo = md5($aux);
    $_SESSION['redeReal'] = $codigo;
    $_SESSION['id_usuario'] = $result->id_usuario;
    $_SESSION['nome'] = $result->nome;
    $_SESSION['loja'] = $result->loja;
    $_SESSION['restrito'] = $result->restrito;
    $_SESSION['id_sociedade'] = $result->id_sociedade;
    $_SESSION['email'] = $result->email;

    echo json_encode($_SESSION);
  } else {
    echo '{"loginErro":"Usuário ou senha não Confere"}';
  }
}


if ($ax == 'getLogin') {

  $redeReal = @$_SESSION['redeReal'];
  $nome = @$_SESSION['nome'];
  $loja = @$_SESSION['loja'];
  $restrito = @$_SESSION['restrito'];
  $id_sociedade = @$_SESSION['id_sociedade'];
  $email = @$_SESSION['email'];
  $id_usuario = @$_SESSION['id_usuario'];

  if ($redeReal != '') {
    echo '{"nome":"' . $nome . '",'
    . '"id_sociedade":"' . $id_sociedade . '",'
    . '"loja":"' . $loja . '",'
    . '"restrito":"' . $restrito . '",'
    . '"email":"' . $email . '",'
    . '"redeReal":"' . $redeReal . '",'
    . '"id_usuario":"' . $id_usuario . '"'
    . '}';
  } else {
    $onde = new Onde();
    $onde->getLoja();
//    $onde->getLoja('191.33.176.211');
    echo '{"loginErro":"", "loja":"' . $onde->GetRazao() . '"}';
  }
}

if ($ax == 'logout') {
  session_destroy();


  echo '{"logout":"ok"}';
}

