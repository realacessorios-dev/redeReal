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

        <link href="../css/font-awesome.min.css" rel="stylesheet" type="text/css"/>

        <!--<link href="plugins/ui/jquery-ui.css" rel="stylesheet" type="text/css"/>-->

        <link href="../plugins/mofo/mofo.css" rel="stylesheet" type="text/css"/>

        <link href="../plugins/mofo/mofo_dark.css" rel="stylesheet" type="text/css"/>

        <link href="../css/animate.css" rel="stylesheet" type="text/css"/>

        <!--PhotoSwipe-->
        <link href="../plugins/photoSwipe/photoswipe.css" rel="stylesheet" type="text/css"/>
        <link href="../plugins/photoSwipe/default-skin/default-skin.css" rel="stylesheet" type="text/css"/>

        <link href="../plugins/xGrid3.0/css/xGrid3.0.css" rel="stylesheet" type="text/css"/>

        <script src="../js/jquery-2.2.1.min.js" type="text/javascript"></script>

        <title>Cotação Real Acessórios</title>
        <script>
            var id = '<?php echo $_GET['id'] ?>';
        </script>

    </head>

    <body>

        <nav>
            <div class="nav-wrapper blue-grey darken-4">
                <a id="btnLoja" href="#!"><div id="pnLoja" class="center-align"></div></a>
            </div>
        </nav>


        <!--menu para cotadores-->
        <ul class="xMenu" id="popOpcao" style="width: 250px">
            <li onclick="cotadores.finalizarCotacao()" ><i class="fa fa-close"></i>Finalizar Cotação</li>
            <li id="btnImprimir" ><i class="fa fa-print"></i>Imprimir</li>
<!--            <li id="" ><i class="fa fa-code"></i>Exportar .json</li>
            <li id="" ><i class="fa fa-file-code-o"></i>Exportar .xml</li>
            <li id="" ><i class="fa fa-file-excel-o"></i>Exportar .xls</li>
            <li id="" ><i class="fa fa-mail-reply-all"></i>Importar Arquivo</li>-->
        </ul>

        <div id="pnQto" style="display:  none;">
            <div class="row sbsProduto">
                <div class="col s8">
                    <label>Meu Código</label>
                    <b><div name="meu_codigo">999</div></b>
                    <label>Descrição Produto</label>
                    <b><div class="truncate" name="desc_produto" ></div></b>
                    <label>Carro</label>
                    <b><div name="carro" ></div></b>
                </div>
                <div class="col s4">
                    <label>Valor</label>
                    <input type="text" id="btnValor" class="real" style="text-align: right; padding-right: 5px; width: 75px!important;">
                    <div class="right" style="margin-right: 5px;">
                        <button id="btnUpValor" class="btn-floating waves-effect waves-light blue-grey darken-2">
                            <i class="fa fa-save"></i>
                        </button>
                    </div>          
                </div>
            </div>
        </div>



        <div id="pnPrincipal">
            <div id="pnDadosLoja" style="display: none">
                <div class="row">
                    <div class="col s6">
                        <label>Empresa</label>
                        <b><div id="dtNome"></div></b>
                    </div>
                    <div class="col s3">
                        <label>CNPJ</label>
                        <b><div id="dtCNPJ" ></div></b>
                    </div>
                    <div class="col s3">
                        <label>Inscrição Estadual</label>
                        <b><div id="dtInscricao"></div></b>
                    </div>        
                </div>
                <div class="row">
                    <div class="col s4">
                        <label>Endereço</label>
                        <b><div id="dtEndereco"></div></b>
                    </div>
                    <div class="col s2">
                        <label>CEP</label>
                        <b><div id="dtCep"></div></b>
                    </div>
                    <div class="col s3">
                        <label>Cidade</label>
                        <b><div id="dtCidade"></div></b>
                    </div>        
                    <div class="col s3">
                        <label>Bairro</label>
                        <b><div id="dtBairro"></div></b>
                    </div>        
                </div>
            </div>

            <div class="right">
                <button id="btnSobreMeu" class="btn waves-effect waves-light blue-grey darken-2" style="margin-right: 100px">Sobre Meu Código</button>

                <button class="btnOpcao btn-floating waves-effect waves-light blue-grey darken-2">
                    <i class="btnOpcao fa fa-bars"></i>
                </button>
            </div>


            <div id="pnSobreMeuCodigo" style="display: none; font-size: 14px; text-align: justify">
                <p>O “Meu Código” foi criado para você representante/fornecedor colocar o seu código, este estará atrelado somente ao seu cadastro e estará sempre disponível nas próxima cotações e pedidos.
                    Assim facilitando a sua localização em seu sistema. 
                </p>
            </div>


            <div class="fadeIn animated tab" style="padding-top: 10px;">
                <!--tab1-->
