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
            echo ResponseService::response(404, "Conversation not found");
            return null;
        }
        return $conversation;
    }

    public function getConversationById()
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
        $conversations = Conversation::findAll($this->connection);
        $conversationsArray = array_map(fn($conv) => $conv->toArray(), $conversations);
        echo ResponseService::response(200, $conversationsArray);
    }

    public function insertConversation()
    {
        $input = $this->getInput();

        if (!isset($input["user1ID"]) || !isset($input["user2ID"])) {
            echo ResponseService::response(400, "Missing user1ID or user2ID");
            return;
        }

        $data = [
            'user1ID' => $input["user1ID"],
            'user2ID' => $input["user2ID"],
            'subject' => $input["subject"] ?? ""
        ];

        $conversation = Conversation::create($this->connection, $data);
        echo ResponseService::response(200, $conversation->toArray());
    }

    public function deleteConversation()
    {
        $input = $this->getInput();
        $conversationID = $input['conversationID'] ?? null;

        if (!$conversationID) {
            echo ResponseService::response(400, "Missing conversationID");
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

        $fields = ['subject', 'user1ID', 'user2ID'];
        $data = [];
        if (isset($input['subject'])) {
            $data['subject'] = $input['subject'];
        }

        if (empty($data)) {
            echo ResponseService::response(400, "No fields to update");
            return;
        }

        $conversation->update($this->connection, $data);
        $updatedConversation = Conversation::find($this->connection, $conversationID);
        echo ResponseService::response(200, $updatedConversation->toArray());
    }

    public function getConversationBetweenUsers()
    {
        $input = $this->getInput();
        $user1 = $input['user1ID'] ?? null;
        $user2 = $input['user2ID'] ?? null;

        if (!$user1 || !$user2) {
            echo ResponseService::response(400, "user1ID and user2ID are required");
            return;
        }

        $conversations = Conversation::whereOr($this->connection, [
            'user1ID' => $user1,
            'user2ID' => $user1
        ]);

        $conversation = null;
        foreach ($conversations as $conv) {
            if (
                ($conv->getUser1ID() == $user1 && $conv->getUser2ID() == $user2) ||
                ($conv->getUser1ID() == $user2 && $conv->getUser2ID() == $user1)
            ) {
                $conversation = $conv;
                break;
            }
        }

        if (!$conversation) {
            $data = [
                'user1ID' => $user1,
                'user2ID' => $user2,
                'subject' => ''
            ];
            $conversation = Conversation::create($this->connection, $data);
        }

        echo ResponseService::response(200, $conversation->toArray());
    }
}
?>
