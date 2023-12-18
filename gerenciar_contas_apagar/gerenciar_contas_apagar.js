
var idGridNotaFiscal;
var idGridFavorecidos;
var localizarNF = new LocalizarNF();
var localizarFavorecido = new LocalizarFavorecido();
var ID_FATURAS_APAGAR;
var TIPO_FAVORECIDO;
var consultaOld = "";
//////////////// inicio do ready ////////////////
$(function () {

    $('#telas').html(telas.gerenciarContasApagar);

    $('input').keydown(function (e) {
        if (e.keyCode === 46 && e.ctrlKey) {
            $(this).val('');
        }
    });

    idGridNotaFiscal = $('#pnLocalizarNota #pnResultadoNota');
    idGridFavorecidos = $('#pnFavorecidos');
    $('#edtLocalizarFavorecidos').keydown(function (e) {
        if (e.keyCode === 13) {
            getFavorecidos($("#edtLocalizarFavorecidos").val().toUpperCase());
            $("#edtLocalizarFavorecidos").select();
            return false;
        }
        if (e.keyCode === 40) {
            var rowindex = idGridFavorecidos.jqxGrid('getselectedrowindex');
            idGridFavorecidos.jqxGrid('selectrow', rowindex + 1);
            idGridFavorecidos.jqxGrid('wrapper').focus();
            return false;
        }
    });

    $.ajaxSetup({
        url: 'gerenciar_contas_apagar/per.gerenciar_contas_apagar.php'
    });

    ControleBTN('#pnBtns');
//  getFavorecidos();
    $("#btnLimparInput").click(function () {
        $("#edtLocalizarNota").val('');
        $("#edtLocalizarNota").focus();
    });

    localizarNF.displayGrid();
    $("#edtLocalizarNota").val(DATA);

    $("#btnLocalizar").click(function () {
        $("#pnLocalizarNota").mofo({
            autoOpen: true,
            modal: true,
            width: 780,
            height: 400,
            title: 'Localizar NF',
            open: function () {
                $("#edtLocalizarNota").select().focus();
            }
        });
        return false;
    });
    $('#edtLocalizarNota').keydown(function (e) {

        var code = e.keyCode || e.which;

        if (e.keyCode === 13) {
            idGridNotaFiscal.jqxGrid('clear');
            getNF($("#edtLocalizarNota").val());
            $("#edtLocalizarNota").select();
        }
        if (e.keyCode === 40) {
            var rowindex = idGridNotaFiscal.jqxGrid('getselectedrowindex');
            idGridNotaFiscal.jqxGrid('selectrow', rowindex + 1);
            idGridNotaFiscal.jqxGrid('wrapper').focus();
            return false;
        }
    });
    idGridNotaFiscal.keydown(function (e) {
        if (e.keyCode === 9) {
            $("#edtLocalizarNota").focus();
            $("#edtLocalizarNota").select();
        }
        if (e.keyCode === 13) {
            rowindex = idGridNotaFiscal.jqxGrid('getselectedrowindex');
            ID_NOTA_FISCAL = idGridNotaFiscal.jqxGrid('getcellvalue', rowindex, 'ID_NOTA_FISCAL');
            getCabecalho(ID_NOTA_FISCAL);
            getFaturas(ID_NOTA_FISCAL);
            $("#pnLocalizarNota").mofo('close');
        }
        return false;
    });
    idGridNotaFiscal.dblclick(function () {
        rowindex = idGridNotaFiscal.jqxGrid('getselectedrowindex');
        ID_NOTA_FISCAL = idGridNotaFiscal.jqxGrid('getcellvalue', rowindex, 'ID_NOTA_FISCAL');
        getCabecalho(ID_NOTA_FISCAL);
        getFaturas(ID_NOTA_FISCAL);
        $("#pnLocalizarNota").mofo('close');
        return false;
    });
    $(document).on('click', '.lnkFavorecido', function () {
        getFavorecido($(this).attr('id'));
        return false;
    });
    $(document).on('click', '.lnkFaturaEditar', function () {
        ID_FATURAS_APAGAR = $(this).attr('id_fatura');
        id_fatura = $(this).attr('id_fatura');
        cod_fatura = $('.cod_fatura' + id_fatura).html();
        DATA_VENCIMENTO = $('.DATA_VENCIMENTO' + id_fatura).html();
        VALOR = $('.VALOR' + id_fatura).html();
        DATA_CORREIO = $('.DATA_CORREIO' + id_fatura).html();
        DATA_QUITACAO = $('.DATA_QUITACAO' + id_fatura).html();
        QUITACAO = $('.QUITACAO' + id_fatura).html();
        TIPO = $('.TIPO' + id_fatura).html();
        $('#COD_FATURA').html(cod_fatura);
        $('#DATA_VENCIMENTO').val(DATA_VENCIMENTO);
        $('#VLR_FATURA').val(VALOR);
        $('#pnCadastroFatura #DATA_CORREIO').val(DATA_CORREIO);
        $('#pnCadastroFatura #DATA_QUITACAO').val(DATA_QUITACAO);
        $('#pnCadastroFatura #QUITACAO').val(QUITACAO);
        if (TIPO === '') {
            $("#pnCadastroFatura #TIPO option[value='BOL']").attr("selected", true);
            $("#pnFavorecido").css('display', 'none');
        } else {
// SELECIONAR NO COMBO O VALOR QUE ESTA NO BD
            $("#pnCadastroFatura #TIPO option").prop('selected', false).filter('[value="' + TIPO.substr(0, 3) + '"]').prop('selected', true);
            $("#pnCadastroFatura #TIPO").change();
            ID_FAVORECIDO = $(this).attr('id_favorecido');
            ID_FORNECEDOR = $(this).attr('id_fornecedor');
            if ((ID_FAVORECIDO !== undefined) && (ID_FAVORECIDO !== '')) {
                getFavorecido(ID_FAVORECIDO);
            } else
            if ((ID_FORNECEDOR !== undefined) && (ID_FORNECEDOR !== '')) {
                getFornecedor(ID_FORNECEDOR);
            } else {
                $("#id_favorecido").val('');
                $("#edtFavorecidoNome").html('...');
                $("#edtFavorecidoBanco").html('...');
                $("#edtFavorecidoAgencia").html('...');
                $("#edtFavorecidoConta").html('...');
            }
        }

        $("#pnCadastroFatura").mofo({
            autoOpen: true,
            modal: true,
            width: 669,
            title: 'Dados da Fatura',
            closeText: 'Cancela e fecha janela',
            buttons: {
                "Salvar": function () {
                    postFatura();
                },
                "Cancelar": function () {
                    $("#pnCadastroFatura").mofo('close');
                }
            },
            open: function () {
                $('.ui-dialog-buttonpane').find('button:contains("Salvar")').button({
                    icons: {
                        primary: 'ui-icon-disk'
                    }
                });
                $('.ui-dialog-buttonpane').find('button:contains("Cancelar")').button({
                    icons: {
                        primary: 'ui-icon-closethick'
                    }
                });
            }
        });
        return false;
    });
    // recuperar valor do item selecionado no combo TIPO PAGTO
    $("#pnCadastroFatura #TIPO").change(function () {
        TIPO_val = $("#pnCadastroFatura #TIPO").val();
        TIPO_txt = $("#pnCadastroFatura #TIPO option:selected").text();
        if (TIPO_val === "CHE" || TIPO_val === "DEP") {
            $("#pnFavorecido").css('display', 'inline');
        } else {
            $("#pnFavorecido").css('display', 'none');
        }
    });
    $("#btnLocFavorecido").click(function () {
        $("#pnGridFavorecidos").mofo({
            autoOpen: true,
            modal: true,
            width: 780,
            height: 400,
            title: 'Localizar Favorecido ou Fornecedor',
            open: function () {
                localizarFavorecido.displayGrid(); // gridData();
                $("#edtLocalizarFavorecidos").val('');
                $("#edtLocalizarFavorecidos").focus();
            }
        });
    });
    idGridFavorecidos.keydown(function (e) {
        if (e.keyCode === 9) {
            $("#edtLocalizarFavorecidos").focus();
            $("#edtLocalizarFavorecidos").select();
        }
        if (e.keyCode === 13) {
            rowindex = idGridFavorecidos.jqxGrid('getselectedrowindex');
            TIPO_FAVORECIDO = idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'TP_VINCULO');
            $("#id_favorecido").val(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'ID_FAVORECIDO'));
            $("#edtFavorecidoNome").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'NM_FAVORECIDO'));
            $("#edtFavorecidoBanco").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'SG_BANCO'));
            $("#edtFavorecidoAgencia").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'CD_AGENCIA'));
            $("#edtFavorecidoConta").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'NR_CONTA'));
            $("#pnGridFavorecidos").mofo('close');
        }
        return false;
    });
    idGridFavorecidos.dblclick(function () {
        rowindex = idGridFavorecidos.jqxGrid('getselectedrowindex');
        TIPO_FAVORECIDO = idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'TP_VINCULO');
        $("#id_favorecido").val(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'ID_FAVORECIDO'));
        $("#edtFavorecidoNome").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'NM_FAVORECIDO'));
        $("#edtFavorecidoBanco").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'SG_BANCO'));
        $("#edtFavorecidoAgencia").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'CD_AGENCIA'));
        $("#edtFavorecidoConta").html(idGridFavorecidos.jqxGrid('getcellvalue', rowindex, 'NR_CONTA'));
        $("#pnGridFavorecidos").mofo('close');
        return false;
    });
    document.onkeydown = function (e) {
        var code = e.keyCode || e.which;
        if ((code === 113) || (e.ctrlKey && code === 76)) { // F2 or ctrl + L
            $("#btnLocalizar").click();
            return false;
        }
        if ((code === 114) || (e.ctrlKey && code === 80)) { // F3 or ctrl + P
            $("#btnImprimirFaturas").click();
            stopExecution(e);
            return false;
        }
    };
    $("#btnIncluirFavorecido").click(function () {
        $("#pnIncluirFavorecido").mofo({
            autoOpen: true,
            modal: true,
            width: 669,
            title: 'Cadastrar Novo Favorecido',
            closeText: 'Cancela e fecha janela',
            buttons: {
                "Salvar": function () {
                    addFavorecido();
                },
                "Cancelar": function () {
                    $("#pnIncluirFavorecido").mofo('close');
                }
            },
            open: function () {
                $('.ui-dialog-buttonpane').find('button:contains("Salvar")').button({
                    icons: {
                        primary: 'ui-icon-disk'
                    }
                });
                $('.ui-dialog-buttonpane').find('button:contains("Cancelar")').button({
                    icons: {
                        primary: 'ui-icon-closethick'
                    }
                });
                getBancos();
            }
        });
    });
    $(document).on("click", ".confirmarQuitacao", function () {
        fatura = $(this).attr('fatura');
        util.confirma({
            msg: 'Confirma quitação deste registro?',
            icon: '3',
            funcao: function () {
                setQuitacao(fatura);
            }

        });
        return false;
    });

    $(document).on("click", ".confirmarCorreios", function () {
        fatura = $(this).attr('fatura');
        util.confirma({
            msg: 'Confirma o recebimento dos correios?',
            icon: '3',
            funcao: function () {
                setRecebimentoECT(fatura);
            }
        });
        return false;
    });
});
//////////////// fim do ready ////////////////

