<?php
include('database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT pets.*, pets_owners.name AS owner_name FROM pets
            LEFT JOIN pets_owners ON pets.owner_id = pets_owners.id";

    $result = $conn->query($sql);

    if ($result) {
        $pets = array();

        while ($row = $result->fetch_assoc()) {
            $pets[] = $row;
        }

        echo json_encode(['success' => true, 'pets' => $pets], JSON_NUMERIC_CHECK);
    } else {
        echo json_encode(['error' => $conn->error]);
    }
}
?>
