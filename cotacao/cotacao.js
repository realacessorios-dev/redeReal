var empresa = {'cnpj': ''};
var numCotacao;
var codProduto;
var cotacoes = {};
var cotadores = {};
var indexProduto = {};

var popMenuCotadores = {}
var gridLocIten;

$(function () {
    afterLogin();

    logProduto.setShowCustoEntrada();

    //getCotação Aberta
    $('#tab1').click(function () {
        cotacao.clearLimit();
        cotacao.getCotacao('false');
    });

    //getCotação Fechada
    $('#tab2').click(function () {
        cotacao.clearLimit();
        cotacao.getCotacao('true');
    });

    //getCotação Encerrada
    $('#tab3').click(function () {
        cotacao.clearLimit();
        cotacao.getCotacao('ence');
    });


    //open MenuPop
    $(document).on('click', '.btnMenu', function (e) {
        numCotacao = $(this).attr('num_cotacao');
//    $('.xMenu').css({top: e.clientY, left: e.clientX}).show('fast');
        $('#popMenuCotacao').css({top: e.clientY, left: e.clientX}).show('fast');
    });

    //open MenuPop
    $(document).on('click', '.btnPopMenuCotadores', function (e) {
        popMenuCotadores = {
            'num_cotacao': $(this).attr('num_cotacao'),
            'id_cotadores': $(this).attr('id_cotadores'),
            'id_representante': $(this).attr('id_representante')
        };
        $('#popMenuCotadores').css({top: e.clientY, left: e.clientX}).show('fast');
    });

    //open MenuPop
    $(document).on('click', '#btnMenuComparar', function (e) {
        // $('#popMenuComparar').css({top: e.clientY, left: e.clientX}).show('fast');
        $('#popMenuComparar').css({top: e.clientY, left: e.clientX - 250}).show('fast');//.addClass('animated flipInX');
    });

    //close MenuPop


    $(document).on('click', function (e) {

        //$(document).click(function (e) {
        if (!e.target.matches('.btnMenu'))
            $('#popMenuCotacao').hide('fast');

        if (!e.target.matches('.btnPopMenuCotadores'))
            $('#popMenuCotadores').hide('fast');

        if (!e.target.matches('#btnMenuComparar'))
            $('#popMenuComparar').hide('fast');
    });


//ver itens ganho do cotador
    $('#btnVerItensGanhos').click(function () {
        cotacao.getProdutoPorCotador(popMenuCotadores.num_cotacao, popMenuCotadores.id_cotadores, 'sim');
        return false;
    });

    //retirar cotadoar da cotação
    $('#btnDeletarCotador').click(function () {
        cotacao.retirarCotador(popMenuCotadores.num_cotacao, popMenuCotadores.id_representante);
        return false;
    });



    $(document).on('click', '#btnPrintItensGanhos', function () {
        PrintDivHTML($('#pnResultICC').html(), $(this));
    });



});

function afterLogin() {
    var setInt;

    setInt = setInterval(function () {
        if (login['nome'] != undefined) {

            novaCotacao.getLojas();
            cotacao.getCotacao('false');
            cotacao.getRepresentante();
            getTransportadora();

            clearInterval(setInt);
        }

    }, 1000);

}

var produtoCotacao;

var itensCotador = {};

var valorItensGanhos = {};

