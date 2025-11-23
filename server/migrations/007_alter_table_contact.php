<?php
include("../connection/connection.php");

$sql = "ALTER TABLE contacts
        MODIFY contactID INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
        ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>