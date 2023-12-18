var calculadoraXico = (function () {
  var controleKeyCalc = false;
  var __ControLeCalculadora__ = false;

  var calcIsOpen = false;


  var html = '<div id="fromCalculadora">' +
          '<div class="btnXico" id="soma" style="display: none;">0</div>' +
          '<div class="btnXico" id="op" style="display: none;"></div>' +
          ' <div id="pnNum" style="display: none;"></div>' +
          ' <div class="calcTop">' +
          '    <div id="pnResul"></div>' +
          ' </div>' +
          '<div class="calcMeio">' +
          '<div class="calcRow">' +
          '    <div class="pnQtoResult">Quantidade de Itens <span id="qtdItens">0</span></div>' +
          '    <div id="pnDisplay"></div>' +
          '</div>' +
          '<div class="calcRow row">' +
          '    <div class="btnXico col s3" val="1" >1</div>' +
          '    <div class="btnXico col s3" val="2" >2</div>' +
          '    <div class="btnXico col s3" val="3" >3</div>' +
          '    <div class="btnXico op col s3" val="+">+</div>' +
          '</div>' +
          '<div class="calcRow row">' +
          '    <div class="btnXico col s3" val="4" >4</div>' +
          '    <div class="btnXico col s3" val="5" >5</div>' +
          '    <div class="btnXico col s3" val="6" >6</div>' +
          '    <div class="btnXico op col s3" val="-">-</div>' +
          '</div>' +
          '<div class="calcRow row">' +
          '    <div class="btnXico col s3" val="7" >7</div>' +
          '    <div class="btnXico col s3" val="8" >8</div>' +
          '    <div class="btnXico col s3" val="9" >9</div>' +
          '    <div class="btnXico op col s3" val="*">*</div>' +
          '</div>' +
          '<div class="calcRow row">' +
          '    <div class="btnXico op col s3" val="P" alt="Retorna porcentagem % entre dois valores. Atalho, Seta para baixo. (Informe o Menor Valor Primeiro)" title="Retorna porcentagem % entre dois valores. Atalho, Seta para baixo. (Informe o Menor Valor Primeiro)">P</div>' +
          '    <div class="btnXico col s3" val="0">0</div>' +
          '    <div class="btnXico col s3" val="." >,</div>' +
          '    <div class="btnXico op col s3" val="/">/</div>' +
          '</div>' +
          '<div class="calcRow row">' +
          '    <div class="btnXico col s3" val="C" alt="Tecla de atalho para limpar C" title="Tecla de atalho para limpar C">C</div>' +
          '    <div class="btnXico col s3" val="=" alt="Tecla de atalho para Resultado Enter" title="Tecla de atalho para Resultado Enter">=</div>' +
          '    <div class="btnXico col s3" val="V" alt="Apagar" title="Apagar"><i class="fa fa-long-arrow-left"></i></div>' +
          '    <div class="btnXico op col s3" val="%" alt="Tecla de atalho seta para Direita" title="Tecla de atalho seta para Direita">%</div>' +
          '</div>' +
          '</div>' +
          '</div>';


  _montaHTML = function () {
    $('body').prepend($('<div>', {id: 'pnCalculadoraXico', html: html, style: "display: none"}));
    _eventoClick();
  };

  _eventoClick = function () {
    $('#fromCalculadora .btnXico').click(function () {
      var num = $(this).attr('val');
      _cal(num);
    });
  };

  _cal = function (num) {
    if (num === 'V') { //Volta (Backspace)
      var str = $('#fromCalculadora #pnNum').html();
      str = str.substring(0, (str.length - 1));
      //verifica se o ultimo caractar é .(ponto) se for ele remove
      var ult = str.substring(str.length - 1, str.length);
      if (ult === '.')
        str = str.substring(0, (str.length - 1));
      $('#fromCalculadora #pnNum').html(str);
      $('#fromCalculadora #pnDisplay').html(formatValor(str));
      return false;
    }

    if (num === 'C') { //Limpa
      $('#fromCalculadora #pnResul').html('');
      $('#fromCalculadora #pnDisplay').html('');
      $('#fromCalculadora #op').html('');
      $('#fromCalculadora #pnNum').html('');
      $('#fromCalculadora #soma').html('0');
      $('#qtdItens').html(0);
      __ControLeCalculadora__ = true;
      return false;
    }

    if (num === '=') {
      var num1 = $('#fromCalculadora #soma').html();
      var num2 = $('#fromCalculadora #pnNum').html();
      var op = $('#fromCalculadora #op').html();
      var qto = parseInt($('#qtdItens').html()) + 1;
      var __TotalCalculadora__ = calculo(num1, num2, op);
      $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(num2) + ' <span class="op">' + op + '</span></div>');


      if (op === 'P') {
        $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(__TotalCalculadora__) + ' =% </div>');
        $('#fromCalculadora #pnDisplay').html(formatValor(__TotalCalculadora__) + '%&nbsp;');
      } else {
        $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(__TotalCalculadora__) + ' = </div>');
        $('#fromCalculadora #pnDisplay').html(formatValor(__TotalCalculadora__) + '&nbsp;');
      }
      $('#fromCalculadora #pnResul').append('=============== Qto ' + qto);
      $('#fromCalculadora #pnNum').html(__TotalCalculadora__);
      $('#fromCalculadora #op').html('');
      $('#fromCalculadora #soma').html('0');
      $('#fromCalculadora #pnResul').scrollTop(9999999999999, 0);
      $('#qtdItens').html(0);
      __ControLeCalculadora__ = true;
      return false;
    }

    if (num === 'P') {
      var soma = $('#fromCalculadora #pnNum').html();
      $('#fromCalculadora #op').html('P');
      $('#fromCalculadora #soma').html(soma);
      $('#fromCalculadora #pnDisplay').html(formatValor(soma) + '&nbsp;');
      $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(soma) + '</div>');
      $('#fromCalculadora #pnDisplay').scrollTop(9999999999, 0);
      __ControLeCalculadora__ = true;
      return false;
    }

    if (num === '%') {
      var num1 = $('#fromCalculadora #soma').html();
      var num2 = $('#fromCalculadora #pnNum').html();
      var op = $('#fromCalculadora #op').html();
      if (op === '*')
        var percent = parseFloat(num1) * parseFloat(num2) / 100;
      if (op === '+')
        percent = parseFloat(num1) * parseFloat(num2) / 100 + parseFloat(num1);
      if (op === '-')
        percent = parseFloat(num1) - (parseFloat(num1) * parseFloat(num2) / 100);
      if (op === '/')
        percent = parseFloat(num1) * parseFloat(num2) / 100 / parseFloat(num1);
      $('#fromCalculadora #pnResul').append('<div>' + formatValor(num2) + ' ' + op + '</div>');
      $('#fromCalculadora #pnResul').append('<div>' + formatValor(percent) + ' %=</div>');
      $('#fromCalculadora #pnDisplay').html(formatValor(percent) + '&nbsp;');
      $('#fromCalculadora #pnNum').html(percent);
      $('#fromCalculadora #pnResul').append('===============');
      $('#fromCalculadora #op').html('');
      $('#fromCalculadora #soma').html('0');
      $('#fromCalculadora #pnDisplay').scrollTop(9999999999, 0);
      __ControLeCalculadora__ = true;
      return false;
    }

    if (num === '+' || num === '-' || num === '*' || num === '/') {
      soma = $('#fromCalculadora #soma').html();
      if (soma === '0') {
        var valor = $('#fromCalculadora #pnNum').html();
        $('#fromCalculadora #op').html(num);
        $('#fromCalculadora #soma').html(valor);
        $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(valor) + '&nbsp;&nbsp;&nbsp;</div>');
        $('#qtdItens').html('1');
        __ControLeCalculadora__ = true;
      } else {
        valor = $('#fromCalculadora #pnNum').html();
        op = $('#fromCalculadora #op').html();
        $('#fromCalculadora #pnResul').append('<div>&nbsp;' + formatValor(valor) + ' ' + num + '</div>');
        __TotalCalculadora__ = calculo(soma, valor, op);
        $('#fromCalculadora #op').html(num);
        $('#fromCalculadora #soma').html(__TotalCalculadora__);
        $('#fromCalculadora #pnDisplay').html(formatValor(__TotalCalculadora__));
        __ControLeCalculadora__ = true;
        $('#qtdItens').html(parseInt($('#qtdItens').html()) + 1);
        $('#fromCalculadora #pnResul').scrollTop(9999999999999, 0);
      }


    } else {
      if (__ControLeCalculadora__ === true) {
        $('#fromCalculadora #pnNum').html('');
        $('#fromCalculadora #pnDisplay').html('');
        __ControLeCalculadora__ = false;
      }
//verifica se ja tem um ponto no valor se nao tivar ele retorna 1 e nao faz nada
      if (num === '.' && $('#fromCalculadora #pnNum').html().indexOf(".") >= 0)
        return false;
      $('#fromCalculadora #pnNum').append(num);
//            $('#fromCalculadora #pnDisplay').html(formatValor($('#fromCalculadora #pnNum').html()) + '&nbsp;');
      $('#fromCalculadora #pnDisplay').html(formatValor($('#fromCalculadora #pnNum').html()));
      $('#fromCalculadora #pnDisplay').scrollTop(9999999999, 0);
    }

  };

  calculo = function (num1, num2, op) {
    if (op === '+')
      return parseFloat(num1) + parseFloat(num2);
    else if (op === '-')
      return parseFloat(num1) - parseFloat(num2);
    else if (op === '*')
      return parseFloat(num1) * parseFloat(num2);
    else if (op === '/')
      return parseFloat(num1) / parseFloat(num2);
    else if (op === 'P')
      return parseFloat(((parseFloat(num2) / parseFloat(num1)) - 1) * 100);
    $('#fromCalculadora #pnDisplay').scrollTop(9999999999, 0);
  };

  _controleKey = function () {
    $(document).bind('keydown', function (e) {
      if (controleKeyCalc === true) {
        var CharKey = String.fromCharCode(e.keyCode);
        if ((e.keyCode > 47 && e.keyCode < 58) && !e.shiftKey) /* de 0 a 9 */
          _cal(CharKey);
        var mozila = e.keyCode;
        var chrome = e.keyCode;
        if (chrome === 189 || mozila === 173 || e.keyCode === 109)
          _cal('-');
        if ((chrome === 187 && e.shiftKey) || (mozila === 61 && e.shiftKey) || e.keyCode === 107)
          _cal('+');
        if ((e.keyCode === 56 && e.shiftKey) || e.keyCode === 106)
          _cal('*');
        if (e.keyCode === 191 || e.keyCode === 111)
          _cal('/');
        if (e.keyCode === 13)
          _cal('=');
        if (e.keyCode === 39)
          _cal('%');
        if (e.keyCode === 96)
          _cal('0');
        if (e.keyCode === 97)
          _cal('1');
        if (e.keyCode === 98)
          _cal('2');
        if (e.keyCode === 99)
          _cal('3');
        if (e.keyCode === 100)
          _cal('4');
        if (e.keyCode === 101)
          _cal('5');
        if (e.keyCode === 102)
          _cal('6');
        if (e.keyCode === 103)
          _cal('7');
        if (e.keyCode === 104)
          _cal('8');
        if (e.keyCode === 105)
          _cal('9');
        if (e.keyCode === 110 || e.keyCode === 108 || e.keyCode === 188 || e.keyCode === 190)
          _cal('.');
        if (e.keyCode === 8)
          _cal('V');
        if (e.keyCode === 67)
          _cal('C');
        if (e.keyCode === 40)
          _cal('P');

        if (e.keyCode === 27) {
          _closeCalc();
        }

        stopExecution(e);

      }

    });

  };

  _ativaKey = function () {
    controleKeyCalc = true;
  };

  _desativaKey = function () {
    controleKeyCalc = false;
  };

  formatValor = function (num) {
    x = 0;
    if (num < 0) {
      num = Math.abs(num);
      x = 1;
    }
    if (isNaN(num))
      num = "0";
    var cents = Math.floor((num * 100 + 0.5) % 100);
    num = Math.floor((num * 100 + 0.5) / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + '.'
              + num.substring(num.length - (4 * i + 3));
    var ret = num + ',' + cents;
    if (x === 1)
      ret = ' - ' + ret;
    return ret;
  };

  stopExecution = function (e) {
    if (e.preventDefault)
      e.preventDefault();
    if (e.stopPropagation)
      e.stopPropagation();
    return false;
  };

  _openModal = function () {
    setTimeout(function () {
      $('#pnCalculadoraXico').mofo({
        width: 200,
        height:400,
        title: 'Calculadora',
        modal: false,
        close: function () {
          controleKeyCalc = false;
        },
        open: function () {
          controleKeyCalc = true;
        }
      });
    }, 50);
  };

  _criaCalcParaModal = function () {
    _montaHTML();
    //  _eventoClick();
  };

  _criaCalcDestino = function (divDestino) {
    $(divDestino).html(html);
    _eventoClick();
  };

  _openCalcLeft = function () {
//    $('#pnCalculadoraXicoLeft').animate({left: '0px'}, 400);
    $('#pnCalculadoraXicoLeft').toggleClass('pnCloseLeftToggle');
    calcIsOpen = true;
    controleKeyCalc = true;
  };

  _openCalcRight = function () {
//    $('#pnCalculadoraXicoRight').animate({right: '0px'}, 400);
    $('#pnCalculadoraXicoRight').toggleClass('pnCloseRightToggle');
    calcIsOpen = true;
    controleKeyCalc = true;
  };

  _criaCalcMenuLeft = function () {
    $('body').prepend($('<div>', {id: 'pnCalculadoraXicoLeft', html: html}));
//    $('#fromCalculadora').append($('<div>', {html: 'Fechar', class: 'btnXico', onclick: 'calculadoraXico.closeCalc();', style: 'width:198px; margin-top: 20px'}));
    $('#pnCalculadoraXicoLeft').append($('<div>', {html: 'Fechar', class: 'calcClose', onclick: 'calculadoraXico.closeCalc();'}));
    _eventoClick();
  };

  _criaCalcMenuRight = function () {
    $('body').prepend($('<div>', {id: 'pnCalculadoraXicoRight', html: html}));
    $('#pnCalculadoraXicoRight').append($('<div>', {html: 'Fechar', class: 'calcClose', onclick: 'calculadoraXico.closeCalc();'}));
    _eventoClick();
  };

  _closeCalc = function () {
    if (calcIsOpen) {
      $('#pnCalculadoraXicoLeft').toggleClass('pnCloseLeftToggle');
      $('#pnCalculadoraXicoRight').toggleClass('pnCloseRightToggle');
    }

    //  $('#pnCalculadoraXicoLeft').animate({left: '-250px'}, 400);
    //  $('#pnCalculadoraXicoRight').animate({right: '-250px'}, 400);
    controleKeyCalc = false;

  };

  _controleKey();

  return {
    openModal: _openModal,
    ativaKey: _ativaKey,
    desativaKey: _desativaKey,
    criaCalcDestino: _criaCalcDestino,
    criaCalcParaModal: _criaCalcParaModal,
    closeCalc: _closeCalc,
    criaCalcMenuRight: _criaCalcMenuRight,
    criaCalcMenuLeft: _criaCalcMenuLeft,
    openCalcRight: _openCalcRight,
    openCalcLeft: _openCalcLeft

  };

})();

