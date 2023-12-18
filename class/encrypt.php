<?php

/* * *
 * como usar
 * encript::encode('fraze');
 * encript::decode('RnJhbmNpc2Nv');
 */

abstract class encript {

  const key = "RnJhbmNpc2Nv";    // chave da criptografia max 24 caracteres


  static public function encode($str) {
    $input = $str;
    $rnd = rand(10000000, 99999999);
    $td = mcrypt_module_open('tripledes', '', 'ecb', '');
    mcrypt_generic_init($td, self::key, $rnd);
    $encrypted_data = mcrypt_generic($td, $input);
    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);
    return base64_encode($encrypted_data);
  }


  static public function decode($str) {
    $input = base64_decode($str);
    return mcrypt_decrypt("tripledes", self::key, $input, "ecb");
  }

}


function realEncryp($value, $key = '') {
  if ($key == '')
    $key = 'YUQL23KL23DF90WI5E1JAS467NMCXXL6JAOAUWWMCL0AOMM4A4VZYW9KHJUI2347EJHJKDF3424SKL K3LAKDJSL9RTIKJ';

  $KeyPos = 0;
  $OffSet = rand(1, 256);
  $Dest = str_pad(dechex($OffSet), 2, '0', STR_PAD_LEFT);
  $SrcPos = 1;
  while ($SrcPos <= strlen($value)) {
    $SrcAsc = (ord(substr($value, $SrcPos - 1, 1)) + $OffSet) % 255;
    $KeyPos = $KeyPos < strlen($key) ? $KeyPos + 1 : 1;
    $SrcAsc = $SrcAsc ^ ord(substr($key, $KeyPos - 1, 1));
    $Dest = strtoupper($Dest . str_pad(dechex($SrcAsc), 2, '0', STR_PAD_LEFT));
    $OffSet = $SrcAsc;
    $SrcPos++;
  }
  return $Dest;
}


function realDecryp($value, $key = '') {
  if ($key == '')
    $Key = 'YUQL23KL23DF90WI5E1JAS467NMCXXL6JAOAUWWMCL0AOMM4A4VZYW9KHJUI2347EJHJKDF3424SKL K3LAKDJSL9RTIKJ';

  $KeyPos = 0;
  $OffSet = hexdec(substr($value, 0, 2));
  $Dest = '';
  $SrcPos = 3;
  while ($SrcPos <= strlen($value)) {
    $SrcAsc = hexdec(substr($value, $SrcPos - 1, 2));
    $KeyPos = $KeyPos < strlen($key) ? $KeyPos + 1 : 1;
    $TmpSrcAsc = $SrcAsc ^ ord(substr($key, $KeyPos - 1, 1));
    $TmpSrcAsc = $TmpSrcAsc <= $OffSet ? 255 + $TmpSrcAsc - $OffSet : $TmpSrcAsc - $OffSet;
    $Dest = $Dest . chr($TmpSrcAsc);
    $OffSet = $SrcAsc;
    $SrcPos = $SrcPos + 2;
  }
  return $Dest;
}
