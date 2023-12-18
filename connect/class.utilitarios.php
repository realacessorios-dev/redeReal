<?php

class Utilitarios {

  /**
    a função recebe DD/MM/AAAA ou AAAA/MM/DD
    retorna a data passada invertida
    exemplo(1) = (01/02/2003, '-') retorna 2003-02-01
    exemplo(2) = (2003/02/01) retorna 01/02/2003
    @params Date required
    @params separatorOut opcional
   */
  function formatDate($data, $separatorOut = '/') {
    if (strpos($data, '-'))
      $separator = '-';
    else
      $separator = '/';

    $dt = explode($separator, $data);
    $dia = $dt[0];
    $mes = $dt[1];
    $ano = $dt[2];
    // $mes = str_pad($mes, 2, '0', STR_PAD_LEFT);
    if ($data != '')
      return $ano . $separatorOut . $mes . $separatorOut . $dia;
    else
      return "";
  }

  /**
    a função recebe DD/MM/AAAA H:M:S ou AAAA/MM/DD H:M:S
    retorna a data passada invertida
    exemplo(1) = (01/02/2003, '-') retorna 2003-02-01 10:12:59
    exemplo(2) = (2003/02/01) retorna 01/02/2003 10:12:59
    @params Date required
    @params separatorOut opcional
   */
  function formatDateTime($data, $separatorOut = '/') {
    $dt = explode(' ', $data);
    $data = $this->formatDate($dt[0], $separatorOut);
    echo $data . ' ' . $dt[1];
  }

  /**
   * Retorna a string sem acentos
   * @param {type} string $palavra
   * @example RemoverAcentos('Brasília')
   * @return string "Brasilia"
   */
  function RemoverAcentos($palavra) {
    $beta = array('a', 'a', 'a', 'a', 'a', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'c',
        'A', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'C');
    $alfa = array('á', 'à', 'ã', 'â', 'ä', 'é', 'è', 'ê', 'ë', 'í', 'ì', 'î', 'ï', 'ó', 'ò', 'õ', 'ô', 'ö', 'ú', 'ù', 'û', 'ü', 'ç',
        'Á', 'À', 'Ã', 'Â', 'Ä', 'É', 'È', 'Ê', 'Ë', 'Í', 'Ì', 'Î', 'Ï', 'Ó', 'Ò', 'Õ', 'Ô', 'Ö', 'Ú', 'Ù', 'Û', 'Ü', 'Ç');
    return str_replace($alfa, $beta, $palavra);
  }

  /**
   * Retorna um valor por extenso
   * @param float
   * @param boolean não obrigatorio (Texto em maiusculo = True);
   * @example extenso(1100,00);
   * @return um mil e cem reais
   */
  function extenso($valor, $maiusculas = false) {

    $singular = array("centavo", "real", "mil", "milhão", "bilhão", "trilhão", "quatrilhão");
    $plural = array("centavos", "reais", "mil", "milhões", "bilhões", "trilhões",
        "quatrilhões");

    $c = array("", "cem", "duzentos", "trezentos", "quatrocentos",
        "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos");
    $d = array("", "dez", "vinte", "trinta", "quarenta", "cinquenta",
        "sessenta", "setenta", "oitenta", "noventa");
    $d10 = array("dez", "onze", "doze", "treze", "quatorze", "quinze",
        "dezesseis", "dezesete", "dezoito", "dezenove");
    $u = array("", "um", "dois", "três", "quatro", "cinco", "seis",
        "sete", "oito", "nove");

    $z = 0;
    $rt = "";

    $valor = number_format($valor, 2, ".", ".");
    $inteiro = explode(".", $valor);
    for ($i = 0; $i < count($inteiro); $i++)
      for ($ii = strlen($inteiro[$i]); $ii < 3; $ii++)
        $inteiro[$i] = "0" . $inteiro[$i];

    $fim = count($inteiro) - ($inteiro[count($inteiro) - 1] > 0 ? 1 : 2);
    for ($i = 0; $i < count($inteiro); $i++) {
      $valor = $inteiro[$i];
      $rc = (($valor > 100) && ($valor < 200)) ? "cento" : $c[$valor[0]];
      $rd = ($valor[1] < 2) ? "" : $d[$valor[1]];
      $ru = ($valor > 0) ? (($valor[1] == 1) ? $d10[$valor[2]] : $u[$valor[2]]) : "";

      $r = $rc . (($rc && ($rd || $ru)) ? " e " : "") . $rd . (($rd &&
              $ru) ? " e " : "") . $ru;
      $t = count($inteiro) - 1 - $i;
      $r .= $r ? " " . ($valor > 1 ? $plural[$t] : $singular[$t]) : "";
      if ($valor == "000")
        $z++;
      elseif ($z > 0)
        $z--;
      if (($t == 1) && ($z > 0) && ($inteiro[0] > 0))
        $r .= (($z > 1) ? " de " : "") . $plural[$t];
      if ($r)
        $rt = $rt . ((($i > 0) && ($i <= $fim) &&
                ($inteiro[0] > 0) && ($z < 1)) ? ( ($i < $fim) ? ", " : " e ") : " ") . $r;
    }

    if (!$maiusculas) {
      return($rt ? $rt : "zero");
    } else {

      if ($rt)
        $rt = ereg_replace(" E ", " e ", ucwords($rt));
      return (($rt) ? ($rt) : "Zero");
    }
  }

  /**
   * Retorna a diferença entre datas, pode retornar em dias ou meses
   *
   * @param string $start - Data inicial no format Y-m-d
   * @param string $return  - Data final no format Y-m-d, se for vazio é preenchido com a data de hoje
   * @example getDateDiff('2011-10-11','2011-11-20');
   * @return string
   */
  function getDateDiff($start, $end = "NOW", $return = 'days') {
    //Transforma a data inicial em time
    $sdate = strtotime($start);
    //Transforma a data final em time
    $edate = strtotime($end);
    //Faz o cálculo para achar a diferença em dias
    $pday = ($edate - $sdate) / 86400;
    //Faz o cálculo para achar a diferença em menses
    $pmonth = $pday / 30;
    if ($return == 'days')
      $r = explode('.', $pday);
    elseif ($return == 'months')
      $r = explode('.', $pmonth);
    return $r[0];
  }

  /**
   *
   * @param type $valor
   * @return type
   */
  function FormatoValorUSA($valor) {
    return number_format($valor, 2, ',', '.');
  }

  public function getDataHoraServidor() {
    $sql = 'SELECT
            EXTRACT(DAY FROM CURRENT_DATE) AS DIA,
            EXTRACT(MONTH FROM CURRENT_DATE) AS MES,
            EXTRACT(YEAR FROM CURRENT_DATE) AS ANO,
            EXTRACT(HOUR FROM CURRENT_TIME) AS H,
            EXTRACT(MINUTE FROM CURRENT_TIME) AS M,
            EXTRACT(SECOND FROM CURRENT_TIME) AS S
            FROM RDB$DATABASE';
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

  public function getDuplicado($tabela, $campo, $valor) {
    $sql = "SELECT FIRST 1 $campo FROM $tabela
            WHERE $campo = '$valor'";
    $this->pdo = $this->con->prepare($sql);
    $this->pdo->execute();
  }

}
