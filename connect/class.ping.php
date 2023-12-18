<?php

/**
 * @return False para OffLine. E True quanto Online
 * @author Alves
 *
 */
class Ping {

  public function Ver($IP, $PORTA) {
    $IPAddress = $IP;
    $Port = $PORTA;
    $fp = @fsockopen($IPAddress, $Port, $errno, $errstr, (float) 0.9);
    if (!$fp) {
      return false; //False
    } else {
      return true; // Online
      fclose($fp);
    }
  }

}
