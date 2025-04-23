<?php 
session_start();
if (!isset($_SESSION['username'])) {
    header('location: ../../index.php');
}
include("../../config.php");

$koppel = $_SESSION['koppeling'];
$sql20 = "SELECT * FROM servers WHERE koppeling='$koppel'";
$result20 = $conn->query($sql20);
if ($result20->num_rows > 0) {
  while($row20 = $result20->fetch_assoc()) {
    $serverrname = $row20['dbhost'];
    $servermae = $row20['dbuser'];
    $serverpass = $row20['dbpass'];
    $server_db = $row20['dbdatabase'];
    $conn2 = mysqli_connect($serverrname, $servermae, $serverpass, $server_db);
    }
} else {
    echo "Database error";
}
function validate($data){

    $data = trim($data);

    $data = stripslashes($data);

    $data = htmlspecialchars($data);

    return $data;

}

    $usertable = $_SESSION['dbuserstable'];
    $identifier = $_GET['id'];
    $image = validate($_POST['url']);
    $identifiercolumn = $_SESSION['dbuseridentifiers'];
    $sql = "UPDATE $usertable SET image='$image' WHERE $identifiercolumn='$identifier'";
    $result = $conn2->query($sql);

    header("Location: ../persons.php");
?>