<?php
include("Model.php");

class Message extends Model{
    protected int $messageID;
    private int $senderID;
    private int $recipientID;
    private string $content;
    private string $timestamp;
    private int $conversationID;

    private string $status;


    protected static string $table = "messages";

    public function __construct(array $data){
        $this ->messageID = $data["messageID"];
        $this ->senderID = $data["senderID"];
        $this ->recipientID = $data["recipientID"];
        $this ->content = $data["content"];
        $this ->timestamp = $data["timestamp"];
        $this->conversationID = $data['conversationID'];
        $this->status = $data['status'];

    }

    public function getMessageID(){
        return $this->messageID;
    }

    public function getSenderID(){
        return $this->senderID;
    }
    public function getRecipientID(){
        return $this->recipientID;
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

    public function getStatus()
    {
        return $this ->status;
    }
    public function setStatus(string $status)
    {
        $this->status = $status;
    }


    public function __toString(){
        return $this->messageID . " | " . $this->senderID . " | " .$this->recipientID . " | " . $this->content . " | " . $this->timestamp . " | " . $this->conversationID. " | " . $this->status ;
    }
    
    public function toArray(){
        return ["messageID" => $this->messageID, "senderID" => $this->senderID,"recipientID" => $this->recipientID ,"content" => $this->content,"timestamp" => $this->timestamp, "conversationID" => $this->conversationID, "status" => $this->status];
    }

}
?>