function getBancos() {
    $.ajax({
        data: {ax: 'getBancos'},
        beforeSend: function () {
            // stop ajax old
//      stopAjax();
        },
        success: function (r) {
            op = $('<option>', {html: 'SELECIONE', value: ''});
            $("#cd_banco").append(op);
            $.each(r, function (i, ln) {
                op = $('<option>', {html: ln.SG_BANCO, value: $.trim(ln.CD_BANCO)});
                $("#cd_banco").append(op);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function refreshButtons() {
    btn = $("#btnSalvar").prop('disabled');
    $("#btnNovo").button({disabled: btn});
    $("#btnSalvar").button({disabled: !btn});
    $("#btnCancelar").button({disabled: !btn});
    $("#btnExcluir").button({disabled: btn});
    $('#pnRegistros').toggle();
}

function LocalizarNF() {
    this.getDados = function (r) {
        var source = {
            datatype: "json",
            datafields: [
                {name: 'ID_FATURAS_APAGAR'},
                {name: 'ID_NOTA_FISCAL'},
                {name: 'NUM_NOTA_FISCAL'},
                {name: 'RAZAO_SOCIAL'},
                {name: 'NOME_FANTAZIA'},
                {name: 'DATA_QUITACAO'},
                {name: 'DATA_CORREIO'},
                {name: 'COD_FATURA'},
                {name: 'DATA_VENCIMENTO'},
                {name: 'VALOR'},
                {name: 'TIPO'}
            ],
            localdata: r,
            cache: false
        };
        idGridNotaFiscal.jqxGrid({source: source});
    };

    this.displayGrid = function (source) {
        var tem, nf;
        if (source === 'undefined')
            source = '[]';

        /////////////////////////////////////////////
        var valor = function (row, columnfield, value) {
            return '<div style="margin: 4px; text-align: right;">' + util.formatValor(value) + '</div>';
        };

        var data = function (row, columnfield, value) {
            if (value !== '') {
                return '<div style="margin: 4px; text-align: center;">' + util.dataBrasil(value, '-') + '</div>';
            } else {
                return '';
            }
        };

        var ID;

        var getID = function (row, columnfield, value) {
            ID = value;
            return '';
        };

        var dataQuitacao = function (row, columnfield, value) {
            if (value !== '') {
                return '<div style="margin: 4px; text-align: center;">' + util.dataBrasil(value, '-') + '</div>';
            } else {
                href = '<div style="text-align: center;">\n\
              <a href="#" class="confirmarQuitacao" fatura="' + ID + '"><img style="width: 25px;" src="img/ico-cifrao.png" title="Confirmar quitação"/></a>\n\
              </div>';
                return href;
            }
        };

        var dataCorreio = function (row, columnfield, value) {
            if (value !== '') {
                return '<div style="margin: 4px; text-align: center;">' + util.dataBrasil(value, '-') + '</div>';
            } else {
                href = '<div style="text-align: center;">\n\
              <a href="#" class="confirmarCorreios" fatura="' + ID + '"><img style="width: 25px;" src="img/ect.jpg" title="Confirmar Recebimento Correios"/></a>\n\
              </div>';
                return href;
            }
        };

        var num = function (row, columnfield, value) {
            return '<div style="margin: 4px; text-align: center;">' + value + '</div>';
        };
        
     
        
        /////////////////////////////////////////////
//        idGridNotaFiscal.jqxGrid({
//            width: '100%',
//            height: 280,
//            theme: 'fresh',
//            source: source,
//            altrows: true,
//            enablehover: false,
//            columns: [
//                {text: '', datafield: 'ID_FATURAS_APAGAR', width: 1, cellsrenderer: getID},
//                {text: '<center>Nº NF</center>', datafield: 'NUM_NOTA_FISCAL', cellsrenderer: num},
//                {text: '<center>Razão Social</center>', datafield: 'RAZAO_SOCIAL'},
//                {text: '<center>Nome Fantasia</center>', datafield: 'NOME_FANTAZIA'},
//                {text: '<center>Dt Quitação</center>', width: '11.5%', datafield: 'DATA_QUITACAO', cellsrenderer: dataQuitacao},
//                {text: '<center>Dt Correio</center>', width: '11.5%', datafield: 'DATA_CORREIO', cellsrenderer: dataCorreio},
//                {text: '<center>/</center>', width: 20, datafield: 'COD_FATURA', cellsrenderer: num},
//                {text: 'Forma', datafield: 'TIPO', width: 50, align: 'center', cellsalign: 'center'},
//                {text: '<center>Dt Venc.</center>', width: '11%', datafield: 'DATA_VENCIMENTO', cellsrenderer: data},
//                {text: '<center>Valor</center>', width: '10%', datafield: 'VALOR', cellsrenderer: valor}
//            ]
//        });




    };
}

function getNF(loc) {
    abortAjax = $.ajax({
        url: 'gerenciar_contas_apagar/per.gerenciar_contas_apagar.php',
        data: {ax: 'getNF', loc: loc.toUpperCase()},
        beforeSend: function () {
            // exibe splash loading
            idGridNotaFiscal.jqxGrid('showloadelement');
            // stop ajax old
            stopAjax();
        },
        success: function (r) {
            iQtd = 0;
            $.each(r, function (i, ln) {
                iQtd++;
            });
            $("#pnQtdResultadoNota").html(iQtd + ' registro(s)');
            localizarNF.getDados(r);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function getCabecalho(id_nota_fiscal) {
    $.ajax({
        url: 'gerenciar_contas_apagar/per.gerenciar_contas_apagar.php',
        data: {ax: 'getCabecalho', id_nota_fiscal: id_nota_fiscal},
        success: function (r) {
            $("#NOME_FANTAZIA").html(r[0].FORNECEDOR_RAZAO + ' (' + r[0].FORNECEDOR_FANTASIA + ')');
            $("#NUM_NOTA_FISCAL").html(r[0].NUM_NOTA_FISCAL);
            $("#DATA_EMISSAO").html(util.dataBrasil(r[0].DATA_EMISSAO, '-'));
            $("#DATA_ENTRADA").html(util.dataBrasil(r[0].DATA_EMISSAO, '-'));
            $("#VALOR_NF").html('R$ ' + util.formatValor(r[0].VALOR_NOTA_FISCAL));
            $("#NUM_NOTIFICACAO").html(r[0].NUM_NOTIFICACAO);
            $("#TRANSPORTADORA").html(r[0].TRANSPORTADORA_RAZAO);
            $("#DATA_ENTRADA_ESTADO").html(util.dataBrasil(r[0].DATA_ENTRADA_ESTADO, '-'));
        }
    });
}

function getFaturas(id_nota_fiscal) {
    $.ajax({
        url: 'gerenciar_contas_apagar/per.gerenciar_contas_apagar.php',
        data: {ax: 'getFaturas', id_nota_fiscal: id_nota_fiscal},
        success: function (r) {
            tableFaturas = $('<table>', {style: 'margin: 0 auto;width: 100%'});
            tr = $('<tr>');
            tr.append($('<th>', {html: '/'}));
            tr.append($('<th>', {html: 'Data Vencimento'}));
            tr.append($('<th>', {html: 'Forma Pagto'}));
            tr.append($('<th>', {html: 'Data Quitação'}));
            tr.append($('<th>', {html: 'Valor Quitação'}));
            tr.append($('<th>', {html: 'Valor'}));
            tr.append($('<th>', {html: 'Data Correio'}));
            tableFaturas.append(tr);
            iQtd = 0;
            $.each(r, function (i, ln) {
                tr = $('<tr>');
                tr.append($('<td>', {html: ln.COD_FATURA, id_fatura: ln.ID_FATURAS_APAGAR,
                    id_favorecido: ln.ID_FAVORECIDO, id_fornecedor: ln.ID_FORNECEDOR,
                    class: 'lnkFaturaEditar cod_fatura' + ln.ID_FATURAS_APAGAR, style: 'text-align: center;cursor: pointer;'}));
                tr.append($('<td>', {html: util.dataBrasil(ln.DATA_VENCIMENTO, '-'), id_fatura: ln.ID_FATURAS_APAGAR,
                    id_favorecido: ln.ID_FAVORECIDO, id_fornecedor: ln.ID_FORNECEDOR,
                    class: 'lnkFaturaEditar DATA_VENCIMENTO' + ln.ID_FATURAS_APAGAR, style: 'text-align: center;cursor: pointer;'}));
                if ($.trim(ln.TIPO) === '') {
                    tr.append($('<td>', {html: 'BOLETO', id_fatura: ln.ID_FATURAS_APAGAR, id_favorecido: ln.ID_FAVORECIDO,
                        id_fornecedor: ln.ID_FORNECEDOR, class: 'lnkFaturaEditar TIPO' + ln.ID_FATURAS_APAGAR, style: 'cursor: pointer;'}));
                } else
                if ($.trim(ln.TIPO) === 'CHE') {
                    tr.append($('<td>', {html: 'CHEQUE', id_fatura: ln.ID_FATURAS_APAGAR, id_favorecido: ln.ID_FAVORECIDO,
                        id_fornecedor: ln.ID_FORNECEDOR, class: 'lnkFaturaEditar TIPO' + ln.ID_FATURAS_APAGAR, style: 'cursor: pointer;'}));
                } else
                if ($.trim(ln.TIPO) === 'BOL') {
                    tr.append($('<td>', {html: 'BOLETO', id_fatura: ln.ID_FATURAS_APAGAR, id_favorecido: ln.ID_FAVORECIDO,
                        id_fornecedor: ln.ID_FORNECEDOR, class: 'lnkFaturaEditar TIPO' + ln.ID_FATURAS_APAGAR, style: 'cursor: pointer;'}));
                } else
                if ($.trim(ln.TIPO) === 'DEP') {
                    tr.append($('<td>', {html: 'DEPÓSITO', id_fatura: ln.ID_FATURAS_APAGAR, id_favorecido: ln.ID_FAVORECIDO,
                        id_fornecedor: ln.ID_FORNECEDOR, class: 'lnkFaturaEditar TIPO' + ln.ID_FATURAS_APAGAR, style: 'cursor: pointer;'}));
                } else
                if ($.trim(ln.TIPO) === 'DDA') {
                    tr.append($('<td>', {html: 'DDA (BOLETO EM POSSE DO BANCO)', id_fatura: ln.ID_FATURAS_APAGAR, id_favorecido: ln.ID_FAVORECIDO,
                        id_fornecedor: ln.ID_FORNECEDOR, class: 'lnkFaturaEditar TIPO' + ln.ID_FATURAS_APAGAR, style: 'cursor: pointer;'}));
                }
                tr.append($('<td>', {html: ln.DATA_QUITACAO === null ? '' : util.dataBrasil(ln.DATA_QUITACAO, '-'), id_favorecido: ln.ID_FAVORECIDO,
                    id_fornecedor: ln.ID_FORNECEDOR, id_fatura: ln.ID_FATURAS_APAGAR, class: 'lnkFaturaEditar DATA_QUITACAO' + ln.ID_FATURAS_APAGAR, style: 'text-align: center;cursor: pointer;'}));
                tr.append($('<td>', {html: ln.QUITACAO === null ? '' : util.formatValor(ln.QUITACAO), id_favorecido: ln.ID_FAVORECIDO,
                    id_fornecedor: ln.ID_FORNECEDOR, id_fatura: ln.ID_FATURAS_APAGAR, class: 'lnkFaturaEditar QUITACAO' + ln.ID_FATURAS_APAGAR, style: 'text-align: right;cursor: pointer;'}));
                tr.append($('<td>', {html: util.formatValor(ln.VALOR), id_favorecido: ln.ID_FAVORECIDO,
                    id_fornecedor: ln.ID_FORNECEDOR, id_fatura: ln.ID_FATURAS_APAGAR, class: 'lnkFaturaEditar VALOR' + ln.ID_FATURAS_APAGAR, style: 'text-align: right;cursor: pointer;'}));
                tr.append($('<td>', {html: ln.DATA_CORREIO === null ? '' : util.dataBrasil(ln.DATA_CORREIO, '-'), id_favorecido: ln.ID_FAVORECIDO,
                    id_fornecedor: ln.ID_FORNECEDOR, id_fatura: ln.ID_FATURAS_APAGAR, class: 'lnkFaturaEditar DATA_CORREIO' + ln.ID_FATURAS_APAGAR, style: 'text-align: center;cursor: pointer;'}));
                tableFaturas.append(tr);
                iQtd++;
            });
            $("#pnFaturas").html(tableFaturas);
            $("#pnQtdFaturas").html(iQtd + ' fatura(s)');
        }
    });
}

function getFavorecidos(loc) {
    abortAjax = $.ajax({
//    url: 'favorecido/per.favorecido.php',
        url: 'gerenciar_contas_apagar/per.gerenciar_contas_apagar.php',
        data: {ax: 'getFavorecidosOrFornecedores', loc: loc.toUpperCase()},
        beforeSend: function () {
            // limpa grid
            idGridFavorecidos.jqxGrid('clear');
            // exibe splash loading
            idGridFavorecidos.jqxGrid('showloadelement');
            // stop ajax old
            stopAjax();
        },
        success: function (r) {
            localizarFavorecido.getDados(r);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function getFavorecido(id_favorecido) {
    $.ajax({
        url: 'favorecido/per.favorecido.php',
        data: {ax: 'getFavorecido', id_favorecido: id_favorecido},
        beforeSend: function () {
            $("#id_favorecido").val('');
            $("#edtFavorecidoNome").html('...');
            $("#edtFavorecidoBanco").html('...');
            $("#edtFavorecidoAgencia").html('...');
            $("#edtFavorecidoConta").html('...');
        },
        success: function (r) {
            $("#id_favorecido").val(id_favorecido);
            $("#id_fornecedor").val('');
            $("#edtFavorecidoNome").html(r[0].NM_FAVORECIDO);
            $("#edtFavorecidoBanco").html(r[0].DS_BANCO);
            $("#edtFavorecidoAgencia").html(r[0].CD_AGENCIA);
            $("#edtFavorecidoConta").html(r[0].NR_CONTA);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function getFornecedor(id_fornecedor) {
    $.ajax({
        data: {ax: 'getFornecedor', id_fornecedor: id_fornecedor},
        beforeSend: function () {
            $("#id_favorecido").val('');
            $("#edtFavorecidoNome").html('...');
            $("#edtFavorecidoBanco").html('...');
            $("#edtFavorecidoAgencia").html('...');
            $("#edtFavorecidoConta").html('...');
        },
        success: function (r) {
            $("#id_favorecido").val('');
            $("#id_fornecedor").val(id_fornecedor);
            $("#edtFavorecidoNome").html(r[0].NOME_FANTAZIA);
            $("#edtFavorecidoBanco").html('...');
            $("#edtFavorecidoAgencia").html('...');
            $("#edtFavorecidoConta").html('...');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function LocalizarFavorecido() {
    this.getDados = function (r) {
        var source = {
            datatype: "json",
            datafields: [
                {name: 'ID_FAVORECIDO'},
                {name: 'CD_BANCO'},
                {name: 'NM_FAVORECIDO'},
                {name: 'TP_VINCULO'},
                {name: 'SG_BANCO'},
                {name: 'CD_AGENCIA'},
                {name: 'NR_CONTA'},
                {name: 'NM_MATRIZ'}
            ],
            localdata: r,
            cache: false
        };
        localizarFavorecido.displayGrid(source);
        $.jqx.dataAdapter(source);
    };
    this.displayGrid = function (source) {
        if (source === 'undefined')
            source = '[]';
        idGridFavorecidos.jqxGrid({
            width: '100%',
            height: 302,
            theme: 'fresh',
            source: source,
            altrows: true,
            enablehover: false,
            columns: [
                {text: '<center>Nome do Favorecido</center>', datafield: 'NM_FAVORECIDO'},
                {text: '<center>Tipo</center>', datafield: 'TP_VINCULO'},
                {text: '<center>Banco</center>', datafield: 'SG_BANCO'},
                {text: '<center>Agência</center>', datafield: 'CD_AGENCIA'},
                {text: '<center>Nº Conta</center>', datafield: 'NR_CONTA'},
                {text: '<center>Nome da Matriz</center>', datafield: 'NM_MATRIZ'},
            ]
        });
    };
}

function postFatura() {
    if (TIPO_FAVORECIDO === undefined)
        TIPO_FAVORECIDO = 'BOL';
    if (($("#DATA_VENCIMENTO").val() === '')) {
        util.show({msg: 'Data de vencimento da fatura deve ser informado, operação cancelada!', icon: '3'});
        return false;
    }
    if (($("#VLR_FATURA").val() === '')) {
        util.show({msg: 'Valor da fatura deve ser informado, operação cancelada!', icon: '3'});
        return false;
    }
    if (($("#TIPO").val() === 'DEP') && ($("#id_favorecido").val() === '')) {
        util.show({msg: 'O favorecido deve ser informado, operação cancelada!', icon: '3'});
        return false;
    }
    $.ajax({
        data: {ax: 'postFatura',
            ID_FATURA: ID_FATURAS_APAGAR,
            DATA_VENCIMENTO: util.dataUSA($("#DATA_VENCIMENTO").val(), '/'),
            VLR_FATURA: util.formatValorUSA($("#VLR_FATURA").val()),
            DATA_CORREIO: $("#DATA_CORREIO").val() === '' ? '' : util.dataUSA($("#DATA_CORREIO").val(), '/'),
            DATA_QUITACAO: $("#DATA_QUITACAO").val() === '' ? '' : util.dataUSA($("#DATA_QUITACAO").val(), '/'),
            QUITACAO: $("#QUITACAO").val() === '' ? '' : util.formatValorUSA($("#QUITACAO").val()),
            TIPO: $("#TIPO").val() === '' ? 'BOL' : $("#TIPO").val(),
            ID_FAVORECIDO: $("#id_favorecido").val() === '' ? '' : $("#id_favorecido").val(),
            VINCULO: TIPO_FAVORECIDO
        },
        success: function (r) {
            $("#pnCadastroFatura").mofo('close');
            $("#id_favorecido").val('');
            getFaturas(ID_NOTA_FISCAL);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Houve erro no ajax: ' + textStatus);
        }
    });
}

function addFavorecido() {
    tp_vinculo = '';
    if ($("#pnIncluirFavorecido #tp_vinculo_0").is(':checked') === true)
        tp_vinculo = 'OP';
    else
    if ($("#pnIncluirFavorecido #tp_vinculo_1").is(':checked') === true)
        tp_vinculo = 'AD';
    else
    if ($("#pnIncluirFavorecido #tp_vinculo_2").is(':checked') === true)
        tp_vinculo = 'RH';
    $.ajax({
        url: 'favorecido/per.favorecido.php',
        data: {ax: 'addFavorecido',
            CD_BANCO: $("#pnIncluirFavorecido #cd_banco").val(),
            CD_AGENCIA: $("#pnIncluirFavorecido #cd_agencia").val(),
            NR_CONTA: $("#pnIncluirFavorecido #nr_conta").val(),
            CD_OPERACAO: $("#pnIncluirFavorecido #cd_operacao").val(),
            NM_FAVORECIDO: $("#pnIncluirFavorecido #nm_favorecido").val(),
            TP_VINCULO: tp_vinculo,
            NR_CPF: $("#pnIncluirFavorecido #nr_cpf").val(),
            NR_CNPJ: $("#pnIncluirFavorecido #nr_cnpj").val(),
            NM_MATRIZ: $("#pnIncluirFavorecido #nm_matriz").val(),
            TX_OBS: $("#pnIncluirFavorecido #tx_obs").val()},
        success: function (r) {
            $("#pnIncluirFavorecido").mofo('close');
            $("#edtLocalizarFavorecidos").val($("#pnIncluirFavorecido #cd_agencia").val() + ' ' + $("#pnIncluirFavorecido #nr_conta").val());
            $("#edtLocalizarFavorecidos").focus();
            // limpar todos inputs
            $('#pnIncluirFavorecido').children().find('input,select,textarea').each(function () {
                $(this).val('');
            });
            $("#tp_vinculo_0").prop('checked', 'checked');
        }
    });
}

function setQuitacao(fatura) {
    $.ajax({
        data: {ax: 'setQuitacao', fatura: fatura},
        success: function (r) {
            getNF($("#edtLocalizarNota").val());
        }
    });
}

function setRecebimentoECT(fatura) {
    $.ajax({
        data: {ax: 'setRecebimentoECT', fatura: fatura},
        success: function (r) {
            getNF($("#edtLocalizarNota").val());
        }
    });
}


function ControleBTN(idDIV) {
//Controle de Botoes Novo, Salvar, Cancelar e Excluir
//Desabilite os botoes Salvar e Cancelar no HTML com a Tag disabled
    $(document).on("click", idDIV + " .ui-incluir, " + idDIV + " .ui-salvar, " + idDIV + " .ui-cancelar", function () {
        btnNovo = $(idDIV + ' .ui-incluir, ' + idDIV + ' .ui-novo, ' + idDIV + ' .ui-inserir').attr('disabled');
        controle = btnNovo ? false : true;
        $(idDIV + ' .ui-incluir, ' + idDIV + ' .ui-novo, ' + idDIV + ' .ui-inserir').button({disabled: controle});
        $(idDIV + " .ui-salvar").button({disabled: !controle});
        $(idDIV + " .ui-cancelar, " + idDIV + " .ui-cancel").button({disabled: !controle});
        $(idDIV + " .ui-deletar, " + idDIV + " .ui-excluir, " + idDIV + " .ui-delete").button({disabled: controle});
    });
}
