$.ajaxSetup({
    type: 'POST',
    dataType: 'json',
    data: {
        class: 'Cotadores'
    },
    url: 'per.cotadores.php'
});

var URL_getFoto = 'http://www.reallatas.com.br/_serverAPP/thumb.php?img=http://www.reallatas.com.br/balcao/foto/';
var urlServerFoto = 'http://www.reallatas.com.br/balcao/';
var gridProduto;
var dados = {};
var inputList;
var controleValor = 0;

$(function () {
    $('.real').maskMoney({thousands: '.', decimal: ','});

    cotadores.getCotacao(id);

    //cotadores.confimaCotacao(id);

    $('#btnImprimir').click(function () {
        PrintDivHTML($('#content2').html(), $(this));
    });

    $('#btnLoja').click(function () {
        $('#pnDadosLoja').mofo({
            title: 'Dados da Empresa',
            height: 150,
            width: 750
        });
    });

    $('#btnSobreMeu').click(function () {
        $('#pnSobreMeuCodigo').mofo({
            width: 480,
            height: 200,
            title: 'Sobre meu código',
            buttons: {
                Fechar: function () {
                    $('#pnSobreMeuCodigo').mofo('close');
                }
            }
        })
    });



//    $(document).on('keydown', '#btnValor', function (e) {
//        alert('00000');
//        if (e.keyCode == 13) {
//            alert('33333333');
//            cotadores.updateValor(gridProduto.dataSource().COD_PRODUTO, $('#btnValor').val());
//            $('#pnQto').mofo('close');
//
//        }
//    });
//    $(document).on('click', '#btnUpValor', function (e) {
//        // alert('asdf');
//        cotadores.updateValor(gridProduto.dataSource().COD_PRODUTO, $('#btnValor').val());
//        $('#pnQto').mofo('close');
//    });


    //Grid
    $('#tab1').click(function () {
        //  gridProduto.create(dados.produtos);
    });

    //Lista
    $('#tab2').click(function () {
        //  cotadores.tableList(dados.produtos);
    });

    $(document).on('keydown', '.edtValorCT', function (e) {
        if (e.keyCode === 38) {
            if (inputList.index(this) > 0) {
                var prior = inputList.eq(inputList.index(this) - 1);
                if (prior.length)
                    prior.focus().select();
            }
            return false;

        }
        if (e.keyCode === 13 || e.keyCode === 40) {
            var next = inputList.eq(inputList.index(this) + 1);
            console.log(next.length);
            if (next.length)
                next.focus().select();
//            else
//                cotadores.updateValor($(this).attr('cod_produto'), $(this).val(), $(this));

            return false;
        }
    });


    $(document).on('focusin', '.edtValorCT', function (e) {
        controleValor = $(this).val() == '' ? '0,00' : $(this).val();
    });

    $(document).on('blur', '.edtValorCT', function (e) {
        var v = $(this).val() == '' ? '0,00' : $(this).val();

        if (controleValor != v)
            cotadores.updateValor($(this).attr('cod_produto'), $(this).val(), $(this));
    });


    //open MenuPop
    $(document).on('click', '.btnOpcao', function (e) {
        $('#popOpcao').css({top: e.clientY, left: e.clientX - 250}).show().addClass('animated flipInX');
    });


    //close MenuPop
    $(document).click(function (e) {
        if (!e.target.matches('.btnOpcao')) {

            $('#popOpcao').addClass('animated flipOutX');
            setTimeout(function () {
                $('#popOpcao').hide();
                $('#popOpcao').removeClass('flipOutX flipOutX');
            }, 400);
        }

    });


});


