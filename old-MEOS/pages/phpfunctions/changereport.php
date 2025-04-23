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
    $koppel = $_SESSION['koppeling'];
    $id = validate($_POST['finesHTML']);
    $sql = "UPDATE rapporten SET title = '$_POST[title]', text = '$_POST[extraInformation]', type = '$_POST[reportType]' WHERE koppeling='$koppel' AND id='$id'";  
    $result = $conn->query($sql); 

    header("Location: ../dashboard.php");
?>