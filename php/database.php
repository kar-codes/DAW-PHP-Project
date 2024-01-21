<?php 

// Database connection details
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'kats_shelter';

// Establish the connection
$conn = new mysqli($host, $username, $password, $database);


// Check the connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed']));
}


?>