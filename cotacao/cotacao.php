<!--<link href="superClass/log_produto/log_produto.css" rel="stylesheet" type="text/css"/>
<script src="cotacao/cotacao.js" type="text/javascript"></script>
<script src="superClass/log_produto/log_produto.js" type="text/javascript"></script>
<link href="superClass/pecaOnline/pecaOnline.css" rel="stylesheet" type="text/css"/>
<script src="superClass/pecaOnline/pecaOnline.js" type="text/javascript"></script>
<title>Cotação de Produtos</title>-->


<link href="../superClass/log_produto/log_produto.css" rel="stylesheet" type="text/css"/>
<script src="cotacao/cotacao.js" type="text/javascript"></script>
<script src="../superClass/log_produto/log_produto.js" type="text/javascript"></script>
<link href="../superClass/pecaOnline/pecaOnline.css" rel="stylesheet" type="text/css"/>
<script src="../superClass/pecaOnline/pecaOnline.js" type="text/javascript"></script>
<title>Cotação de Produtos</title>


<!--itens do produto e da montagem-->
<div class="filtro" style="min-width: 150px; margin-top: 3px;">

    <!--menu para cotadores-->
    <ul class="xMenu" id="popMenuCotadores" style="width: 250px">
        <li id="btnVerItensGanhos" ><i class="fa fa-thumbs-up"></i>Ver Itens Ganhos</li>
        <li id="btnDeletarCotador" ><i class="fa fa-trash"></i>Deletar Cotador</li>
    </ul>

    <div class="right">
        <button onclick="novaCotacao.modal()" class="btn-floating waves-effect waves-light blue-grey darken-2">
            <i class="fa fa-plus"></i>
        </button>
    </div>

    <div id="pnMenuPop"></div>

    <div class="fadeIn animated tab">
        <!--tab1-->
        <input id="tab1" class="tabInput" type="radio" name="tabs" checked >
        <label for="tab1" class="tabLabel" ><i class="fa fa-folder-open-o"></i>Cotação Aberta</label>

        <!--tab2-->
        <input id="tab2" class="tabInput" type="radio" name="tabs">
        <label for="tab2" class="tabLabel"><i class="fa fa-folder-o"></i> Cotação Fechada</label>

        <!--tab3-->
        <input id="tab3" class="tabInput" type="radio" name="tabs">
        <label for="tab3" class="tabLabel"><i class="fa fa-th-list"></i> Cotação Finalizada</label>

        <!--conteudo do tab1-->
        <section id="content1">

        </section>
        <!--conteudo do tab2-->
        <section id="content2" class="row">
        </section>

        <!--conteudo do tab3-->
        <section id="content3" class="row">
        <!--<span>legal</span>-->
        </section>
            


    </div>
</div>

<!--nova cotação-->
<div id="pnNovaCotacao" title="Nova Cotação" style="display: none">
    <div class="row">
        <div class="col s7" id="pnLojas"> </div>
        <div class="col s2">
            <span>Data Finalização</span>
            <input type="text" id="edtData" class="data">
        </div>
        <div class="col s2">
            <span>Nº Pedido</span>
            <input type="text" id="edtNumPedido">
        </div>
        <div class="col s1">
            <button id="btnGetPedido" style="margin-top: 10px" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-search"></i> </button>
        </div>
    </div>



    <div style="width: 99%;" class="center-align" id="pnResultGetPedito">
        <table class="table">
            <tr class="odd-row">
                <th colspan="7" class="first last">COMPRAS</th>
            </tr>
            <tr>
                <td width="75" class="first">Nº Compas</td>
                <td width="165">Marca</td>
                <td width="147">Comprador</td>
                <td width="95">Data</td>
                <td width="80">Valor</td>
                <td width="122" class="last">Ação</td>
            </tr>
        </table>
    </div>

</div>

<!--produto da cotação-->
<div id="pnProdutoCotacao" title="Produto da Cotação" style="display: none">
    <div id="pnResultPC" class="table"></div>
</div>

<!--add getRepresentante-->
<div id="pnAddRepresentante" title="Adicionar novo Representante" style="display: none">
    <div style="padding-left: 15px; padding-right: 15px">
        <input id="edtLocCotador" onkeyup="filtroRepresentante()" data-type="search" placeholder="Localizar Cotador">
    </div>
    <form id="frmRepres">
        <div class="btn table pnResultAddRep"></div>
    </form>
</div>

<!--resumo cotação-->
<div id="pnResumoCotacao" title="Resumo da Cotação" style="display: none">
    <div class="table" id="pnResultRC"></div>
    <div id="grafico" style="height: 250px;"></div>
</div>

<!--item cotados-->
<div id="pnItensCotadosCotadores" style="display: none">
    <div id="pnResultICC" class="table"></div>
    <button id="btnPrintItensGanhos" class="right btn-floating waves-effect waves-light blue-grey darken-2">
        <i class="fa fa-print"></i>
    </button>

</div>

