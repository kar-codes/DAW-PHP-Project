<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ownerId = $_POST['ownerId'];
    $name = $_POST['name'];
    $idCard = $_POST['idCard'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];

    $sql = "UPDATE pets_owners SET name='$name', id_card='$idCard', email='$email', phone_number='$phoneNumber' WHERE id=$ownerId";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'ownerId' => $ownerId]);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>

