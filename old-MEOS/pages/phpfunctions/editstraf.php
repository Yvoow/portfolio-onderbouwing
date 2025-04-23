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
    $id = $_POST['id'];
    if ($_SESSION['admin'] == '1') {
    $sql = "UPDATE straffen SET title = '$_POST[rapportTitle]', type = '$_POST[reportType]', boete = '$_POST[boete]', maanden = '$_POST[maanden]', descr = '$_POST[extraInformation]' WHERE id='$id' and koppeling='$koppel'";  
    $result = $conn->query($sql); 
    }
    header("Location: ../dashboard.php");
?>