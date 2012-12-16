<?php

	include "db_connection.php";
	
	$linkedinId = $_POST["linkedin_id"];
	$strBadges = $_POST["badges"]; 			//I need this to semplify the isDeleted udpate
	$badges = str_getcsv ($strBadges, ",");
	
	echo "ciao ";
echo $linkedinId;
echo $strBadges;
	
	// First of all the badges removed will be flagged with isDeleted = 1
	// this to keep track of endorsements in case a badge will be re-added in future
	$sql =  "UPDATE fact_user_badges ";
	$sql .= "SET fact_user_badges.isDeleted = 1 ";
	$sql .= "WHERE fact_user_badges.linkedin_id = '".$linkedinId."' ";
	$sql .= "AND fact_user_badges.badge_id NOT IN (".$strBadges.") ";
	echo $sql;
	mysql_query($sql);

	
	// First of all the badges removed will be flagged with isDeleted = 1
	foreach ($badges as $badgeOrder => $badgeId) {

		// It's time to replace the order or insert a new one
			$sql =  "UPDATE fact_user_badges ";
			$sql .= "SET fact_user_badges.order = ".($badgeOrder+1).", ";
			$sql .= "    fact_user_badges.isDeleted = 0 ";
			$sql .= "WHERE fact_user_badges.linkedin_id = '".$linkedinId."' ";
			$sql .= "AND fact_user_badges.badge_id = ".$badgeId." ";
			echo $sql;
			mysql_query($sql);

			if (mysql_affected_rows()==0) {
				$sql =  "INSERT INTO fact_user_badges ";
				$sql .= "VALUES ('".$linkedinId."', ".$badgeId.", ".($badgeOrder+1).", 0, 0)";
				echo $sql;
				mysql_query($sql);
				
			}
			

	}
	
	include "db_connection_end.php";
?>