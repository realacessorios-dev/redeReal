<title>Contas á Pagar</title>
<style>

</style>



<script src="contas_pagar/contas_pagar.js" type="text/javascript"></script>
<div class="container" id="contas_pagar">

    <div id="pnCP">
        <input type="hidden" id="TOTAL">
        <table style="border-bottom: 1px solid #cdcdcd; width: 100%; padding-bottom: 10px; margin-left: 5px;">
            <tr>
                <td colspan="2" style="text-align: right;" nowrap>
                    Fornecedor:<span id="loadFornecedor"></span> 
                    <select id="cmbFornecedores" data-placeholder="Fornecedor" name="cmbFornecedores"  style="width: 79.5%;text-align: left;" multiple="multiple" autofocus></select>
                </td>
                <td rowspan="2" style="width: 123px;">
                    <div style="font-size: 12px;">
                        <button id="btnConsultarCP" class="ui-pesquisar" style="width: 100%;height: 40px; margin-bottom: 5px;">Consultar</button><br>
                        <!--<button id="btnImprimirCP" class="ui-imprimir" style="width: 100%;height: 40px;" onclick="print($('#pnRegCP').html())" title="Imprimir Contas &aacute; Pagar">Imprimir</button>-->
                    </div>


                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    Data Inicial: <input type="text" id="CP_DT_INICIO" class="dataInicial obr" style="width: 100px;"> at&eacute; <input type="text" id="CP_DT_FIM" class="obr dataFinal" style="width: 100px;">
                    Tipo: <select id="TIPO">
                        <option value="0" selected>TODOS</option>
                        <option value="DDA">DDA</option>
                        <option value="BOL">BOLETO</option>
                        <option value="DEP">DEPOSITO</option>
                        <option value="CHE">CHEQUE</option>
                    </select>
                </td>
                <td style="text-align: right;" nowrap>
                    Nr NF: <input type="text" id="NR_NF" style="width: 150px;" maxlength="20"><br>
                    <label><input type="checkbox" id="SEM_VEICULOS" title="Não incluir veículos no relatório" checked>
                        Ve&iacute;culos: </label>
                    <select id="cmbPlacasVeiculos" name="cmbPlacasVeiculos" multiple="multiple" style="width: 150px;" data-placeholder="Placa do Ve&iacute;culo"></select><br>
                </td>
            </tr>
        </table>


        <div id="pnRegCP" class="print" style="float: left;width: 100%;padding-top: 5px; margin-left: 5px;">
        </div>
    </div>
</div>

<div id="pnCodigoTela">CON_CP</div>