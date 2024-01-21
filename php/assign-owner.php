<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure the 'petId' and 'ownerId' parameters are set in the request
    if (!isset($_POST['petId']) || !isset($_POST['ownerId'])) {
        echo json_encode(['error' => 'Missing parameters']);
        exit;
    }

    $petId = $_POST['petId'];
    $ownerId = $_POST['ownerId'];

    // Update the pet's owner
    $sql = "UPDATE pets SET owner_id = $ownerId WHERE id = $petId";
    $result = $conn->query($sql);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>
