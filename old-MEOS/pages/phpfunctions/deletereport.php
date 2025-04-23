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
$koppel = $_SESSION['koppeling'];

if ($_SESSION['admin'] == '1') {
    $sql = "DELETE FROM rapporten WHERE id='$id' and koppeling='$koppel'";
    $result = $conn->query($sql);

    header("Location: ../reports.php");
} else {
    header('location: ../../index.php');
}

    exit();
?>