<?php
$p = 'home.php';
if (!empty($_GET['p'])) {
  $p = $_GET['p'] . '.php';
}
?>

<!DOCTYPE html lang="pt-br">
<html>

<head>
  <meta charset="UTF-8">
  <link rel="icon" href="img/redereal.ico">
  <meta name="format-detection" content="telephone=no">
  <meta name="msapplication-tap-highlight" content="no">
  <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
  <meta name="google" content="notranslate">

  <link href="css/index.css" rel="stylesheet" type="text/css" />

  <link rel="stylesheet" href="css/materialize.min.css">

  <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css" />

  <link href="plugins/ui/jquery-ui.css" rel="stylesheet" type="text/css" />

  <link href="login/login.css" rel="stylesheet" type="text/css" />

  <link href="plugins/mofo/mofo.css" rel="stylesheet" type="text/css" />

  <link href="plugins/mofo/mofo_dark.css" rel="stylesheet" type="text/css" />

  <link href="plugins/xGrid3.0/css/xGrid3.0.css" rel="stylesheet" type="text/css" />

  <link href="plugins/calculadoraXico-2.0/calculadoraXicoDark.css" rel="stylesheet" type="text/css" />

  <link href="plugins/calendario/calendar.css" rel="stylesheet" type="text/css" />

  <link href="plugins/chosen/chosen.css" rel="stylesheet" type="text/css" />

  <link href="css/animate.css" rel="stylesheet" type="text/css" />

  <script src="js/jquery-2.2.1.min.js" type="text/javascript"></script>

  <script src="js/vue.min.js" type="text/javascript"></script>

  <title>Rede Real</title>

</head>

<body>

  <div id="preLoad" class="center">
    <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
    <br>
    <span class="blue-grey-text text-lighten-1">Carregando . . .</span>
  </div>



  <nav>
    <div class="nav-wrapper blue-grey darken-4">
      <a href="#!" id="pnNome" class="right">Rede Real </a>
      <a href="#!" class="center" id="pnOnde"></a>
      <ul class="left">
        <li>
          <a class="btn-floating btn-flat waves-effect waves-light" id="btnMenuLeft" data-activates="MenuLeft">
            <i class="fa fa-bars"></i>
          </a>
        </li>
      </ul>
    </div>
  </nav>



  <div id="MenuLeft" class="side-nav blue-grey darken-4 blue-grey-text text-lighten-5">
    <ul>
      <li><a class="subheader blue-grey-text text-lighten-5 center" style="border-bottom: 1px solid #37474f">Menu</a></li>
      <li><a class="blue-grey-text text-lighten-5" href="?p=cotacao/cotacao">Cotação de Produto</a></li>
      <li><a class="blue-grey-text text-lighten-5" href="?p=cotadores/cotadores">Cotadores</a></li>
      <li><a class="blue-grey-text text-lighten-5" href="?p=vendaVendedor/vendaVendedor">Venda Por Vendedor</a></li>
      <li><a class="blue-grey-text text-lighten-5" href="?p=vendaCRR/vendaCRR">Venda CRR</a></li>
      <li><a class="blue-grey-text text-lighten-5" onclick="calculadoraXico.openModal();" href="#1">Caculadora F4</a></li>
      <li><a class="blue-grey-text text-lighten-5" onclick="calendario.showCalendario()" href="#1">Canlendario Insert</a></li>

      <li><a id="btnSair" class="blue-grey-text text-lighten-5" href="#!">Sair</a></li>

    </ul>
  </div>



  <div id="pnPrincipal">
    <?php require_once($p); ?>
  </div>


  <div id="pnLoginMain" style="display: none">
    <div class="pnLoginBox">

      <div class="pnLoginFields">
        <!--<div class="pnLoginId">Siap+</div>-->
        <label class="pnLoginFuncionario"></label>

        <input value="" type="text" placeholder="Nome" maxlength="11" autocomplete="off" required id="pnLoginId_funcionario" />

        <label class="pnLoginSenha"></label>
        <input value="" type="password" placeholder="Senha" maxlength="20" required id="pnLoginSenha" />

        <button id="btnLogin" class="waves-effect waves-light">
          <i class="fa fa-sign-in"></i>
          Entrar</button>

      </div>

    </div>
  </div>

  <!--todos os scripts abaixo deste-->

  <!--configurar date-->
  <script src="js/data.js" type="text/javascript"></script>

  <!--Materialize-->
  <script src="js/materialize.min.js"></script>

  <script src="js/utilitarioV5.js" type="text/javascript"></script>

  <!--ui jquery-->
  <script src="plugins/ui/jquery.ui.datepicker-pt-BR.js" type="text/javascript"></script>
  <script src="plugins/ui/jquery-ui.min.js" type="text/javascript"></script>

  <!--chosen select-->
  <script src="plugins/chosen/chosen.jquery.min.js" type="text/javascript"></script>

  <!--MaskMoney-->
  <script src="plugins/maskMoney.min.js" type="text/javascript"></script>

  <!--xGrid-->
  <script src="plugins/xGrid3.0/xGrid-3.0.js" type="text/javascript"></script>

  <!--Mofo Modal-->
  <script src="plugins/mofo/mofo.js" type="text/javascript"></script>
  <script src="plugins/mofo/mofo-modal.js" type="text/javascript"></script>

  <!--photSwipe-->
  <script src="plugins/photoSwipe/photoswipe.min.js" type="text/javascript"></script>
  <script src="plugins/photoSwipe/photoswipe-ui-default.min.js" type="text/javascript"></script>

  <!--sideBySide-->
  <script src="plugins/dataSource.js" type="text/javascript"></script>

  <!--chart js-->
  <script src="plugins/canvasjs/jquery.canvasjs.min.js" type="text/javascript"></script>

  <!--Calculadora-->
  <script src="plugins/calculadoraXico-2.0/calculadoraXico-2.0.js" type="text/javascript"></script>

  <!--Login-->
  <script src="login/login.js" type="text/javascript"></script>

  <!--js principal-->
  <script src="js/redereal.js" type="text/javascript"></script>

  <!--calendario-->
  <script src="plugins/calendario/calendar.js" type="text/javascript"></script>


</body>

</html>