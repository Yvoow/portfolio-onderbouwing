<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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

$submitbutton = validate($_POST['btSubmit']);
$title = validate($_POST['rapportTitle']);
$verdachte = validate($_POST['verdachte']);
$verdachteIdentifier = validate($_POST["data-identifier"]);

$agent = validate($_POST['mainAgents']);
$helper = validate($_POST['supportAgents']);
$type = validate($_POST['reportType']);
$textveld = validate($_POST['extraInformation']);
$koppeling = $_SESSION['koppeling'];
$finesHTML = $_POST['finesHTML'];
$vuurwapen = validate($_POST['vuurwapen']);
$steekwapen = validate($_POST['steekwapen']);
$drugs = validate($_POST['drugsbezit']);

$sqlValidateAgent = "SELECT * FROM users WHERE name = ?";
$stmt = $conn->prepare($sqlValidateAgent);
$stmt->bind_param("s", $agent);
$stmt->execute();
$resultValidate = $stmt->get_result();
if ($resultValidate->num_rows == 0) {
    header("Location: ../newrapport.php?error=invalid_agent");
    exit();
}
if (!empty($helper)) {
    $sqlValidateHelper = "SELECT * FROM users WHERE name = ?";
    $stmtHelper = $conn->prepare($sqlValidateHelper);
    $stmtHelper->bind_param("s", $helper);
    $stmtHelper->execute();
    $resultValidateHelper = $stmtHelper->get_result();
    if ($resultValidateHelper->num_rows == 0) {
        header("Location: ../newrapport.php?error=invalid_helper");
        exit();
    }
}

if(isset($_POST['maanden']) && !empty($_POST['maanden'])) {
    $maanden = validate($_POST['maanden']);
} else {
    $maanden = '0'; // or any default value you want to assign
}
if(isset($_POST['boete']) && !empty($_POST['boete'])) {
    $boete = validate($_POST['boete']);
} else {
    $boete = ''; // or any default value you want to assign
}


if ($submitbutton === 'indienen') {
    if ($type === 'Arrestatiebevel') {
        $usertable = $_SESSION['dbuserstable'];
        $identifiertable = $_SESSION['dbuseridentifiers'];
        $sql3 = "UPDATE $usertable SET arrestatiebevel='1' WHERE $identifiertable='$verdachteIdentifier'";
        $sql4 = "INSERT INTO arrestatiebevelen (naam, reden, agent, vuurwapen, steekwapen, drugs, beschrijving, koppeling, identifier) VALUES ('$verdachte', '$title', '$agent', '$vuurwapen', '$steekwapen', '$drugs', '$textveld', '$koppeling', '$verdachteIdentifier');";
        $result4 = $conn->query($sql4);
        $result3 = $conn2->query($sql3);
    } else {
        $sql = "INSERT INTO rapporten (title, agent, helpers, type, straffen, verdachte, verdachteidentifier, text, maanden, boete, published, koppeling) VALUES ('$title', '$agent', '$helper', '$type', '$finesHTML', '$verdachte', '$verdachteIdentifier', '$textveld', '$maanden', '$boete', '1', '$koppeling');";
        $result = $conn->query($sql);
    }
} elseif ($submitbutton ==='concept') {
    $sql2 = "INSERT INTO rapporten (title, agent, helpers, type, straffen, verdachte, verdachteidentifier, text, maanden, boete, published, koppeling) VALUES ('$title', '$agent', '$helper', '$type', '$finesHTML', '$verdachte', '$verdachteIdentifier', '$textveld', '$maanden', '$boete', '0', '$koppeling');";
    $result2 = $conn->query($sql2);
}

 header("Location: ../reports.php");

exit();
?>