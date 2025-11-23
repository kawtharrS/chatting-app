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
        $conversationID = $_GET['conversationID'] ?? null;
        if (!$conversationID) {
            echo ResponseService::response(400, "messageID is missing");
            return;
        }
        $messages = Message::where($this->connection, ["conversationID"=>intval($conversationID)]);
        $messagesArray = array_map(fn($message) => $message->toArray(), $messages);
        echo ResponseService::response(200, $messagesArray);
    }

    public function insertMessage()
    {
        $input = $this->getInput();

        if (!isset($input["senderID"], $input["recipientID"], $input["content"], $input["conversationID"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'senderID' => $input["senderID"],
            'recipientID' => $input["recipientID"],
            'content' => $input["content"],
            'conversationID' => $input["conversationID"],
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

        $fields = ['senderID', 'recipientID', 'content', 'conversationID', 'status'];
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

    
    public function markAllDelivered() 
    {
        $updatedCount = Message::updateWhere($this->connection, ['status' => 'sent'], ['status' => 'delivered']);
        echo ResponseService::response(200, "$updatedCount messages updated to delivered");
    }

    public function markAllRead() 
    {
        $input = $this->getInput();
        $conversationID = $input['conversationID'] ?? null;
        $recipientID = $input['recipientID'] ?? null;
        if (!$conversationID || !$recipientID) {
            echo ResponseService::response(400, "conversationID and recipientID are required");
            return;
        }
        $updatedCount = Message::updateWhere(
            $this->connection, 
            [
                'conversationID' => $conversationID,
                'recipientID' => $recipientID,
                'status' => 'delivered'
            ], 
            ['status' => 'read']
        );
        echo ResponseService::response(200, "$updatedCount messages marked as read");
    }

}

?>