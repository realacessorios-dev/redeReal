/**
 * @param {} Argument
 * msg:'????'
 * title:'????';
 * icon: '1'; // 1->accept; 2->cancel; 3-warning; 4-trash;
 * img:'img/imagem.png'; //este atributo suprime a funcao icon;
 * close:function(){}
 * @example util.show({msg: 'mensagem', icon: '1', close: function(){ função }});
 */
show = function (Argument) {
  Argument = Argument || {};
  var msg;
  if (!Argument.title)
    Argument.title = 'Mensagem do Sistema';
  if (typeof Argument === 'string') {
    msg = Argument;
  } else {
    msg = Argument.msg;
  }


  if (Argument.icon) {
    switch (Argument.icon) {
      case '1':
        icon = '<i class="fa fa-check-circle" ></i>';
        break;
      case '2':
        icon = '<i class="fa fa-times-circle"></i>';
        break;
      case '3':
        icon = '<i class="fa fa-exclamation-circle"></i>';
        break;
      case '4':
        icon = '<i class="fa fa-trash" ></i>';
        break;
    }
  } else {
    icon = '<i class="fa fa-info-circle"></i>';
  }

  if (Argument.img)
    icon = '<img src="' + Argument.img + '">';
  var id = 'pnMsg' + Math.floor(Math.random() * 9999);
  $('body').after('<div id="' + id + '">' +
          '<div style="text-align: center;">' + msg + '</div>' +
//          icon +
          '</div>');
//  setTimeout(function(){
  $("#" + id).mofo({
    autoOpen: true,
    modal: true,
    title: Argument.title,
    width: 600,
    height: 180,
    close: function () {
      if (Argument.close) {
        Argument.close();
      }

      if (Argument.focus) {
        $(Argument.focus).focus();
      }

      $("#" + id).mofo('destroy');
      $("#" + id).remove();
    },
    open: function () {
      $('#' + id).mofo('focus', 0);
    },
    buttons: {
      OK: function () {
        $("#" + id).mofo("close");
      },
      Cancelar: function () {
        $("#" + id).mofo("close");
      }
    }
  });
//  },100);


};

/**
 * @param {} Argument
 * msg:'????'
 * title:'????';
 * icon: '1'; // 1->accept; 2->cancel; 3-warning; 4-trash; 5-question
 * img:'img/imagem.png'; //este atributo suprime a funcao icon;
 * close:function(){}
 * call:function(){}
 * @example utilitario.confirma({
 *  msg:'Gostaria de ?',
 *  title:'Titulo do box',
 *  call:function(){
 *        açao...
 *        },
 *  close:function(){
 *      açao..
 *      }
 *  })
 */
confirma = function (Argument) {
  Argument = Argument || {};
  if (!Argument.title)
    Argument.title = 'Mensagem do Sistema';
  if (Argument.icon) {
    switch (Argument.icon) {
      case '1':
        icon = '<i class="fa fa-check-circle"" ></i>';
        break;
      case '2':
        icon = '<i class="fa fa-times-circle"></i>';
        break;
      case '3':
        icon = '<i class="fa fa-exclamation-circle" ></i>';
        break;
      case '4':
        icon = '<i class="fa fa-trash" ></i>';
        break;
    }
  } else {
    icon = '<i class="fa fa-info-circle"></i>';
  }

  if (Argument.img)
    icon = '<img src="' + Argument.img + '">';
  var id = 'pnCon' + Math.floor(Math.random() * 9999);
  $('body').after('<div id="' + id + '">' +
          '<div style="text-align: center;">' + Argument.msg);
  $('#' + id).mofo({
    resizable: false,
    width: 600,
    height: 180,
    title: Argument.title,
    close: function () {
      $('#' + id).mofo("destroy");
      $('#' + id).remove();
      if (Argument.close)
        Argument.close();
    },
    open: function () {
      $('#' + id).mofo('focus', 1);
    },
    buttons: {
      'OK': function () {
        Argument.call && Argument.call();
        $('#' + id).mofo("close");
      },
      'Cancelar': function () {
        $('#' + id).mofo("close");
      }

    }
  });
};

