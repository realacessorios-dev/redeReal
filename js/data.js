var dataAtual = new Date();
var dataAtualBR = ("0" + dataAtual.getDate()).substr(-2) + "/" + ("0" + (dataAtual.getMonth() + 1)).substr(-2) + "/" + dataAtual.getFullYear();

var DIA = ("0" + dataAtual.getDate()).substr(-2);
var MES = ("0" + parseInt(dataAtual.getMonth() + 1)).substr(-2);
var ANO = dataAtual.getFullYear();

var DATA = DIA + '/' + MES + '/' + ANO;

/*
 <input type="text" name="nome_campo" id="nome_campo"
 onkeypress='formatar(this, "##/##/####")' onblur="return doDateVal(this.id, this.value, 4);"
 placeholder="DD/MM/AAAA" maxlength="10">
 */

/*
 usando a classe dataFim na data final impede que a data final seja maior que a data inicial
 - data final inicia apartir da data inicial
 - data inicial <= data final
 */

$(document).ready(function () {
//seta para formato data
    $(".data").datepicker({
        onClose: function (selectedDate) {
            $(".dataFim").datepicker("option", "minDate", selectedDate);
        }
    }).attr({placeholder: 'dd/mm/aaaa', maxlength: '10'})
            .keypress(function () {
                formatar(this, "##/##/####");
            })
            .blur(function () {
                return doDateVal(this.id, this.value, 4);
            });

    $(".dataInicial").datepicker({
        onClose: function (selectedDate) {
            $(".dataFinal").datepicker("option", "minDate", selectedDate);
        }
    }).attr({placeholder: 'dd/mm/aaaa', maxlength: '10'})
            .keypress(function () {
                formatar(this, "##/##/####");
            })
            .blur(function () {
                return doDateVal(this.id, this.value, 4);
            });


    $(".dataFinal").datepicker().attr({placeholder: 'dd/mm/aaaa', maxlength: '10'})
            .keypress(function () {
                formatar(this, "##/##/####");
            })
            .blur(function () {
                return doDateVal(this.id, this.value, 4);
            });

});


function formatar(src, mask) {
    var i = src.value.length;
    var saida = mask.substring(0, 1);
    var texto = mask.substring(i);
    if (texto.substring(0, 1) !== saida)
    {
        src.value += texto.substring(0, 1);
    }
}

/* Valida Data */

var reDate4 = /^((0?[1-9]|[12]\d)\/(0?[1-9]|1[0-2])|30\/(0?[13-9]|1[0-2])|31\/(0?[13578]|1[02]))\/(19|20)?\d{2}$/;
var reDate = reDate4;

function doDateVal(Id, pStr, pFmt) {
    d = document.getElementById(Id);
    if (d.value != "") {
        if (d.value.length < 10) {
            //util.show({msg:''})
            alert("Data Inválida!\nDigite corretamente a data: dd/mm/aaaa !");
            d.value = "";
            d.focus();
            return false;
        } else {

            eval("reDate = reDate" + pFmt);
            if (reDate.test(pStr)) {
                return false;
            } else if (pStr != null && pStr != "") {
                util.show({msg: "ALERTA DE ERRO!!<br>" + pStr + " NÃO é uma data válida.", icon: '3'});
                //	alert("ALERTA DE ERRO!!\n\n" + pStr + " NÃO é uma data válida.");
                d.value = "";
                d.focus();
                return false;
            }
        }
    } else {
        return false;
    }
}

function do_relogio() {
    var momentoAtual = new Date();
    var semana = new Array('DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB');
    var semana = semana[momentoAtual.getDay()];

    var dia = momentoAtual.getDate();
    if (dia < 10)
        dia = "0" + dia;

    var mes = new Array('JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ');
    var mes = mes[momentoAtual.getMonth()];

    var data = semana + ', ' + dia + " " + mes;

    var hora = momentoAtual.getHours()
    if (hora < 10)
        hora = "0" + hora;

    var minuto = momentoAtual.getMinutes()
    if (minuto < 10)
        minuto = "0" + minuto;

    var segundo = momentoAtual.getSeconds()
    if (segundo < 10)
        segundo = "0" + segundo;
    horaImprimivel = data + ", " + hora + ":" + minuto + ":" + segundo

    //document.frm.relogio.value = horaImprimivel;
    document.getElementById('relogio').innerHTML = horaImprimivel;
    setTimeout("do_relogio()", 1000);
}

function DateToForm(data) {
    time = strtotime(data);
    return date('d/m/Y', time);
}

