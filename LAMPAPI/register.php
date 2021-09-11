<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT UserID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if($inData["login"] == "")
		{
			returnWithError("Login field is blank");
		}
		elseif($inData["password"] == "")
		{
			returnWithError("Password is blank");
		}
		elseif($result->fetch_assoc())
		{
			returnWithError("User Already Exists");
		}
		else
		{
			$stmt->close();

			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Email, Login, Password) VALUES(?,?,?,?,?)");
			$stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["login"], $inData["password"]);
			$stmt->execute();
			returnWithError("");
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>