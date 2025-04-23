<?php 
session_start();
if (!isset($_SESSION['username'])) {
    header('location: ../../index.php');
}
include("../../config.php");

function validate($data){
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

    $username = validate($_POST['gebruikersnaam']);
    $pass = validate($_POST['wachtwoord']);
    $name = validate($_POST['name']);
    $roepnummer = validate($_POST['roepnummer']);
    $rank = validate($_POST['rang']);
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['admin'] == '1') {
        $sql = "INSERT INTO users (username, pass, name, roepnummer, rank, koppeling) VALUES ( '$username', '$pass', '$name', '$roepnummer', '$rank', '$koppeling')";  
        $result = $conn->query($sql); 
    }

    header('location: ../collega2.php');


    exit();
?>