var cotadores = (function () {
    var controlTableList = false;
    var tempo_espera;
    var tempoDeVidaFoto = Math.random();

    function picture(value) {
        if ($.trim(value) === 'F') {
            return '<i class="fa fa-camera corMenu"></i>';
        } else
            return value;
    }

    gridProduto = new xGrid({
        id: '#pnGrid',
        count: true,
        height: 300,
        lineFocus: 0,
        theme: 'x-gray',
        columns: {
            'Meu Código': {dataField: 'meu_codigo', width: '10%'},
            'Nº Fabr.': {dataField: 'num_fabricante', width: '10%'},
            'Nº Fabr2': {dataField: 'num_fabricante2', width: '10%'},
            '<i class="fa fa-camera corMenu"></i>': {dataField: 'foto', width: '3%', render: picture},
            'Descrição Produto': {dataField: 'desc_produto'},
            'Carro': {dataField: 'carro', width: '15%'},
            'Qto': {dataField: 'qto', width: '5%', style: 'text-align:center'},
            'Valor': {dataField: 'valor', width: '8%', render: util.formatValor, style: 'text-align:right'}
        },
        onSelectLine: onSelectLine,
        sideBySide: {
            id: '.sbsProduto'
        },
        keyDown: {
            'enter': {
                key: 13,
                call: function (r) {
                    console.log(r);
                    modalQto();
                }
            }
        }
    });


    function modalQto() {


        $('#pnQto').mofo({
            title: 'Produto',
            height: 150,
            width: 300,
            open: function () {
                var margin = $('#pnPrincipal').css('margin-right').replace('px', '');
                margin = parseInt(margin) + parseInt(160);
                $('#pnQto').css('left', 'calc(100% - ' + margin + 'px)');
                $('#pnQto').css('top', '280px');
                $('#btnValor').val(util.formatValor(gridProduto.dataSource().valor));
                setTimeout(function () {
                    $('#btnValor').focus().select();
                }, 100);

            },
            close: function () {
                gridProduto.focus();
            }
        });


    }


    function onSelectLine(r) {

        clearTimeout(tempo_espera);
        //  clearTimeout(tempoCarroProduto);

        //   if (r.FOTO === 'F') {
        tempo_espera = setTimeout(function () {
            $('#pnFotoProduto').css({
                'background-image': "url('" + URL_getFoto + r.cod_produto + ".jpg?" + tempoDeVidaFoto + "')"
            }).attr('codProduto', r.cod_produto);
        }, 400);
        //  } else {
        //     $('#pnFotoProduto').css({'background-image': ""}).attr('codProduto', '');
        //  }

//    tempoCarroProduto = setTimeout(function () {
//      if (r.cod_produto !== null)
//        carroVenda.getCarroVenda(r.COD_PRODUTO);
//    }, 500);

    }


    function getCotacao(id) {
        $.ajax({
            data: {
                call: 'getCotacao',
                param: {
                    id: id
                }
            },
            beforeSend: function (xhr) {
                $('#pnGrid').html(load());
            },
            success: function (r) {
                $('#pnGrid').html('');
                dados = r;
                //  console.log(r);
                dadosEmpresa(r.loja);

                $('#pnLoja').html('Finaliza em ' + util.dataBrasil(r.cotacao.finalizacao) + '  <a class="btn waves-effect waves-light blue-grey darken-2" href="#!">' + r.loja.razao_social + '</a>  Nº Cotação ' + r.cotacao.num_cotacao);

                tableList(r.produtos);

                gridProduto.create(r.produtos);
                // gridProduto.focus();

            }
        });
    }


    function dadosEmpresa(loja) {
        $('#dtNome').html(loja.razao_social);
        $('#dtBairro').html(loja.bairro);
        $('#dtCNPJ').html(loja.cnjp);
        $('#dtCep').html(loja.cep);
        $('#dtCidade').html(loja.cidade);
        $('#dtEndereco').html(loja.endereco);
        $('#dtInscricao').html(loja.incricao);
    }


    function tableList(produtos) {

//        if (controlTableList)
//            return false;
//
//        controlTableList = true;
        $('#pnLista').html(load());

        var html = '<table>' +
                '<tr>' +
                '<th colspan="7">Itens da cotação</th>' +
                '</tr>' +
                '<tr>' +
                '<th style="width: 80px">Meu Código</th>' +
                '<th style="width: 80px">Nº Fabricante</th>' +
//                '<th style="width: 80px">Nº Fab 2</th>' +
                '<th>Descrição Produto</th>' +
                '<th style="width: 80px">Carro</th>' +
                '<th style="width: 60px" >Quant</th>' +
                '<th style="width: 80px" >Valor</th>' +
                '</tr>';

        $.each(produtos, function (i, ln) {
            if (ln.meu_codigo != null)
                console.log(ln.meu_codigo);

            html += '<tr>';
            if (ln.meu_codigo != null)
                html += '<td><div class="right-align"><a href="#!" id="cp' + ln.cod_produto + '" cod_produto="' + ln.cod_produto + '" codigo="' + ln.meu_codigo + '" class="btnMeuCodigo">' + ln.meu_codigo + '</a></div></td>';
            else
                html += '<td><div class="center-align"><a href="#!" id="cp' + ln.cod_produto + '" cod_produto="' + ln.cod_produto + '" codigo="" class="btnMeuCodigo"><i style="font-size:21px!important" class="fa fa-plus-circle"></i></a></div></td>';

            html += '<td><div class="right-align">' + ln.num_fabricante + '</div></td>' +
//                    '<td>' + ln.num_fabricante2 + '&nbsp;</td>' +
                    '<td>' + ln.desc_produto + '</td>' +
                    '<td><div class="center-align">' + ln.carro + '</div></td>' +
                    '<td><div class="center-align">' + ln.qto + '</div></td>';
            if (dados.cotacao.status == 'true' || dados.cotacao.status == 'ence')
                html += '<td><div class="right-align">' + util.formatValor(ln.valor) + '</div></td>';

            if (dados.cotacao.status == 'false')
                html += '<td><div class="right-align"><input cod_produto="' + ln.cod_produto + '" value="' + util.formatValor(ln.valor) + '" class="edtValorCT real" style="width: 80px !important;" type="text"></div></td>';

            html += '</tr>';
        });

        html += '</table>';

        $('#pnLista').html(html);
        inputList = $('#pnLista').find('input');

        $('.real').maskMoney({thousands: '.', decimal: ','});

    }


    function updateValor(cod_produto, valor, elemento) {
        $.ajax({
            data: {
                call: 'updateValor',
                param: {
                    ID_COTADORES: dados.cotacao.id_cotadores,
                    NUM_COTACAO: dados.cotacao.num_cotacao,
                    COD_PRODUTO: cod_produto,
                    VALOR: util.formatValorUSA(valor)
                }
            },
            beforeSend: function (xhr) {
                if (elemento != undefined)
                    elemento.addClass('load');

                // $('#pnGrid').html(load());
            },
            success: function (r) {
                //  if (deOnde == 'grid') {
                //gridProduto.dataSource({valor: util.formatValorUSA(valor)});
                if (elemento != undefined)
                    elemento.removeClass('load');
                //   }

            }
        });

    }


    function finalizarCotacao() {
        confirma({
            msg: 'Gostaria de finalizar a cotação?',
            call: function () {
                $.ajax({
                    data: {
                        call: 'finalizarCotacao',
                        param: {
                            id_cotadores: dados.cotacao.id_cotadores
                        }
                    },
                    success: function (r) {
                        show('Cotação enviada com sucesso');
                    }
                });
            }
        })



    }


    return {
        getCotacao: getCotacao,
        tableList: tableList,
        updateValor: updateValor,
        finalizarCotacao: finalizarCotacao,
        // confimaCotacao: confimaCotacao
    };
})();


