var login = {};
$('#pnLoginId_funcionario').keydown(function (e) {
  if (e.keyCode === 13)
    $('#pnLoginSenha').select().focus();

});

$('#pnLoginSenha').keydown(function (e) {
  if (e.keyCode === 13)
    loginPW.setLogin(function () {});
  // $('#btnLogin').click();
});

$('#btnLogin').click(function () {
  loginPW.setLogin(function () {});
});

$('#btnSair').click(function () {
  loginPW.logout();
});

var loginPW = (function () {

  function setLogin(call) {
    if ($('#pnLoginLogar').attr('disabled') === 'disabled')
      return false;



    var nome = $('#pnLoginId_funcionario').val();
    var pass = block($('#pnLoginSenha').val());

    if (nome === '') {
      show({msg: 'Código do Funcionário não informado', close: function () {
          $('#pnLoginId_funcionario').select().focus();
        }})
      return false;
    }

    if (pass === '') {
      show({msg: 'Senha não informado', close: function () {
          $('#pnLoginSenha').select().focus();
        }})
      return false;
    }

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'login/login.php',
      data: {
        ax: 'setLogin',
        param: {
          nome: nome,
          senha: pass
        }
      },
      beforeSend: function (xhr) {
        $('#btnLogin').html('<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i><span class="sr-only"></span>');
        $('#btnLogin').attr('disabled', 'disabled');
      },

      success: function (r) {
        $('#btnLogin').html('<i class="fa fa-sign-in"></i> Entrar');
        $('#btnLogin').removeAttr('disabled');

        if (r.loginErro) {
          show({msg: r.loginErro, close: function () {
              $('#pnLoginId_funcionario').select().focus();
            }});
          return false;
        }

        login = r;
        setAjaxSetup();

        $('#pnLoginMain').animate({
          opacity: .5
        }, 200, function () {
          $('#pnLoginMain').mofo('close');
          $('#pnLoginMain').css('opacity', '1');
        });

        //$('#pnLoginMain').mofo('close');

        $('#preLoad').remove();

        $('#pnNome').html(r.nome);

        call(r);

        $('#pnLoginId_funcionario').val('');
        $('#pnLoginSenha').val('');


      },

      erro: function (r) {
        console.log(r);
      }

    });

  }

  function getLogin(call) {

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'login/login.php',
      data: {
        ax: 'getLogin'
      },
      success: function (r) {

        if (r.loginErro == '') {
          modal(r);
          return false;
        }

        login = r;
        setAjaxSetup();

        $('#preLoad').remove();
        $('#pnNome').html(r.nome);

      }
    });

  }

  function modal(r) {
    $('#pnLoginMain').mofo({
      fullScreen: true,
      closeBtn: false,
      title: r.loja == '' ? 'Rede Real' : r.loja,
      open: function () {
        $('#pnLoginMain .mofo-modal-content').css('background', '#37474f');
      }
    });
  }

  function logout() {
    login = '';
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: 'login/login.php',
      data: {
        ax: 'logout'
      },
      success: function (r) {
        if (r.logout == 'ok')
          modal(r);
      }
    });
  }

  function block(data) {
    var _0xf0cc = ["\x41\x42\x43\x44\x45\x46\x47\x48\x49\x4A\x4B\x4C\x4D\x4E\x4F\x50\x51\x52\x53\x54\x55\x56\x57\x58\x59\x5A\x61\x62\x63\x64\x65\x66\x67\x68\x69\x6A\x6B\x6C\x6D\x6E\x6F\x70\x71\x72\x73\x74\x75\x76\x77\x78\x79\x7A\x30\x31\x32\x33\x34\x35\x36\x37\x38\x39\x2B\x2F\x3D", "", "\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74", "\x63\x68\x61\x72\x41\x74", "\x6C\x65\x6E\x67\x74\x68", "\x6A\x6F\x69\x6E", "\x73\x6C\x69\x63\x65", "\x3D\x3D\x3D"];
    var b64 = _0xf0cc[0];
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = _0xf0cc[1], tmp_arr = [];
    if (!data) {
      return data
    }
    ;
    data = unescape(encodeURIComponent(data));
    do {
      o1 = data[_0xf0cc[2]](i++);
      o2 = data[_0xf0cc[2]](i++);
      o3 = data[_0xf0cc[2]](i++);
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      tmp_arr[ac++] = b64[_0xf0cc[3]](h1) + b64[_0xf0cc[3]](h2) + b64[_0xf0cc[3]](h3) + b64[_0xf0cc[3]](h4)
    } while (i < data[_0xf0cc[4]]);
    ;
    enc = tmp_arr[_0xf0cc[5]](_0xf0cc[1]);
    var r = data[_0xf0cc[4]] % 3;
    return (r ? enc[_0xf0cc[6]](0, r - 3) : enc) + _0xf0cc[7][_0xf0cc[6]](r || 3)
  }


  return {
    getLogin: getLogin,
    setLogin: setLogin,
    logout: logout
  };
})();

function setAjaxSetup() {
  $.ajaxSetup({
    data: {
      redeReal: login.redeReal
    }
  });
}


loginPW.getLogin(function () {});