<?php
include('database.php');

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $petId = $_POST['petId'];
        $name = $_POST['name'];
        $description = $_POST['description'];
        $ownerId = $_POST['ownerId'];
    
        $sql = "UPDATE pets SET name='$name', description='$description', owner_id='$ownerId' WHERE id=$petId";
    
        if ($conn->query($sql) === TRUE) {
            echo json_encode(['success' => true, 'petId' => $petId]);
        } else {
            echo json_encode(['error' => $conn->error]);
        }
    }
?>






