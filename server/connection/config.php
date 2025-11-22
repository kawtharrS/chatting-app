<?php
$env = parse_ini_file(__DIR__ . "/.env");
$API_KEY=$env['OPENAI_KEY'];
$URL_OPENAI="https://api.openai.com/v1/responses";
$input = json_decode(file_get_contents('php://input'), true);
?>