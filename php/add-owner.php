<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $idCard = $_POST['idCard'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];

    $sql = "INSERT INTO pets_owners (name, id_card, email, phone_number) VALUES ('$name', '$idCard', '$email', '$phoneNumber')";

    if ($conn->query($sql) === TRUE) {
        $newOwnerId = $conn->insert_id;
        echo json_encode(['success' => true, 'ownerId' => $newOwnerId]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>
