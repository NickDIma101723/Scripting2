<?php
// Handle JSON input
$_POST = json_decode(file_get_contents("php://input"), true);

$title = $_POST['title'];
$year = $_POST['year'];
$description = $_POST['description'];
$url = $_POST['imageUrl'];

// Tags come as array, convert to string for database
$tags = is_array($_POST['tags']) ? implode(',', $_POST['tags']) : $_POST['tags'];

// connect to database
$db = new SQLite3("memes.db");
$db->busyTimeout(5000);
 
// insert new row with all fields
$query = "INSERT INTO memes (title, year, description, url, tags) VALUES ('$title', '$year', '$description', '$url', '$tags')";
$db->exec($query);

