<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
include('../config.php');
?>

<?php

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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/reports.css">
    <link rel="stylesheet" href="/css/main.css">
    <title>MEOS | Personen</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="header-content-container">

                <div class="input-container">
                    <label for="reductionPercent">Zoek voor burger</label>
                    <input id="citizenSearch" class="input-with-border-label" type="text" />
                </div>
            </div>
            <div class="person-container">
                <div class="searched-person-wrapper">
                <p id="no-persons-found" style="display: none; color: black; text-align:center; font-size:26px;">Geen personen gevonden</p>
                    <?php
                    $usertable = $_SESSION['dbuserstable'];
                        $sql = "SELECT * FROM $usertable";
                        $result = $conn2->query($sql);

                        $identifiertable = $_SESSION['dbuseridentifiers'];
                        $sqlTotalRecords = "SELECT COUNT(*) as total FROM users";
                        $resultTotal = $conn2->query($sqlTotalRecords);
                        $rowTotal = $resultTotal->fetch_assoc();
                        if ($result->num_rows > 0) {
                            // output data of each row
                            while($row = $result->fetch_assoc()) {
                                echo '<a href="personitself.php?identifier=' . $row[$identifiertable] . '" class="about-case-container">';
                                echo '<div class="case-number about-case">';
                                echo '<h3 class="name-test">Naam:</h3>';
                                if ($row['arrestatiebevel'] == 1) {
                                    echo '<p style="color: red; font-weight: bold;">'.$row['firstname']. ' ' .$row['lastname'].'</p>';
                                } else {
                                    echo '<p>'.$row['firstname']. ' ' .$row['lastname'].'</p>';
                                }
                                echo '</div>';
                                echo '<div class="type about-case">';
                                echo '<h3 class="name-test">Baan:</h3>';
                                $jobname = $row['job'];
                                $sql2 = "SELECT * from jobs WHERE name='$jobname'";
                                $result2 = $conn2->query($sql2);
                                while($row2 = $result2->fetch_assoc()) {
                                    echo '<p>'.$row2['label'].'</p>';
                                }
                                echo '</div>';
                                echo '<div class="suspects about-case">';
                                echo '<h3 class="name-test">Geslacht:</h3>';
                                echo '<p>'.$row['sex'].'</p>';
                                echo '</div>';
                                echo '<div class="officers about-case">';
                                echo '<h3 class="name-test">Geboortedatum</h3>';
                                echo '<p>'.$row['dateofbirth'].'</p>';
                                echo '</div>';
                                echo '</a>';
                            }
                        } else {
                            echo "0 personen gevonden";
                        }
                    ?>
                </div>
            </div>
        </div> 
    </main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfunctionPerson.js"></script>