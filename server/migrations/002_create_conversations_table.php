<?php
include("../connection/connection.php");

<<<<<<< HEAD
        $sql = "CREATE TABLE IF NOT EXISTS conversations (
        conversationID INT AUTO_INCREMENT PRIMARY KEY,
        user1ID INT NOT NULL,
        user2ID INT NOT NULL,
        subject TEXT DEFAULT NULL,
        UNIQUE KEY unique_pair (user1ID, user2ID)
        )";
=======
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

>>>>>>> 9ada0b5
$query = $connection->prepare($sql);
$query->execute();

echo "Table(s) Created!";

?>