<?php
session_start();
if (!isset($_SESSION['username'])) {
header('location: ../../index.php');
}
include('../config.php');
?>

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
<link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
<script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="/css/newrapport.css">
<link rel="stylesheet" href="/css/reports.css">
<link rel="stylesheet" href="/css/arrestiebevelen.css">
<link rel="stylesheet" href="/css/main.css">
<title>MEOS | Arrestiebevelen</title>
</head>

<body>
<main>
        <?php include 'main/sidebar.php'; ?>
    <div class="content">
        <div class="header-content-container">
            <div class="input-container">
                <label for="reportType">Bekijk arrestiebevelen</label>
                <select id="reportType" class="input-with-border-label" required>
                    <option value="" selected>Geen filters</option>
                    <option value="searched">Word gezocht</option>
                    <option value="afgehandeld">Afgehandeld</option>
                </select>
            </div>

            <div class="input-container">
                <label for="reductionPercent">Zoek naar arrestiebevel</label>
                <input id="reductionPercent" class="input-with-border-label" type="text" />
            </div>
        </div>
        <div class="container top-container-arrest">
            <div class="name-container">
            Naam
            </div>
            <div class="agent-container">
            Gekoppelde agent
            </div>
            <div class="status-container">
            Status
            </div>
            <div class="acties-container">
            Acties
            </div>
        </div>

        <p id="no-reports-found" style="display: none; color: black; text-align:center; font-size:26px;">Geen arrestiebevelen gevonden</p>

        <?php
            $koppeling = $_SESSION['koppeling'];
            $sql = "SELECT * FROM arrestatiebevelen WHERE koppeling='$koppeling' ORDER BY afgehandeld ASC";
            $result = $conn->query($sql);
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo '<div class="arrestatiebevel-row container">';
                    echo '  <div class="arrestatiebevel-cell name-container">' . $row['naam'] . '</div>';
                    echo '  <div class="arrestatiebevel-cell agent-container">' . $row['agent'] . '</div>';
                    if ($row['afgehandeld'] == 0) {
                        echo  '<div class="arrestatiebevel-cell status-container state closed">Gezocht</div>';
                    } else {
                        echo ' <div class="arrestatiebevel-cell status-container state open">Afgehandeld</div>';
                    }
                    echo '  <div class="arrestatiebevel-actions">';
                    echo '<a href="arrestiebevelenInformation.php?id=' . $row['id'] . '" class="action-button info"><i class="fas fa-info-circle"></i></a>';
                    if ($_SESSION['admin'] == 1) {
                        echo '    <a href="phpfunctions/deleteab.php?id=' . $row['identifier'] . '" class="action-button delete"><i class="fas fa-trash"></i></a>';
                    }
                    echo '    <a href="phpfunctions/handelabaf.php?id=' . $row['identifier'] . '" class="action-button check"><i class="fas fa-check"></i></a>';
                    echo '  </div>';
                    echo '</div>';
                }
            } 
            ?>
    </div>
</main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
<script src="/js/searchfunctions/arrestiebevelen.js"></script>
