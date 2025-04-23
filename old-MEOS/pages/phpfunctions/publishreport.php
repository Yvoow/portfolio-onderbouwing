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
    $koppeling = $_SESSION['koppeling'];
    $sql = "UPDATE rapporten SET published='1' WHERE id='$id' AND koppeling='$koppeling'";  
    $result = $conn->query($sql); 

    header("Location: ../dashboard.php");
?>