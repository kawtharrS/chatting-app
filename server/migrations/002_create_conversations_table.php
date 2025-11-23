<?php
include("../connection/connection.php");

$sql = "CREATE TABLE conversations (
    conversationID INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    user1ID INT NOT NULL,
    user2ID INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user1ID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (user2ID) REFERENCES users(userID) ON DELETE CASCADE
);
";

$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>