var meuCodigo = (function () {
    var codProduto;

    function modal() {
        $('#pnModalMeuCodigo').mofo({
            width: 250,
            height: 140,
            title: 'Código Fornecedor',
            buttons: {
                Fechar: function () {
                    $('#pnModalMeuCodigo').mofo('close');
                },
                Salvar: {
                    html: '<i class="fa fa-floppy-o"></i> Salvar',
                    click: function () {
                        gerenciarMeuCodigo();
                    },
                    class: 'mofo-btn mofo-btn-foot'
                }
            },
            open: function () {
                $('#edtMeuCodigo').focus().select();
            },
            keyDown: {
                enter: {
                    key: 13,
                    call: function () {
                        $('#pnModalMeuCodigo').mofo('click', '2');

                    }
                }
            }

        });
    }


    function gerenciarMeuCodigo() {
        var meuCodigo = $('#edtMeuCodigo').val();
        $.ajax({
            data: {
                call: 'gerenciarMeuCodigo',
                param: {
                    id_representante: dados.cotacao.id_representante,
                    cod_produto: codProduto,
                    meu_codigo: meuCodigo
                }
            },
            beforeSend: function (xhr) {
                $('#cp' + codProduto).html('<img src="../img/salvando.gif"/>');
                $('#pnModalMeuCodigo').mofo('close');
            },
            success: function (r) {
                if (r.erro) {
                    show(r.erro);
                    return false;
                }

                $('#cp' + r.cod_produto).html(meuCodigo);
                $('#cp' + r.cod_produto).attr('codigo', meuCodigo);

            }
        });

    }


    $(document).on('click', '.btnMeuCodigo', function () {
        codProduto = $(this).attr('cod_produto');
        var codigo = $(this).attr('codigo');
        $('#edtMeuCodigo').val(codigo);

        modal();
    });


    return {

    }
})();


