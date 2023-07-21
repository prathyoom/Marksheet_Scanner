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

function storeMarksheet($formInput)
{
    global $conn;

    $columns = $formInput['columns'];
    $values = $formInput['values'];
    $query = "INSERT INTO `student-details` ($columns) VALUES ($values)";
    $result = mysqli_query($conn, $query);

    if (!empty($result)) {
        $data = [
            'status' => 201,
            'message' => 'Marksheet Created Successfully',
        ];

        header("HTTP/1.0 201 Marksheet Created Successfully");
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

function processMarksheet($formInput, $marksheetInput)
{
    global $conn;
    $first_name = mysqli_real_escape_string($conn, $formInput['first_name'],);
    $last_name = mysqli_real_escape_string($conn, $formInput['last_name']);
    $image_name = $marksheetInput['image']['name'];

    if (empty(trim($first_name))) {
        return error422('Enter your First Name');
    } else if (empty(trim($last_name))) {
        return error422('Enter your Last Name');
    } else {
        $myfile = fopen("input.csv", "w");
        fwrite($myfile, "StudentId,First Name,Last Name,MarksheetImageName\n");
        fwrite($myfile, '1,');
        fwrite($myfile, $first_name . ',');
        fwrite($myfile, $last_name . ',');
        fwrite($myfile, $image_name);

        move_uploaded_file($_FILES['image']['tmp_name'], "./images/$image_name");

        $details_command_exec = escapeshellcmd('C:\Python311\python.exe D:\Xampp\htdocs\php-api\marksheet\test_1.py');
        exec($details_command_exec);
        $details_columns = "`First_Name`, `Last_Name`, `Marksheet_Image`, `Board`, `Guardian_Name`, `Roll`, `Date_of_Birth`, `School`, `CGPA_Result`";
        $details_file = fopen("./output_details.csv", "r");
        $details_csv_data = fgetcsv($details_file, 1000, ',');
        $details_values = "'" . implode("','", $details_csv_data) . "'";

        $marks_command_exec = escapeshellcmd('C:\Python311\python.exe D:\Xampp\htdocs\php-api\marksheet\subjects.py');
        exec($marks_command_exec);

        $marks_columnns_file = fopen("./output_marks_columns.csv", "r");
        $marks_columns_csv_data = fgetcsv($marks_columnns_file, 1000, ',');
        $marks_columns = "`" . implode("`,`", $marks_columns_csv_data) . "`";

        $marks_file = fopen("./output_marks.csv", "r");
        $marks_csv_data = fgetcsv($marks_file, 1000, ',');
        $marks_values = "'" . implode("','", $marks_csv_data) . "'";

        $columns = $details_columns . ',' . $marks_columns;
        $values = $details_values . ',' . $marks_values;

        if (!empty($values)) {
            $data = [
                'status' => 201,
                'message' => 'Marksheet Processed Successfully',
                'columns' => $columns,
                'values' => $values,
            ];

            header("HTTP/1.0 201 Marksheet Processed Successfully");
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

function getMarksheetList($name)
{
    global $conn;

    if (isset($name))
        $query = "SELECT * FROM `student-details` WHERE `First_Name` LIKE '$name%'";
    else
        $query = "SELECT * FROM `student-details`";
    $query_run = mysqli_query($conn, $query);

    if ($query_run) {

        if (mysqli_num_rows($query_run) > 0) {
            $res = mysqli_fetch_all($query_run, MYSQLI_ASSOC);

            $data = [
                'status' => 200,
                'message' => 'Marksheet List Fetched Successfully',
                'data' => $res,
            ];

            header("HTTP/1.0 200 OK");
            return json_encode($data);
        } else {
            $data = [
                'status' => 404,
                'message' => 'No Marksheet Found',
            ];

            header("HTTP/1.0 405 No Marksheet Found");
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
