<?php
include("Model.php");

class User extends Model{
    protected int $userID;
    private string $userName;
    private string $email;
    private string $password;


    protected static string $table = "users";

    public function __construct(array $data){
        $this ->$data["userID"];
        $this ->$data["userName"];
        $this ->$data["email"];
        $this ->$data["password"];
    }

    public function getUserID()
    {
        return $this ->userID;
    }

    public function getUserName()
    {
        return $this ->userName;
    }
    public function setUserName(string $userName)
    {
        $this->userName = $userName;
    }

    public function getEmail()
    {
        return $this ->email;
    }
    public function setEmail(string $email)
    {
        $this->email = $email;
    }

    public function setPassword(string $password){
        $this->password =$password;
    }
    public function getPassword(){
        return $this->password;
    }

    public function __toString(){
        return $this->userID . " | " . $this->userName . " | " . $this->email. " | " . $this->password;
    }
    
    public function toArray(){
        return ["userID" => $this->userID, "userName" => $this->userName, "email" => $this->email, "password" => $this->password];
    }

}
?>