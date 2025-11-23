<?php
include(__DIR__ . '/../models/Conversation.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class ConversationController
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

    private function fetchConversationById($id): ?Conversation
    {
        $conversation = Conversation::find($this->connection, $id);
        if (!$conversation) {
            echo ResponseService::response(404, "conversation not found");
            return null;
        }
        return $conversation;
    }

    public function getConversationsById()
    {
        $conversationID = $_GET['conversationID'] ?? null;
        if (!$conversationID) {
            echo ResponseService::response(400, "conversationID is missing");
            return;
        }

        $conversation = $this->fetchConversationById($conversationID);
        if ($conversation) {
            echo ResponseService::response(200, $conversation->toArray());
        }
    }

    public function getAllConversations()
    {
        $conversation = Conversation::findAll($this->connection);
        $conversationsArray = array_map(fn($user) => $user->toArray(), $conversation);
        echo ResponseService::response(200, $conversationsArray);
    }

    public function insertConversation()
    {
        $input = $this->getInput();

        if (!isset($input["subject"])) {
            echo ResponseService::response(400, "Missing required field");
            return;
        }

        $data = [
            'subject' => $input["subject"],
        ];

        $conversation = Conversation::create($this->connection, $data);
        echo ResponseService::response(200, $conversation->toArray());
    }

    public function deleteConversation()
    {
        $input = $this->getInput();
        $conversationID = $input['conversationID'] ?? null;

        if (!$conversationID) {
            echo ResponseService::response(400, "Missing ID");
            return;
        }

        $conversation = $this->fetchConversationById($conversationID);
        if ($conversation) {
            $success = $conversation->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updateConversation()
    {
        $input = $this->getInput();
        $conversationID = $input['conversationID'] ?? null;

        if (!$conversationID) {
            echo ResponseService::response(400, "conversationID is required");
            return;
        }

        $conversation = $this->fetchConversationById($conversationID);
        if (!$conversation) return;

        $fields = ['subject'];
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

        $conversation->update($this->connection, $data);
        $updatedConversation = User::find($this->connection, $conversationID);
        echo ResponseService::response(200, $updatedConversation->toArray());
    }
}
?>
