<?php

   include('database.php');

// Function to sanitize input data
function sanitize($data) {
    global $conn;
    return mysqli_real_escape_string($conn, $data);
}

// Check if username and password are provided
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = sanitize($_POST['username']);
    $password = sanitize($_POST['password']);

    // Query to check username and password in the users table
    $query = "SELECT id FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($query);

    if ($result) {
        if ($result->num_rows > 0) {
            // Valid credentials
            echo json_encode(['status' => 'success']);
        } else {
            // Invalid credentials
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password']);
        }
    } else {
        // Error in the query
        echo json_encode(['status' => 'error', 'message' => 'Query error']);
    }
} else {
    // Username or password not provided
    echo json_encode(['status' => 'error', 'message' => 'Username or password not provided']);
}


?>
