<?php 
include("../connection/connection.php");

$input = json_decode(file_get_contents("php://input"), true);

if(!$input || !isset($input["message"])){
    echo json_encode([
        "reply" =>"No message received"
    ]);
}


?>