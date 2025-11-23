<?php
include("Model.php");

class Conversation extends Model {
    protected int $conversationID;
    private int $user1ID;
    private int $user2ID;
    private ?string $subject;

    protected static string $table = "conversations";
    protected static string $primaryKey = "conversationID";

    public function __construct(array $data) {
        $this->conversationID = $data["conversationID"];
        $this->user1ID = $data["user1ID"];
        $this->user2ID = $data["user2ID"];
        $this->subject = $data["subject"] ?? null;
        $this->id = $this->conversationID;

    }

    public function getConversationID(): int {
        return $this->conversationID;
    }

    public function getUser1ID(): int {
        return $this->user1ID;
    }

    public function getUser2ID(): int {
        return $this->user2ID;
    }

    public function getSubject(): ?string {
        return $this->subject;
    }

    public function setSubject(string $subject) {
        $this->subject = $subject;
    }

    public function __toString(): string {
        return $this->conversationID . " | " . $this->user1ID . " | " . $this->user2ID . " | " . $this->subject;
    }

    public function toArray(): array {
        return [
            "conversationID" => $this->conversationID,
            "user1ID" => $this->user1ID,
            "user2ID" => $this->user2ID,
            "subject" => $this->subject
        ];
    }
}
?>
