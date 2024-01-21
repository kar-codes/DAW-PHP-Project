<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $name = $_POST['name'];
        $description = $_POST['description'];
        $ownerId = isset($_POST['ownerId']) ? $_POST['ownerId'] : null;

        $sql = "INSERT INTO pets (name, description, owner_id) VALUES ('$name', '$description', '$ownerId')";
        if ($conn->query($sql) === TRUE) {
            $newPetId = $conn->insert_id;
            echo json_encode(['success' => true, 'petId' => $newPetId]);
        } else {
            echo json_encode(['error' => $conn->error]);
        }
    
}
?>



