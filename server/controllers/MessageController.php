<?php
include(__DIR__ . '/../models/Message.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class MessageController
{
    private mysqli $connection;

    public function __construct()
    {
        global $connection;
        $this->connection = $connection;
    }

    private function getInput(): array
    {
        $input = $_POST;
        if (empty($input)) {
            $input = json_decode(file_get_contents("php://input"), true);
        }
        return $input ?? [];
    }

    private function fetchMessageById($id): ?message
    {
        $message = Message::find($this->connection, $id);
        if (!$message) {
            echo ResponseService::response(404, "message not found");
            return null;
        }
        return $message;
    }

    public function getMessageById()
    {
        $messageID = $_GET['messageID'] ?? null;
        if (!$messageID) {
            echo ResponseService::response(400, "messageID is missing");
            return;
        }

        $message = $this->fetchMessageById($messageID);
        if ($message) {
            echo ResponseService::response(200, $message->toArray());
        }
    }

    public function getAllMessages()
    {
        $messages = Message::where($this->connection, "userID :");
        $messagesArray = array_map(fn($message) => $message->toArray(), $messages);
        echo ResponseService::response(200, $messagesArray);
    }

    public function insertMessage()
    {
        $input = $this->getInput();

        if (!isset($input["senderID"], $input["recipientID"], $input["content"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'senderID' => $input["senderID"],
            'recipientID' => $input["recipientID"],
            'content' => $input["content"],
        ];

        $message = Message::create($this->connection, $data);
        echo ResponseService::response(200, $message->toArray());
    }

    public function deleteMessage()
    {
        $input = $this->getInput();
        $messageID = $input['messageID'] ?? null;

        if (!$messageID) {
            echo ResponseService::response(400, "Missing messageID");
            return;
        }

        $message = $this->fetchMessageById($messageID);
        if ($message) {
            $success = $message->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updatemessage()
    {
        $input = $this->getInput();
        $messageID = $input['messageID'] ?? null;

        if (!$messageID) {
            echo ResponseService::response(400, "ID is required");
            return;
        }

        $message = $this->fetchMessageById($messageID);
        if (!$message) return;

        $fields = ['senderID', 'recipientID', 'content'];
        $data = [];

        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }


        if (empty($data)) {
            echo ResponseService::response(400, "No fields to update");
            return;
        }

        $message->update($this->connection, $data);
        $updatedmessage = Message::find($this->connection, $messageID);
        echo ResponseService::response(200, $updatedmessage->toArray());
    }
}
?>
