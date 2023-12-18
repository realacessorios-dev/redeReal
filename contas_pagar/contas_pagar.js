var geralFaturas = 0;
var geralDocumentos = 0;
var geralMultas = 0;

$(document).ready(function (e) {
    var dataAtual = new Date();
    var dataAtualBR = ("0" + dataAtual.getDate()).substr(-2) + "/"
            + ("0" + (dataAtual.getMonth() + 1)).substr(-2) + "/" + dataAtual.getFullYear();

    $.ajaxSetup({
//        url: "http://192.168.100.200/_projeto_real/siap+/contas_pagar/per.contas_pagar.php",
        url: "contas_pagar/per.contas_pagar.php",
        type: "POST",
        dataType: "json",
        data: {
            id_sociedade: '10'
        }
    });

//  limparInputs('#pnCP');

    $("select#TIPO").val("0");

    $("#CP_DT_INICIO").val(dataAtualBR);
    $("#CP_DT_FIM").val(dataAtualBR);
    $("#pnRegCP").html('');
    $("#btnImprimirCP").button({disabled: true});
    getPlacaVeiculos();
    getFornecedores();

    $(document).on("click", "#btnConsultarCP", function () {
        validarDatas();
        $('#pnOnde').html('Relatório das Contas à Pagar no Período de ' + $("#CP_DT_INICIO").val() + ' a ' + $("#CP_DT_FIM").val());
        getCP(util.dataUSA($("#CP_DT_INICIO").val(), '/'), util.dataUSA($("#CP_DT_FIM").val(), '/'), $("#TIPO").val(),
                $("#cmbFornecedores").val(), $("#NR_NF").val(), $("#cmbPlacasVeiculos").val(), $("#SEM_VEICULOS").is(':checked'));
        $("#btnImprimirCP").button({disabled: false});
    });
    $("#cmbFornecedores").focus();
});

function validarDatas() {
    if ($("#CP_DT_INICIO").val() === '') {
        $("#CP_DT_INICIO").focus();
        util.show({msg: 'Data Inicial, deve ser informada, operação cancelada!', icon: '3'});
        return false;
    }
    if ($("#CP_DT_FIM").val() === '') {
        $("#CP_DT_FIM").focus();
        util.show({msg: 'Data Final, deve ser informada, operação cancelada!', icon: '3'});
        return false;
    }
}

// fornecedores
function getFornecedores() {
    $.ajax({
        data: {ax: "getFornecedores"},
        beforeSend: function (xhr) {
            $("#cmbFornecedores").addClass('pnAguarde');
        },
        success: function (r) {
            cmb = $('#cmbFornecedores');
            op = $("option", {html: 'NENHUM', value: '', style: 'text-align: left'});
            cmb.append(op);
            $.each(r, function (i, ln) {
                op = $("<option>", {html: ln.NOME_FANTAZIA, value: ln.ID_FORNECEDOR, style: 'text-align: left'});
                cmb.append(op);
            });
            $("#cmbFornecedores").append(cmb);
            $("#cmbFornecedores").chosen().removeClass('pnAguarde');
        }
    });
}

// placas de veiculos
function getPlacaVeiculos() {
    $.ajax({
        data: {ax: "getPlacaVeiculos"},
        success: function (r) {
            placas = $("#cmbPlacasVeiculos");
            op = $('<option>', {html: 'TODOS', value: '', style: 'text-align: left'});
            placas.append(op);
            $.each(r, function (i, ln) {
                op = $('<option>', {html: ln.VEI_PLACA, value: ln.VEI_ID, style: 'text-align: left'});
                placas.append(op);
            });
            $("#cmbPlacasVeiculos").append(placas);
            $("#cmbPlacasVeiculos").chosen();
        }
    });
}

