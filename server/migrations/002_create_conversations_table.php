<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS conversations(
        conversationID INT AUTO_INCREMENT PRIMARY KEY,
        subject TEXT DEFAULT NULL)";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>