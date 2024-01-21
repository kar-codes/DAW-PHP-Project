<?php
$servername = 'localhost';
$username = 'root';
$password = '';
$db_name = 'kats_shelter';

//creating connection
$conn = new mysqli($servername, $username, $password);

//we check connection
if ($conn->connect_error) {
  die('connection failed: ' . $conn->connect_error);
}

// SQL Queries
$sql_createdb = "CREATE DATABASE $db_name";

$sql_create_owners = "CREATE TABLE pets_owners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  id_card VARCHAR(50) UNIQUE,
  phone_number VARCHAR(50),
  email VARCHAR(100) UNIQUE
)";

$sql_create_pets = "CREATE TABLE pets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  description VARCHAR(100),
  owner_id INT,
  FOREIGN KEY(owner_id) REFERENCES pets_owners(id)
)";


$sql_create_users = "CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username varchar(100) NOT NULL,
  password varchar(200) NOT NULL
)";

$sql_seed_owners = "INSERT INTO pets_owners (name, id_card, phone_number, email)
  VALUES ('karen', 'Z5891345S', '12345676', 'petowner@gmail.com')";

//seed db
$sql_seed_pets = "INSERT INTO pets  (name, description, owner_id)
  VALUES ('krypto', 'small and black', 1),
   ('zinn', 'small and grey', NULL),
   ('sprinkles', 'white and fluffy', 1)";

$sql_seed_users = "INSERT INTO users
VALUES (1, 'manager-kar', 'password123')";

// Create DB
if ($conn->query($sql_createdb) === TRUE) {
  echo "DB created successfully </br>";
} else {
  die('Error creating database' . $conn->error);
}

$conn->select_db($db_name);

$queries = array($sql_create_owners, $sql_create_pets, $sql_create_users, $sql_seed_owners, $sql_seed_pets, $sql_seed_users);

foreach ($queries as &$query) {
  $message = substr($query, 0, 30) . '...';
  
  if ($conn->query($query) === TRUE) {
    echo "Query '$message' executed successfully </br>";
  } else {
    echo "Error in query '$message'; error: " . $conn->error;
  }
}
