<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');

class ConexaoMysql {

    public static function getConectar() {
        try {
            if (!isset($pdo)) {
                $servidor = 'mysql02.realacessorios.com.br';
//                $servidor = '200.234.202.101';
                $usuario = 'realacessorios1';
                $senha = 'alves152056';
                $banco = 'realacessorios1';
//        $servidor = '192.168.100.60';
//        $usuario = 'real';
//        $senha = 'real';
//        $banco = 'financeiro';
                ini_set('default_charset', 'UTF-8');
//        define('CLIENT_LONG_PASSWORD', 1);

                $pdo = new PDO('mysql:host=' . $servidor . ';dbname=' . $banco, $usuario, $senha);

                $pdo->exec("SET NAMES 'utf8';");
                $pdo->setAttribute(PDO::MYSQL_ATTR_INIT_COMMAND, 'SET NAMES utf8');
                //$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            }
        } catch (PDOException $erro) {
            die('Servidor não está respondendo ' . $erro->getMessage());
        }

        return $pdo;
    }

}
