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
    if ($_SESSION['serverowner'] == '1') {
    $sql = "UPDATE servers SET servername = '$_POST[servername]', serverlogo='$_POST[serverlogo]' WHERE koppeling='$koppel'";  
    $result = $conn->query($sql); 
    }

    header("Location: ../dashboard.php");
?>