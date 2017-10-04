<?php

	function pdo_connect() {

	   try {
	      $connection = new PDO('mysql:dbname=dev_mwa_online;host=localhost', 'spaceman', 'spiff', 
	                            array(
	                                    PDO::ATTR_PERSISTENT => TRUE,
	                                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
	                                 )
	                           );
	   	  $connection->exec("set names utf8");
	   }

	   catch (PDOException $e){
	      print "Error!: " . $e->getMessage() . "<br/>";
	      die();
	   }

	   return $connection;
	}
?>
