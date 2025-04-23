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
    $sql = "UPDATE servers SET dbhost = '$_POST[dbhost]', dbuser = '$_POST[dbuser]', dbpass = '$_POST[dbpass]', dbdatabase = '$_POST[dbdatabase]', dbuserstable = '$_POST[dbuserstable]', dbvehiclestable = '$_POST[dbvehiclestable]', dbuseridentifiers = '$_POST[dbuseridentifiers]' WHERE koppeling='$koppel'";  
    $result = $conn->query($sql); 
    }

    header("Location: ../dashboard.php");
?>