var comparar = (function () {
    //var valorItensGanhos = {};
    var qtoItens;
    var posicaoAtual;
    function historicoProduto() {
        $.ajaxSetup({data: {id_sociedade: cotacoes[numCotacao].id_sociedade}});
        logProduto.getHistoricoModal(codProduto);
        var orangeColor = $('.orangeColor').html() == undefined ? '' : ('<b>' + $('.orangeColor').html() + '</b><br>')
        var redColor = $('.redColor').html() == undefined ? '' : ('<b>' + $('.redColor').html() + '</b>');

        show({
            msg: $('.spDesc').html() + ' (' + $('.spCarro').html() + ') Qto.: ' + $('.spQto').html() + '<br>' + orangeColor + redColor,
            close: function () {
                $('#pnModalGetHistorico').dialog('close');
            }
        });
    }

    function peca_Online() {
        pecaOnline.getPecaOnline(codProduto, $('.spDesc').html(), $('.spFab2').html(), '', $('.spCarro').html());
    }

    function modalComparar() {
        var full_screen = false;

        if (parseInt($(window).width()) < 1100)
            full_screen = true;

        $('#pnComparar').mofo({
            esc: false,
            fullScreen: full_screen,
            buttons: {
                Fechar: function () {
                    $('#pnComparar').mofo('close');
                }
            },
            close: function () {
                cotacao.getCotadores(numCotacao);
            },
            keyDown: {
                voltar: {
                    key: 37,
                    call: function () {
                        voltar();
                    }
                },
                proximo: {
                    key: 39,
                    call: function () {
                        proximo();
                    }
                },
                detalheProduto: {
                    key: 'ctrl+66', //CTRL+B
                    call: historicoProduto
                },
                peca_On_line: {
                    key: 'ctrl+68', //CTRL+D
                    call: peca_Online
                },
                f12: {
                    key: 123,
                    call: modalGrid
                }

            }
        });
    }

    function modalGrid() {
        $('#pnLocalizarIten').mofo({
            width: 680,
            height: 410,
            open: function () {
                $('#edtLocProduto').val('').focus();
            }
        });
    }

    function getProdutoCotacao() {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getProdutoCotacao',
                class: 'Cotacao',
                param: {
                    num_cotacao: numCotacao
                }
            },
            beforeSend: function (xhr) {

            },
            success: function (r) {
                produtoCotacao = r;
                qtoItens = produtoCotacao.length;
                posicaoAtual = 0;
                $('#pnPosicao').html('1/' + qtoItens);
                modalComparar();
                gridLocIten.create(r);
                getItensCotadores();


                $('#pnBlocos').html('');
                $.each(r, function (i, ln) {
                    $('#pnBlocos').append('<span id="spBloco' + ln.cod_produto + '" cod_produto="' + ln.cod_produto + '" class="spBloco itenGanho"></span>');
                });


            }
        });
    }

    function getItensCotadores() {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getProdutoPorCotadores',
                class: 'Cotacao',
                param: {
                    num_cotacao: numCotacao
                }
            },
            beforeSend: function (xhr) {
                $('#pnItensCotadores').html(load());
                $('#pnCotadoresResumo').html('');
            },
            success: function (r) {

//                lista produtos ganhos
                $.each(r.cotadores, function (x, a) {
                    //  var div = $('<div>', {id: 'pnResult' + a.id_cotadores, class: 'pnReultCotacao'});
                    //$('#pnCotadoresResumo').append(a.nome);

                    valorItensGanhos[a.id_cotadores] = 0;

                    var html = //'<div class="table pnRcotadores">' +
                            '<table class="table pnRcotadores" id="table' + a.id_cotadores + '">' +
                            '<tr>' +
                            '<th colspan="3">' + a.nome + '<span id="spL' + a.id_cotadores + '"></span></th>' +
                            '</tr>' +
                            '<tr>' +
                            '<td colspan="3"><div class="right-align" id="pnVl' + a.id_cotadores + '">0.00</div></td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>';
                    $('#pnCotadoresResumo').append(html);

                    getNumFabricanteGanho(a.id_cotadores);

                });

                // console.log(valorGanho);

                $.each(r.itens, function (i, lx) {
                    itensCotador[lx.cod_produto + '-' + lx.id_cotadores] = {valor: lx.valor, ganho: lx.ganho, cod_produto: lx.cod_produto};
                });


                $.each(produtoCotacao, function (ii, ln) {
                    indexProduto[ln.cod_produto] = {index: ii, num_fabricante: ln.num_fabricante};

                    var nomeCotador = {
                    };

                    $.each(r.cotadores, function (a, B) {
                        var valor = itensCotador[ln.cod_produto + '-' + B.id_cotadores] != undefined ? itensCotador[ln.cod_produto + '-' + B.id_cotadores].valor : 0;
                        var ganho = itensCotador[ln.cod_produto + '-' + B.id_cotadores] != undefined ? itensCotador[ln.cod_produto + '-' + B.id_cotadores].ganho : '';

                        nomeCotador[ln.cod_produto + '-' + B.id_cotadores] = {
                            cod_produto: ln.cod_produto,
                            nome: B.nome,
                            valor: valor,
                            ganho: ganho,
                            id_cotadores: B.id_cotadores
                        };

                    });

                    produtoCotacao[ii]['cotadores'] = nomeCotador;

                });

                showProduto(0);
            }
        });
    }

    function voltar() {
        if (posicaoAtual > 0) {
            posicaoAtual--;

            if (posicaoAtual => 0)
                if (posicaoAtual < qtoItens) {
                    showProduto(posicaoAtual);
//                    $('#pnPosicao').html(posicaoAtual + 1 + '/' + qtoItens);
                }


            if (posicaoAtual == 0)
                $('#btnVoltar').prop('disabled', 'true');

            $('#btnProximo').removeAttr('disabled');
        }

    }

    function proximo() {

        if (posicaoAtual < qtoItens - 1) {
            posicaoAtual++;

            if (posicaoAtual => 0)
                if (posicaoAtual < qtoItens) {
                    showProduto(posicaoAtual);
//                    $('#pnPosicao').html(posicaoAtual + 1 + '/' + qtoItens);
                }


            if (posicaoAtual >= qtoItens - 1)
                $('#btnProximo').prop('disabled', 'true');

            $('#btnVoltar').removeAttr('disabled');

        }
    }

    function getNumFabricanteGanho(id_cotadores) {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getNumFabricanteGanho',
                class: 'Cotacao',
                param: {
                    num_cotacao: numCotacao,
                    id_cotadores: id_cotadores
                }
            },
            beforeSend: function (xhr) {
                $('#spL' + id_cotadores).html(load());
            },
            success: function (r) {
                var html = '';
                var valor = 0;


                $.each(r, function (i, ln) {
                    html += '<tr class="itenGanho" cod_produto="' + ln.cod_produto + '" id="pganho' + ln.cod_produto + id_cotadores + '">' +
                            '<td>' + ln.num_fabricante + '</td>' +
                            '<td style="font-size:10px!important">' + ln.valor + '</td>' +
                            '<td>' + ln.qto + '</td>' +
                            '</tr>';
                    valor += parseFloat(ln.valor) * parseInt(ln.qto);

                    $('#spBloco' + ln.cod_produto).hide();

                });
                valorItensGanhos[id_cotadores] = valor;

                $('#pnVl' + id_cotadores).html(formatValor(valor));
                $('#spL' + id_cotadores).html('');
                $('#table' + id_cotadores).append(html);

            }
        });
    }


    function showProduto(index) {
        var valorMenor = 0;
        $('.spFab').html(produtoCotacao[index].num_fabricante);
        $('.spFab2').html(produtoCotacao[index].num_fabricante2);
        $('.spDesc').html(produtoCotacao[index].desc_produto);
        $('.spCarro').html(produtoCotacao[index].carro);
        $('.spQto').html(produtoCotacao[index].qto);
        codProduto = produtoCotacao[index].cod_produto;

        $('#pnItensCotadores').html('');

        $.each(produtoCotacao[index].cotadores, function (i, ln) {
            var vClass = ln.valor.toString();
            vClass = vClass.replace('.', '');
            // var vDisabled = ln.valor == 0 ? 'disabled="true"' : '';

            var vTipoColor = $.trim(ln.ganho) == 'sim' ? ' orangeColor ' : ' blueColor ';
            var vUpFor = $.trim(ln.ganho) == 'sim' ? 'nao' : 'sim';

            var btn = $('<button>', {
                id: 'btn' + ln.cod_produto + ln.id_cotadores,
                index_: index,
                id_cotadores: ln.id_cotadores,
                cod_produto: ln.cod_produto,
                up_para: vUpFor,
                vl: ln.valor,
                class: vClass + vTipoColor + 'button btnCotadores waves-effect waves-light',
                html: ln.nome + '<br>' + util.formatValor(ln.valor)
            });

            if (ln.valor == 0)
                btn.attr('disabled', 'true');
            $('#pnItensCotadores').append(btn);


//            $('#pnItensCotadores').append('<button index="' + index + '" id_cotadores="' +
            //                    ln.id_cotadores + '" cod_produto="' + ln.cod_produto + '" up_para="' + vUpFor + '" ' + vDisabled + ' class="' + vClass + vTipoColor + ' button btnCotadores waves-effect waves-light">' +
            //                    ln.nome + '<br>' +
            //                    util.formatValor(ln.valor) +
            //                    '</button>');


            if (valorMenor == 0)
                valorMenor = parseFloat(ln.valor);

            if (parseFloat(ln.valor) > 0)
                if (parseFloat(ln.valor) < valorMenor)
                    valorMenor = parseFloat(ln.valor);



        });

        if (valorMenor == 0) {
            $('#spBloco' + codProduto).hide();
        }


        if (valorMenor != 0) {
            valorMenor = valorMenor.toFixed(2).toString();
            if ($('.' + valorMenor.replace('.', '')).hasClass('blueColor'))
                $('.' + valorMenor.replace('.', '')).removeClass('blueColor').addClass('redColor');
        }

//        $('#pnPosicao').html(posicaoAtual + 1 + '/' + qtoItens);
        $('#pnPosicao').html((parseInt(index) + 1) + '/' + qtoItens);
        posicaoAtual = index;

    }

    function updateItenCotado(cod_produto, id_cotadores, up_para, index, idBtn, vl) {
        var html = $('#pnItensCotadores #' + idBtn).html();

        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'updateItenCotado',
                class: 'Cotacao',
                param: {
                    ganho: up_para,
                    id_cotadores: id_cotadores,
                    cod_produto: cod_produto,
                    num_cotacao: numCotacao
                }
            },
            beforeSend: function (xhr) {

                $('#pnItensCotadores .button').attr('disabled', 'true');
                $('#pnItensCotadores #' + idBtn).html(load() + html);
                if ($('#chAuto').prop('checked') == true)
                    $('#pnItensCotadores #' + idBtn).addClass('animated fadeOutDown');

            },
            success: function (r) {
                setTimeout(function () {
                    produtoCotacao[index].cotadores[cod_produto + '-' + id_cotadores].ganho = up_para;


                    //remover item da lista dos ganhos
                    if (up_para == 'sim') {
                        var conteudo = '<tr class="itenGanho" cod_produto="' + cod_produto + '" id="pganho' + cod_produto + id_cotadores + '">' +
                                '<td>' + produtoCotacao[index].num_fabricante + '</td>' +
                                '<td>' + produtoCotacao[index].qto + '</td>' +
                                '</tr>';
                        var valor = parseFloat(valorItensGanhos[id_cotadores]) + (parseInt(produtoCotacao[index].qto) * parseFloat(vl));
                        $('#pnVl' + id_cotadores).html(formatValor(valor));
                        valorItensGanhos[id_cotadores] = valor;
                        $('#table' + id_cotadores).append(conteudo);
                        $('#spBloco' + cod_produto).hide();

                    } else {
                        var valor = parseFloat(valorItensGanhos[id_cotadores]) - (parseInt(produtoCotacao[index].qto) * parseFloat(vl));
                        $('#pnVl' + id_cotadores).html(formatValor(valor));
                        valorItensGanhos[id_cotadores] = valor;
                        $('#pganho' + cod_produto + id_cotadores).remove();
                        $('#pnBlocos').append('<span id="spBloco' + cod_produto + '" cod_produto="' + cod_produto + '" class="spBloco itenGanho"></span>');

                    }


                    if ($('#chAuto').prop('checked') == true)
                        proximo();
                    else {
                        $('#pnItensCotadores .button').removeAttr('disabled');
                        $('#pnItensCotadores #' + idBtn).html(html);
                        if (up_para == 'sim')
                            $('#pnItensCotadores #' + idBtn).removeClass('blueColor').removeClass('redColor').addClass('orangeColor');
                        else
                            $('#pnItensCotadores #' + idBtn).removeClass('orangeColor').addClass('blueColor');
                    }



                }, 300);

            }
        });

    }

    function resumoProduto() {
        $('#pnResumoProduto').mofo();
        $('#pnResulProduto').html('');

        //lista produtos ganhos
        $.each(cotadores[numCotacao], function (x, a) {

            var html = // '<div class="table pnRcotadores">' +
                    '<table class="table pnRcotadores" id="table' + a.id_cotadores + '">' +
                    '<tr>' +
                    '<th colspan="3">' + a.nome + '<span id="spL' + a.id_cotadores + '"></span></th>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="3"><div class="right-align" id="pnVl' + a.id_cotadores + '">0.00</div></td>' +
                    '</tr>' +
                    '</table>';// +
            //  '</div>';

            $('#pnResulProduto').append(html);

            getNumFabricanteGanho(a.id_cotadores);

        });

    }


    setTimeout(function () {
        gridLocIten = new xGrid({
            id: '#pnGridLocIten',
            count: true,
            height: 300,
            theme: 'x-gray',
            columns: {
                'Nº Fabr.': {dataField: 'num_fabricante', width: '10%'},
                'Nº Fabr2': {dataField: 'num_fabricante2', width: '10%'},
                'Descrição Produto': {dataField: 'desc_produto'},
                'Carro': {dataField: 'carro', width: '15%'},
                'Qto': {dataField: 'qto', width: '5%', style: 'text-align:center'}
            },
            keyDown: {
                enter: {
                    key: 13,
                    call: function () {
                        showProduto(gridLocIten.getIndex());
                        $('#pnLocalizarIten').mofo('close');
                    }
                }
            }
        });

    }, 1000);


    $(document).on('keydown', '#edtLocProduto', function (e) {
        if (e.keyCode == 13) {
            gridLocIten.filtro($('#edtLocProduto').val());
        }

        if (e.keyCode == 40) {
            gridLocIten.focus();
        }
    });

    $(document).on('click', '.btnCotadores', function () {
        var cod_produto = $(this).attr('cod_produto');
        var up_para = $(this).attr('up_para');
        var id_cotadores = $(this).attr('id_cotadores');
        var index = $(this).attr('index_');
        var idBtn = $(this).attr('id');
        var vl = $(this).attr('vl');


        updateItenCotado(cod_produto, id_cotadores, up_para, index, idBtn, vl);

    });

    $(document).on('click', '.itenGanho', function () {
        var cod = $(this).attr('cod_produto');
        showProduto(parseInt(indexProduto[cod].index));
    });


    $(document).on('keydown', '#edtLocProdutoResumo', function (e) {
        if (e.keyCode == 13) {
            var texto = $(this).val();

            $(".itenGanho").each(function () {
                var resultado = $(this).text().toUpperCase();
                //var resultado = $(this).text();

                if (resultado.indexOf(texto.toUpperCase()) == 0)
                    $(this).show();
                else
                    $(this).hide();
            });

        }
    });



    setTimeout(function () {
        $('#chAuto').prop('checked', true);
    }, 500);


    return {
        modalComparar: modalComparar,
        modalGrid: modalGrid,
        getProdutoCotacao: getProdutoCotacao,
        proximo: proximo,
        voltar: voltar,
        historicoProduto: historicoProduto,
        peca_Online: peca_Online,
        showProduto: showProduto,
        resumoProduto: resumoProduto
    };
})();

