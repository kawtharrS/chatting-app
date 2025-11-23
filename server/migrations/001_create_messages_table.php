<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS messages (
        messageID INT AUTO_INCREMENT PRIMARY KEY,
        senderID INT,
        recipientID INT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        conversationID INT,
        FOREIGN KEY (senderID) REFERENCES users(UserID),
        FOREIGN KEY (recipientID) REFERENCES users(UserID),
        FOREIGN KEY (conversationID) REFERENCES conversations(conversationID)
    );
    ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>