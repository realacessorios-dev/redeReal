<?php
include_once '../class/encrypt.php';
?>
<!DOCTYPE html lang="pt-br">
<html>
    <head>
        <meta charset="UTF-8">
        <link rel="icon" href="../img/coins.png">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <meta name="google" content="notranslate">

        <link href="../css/index.css" rel="stylesheet" type="text/css"/>

        <link rel="stylesheet" href="../css/materialize.min.css">

        <style> 
            html {background: #ededed;}
            td, th {
                padding: 3px 2px;   
            }
        </style>

        <script src="../js/jquery-2.2.1.min.js" type="text/javascript"></script>

        <title>Cotação Real Acessórios</title>


        <script>
            var id = '<?php echo $_GET['id'] ?>';

//            var chave = chave.split('|');
//            var id = chave[2];
//            var num_pedido = chave[1];
//            var id_sociedade = chave[0];
        </script>

        <script src="produtos_ganhos.js" type="text/javascript"></script>
    </head>

    <body>

        <div style="width:720px; margin: 0 auto;">
            <div id="pnCabecaho" >
                <table width="100%" class="tbTitulo"> 
                    <tr> 
                        <td rowspan="4" style="width: 150px;"><img src="http://www.redereal.com.br/img/REAL_LOGO.png" width="155" alt=""/></td> 
                        <td colspan="3" style="font-weight: bold" id="pnRazao"></td> 
                        <td style="width: 150px; font-size: 14px;" id="pnDate"></td> 
                    </tr> 
                    <tr> 
                        <td colspan="3" id="pnEndereco"></td> 
                        <td id="pnCNPJ"></td> 
                    </tr> 
                    <tr> 
                        <td>Cidade.: <span id="pnCidade"></span></td> 
                        <td>Bairro.: <span id="pnBairro"></span></td> 
                        <td>CEP.: <span id="pnCEP"></span></td> 
                        <td><span id="pnInscricao"></span></td> 
                    </tr> 
                    <tr> 
                        <td>Telefone.: <span id="pnTel"></span></td> 
                        <td></td> 
                        <td></td> 
                        <td></td> 
                    </tr> 
                    <tr> 
                        <td colspan="5" align="center" style="border-top: 1px solid; text-align: center">
                            <div class="titulos">Pedido referente a Cotação de Nº <b><span id="pnNumCotacao"></span></b></div>
                        </td> 
                    </tr> 
                </table>
            </div>


            <div id="pnItens" class="table">
                <div style="text-align: center">
                    <img src="../img/ajax-loader.gif" alt=""/>
                </div>
            </div>
            
            <div id="pnObs"></div>

        </div>



        <!--todos os scripts abaixo deste-->
        <!--Materialize-->
        <script src="../js/materialize.min.js"></script>

        <script src="../js/utilitarioV5.js" type="text/javascript"></script>


    </body>
</html>
