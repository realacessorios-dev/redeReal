<script src="vendaCRR/vendaCRR.js" type="text/javascript"></script>
<!--<link href="style.css" rel="stylesheet" type="text/css"/>-->
<link href="vendaCRR/style.css" media="screen and (max-aspect-ratio: 13/9)" rel="stylesheet" type="text/css" />

<title>Venda por Vendedor</title>
<style id="mystyle">
  .esq {
    text-align: right !important;
  }

  .pnVenda {
    border-radius: 5px;
    margin: 2px;
    background: white;
    padding: 6px;
  }

  .pnVenda span {
    font-weight: 600;
  }
</style>
<div class="container">
  <div class="nova">
    <div class="row">
      <div class="col s12 l4" style="padding-left: 7px !important">
        <label>Funcionários</label><br>
        <div id="pnFuncionario">
        </div>
      </div>
      <div class="col s12 l3">
        <div id="pnLojas"></div>
      </div>
      <div class="col s5 l2">
        <label>Data Inicial</label><br>
        <input type="text" id="edtInicial" class="dataInicial center-align">
      </div>
      <div class="col s5 l2">
        <label>Data Final</label><br>
        <input type="text" id="edtFinal" class="dataFinal center-align">
      </div>
      <div class="col s2 l1">
        <button id="btnLoc" onclick="vendaVendedor.getVendaVendedor();" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-search"></i> </button>
      </div>
    </div>

  </div>



  <div id="pnPrint">



    <div id="pnData"></div>
    <div id="pnTotalizador" class="table">

      <table id="tbLojasValores">
        <tr>
          <th>Loja</th>
          <th>Venda</th>
          <th>Devolução</th>
          <th>Total</th>
        </tr>
      </table>

      <table>
        <tr>
          <th>Vendas</th>
          <th>Devolução</th>
          <th>Total</th>
        </tr>
        <tr>
          <td class="esq ttVenda">0,00</td>
          <td class="esq ttDevolucao">0,00</td>
          <td class="esq ttTotal">0,00</td>
        </tr>
      </table>
    </div>

    <div class="pnLoads center-align"></div>

    <div id="pnVendedor"></div>



    <div id="pnResult"></div>

  </div>

  <div class="right-align">
    <button style="margin-right: 25px;" onclick="xls('pnPrint')" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-file-excel-o"></i> </button>
    <button onclick="util.printDivHTML($('#pnPrint').html(), $(this))" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-print"></i> </button>
  </div>


</div>

<div id="pnCodigoTela">VDCRR</div>