<?php

	include "db_connection.php";
	
	$sql = "SELECT badge_id, badge_category_id, badge_name, badge_desc, badge_image FROM lu_badges";
	$result = mysql_query($sql);

	$rows = array();
	
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
	{
		$rows[] = $row;
	}
	echo json_encode($rows);
	
	include "db_connection_end.php";
?>