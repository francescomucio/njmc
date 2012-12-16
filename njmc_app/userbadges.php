<?php

	include "db_connection.php";
	
	$linkedinId = $_GET["linkedin_id"];
	
	$sql =  "SELECT fact_user_badges.badge_id, badge_category_id, badge_name, badge_desc, badge_image FROM lu_badges ";
	$sql .= "INNER JOIN fact_user_badges on fact_user_badges.badge_id = lu_badges.badge_id ";
	$sql .= "WHERE fact_user_badges.linkedin_id = '".$linkedinId."' ";
	$sql .= "AND   fact_user_badges.isDeleted = 0 ";
	$sql .= "ORDER BY fact_user_badges.order ASC";
	
	$result = mysql_query($sql);

	$rows = array();
	
	while($row = mysql_fetch_array($result, MYSQL_ASSOC))
	{
		$rows[] = $row;
	}
	echo json_encode($rows);
	
	include "db_connection_end.php";
?>