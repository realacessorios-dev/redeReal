$.ajaxSetup({
    type: 'POST',
    dataType: 'json',
    data: {
        class: 'Cotadores'
    },
    url: 'per.cotadores.php'
});

$(function () {

    getProdutoGanhoID();

});


function getProdutoGanhoID() {
    $.ajax({
        data: {
            call: 'getProdutoGanhoID',
            param: {
                id: id
            }
        },
        beforeSend: function (xhr) {

        },
        success: function (r) {
            $('#pnRazao').html(r.loja[0].razao_social.substr(0, 43));
            $('#pnDate').html(r.data);
            $('#pnEndereco').html(r.loja[0].endereco);
            $('#pnCNPJ').html(r.loja[0].cnjp);
            $('#pnCidade').html(r.loja[0].cidade);
            $('#pnBairro').html(r.loja[0].bairro);
            $('#pnCEP').html(r.loja[0].cep);
            $('#pnInscricao').html(r.loja[0].incricao);
            $('#pnTel').html(r.loja[0].telefone);
            $('#pnNumCotacao').html(r.num_pedido);
            $('#pnObs').html(r.obs.obs);


            var html = '<table>' +
                    '<tr>' +
                    '<th width="70">Meu Código</th>' +
                    '<th width="80">Nº Fabricante</th>' +
                    '<th>Descrição Produto</th>' +
                    '<th width="112">Carro</th>' +
                    '<th width="50" class="last">Quant</th>' +
                    '<th width="70" class="last">Valor</th>' +
                    '</tr>';
            $.each(r.produto, function (i, ln) {
                var meuCodigo = ln.meu_codigo != null ? ln.meu_codigo : '&nbsp;';
                html += '<tr>' +
                        '<td>' + meuCodigo + '</td>' +
                        '<td>' + ln.num_fabricante + '</div></td>' +
                        '<td>' + ln.desc_produto + '</div></td>' +
                        '<td>' + ln.carro + '</div></td>' +
                        '<td><div class="center-align">' + ln.qto + '</div></td>' +
                        '<td><div class="right-align">' + util.formatValor(ln.valor) + '</div></td>' +
                        '</tr>';
            });
            html += '</table>';
            $('#pnItens').html(html);


            console.log(r);
        }
    });

}