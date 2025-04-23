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
    $username = validate($_POST['username']);
    $pass = validate($_POST['pass']);
    $naam = validate($_POST['name']);
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['serverowner'] == '1') {
        $sql = "INSERT INTO users (username, pass, name, admin, ibt, koppeling) VALUES ( '$username', '$pass', '$naam', '1', '1', '$koppeling')";  
        $result = $conn->query($sql); 
    }

    header("Location: ../dashboard.php");
?>