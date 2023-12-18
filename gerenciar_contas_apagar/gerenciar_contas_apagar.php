<title>Gerenciar Contas &agrave; Pagar</title>
<style>
  .textoEsquerda{
    text-align:left;
  }
  .textoCentralizado{
    text-align:center;
  }
  .textoDireita{
    text-align:right;
  }
  #edtLocalizarNota{
    background-image: url('img/search.png');
    background-repeat: no-repeat;
    background-position: 0.3% 50%;
    text-align: center;
  }
</style>
<script src="gerenciar_contas_apagar/gerenciar_contas_apagar.js" type="text/javascript"></script>
<div id="pnTela">
  <input type="hidden" id="ID_NOTA_FISCAL">
  <div class="table">
    <table width="100%">
      <tr>
        <th colspan="3">Fornecedor</th>
        <th>Nr Nota Fiscal&nbsp;</th>
      </tr>
      <tr>
        <td colspan="3" id="NOME_FANTAZIA" style="text-align: center;">&nbsp;</td>
        <td id="NUM_NOTA_FISCAL" style="text-align: center;">&nbsp;</td>
      </tr>
      <tr>
        <th>Data / Emiss&atilde;o&nbsp;</th>
        <th>Data Entrada</th>
        <th>Valor Nota</th>
        <th>Nr da Notifica&ccedil;&atilde;o</th>
      </tr>
      <tr>
        <td id="DATA_EMISSAO" style="text-align: center;">&nbsp;</td>
        <td id="DATA_ENTRADA" style="text-align: center;">&nbsp;</td>
        <td id="VALOR_NF" style="text-align: right;">&nbsp;</td>
        <td id="NUM_NOTIFICACAO" style="text-align: center;">&nbsp;</td>
      </tr>
      <tr>
        <th colspan="3">Transportadora</th>
        <th>Data Entrada Estado</th>
      </tr>
      <tr>
        <td colspan="3" id="TRANSPORTADORA" style="text-align: center;">&nbsp;</td>
        <td id="DATA_ENTRADA_ESTADO" style="text-align: center;">&nbsp;</td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
    </table>
  </div>

  <div style="text-align:right">
    <button class="ui-localizar" id="btnLocalizar">F2 - <u>L</u>ocalizar Nota</button>
    <button class="ui-imprimir" id="btnImprimirFaturas" onclick="print($('#pnTela').html())">F3 - Im<u>p</u>rimir</button>
  </div>
  <div class="table" id="pnFaturas"></div>
  <div id="pnQtdFaturas" style="text-align: center;color: gray;"></div>

  <div id="pnLocalizarNota" style="display: none;">
    <div>
      <label for="edtLocalizarNota" style="font-size: 10px;" >Informe <strong>Nome Fantasia</strong> ou <strong>Raz&atilde;o Social</strong> ou <strong>Nr da NF</strong> ou <strong>Data Vencimento</strong> ou</label>
      <strong>Valor</strong><br>
      <input type="text" id="edtLocalizarNota"
             style="width: 100%;text-transform: uppercase; margin-bottom: 5px;"
             placeholder="informe o que deseja pesquisar e pressione enter"
             title="pressione enter para iniciar a busca">
      <button id="btnLimparInput" style="float: right;position: absolute;right: 16px;margin-top: 3px;width: 25px;height: 21px;border-radius: 5px;border: 0px;background-color: #f2f2f2;cursor: pointer;" title="LIMPAR CONTEÚDO">X</button>
    </div>
    <div id="pnResultadoNota"></div>
    <div id="pnQtdResultadoNota" style="text-align: center;color: gray;"></div>
  </div>

  <div id="pnCadastroFatura" class="table" style="display: none;">
    <fieldset style="float: left;padding-bottom: 5px;margin-right: 5px;">
      <legend>Parcela</legend>
      Nr
      <div id="COD_FATURA" style="width: 58px;text-align: center;font-weight: bold;padding-bottom: 9px;"></div>
    </fieldset>
    <fieldset style="float: left;padding-bottom: 5px;margin-right: 5px;">
      <legend>Vencimento da Fatura</legend>
      Data:<br>
      <input type="text" class="data" id="DATA_VENCIMENTO" style="width: 150px;text-align: center;font-weight: bold;margin-right: 5px;">
    </fieldset>
    <!--margin-top: 8px;margin-right: 5px;border: 1px solid #ccc;padding: 5px;border-radius: 5px;">-->
    <fieldset style="float: left;padding-bottom: 5px;margin-right: 5px;">
      <legend>Valor da Fatura</legend>
      R$:<br>
      <input type="text" class="real" id="VLR_FATURA" style="float: right;font-weight: bold;width: 140px;margin-right: 5px;">
    </fieldset>
    <div style="float: left;margin-right: 5px;width: 210px;">
      <fieldset style="padding-bottom: 5px">
        <legend>Recebimento do Correio</legend>
        <div style="float: left;margin-right: 5px;">
          Data:
          <input type="text" name="DATA_CORREIO" id="DATA_CORREIO" style="width: 100%;" class="data">
        </div>
      </fieldset>
    </div>
    <div style="float: left;margin-right: 5px;">
      <fieldset style="padding-bottom: 5px">
        <legend>Quita&ccedil;&atilde;o</legend>
        <div style="float: left;margin-right: 5px;">
          Data:
          <input type="text" name="DATA_QUITACAO" id="DATA_QUITACAO" style="width: 110px;" class="data">
        </div>
        <div style="float: left;margin-right: 5px;">
          R$:
          <input type="text" name="QUITACAO" id="QUITACAO" style="width: 110px;" class="real">
        </div>
      </fieldset>
    </div>
    <div style="float: left;margin-right: 5px;width: 50%;">
      <br>Forma Pagamento:
      <select name="TIPO" id="TIPO" style="width: 50%;" autofocus>
        <option value="" selected>SELECIONE</option>
        <option value="BOL">BOLETO</option>
        <option value="CHE">CHEQUE</option>
        <option value="DDA">DDA</option>
        <option value="DEP">DEPÓSITO</option>
      </select>
    </div>
    <div style="clear: both;"></div>
    <div id="pnFormaPagto" style="float: left;margin-right: 5px;">
    </div>
    <div id="pnFavorecido" style="display: none;">
      <input type="hidden" id="id_favorecido">
      <input type="hidden" id="id_fornecedor">
      <fieldset>
        <legend>Dados do Favorecido</legend>
        <div style="float: left;margin-right: 5px;border: 0px solid blue;">
          Nome:<br>
          <span id="edtFavorecidoNome" style="width: 100%;text-align: center;font-weight: bold;">...</span>
        </div>
        <div style="float: right;margin-right: 5px;">
          <button class="ui-localizar" id="btnLocFavorecido">Localizar Favorecido</button>
        </div>
        <div style="clear: both;"></div>
        <div style="float: left;margin-right: 5px;border: 0px solid red;width: 70%;">
          Banco:<br>
          <span id="edtFavorecidoBanco" style="width: 100%;text-align: center;font-weight: bold;">...</span>
        </div>
        <div style="float: left;margin-right: 5px;border: 0px solid blue;width: 10%;">
          Ag&ecirc;ncia:<br>
          <span id="edtFavorecidoAgencia" style="width: 100%;text-align: center;font-weight: bold;">...</span>
        </div>
        <div style="float: left;margin-right: 5px;border: 0px solid red;width: 16.5%;">
          Conta:<br>
          <span id="edtFavorecidoConta" style="width: 100%;text-align: center;font-weight: bold;">...</span>
        </div>
      </fieldset>
    </div>
  </div>
  <div id="pnGridFavorecidos" style="display: none;">
    <div style="float: right;">
      <button class="ui-incluir" id="btnIncluirFavorecido">Incluir Favorecido</button>
    </div>
    <input type="text" id="edtLocalizarFavorecidos" placeholder="F1 - LOCALIZAR FAVORECIDO" style="text-align: center;width: 78%;text-transform: uppercase;" autofocus>
    <div id="pnFavorecidos">
    </div>
  </div>
  <div id="pnIncluirFavorecido" style="display: none;">
    <table width="100%" border="0" class="table">
      <tr>
        <td style="text-align: right;">Banco</td>
        <td colspan="5">
          <select name="cd_banco" id="cd_banco" style="width: 100%;" class="obr">
          </select>
        </td>
      </tr>
      <tr>
        <td style="text-align: right;">Ag&ecirc;ncia</td>
        <td>
          <input name="cd_agencia" type="text" id="cd_agencia" placeholder="ATÉ 10 CARACTERES" maxlength="10" style="width: 100%;" class="obr">
        </td>
        <td style="text-align: right;">Nº Conta</td>
        <td>
          <input name="nr_conta" type="text" id="nr_conta" placeholder="ATÉ 15 CARACTERES" maxlength="15" style="width: 100%;" class="obr">
        </td>
        <td style="text-align: right;">Opera&ccedil;&atilde;o</td>
        <td>
          <input name="cd_operacao" type="text" id="cd_operacao" placeholder="ATÉ 3 CARACTERES" maxlength="3" style="width: 100%;">
        </td>
      </tr>
      <tr>
        <td style="text-align: right;">Nome Favorecido</td>
        <td colspan="5">
          <input name="nm_favorecido" type="text" id="nm_favorecido" placeholder="ATÉ 60 CARACTERES" maxlength="60" style="width: 100%;" class="obr">
        </td>
      </tr>
      <tr>
        <td style="text-align: right;">Tipo</td>
        <td colspan="5">
          <label><input type="radio" name="tp_vinculo" value="OP" id="tp_vinculo_0" checked> Operacional</label>&nbsp;&nbsp;&nbsp;
          <label><input type="radio" name="tp_vinculo" value="AD" id="tp_vinculo_1"> Administrativo</label>&nbsp;&nbsp;&nbsp;
          <label><input type="radio" name="tp_vinculo" value="RH" id="tp_vinculo_2"> Pessoal</label>
        </td>
      </tr>
      <tr>
        <td style="text-align: right;">CPF</td>
        <td>
          <input name="nr_cpf" type="text" id="nr_cpf" placeholder="SÓ NÚMEROS" style="width: 100%;">
        </td>
        <td style="text-align: right;">CNPJ</td>
        <td colspan="3">
          <input name="nr_cnpj" type="text" id="nr_cnpj" placeholder="SÓ NÚMEROS" style="width: 100%;">
        </td>
      </tr>
      <tr>
        <td style="text-align: right;">Nome da Matriz</td>
        <td colspan="5">
          <input name="nm_matriz" type="text" id="nm_matriz" placeholder="ATÉ 60 CARACTERES" maxlength="60" style="width: 100%;">
        </td>
      </tr>
      <tr>
        <td style="vertical-align: top;text-align: right;">Observa&ccedil;&odblac;es</td>
        <td colspan="5">
          <textarea name="tx_obs" maxlength="200" id="tx_obs" placeholder="TEXTO LIVRE ATÉ 200 CARACTERES" style="width: 100%;"></textarea>
        </td>
      </tr>
    </table>
  </div>
  <div id="telas"></div>
</div>

<div id="pnCodigoTela">GER_CP</div>