<?php
include("Model.php");

class Contact extends Model{
    protected int $contactID;
    private int $userID;
    private int $contactUserID;

    protected static string $table = "contacts";

    public function __construct(array $data){
        $this ->$data["contactID"];
        $this ->$data["userID"];
        $this ->$data["contactUserID"];
    }

    public function getContactID()
    {
        return $this ->contactID;
    }

    public function getUserID()
    {
        return $this ->userID;
    }

    public function getContactUserID()
    {
        return $this ->contactUserID;
    }

    public function __toString(){
        return $this->contactID . " | " . $this->userID . " | " . $this->contactUserID;
    }
    
    public function toArray(){
        return ["contactID" => $this->contactID, "userID" => $this->userID, "contactUserID" => $this->contactUserID];
    }

}
?>