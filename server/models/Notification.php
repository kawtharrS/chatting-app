<?php
include("Model.php");

class Notification extends Model{
    protected int $notificationID;
    private int $userID;
    private string $content;
    private string $timestamp;


    protected static string $table = "notifications";

    public function __construct(array $data){
        $this->notificationID= $data["notificationID"];
        $this->userID= $data["userID"];
        $this->content= $data["content"];
        $this->timestamp= $data["timestamp"];
    }
    public function getNotificationID()
    {
        return $this ->notificationID;
    }

    public function getUserID()
    {
        return $this ->userID;
    }
    public function setUserID(int $userID)
    {
        $this->userID = $userID;
    }

    public function getContent()
    {
        return $this ->content;
    }
    public function setContent(string $content)
    {
        $this->content = $content;
    }

    public function getTimestamp()
    {
        return $this ->timestamp;
    }
    public function setTimestamp(string $timestamp)
    {
        $this->timestamp = $timestamp;
    }

    public function __toString(){
        return $this->notificationID . " | " . $this->userID . " | " . $this->content. " | " . $this->timestamp;
    }
    
    public function toArray(){
        return ["notificationID" => $this->notificationID, "userID" => $this->userID, "content" => $this->content, "timestamp" => $this->timestamp];
    }

}
?>