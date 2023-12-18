<script src="https://github.com/niklasvh/html2canvas/releases/download/0.4.1/html2canvas.js" type="text/javascript"></script>

<title>Metas</title>

<div class="container">

    <div class="nova" id="app">

        <div class="right-align row">
            <div class="col s12 l5">
                <div id="pnLojas">
                    <label>Lojas</label><br>
                    <select name="loja" id="SelectLoja">
                        <option value="0">&lt;&lt; Todas Lojas &gt;&gt;</option>
                        <option v-for="loja in lojas" :value="loja.id_sociedade">{{ loja.loja }}</option>
                    </select>
                </div>
            </div>
            <div class="col s5 l2">

                <!--<label>Mês</label><br>-->
                <!--<div class="right-align">-->
                <!--                <select id="slMes" :value="MES">
                    <option value="01">JANEIRO</option>
                    <option value="02">FEVEREIRO</option>
                    <option value="03">MARÇO</option>
                    <option value="04">ABRIL</option>
                    <option value="05">MAIO</option>
                    <option value="06">JUNHO</option>
                    <option value="07">JULHO</option>
                    <option value="08">AGOSTO</option>
                    <option value="09">SETEMBRO</option>
                    <option value="10">OUTUBRO</option>
                    <option value="11">NOVEMBRO</option>
                    <option value="12">DEZEMBRO</option>
                </select>-->
                <label>Data Inicial</label><br>
                <input type="text" id="edtInicial" class="dataInicial center-align">

            </div>
            <div class="col s3 l2">
                <!--                <label>Ano</label><br>
                                <input type="text" id="edtAno" placeholder="ANO" :value="ANO" >-->
                <label>Data Final</label><br>
                <input type="text" id="edtFinal" class="dataFinal center-align">

            </div>
            <div class="col s1 l2">
                <label>Feriado</label><br>
                <input type="text" title="Feriados nos úteis" v-model="qtoFeriado">

            </div>
            <div class="col s2 l1">
                <button id="btnLoc" onclick="metas.getMetas()" class="btn-floating waves-effect waves-light blue-grey darken-2"> <i class="fa fa-search"></i> </button>
            </div>
        </div>
        <div class="center-align" id="myLoad"> </div>

        <div>
            <span>Dias corridos {{ qtoDiasUteisCorridos }}</span> <span>dias uteis {{ (qtoDiasUteis - qtoFeriado) }}</span>
        </div>
        <!--        <table class="table">
            <thead>
                <tr>
                    <th>Loja</th>

                    <th>Meta Geral </th>
                    <th>Venda Geral</th>
                    <th>%Geral</th>

                    <th>dia</th>
                    <th>p</th>


                    <th>Meta Mercado</th>
                    <th>Venda Mercado</th>
                    <th>%Mercado</th>

                    <th>dia</th>
                    <th>p</th>



                </tr>
            </thead>
            <tbody>
                <tr v-for="meta in metas">
                    <td>{{ meta.loja }}</td>

                    <td>{{ meta.meta_geral | formatValor }}</td>
                    <td>{{ meta.venda_geral | formatValor }}</td>
                    <td>{{ meta.venda_geral / meta.meta_geral * 100  | formatValor }}</td>

                    <td>{{ meta.venda_geral / qtoDiasUteisCorridos | formatValor }}</td>
                    <td>{{ (meta.venda_geral / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)  | formatValor }} - {{ ((meta.venda_geral / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)) / meta.meta_geral * 100  | formatValor }}</td>


                    <td>{{ meta.meta_mercado | formatValor }}</td>
                    <td>{{ meta.venda_mercado | formatValor }}</td>
                    <td>{{ meta.venda_mercado / meta.meta_mercado * 100  | formatValor }}</td>

                    <td>{{ meta.venda_mercado / qtoDiasUteisCorridos | formatValor }}</td>
                    <td>{{ (meta.venda_mercado / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado) | formatValor }} - {{ ((meta.venda_mercado / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)) / meta.meta_mercado * 100  | formatValor }}</td>

                </tr>
            </tbody>
        </table>-->



        <span style="font-size: 22px">Meta Geral Local</span>
        <table class="table resumo">
            <thead>
                <tr>
                    <th>Loja</th>

                    <th>%Geral</th>
                    <th>Media Dia</th>
                    <th>Previsão</th>
                    <th>xxx</th>
                    <th>xxx</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="meta in metas">
                    <td>{{ meta.loja }}</td>

                    <td>{{ meta.venda_geral / meta.meta_geral * 100  | formatValor }}%</td>
                    <td>{{ meta.venda_geral / qtoDiasUteisCorridos | formatValor }}</td>
                    <td>{{ ((meta.venda_geral / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)) / meta.meta_geral * 100  | formatValor }}%</td>

                    <td>{{meta.meta_geral - meta.venda_geral | formatValor }}</td>
                    <td>{{ (meta.meta_geral - meta.venda_geral) / ((qtoDiasUteis - qtoFeriado) - qtoDiasUteisCorridos) | formatValor }}</td>

                </tr>
            </tbody>
        </table>

        <hr>


        <div id="pnMeta">



            <span style="font-size: 22px">Meta Geral</span>
            <table class="table resumo">
                <thead>
                    <tr>
                        <th width="5"></th>
                        <th>Loja</th>

                        <th>%Geral</th>
                        <th>Media Dia</th>
                        <th>Desejado</th>
                        <th>Previsão</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(meta, i) in metas">
                        <td>{{ i+1 }}</td>
                        <td>{{ meta.loja }}</td>

                        <td>{{ meta.venda_geral / meta.meta_geral * 100  | formatValor }}%</td>
                        <td>{{ meta.venda_geral / qtoDiasUteisCorridos | formatValor }}</td>

                        <td>{{ (meta.meta_geral - meta.venda_geral) / ((qtoDiasUteis - qtoFeriado) - qtoDiasUteisCorridos) | formatValor }}</td>

                        <td>{{ ((meta.venda_geral / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)) / meta.meta_geral * 100  | formatValor }}%</td>

                    </tr>
                </tbody>
            </table>

            <span style="font-size: 22px">Meta Mercado</span>
            <table class="table resumo">
                <thead>
                    <tr>
                        <th width="5"></th>
                        <th>Loja</th>

                        <th>%Mercado</th>
                        <th>Media Dia</th>
                        <th>Desejado</th>
                        <th>Previsão</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(meta, i) in metas" class="meta">
                        <td>{{ i+1 }}</td>
                        <td>{{ meta.loja }}</td>

                        <td>{{ meta.venda_mercado / meta.meta_mercado * 100  | formatValor }}%</td>
                        <td>{{ meta.venda_mercado / qtoDiasUteisCorridos | formatValor }}</td>

                        <td>{{ (meta.meta_mercado - meta.venda_mercado) / ((qtoDiasUteis - qtoFeriado) - qtoDiasUteisCorridos) | formatValor }}</td>

                        <td>{{ ((meta.venda_mercado / qtoDiasUteisCorridos) * (qtoDiasUteis - qtoFeriado)) / meta.meta_mercado * 100  | formatValor }}%</td>

                    </tr>
                </tbody>
            </table>

        </div>


        <div class="right-align">
            <button class="btn" onclick="metas.pnModalImage()"> Imagen </button>
        </div>


        <span style="font-size: 22px">Meta das Lojas</span>
        <table class="table resumo">
            <thead>
                <tr>
                    <th>Loja</th>

                    <th>Meta Geral</th>
                    <th>Venda</th>

                    <th>Meta Mercado</th>
                    <th>Venda</th>

                    <th>Meta Mecânica</th>
                    <th>Venda</th>


                </tr>
            </thead>
            <tbody>
                <tr v-for="meta in metas">
                    <td>{{ meta.loja }}</td>

                    <td>{{ meta.meta_geral | formatValor }}</td>
                    <td>{{ meta.venda_geral | formatValor }}</td>

                    <td>{{ meta.meta_mercado | formatValor }}</td>
                    <td>{{ meta.venda_mercado | formatValor }}</td>

                    <td>{{ meta.meta_mecanica | formatValor }}</td>
                    <td>{{ meta.mecanica | formatValor }}</td>

                </tr>
            </tbody>
        </table>


        <div id="pnImg">
            <div id="img-out"></div>
        </div>


        <div id="chat"></div>





        <div id="pnCodigoTela">metas</div>
        <script src="metas/metas.js" type="text/javascript"></script>

        <style>
            .table td {
                padding: 8px;
                font-size: 18px !important;
            }
        </style>