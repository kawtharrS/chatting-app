<?php
include("../connection/config.php");
include("../connection/connection.php");
include("./prompt.php");

$contents = $input['contents'] ?? null;

if (!$contents) {
    echo json_encode(["reply" => "No advice received"]);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $URL_OPENAI);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

$data = [
    "model" => "gpt-4o-mini",
    "input" => [
        ["role" => "system", "content" => $prompt],
        ["role" => "user", "content" => $contents]
    ]
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer " . $API_KEY,
    "Content-Type: application/json"
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode(["reply" => "cURL error: " . curl_error($ch)]);
    exit;
}

curl_close($ch);

$json = json_decode($response, true);

if (isset($json['output'][0]['content'][0]['text'])) {
    echo json_encode(["reply" => $json['output'][0]['content'][0]['text']]);
} else {
    echo json_encode(["reply" => "AI returned no content. Response: " . print_r($json, true)]);
}
?>
