<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ownerId = $_POST['ownerId'];

    $sql = "DELETE FROM pets_owners WHERE id = $ownerId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>
