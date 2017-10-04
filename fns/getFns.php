<?php

	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);

	function getTrailers($placement){

		$conn = pdo_connect();

		$sql = 'SELECT 		id, name, uniqueID
                FROM     	trailers 
                WHERE 		placement = :placement AND onSite = "true"
                ORDER BY 	sortOrder ASC
                ';

		$statement = $conn->prepare($sql);

	    $statement->bindValue(":placement", $placement, PDO::PARAM_STR);
        
        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    return $result;

	}

	function getTrailerDetails($uniqueID){

		$conn = pdo_connect();

		$sql = 'SELECT 		uniqueID, onSite, placement, name, id, height
                FROM     	trailers 
                WHERE 		uniqueID = :uniqueID
                ';

		$statement = $conn->prepare($sql);

		$statement->bindValue(":uniqueID", $uniqueID, PDO::PARAM_STR);
        
        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    $result = $result[0];
	    return $result;
		
	}

	function getLinkedTrailers($uniqueID){
		
		$conn = pdo_connect();

		$sql = 'SELECT 	pos1_id, pos1_label, pos2_id, pos2_label, pos3_id, pos3_label, pos4_id, pos4_label,
						pos5_id, pos5_label, pos6_id, pos6_label, pos7_id, pos7_label, pos8_id, pos8_label
				FROM linked_trailers
				WHERE uniqueID = :uniqueID';

		$statement = $conn->prepare($sql);
        
        $statement->bindValue(":uniqueID", $uniqueID, PDO::PARAM_STR);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    return $result;	

	}

	function getTrailerUniqueID($id){

		$conn = pdo_connect();

		$sql = 'SELECT 	uniqueID
				FROM trailers
				WHERE id = :id';

		$statement = $conn->prepare($sql);
        
        $statement->bindValue(":id", $id, PDO::PARAM_STR);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    $result = $result[0]['uniqueID'];
	    return $result;	

	}

	function getNotables(){
		
		$conn = pdo_connect();

		$sql = 'SELECT localLink, blurb, title, id  
				FROM press ORDER BY sortOrder';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    return $result;	
	}

	function getNotableArticle($id){

		$conn = pdo_connect();

		$sql = 'SELECT content, title, date
				FROM press
				WHERE id = :id';

		$statement = $conn->prepare($sql);

		$statement->bindValue(":id", $id, PDO::PARAM_INT);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    $result = $result[0];
	    return $result;	
	}

	function getAccolades(){
		
		$conn = pdo_connect();

		$sql = 'SELECT awards.type, trailers.name, trailers.uniqueID, trailers.id
				FROM awards
				INNER JOIN trailers
				ON (trailers.id = awards.trailer_id)
				WHERE trailers.featuredAward = 0 AND awards.on_site=1
				GROUP BY trailers.id
				ORDER BY sortOrder';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.
	    $conn = null;
	    return $result;	
	}

	function getFeaturedAccolades(){

		$conn = pdo_connect();

		$sql = 'SELECT awards.type, trailers.name, trailers.uniqueID, trailers.id
				FROM awards
				INNER JOIN trailers
				ON (trailers.id = awards.trailer_id)
				WHERE trailers.featuredAward = 1 AND awards.on_site=1
				GROUP BY trailers.id
				ORDER BY sortOrder';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.

	    $conn = null;
	    return $result;	

	}

	function getWork(){

		$conn = pdo_connect();

		$sql = 'SELECT * FROM trailers WHERE onSite="true" AND (placement="all" or placement="work") ORDER BY sortOrder';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.

	    $conn = null;
	    return $result;	

	}

	function getFeaturedDesigns(){

		$conn = pdo_connect();

		$sql = 'SELECT * FROM featuredDesigns ORDER BY RAND()';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.

	    $conn = null;
	    return $result;	
	
	}

	function getReel($reelName){

		$conn = pdo_connect();

		$sql = 'SELECT id, height FROM trailers WHERE name=:reelName LIMIT 1';

		$statement = $conn->prepare($sql);

		$statement->bindValue(":reelName", $reelName, PDO::PARAM_STR);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.

	    $conn = null;
	    return $result;	
	
	}


	function getMore(){

		$conn = pdo_connect();

		$sql = 'SELECT * FROM trailers WHERE onSite="true" AND (placement="all" or placement="more") ORDER BY sortOrder';

		$statement = $conn->prepare($sql);

        $statement->execute();
	    //Fetch all of the results.
	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
	    //$result now contains the entire resultset from the query.

	    $conn = null;
	    return $result;	
	}




?>
