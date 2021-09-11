// notes - still need to test, document on swaggerhub etc. needs editing

<?php
	$inData = getRequestInfo();

  $conn = new mysqli("localhost", "ChiefHenny", "WeLoveCOP4331", "ContactTracing"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// this line needs work... not sure how to pull ContactID from the database
		$ContactID = $conn->($inData["ContactID"]);
		
		$sql = "DELETE FROM Contacts WHERE ContactID = '$ContactID' and UserID = $inData["userId"];";
    			if ($conn->query($sql) === TRUE) {
      				echo "Contact deleted successfully.";
    			else
      				echo "Sorry, that contact does not exist.";
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
