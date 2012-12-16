<?php

	$username="ncv_user";
	$password="como45$";
	$server="localhost";
	$database="notjustmycv";
	
	$con = mysql_connect($server,$username,$password);
	if (!$con)
	  {
	  die('Could not connect: ' . mysql_error());
	  }
	mysql_select_db($database, $con);
 
	
?>