<?php
include('database.php');

// Fetch owners data from the database
$sql = "SELECT * FROM pets_owners";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $owners = array();
    while ($row = $result->fetch_assoc()) {
        $owners[] = $row;
    }
    echo json_encode(['success' => true, 'owners' => $owners], JSON_NUMERIC_CHECK);
} else {
    echo json_encode(['success' => false, 'error' => 'No owners found']);
}

$conn->close();
?>
