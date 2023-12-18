<?php

session_cache_limiter(1);
ob_start();
session_start();

extract($_POST);

class firebird {
    
}

if (isset($redeReal)) {
    if ($redeReal == $_SESSION['redeReal']) {
        $class = new $class($id_sociedade);
        $class->$call(@$param);
    }
}

