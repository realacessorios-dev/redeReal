/* global util */

$.ajaxSetup({
    url: 'vendaLoja/per.vendaLoja.php',
    data: {
        class: 'vendaLoja',
        //  redeReal : login.redeReal
    }
});

var vm;


$(function () {
    afterLogin();

    $('.real').maskMoney({thousands: '.', decimal: ','});

    var dt = new Date(util.dataUSA(DATA));
    dt = new Date(dt.getFullYear(), parseInt(dt.getMonth()), 0);
    $('#edtInicial').val('01' + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt.getFullYear());
    $('#edtFinal').val(('0' + dt.getDate()).substr(-2) + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt.getFullYear());

    $('#edtInicial').datepicker({
        onSelect: function () {
            var dt = new Date(util.dataUSA($('#edtInicial').val()));
            var dt2 = new Date(dt.getFullYear(), parseInt(dt.getMonth() + 1), 0);
            $('#edtFinal').val(('0' + dt2.getDate()).substr(-2) + '/' + ('0' + parseInt(dt.getMonth() + 1)).substr(-2) + '/' + dt2.getFullYear());
        }
    });


    vm = new Vue({
        el: '#app',
        methods: {
            getAcumulado() {

                var id_sociedade = $('#SelectLoja').val();
                var dtInicial = $('#edtInicial').val();
                var dtFinal = $('#edtFinal').val();
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


                if (id_sociedade == 0) {
                    $.each(idLojas, function (i, ln) {
                        getValores(ln.id_sociedade, dtInicial, dtFinal, ln.loja);
                        getMontagem(ln.id_sociedade, dtInicial, dtFinal, ln.loja);
                    });
                } else {
                    getValores(id_sociedade, dtInicial, dtFinal, loja);
                    getMontagem(id_sociedade, dtInicial, dtFinal, loja);

                }



                $.ajax({
                    data: {
                        call: 'getAcumulado',
                        class: 'vendaLoja',
                        param: {
                            dtInical: util.dataUSA($('#edtInicial').val()),
                            dtFinal: util.dataUSA($('#edtFinal').val())
                        }
                    },
                    beforeSend: function (xhr) {
//                        $('#tbAcumulado').html('<i class="fa fa-spinner fa-pulse fa-fw"></i>');
                    },
                    success: function (r) {
                        console.log(r);
                    }
                });

            },

            getLojas() {
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
        }
    })
});

function afterLogin() {
    var setInt;

    setInt = setInterval(function () {
        if (login['nome'] != undefined) {
            getLojas();
            //  vendaVendedor.getIdLojas();
            clearInterval(setInt);
        }
    }, 1000);
}


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