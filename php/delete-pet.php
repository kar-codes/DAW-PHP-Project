<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $petId = $_POST['petId'];

    $sql = "DELETE FROM pets WHERE id = $petId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>