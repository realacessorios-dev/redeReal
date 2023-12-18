/*
 *
 * @author Francisco Alves 16/09/2016
 * @default Mofo Dialog
 *
 * **************************************************************************
 * @param {title} (string) titulo do Dialog
 * @example title : 'Mofo'; titulo pode ser setado direto no html ou js, no html <div title="Mofo"></div>
 *
 * **************************************************************************
 * @param {buttons} (objeto) lista de botões
 * @example buttons: {
 *                    buttons: {
 *                             OK: function () {
 *                                  $('#exemplo8').mofo('close');
 *                             },
 *                             New: {
 *                               click: function () {
 *                                 console.log('asdf');
 *                               },
 *                               html: '<i class="fa fa-trash" aria-hidden="true"></i> New Button',
 *                               style: 'float:left',
 *                               id: 'meuID'
 *                             }
 * **************************************************************************
 *
 * @param {close} (objeto) callback quando fechar o dialog dispara o evento close
 * @example close:function(){ . . .}
 *
 * **************************************************************************
 * @param {open} (objeto) callback quando abrir o modal dispara o evento open
 * @example open:function(){ . . .}
 *
 * **************************************************************************
 * @param {width} (px ou %) altura do dialog default 80%
 * @example width:100 or width:'50%'
 *
 * **************************************************************************
 * @param {height} (px ou %) largura do dialog default 80%
 * @example height:100 or height:'50%'
 *
 * **************************************************************************
 * @param {left} (px ou %) esquerda do navegador default 50%
 * @example left:100 or left:'50%'
 *
 * **************************************************************************
 * @param {top} (px ou %) topo do navegador default 50%
 * @example top:100 ou top:'50%'
 *
 * **************************************************************************
 * @param {fullScreen} (boolean) modal abre em modo cheio
 * @example fullScreen:true
 *
 * **************************************************************************
 * @param {autoOpen} (boolean) abre o modal assim que for criado
 * @example autoOpen:false não abre o dialog automaticamente ao ser criado default true
 *
 * **************************************************************************
 * @param {closeBtn} (boolean) oculta o botão de fechar, e desabilita a pressionar do Esc
 * @example closeBtn:false não exibe o botão close da barra de titulo e não funciona a tecla esc default true
 *
 * **************************************************************************
 * @param {esc} (boolean) desabilita o pressionar do Esc
 * @example esc:false desabilita o fechamento do dialog atual pela a tecla esc default true
 *
 * **************************************************************************
 * @param {modal} (boolean) desabilita o modal, libera o backgroud
 * @example modal:false libera a manipulação do backgroud default true
 *
 * **************************************************************************
 * @param {noTitleDisplay} (boolean) não header, remove o display do titulo dialog
 * @example noTitleDisplay:true oculta a barra de titulo do dialog default false
 *
 * * **************************************************************************
 * @param {execAfter} (objeto) fecha o dialog automatico apos o tempo esgotado
 * @example execAfter: {time: 10, btn: 1} time o tempo para executar, btn qual o botão que será executado
 *
 * **************************************************************************
 * @param {keyDown} (objeto) lista de evento para o keyDown, quando o dialog estiver aberto
 * @observação = quando for usar ctrl shift e alt, terá que obedeser a seginte order 1º(CTRL) 2º(SHIFT) 3º(ALT) 4º(KEY_CODE)
 * @example keyDown:{
 *
 *                    f1:{ *f1 é o nome do objeto*
 *                      key:'112', *112 é o code da tecla f1*
 *                      call:function(){. . . } *exec executa a função contida no bloco*
 *                    },
 *
 *
 *             'ctrl_F1':{
 *                      key:'ctrl+112',
 *                      call:function(){. . . }
 *                     },
 *       'ctrl_shift_F1':{
 *                      key:'ctrl+shift+112',
 *                      call:function(){. . . }
 *                     },
 *   'ctrl_shift_alt_F1':{
 *                      key:'ctrl+shift+alt+112',
 *                      call:function(){. . . }
 *                     }
 *                  }
 *
 *@example de Uso
 * $('#identificador').mofo({
 *        title:'mofo',
 *        width:'80%',
 *        height:'50%',
 *        left:'50%',
 *        top:'50%',
 *        fullScreen: false,
 *        autoOpen: true,
 *        closeBtn: true,
 *        esc: true,
 *        modal: true,
 *        noTitleDisplay: false,
 *        execAfter: {time: 10, btn: 1},
 *        open:function(){ . . . },
 *        close:function(){ . . . },
 *        buttons:{
 *               SIM:function(){ . . . },
 *               'NÃO':function(){ . . . },
 *               Btn:{
 *                   html:'<i class="fa fa-trash" aria-hidden="true"></i> Deletar',
 *                   click:function(){},
 *                   style:'font-size:10px'
 *                  }
 *               },
 *
 *       keyDown:{
 *              F1:{
 *                key:112,
 *                call:function(){ . . .}
 *              },
 *         ctrl_P:{
 *              key:'CTRL+80',
 *              call:function(){ . . . }
 *             }
 *        }
 *     });
 *
 * **** minimo para criar o dialog *****
 *  $('#identificador').mofo();
 *
 *
 * **** abrir dialog **********
 *   $('#identificador').mofo('open');
 *
 * **** close dialog **********
 *   $('#identificador').mofo('close');
 *
 * **** focus no botao **********
 * $('#identificador').mofo('focus','1');
 *
 * **** click do botao **********
 * $('#identificador').mofo('click','1');
 *
 * **** destroy dialog **********
 *   $('#identificador').mofo('destroy');
 *
 * **** getModalHasOpen dialog **********
 * **** return false se nem um dialog estiver aberto ****
 * **** return true se tiver algum dialog aberto
 *  mofoControl.getModalHasOpen();
 *
 *
 */

