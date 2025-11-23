<?php
include("Model.php");

class Contact extends Model{
    protected int $contactID;
    private int $userID;
    private int $contactUserID;
    private string $contactName;
    private string $contactEmail;

    protected static string $table = "contacts";

    public function __construct(array $data){
        $this ->contactID=$data["contactID"];
        $this ->userID=$data["userID"];
        $this ->contactUserID=$data["contactUserID"];
        $this ->contactName=$data["contactName"];
        $this ->contactEmail=$data["contactEmail"];
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
    public function getContactName()
    {
        return $this ->contactName;
    }

    public function setContactName(string $contactName)
    {
        $this ->contactName= $contactName;
    }

    public function getContactEmail()
    {
        return $this ->contactEmail;
    }

    public function setContactEmail(string $contactEmail)
    {
        $this ->contactEmail= $contactEmail;
    }
    public function __toString(){
        return $this->contactID . " | " . $this->userID . " | " . $this->contactUserID. " | " . $this->contactName. " | " . $this->contactEmail;
    }
    
    public function toArray(){
        return ["contactID" => $this->contactID, "userID" => $this->userID,  "contactUserID" => $this->contactUserID,"contactName" => $this->contactName,"contactEmail" => $this->contactEmail];
    }

}
?>