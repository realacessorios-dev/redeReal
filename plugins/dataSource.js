//      <div id="pnDS">
//         <input type="range" name="intevalo" min="1" max="10">
//
//         <span>Nome</span>
//         <input type="text" class="obr btClear" name="NOME">
//         <input type="text" name="campo2">
//         <textarea name="campo4"></textarea>
//         <select name="campo5" >
//            <option value="-1">select one</option>
//            <option value="aa">aa</option>
//            <option value="bb">bb</option>
//         </select>
//         <a href="aaa" name="campo7"></a>
//
//         <input type="radio" name="sexo" value="M">M
//         <input type="radio" name="sexo" value="F">F
//
//
//         SIM<input type="checkbox" name="campo8">
//         NAO<input type="checkbox" name="campo9">
//
//         <input type="time" name="campo19">
//
//         <img name="imagem">
//
//         <div name="campo3">div3</div>
//
//         <input type="text" name="soma">
//
//      </div>
//         var dd = {intevalo: 8.123, imagem: 'add.png', NOME: 'Romulo', campo3: 'novamente', campo19: '1231', campo4: 'meu textArea', sexo: 'M', campo5: 'bb',
//           campo8: true, campo9: false,
//           campo7: 'meulink', id: 1, campo2: 'asfasf'};
//
//         dd['soma'] = '';

//         $('#pnDS').getDataSource(dd);

//         $('#pnDS').getDataSource({
//           source: dd,
//           field: {
//             NOME: {compare: 'valor'},
//             campo3: {render: meuRender},
//             soma: {compare: 'soma'}
//           },
//           compare: {
//             soma: {
//               dataField: ['intevalo', 'id'],
//               call: function (e) {
//                 console.log(e);
//                 return parseInt(e.intevalo) + parseInt(e.id);
//               }
//             },
//             valor: {
//               dataField: ['NOME', 'campo4'],
//               call: function (e) {
//                 return e.NOME + ' ' + e.campo4;
//               }
//             },
//             legal: {
//               dataField: ['campo3'],
//               call: function (e) {
//                 return e.campo3;
//               }
//             }
//           }
//         });

$.fn.getDataSource = function (argument) {
  var element = this;
  var argDefalt = {
    source: {},
    field: {},
    compare: {},
    render: {}
  };
  if (argument.source === undefined) {
    argDefalt.source = argument;
  }



  var arg = $.extend(argDefalt, argument);

//  console.log(arg.source);
  if (arg.source[0] !== undefined)
    arg.source = arg.source[0];

  $.each(arg.source, function (field, value) {

    try {
      var type = element.find('[name="' + field + '"]')[0].type;

      if (arg.field[field] !== undefined) {

        value = arg.field[field].render !== undefined ? arg.field[field].render(value) : value;
        if (arg.compare[arg.field[field].compare] !== undefined) {
          var dataField = {}; //criar os paramentros com os valores

          $.each(arg.compare[arg.field[field].compare].dataField, function (e, a) {
            dataField[a] = arg.source[a];
          });
          dataField['value'] = value;
          value = arg.compare[arg.field[field].compare].call(dataField);
        }

      }



      switch (type) {
        case undefined:
          var typeEle = element.find('[name="' + field + '"]')[0].localName;
          if (typeEle === 'img') {
            element.find('[name="' + field + '"]').attr('src', value);
          } else
            element.find('[name="' + field + '"]').html(value);
          break;
        case 'text':
        case 'password':
        case 'textarea':
        case 'number':
        case 'tel':
        case 'date':
        case 'time':
        case 'range':
        case 'hidden':
          element.find('[name="' + field + '"]').val(value);
          break;
        case 'radio':
          element.find('[name="' + field + '"][value="' + value + '"]').prop('checked', true);
          break;
        case 'select-one':
          element.find('[name="' + field + '"]').val(value).change();
          break;
        case 'checkbox':
          element.find('[name="' + field + '"]').prop('checked', value);
          break;
        case '': //href
          element.find('[name="' + field + '"]').attr('href', value).html(value);
          break;
      }

    } catch (e) {
    }

  });
};

//pega o que esta na tela e devolve para o array de objeto;
$.fn.setDataSource = function (source) {
  var element = this;
  var fields = element.find('input, textarea, select').serializeArray();
  $.each(fields, function (i, a) {
    source[a.name] = a.value;
  });

  element.find('[name]').each(function (i, a) {
    if ($(this).prop('type') === 'checkbox') {
      source[$(this).attr('name')] = $(this).is(':checked');
    }
  });

};

//$('#pnDS').setDataSourceField(dd, 'campo2', 'tete');
$.fn.setDataSourceField = function (source, field, value) {
  var element = this;
  source[field] = value;

  // this.find('[name="' + field + '"]').val(value);
  var type = element.find('[name="' + field + '"]')[0].type;

  switch (type) {
    case undefined:
      var typeEle = element.find('[name="' + field + '"]')[0].localName;
      if (typeEle === 'img') {
        element.find('[name="' + field + '"]').attr('src', value);
      } else
        element.find('[name="' + field + '"]').html(value);
      break;
    case 'text':
    case 'password':
    case 'textarea':
    case 'number':
    case 'tel':
    case 'date':
    case 'time':
    case 'range':
      element.find('[name="' + field + '"]').val(value);
      break;
    case 'radio':
      element.find('[name="' + field + '"][value="' + value + '"]').prop('checked', true);
      break;
    case 'select-one':
      element.find('[name="' + field + '"]').val(value).change();
      break;
    case 'checkbox':
      element.find('[name="' + field + '"]').prop('checked', value);
      break;
    case '': //href
      element.find('[name="' + field + '"]').attr('href', value).html(value);
      break;
  }


};

/**
 * 
 * @param {type} obj1
 * @param {type} obj2
 * @returns {retorna um objeto com dois objeto com a diferença dos dois passados}
 */
function diferencaTwoObject(obj1, obj2) {
  var objOld = {};
  var objNew = {};

  //  console.log(novo['nome']);
  $.each(obj1, function (oldField, oldValue) {
    if (obj2[oldField] !== oldValue) {
      objOld[oldField] = oldValue;
      objNew[oldField] = obj2[oldField];
    }
  });

  if (Object.keys(objNew).length > 0)
    return {'objOld': objOld, 'objNew': objNew};
  else
    return false;
}

$.fn.clearFields = function () {
  var element = this;

  element.find('[name]').each(function (i, a) {
    var type = $(this).prop('type');
    switch (type) {
      case undefined:
        var typeEle = $(this).prop('localName');
        if (typeEle === 'img') {
          $(this).attr('src', '');
        } else
          $(this).html('');
        break;
      case 'text':
      case 'password':
      case 'textarea':
      case 'number':
      case 'tel':
      case 'date':
      case 'time':
      case 'range':
      case 'hidden':
        $(this).val('');
        break;
      case 'radio':
        $(this).prop('checked', false);
        break;
      case 'select-one':
        $(this).val('').change();
        break;
      case 'checkbox':
        $(this).prop('checked', false);
        break;
      case '': //href
        $(this).attr('href', '').html('');
        break;
    }

  });

};
