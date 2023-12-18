//get feriados do ano

//http://dadosbr.github.io/feriados/nacionais.json

//if (!$.parseJSON(localStorage.getItem('feriado' + ANO))) {
//
//  var webServerFeriado = 'http://holidayapi.com/v1/holidays?country=BR&key=4dabfde2-bab5-4733-9218-38388d0d3c56%year=' + ANO;
//  var webServerFeriado = 'https://holidayapi.com/v1/holidays?key=4dabfde2-bab5-4733-9218-38388d0d3c56&country=BR&year=' + ANO;
//  $.ajax({
//    url: webServerFeriado,
//    dataType: 'json',
//    type: 'GET',
//    success: function (r) {
//      var days = r.holidays;
//      var feriado = new Array();
//      $.each(days, function (i, ln) {
//        var rt = ln[0].date.split('-');
//        var dt = parseInt(rt[2]) + '-' + parseInt(rt[1]) + '-' + rt[0];
//        feriado.push({data: dt, feriado: ln[0].name, dia: parseInt(rt[2]), mes: parseInt(rt[1]), ano: rt[0]});
//      });
//      localStorage.setItem('feriado' + ANO, JSON.stringify(feriado));
//
//    }
//
//  });
//
//}

//localStorage.clear();

var calendario = (function () {
  var mesExtenso = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var dataCalendario = new Date(ANO, MES - 1, DIA);

  var controleKey = false;

  $('body').prepend($('<div>', {id: 'pnMenuCalendario'}));

  $('#pnMenuCalendario').prepend($('<div>', {html: '<button class="ui-button" style="width: 299px" onclick="calendario.hideCalendario()" ><i class="ion-close-circled"></i> Fechar</button>'}));
  $('#pnMenuCalendario').prepend($('<div>', {id: 'pnFeriados'}));
  $('#pnMenuCalendario').prepend($('<div>', {id: 'calendar'}));

  _calendar = function () {
    var mes = dataCalendario.getMonth();
    var ano = dataCalendario.getFullYear();


    var ultimoDia = new Date(ano, mes + 1, 0).getDate();
    var primeiroDiaMes = new Date(ano, mes).getDay();//get o numerio do dia da semana

    var diaMes = 1;

    var table = $('<table>', {width: "295", class: 'myCalendar c-days', mes: parseInt(mes + 1), ano: ano});
    //monta o titulo
    var thead = $('<thead>', {class: "light-gray"});

    var tr = $('<tr>');
    tr.append($('<th>', {html: 'Dom'}));
    tr.append($('<th>', {html: 'Seg'}));
    tr.append($('<th>', {html: 'Ter'}));
    tr.append($('<th>', {html: 'Qua'}));
    tr.append($('<th>', {html: 'Qui'}));
    tr.append($('<th>', {html: 'Sex'}));
    tr.append($('<th>', {html: 'Sáb'}));
    thead.append(tr);
    table.append(thead);

    tr = $('<tr>');
    //cria as colunas vazias ate chegar no 1º dia
    if (primeiroDiaMes > 0) {
      for (i = 0; i < primeiroDiaMes; i++) {
        var td = $('<td>', {html: '&nbsp;'});
        tr.append(td);
        diaMes++;
      }
    }

    var semana = 1;
    var x;
    //peenche to o resto do calendario
    for (x = 1; x <= ultimoDia; x++) {
      if (diaMes > 7) {
        diaMes = 1;
        semana++;
        tr = $('<tr>');
      }
      diaMes++;
      var sunday = diaMes === 2 ? ' sunday' : '';

      var span = $('<span>', {html: x});
      td = $('<td>', {class: 'sm' + semana + sunday + ' ' + x + '-' + parseInt(mes + 1) + '-' + ano, html: span, id: 'dia' + x, style: 'text-align: center'});
      tr.append(td);
      table.append(tr);
    }

    //preenche o resto em branco
    for (x = diaMes; x <= 7; x++) {
      td = $('<td>', {html: '&nbsp;'});
      tr.append(td);
      table.append(tr);
    }
    $('#calendar').html('<div class="c-title dark-gray-3level">' +
            '<div class="left-button" onclick="calendario.voltar()">&lsaquo;</div>' +
            '<div class="right-button" onclick="calendario.proximo()">&rsaquo;</div>' +
            '<div class="title">' + mesExtenso[mes] + ' - ' + ano + '</div>' +
            '</div>').append(table);
    
        _setFeriados();
    
  };

  _proximo = function () {
    var month = dataCalendario.getMonth();
    dataCalendario.setMonth(month + 1);
    _calendar();
    _setFeriados();

  };

  _voltar = function () {
    var month = dataCalendario.getMonth();
    dataCalendario.setMonth(month - 1);
    _calendar();
    _setFeriados();

  };

  _setFeriados = function () {
    var feriado = $.parseJSON(localStorage.getItem('feriado' + ANO));
    $('#pnFeriados').html('');
    var mesAtual = $('#calendar .myCalendar').attr('mes');
    var anoAtual = $('#calendar .myCalendar').attr('ano');

    $.each(feriado, function (i, ln) {
      $('.' + ln.data).addClass('mark-red');
      if (ln.mes == mesAtual && ln.ano == anoAtual) {
        $('#pnFeriados').append(ln.dia + ' - ' + ln.feriado + '<br>');
      }
    });


    $('.' + parseInt(DIA) + '-' + parseInt(MES) + '-' + ANO).addClass('today');
  };

  _showCalendario = function () {
    dataCalendario = new Date(ANO, MES - 1, DIA);
    _calendar();

//    _setFeriados();
//    $('#pnMenuCalendario').animate({left: '0px'}, 400);
    toggle();
  };

  function toggle() {
    $('#pnMenuCalendario').toggleClass('pnMenuCalendariotToggle');

    if ($('#pnMenuCalendario').hasClass('pnMenuCalendariotToggle'))
      controleKey = true;
    else
      controleKey = false;
  }

  _hideCalendario = function () {
//    $('#pnMenuCalendario').animate({left: '-310px'}, 400);
    toggle();
  };

  _key = function () {
    $(document).bind('keydown', function (e) {

      //insert
      if (e.keyCode === 45) {
        _showCalendario();
        if (e.preventDefault)
          e.preventDefault();
        if (e.stopPropagation)
          e.stopPropagation();

      }

      if (controleKey === true) {

        if (e.keyCode === 39) {
          _proximo();
        }

        if (e.keyCode === 37) {
          _voltar();
        }

        if (e.keyCode === 27) {
          _hideCalendario();
        }
      }
    });

  };

  return {
    calendar: _calendar,
    proximo: _proximo,
    voltar: _voltar,
    setFeriados: _setFeriados,
    showCalendario: _showCalendario,
    hideCalendario: _hideCalendario,
    key: _key
  };

})();

setTimeout(function () {
  calendario.calendar();

  calendario.key();
  
}, 2000);