var cotacao = (function () {
    var dadosOBS = '';
    let limit = 0;

    function clearLimit() {
        limit = 0
    }

    function xMenu(status) {
        var menu = '<ul class="xMenu" id="popMenuCotacao" style="width: 250px!important;">';
        if (status == 'false')
            menu += '<li onclick="cotacao.modalRepresentante()" ><i class="fa fa-plus"></i> Adicionar Cotador</li>';

        menu += '<li onclick="cotacao.getProdutoCotacao()"><i class="fa fa-list-ol"></i> Produto desta Cotação</li>' +
                '<li onclick="cotacao.resumoCotacao()"><i class="fa fa-bar-chart"></i> Resumo da Cotação</li>';
        // '<li><i class="fa fa-send"></i> Enviar E-Mail p/ Cotadores</li>';

        //cotação aberta
        if (status == 'false') {
            menu += '<li onclick="cotacao.updateStatusCotacao(\'true\')" ><i class="fa fa-close"></i> Fechar Cotação</li>';
        }

//codataçao fechada
        if (status == 'true') {
            menu += '<li onclick="cotacao.updateStatusCotacao(\'false\')" ><i class="fa fa-pencil"></i> Re-Abrir Cotação</li>';
            menu += '<li onclick="comparar.getProdutoCotacao()"><i class="fa fa-handshake-o"></i> Comparar Cotação</li>';
            menu += '<li onclick="cotacao.updateStatusCotacao(\'ence\')"><i class="fa fa-close"></i> Encerrar Cotação</li>';
        }

//cotação encerrada
        if (status == 'ence') {
            menu += '<li onclick="cotacao.updateStatusCotacao(\'false\')"><i class="fa fa-pencil"></i> Re-Abrir Cotação</li>';
            menu += '<li onclick="comparar.resumoProduto()"><i class="fa fa-crosshairs"></i> Resumo dos Produtos</li>';
            menu += '<li onclick="cotacao.tranferirLoja()"><i class="fa fa-share-square"></i> Transferir p/ Loja </li>';
        }

        menu += '<li onclick="cotacao.deleteCotacao()"><i class="fa fa-trash"></i> Deletar Cotação</li>' +
                '</ul>';
        $('#pnMenuPop').html(menu);
    }

    function tranferirLoja() {

        confirmaCodigo({
            msg: 'Gostaria de transmitir a cotação para a loja de origem?',
            call: function () {
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'getCotacaoTranfer',
                        class: 'Cotacao',
                        param: {
                            num_cotacao: numCotacao
                        }
                    },
                    beforeSend: function (xhr) {
                        aguarde('Atualizando itens na loja')
                    },
                    success: function (r) {
                        aguarde('close');
                    }
                });
            }
        })



    }

    function getCotacao(status) {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getCotacao',
                class: 'Cotacao',
                param: {
                    status: status,
                    limit: limit
                }
            },
            beforeSend: function (xhr) {
                if (status == 'false')
                    $('#content1').html('<div class="center-align"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>');
                if (status == 'true')
                    $('#content2').html('<div class="center-align"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>');
                if (status == 'ence')
                    $('#content3').html('<div class="center-align"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>');
            },
            success: function (r) {


                if (status == 'false')
                    $('#content1').html('');
                if (status == 'true')
                    $('#content2').html('');
                if (status == 'ence')
                    $('#content3').html('');
                var html = '';
                cotacoes = {};
                $.each(r, function (i, ln) {
                    limit++;
                    cotacoes[ln.num_cotacao] = ln;
                    html = '<div class="r_cotacao z-depth-1" id="pnCotacao' + ln.num_cotacao + '">' +
                            '<div class="left">' +
                            '<button class="btn waves-effect waves-light light-blue lighten-2 btnMenu" num_cotacao="' + ln.num_cotacao + '">' +
                            '</button>' +
                            '</div>' +
                            '<div class="row r_titulo">' +
                            '<div class="col s3">' + ln.loja + '</div>' +
                            '<div class="col s2">(Nº Cotação ' + ln.num_cotacao + ')</div>' +
                            '<div class="col s1">' + util.dataBrasil(ln.data) + '</div>' +
                            '<div class="col s2">' + ln.marca + '</div>' +
                            '<div class="col s3">Finaliza em ' + util.dataBrasil(ln.finalizacao) + '</div>' +
                            '</div>' +
                            '<div class="row pnResultCotacao' + ln.num_cotacao + '" style="margin: 5px!important">' +
                            '</div>' +
                            '</div>';
                    if (status == 'false')
                        $('#content1').append(html);
                    if (status == 'true')
                        $('#content2').append(html);
                    if (status == 'ence')
                        $('#content3').append(html);
                    getCotadores(ln.num_cotacao);
                });


                if (status == 'false')
                    $('#content1').append($('<button>', {onclick: "cotacao.getCotacao('false')", html: 'Mais', class: 'btn right', style: 'margin-top:20px'}));
                if (status == 'true')
                    $('#content2').append($('<button>', {onclick: "cotacao.getCotacao('true')", html: 'Mais', class: 'btn right', style: 'margin-top:20px'}));
                if (status == 'ence')
                    $('#content3').append($('<button>', {onclick: "cotacao.getCotacao('ence')", html: 'Mais', class: 'btn right', style: 'margin-top:20px'}));



                xMenu(status);
            }
        });
    }

    function getCotadores(num_cotacao) {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getCotadores',
                class: 'Cotacao',
                param: {
                    num_cotacao: num_cotacao
                }
            },
            beforeSend: function (xhr) {
                $('.pnResultCotacao' + num_cotacao).html(load());
            },
            success: function (r) {
                var rep = {};
                var html = '<div class="row table" >' +
                        '<table>' +
                        '<tr>' +
                        '<th>Cotador</th>' +
                        '<th width="80" title="Cotadores que finalizou a Cotação">Finalizado <i class="fa fa-thumbs-o-up"></i></th>' +
                        '<th width="50" title="Página que os Cotadores visualiza" >Página</th>' +
                        '<th width="30" title="Itens Ganhos">Ganhos</th>' +
                        '<th width="70" title="Itens Ganhos">Valor</th>' +
                        '<th width="70" title="Itens que o Cotador informou o preço">Itens.Cotado</th>' +
                        '<th style="width:100px" title="Data de envio para Cotação"><i class="fa fa-envelope-o"></i> Cotação</th>' +
                        '<th style="width:100px" title="Data de envio para Pedido"><i class="fa fa-envelope-open"></i> Pedido</th>' +
                        '</tr>';
                $.each(r, function (i, ln) {

                    rep[ln.id_representante] = ln;
                    var dtFinalizacao = ln.finalizado == '0000-00-00' ? '' : util.dataBrasil(ln.finalizado);

                    //email enviado cotação
                    var emailRecebido = ln.email_recebido == '0000-00-00 00:00:00' ? ' <i class="fa fa-thumbs-down red-text text-darken-4"></i>' : ' <i class="fa fa-thumbs-o-up blue-text text-darken-4"></i>';
                    var envioEmail = ln.envio_email == '0000-00-00' ? '<i class="fa fa-paper-plane"></i>' : util.dataBrasil(ln.envio_email) + emailRecebido;

                    if (ln.email_recebido != '0000-00-00 00:00:00') {
                        var tituloEmail = 'Confirmado o Recebimento dia.: ' + util.dataTimeBrasil(ln.email_recebido);
                    } else {
                        var tituloEmail = 'e-mail ainda não confirmado';
                    }


                    var pedidoRecebido = ln.pedido_recebido == '0000-00-00 00:00:00' ? ' <i class="fa fa-thumbs-down red-text text-darken-4"></i>' : ' <i class="fa fa-thumbs-o-up blue-text text-darken-4"></i>';
                    var emailPedido = ln.email_pedido == '0000-00-00' ? '<i class="fa fa-paper-plane-o"></i>' : util.dataBrasil(ln.email_pedido) + pedidoRecebido;

                    if (ln.pedido_recebido != '0000-00-00 00:00:00') {
                        var tituloPedido = 'Confirmado o Recebimento dia.: ' + util.dataTimeBrasil(ln.pedido_recebido);
                    } else {
                        var tituloPedido = 'e-mail ainda não confirmado';
                    }



                    var qto = ln.qto == 0 ? '' : ln.qto;
                    var total = ln.total == null ? '' : util.formatValor(ln.total);
                    html +=
                            '<tr id="cot' + ln.id_representante + num_cotacao + '">' +
//                  '<td><a href="#!" class="btnPopMenuCotadores" onclick="cotacao.detalhamentoCotador(' + ln.id_representante + ')">' + ln.nome + '</a></td>' +
                            '<td><a href="#!" id_representante="' + ln.id_representante + '" num_cotacao="' + num_cotacao + '" id_cotadores="' + ln.id_cotadores + '" class="btnPopMenuCotadores">' + ln.nome + '</a></td>' +
                            '<td><div class="center-align">' + dtFinalizacao + '</div></td>' +
                            '<td><a href="cotadores/?id=' + ln.codigo_envio + '" target="_blank"><div class="center-align"><i class="fa fa-globe"></i></div></a></td>' +
                            '<td><div class="center-align">' + qto + '</div></td>' +
                            '<td><div class="right-align">' + total + '</div></td>' +
                            '<td><a onclick="cotacao.getProdutoPorCotador(' + num_cotacao + ',' + ln.id_cotadores + ',\'all\')" href="#!"><div class="center-align"><i class="fa fa-rss"></i></div></a></td>' +
                            '<td title="' + tituloEmail + '" onclick="cotacao.preEmail(' + ln.id_sociedade + ',' + ln.id_cotadores + ',\'' + ln.nome + '\',' + '\'Cotação\',' + ln.id_representante + ')" ><a href="#!"><div id="e-ct' + num_cotacao + ln.id_cotadores + '" class="center-align">' + envioEmail + '</div></a></td>' +
                            '<td title="' + tituloPedido + '" onclick="cotacao.preEmail(' + ln.id_sociedade + ',' + ln.id_cotadores + ',\'' + ln.nome + '\',' + '\'Pedido\',' + ln.id_representante + ')" ><a href="#!"><div id="e-pe' + num_cotacao + ln.id_cotadores + '" class="center-align">' + emailPedido + '</div></a></td>' +
                            '</tr>';

                });

                //title="' + tituloEmail + '" class="tooltip"
                html += '</table></div>';
                cotadores[num_cotacao] = rep;
                $('.pnResultCotacao' + num_cotacao).html(html);
            }
        });
    }

    function modalRepresentante() {
        $('#pnAddRepresentante').mofo({
            width: 650,
            height: 500,
            open: function () {
                $('.pnResultAddRep input').prop('checked', false);
                $('.pnResultAddRep input').attr("disabled", false);
                $.each(cotadores[numCotacao], function (i, ln) {
                    $('#cbCotador' + ln.id_representante).attr("disabled", true);
                    $('#cbCotador' + ln.id_representante).prop('checked', true);
                });
            },
            buttons: {
                'Adicionar': function () {
                    insertCotadores();
                },
                'Cancelar': function () {
                    $('#pnAddRepresentante').mofo('close');
                }
            }

        });
    }

    function getRepresentante() {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getRepresentante',
                class: 'Cotacao'
            },
            success: function (r) {
                var html = '<table id="tbRepres">' +
                        '<tr>' +
                        '<th style="width: 5%" ><i class="fa fa-plus"></th>' +
                        '<th style="width: 50%">Cotadores</th>' +
                        '<th style="width: 45%">E-Mail</th>' +
                        '</tr>';
                $.each(r, function (i, ln) {
                    html += '<tr>' +
                            '<td><input type="checkbox" name="cbCotador" id="cbCotador' + ln.id_representante + '" value="' + ln.id_representante + '"></td>' +
                            '<td><label class="x-label" for="cbCotador' + ln.id_representante + '">' + ln.nome + '</label></td>' +
                            '<td>' + ln.email + '</td>' +
                            '</tr>';
                });
                html += '</table>';
                $('.pnResultAddRep').html(html);
            }
        });
    }

    function deleteCotacao() {

        confirmaCodigo({
            msg: 'Gostaria de deletar a cotação de numero.: ' + numCotacao,
            call: function () {
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'deleteCotacao',
                        class: 'Cotacao',
                        param: {
                            num_cotacao: numCotacao
                        }
                    },
                    success: function (r) {
                        if (r.msg == 'ok') {
                            $('#pnCotacao' + numCotacao).addClass('animated fadeOutLeftBig');
                            setTimeout(function () {
                                $('#pnCotacao' + numCotacao).remove();
                            }, 600);
                        }

                        if (r.msg == 'erro') {
                            show('Erro ao deletar a debolução.');
                        }

                    }
                });
            }
        })


    }

    function insertCotacao(marca, id_sociedade, id_compras, sira) {

        confirma({msg: 'Gostaria de Trasforma esta compra em uma cotação?',
            call: function () {
                if ($('#edtData').val() == '') {
                    show({msg: 'Data Finalização não foi preenchida', close: function () {
                            $('#edtData').focus();
                        }});
                    return false;
                }

                aguarde();
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'insertCotacao',
                        class: 'Cotacao',
                        param: {
                            marca: marca,
                            finalizacao: util.dataUSA($('#edtData').val()),
                            id_sociedade: id_sociedade,
                            id_compras: id_compras,
                            sira: sira
                        }
                    },
                    success: function (r) {
                        aguarde('close');
                        if (r.erro) {
                            show(r.erro);
                            return false;
                        }
                        $('#pnNovaCotacao').mofo('close');
                        getCotacao('false');
                    }
                });
            }});
    }

    function getProdutoCotacao() {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getProdutoCotacao',
                class: 'Cotacao',
                param: {
                    num_cotacao: numCotacao
                }
            },
            beforeSend: function (xhr) {
                $('#pnResultPC').html(load());

                $('#pnProdutoCotacao').mofo({
                    height: 400,
                    width: 700
                });
            },
            success: function (r) {
                var html = '<table>' +
                        '<tr>' +
                        '<th colspan="6" class="first last">Itens da Cotação</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th width="90" class="first">Nº Fabricante</th>' +
                        '<th width="74">Nº Fab 2</th>' +
                        '<th width="295">Descrição Produto</th>' +
                        '<th width="112">Carro</th>' +
                        '<th width="77" class="last">Quant</th>' +
                        '</tr>';
                $.each(r, function (i, ln) {
                    html += '<tr>' +
                            '<td class="first"><div align="left">' + ln.num_fabricante + '</div></td>' +
                            '<td>' + ln.num_fabricante2 + '&nbsp;</td>' +
                            '<td><div align="left">' + ln.desc_produto + '</div></td>' +
                            '<td><div align="left">' + ln.carro + '</div></td>' +
                            '<td class="last">' + ln.qto + '</td>' +
                            '</tr>';
                });
                html += '</table>';
                $('#pnResultPC').html(html);
            }
        });
    }

    function insertCotadores() {

        var frm = $('#frmRepres').serializeArray();
        if (frm.length == 0) {
            show('Selecione um Cotador para continuar');
            return false;
        }

        aguarde();
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'insertCotadores',
                class: 'Cotacao',
                param: {
                    frm: frm,
                    num_cotacao: numCotacao
                }
            },
            success: function (r) {
                aguarde('close');
                if (r.erro) {
                    show(r.erro);
                    return false;
                }

                console.log(r);
                getCotadores(r.num_cotacao);
                $('#pnAddRepresentante').mofo('close');
            }
        });
        // $('#frmRepres').serialize());
    }

    function resumoCotacao() {

        function resumo() {

            var dadosCotadores = new Array();
            $.each(cotadores[numCotacao], function (i, ln) {
                dadosCotadores.push({'id_cotadores': ln.id_cotadores, id: i});
            });
            console.log(dadosCotadores.length);
            if (dadosCotadores.length > 0) {
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'getTotalItensCotados',
                        class: 'Cotacao',
                        param: {
                            num_cotacao: numCotacao,
                            dadosCotadores: dadosCotadores
                        }
                    },
                    beforeSend: function (xhr) {
                        $('#pnResultRC').html(load());
                        $('#grafico').html('');
                    },
                    success: function (r) {
                        $.each(r, function (i, ln) {
                            cotadores[numCotacao][ln.id]['c_total'] = ln.c_total;
                            cotadores[numCotacao][ln.id]['c_qto'] = ln.c_qto;
                        });
                        conteudoHTML();
                    }

                });
            } else {
                $('#pnResultRC').html('<div class="center-align">Sem cotadores</div>');
            }



        }

        function conteudoHTML() {
            var html = '<table>' +
                    '<tr>' +
                    '<th>Representada</th>' +
                    '<th width="80">Itens Cotado</th>' +
                    '<th width="90">Valor Cotado</th>' +
                    '<th width="80">Itens Ganhos</th>' +
                    '<th width="100">Valor Ganhos</th>' +
                    '</tr>';
            var itensGanhos = 0;
            var valorGanho = 0;
            var c_itensGanhos = 0;
            var c_valorGanho = 0;
            var dados = new Array();
            $.each(cotadores[numCotacao], function (i, ln) {

                itensGanhos += parseInt(ln.qto);
                valorGanho += parseFloat(ln.total == null ? 0 : ln.total);
                var qto = ln.qto == 0 ? '' : ln.qto;
                var total = ln.total == null ? '' : util.formatValor(ln.total);
                c_itensGanhos += parseInt(ln.c_qto);
                c_valorGanho += parseFloat(ln.c_total == null ? 0 : ln.c_total);
                var c_qto = ln.c_qto == 0 ? '' : ln.c_qto;
                var c_total = ln.c_total == null ? '' : util.formatValor(ln.c_total);
                html += '<tr>' +
                        '<td>' + ln.nome + '</td>' +
                        '<td><div class="center-align">' + c_qto + '</div></td>' +
                        '<td><div class="right-align">' + c_total + '</div></td>' +
                        '<td><div class="center-align">' + qto + '</div></td>' +
                        '<td><div class="right-align">' + total + '</div></td>' +
                        '</tr>';
                if (ln.qto != 0)
                    dados.push({y: ln.qto, name: ln.nome});
            });
            html += '<tr>' +
                    '<td><div class="right-align"><label>Totalizador</label></div></td>' +
                    '<td><div class="center-align"><label>' + c_itensGanhos + '</label></div></td>' +
                    '<td><div class="right-align"><label>' + util.formatValor(c_valorGanho) + '</label></div></td>' +
                    '<td><div class="center-align"><label>' + itensGanhos + '</label></div></td>' +
                    '<td><div class="right-align"><label>' + util.formatValor(valorGanho) + '</label></div></td>' +
                    '</tr>' +
                    '</table>';
            $('#pnResultRC').html(html);
            var chart = new CanvasJS.Chart("grafico",
                    {
                        animationEnabled: true,
                        data: [{
                                type: "pie",
//                    indexLabel: "{name} {y}%",
                                indexLabel: "{name}",
                                dataPoints: dados

                            }
                        ]
                    });
            chart.render();
        }



        $('#pnResumoCotacao').mofo({
            width: 750,
            height: 560,
            title: "Resumo da Cotação Nº.: " + numCotacao,
            open: function () {
                resumo();
            }
        });
    }

    function getProdutoPorCotador(num_cotacao, id_cotadores, tipo) {

        $('#pnItensCotadosCotadores').mofo({
            width: 750,
            height: 600,
            title: 'Itens cotados N' + num_cotacao
        });
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getProdutoPorCotador',
                class: 'Cotacao',
                param: {
                    num_cotacao: num_cotacao,
                    id_cotadores: id_cotadores,
                    tipo: tipo
                }
            },
            beforeSend: function (xhr) {
                $('#pnResultICC').html(load());
            },
            success: function (r) {
                var html = '';
                if (tipo == 'all')
                    html = '<div class="center-align"> Todos os itens Cotados </div>';
                else
                    html = '<div class="center-align"> Somente os Itens Ganhos </div>';
                html += '<table>' +
                        '<tr>' +
                        '<th colspan="6" >Itens Orçamento</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th width="80">Nº Fabricante</th>' +
                        '<th width="70">Nº Fab 2</th>' +
                        '<th>Descrição Produto</th>' +
                        '<th width="112">Carro</th>' +
                        '<th width="50" class="last">Quant</th>' +
                        '<th width="70" class="last">Valor</th>' +
                        '</tr>';
                $.each(r, function (i, ln) {
                    html += '<tr>' +
                            '<td>' + ln.num_fabricante + '</div></td>' +
                            '<td>' + ln.num_fabricante2 + '&nbsp;</td>' +
                            '<td>' + ln.desc_produto + '</div></td>' +
                            '<td>' + ln.carro + '</div></td>' +
                            '<td><div class="center-align">' + ln.qto + '</div></td>' +
                            '<td><div class="right-align">' + util.formatValor(ln.valor) + '</div></td>' +
                            '</tr>';
                });
                html += '</table>';
                $('#pnResultICC').html(html);
            }

        });
    }

    function retirarCotador(num_cotacao, id_representante) {

        confirmaCodigo({msg: 'Gostaria de retirar este Cotador da cotacao?',
            call: function () {
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'retirarCotador',
                        class: 'Cotacao',
                        param: {
                            num_cotacao: num_cotacao,
                            id_representante: id_representante
                        }
                    },
                    success: function (r) {
                        if (r.erro) {
                            show(r.erro);
                            return false;
                        }

                        $('#cot' + id_representante + num_cotacao).addClass('animated fadeOutLeftBig');
                        delete cotadores[num_cotacao][id_representante];
                        setTimeout(function () {
                            $('#cot' + id_representante + num_cotacao).remove();
                        }, 600);
                    }
                });
            }});
    }

    function updateStatusCotacao(status) {
        if (status == 'true')
            var msg = 'Gostaria de Fechar esta cotação?';
        if (status == 'false')
            var msg = 'Gostaria de Re-Abrir a cotação?';
        if (status == 'ence')
            var msg = 'Gostaria de Encerrar esta cotação?';
        confirma({msg: msg,
            call: function () {
                $.ajax({
                    url: 'cotacao/per.cotacao.mysql.php',
                    data: {
                        call: 'updateStatusCotacao',
                        class: 'Cotacao',
                        param: {
                            num_cotacao: numCotacao,
                            status: status
                        }
                    },
                    beforeSend: function (xhr) {
                        aguarde('Aguarde estamos finalizado essa cotação, e tranferindo ele para a loja de origen');
                    },
                    success: function (r) {
                        aguarde('close')
                        if (r.erro) {
                            show(r.erro);
                            return false;
                        }
                        $('#pnCotacao' + numCotacao).addClass('animated zoomOutUp');
                        $('#pnCotacao' + numCotacao).animate({
                            opacity: 0
                        }, 900, function () {
                            $(this).remove();
                        });
                    }
                });
            }});
    }

    function preEmail(id_sociedade, id_cotadores, nome, tipo, id_representante) {

        $('#edtObs').val(dadosOBS);

        $('#edtDe').html(login.email);
        $('#edtPara').html(nome);
        $('#edtAssunto').html(tipo);
        $('#pnSEinfo').html('Gostaria de enviar um e-mail de <b>' + tipo.toUpperCase() + '</b> para o(a) <b>' + nome);

        if (tipo.toUpperCase() == 'PEDIDO')
            $('#pnTransportadora').css('display', 'block');
        else
            $('#pnTransportadora').css('display', 'none');

        $('#pnSendEmail').mofo({
            width: 650,
            height: 410,
            title: 'E-mail',
            buttons: {
                Btn: {
                    html: '<i class="fa fa-send"></i> Enviar',
                    click: function () {
                        sendEmail(id_sociedade, id_cotadores, tipo, $('#edtObs').val(), id_representante);
                    },
                    style: 'font-size:14px; width: 100px;height: 30px;'
                }
            },
            close: function () {
                $('#pnSendEmail').mofo('destroy');
            }
        });
    }

    function sendEmail(id_sociedade, id_cotadores, assunto, obs, id_representante) {
        var traportadora = {cnpj: '', nome: '', tel: ''};

        if (assunto.toUpperCase() == 'PEDIDO')
            if ($('#slTransp').val() != '0') {
                traportadora.nome = $('#slTransp').val();
                traportadora.cnpj = $('#slTransp option:selected').attr('cnpj');
                traportadora.tel = $('#slTransp option:selected').attr('tel');
                obs = obs + ' ' + traportadora.nome + '<br>' + traportadora.cnpj + '<br>' + traportadora.tel + '<br>';
            }

        aguarde();
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'sendEmail',
                class: 'Cotacao',
                param: {
                    id_sociedade: id_sociedade,
                    id_cotadores: id_cotadores,
                    emailComprador: login.email,
                    nome: login.nome,
                    obs: obs,
                    assunto: assunto,
                    id_representante: id_representante
                }
            },
            success: function (r) {
                dadosOBS = obs;
                aguarde('close');
                if (r.erro) {
                    show(r.erro);
                    return false;
                }

                $('#pnSendEmail').mofo('close');
                $('#' + r.ok).html(dataAtualBR);
            }
        });
    }

    return {
        getCotacao: getCotacao,
        getCotadores: getCotadores,
        getRepresentante: getRepresentante,
        modalRepresentante: modalRepresentante,
        deleteCotacao: deleteCotacao,
        insertCotacao: insertCotacao,
        getProdutoCotacao: getProdutoCotacao,
        insertCotadores: insertCotadores,
        resumoCotacao: resumoCotacao,
        getProdutoPorCotador: getProdutoPorCotador,
        retirarCotador: retirarCotador,
        updateStatusCotacao: updateStatusCotacao,
        preEmail: preEmail,
        clearLimit: clearLimit,
        tranferirLoja: tranferirLoja
//    sendPedido: sendPedido

    };
})();