var hashMofoModal = false;

$.fn.mofo = function (argument, param1) {
    var element = this;
    var argDefalt = {
        title: this.attr('title') === undefined ? '&nbspMensagem do Sistema' : this.attr('title'),
        buttons: {},
        close: {},
        open: {},
        width: 'default',
        height: 'default',
        left: '0',
        top: '0',
        fullScreen: false,
        autoOpen: true,
        closeBtn: true,
        execAfter: {},
        esc: true,
        modal: true,
        noTitleDisplay: false,
//        footer: false,
        keyDown: {}
    };
    var arg = $.extend(argDefalt, argument);
    if (typeof argument === 'string') {

        /* focus no botao
         * $('#exemplo8').mofo('focus','1')*/
        if (argument.toUpperCase() === 'FOCUS') {
            $(document).find(element).find('.mofo-btn')[param1].focus();
        }


        /* execulta a ação do botao
         * $('#exemplo8').mofo('click','1')*/
        if (argument.toUpperCase() === 'CLICK') {
            $(document).find(element).find('.mofo-btn')[param1].click();
        }

        if (argument.toUpperCase() === 'OPEN') {
            open();
        }

        if (argument.toUpperCase() === 'CLOSE') {
            mofoControl.close(element.selector.substr(1));
        }

        if (argument.toUpperCase() === 'DESTROY') {
            element.css({'display': 'none', left: '', top: '', transform: '', width: '', height: '', 'z-index': ''});
            delete mofoControl.dialogs.eventoClose[element.selector.substr(1)];
            delete mofoControl.dialogs.eventoOpen[element.selector.substr(1)];
            delete mofoControl.dialogs.keyDown[element.selector.substr(1)];
            delete mofoControl.dialogs.keyEsc[element.selector.substr(1)];
            element.html(element.find('.mofo-modal-content').html()).removeAttr('class').removeAttr('modal');
            mofoControl.close(element.selector.substr(1));
        }
        return false;
    }

    if (element.hasClass('mofo-modal-main')) {
        element.find('.mofo-modal-head span').html(arg.title);
        if (arg.autoOpen)
            setTimeout(function () {
                open();
            }, 100);
        return false;
    }


    element.addClass('mofo-modal-content');
    var id = element.attr('id');
    element.removeAttr('id').css({'display': ''});
    var main = $('<div>', {class: 'mofo-modal-main', id: id}).css({'display': 'none'}).attr('modal', arg.modal);
    element.before(main);
    element.appendTo(main);
    element = $('#' + id);

    var header = $('<div>', {class: "mofo-modal-head"});
    var textHeader = $('<span>', {html: arg.title});
    var btnClose = $('<button>', {class: 'mofo-btn mofo-btn-close ' + element.selector.substr(1) + 'Close', html: 'X'});

    if (arg.closeBtn) {
        header.append(textHeader).append(btnClose);
        mofoControl.dialogs.keyEsc[element.selector.substr(1)] = true;
    } else {
        header.append(textHeader);
        mofoControl.dialogs.keyEsc[element.selector.substr(1)] = false;
    }

    if (!arg.esc)
        mofoControl.dialogs.keyEsc[element.selector.substr(1)] = false;




    //verifica se tem o foot criado manual mente no html
    if (element.find('.mofo-modal-foot').length === 1)
        element.find('.mofo-modal-foot').insertAfter('.mofo-modal-content');
    else
        var footer = $('<div>', {class: 'mofo-modal-foot'});


    if (!arg.noTitleDisplay)
        element.prepend(header);


//    criar botoes;
    $.each(arg.buttons, function (name, btn) {
        var fun = btn;
        var click;
        btn = $.isFunction(btn) ? {click: btn, html: name} : btn;
        btn = $.extend({class: 'mofo-btn mofo-btn-foot'}, btn);
        click = btn.click;
        btn.click = function () {
            click.apply(fun);
        };

        if (element.find('.mofo-modal-foot').length === 1)
            element.find('.mofo-modal-foot').append($("<button>", btn));
        else
            footer.append($("<button>", btn));
    });


    if (Object.keys(arg.buttons).length > 0)
        element.append(footer);

//    else
//    if (arg.footer)
//        element.append(footer);



    var keys = {};
    $.each(arg.keyDown, function (id, obj) {
        keys[String(obj.key).toUpperCase()] = {'call': obj.call};
        mofoControl.dialogs.keyDown[element.selector.substr(1)] = keys;
    });

    if (arg.open.length !== undefined) {
        mofoControl.dialogs.eventoOpen[element.selector.substr(1)] = arg.open;
    }

    if (arg.close.length !== undefined) {
        mofoControl.dialogs.eventoClose[element.selector.substr(1)] = arg.close;
    }

    if (Object.keys(arg.execAfter).length > 0) {
        mofoControl.dialogs.execAfter[element.selector.substr(1)] = arg.execAfter;
    }


    if (arg.width !== 'default') {
        element.css('width', arg.width);
    }
    if (arg.height !== 'default') {
        element.css('height', arg.height);
    }

    if (arg.top !== '0') {
        element.css('top', arg.top);
    }
    if (arg.left !== '0') {
        element.css('left', arg.left);
    }
    if ((arg.left !== '0') || (arg.top !== '0')) {
        var a = arg.left !== '0' ? '0' : '-50%';
        var b = arg.top !== '0' ? '0' : '-50%';
        element.css('transform', 'translate(' + a + ', ' + b + ')');
    }

    if (arg.fullScreen) {
        element.css({
            width: '100%',
            height: '100%',
            transform: 'translate(0, 0)',
            top: 0,
            left: 0,
            'border-radius': '0',
            'max-height': '100%',
            'max-width': '100%'
        });
        element.find('.mofo-modal-content').css({
            padding: 0
        });
        element.find('.mofo-modal-head').css({
            'height': '30px',
            'border-top-left-radius': 0,
            'border-top-right-radius': 0
        });

    }

    element.draggable();

    if (arg.autoOpen)
        setTimeout(function () {
            open();
        }, 100);


    function open() {

//verifica se o modal esta aberto
        if (!(element.selector.substr(1) in  mofoControl.dialogs.dialogsOpen)) {
            mofoControl.dialogs.dialogsOpen[element.selector.substr(1)] = {id: element.selector.substr(1)};
            var zindex = Object.keys(mofoControl.dialogs.dialogsOpen).length + 998;
            $('#' + element.selector.substr(1)).css('z-index', zindex + 1);
            $("body").css("overflow", "hidden");

            hashMofoModal = false;
            window.location.hash = element.selector.substr(1);


            if ($('#' + element.selector.substr(1)).attr('modal') === 'true')
                $('body').append('<div id="' + element.selector.substr(1) + '_Modal" class="mofo-widget-overlay" style="z-index: ' + zindex + '"></div>');
            element.css('display', '');
            if (element.selector.substr(1) in mofoControl.dialogs.eventoOpen)
                mofoControl.dialogs.eventoOpen[element.selector.substr(1)]();

            if (element.selector.substr(1) in mofoControl.dialogs.execAfter)
                mofoControl.execAfterFunc(element.selector.substr(1));

        }

    }

    $(document).on('click', '.' + element.selector.substr(1) + 'Close', function () {
        mofoControl.close(element.selector.substr(1));
    });
};

