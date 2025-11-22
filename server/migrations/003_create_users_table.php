<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS users(
        userID INT AUTO_INCREMENT PRIMARY KEY, 
        userName VARCHAR(100) UNIQUE NOT NULL, 
        email TEXT NOT NULL,
        password VARCHAR(255) NOT NULL)";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>