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
    $roepnummer = validate($_POST['url']);
    $koppeling = $_SESSION['koppeling'];
    $ibt = validate($_POST['ibt']);
    $rank = validate($_POST['rank']);
    if ($_SESSION['admin'] == '1') {
    $sql = "UPDATE users SET roepnummer='$roepnummer', ibt='$ibt', rank='$rank' WHERE id='$id' AND koppeling='$koppeling'";  
    $result = $conn->query($sql); 
    }

    header("Location: ../collega2.php");
?>