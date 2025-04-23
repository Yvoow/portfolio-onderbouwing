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
    if ($_SESSION['ibt'] == '1') {
    $sql = "DELETE FROM trainingen WHERE id='$id' AND koppeling='$koppel'";
    $result = $conn->query($sql); 
    }

    header("Location: ../ibtaanvragen.php");
?>