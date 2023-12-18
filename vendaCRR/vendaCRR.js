/* global util */

$.ajaxSetup({
    url: 'vendaCRR/per.vendaCRR.php',
    data: {
        class: 'vendaCRR',
    }
});


$(function () {
    afterLogin();
    $('.real').maskMoney({ thousands: '.', decimal: ',' });

    // var dt = new Date(util.dataUSA(DATA));
    // dt = new Date(dt.getFullYear(), parseInt(dt.getMonth()), 1);
    // $('#edtInicial').val('01' + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt.getFullYear());
    // $('#edtFinal').val(('0' + dt.getDate()).substr(-2) + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt.getFullYear());

    console.log(DATA);

    $('#edtInicial, #edtFinal').val(DATA);

    $('#edtInicial').datepicker({
        onSelect: function () {
            var dt = new Date(util.dataUSA($('#edtInicial').val()));
            var dt2 = new Date(dt.getFullYear(), parseInt(dt.getMonth() + 1), 0);
            $('#edtFinal').val(('0' + dt2.getDate()).substr(-2) + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt2.getFullYear());
        }
    });

    //("0" + dataAtual.getDate()).substr(-2);

    setTimeout(() => {
        vendaVendedor.getFuncionario()
    }, 1000);


});

function afterLogin() {
    var setInt;

    setInt = setInterval(function () {
        if (login['nome'] != undefined) {
            getLojas();
            vendaVendedor.getIdLojas();
            clearInterval(setInt);
        }
    }, 1000);



}


