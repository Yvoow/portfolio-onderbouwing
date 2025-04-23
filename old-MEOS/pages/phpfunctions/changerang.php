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
    $id = $_GET['id'];
    $rang = $_GET['rang'];
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['admin'] == '1') {
    $sql = "UPDATE users SET rank='$rang' WHERE id='$id' AND koppeling='$koppeling'";  
    $result = $conn->query($sql); 
    }

    header("Location: ../dashboard.php");
?>