var novaCotacao = (function () {

    function modal() {
        $('#pnNovaCotacao').mofo({
            height: 400,
            width: 700,
            open: function () {
                $('#SelectLoja').chosen();
                $("#edtData").datepicker("option", "minDate", dataAtualBR);
            }
        });
    }

    function getLojas() {
        $.ajax({
            type: 'POST',
            dataType: 'html',
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getLojas',
                class: 'Cotacao'
            },
            success: function (r) {
                $('#pnLojas').html('<span>Lojas</span><br>' + r);
            }

        });
    }

    function getPedido(numPedido, id_sociedade) {

        if (numPedido == '') {
            show('Nº pedido não informado, verifique');
            return false;
        }
        if (id_sociedade == '0' || id_sociedade == undefined) {
            show('Selecione uma loja');
            return false;
        }

        console.log(id_sociedade);
        if (id_sociedade == 'sira') {
            getPedidoSira(numPedido);
        } else {
            getPedidoLoja(numPedido, id_sociedade);
        }
    }

    function getPedidoSira(numPedido) {
        $.ajax({
            url: 'cotacao/per.cotacao.mysql.php',
            data: {
                call: 'getPedidoSira',
                class: 'Cotacao',
                param: {
                    id_sira_compras: numPedido
                }
            },
            beforeSend: function (xhr) {
                $('#btnGetPedido').html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
            },
            success: function (r) {
                $('#btnGetPedido').html('<i class="fa fa-search"></i>');
                $('.table-ll').remove();
                if (r[0] == undefined) {
                    show('Nem um pedido localizado');
                    return false;
                }

                $('#pnResultGetPedito table').append(
                        '<tr class="dados odd-row table-ll">' +
                        '<td class="first"><div align="left">' + r[0].id_sira_compras + '</div></td>' +
                        '<td><div align="left" id="pnMarca">' + r[0].id_marca + '</div></td>' +
                        '<td><div align="left">' + r[0].comprador + '</div></td>' +
                        '<td>' + util.dataBrasil(r[0].data) + '</td>' +
                        '<td>' + util.formatValor(r[0].valor) + '</td>' +
                        '<td class="last"><button onclick="cotacao.insertCotacao(' + r[0].id_marca + ',' + r[0].id_sociedade + ',' + r[0].id_sira_compras + ',\'sim\')" ' +
                        'class="btn waves-effect waves-light blue-grey darken-2" id="btnTranferir">Trans. Cotação</button></td>' +
                        '</tr>');
            }


        });
    }

    function getPedidoLoja(numPedido, id_sociedade) {
        $.ajax({
            url: 'cotacao/per.cotacao.firebird.php',
            data: {
                call: 'getPedido',
                class: 'Cotacao',
                id_sociedade: id_sociedade,
                param: {
                    id_compras: numPedido
                }
            },
            beforeSend: function (xhr) {
                $('#btnGetPedido').html('<i class="fa fa-spinner fa-spin fa-fw"></i>');
            },
            success: function (r) {
                $('#btnGetPedido').html('<i class="fa fa-search"></i>');
                $('.table-ll').remove();
                if (r[0] == undefined) {
                    show('Nem um pedido localizado');
                    return false;
                }


                $('#pnResultGetPedito table').append(
                        '<tr class="dados odd-row table-ll">' +
                        '<td class="first"><div align="left">' + r[0].ID_COMPRAS + '</div></td>' +
                        '<td><div align="left" id="pnMarca">' + r[0].MARCA + '</div></td>' +
                        '<td><div align="left">' + r[0].COMPRADOR + '</div></td>' +
                        '<td>' + util.dataBrasil(r[0].DATA) + '</td>' +
                        '<td>' + util.formatValor(r[0].VALOR) + '</td>' +
                        '<td class="last"><button onclick="cotacao.insertCotacao(\'' + r[0].MARCA + '\',' + id_sociedade + ',' + r[0].ID_COMPRAS + ',\'nao\')" ' +
                        'class="btn waves-effect waves-light blue-grey darken-2" id="btnTranferir">Trans. Cotação</button></td>' +
                        '</tr>');
            }

        });
    }


    $(document).on('keydown', '#edtNumPedido', function (e) {
        if (e.keyCode == 13)
            getPedido($('#edtNumPedido').val(), $('#SelectLoja').val());
    });
    $(document).on('click', '#btnGetPedido', function () {
        getPedido($('#edtNumPedido').val(), $('#SelectLoja').val());
    });
    return {
        modal: modal,
        getLojas: getLojas,
        getPedido: getPedido
    };
})();


