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

$aanvraaguser = validate($_POST['roepNummer']);
$rang = validate($_POST['rang']);
$training = validate($_POST['trainingName']);
$extra = validate($_POST['specialInfo']);
$koppeling = $_SESSION['koppeling'];

    $sql = "INSERT INTO trainingen (aanvraaguser, rang, training, extra, koppeling) VALUES ('$aanvraaguser', '$rang', '$training', '$extra', '$koppeling');";
    $result = $conn->query($sql);


    header("Location: ../dashboard.php");

?>