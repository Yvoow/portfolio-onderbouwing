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

    $titelDocument = validate($_POST['titelDocument']);
    $imagedocu = validate($_POST['imagedocu']);
    $extraInformation = validate($_POST['extraInformation']);
    $training = validate($_POST['training']);
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['admin'] == '1') {
        $sql = "INSERT INTO documents (name, text, training, img, koppeling) VALUES ( '$titelDocument', '$extraInformation', '$training', '$imagedocu', '$koppeling')";  
        $result = $conn->query($sql); 
    }

    header('location: ../adminconsole/admindocument.php');


    exit();
?>