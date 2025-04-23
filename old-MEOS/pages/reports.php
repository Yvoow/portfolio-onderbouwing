<?php
session_start();
include('../config.php');
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
$koppel = $_SESSION['koppeling'];
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
    <title>MEOS | Rapporten</title>
</head>

<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
            <div class="header-content-container">
                <div class="input-container">

                    <label for="reportType">Rapport type</label>
                    <select id="reportType" class="input-with-border-label" required>
                        <option value="" selected>Geen filters</option>
                        <option value="incident">Opiumwet</option>
                        <option value="accident">Verkeerswet</option>
                        <option value="theft">Strafrecht</option>
                    </select>
                </div>

                <div class="input-container">
                    <label for="reductionPercent">Zoek voor zaaknummer, verdachte of agent</label>
                    <input id="reductionPercent" class="input-with-border-label" type="text" />
                </div>
            </div>
            <div class="person-container">
                <div class="searched-person-wrapper">
                <p id="no-reports-found" style="display: none; color: black; text-align:center; font-size:26px;">Geen rapporten gevonden</p>
                <?php
                    $name = $_SESSION['name'];
                    $sql2 = "SELECT * FROM rapporten WHERE published='0' AND agent='$name' AND koppeling='$koppel' ORDER BY added DESC";
                    $result2 = $conn->query($sql2);

                    if ($result2->num_rows > 0) {
                        echo '<p id="draftsHeading" style="color:black; font-weight: bolder; font-size: 20px;">Jouw concepten:</p>
                        ';
                        // output data of each row
                        while ($row2 = $result2->fetch_assoc()) {
                            echo '<a href=reportitself.php?id=' . $row2['id'] . ' class=about-case-container>';
                            echo '<div class="case-number about-case">';
                            echo '<h3 style="color: red;">Conceptnummer:</h3>';
                            echo '<p>#' . $row2['id'] . '</p>';
                            echo '</div>';
                            echo '<div class="type about-case">';
                            echo '<h3>Type:</h3>';
                            echo '<p>' . $row2['type'] . '</p>';
                            echo '</div>';
                            echo '<div class="suspects about-case">';
                            echo '<h3>Verdachte:</h3>';
                            echo '<p>' . $row2['verdachte'] . '</p>';
                            echo '</div>';
                            echo '<div class="officers about-case">';
                            echo '<h3>Hoofd-agent</h3>';
                            echo '<p>' . $row2['agent'] . '</p>';
                            echo '</div>';
                            echo '<div class="created about-case">';
                            echo '<h3>Concept aangemaakt:</h3>';
                            echo '<p>';
                            echo time_elapsed_string($row2['added']);
                            echo '</p>';
                            echo '</div>';
                            echo '</a>';
                        }
                    }
                    ?>
                    <?php
                    $sql = "SELECT * FROM rapporten WHERE published='1' AND koppeling='$koppel' ORDER BY added DESC";
                    $result = $conn->query($sql);
                    $sqlTotalRecords = "SELECT COUNT(*) as total FROM rapporten";
                    $resultTotal = $conn->query($sqlTotalRecords);
                    $rowTotal = $resultTotal->fetch_assoc();

                    if ($result->num_rows > 0) {
                        echo '<p id="rapportenHeader" style="color:black; font-weight: bolder; font-size: 20px;">Gepubliceerde rapporten:</p>';
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<a href=reportitself.php?id=' . $row['id'] . ' class=about-case-container>';
                            echo '<div class="case-number about-case">';
                            echo '<h3>Zaaknummer:</h3>';
                            echo '<p>#' . $row['id'] . '</p>';
                            echo '</div>';
                            echo '<div class="type about-case">';
                            echo '<h3>Type:</h3>';
                            echo '<p>' . $row['type'] . '</p>';
                            echo '</div>';
                            echo '<div class="suspects about-case">';
                            echo '<h3>Verdachte:</h3>';
                            echo '<p>' . $row['verdachte'] . '</p>';
                            echo '</div>';
                            echo '<div class="officers about-case">';
                            echo '<h3>Hoofd-agent</h3>';
                            echo '<p>' . $row['agent'] . '</p>';
                            echo '</div>';
                            echo '<div class="created about-case">';
                            echo '<h3>Gemaakt:</h3>';
                            echo '<p>';
                            echo time_elapsed_string($row['added']);
                            echo '</p>';
                            echo '</div>';
                            echo '</a>';
                        }
                    } else {
                        echo '<p class="nothingFound">Geen rapporten gevonden</p>';
                    }
                    ?>
                </div>
            </div>
        </div>
    </main>
</body>

</html>
<?php
function time_elapsed_string($datetime, $full = false)
{
    $now = new DateTime;
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);

    $diff->w = floor($diff->d / 7);
    $diff->d -= $diff->w * 7;

    $string = array(
        'y' => 'jaren',
        'm' => 'maanden',
        'w' => 'weken',
        'd' => 'dagen',
        'h' => 'uur',
        'i' => 'minuten',
        's' => 'seconden',
    );
    foreach ($string as $k => &$v) {
        if ($diff->$k) {
            $v = $diff->$k . ' ' . $v . ($diff->$k > 1 ? '' : '');
        } else {
            unset($string[$k]);
        }
    }

    if (!$full) $string = array_slice($string, 0, 1);
    return $string ? implode(', ', $string) . ' geleden' : 'net aangemaakt';
}
?>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/searchfilterReports.js"></script>