function load() {
    return '<div class="center"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>';
}


var foto = (function () {
    var itensFotos = [];
    var controlClick = true;

    function openPhotoSwipe() {
        var pswpElement = document.querySelectorAll('.pswp')[0];

        var options = {
            history: true,
            focus: true,
            showAnimationDuration: 0,
            hideAnimationDuration: 0,
            bgOpacity: 0.7
        };

        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, itensFotos, options);

        gallery.init();

        gallery.listen('close', function () {
            setTimeout(function () {
                gridProduto.focus();
            }, 100);
        });
    }


    function getFotos(codProduto, foto) {

//
//    if ($.trim(foto) !== 'F')
//      return false;
//
//    if (codProduto === undefined)
//      return false;

        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: urlServerFoto + "getListaFotoJson.php",
            data: {img: codProduto},
            beforeSend: function (xhr) {
                $('#pnFotoProduto').html('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> <div class="bgImagem"></div>');
            },
            success: function (r) {
                controlClick = true;
                $('#pnFotoProduto').html('');
                successMobile(r);
            }
        });


        function successMobile(r) {
            itensFotos = [];
            $.each(r, function (i, ln) {
                var item = {
                    src: urlServerFoto + 'foto/' + ln.foto,
                    w: (ln.w * 50) / 100 + ln.w,
                    h: (ln.h * 50) / 100 + ln.h,
                    title: '<div class="row">' +
                            '<div class="col s4 font-9 truncate">' + ln.loja + '</div>' +
                            '<div class="col s4 font-9 center-align">' + ln.nome + '</div>' +
                            '<div class="col s4 font-9 right-align">' + ln.publicacao + '</div></div>'
                };
                itensFotos.push(item);
            });
            openPhotoSwipe();
        }

    }
//esse codigo tem um foto do xico (39165)

    $(document).on('click', '#pnFotoProduto', function () {
        if (controlClick)
            getFotos(gridProduto.dataSource().cod_produto, 'F');
        controlClick = false;
    });


    return{
        getFotos: getFotos
    };
})();


function PrintDivHTML(html, btn) {

    var contents = html.replace(/0,00/g, '');
    ;

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
    frameDoc.document.write('<link href="../css/materialize.min.css" rel="stylesheet" type="text/css"/>');
    frameDoc.document.write('<style>td, th {padding: 3px 2px;} input[type=text]{box-shadow: none !important; border: none !important;} </style>');
    frameDoc.document.write('</head><body>');

    //Append the external CSS file.
//  frameDoc.document.write('<link href="css/styles.css" rel="stylesheet" type="text/css" />');
//  frameDoc.document.write('<link href="superClass/print/hide_element_print.css" rel="stylesheet" type="text/css" />');

    //Append the DIV contents.
    //Adiciona o Primeiro Cabecao
    frameDoc.document.write(cabecalho());

    //adiciona o conteudo html e se tiver a tag {CABECALHO} ele subistitu por cabecalho();
    frameDoc.document.write(contents.split('{CABECALHO}').join(cabecalho()));
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