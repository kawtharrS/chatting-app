<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS notifications (
        notificationID INT PRIMARY KEY,
        userID INT,
        content TEXT,
        timestamp DATETIME,
        FOREIGN KEY (UserID) REFERENCES users(UserID)
    ); ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>