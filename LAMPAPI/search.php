<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$userID = $inData["userId"];

	$conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts where UserID=? AND (FirstName LIKE ? or LastName LIKE ? or PhoneNumber LIKE ? or EmailAddress LIKE ?) ORDER BY LastName, FirstName");
		$searchItem = "%" . $inData["search"] . "%";
		$stmt->bind_param("issss", $userID, $searchItem, $searchItem, $searchItem, $searchItem);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"id": "' . $row["ContactID"] . '", "firstName": "' . $row["FirstName"] . '", "lastName": "' . $row["LastName"] . '", "phone": "' . $row["PhoneNumber"] . '", "email": "' . $row["EmailAddress"] . '"}';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found!" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","phoneNumber":"","email":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>