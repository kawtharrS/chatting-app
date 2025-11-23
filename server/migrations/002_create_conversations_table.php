<?php
include("../connection/connection.php");

        $sql = "CREATE TABLE IF NOT EXISTS conversations (
        conversationID INT AUTO_INCREMENT PRIMARY KEY,
        user1ID INT NOT NULL,
        user2ID INT NOT NULL,
        subject TEXT DEFAULT NULL,
        UNIQUE KEY unique_pair (user1ID, user2ID)
        )";
$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>