var mofoControl = (function () {
    var timeExecAfter = {};
    var dialogs = {
        dialogsOpen: {},
        keyEsc: {},
        eventoOpen: {},
        eventoClose: {},
        execAfter: {},
        keyDown: {}
    };

    function close(id) {
        // window.location.hash = '';

        $('#' + id).css('display', 'none');
        $('#' + id + '_Modal').remove();
        if (dialogs.eventoClose[id])
            dialogs.eventoClose[id]();

        if (dialogs.execAfter[id])
            execAfterStop(id);


        delete dialogs.dialogsOpen[id];
        if (Object.keys(dialogs.dialogsOpen).length === 0)
            $("body").css("overflow", 'auto');
    }

    function execAfterFunc(id) {
        var timer = dialogs.execAfter[id].time;
        var numBtn = dialogs.execAfter[id].btn;

        var elem = $('#' + id + '  .mofo-modal-foot button:nth-child(' + numBtn + ')');
        var text = elem.text();
        timeExecAfter[id] = {stop: setInterval(function () {
                timer--;
                elem.html(text + ' <span style="color:#ccc"> (' + timer + ')</span>');

                if (timer <= 0) {
                    elem.html(text);
                    elem.click();
                    clearInterval(timeExecAfter[id].stop);
                }
            }, 1000), text: text, numBtn: numBtn};
    }

    function execAfterStop(id) {
        clearInterval(timeExecAfter[id].stop);
        $('#' + id + '  .mofo-modal-foot button:nth-child(' + timeExecAfter[id].numBtn + ')').text(timeExecAfter[id].text);
    }

    function getModalHasOpen() {
        if (Object.keys(mofoControl.dialogs.dialogsOpen).length > 0)
            return true;
        else
            return false;
    }

    $(document).keydown(function (e) {

        if (Object.keys(mofoControl.dialogs.dialogsOpen).length > 0) {

            var id = mofoControl.dialogs.dialogsOpen[Object.keys(mofoControl.dialogs.dialogsOpen)[Object.keys(mofoControl.dialogs.dialogsOpen).length - 1]].id;
            if (e.keyCode === 27) {
                if (mofoControl.dialogs.keyEsc[id])
                    mofoControl.close(id);
                return false;
            }

            var ctrlKey = e.ctrlKey ? 'CTRL+' : '';
            var shiftKey = e.shiftKey ? 'SHIFT+' : '';
            var altKey = e.altKey ? 'ALT+' : '';
            var key = ctrlKey + shiftKey + altKey + e.keyCode;

            if (dialogs.keyDown[id])
//      if (Object.keys(dialogs.keyDown[id]).length > 0)
                try {
                    if (dialogs.keyDown[id][key]) {
                        dialogs.keyDown[id][key].call(e);
                        if (e.preventDefault)
                            e.preventDefault();
                        if (e.stopPropagation)
                            e.stopPropagation();
                        return false;
                    }
                } catch (e) {
                    return false;
                }

        }

    });



    return {
        close: close,
        dialogs: dialogs,
        getModalHasOpen: getModalHasOpen,
        execAfterFunc: execAfterFunc
    };


})();