var vendaVendedor = (function () {
    var idLojas;
    var qtoLojas;

    var vendaGeral;
    var devolucaoGeral;
    var totalGeral;
    var totalMontagem;
    var comissaoGeral;

    var comissaoMontagem = 0;
    var comissaoVenda = 0;

    let slFuncionarios = {};

    function getIdLojas() {
        $.ajax({
            type: 'POST',
            url: 'class/per.mysql.php',
            data: {
                class: 'mysql',
                call: 'getIdLojas'
            },
            success: function (r) {
                idLojas = r;
                qtoLojas = Object.keys(idLojas).length;
            }

        });
    }

    function getFuncionario() {

        $.ajax({
            data: {
                id_sociedade: 10,
                call: 'getFuncionario',
            },
            beforeSend: function (xhr) {

            },
            success: function (r) {


                var option = $('<select/>', { id: 'slFuncionarios', class: 'chosen', width: '500px', multiple: 'true', 'data-placeholder': 'Selecione os Funcionários' });


                $.each(r, function (i, ln) {
                    option.append($('<option/>', { html: ln.LOGIN, value: ln.CPF }));

                });

                $('#pnFuncionario').html(option).focus();
                $(".chosen").chosen();


                let fun = localStorage.getItem('funcionariosCRR') || '[]'

                fun = JSON.parse(fun)

                $("#slFuncionarios").chosen().val(fun).trigger('chosen:updated');


            }

        });

    }

    function getVendaVendedor() {
        $('#pnResult').html('');
        vendaGeral = 0;
        devolucaoGeral = 0;
        totalGeral = 0;
        totalMontagem = 0;
        comissaoGeral = 0;

        comissaoMontagem = parseFloat($('#edtComissaoMontagem').val());
        comissaoVenda = parseFloat($('#edtComissaoVenda').val());


        var id_sociedade = $('#SelectLoja').val();
        var dtInicial = util.dataUSA($('#edtInicial').val());
        var dtFinal = util.dataUSA($('#edtFinal').val());
        var loja = $("#SelectLoja>option:selected").html();

        $('#pnData').html('<div class="center"><b>de ' + util.dataBrasil(dtInicial) + ' até ' + util.dataBrasil(dtFinal) + '</b></div>');


        if (dtInicial == '') {
            show('Informe a data Inicial');
            return false;
        }
        if (dtFinal == '') {
            show('Informe a data Final');
            return false;
        }


        localStorage.setItem('funcionariosCRR', JSON.stringify($("#slFuncionarios").val()))

        slFuncionarios = {}
        let divHtml = '';
        $.each($("#slFuncionarios").val(), (i, ln) => {
            // console.log(ln);
            let cpf = ln.replaceAll('.', '').replaceAll('-', '')
            divHtml += `<div class="col s12 l12">
                          <div class="pnVenda">
                          <span  class="nome_${cpf}"></span>
                          <div id="rs_${cpf}"></div>
                          </div>
                          
                       </div>`
            slFuncionarios[ln] = {}
        })

        $('#pnVendedor').html('<div class="row">' + divHtml + '</div>');

        $('#tbLojasValores').html('');

        if (id_sociedade == 0) {
            $.each(idLojas, function (i, ln) {
                getValores(ln.id_sociedade, dtInicial, dtFinal, ln.loja);
                // getMontagem(ln.id_sociedade, dtInicial, dtFinal, ln.loja);
            });
        } else {
            getValores(id_sociedade, dtInicial, dtFinal, loja);
            // getMontagem(id_sociedade, dtInicial, dtFinal, loja);

        }
    }

    function cardVendedor() {

        let ttVenda = 0;
        let ttDevolucao = 0;
        let ttotal = 0;


        $.each(slFuncionarios, (i, ln) => {

            let cpf = i.replaceAll('.', '').replaceAll('-', '')

            $('.nome_' + cpf).html(ln.NOME);
            // console.log(cpf, ln.NOME);

            // $('#'+ )

            var table = '<div class="table"> <table>' +
                '<tr>' +
                '<th>Loja</th>' +
                '<th>Venda</th>' +
                '<th>Devolução</th>' +
                '<th>Total</th>' +
                '</tr>';

            let tVenda = 0;
            let tDevolucao = 0;
            let total = 0;

            $.each(ln, (x, rs) => {
                //console.log(rs);

                // console.log(typeof (rs));
                if (typeof (rs) == 'string')
                    return

                table += '<tr>' +
                    '<td>' + rs.loja + '</td>' +
                    '<td class="esq">' + util.formatValor(rs.VENDA) + '</td>' +
                    '<td class="esq red-text">-' + util.formatValor(rs.DEVOLUCAO) + '</td>' +
                    '<td class="esq">' + util.formatValor(rs.TOTAL) + '</td>' +
                    '</tr>';



                tVenda += parseFloat(rs.VENDA);
                tDevolucao += parseFloat(rs.DEVOLUCAO);
                total = tVenda - tDevolucao;
            })

            ttVenda += tVenda;
            ttDevolucao += tDevolucao;
            ttotal += total;

            table += '<tr>' +
                '<td>Totais</td>' +
                '<td class="esq">' + util.formatValor(tVenda) + '</td>' +
                '<td class="esq red-text">-' + util.formatValor(tDevolucao) + '</td>' +
                '<td class="esq">' + util.formatValor(total) + '</td>' +
                '</tr>';

            table += '</table></div>';
            $('#rs_' + cpf).html(table);

            $('.ttVenda').html(util.formatValor(ttVenda));
            $('.ttDevolucao').html(util.formatValor(ttDevolucao));
            $('.ttTotal').html(util.formatValor(ttotal));




        })

        //         < div class="col s12 l4" >
        //             <div class="pnVenda">
        //                 <span>Francisco</span>
        //             </div>
        //   </ >

    }


    function getValores(id_sociedade, dtInicial, dtFinal, loja) {

        var vendaLoja;
        var devolucaoLoja;
        var totalLoja;
        var comissaoLoja;

        $.ajax({
            data: {
                id_sociedade: id_sociedade,
                call: 'getValores',
                param: {
                    dtInicial: dtInicial,
                    dtFinal: dtFinal,
                    cpfs: $("#slFuncionarios").val()
                }
            },
            beforeSend: function (xhr) {
                $('#pnResult').append('<div id="pnLoja' + id_sociedade + '">' + load() + '<div class="center-align"><b>Vendas </b>' + loja + '</div></div>');
                $('.pnLoads').append('<span class="center" id="pnLod' + id_sociedade + '"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></span>');
                vendaLoja = 0;
                devolucaoLoja = 0;
                totalLoja = 0;
                comissaoLoja = 0;
            },
            success: function (r) {



                if (r.loja) {
                    $('#pnLoja' + id_sociedade).html('Loja ' + loja + ' Esta OFF-LINE');
                    $('#pnLod' + id_sociedade).html('off');
                    return false;
                }


                // var table = '<div class="table"> <table>
                //     '<tr>' +
                //     '<th colspan="5"><b>Vendas </b>' + loja + '</th>' +
                //     '</tr>' +
                //     '<tr>' +
                //     '<th>Nome</th>' +
                //     '<th>Venda</th>' +
                //     '<th>Devolução</th>' +
                //     '<th>Total</th>' +
                //     '<th>Comissão</th>' +
                //     '</tr>';

                $.each(r, function (i, ln) {

                    slFuncionarios[ln.CPF].NOME = ln.LOGIN;
                    slFuncionarios[ln.CPF][id_sociedade] = {
                        loja, id_sociedade, VENDA: ln.VENDA, DEVOLUCAO: ln.DEVOLUCAO, TOTAL: ln.TOTAL
                    }

                    vendaVendedor.cardVendedor()


                    vendaLoja += parseFloat(ln.VENDA);
                    devolucaoLoja += parseFloat(ln.DEVOLUCAO == null ? 0 : ln.DEVOLUCAO);
                    totalLoja += ln.TOTAL;


                    // table += '<tr>' +
                    //     '<td>' + ln.LOGIN + '</td>' +
                    //     '<td class="esq">' + util.formatValor(ln.VENDA) + '</td>' +
                    //     '<td class="esq red-text">-' + util.formatValor(ln.DEVOLUCAO) + '</td>' +
                    //     '<td class="esq">' + util.formatValor(ln.TOTAL) + '</td>' +
                    //     '<td class="esq">' + util.formatValor(ln.TOTAL * comissaoVenda / 100) + '</td>' +
                    //     '</tr>';
                });


                $('#tbLojasValores').append(`<tr>
                                                <td>${loja}</td>
                                                <td class="esq">${util.formatValor(vendaLoja)}</td>
                                                <td class="esq red-text">- ${util.formatValor(devolucaoLoja)} </td>
                                                <td class="esq">${util.formatValor(totalLoja)} </td>
                                                </tr>`)

                // table += '<tr>' +
                //     '<td>&nbsp;</td>' +
                //     '<td class="esq blue-text">' + util.formatValor(vendaLoja) + '</td>' +
                //     '<td class="esq red-text">-' + util.formatValor(devolucaoLoja) + '</td>' +
                //     '<td class="esq blue-text">' + util.formatValor(totalLoja) + '</td>' +
                //     '<td class="esq blue-text">' + util.formatValor(comissaoLoja) + '</td>' +
                //     '</tr>';
                // table += '</table></div>';

                $('#pnLoja' + id_sociedade).remove();
                $('#pnLod' + id_sociedade).remove();

                // if (id_sociedade != 6) {
                //     vendaGeral += vendaLoja;
                //     devolucaoGeral += devolucaoLoja;
                //     totalGeral += totalLoja;
                //     comissaoGeral += comissaoLoja;


                //     $('.ttVenda').html(util.formatValor(vendaGeral));
                //     $('.ttTotal').html(util.formatValor(totalGeral));
                //     $('.ttDevolucao').html(util.formatValor(devolucaoGeral));
                //     $('.ttComissao').html(util.formatValor(comissaoGeral));
                // }


                // console.log(slFuncionarios);

            }

        });
    }

    function _getMontagem(id_sociedade, dtInicial, dtFinal, loja) {
        var vendaLoja;
        var devolucaoLoja;
        var totalLoja;
        var comissaoLoja;

        $.ajax({
            data: {
                id_sociedade: id_sociedade,
                call: 'getValorMontagem',
                param: {
                    dtInicial: dtInicial,
                    dtFinal: dtFinal
                }
            },
            beforeSend: function (xhr) {
                $('#pnResult').append('<div id="pnMLoja' + id_sociedade + '">' + load() + '<div class="center-align"><b>Montagem </b>' + loja + '</div></div>');
                $('.pnLoads').append('<span class="center" id="pnMLod' + id_sociedade + '"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></span>');
                vendaLoja = 0;
                devolucaoLoja = 0;
                totalLoja = 0;
                comissaoLoja = 0;
            },
            success: function (r) {

                if (r.loja) {
                    $('#pnMLoja' + id_sociedade).html('Loja ' + loja + ' Esta OFF-LINE');
                    $('#pnMLod' + id_sociedade).html('off');
                    return false;
                }

                if (r.length == undefined) {


                    var table = '<div class="table"> <table>' +
                        '<tr>' +
                        '<th colspan="5"><b>Montagem </b>' + loja + '</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th>Nome</th>' +
                        '<th>Venda</th>' +
                        '<th>Devolução</th>' +
                        '<th>Total</th>' +
                        '<th>Comissão</th>' +
                        '</tr>';

                    $.each(r, function (i, ln) {
                        vendaLoja += parseFloat(ln.VENDA);
                        devolucaoLoja += parseFloat(ln.DEVOLUCAO == null ? 0 : ln.DEVOLUCAO);
                        totalLoja += ln.TOTAL;
                        comissaoLoja += ln.TOTAL * comissaoMontagem / 100;

                        totalMontagem += ln.TOTAL;

                        table += '<tr>' +
                            '<td>' + ln.LOGIN + '</td>' +
                            '<td class="esq">' + util.formatValor(ln.VENDA) + '</td>' +
                            '<td class="esq red-text">-' + util.formatValor(ln.DEVOLUCAO) + '</td>' +
                            '<td class="esq">' + util.formatValor(ln.TOTAL) + '</td>' +
                            '<td class="esq">' + util.formatValor(ln.TOTAL * comissaoMontagem / 100) + '</td>' +
                            '</tr>';
                    });

                    table += '<tr>' +
                        '<td>&nbsp;</td>' +
                        '<td class="esq blue-text">' + util.formatValor(vendaLoja) + '</td>' +
                        '<td class="esq red-text">-' + util.formatValor(devolucaoLoja) + '</td>' +
                        '<td class="esq blue-text">' + util.formatValor(totalLoja) + '</td>' +
                        '<td class="esq blue-text">' + util.formatValor(comissaoLoja) + '</td>' +
                        '</tr>';
                    table += '</table></div>';

                    //  vendaGeral += vendaLoja;
                    // devolucaoGeral += devolucaoLoja;
                    // totalGeral += totalLoja;
                    comissaoGeral += comissaoLoja;

                    $('#pnMLoja' + id_sociedade).html(table);
                    $('#pnMLod' + id_sociedade).remove();

                    //$('.ttVenda').html(util.formatValor(vendaGeral));

                    // $('.ttDevolucao').html(util.formatValor(devolucaoGeral));
                    // $('.ttTotal').html(util.formatValor(totalGeral));


                    $('.ttMont').html(util.formatValor(totalMontagem));
                    $('.ttComissao').html(util.formatValor(comissaoGeral));
                } else {
                    $('#pnMLoja' + id_sociedade).html('');
                    $('#pnMLod' + id_sociedade).remove();
                }

            }

        });


    }


    return {
        getIdLojas: getIdLojas,
        getVendaVendedor: getVendaVendedor,
        getValores: getValores,
        getFuncionario: getFuncionario,
        cardVendedor: cardVendedor,
        // getMontagem: getMontagem
    };
})();


function getLojas() {
    $.ajax({
        type: 'POST',
        url: 'class/per.mysql.php',
        dataType: 'html',
        data: {
            class: 'mysql',
            call: 'getListaLojaSelect'
        },
        beforeSend: function (xhr) {
            $('#pnLojas').html(load());
        },
        success: function (r) {
            $('#pnLojas').html('<span>Lojas</span><br>' + r);
        }

    });
}



function xls(id_div) {
    var a = document.createElement('a');
    var data_type = 'data:application/vnd.ms-excel';
    var table_div = document.getElementById(id_div);
    var table_html = table_div.outerHTML.replace(/ /g, '%20');
    a.href = data_type + ', ' + table_html;
    a.download = 'Comissao.xls';
    a.click();
}