/**
 * Retorna quantidade de dias entre datas
 * @param {type} date1 dd/mm/aaaa
 * @param {type} date2 dd/mm/aaaa
 * @returns {Number}
 */
function days_between(date1, date2) {
    /*  var sdt1 = '01/07/2014';
     var sdt2 = '30/07/2014';
     var t1 = sdt1.split('/');
     var t2 = sdt2.split('/');*/
    var t1 = date1.split('/');
    var t2 = date2.split('/');

    var dt1 = new Date(t1[2], t1[1], t1[0]);
    var dt2 = new Date(t2[2], t2[1], t2[0]);

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = dt1.getTime();
    var date2_ms = dt2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);
    // Convert back to days and return
    return Math.round(difference_ms / ONE_DAY);
}

function getDaysInMonth(month, year) {
    var dd = new Date(year, month, 0);
    return dd.getDate();
}

function getWeekendsInMonth(mes, ano) {
    alert('hh');
    var ult_dia = getDaysInMonth(mes, ano);
    // document.write(ult_dia + '/' + mes + '/' + ano + '<br>');
    var i;
    var qtdSab = 0;
    var qtdDom = 0;
    for (i = 1; i <= ult_dia; i++) {
        var dd = new Date(mes + '/' + i + '/' + ano);
        if (dd.getDay() === 0)
            qtdDom++;
        else
        if (dd.getDay() === 6)
            qtdSab++;
    }
    var dias = new Array();
    dias['dias'] = ult_dia;
    dias['sabados'] = qtdSab;
    dias['domingos'] = qtdDom;
    return dias;

    /* caso de uso
     var ar = getWeekendsInMonth(10, 2014)
     document.write('dias: '+ar['dias']+' sábados: '+ar['sabados']+' domingos: '+ar['domingos']);
     */
}

function addMonth(dt, nr) {
    //document.write(dt + '<br>');
    var dtAtual = new Date(dt);
    dtAtual.setMonth(dtAtual.getMonth() + nr);
    return dtAtual;//.getFullYear() + '/' + (dtAtual.getMonth() + 1) + '/' + dtAtual.getDate();
    /*
     caso de uso
     document.write(addMonth('1974/02/20', 2); == 1974/04/20
     */
}

function GetMes(id) {

    var option = $('<select/>', {id: 'slMes', class: 'chosen', width: '180px', 'data-placeholder': 'Selecione um Mês'});

    option.append($('<option/>', {html: 'Selecione um Mês', value: '-1'}));
    option.append($('<option/>', {html: '01 - ' + lang.jeneiro, value: '01'}));
    option.append($('<option/>', {html: '02 - ' + lang.fevereiro, value: '02'}));
    option.append($('<option/>', {html: '03 - ' + lang.marco, value: '03'}));
    option.append($('<option/>', {html: '04 - ' + lang.abril, value: '04'}));
    option.append($('<option/>', {html: '05 - ' + lang.maio, value: '05'}));
    option.append($('<option/>', {html: '06 - ' + lang.junho, value: '06'}));
    option.append($('<option/>', {html: '07 - ' + lang.julho, value: '07'}));
    option.append($('<option/>', {html: '08 - ' + lang.agosto, value: '08'}));
    option.append($('<option/>', {html: '09 - ' + lang.setembro, value: '09'}));
    option.append($('<option/>', {html: '10 - ' + lang.outubro, value: '10'}));
    option.append($('<option/>', {html: '11 - ' + lang.novembro, value: '11'}));
    option.append($('<option/>', {html: '12 - ' + lang.dezembro, value: '12'}));
    $('#' + id).html(option);
    $(".chosen").chosen();
}

/**
 * Obtem a duracao em tempo de uma hora sobre a outra
 * @param {type} h1 hora menor
 * @param {type} h2 hora maior
 * @returns {String} resultado hhh:mm:ss
 * @example fnDuracao("10:00:00","11:00:00");
 * @author Rômulo
 */
function fnDuracao(h1, h2) {
    var date1 = new Date("01/01/2015 " + h1);
    var date2 = new Date("01/01/2015 " + h2);

    if (date1.getTime() < date1.getTime())
        var diff = date2.getTime() - date1.getTime();
    else
        var diff = date1.getTime() - date2.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = '0' + Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = '0' + Math.floor(msec / 1000);
    msec -= ss * 1000;
    return hh + ":" + mm.substr(-2) + ":" + ss.substr(-2);
}