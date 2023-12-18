function Utilitario() {

    this.stopExecution = function (e) {
        if (e.preventDefault)
            e.preventDefault();
        if (e.stopPropagation)
            e.stopPropagation();
        return false;
    }

    /**
     *
     * @param {type} valor
     * @returns {string} valor 1.234,11
     */
//  this.formatValor = function (num) {
//    num = String(num);
////    return num.toFixed(qtoCasas).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
//
//    return num.replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
//
//
////    x = 0;
////    if (num < 0) {
////      num = Math.abs(num);
////      x = 1;
////    }
////
////    if (isNaN(num))
////      num = "0";
////
////    if (num === null)
////      num = '0.00';
////    num = num.toString();
////    var valor = num.split('.');
//////      var cents = Math.floor((num * 100 + 0.5) % 100);
//////      num = Math.floor((num * 100 + 0.5) / 100).toString();
////    num = valor[0];
////    var cents = parseInt(valor[1]);
////
////    if (cents < 10)
////      cents = "0" + cents;
////    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
////      num = num.substring(0, num.length - (4 * i + 3)) + '.'
////              + num.substring(num.length - (4 * i + 3));
////    var ret = num + ',' + cents;
////    if (x === 1)
////      ret = ' - ' + ret;
////    return ret.replace('NaN', '00');
//  };

    this.formatValor = function (num) {
        x = 0;
        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num))
            num = "0";
        cents = Math.floor((num * 100 + 0.5) % 100);

        num = Math.floor((num * 100 + 0.5) / 100).toString();

        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + '.'
                    + num.substring(num.length - (4 * i + 3));
        ret = num + ',' + cents;
        if (x === 1)
            ret = ' - ' + ret;
        return ret;
    };

    /**
     *
     * @param {type} num 1.231,15
     * @returns {valor} formatado 1231.15
     */
    this.formatValorUSA = function (num) {
        //alert(num);
//    var valor = num.replace('.', ''); // removo o "."
//    valor = valor.replace('.', ''); // removo outro "." se tiver
//    valor = valor.replace('.', ''); // removo outro "." se tiver
//    valor = valor.replace(',', '.'); // subistitui a "," por "."
//    return valor;
        return parseFloat(num.replace(/\./g, '').replace(/\,/g, '.'));

    };


    //  this.dataBrasil = function (data, separador) {
    this.dataBrasil = function (data) {
        if (data != null && data != '') {
            if ($.trim(data) === '') {
                return false;
            }
            if (data.search('-') > 0) {
                var separador = '-';
            }
            if (data.search('/') > 0) {
                var separador = '/';
            }
            if (data.search('.') > 0) {
                var separador = '.';
            }

            //2014/12/01
            var rt = data.split(separador);
            var dt = rt[2] + '/' + rt[1] + '/' + rt[0];
            return dt;
        } else {
            return '';
        }
    };


    this.dataTimeBrasil = function (dataTime) {
        //0000-00-00 00:00:00

        if (dataTime != null && dataTime != '') {
            if ($.trim(dataTime) === '') {
                return false;
            }
            if (dataTime.search('-') > 0) {
                var separador = '-';
            }
            if (dataTime.search('/') > 0) {
                var separador = '/';
            }
            if (dataTime.search('.') > 0) {
                var separador = '.';
            }

            var rt = dataTime.split(separador);
            var dia = rt[2].split(' ');

            var dt = dia[0] + '/' + rt[1] + '/' + rt[0] + ' ' + dia[1];
            if (dt == '00/00/0000 00:00:00')
                dt = '';

            return dt;
        } else {
            return '';
        }
    };





    /**
     *
     * @param {string} data dd/mm/yyyy
     * @return {string}  yyyy/mm/dd
     */
//  this.dataUSA = function (data, separador) {
    this.dataUSA = function (data) {
        //2014/12/01
        if (data.search('-') > 0) {
            var separador = '-';
        }
        if (data.search('/') > 0) {
            var separador = '/';
        }
        if (data.search('.') > 0) {
            var separador = '.';
        }

        var rt = data.split(separador);
        var dt = rt[2] + '/' + rt[1] + '/' + rt[0];
        return dt;
    };


    this.printDivHTML = function (html, btn) {

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

        frameDoc.document.write('<link href="css/index.css" rel="stylesheet" type="text/css"/>');
        frameDoc.document.write('<link href="css/materialize.min.css" rel="stylesheet" type="text/css"/>');
        frameDoc.document.write('<style>' + $('#mystyle').html() + '</style>');

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

}

var util = new Utilitario();


//****************************so functions ***********************************//

/*
 *
 * @param {type} e
 * @returns {Boolean}
 * @sample: <input type="text" id="edtLocalizar" autofocus autocomplete="false" onkeypress='return SomenteNumero(event)'>
 */
function SomenteNumero(e) {
    var tecla = (window.event) ? event.keyCode : e.which;
    if ((tecla > 47 && tecla < 58))
        return true;
    else {
        if (tecla == 8 || tecla == 0)
            return true;
        else
            return false;
    }
}

function load() {
    return '<div class="center"><i class="fa fa-spinner fa-spin fa-4x fa-fw"></i></div>';
}

