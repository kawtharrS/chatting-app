<?php
include("Model.php");

class Contact extends Model{
    protected int $conversationID;
    private string $subject;

    protected static string $table = "conversations";

    public function __construct(array $data){
        $this ->$data["conversationID"];
        $this ->$data["subject"];
    }

    public function getConversationID()
    {
        return $this ->conversationID;
    }

    public function getSubject()
    {
        return $this ->subject;
    }

    public function setSubject(string $subject)
    {
        $this ->subject= $subject;
    }

    public function __toString(){
        return $this->conversationID . " | " . $this->subject;
    }
    
    public function toArray(){
        return ["conversationID" => $this->conversationID, "subject" => $this->subject];
    }

}
?>