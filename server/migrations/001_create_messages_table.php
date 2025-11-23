<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS messages (
        messageID INT AUTO_INCREMENT PRIMARY KEY,
        conversationID INT NOT NULL,
        senderID INT,
        recipientID INT,
        content TEXT,
        timestamp DATETIME,
        FOREIGN KEY (SenderID) REFERENCES users(UserID),
        FOREIGN KEY (RecipientID) REFERENCES users(UserID),
        FOREIGN KEY (conversationID) REFERENCES conversations(conversationID)

    ); ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>