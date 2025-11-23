<?php
include(__DIR__ . '/../models/Contact.php');
include(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../services/ResponseService.php');

class ContactController
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

    private function fetchContactById($id): ?contact
    {
        $contact = contact::find($this->connection, $id);
        if (!$contact) {
            echo ResponseService::response(404, "contact not found");
            return null;
        }
        return $contact;
    }

    public function getContactById()
    {
        $contactID = $_GET['contactID'] ?? null;
        if (!$contactID) {
            echo ResponseService::response(400, "contactID is missing");
            return;
        }

        $contact = $this->fetchcontactById($contactID);
        if ($contact) {
            echo ResponseService::response(200, $contact->toArray());
        }
    }

    public function getAllContacts()
    {
        $userID = $_GET['userID'] ?? null;
        if (!$userID) {
            echo ResponseService::response(400, "userID missing");
            return;
        }
<<<<<<< HEAD
        $contacts = Contact::where($this->connection, ["userID" => intval($userID)]);
=======
        $contacts = Contact::where($this->connection, ["userID"=>intval($userID)]);
>>>>>>> 9ada0b5
        $contactsArray = array_map(fn($contact) => $contact->toArray(), $contacts);
        echo ResponseService::response(200, $contactsArray);
    }
    public function getContactByEmail()
    {
        $email = $_GET['email'] ?? null;
        if (!$email) {
            echo ResponseService::response(400, "email missing");
            return;
        }

        $entries = Contact::where($this->connection, ["user_id" => $email]);
        $entriesArr = array_map(fn($entry) => $entry->toArray(), $entries);

        echo ResponseService::response(200, $entriesArr);
    }

    public function insertContact()
    {
        $input = $this->getInput();

        if (!isset($input["userID"], $input["contactUserID"],$input["contactName"], $input["contactEmail"],)) {
            echo ResponseService::response(400, "Missing required fields");
            return;
        }

        $data = [
            'userID' => $input["userID"],
            'contactUserID' => $input["contactUserID"],
            'contactName' =>$input["contactName"],
            'contactEmail' =>$input["contactEmail"]
        ];

        $contact = Contact::create($this->connection, $data);
        echo ResponseService::response(200, $contact->toArray());
    }

    public function deleteContact()
    {
        $input = $this->getInput();
        $contactID = $input['contactID'] ?? null;

        if (!$contactID) {
            echo ResponseService::response(400, "Missing contactID");
            return;
        }

        $contact = $this->fetchContactById($contactID);
        if ($contact) {
            $success = $contact->delete($this->connection);
            echo ResponseService::response($success ? 200 : 500, $success ? "Deleted" : "Failed to delete");
        }
    }

    public function updatecontact()
    {
        $input = $this->getInput();
        $contactID = $input['contactID'] ?? null;

        if (!$contactID) {
            echo ResponseService::response(400, "contactID is required");
            return;
        }

        $contact = $this->fetchContactById($contactID);
        if (!$contact) return;

        $fields = ['userID', 'contactUserID', 'contactName', 'contactEmail'];
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

        $contact->update($this->connection, $data);
        $updatedcontact = Contact::find($this->connection, $contactID);
        echo ResponseService::response(200, $updatedcontact->toArray());
    }
}
?>
