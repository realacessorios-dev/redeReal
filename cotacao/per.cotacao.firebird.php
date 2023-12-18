<?php

include_once './class.crud.firebird.php';
extract($_POST);

class Cotacao extends crudFirebird {


  public function getPedido($param) {
    parent::getPedido($param);
    $this->retornoJson();
  }
  
  public function getTrasnportadora() {
      parent::getTrasnportadora();
      $this->retornoJson();
  }

}


/* sempre no final do documento */
$class = new $class($id_sociedade);
$class->$call(@$param);
