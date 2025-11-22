<?php
include("../connection/connection.php");

$sql = " CREATE TABLE IF NOT EXISTS contacts (
        contactID INT PRIMARY KEY,
        userID INT,
        contactUserID INT,
        FOREIGN KEY (UserID) REFERENCES users(UserID),
        FOREIGN KEY (ContactUserID) REFERENCES users(UserID)
    );";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>