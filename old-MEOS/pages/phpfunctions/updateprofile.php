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
    $koppeling = $_SESSION['koppeling'];
    $id = $_SESSION['id'];
    $sql = "UPDATE users SET username = '$_POST[username]', pass = '$_POST[pass]', name = '$_POST[name]', roepnummer = '$_POST[roepnummer]', img = '$_POST[profilepic]' WHERE id='$id' AND koppeling='$koppeling'";  
    $result = $conn->query($sql); 

    header("Location: ../../index.php");
?>