/**
 * @param {} Argument
 * msg:'????'
 * title:'????';
 * icon: '1'; // 1->accept; 2->cancel; 3-warning; 4-trash; 5-question
 * img:'img/imagem.png'; //este atributo suprime a funcao icon;
 * close:function(){}
 * call:function(){}
 * @example utilitario.confirmaCodigo({
 *  msg:'Gostaria de ?',
 *  title:'Titulo do box',
 *  call:function(){
 *        açao...
 *        },
 *  close:function(){
 *      açao..
 *      }
 *  })
 */
confirmaCodigo = function (Argument) {
  Argument = Argument || {};
  if (!Argument.title)
    Argument.title = 'Mensagem do Sistema';
  if (Argument.icon) {
    switch (Argument.icon) {
      case '1':
        icon = '<i class="fa fa-check-circle"></i>';
        break;
      case '2':
        icon = '<i class="fa fa-times-circle"></i>';
        break;
      case '3':
        icon = '<i class="fa fa-exclamation-circle"></i>';
        break;
      case '4':
        icon = '<i class="fa fa-trash" ></i>';
        break;
    }
  } else {
    icon = '<i class="fa fa-info-circle" ></i>';
  }

  if (Argument.img)
    icon = '<img src="' + Argument.img + '">';
  var numero;
  var codigo;
  numero = Math.floor(Math.random() * 999999);
  var id = 'pnConKey' + Math.floor(Math.random() * 9999);
  $('body').after('<div id="' + id + '">' +
          '<div id="pnMen" style="text-align: center;">' + Argument.msg + '</div>' +
          '<div id="pnCodigoNumero" style="text-align: center; font-weight: bold; border: 1px solid #fcefa1; background:#fbf9ee;padding: 6px 6px">154a1e</div>' +
          '<div style="text-align: center; margin-top:5px;"><input type="text" style="width:100px; border-left: 2px solid red; text-align: center;" id="edtCodigoConf"/></div>'+
          '</div>');
  $(document).on('keydown', '#edtCodigoConf', function (e) {
    if (e.keyCode === 13)
      $('#' + id).mofo('click', '1');
  });
  $('#' + id).mofo({
    resizable: false,
    width: 600,
    height: 230,
    title: Argument.title,
    close: function () {
      $('#' + id).mofo("destroy");
      $('#' + id).remove();
      $(document).off('keydown', '#edtCodigoConf');
      if (Argument.close)
        Argument.close();
    },
    open: function () {
      $('#pnCodigoNumero').html(numero);
      $('#edtCodigoConf').focus().select();
    },
    buttons: {
      'OK': function () {
        codigo = $('#edtCodigoConf').val();
        if (parseInt(codigo) !== parseInt(numero)) {
          alert('Código Inválido');
          $('#edtCodigoConf').focus().select();

//          show({msg: 'Código Inválido', close: function () {
//              $('#edtCodigoConf').focus().select();
//            }
//          });

        } else {
          Argument.call();
          $('#' + id).mofo("close");
        }
      },
      'Cancelar': function () {
        $('#' + id).mofo("close");
      }

    }
  });
};

/**
 *@param {} Argument
 * msg:'????'
 * title:'????';
 * close:function(){}
 
 * @example utilitario.aguarde({
 *  msg:'aguarde',
 *  title:'Titulo do box',
 *  close:function(){
 *      açao..
 *      }
 *  })
 *  or
 *  aguarde();
 *  or 
 *  aguarde('aguarder');
 *
 * aguarde('close') para fechar
 */
aguarde = function (Argument) {
  var argDefalt = {
    title: 'Mensagem do Sistema',
    msg: 'Aguarde processando . . .',
    close: {}
  };
  var arg = $.extend(argDefalt, Argument);

  if (typeof Argument === 'string') {

    if (Argument.toUpperCase() === 'CLOSE') {
      $("#pnAguarde").mofo('close');
      return false;
    }

    arg.msg = Argument;
  }


  $('body').after('<div id="pnAguarde" style="text-align: center">\n\
                               <div style="text-align: center; font-weight: bold;">&nbsp;' + arg.msg + '</div>\n\
                               <i class="fa fa-spinner fa-pulse fa-3x fa-fw" style="font-size=15px;"></i>\n\
                             </div>');
  $("#pnAguarde").mofo({
    width: 400,
    height: 130,
    title: arg.title,
    closeBtn: false,
    close: function () {
      $('#pnAguarde').mofo("destroy");
      $('#pnAguarde').remove();
      if (arg.close.length !== undefined)
        arg.close();
    }
  });
};