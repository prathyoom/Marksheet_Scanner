<?php

error_reporting(0);

header('Access-Control-Allow-Origin:*');
header('Content-Type: application/json');
header('Access-Control-Allow-Method: POST');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Request-With');

include('function.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "POST") {

    if (empty($_FILES)) {
        error422('Upload Marksheet');
    } else {
        $processMarksheet = processMarksheet($_POST, $_FILES);
    }
    echo $processMarksheet;
} else {
    $data = [
        'status' => 405,
        'message' => $requestMethod . ' Method Not Allowed',
    ];

    header("HTTP/1.0 405 Method Not Allowed");
    echo json_encode($data);
}
