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
        $userID = $_GET['userID'] ?? null;
        if (!$userID) {
            echo ResponseService::response(400, "userID missing");
            return;
        }

        $conversations = Conversation::whereOr($this->connection, [
            ['user1ID' => intval($userID)],
            ['user2ID' => intval($userID)]
        ]);

        $conversationsArray = array_map(fn($c) => $c->toArray(), $conversations);
        echo ResponseService::response(200, $conversationsArray);
    }

    public function insertConversation()
    {
        $input = $this->getInput();

        if (!isset($input["user1ID"], $input["user2ID"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $user1ID = intval($input["user1ID"]);
        $user2ID = intval($input["user2ID"]);

        if ($user1ID > $user2ID) {
            [$user1ID, $user2ID] = [$user2ID, $user1ID];
        }

        $existing = Conversation::where($this->connection, [
            'user1ID' => $user1ID,
            'user2ID' => $user2ID
        ]);

        if (!empty($existing)) {
            echo ResponseService::response(200, $existing[0]->toArray());
            return;
        }

        $data = [
            'user1ID' => $user1ID,
            'user2ID' => $user2ID,
            'subject' => $input['subject'] ?? null
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

        $data = [];
        if (isset($input['subject'])) {
            $data['subject'] = $input['subject'];
        }

        if (empty($data)) {
            echo ResponseService::response(400, "No fields to update");
            return;
        }

        $conversation->update($this->connection, $data);
        $updated = Conversation::find($this->connection, $conversationID);
        echo ResponseService::response(200, $updated->toArray());
    }
}
?>
