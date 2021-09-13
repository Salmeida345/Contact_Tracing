<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{

		$FirstName = $inData["FirstName"];
		$LastName = $inData["LastName"];
		$PhoneNumber = $inData["PhoneNumber"];
		$Email = $inData["Email"];
		
		if(!$FirstName || !$LastName || !$PhoneNumber || !$Email){
			echo "Sorry, all fields are required.";
			}
		
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName = 'FirstName', LastName = 'LastName', PhoneNumber = 'PhoneNumber', Email = 'Email' WHERE UserID=?");
		$stmt->execute();
			echo "Contact updated!";
		$stmt->close;
	}

	$conn->close;

	
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