function getTransportadora() {
    $.ajax({
        url: 'cotacao/per.cotacao.firebird.php',
        data: {
            call: 'getTrasnportadora',
            class: 'Cotacao',
            id_sociedade: '10'
        },
        success: function (r) {

            var html = 'Transportadora.: <select id="slTransp">';
            html += '<option value="0">Selecione uma Transportadora</option>';

            $.each(r, function (i, ln) {
                html += '<option cnpj="' + ln.CGC_TRANSPORTADORA + '" tel="' + ln.TELEFONE1 + '" >' + ln.RAZAO_SOCIAL + '</option>';
            });
            html += '</select>';

            $('#pnTransportadora').html(html);
        }

    });
}

//function load() {
//    return '<div class="center"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>';
//}

function filtroRepresentante() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("edtLocCotador");
    filter = input.value.toUpperCase();
    table = document.getElementById("tbRepres");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


function PrintDivHTML(html, btn) {

    var contents = html;
    if ($.trim(contents) === '') {
        btn.html('<i class="fa fa-exclamation-triangle fa-lg"></i> Sem Conteudo').attr('disabled', '');
        setTimeout(function () {
            btn.html('<i class="fa fa-print"></i>Imprimir').removeAttr('disabled');
        }, 3000);
        return false;
    }

    btn.html('<i class="fa fa-spinner fa-pulse fa-lg"></i> Aguarde').attr('disabled', '');
    var frameXico = $('<iframe/>');
    frameXico[0].name = "frameXico";
    frameXico.css({"position": "absolute", "top": "-1000000px"});
    $("body").append(frameXico);
    var frameDoc = frameXico[0].contentWindow ? frameXico[0].contentWindow
            : frameXico[0].contentDocument.document ? frameXico[0].contentDocument.document
            : frameXico[0].contentDocument;
    frameDoc.document.open();
    //Create a new HTML document.
    frameDoc.document.write('<html><head><title>Impressão de Documento</title>');

    frameDoc.document.write('<link href="../css/index.css" rel="stylesheet" type="text/css"/>');
    frameDoc.document.write('</head><body>');

    //Append the external CSS file.
//  frameDoc.document.write('<link href="css/styles.css" rel="stylesheet" type="text/css" />');
//  frameDoc.document.write('<link href="superClass/print/hide_element_print.css" rel="stylesheet" type="text/css" />');

    //Append the DIV contents.
    //Adiciona o Primeiro Cabecao

    //*frameDoc.document.write(cabecalho());

    //adiciona o conteudo html e se tiver a tag {CABECALHO} ele subistitu por cabecalho();
    //* frameDoc.document.write(contents.split('{CABECALHO}').join(cabecalho()));
    frameDoc.document.write(contents);
    //  frameDoc.document.write(contents);

    frameDoc.document.write('</body></html>');
    frameDoc.document.close();
    setTimeout(function () {
        window.frames["frameXico"].focus();
        window.frames["frameXico"].print();
        frameXico.remove();
        btn.html('<i class="fa fa-print"></i> Imprimir').removeAttr('disabled');
    }, 300);
    return false;
}


function cabecalho() {
    return '<table width="100%" class="tbTitulo">' +
            '<tr>' +
            '<td rowspan="4" style="width: 150px;"><img src="../img/REAL_LOGO.png" width="155" alt=""/></td>' +
            '<td colspan="3" style="font-weight: bold" >' + dados.loja.razao_social + '</td>' +
            '<td style="width: 150px;"></td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="3">' + dados.loja.endereco + '</td>' +
            '<td>' + dados.loja.cnjp + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Cidade.: ' + dados.loja.cidade + '</td>' +
            '<td>Bairro.: ' + dados.loja.bairro + '</td>' +
            '<td>CEP.: ' + dados.loja.cep + '</td>' +
            '<td>' + dados.loja.incricao + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>Telefone.: ' + dados.loja.telefone + '</td>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '</tr>' +
            '<tr>' +
            '<td colspan="5" align="center" style="border-top: 1px solid"><div class="titulos">Cotação Nº ' + dados.cotacao.num_cotacao + '</div></td>' +
            '</tr>' +
            '</table>';
}
