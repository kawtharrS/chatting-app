<?php
include("../connection/connection.php");

$sql = "ALTER TABLE contacts
        ADD contactName VARCHAR(255) NOT NULL, ADD contactEmail Text NOT NULL;
        ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>