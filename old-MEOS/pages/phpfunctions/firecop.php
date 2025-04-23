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
    $sql2 = "SELECT * FROM users WHERE id='$id' and koppeling='$koppel'";
    $result2 = $conn->query($sql2);
        while($row2 = $result2->fetch_assoc()) {
            if (!$row2['serverowner']) {
            $sql = "DELETE FROM users WHERE id='$id' and koppeling='$koppel'";
            $result = $conn->query($sql);
            } else {
                header('location: ../../index.php');
            }
        }

    header("Location: ../reports.php");
} else {
    header('location: ../../index.php');
}

    exit();
?>