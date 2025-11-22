<?php
require_once(__DIR__ . '/../connection/connection.php');
require_once(__DIR__ . '/../models/User.php');
require_once("ResponseService.php");
require_once(__DIR__ . './../connection/config.php');

$email = $input['email'] ?? '';
$password= $input['password'] ?? '';

function login(){
    global $connection, $email, $password;

    if(!$email || !$password)
    {
        ResponseService::result(400, "Email and password are required");
    }

    $sql = "SELECT * FROM users WHERE email = ?";
    $query = $connection ->prepare($sql);
    $query->bind_param("s", $email);
    $query->execute();
    $data= $query->get_result()->fetch_assoc();

    if(!empty($data) && password_verify($password, $data["password"])){
        ResponseService::result(200, "ypu are logged in", ["id"=>$data]);
    }
    else{
        ResponseService::result(400, "Invalid email or password");
    }
}
login();

?>