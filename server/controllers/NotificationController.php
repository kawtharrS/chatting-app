<?php
include(__DIR__ . '/../models/Notification.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class NotificationController
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

    private function fetchNotificationById($id): ?notification
    {
        $notification = Notification::find($this->connection, $id);
        if (!$notification) {
            echo ResponseService::response(404, "notification not found");
            return null;
        }
        return $notification;
    }

    public function getNotificationById()
    {
        $notificationID = $_GET['notificationID'] ?? null;
        if (!$notificationID) {
            echo ResponseService::response(400, "notificationID is missing");
            return;
        }

        $notification = $this->fetchnotificationById($notificationID);
        if ($notification) {
            echo ResponseService::response(200, $notification->toArray());
        }
    }

    public function getAllnotifications()
    {
        $notifications = Notification::findAll($this->connection);
        $notificationsArray = array_map(fn($notification) => $notification->toArray(), $notifications);
        echo ResponseService::response(200, $notificationsArray);
    }

    public function insertNotification()
    {
        $input = $this->getInput();

        if (!isset($input["userID"], $input["content"])) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'userID' => $input["userID"],
            'content' => $input["content"],
        ];

        $notification = Notification::create($this->connection, $data);
        echo ResponseService::response(200, $notification->toArray());
    }

    public function deleteNotification()
    {
        $input = $this->getInput();
        $notificationID = $input['notificationID'] ?? null;

        if (!$notificationID) {
            echo ResponseService::response(400, "Missing notificationID");
            return;
        }

        $notification = $this->fetchnotificationById($notificationID);
        if ($notification) {
            $success = $notification->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updateNotification()
    {
        $input = $this->getInput();
        $notificationID = $input['notificationID'] ?? null;

        if (!$notificationID) {
            echo ResponseService::response(400, "notificationID is required");
            return;
        }

        $notification = $this->fetchnotificationById($notificationID);
        if (!$notification) return;

        $fields = ['userID', 'content'];
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

        $notification->update($this->connection, $data);
        $updatednotification = Notification::find($this->connection, $notificationID);
        echo ResponseService::response(200, $updatednotification->toArray());
    }
}
?>
