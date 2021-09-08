<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, PhoneNumber, EmailAddress, UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["phoneNumber"], $inData["emailAddress"], $inData["userId"]);
		$stmt->execute();
		returnWithError("");
        

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>