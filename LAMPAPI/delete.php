<?php
$inData = getRequestInfo();

  $conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT ContactID FROM Contacts WHERE ContactID=? and UserID=?");
        	$stmt->bind_param("ii", $inData["contactID"], $inData["userID"]);
        	$stmt->execute();
        	$result = $stmt->get_result();

		if($result->fetch_assoc())
        {
			$sql = "DELETE FROM Contacts WHERE ContactID = $inData["contactID"] and UserID = $inData["userId"];";
    			if ($conn->query($sql) === TRUE) {
      				echo "Contact deleted successfully.";
				}
    			else
      				echo "Sorry, that contact does not exist." . $conn->error;
		}
		else{
			returnWithError($result);
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
