<?php

	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$PhoneNumber = $inData["PhoneNumber"];
	$EmailAddress = $inData["EmailAddress"];
		
	if(!$FirstName || !$LastName || !$PhoneNumber || !$EmailAddress){
			returnWithError("Sorry, all fields are required.");
	}

	else
	{
		
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, PhoneNumber=?, EmailAddress=? WHERE UserID=? AND ContactID=?");
		$stmt->bind_param("ssssss", $FirstName, $LastName, $PhoneNumber, $EmailAddress, $inData["UserID"], $inData["ContactID"]);
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