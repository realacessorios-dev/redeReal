$.ajaxSetup({
    url: 'metas/per.metas.php',
    data: {
        class: 'Metas'
    }
});

var vm;

$(function () {
    afterLogin();

    // let ultimoDia = new Date(2019, MES, 0).getDate();


    vm = new Vue({
        el: '#app',
        data: {
            lojas: {},
            metas: [],
            qtoDiasUteis: 0,
            qtoDiasUteisCorridos: 0,
            qtoFeriado: 0
        },
        filters: {
            formatValor(vl) {
                return util.formatValor(vl)
            }
        },
        created() {
            //            for (let i = 1; i <= DIA; i++) {
            //                if (new Date(ANO, parseInt(MES) - 1, i).getDay() != 0)
            //                    this.qtoDiasUteisCorridos++;
            //            }
            //            this.qtoDiasUteisCorridos--;
            //
            //            for (let i = 1; i <= new Date(ANO, MES, 0).getDate(); i++) {
            //                if (new Date(ANO, parseInt(MES) - 1, i).getDay() != 0)
            //                    this.qtoDiasUteis++;
            //            }



        }
    })


    $('#edtInicial').val('01/' + MES + '/' + ANO);
    $('#edtFinal').val((parseInt(DIA) - 1) + '/' + MES + '/' + ANO);


    if (localStorage.getItem('meta' + ANO + MES) != null)
        vm.qtoFeriado = parseInt(localStorage.getItem('meta' + ANO + MES))

    //    var chart = new CanvasJS.Chart("chat", {
    //        animationEnabled: true,
    ////	title:{
    ////		text: "Evening Sales in a Restaurant"
    ////	},
    ////	axisX: {
    ////		valueFormatString: "DDD"
    ////	},
    ////	axisY: {
    ////		prefix: "$"
    ////	},
    ////	toolTip: {
    ////		shared: true
    ////	},
    //        data: [{
    //                type: "stackedBar",
    //                name: "Mercado",
    //                showInLegend: "true",
    //                xValueFormatString: "DD, MMM",
    //                yValueFormatString: "#,##0",
    //                dataPoints: [
    //                    {x: new Date(2017, 0, 30), y: 56},
    //                    {x: new Date(2017, 0, 31), y: 45},
    //                    {x: new Date(2017, 1, 1), y: 71},
    //                    {x: new Date(2017, 1, 2), y: 41},
    //                    {x: new Date(2017, 1, 3), y: 60},
    //                    {x: new Date(2017, 1, 4), y: 75},
    //                    {x: new Date(2017, 1, 5), y: 98}
    //                ]
    //            },
    //            {
    //                type: "stackedBar",
    //                name: "Geral",
    //                showInLegend: "true",
    //                xValueFormatString: "DD, MMM",
    //                yValueFormatString: "#,##0",
    //                dataPoints: [
    //                    {x: new Date(2017, 0, 30), y: 52},
    //                    {x: new Date(2017, 0, 31), y: 55},
    //                    {x: new Date(2017, 1, 1), y: 20},
    //                    {x: new Date(2017, 1, 2), y: 35},
    //                    {x: new Date(2017, 1, 3), y: 30},
    //                    {x: new Date(2017, 1, 4), y: 45},
    //                    {x: new Date(2017, 1, 5), y: 25}
    //                ]
    //            }]
    //    });
    //    chart.render();


});

function afterLogin() {
    var setInt;

    setInt = setInterval(function () {
        if (login['nome'] != undefined) {
            metas.getLojas();
            clearInterval(setInt);
        }
    }, 500);

}


function img() {

    html2canvas($("#pnMeta"), {
        onrendered: function (canvas) {
            // theCanvas = canvas;
            // document.body.appendChild(canvas);

            // Convert and download as image 
            // Canvas2Image.saveAsPNG(canvas);
            $("#img-out").html(canvas);
            // Clean up 
            //document.body.removeChild(canvas);
        }
    });
}


var metas = (function () {

    function verDiasUteis() {

    }

    function pnModalImage() {
        $('#pnImg').mofo({
            width: 650,
            height: 700,
            open: img
        });

    }

    function getLojas() {
        $.ajax({
            type: 'POST',
            url: 'class/per.mysql.php',
            data: {
                class: 'mysql',
                call: 'getIdLojas'
            },
            success: function (r) {
                vm.lojas = r
            }

        });
    }

    function getMetas() {
        let id_sociedade = $('#SelectLoja').val();
        vm.qtoDiasUteisCorridos = 0;
        vm.qtoDiasUteis = 0;
        $('#myLoad').html('');

        if (localStorage.getItem('meta' + ANO + MES) == null)
            localStorage.setItem('meta' + ANO + MES, vm.qtoFeriado)


        let diasCorridos = parseInt(days_between($('#edtInicial').val(), $('#edtFinal').val())) + 1;
        let dt = $('#edtInicial').val().split('/');
        //(3) ["01", "04", "2019"]
        let totalDiasMes = new Date(dt[2], dt[1], 0).getDate();

        for (let i = 1; i <= totalDiasMes; i++) {
            if (new Date(dt[2], parseInt(dt[1]) - 1, i).getDay() != 0)
                vm.qtoDiasUteis++;
        }

        for (let i = 1; i <= diasCorridos; i++) {
            if (new Date(dt[2], parseInt(dt[1]) - 1, i).getDay() != 0)
                vm.qtoDiasUteisCorridos++;
        }

        console.log(vm.qtoDiasUteisCorridos);

        //alterado por calsa do feriado
        //        vm.qtoDiasUteisCorridos--;
        //        vm.qtoDiasUteisCorridos--;



        vm.metas = [];

        if (id_sociedade == 0) {
            $.each(vm.lojas, function (i, ln) {
                if (ln.id_sociedade != 6)
                    _getMeta(ln.id_sociedade, ln.loja)
            });
        } else
            _getMeta(id_sociedade, $("#SelectLoja>option:selected").html())



    }

    function _getMeta(id_sociedade, loja) {

        $.ajax({
            data: {
                call: 'getMetas',
                param: {
                    DT_INICIAL: util.dataUSA($('#edtInicial').val()),
                    DT_FINAL: util.dataUSA($('#edtFinal').val()),
                    id_sociedade: id_sociedade
                }
            },
            beforeSend: function (xhr) {
                $('#myLoad').append('<span id="idLoja' + id_sociedade + '" ><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i>' + loja + '</span>')
            },
            success: function (r) {
                $('#idLoja' + r.id_sociedade).remove();
                vm.metas.push(r);
            },
            error: function (r) {
                $('#idLoja' + id_sociedade).html('(' + loja + ' está off-line) ');
                //                console.error(r, loja, id_sociedade)
            }
        });
    }

    function getValores() {

        $.ajax({
            data: {
                call: 'getValores',
                param: {
                    beginDate: util.dataUSA($('#edtInicial').val()),
                    endDate: util.dataUSA($('#edtFinal').val()),
                    id_sociedade: $("#SelectLoja>option:selected").val()
                }
            },

            success: function (r) {
                res(r)
            }
        });
    }

    return {
        getMetas: getMetas,
        getLojas: getLojas,
        verDiasUteis: verDiasUteis,
        pnModalImage: pnModalImage,
        getValores: getValores

    }
})();

