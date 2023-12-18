<?php
set_time_limit(600);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");


extract($_POST);

if($ax == 'file'){

$meses = array('', 'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro');

  if($manual == 'true'){
   $dt = array();
   $dt[0] = intval($MES);
   $dt[1] = $ANO;
  } else {
   $dt = explode('/', date('m/Y', strtotime($ANO.'-'. $MES .'-1 first day of -1 month')));
   $dt[0] = intval($dt[0]);
 }

$loja = array(
    '05.318.826.0001-17'=>'casa', 
    '38.068.284.0001-20'=>'latas_leste',
    '03.806.881.0001-20'=>'capa',
    '04.433.761.0001-98'=>'shn', 
    '05.849.121.0001-26'=>'central', 
    '07.182.114.0001-49'=>'multimarcas', 
    '10.269.336.0001-08'=>'sobradinho', 
    '05.018.326.0001-60'=>'centro_latas', 
    '08.304.463.0001-59'=>'df_acessorios', 
    '08.532.116.0001-83'=>'federal', 
    '28.697.641.0001-66'=>'real_paraiso',
    '111'=>'contorno'
);


$pasta = $loja[$cnpj] .'/xml/'. $dt[1] . '-' . $meses[$dt[0]];


if (is_dir($pasta))
   if (!file_exists($pasta . '.zip')){

    shell_exec('cd /home/storage/8/49/b9/realacessorios/public_html/lojas/' . 
      $loja[$cnpj] .'/xml/' . ' && zip -r ' . $dt[1] . '-' . $meses[$dt[0]] . '.zip ' . $dt[1] . '-' . $meses[$dt[0]]);


       if (file_exists($pasta . '.zip'))
         shell_exec('rm -rf /home/storage/8/49/b9/realacessorios/public_html/lojas/' . $pasta);
       
   echo '{"ok":"ok"}';
   
} else {
echo '{"ok":"ja foi"}';
}


}


//9 8424-0018  9.9256-8466  