<!--panel de envio de email-->
<div id="pnSendEmail" style="display: none">
    <div id="pnSEinfo" class="center-align"></div>
    <table class="table">
        <tr>
            <td width="150">De</td>
            <td width="560">
                <span id="edtDe"></span>
            </td>
        </tr>

        <tr>
            <td>Para</td>
            <td>
                <span id="edtPara"></span>
            </td>
        </tr>

        <tr>
            <td>Assunto</td>
            <td>
                <span id="edtAssunto"></span>
            </td>
        </tr>

        <tr>
            <td colspan="2">
                <label>Observação</label>
                <div class="center-align">
                    <textarea name="edtCorpo" id="edtObs" class="ckeditor" cols="45" rows="13" style="width:620px!important; height: 150px;"></textarea>
            </td>
            </div>
        </tr>

        <tr>
            <td colspan="2">
                <div id="pnTransportadora" style="display: none"></div>
            </td>
        </tr>

    </table>
</div>


<!--comparar itens-->
<div id="pnComparar" style="display: none">
    <div style="margin-left: 20px; margin-right: 25px" class="table">
        <table>
            <tr class="descricao">
                <th width="90">Nº Fabricante</th>
                <th width="74">Nº Fab 2</th>
                <th width="295">Descrição Produto</th>
                <th width="112">Carro</th>
                <th width="77">Quant</th>
            </tr>
            <tr class="dados">
                <td><span class="spFab"></span></td>
                <td><span class="spFab2"></span></td>
                <td><span class="spDesc"></span></td>
                <td><span class="spCarro"></span></td>
                <td><span class="spQto right"></span></td>
            </tr>
        </table>
    </div>

    <!-- Switch -->
    <div class="switch left" style="position: absolute">
        <label>
            <input id="chAuto" type="checkbox">
            <span class="lever"></span>
            Próximo Automático
        </label>
    </div>

    <div id="pnItensCotadores" class="center-align">
        <button onclick="" class="button blueColor waves-effect waves-light">Francisco<br> 150,00</button>
        <button onclick="" class="button orangeColor waves-effect waves-light">ZEENE<br>150,00</button>
        <button onclick="" class="button redColor waves-effect waves-light">FLAVIO<br>150,00</button>
    </div>


    <div style="margin: 20px" class="row">
        <div class="col s5 right-align">
            <button onclick="comparar.voltar()" id="btnVoltar" disabled="true" class="btn-floating waves-effect waves-light blue-grey darken-2">
                <i class="fa fa-arrow-left"></i>
            </button>
        </div>
        <div id="pnPosicao"  class="col s2 center-align" style="padding-top: 10px !important; font-size: 15px;">
            1/999
        </div>
        <div class="col s5">
            <button onclick="comparar.proximo()" id="btnProximo" class="btn-floating waves-effect waves-light blue-grey darken-2">
                <i class="fa fa-arrow-right"></i>
            </button>

            <button class="right btn-floating waves-effect waves-light blue-grey darken-2">
                <i id="btnMenuComparar" class="fa fa-bars"></i>
            </button>

            <button onclick="comparar.modalGrid()" title="Atalho F12 Localizar Iten" class="right btn-floating waves-effect waves-light blue-grey darken-2">
                <i class="fa fa-search"></i>
            </button>


        </div>
    </div>

    <div class="center-align" id="pnBlocos"  style="border-top: 1px solid #9b9b9b; margin-top: 12px; min-height: 19px;">
    </div>

    <div class="center-align" style="border-top: 1px solid #9b9b9b; margin-top: 2px;">
        <span style="padding: 0 5px 0 6px; margin: 5px; background: #d81b21;"></span> <label>Menor Valor</label>
        <span style="padding: 0 5px 0 6px; margin: 5px; background: #0095cd;"></span><label>Valor Normal</label>
        <span style="padding: 0 5px 0 6px; margin: 5px; background: #f78d1d;"></span><label>Item Ganho</label>
    </div>

    <div id="pnCotadoresResumo" class="row"></div>

</div>

<div id="pnResumoProduto" style="display: none">
    <div class="right-align">
        <label>Localizar Nº Fabricante</label>
        <input type="text" id="edtLocProdutoResumo">
    </div>
    <div id="pnResulProduto"></div>
</div>

<!--menu para comparação-->
<ul class="xMenu" id="popMenuComparar" style="width: 250px">
    <li onclick="comparar.historicoProduto()" ><i class="fa fa-info-circle"></i>Detalhe Produto <b>CRTL+B</b></li>
    <li onclick="comparar.peca_Online()" ><i class="fa fa-cloud"></i>Peça On-line <b>CTRL+D</b></li>
    <li onclick="comparar.modalGrid()" ><i class="fa fa-search"></i>Localizar Produto <b>F12</b></li>
</ul>


<!--localizar item para comparar-->
<div id="pnLocalizarIten" style="display: none">
    <div class="right-align">
        <label>Localizar Produto</label>
        <input type="text" id="edtLocProduto" style="text-align: right; padding-right: 5px; text-transform: uppercase;">
    </div>
    <div id="pnGridLocIten"></div>
</div>

<div id="pnCodigoTela">CT01</div>



