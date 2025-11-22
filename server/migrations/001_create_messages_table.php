<?php
include("../connection/connection.php");

$sql = "CREATE TABLE IF NOT EXISTS messages (
        messageID INT PRIMARY KEY,
        senderID INT,
        recipientID INT,
        content TEXT,
        timestamp DATETIME,
        conversationID INT,
        FOREIGN KEY (SenderID) REFERENCES users(UserID),
        FOREIGN KEY (RecipientID) REFERENCES users(UserID),
        FOREIGN KEY (ConversationID) REFERENCES conversations(ConversationID)
    ); ";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>