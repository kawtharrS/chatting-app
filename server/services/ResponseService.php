<?php
class ResponseService{
    public static function response(int $status_code, $payload){
        $response = [];
        $response["status"]=$status_code;
        $response["payload"] = $payload;
        return json_encode($response);
    }

    public static function result($status, $message, $data = null){
        http_response_code($status);
        header('Content-Type: application/json');

        $response = [
            'status' => $status,
            'message' => $message
        ];

        if($data !== null) $response['data'] = $data;

        echo json_encode($response);
        exit();
    }
}
?>