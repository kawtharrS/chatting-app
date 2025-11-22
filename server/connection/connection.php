<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header(header: "Content-Type: application/json");

$connection = new mysqli ("localhost", "root","","chat", 3310);

if($connection->connect_error)
{
    die("connection error:".$connection->connect_error);
}

?>