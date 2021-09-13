<?php

	$inData = getRequestInfo();
	
	$searchResults = "{";
	$searchCount = 0;

	$conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts where FirstName like ? or LastName like ? or PhoneNumber like ? or Email like ? and UserID=?");
		$searchItem = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss", $searchItem, $inData["UserId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"firstName":"' . $row["FirstName"] . ',"lastName":"' . $row["LastName"] . ',"phoneNumber":"' . $row["PhoneNumber"] . ',"email":"' . $row["EmailAddress"] . ',"contactId":"' . $row["ContactID"] . '"';
		}

		$searchResults .= '}';
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
