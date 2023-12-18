<script src="vendaVendedor/vendaVendedor.js" type="text/javascript"></script>
<!--<link href="style.css" rel="stylesheet" type="text/css"/>-->
<link href="vendaVendedor/style.css" media="screen and (max-aspect-ratio: 13/9)" rel="stylesheet" type="text/css"/>

<title>Venda por Vendedor</title>
<style id="mystyle" >
  .esq{
    text-align: right !important;
  }
  .table{
    margin-top:20px!important
  }
</style>
<div class="container">
  <div class="nova">
    <div class="right-align row">
      <div class="col s12 l5">
        <div id="pnLojas"></div>
      </div>
      <div class="col s5 l3">
        <label>Data Inicial</label><br>
        <input type="text" id="edtInicial" class="dataInicial center-align">
      </div>
      <div class="col s5 l3">
        <label>Data Final</label><br>
        <input type="text" id="edtFinal" class="dataFinal center-align">
      </div>
      <div class="col s2 l1">
        <button id="btnLoc" onclick="vendaVendedor.getVendaVendedor();" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-search"></i> </button>
      </div>
    </div>

    <div class="right-align row">
      <div class="col s4 l7">
      </div>
      <div class="col s4 l2">
        <label>Comissão Venda %</label><br>
        <input type="text" class="center-align real" id="edtComissaoVenda" style="width: 80px!important;">
      </div>
      <div class="col s4 l2">
        <label>Com. Montagem %</label><br>
        <input type="text" class="center-align real" id="edtComissaoMontagem"  style="width: 80px!important;">
      </div>
      <div class="col l1">
      </div>
    </div>
  </div>

  <div id="pnPrint">
    <div id="pnData"></div>
    <div id="pnTotalizador" class="table">
      <table>
        <tr>
          <th>Vendas</th>
          <th>Devolução</th>
          <th>Total</th>
          <th>Mont.</th>
          <th>Comissão</th>
        </tr>
        <tr>

          <td class="esq ttVenda">0,00</td>
          <td class="esq ttDevolucao">0,00</td>
          <td class="esq ttTotal">0,00</td>
          <td class="esq ttMont">0,00</td>
          <td class="esq ttComissao">0,00</td>
        </tr>
      </table>
    </div>

    <div class="pnLoads center-align"></div>

    <div id="pnResult"></div>

  </div>

  <div class="right-align">
    <button style="margin-right: 25px;" onclick="xls('pnPrint')" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-file-excel-o"></i> </button>
    <button onclick="util.printDivHTML($('#pnPrint').html(), $(this))" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-print"></i> </button>
  </div>


</div>

<div id="pnCodigoTela">VDV</div>
