<?php

$inData = getRequestInfo();

  $conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	}

	if (!$inData["ContactID"]) {
		returnWithError("No ID provided! This is a debugging state!");
	}

	else
	{
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID=? and UserID=?");
        	$stmt->bind_param("ss", $inData["ContactID"], $inData["UserID"]);
        	$stmt->execute();

		if($stmt->errno){
			returnWithError($stmt->errno);
		}

		else{
			echo "Deletion successful!";
			$stmt->close;
		}
	
		$conn->close;
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
