$.ajaxSetup({
  type: 'POST',
  dataType: 'json'
});



$(function () {
  calculadoraXico.criaCalcParaModal();
  ControleKey();
  $("#btnMenuLeft").sideNav();
  $('#pnOnde').html($('#pnPrincipal title').html());

  $(".dropdown-button").dropdown({constrainWidth: false});

});


function ControleKey() {
  $(document).bind('keydown', function (e) {

    //F4 Calculadora
    if (e.keyCode === 115) {
      calculadoraXico.openModal();
      util.stopExecution(e);
    }

//    //CTRL+D consulta peça online
//    if (e.keyCode === 68 && e.ctrlKey) {
//      pecaOnline.getPecaOnline(gridProduto.dataSource().COD_PRODUTO,
//              gridProduto.dataSource().DESC_PRODUTO,
//              gridProduto.dataSource().NUM_FABRICANTE,
//              gridProduto.dataSource().MARCA,
//              gridProduto.dataSource().CARRO);
//      util.stopExecution(e);
//    }

    //CTRL+F show imagem
    if (e.keyCode === 70 && e.ctrlKey) {
      console.log('sfasd');
      foto.getFotos(gridProduto.dataSource().COD_PRODUTO, gridProduto.dataSource().FOTO);
      util.stopExecution(e);
      return false;
    }

  });
}