<!--                <input id="tab1" class="tabInput" type="radio" name="tabs">
                <label for="tab1" class="tabLabel" ><i class="fa fa-th"></i>Grid</label>-->

                <!--tab2-->
                <input id="tab2" class="tabInput" type="radio" name="tabs" checked>
                <label for="tab2" class="tabLabel"><i class="fa fa-list"></i>Lista</label>

                <!--conteudo do tab1-->
                <section id="content1">
                    <div class="row sbsProduto" style="height: 110px;">
                        <div class="col s3">
                            <div id="pnFotoProduto"></div>
                        </div>
                        <div class="col s9">
                            <div class="row">
                                <div class="col s4">
                                    <label>Meu Código</label>
                                    <b><div name="meu_codigo" ></div></b>
                                </div>
                                <div class="col s4">
                                    <label>Nº Fabricante</label>
                                    <b><div name="num_fabricante"></div></b>
                                </div>
                                <div class="col s4">
                                    <label>Nº Fabricante2</label>
                                    <b><div name="num_fabricante2"></div></b>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s6">
                                    <label>Descrição Produto</label>
                                    <b><div name="desc_produto" ></div></b>
                                </div>
                                <div class="col s3">
                                    <label>Carro</label>
                                    <b><div name="carro"></div></b>
                                </div>
                                <div class="col s3">
                                    <label>QTO</label>
                                    <b><div name="qto"></div></b>
                                </div>
                            </div>
                            <div class="col s12">
                                <a href="#!" class="btn waves-effect waves-light blue-grey darken-2"><i class="fa fa-picture-o"></i>  Adicionar Foto</a>
                                <a href="#!" class="btn waves-effect waves-light blue-grey darken-2"><i class="fa fa-adjust"></i>  Adicionar Meu Código</a>
                            </div>
                        </div>
                    </div>

                    <div id="pnGrid"></div>
                </section>
                <!--conteudo do tab2-->
                <section id="content2" class="row">
                    <div id="pnLista" class="table"></div>
                </section>



            </div>

        </div>


        <!--html para exibir fotos-->
        <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

            <div class="pswp__bg"></div>

            <!-- Slides wrapper with overflow:hidden. -->
            <div class="pswp__scroll-wrap">

                <!-- Container that holds slides. PhotoSwipe keeps only 3 slides in DOM to save memory. -->
                <div class="pswp__container">
                    <!-- don't modify these 3 pswp__item elements, data is added later on -->
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                    <div class="pswp__item"></div>
                </div>

                <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
                <div class="pswp__ui pswp__ui--hidden">

                    <div class="pswp__top-bar">

                        <!--  Controls are self-explanatory. Order can be changed. -->

                        <div class="pswp__counter"></div>

                        <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

                        <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

                        <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                        <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
                        <!-- element will get class pswp__preloader--active when preloader is running -->
                        <div class="pswp__preloader">
                            <div class="pswp__preloader__icn">
                                <div class="pswp__preloader__cut">
                                    <div class="pswp__preloader__donut"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                        <div class="pswp__share-tooltip"></div> 
                    </div>

                    <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                    </button>

                    <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                    </button>

                    <div class="pswp__caption">
                        <div class="pswp__caption__center">

                        </div>

                    </div>

                </div>

            </div>

        </div>


        <!--modal meu codigo-->
        <div id="pnModalMeuCodigo" style="display: none" class="center">
            <div><span>Meu Código</span></div>
            <input type="text" id="edtMeuCodigo" style="width: 100%; text-align: center">
        </div>



        <!--todos os scripts abaixo deste-->


        <!--Materialize-->
        <script src="../js/materialize.min.js"></script>

        <script src="../js/utilitarioV5.js" type="text/javascript"></script>

        <!--MaskMoney--> 
        <script src="../plugins/maskMoney.min.js" type="text/javascript"></script>

        <!--xGrid-->
        <script src="../plugins/xGrid3.0/xGrid-3.0.js" type="text/javascript"></script>

        <!--Mofo Modal-->
        <script src="../plugins/mofo/mofo.js" type="text/javascript"></script>
        <script src="../plugins/mofo/mofo-modal.js" type="text/javascript"></script>

        <!--photSwipe-->
        <script src="../plugins/photoSwipe/photoswipe.min.js" type="text/javascript"></script>
        <script src="../plugins/photoSwipe/photoswipe-ui-default.min.js" type="text/javascript"></script>


        <!--js principal-->
        <script src="cotadores.js" type="text/javascript"></script>


    </body>
</html>