function getCP(DT_INICIO, DT_FIM, TIPO, ID_FORNECEDOR, NR_NF, PLACAS, SEM_VEICULOS) {
    total = 0;
    total_tipo = 0, total_quitado = 0;
    cont = 0;
    console.log(NR_NF, 'NR_NF');
    $.ajax({
        data: {ax: "getCP", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, TIPO: TIPO, ID_FORNECEDOR: ID_FORNECEDOR, NR_NF: NR_NF.toUpperCase()},
        success: function (r) {
            table = $('<table>', {id: 'tblCP', style: 'margin: 0 auto;width: 100%', class: 'table'});
            tr = $('<tr>', {style: 'text-align: center;'});
            tr.append($('<th>', {html: 'Item', style: 'width: 20px;'}));
            tr.append($('<th>', {html: 'Nº Nota Fiscal', style: 'width: 10%;'}));
            tr.append($('<th>', {html: '/', style: 'width: 1px;'}));
            tr.append($('<th>', {html: 'Nome Fantasia'}));
            tr.append($('<th>', {html: 'Tipo', style: 'width: 8%;'}));
            tr.append($('<th>', {html: 'Correio', style: 'width: 10%;'}));
            tr.append($('<th>', {html: 'Vencimento', style: 'width: 10%;'}));
            tr.append($('<th>', {html: 'Valor', style: 'width: 10%;'}));
            table.append(tr);
            $.each(r, function (i, ln) {
                if (ln.DATA_QUITACAO === null) {
                    sublinhado = 'text-decoration: none;';
                } else {
                    sublinhado = 'text-decoration: line-through;';
                }
                if (TIPO === '1') {
                    TIPO = $.trim(ln.TIPO);
                    cont = 0;
                }

                if (TIPO !== $.trim(ln.TIPO)) {
                    if (total_tipo > 0) {
                        tr = $('<tr>');
                        tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc;' + sublinhado}));
                        tr.append($('<td>', {html: util.formatValor(total_tipo), style: 'text-align: right;color: #ccc'}));
                        table.append(tr);
                    }
                    total_tipo = parseFloat(ln.VALOR);
                    cont = 0;
                } else {
                    total_tipo += parseFloat(ln.VALOR);
                }
                TIPO = $.trim(ln.TIPO);
                if (ln.DATA_QUITACAO === null)
                    total += parseFloat(ln.VALOR);
                else
                    total_quitado += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: ++cont, style: 'width: 1px;text-align: center;'}));
                ahref = $('<a>', {href: 'Selecao da Multa', html: '<b>' + ln.NUM_NOTA_FISCAL + '</b>', NUM_NOTA_FISCAL: ln.NUM_NOTA_FISCAL, class: 'lnkCP'});
                tr.append($('<td>', {html: ln.NUM_NOTA_FISCAL, style: 'width: 1px;text-align: center;' + sublinhado}));
                tr.append($('<td>', {html: ln.COD_FATURA, style: 'width: 1px;text-align: center;white-space: nowrap;' + sublinhado}));
                tr.append($('<td>', {html: ln.NOME_FANTAZIA + '<div class="dadosFavorecido" id="' + ln.ID_FATURAS_APAGAR + '"></div>', style: sublinhado}));
                if (TIPO === "CHE") {
                    tr.append($('<td>', {html: 'CHEQUE', style: 'text-align: center;font-size: 10px;' + sublinhado}));
                    if (ln.ID_FAVORECIDO !== null) {
                        getFavorecido(ln.ID_FAVORECIDO, ln.ID_FATURAS_APAGAR);
                    } else
                    if (ln.ID_FORNECEDOR !== null) {
                        getFornecedor(ln.ID_FORNECEDOR, ln.ID_FATURAS_APAGAR);
                    }
                } else
                if (TIPO === "DEP") {
                    tr.append($('<td>', {html: 'DEPOSITO', style: 'text-align: center;font-size: 10px;' + sublinhado}));
                    if (ln.ID_FAVORECIDO !== null) {
                        getFavorecido(ln.ID_FAVORECIDO, ln.ID_FATURAS_APAGAR);
                    } else
                    if (ln.ID_FORNECEDOR !== null) {
                        getFornecedor(ln.ID_FORNECEDOR, ln.ID_FATURAS_APAGAR);
                    }
                } else
                if (TIPO === "BOL" || TIPO === "")
                    tr.append($('<td>', {html: 'BOLETO', style: 'text-align: center;font-size: 10px;' + sublinhado}));
                else
                    tr.append($('<td>', {html: TIPO, style: 'text-align: center;font-size: 10px;' + sublinhado}));
                tr.append($('<td>', {html: ln.DATA_CORREIO !== null ? util.dataBrasil(ln.DATA_CORREIO, '-') : '', style: 'width: 1px;text-align: center;' + sublinhado}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;' + sublinhado}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR), style: 'text-align: right;' + sublinhado}));
                table.append(tr);
            });
            // imprime total da ult forma pagto
            tr = $('<tr>');
            tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc;text-decoration: none;'}));
            tr.append($('<td>', {html: util.formatValor(total_tipo.toFixed(2)), style: 'text-align: right;color: #ccc;text-decoration: none;'}));
            table.append(tr);
            //
            if (total !== 0) {
                tr = $('<tr>');
                tr.append($('<td>', {html: 'TOTAL DAS FATURAS R$', colspan: '7', style: 'text-align: right;color: #ccc;text-decoration: none;'}));
                tr.append($('<td>', {html: util.formatValor(total.toFixed(2)), style: 'text-align: right;color: #ccc;text-decoration: none;'}));
                table.append(tr);
            }
            if (total_quitado !== 0) {
                tr = $('<tr>');
                tr.append($('<td>', {html: 'TOTAL DAS FATURAS QUITADAS R$', colspan: '7', style: 'text-align: right;color: #ccc;text-decoration: none;'}));
                tr.append($('<td>', {html: util.formatValor(total_quitado.toFixed(2)), style: 'text-align: right;color: #ccc;text-decoration: none;'}));
                table.append(tr);
            }
            dvRegistros = $('<div>', {html: table, id: 'dvCP'});//, style: 'overflow: auto; height: 210px;'
            $("#pnRegCP").html(dvRegistros);

            geralFaturas = total;

            if (SEM_VEICULOS === true)
                getLicenciamento(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getLicenciamento(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getLicenciamento", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos = total;

            getSeguro(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getSeguro(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getSeguro", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos += total;

            getIPVA_cotaUnica(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getIPVA_cotaUnica(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getIPVA_cotaUnica", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos += total;

            getIPVA_parcela1(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getIPVA_parcela1(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getIPVA_parcela1", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR.toFixed(2)), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos += total;

            getIPVA_parcela2(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getIPVA_parcela2(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getIPVA_parcela2", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR.toFixed(2)), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos += total;

            getIPVA_parcela3(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getIPVA_parcela3(DT_INICIO, DT_FIM, PLACAS) {
    total = 0;
    $.ajax({
        data: {ax: "getIPVA_parcela3", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.DESCRICAO, colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR.toFixed(2)), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            geralDocumentos += total;
            if (geralDocumentos !== 0) {
                tr = $('<tr>');
                tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc'}));
                tr.append($('<td>', {html: util.formatValor(geralDocumentos), style: 'text-align: right;color: #ccc'}));
                $("#tblCP").append(tr);
            }
            getPlacasMultas(DT_INICIO, DT_FIM, PLACAS);
        }
    });
}

function getPlacasMultas(DT_INICIO, DT_FIM, PLACAS) {
    var total = 0;
    $.ajax({
        data: {ax: "getPlacasMultas", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM, PLACAS: PLACAS},
        success: function (r) {
            $.each(r, function (i, ln) {
                total += parseFloat(ln.VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: 'MULTA - ' + ln.VEI_MARCA_MODELO + ', ' + ln.VEI_PLACA + '<br><span style="font-size: 10px;">MOTORISTA: ' + ln.MOTORISTA + '</span>', colspan: '2'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: ln.VALOR, style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            if (total !== 0) {
                tr = $('<tr>');
                tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc'}));
                tr.append($('<td>', {html: util.formatarValorBr(total, 2), style: 'text-align: right;color: #ccc'}));
                $("#tblCP").append(tr);
            }
            geralMultas = total;
            getManutencoes(DT_INICIO, DT_FIM);
//    },
//    complete: function () {
//      t3 = geralDocumentos + geralFaturas + geralMultas;
//
//      tr = $('<tr>');
//      tr.append($('<td>', {html: 'TOTAL GERAL R$', colspan: '6', style: 'text-align: right;'}));
//      tr.append($('<td>', {html: util.formatValor(t3), style: 'text-align: right;'}));
//      $("#tblCP").append(tr);
//      getManutencoes(DT_INICIO, DT_FIM);
        }
    });
}

function getManutencoes(DT_INICIO, DT_FIM) {
    TIPO = '1';
    total = 0, total_tipo = 0;
    $.ajax({
        data: {ax: "getManutencoes", DT_INICIO: DT_INICIO, DT_FIM: DT_FIM},
        success: function (r) {
            $.each(r, function (i, ln) {
                if (ln.VEI_MAN_FORMA_PAGTO === 'BOL') {
                    forma = "BOLETO";
                } else
                if (ln.VEI_MAN_FORMA_PAGTO === 'CHE') {
                    forma = "CHEQUE";
                } else
                if (ln.VEI_MAN_FORMA_PAGTO === 'DIN') {
                    forma = "DINHEIRO";
                } else
                    forma = ln.VEI_MAN_FORMA_PAGTO;

                if (TIPO === '1')
                    TIPO = $.trim(ln.VEI_MAN_FORMA_PAGTO);

                if (TIPO !== $.trim(ln.VEI_MAN_FORMA_PAGTO)) {
                    tr = $('<tr>');
                    tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc;' + sublinhado}));
                    tr.append($('<td>', {html: util.formatValor(total_tipo.toFixed(2)), style: 'text-align: right;color: #ccc'}));
                    table.append(tr);
                    total_tipo = parseFloat(ln.VEI_MAN_VALOR);
                } else {
                    total_tipo += parseFloat(ln.VEI_MAN_VALOR);
                }
                TIPO = $.trim(ln.VEI_MAN_FORMA_PAGTO);


                total += parseFloat(ln.VEI_MAN_VALOR);
                tr = $('<tr>');
                tr.append($('<td>', {html: i + 1, style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;white-space: nowrap'}));
                tr.append($('<td>', {html: ln.VEI_MAN_ITEM}));
                tr.append($('<td>', {html: forma, style: 'text-align: center;'}));
                tr.append($('<td>', {html: '', style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.VEI_MAN_DATA, '-'), style: 'width: 1px;text-align: center;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VEI_MAN_VALOR), style: 'text-align: right;'}));
                $("#tblCP").append(tr);
            });
            if (total !== 0) {
                tr = $('<tr>');
                tr.append($('<td>', {html: 'TOTAL R$', colspan: '7', style: 'text-align: right;color: #ccc'}));
                tr.append($('<td>', {html: util.formatValor(total_tipo.toFixed(2)), style: 'text-align: right;color: #ccc'}));
                $("#tblCP").append(tr);
            }
            geralManutencoes = total;
        },
        complete: function () {
            t3 = geralDocumentos + geralFaturas + geralMultas + geralManutencoes;

            tr = $('<tr>');
            tr.append($('<td>', {html: 'TOTAL GERAL R$', colspan: '7', style: 'text-align: right;'}));
            tr.append($('<td>', {html: util.formatValor(t3.toFixed(2)), style: 'text-align: right;'}));
            $("#tblCP").append(tr);
        }
    });
}

function getFavorecido(id_favorecido, ID_FATURAS_APAGAR) {
    $.ajax({
        data: {ax: 'getFavorecido', id_favorecido: id_favorecido},
        success: function (tmp) {
            $("#" + ID_FATURAS_APAGAR).html('BCO: ' + tmp[0].SG_BANCO + ', AG: ' + tmp[0].CD_AGENCIA + ', CONTA: ' + tmp[0].NR_CONTA + ', ' + (tmp[0].CD_OPERACAO != '' ? 'OP: ' + tmp[0].CD_OPERACAO.toUpperCase() + ', ' : '') + tmp[0].NM_FAVORECIDO + (tmp[0].NR_CPF != "" ? " - " + tmp[0].NR_CPF : "") + (tmp[0].NR_CNPJ != "" ? " - " + tmp[0].NR_CNPJ : "") + '<br>' + tmp[0].TX_OBS);
        }
    });
}

function getFornecedor(id_fornecedor, ID_FATURAS_APAGAR) {
    $.ajax({
        data: {ax: 'getFornecedor', id_fornecedor: id_fornecedor},
        success: function (tmp) {
            $("#" + ID_FATURAS_APAGAR).html('NOME: ' + tmp[0].NOME_FANTAZIA);
        }
    });
}