<?php

require '../inc/dbcon.php';

function error422($message)
{
    $data = [
        'status' => 422,
        'message' => $message,
    ];

    header("HTTP/1.0 422 Unprocessable Entity");
    echo json_encode($data);
    exit();
}

function storeCustomer($customerInput)
{
    global $conn;
    $name = mysqli_real_escape_string($conn, $customerInput['name']);
    $email = mysqli_real_escape_string($conn, $customerInput['email']);
    $phone = mysqli_real_escape_string($conn, $customerInput['phone']);

    if (empty(trim($name))) {
        return error422('Enter your Name');
    } else if (empty(trim($email))) {
        return error422('Enter your Email');
    } else if (empty(trim($phone))) {
        return error422('Enter your Phone');
    } else {
        $query = "INSERT INTO customers (name, email, phone) VALUES ('$name','$email','$phone')";
        $result = mysqli_query($conn, $query);

        if ($result) {
            $data = [
                'status' => 201,
                'message' => 'Customer Created Successfully',
            ];

            header("HTTP/1.0 201 Customer Created Successfully");
            return json_encode($data);
        } else {
            $data = [
                'status' => 500,
                'message' => '500 Internal Server Error',
            ];

            header("HTTP/1.0 500 Internal Server Error");
            return json_encode($data);
        }
    }
}

function getCustomerList()
{
    global $conn;

    $query = "SELECT * FROM customers";
    $query_run = mysqli_query($conn, $query);

    $requestMethod = $_SERVER["REQUEST_METHOD"];

    if ($query_run) {

        if (mysqli_num_rows($query_run) > 0) {
            $res = mysqli_fetch_all($query_run, MYSQLI_ASSOC);

            $data = [
                'status' => 200,
                'message' => 'Customer List Fetched Successfully',
                'data' => $res,
            ];

            header("HTTP/1.0 200 OK");
            return json_encode($data);
        } else {
            $data = [
                'status' => 404,
                'message' => $requestMethod . 'No Customer Found',
            ];

            header("HTTP/1.0 405 No Customer Found");
            return json_encode($data);
        }
    } else {
        $data = [
            'status' => 500,
            'message' => '500 Internal Server Error',
        ];

        header("HTTP/1.0 500 Internal Server Error");
        return json_encode($data);
    }
}
