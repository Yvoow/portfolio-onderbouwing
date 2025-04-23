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

    $title = validate($_POST['rapportTitle']);
    $type = validate($_POST['reportType']);
    $boete = validate($_POST['boete']);
    $maanden = validate($_POST['maanden']);
    $descr = validate($_POST['extraInformation']);
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['admin'] == '1') {
        $sql = "INSERT INTO straffen (title, type, boete, maanden, descr, koppeling) VALUES ( '$title', '$type', '$boete', '$maanden', '$descr', '$koppeling')";  
        $result = $conn->query($sql); 
    }

    header('location: ../straffenMakeIt.php');


    exit();
?>