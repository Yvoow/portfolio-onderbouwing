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
    $name = validate($_POST['username']);
    $koppeling = $_SESSION['koppeling'];
    if ($_SESSION['serverowner'] == '1') {
    $sql = "UPDATE users SET admin='0', ibt='0' WHERE username='$name' AND koppeling='$koppeling'";  
    $result = $conn->query($sql); 
    }

    header("Location: ../dashboard.php");
?>