$.fn.draggable = function () {
    //para touch
    var offset = null;
    var that = $(this).find('.mofo-modal-head');
    var elem = $(this);

    var ww = window.innerWidth - elem.outerWidth(true);
    var hh = window.innerHeight - elem.outerHeight(true);


    that.on("touchstart", function (e) {
        var orig = e.originalEvent;
        var pos = $(this).parent().position();
        offset = {
            x: orig.changedTouches[0].pageX - pos.left,
            y: orig.changedTouches[0].pageY - pos.top
        };
    });
    that.on("touchmove", function (e) {
        elem.css({'transform': 'translate(0, 0)'});
        e.preventDefault();
        var orig = e.originalEvent;
        elem.css({
            top: orig.changedTouches[0].pageY - offset.y,
            left: orig.changedTouches[0].pageX - offset.x
        });
    });
    var dragging = false;

    that.on('mousedown', function (e) {
        var orig = e.originalEvent;
        var pos = $(this).parent().position();
        dragging = true;
        offset = {
            x: orig.pageX - pos.left,
            y: orig.pageY - pos.top
        };
    });

    $(window).on('mousemove', function (e) {
        if (dragging) {
            elem.css({'transform': 'translate(0, 0)'});
            e.preventDefault();
            var orig = e.originalEvent;
            var top = orig.pageY - offset.y;
            var left = orig.pageX - offset.x;

            if (hh > top)
                elem.css({top: top > 0 ? top : 0});
            if (ww > left)
                elem.css({left: left > 0 ? left : 0});
        }
    }).mouseup(function () {
        dragging = false;
    });
};
