<?php
include("Model.php");

class Conversation extends Model {
    protected int $conversationID;
<<<<<<< HEAD
    private int $user1ID;
    private int $user2ID;
    private ?string $subject;
=======
    private string $subject;
    private int $user1ID;
    private int $user2ID;
>>>>>>> 9ada0b5

    protected static string $table = "conversations";
    protected static string $primaryKey = "conversationID";

    public function __construct(array $data) {
        $this->conversationID = $data["conversationID"];
        $this->user1ID = $data["user1ID"];
        $this->user2ID = $data["user2ID"];
        $this->subject = $data["subject"] ?? null;
        $this->id = $this->conversationID;

<<<<<<< HEAD
    }

=======
    public function __construct(array $data) {
        $this->conversationID = $data["conversationID"] ?? 0;
        $this->subject = $data["subject"] ?? "";
        $this->user1ID = $data["user1ID"] ?? 0;
        $this->user2ID = $data["user2ID"] ?? 0;
    }

    // Getters
>>>>>>> 9ada0b5
    public function getConversationID(): int {
        return $this->conversationID;
    }

<<<<<<< HEAD
    public function getUser1ID(): int {
        return $this->user1ID;
    }

    public function getUser2ID(): int {
        return $this->user2ID;
    }

    public function getSubject(): ?string {
        return $this->subject;
    }

=======
    public function getSubject(): string {
        return $this->subject;
    }

    public function getUser1ID(): int {
        return $this->user1ID;
    }

    public function getUser2ID(): int {
        return $this->user2ID;
    }

    // Setters
>>>>>>> 9ada0b5
    public function setSubject(string $subject) {
        $this->subject = $subject;
    }

<<<<<<< HEAD
    public function __toString(): string {
        return $this->conversationID . " | " . $this->user1ID . " | " . $this->user2ID . " | " . $this->subject;
    }

    public function toArray(): array {
        return [
            "conversationID" => $this->conversationID,
            "user1ID" => $this->user1ID,
            "user2ID" => $this->user2ID,
            "subject" => $this->subject
=======
    public function setUser1ID(int $userID) {
        $this->user1ID = $userID;
    }

    public function setUser2ID(int $userID) {
        $this->user2ID = $userID;
    }

    // Convert to string
    public function __toString(): string {
        return $this->conversationID . " | " . $this->subject . " | Users: " . $this->user1ID . "," . $this->user2ID;
    }

    // Convert to array
    public function toArray(): array {
        return [
            "conversationID" => $this->conversationID,
            "subject" => $this->subject,
            "user1ID" => $this->user1ID,
            "user2ID" => $this->user2ID
>>>>>>> 9ada0b5
        ];
    }
}
?>
