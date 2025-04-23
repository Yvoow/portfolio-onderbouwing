<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
$koppel = $_SESSION['koppeling'];
?>
<?php include('../config.php');?>

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
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/giveFineReport.css">
    <link rel="stylesheet" href="/css/straffen.css">
    <link rel="stylesheet" href="/css/sendRapport.css">
    <title>MEOS | Nieuw rapport</title>
</head>

<body>
  <main>
        <?php include 'main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <button type="submit" name="btSubmit" form="reportForm" value="concept" class="black-button">Concept opslaan</button>
        <h1>Nieuw rapport</h1>
        <button type="submit" name="btSubmit" form="reportForm" value="indienen" class="black-button">Rapport indienen </button>
      </div>

      <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/createreport.php" onsubmit="return validateForm()">
        <div class="report-section">

            <!-- =----= Title =----= -->
            <div class="input-container">
                <label for="rapportTitle" >Rapport titel</label>
                <input id="rapportTitle" name="rapportTitle" class="input-with-border-label" type="text" maxlength="100" required/>
            </div>

            <!-- =----= VERDACHTE =----= -->
        <div class="report-section">
            <div class="input-container">
            <label for="ice-cream-choice">Verdachte:</label>
            <select id="ice-cream-choice" name="verdachte" class="input-with-border-label" required>
                <option value="">Selecteer een verdachte</option>
                <?php
                $usertable = $_SESSION['dbuserstable'];
                $identifiertable = $_SESSION['dbuseridentifiers'];
                $sql = "SELECT * FROM $usertable";
                $result = $conn2->query($sql);
                if ($result->num_rows > 0) {
                    // output data of each row
                    while ($row = $result->fetch_assoc()) {
                        echo '<option value="' . $row['firstname'] . ' ' . $row['lastname'] . '" data-identifier="' . $row[$identifiertable] . '">' . $row['firstname'] . ' ' . $row['lastname'] . '  (' . $row['firstname'] . ')</option>';
                    }
                } else {
                    echo '<option value="">Geen personen gevonden</option>';
                }
                ?>
            </select>
            <input type="hidden" id="data-identifier" name="data-identifier" value="">
            </div>
        </div>

            <!-- =----= Head agents =----= -->
            <div class="report-section">
            <div class="input-container">
                <label for="mainAgents">Hoofd-agent:</label>
                <select id="mainAgents" name="mainAgents" class="input-with-border-label" required>
                    <option value="">Selecteer een hoofd-agent</option>
                    <?php
                    $sql = "SELECT * FROM users WHERE koppeling='$koppel'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['name'] . '">' . $row['name'] . ' - ' . $row['roepnummer'] . '</option>';
                        }
                    } else {
                        echo '<option value="">Geen hoofd-agenten gevonden</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
            <?php
            if(isset($_GET['error']) && $_GET['error'] == 'invalid_agent') {
                echo '<p style="color: red;">Ongeldige agent!</p>';
            }
            ?>


            <!-- =----= Helping officers =----= -->
            <div class="report-section">
            <div class="input-container">
                <label for="supportAgents">Gekoppelde-agent:</label>
                <select id="supportAgents" name="supportAgents" class="input-with-border-label">
                    <option value="">Selecteer een gekoppelde agent</option>
                    <?php
                    $sql = "SELECT * FROM users WHERE koppeling='$koppel'";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while ($row = $result->fetch_assoc()) {
                            echo '<option value="' . $row['name'] . '">' . $row['name'] . ' - ' . $row['roepnummer'] . '</option>';
                        }
                    } else {
                        echo '<option value="">Geen gekoppelde agenten gevonden</option>';
                    }
                    ?>
                </select>
            </div>
        </div>
            <?php
            if(isset($_GET['error']) && $_GET['error'] == 'invalid_helper') {
                echo '<p style="color: red;">Ongeldige Gekoppelde-agent!</p>';
            }
            ?>

           
            <!-- =----= Box information =----= -->
            <div class="input-container text-information" id="editableContainer">
            <label for="supportAgents">Beschrijving</label>
                <div class="counts-container">
                    <span id="wordCount">0 woorden</span> | <span id="charCount">0 karakters</span>
                </div>
                <textarea id="extraInformation" class="input-with-border-label" oninput="countWordsAndCharacters()" name="extraInformation"></textarea>
            </div>
        </div>

        <!-- =----= Rapport type =----= -->
        <div class="report-section">
            <div class="input-container">
                <label for="reportType">Rapport type</label>
                <select id="reportType" class="input-with-border-label" name="reportType" required onchange="showSecondDropdown(this.value)">
                    <option value="" selected>Geen filters</option>
                    <option value="Opiumwet">Opiumwet</option>
                    <option value="Verkeerswet">Verkeerswet</option>
                    <option value="Strafrecht">Strafrecht</option>
                    <option value="Arrestatiebevel">Arrestatiebevel</option>
                </select>
            </div>

            <div id="secondDropdown" class="input-container" style="display:none;">
                <label for="secondReportType">Vuurwapen gevaarlijk</label>
                <select id="secondReportType" class="input-with-border-label" name="vuurwapen">
                    <option value="0" selected>Nee</option>
                    <option value="1">Ja</option>
                </select>
            </div>

            <div id="thirdDropdown" class="input-container" style="display:none;">
                <label for="thirdReportType">Steekwapen gevaarlijk</label>
                <select id="thirdReportType" class="input-with-border-label" name="steekwapen">
                    <option value="0" selected>Nee</option>
                    <option value="1">Ja</option>
                </select>
            </div>

            <div id="fourthDropdown" class="input-container" style="display:none;">
                <label for="fourthReportType">Drugs bezit/gebruik</label>
                <select id="fourthReportType" class="input-with-border-label" name="drugsbezit">
                    <option value="0" selected>Nee</option>
                    <option value="1">Ja</option>
                </select>
            </div>

            <div class="add-fines">
                <div class="fines-header">
                    <span class="name-title-fine">Straffen</span>
                    <a href="#" onclick="openPunishmentModal()" style="color: black;"><i class="fas fa-edit"></i></a>

                </div>
                <input type="hidden" name="finesHTML" id="finesHTMLInput" value="">
                <div class="all-fines">
                            
                </div>
                <div class="fines-bottom">
                    <span>Maanden: 0</span>
                    <span>Boete: €0,00.-</span>
                </div>
            </div>
        </div>
    </form>
    </div>
    <!-- Pop Up-->
    <div id="PunishmentModal" class="punishment-modal" style="display: none;">
        <div class="punishment-modal-content"> 
            <div class="edit-button">
                <button id="toevoegenButton" onclick="addFinesToReport()">Toevoegen</button>
                <button id="annulerenButton" onclick="closePunishmentModal()">Annuleren</button>
            </div>
            <div class="header-content">
                    <div class="fine-header-wrapper">
                        <div class="fine-header-container">
                            <span style="font-size: 35px; font-weight: bold;">Straffen</span>
                            <hr style="width: 50px; transform: rotate(90deg)">
                            <div class="fine-header-square verkeerswet-box"></div>
                            Verkeerswet
                        </div>
                        <div class="fine-header-container">
                            <div class="fine-header-square strafrecht-box"></div>
                            Strafrecht
                        </div>
                        <div class="fine-header-container">
                            <div class="fine-header-square opiumwet-box"></div>
                            Opiumwet
                        </div>
                    </div>
                    <div class="fine-search">
                        <input type="text" placeholder="Zoek straf">
                    </div>
                </div>

                <p id="no-fines-found" style="display: none; color: black;  font-size:26px;">Geen straffen gevonden</p>
                <section class="layout">
                    <div class="punishments">
                        <div class="fine-wrapper">
                        <?php
                            $sql = "SELECT * FROM straffen WHERE type='verkeerswet' AND koppeling='$koppel'";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                                // output data of each row
                                while($row = $result->fetch_assoc()) {
                                    echo '<div class="fine-container verkeerswet" data-name="'.$row['title'].'" data-boete="'.$row['boete'].'" data-maanden="'.$row['maanden'].'">';
                                    echo '<div class="fine-title">'.$row['title'];
                                    echo '</div>';
                                    echo '<div class="fine-details">';
                                    if($row['boete'] >= 1) {
                                        echo 'Boete: €'.$row['boete'];
                                    }
                                    if($row['maanden'] >= 1) {
                                        echo ' | Hechtenis: '.$row['maanden'];
                                        echo ' Maanden';
                                    }
                                    echo '</div>';


                                    echo '</div>';
                                }
                            }
                            ?>
                            <?php
                            $sql = "SELECT * FROM straffen WHERE type='opiumwet' AND koppeling='$koppel'";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                                // output data of each row
                                while($row = $result->fetch_assoc()) {
                                    echo '<div class="fine-container opiumwet" data-name="'.$row['title'].'" data-boete="'.$row['boete'].'" data-maanden="'.$row['maanden'].'">';
                                    echo '<div class="fine-title">'.$row['title'];
                                    echo '</div>';
                                    echo '<div class="fine-details">';
                                    if($row['boete'] >= 1) {
                                        echo 'Boete: €'.$row['boete'];
                                    }
                                    if($row['maanden'] >= 1) {
                                        echo ' | Hechtenis: '.$row['maanden'];
                                        echo ' Maanden';
                                    }
                                    echo '</div>';


                                    echo '</div>';
                                }
                            }
                            ?>
                            <?php
                            $sql = "SELECT * FROM straffen WHERE type='strafrecht' AND koppeling='$koppel'";
                            $result = $conn->query($sql);
                            if ($result->num_rows > 0) {
                                // output data of each row
                                while($row = $result->fetch_assoc()) {
                                    echo '<div class="fine-container strafrecht" data-name="'.$row['title'].'" data-boete="'.$row['boete'].'" data-maanden="'.$row['maanden'].'">';
                                    echo '<div class="fine-title">'.$row['title'];
                                    echo '</div>';
                                    echo '<div class="fine-details">';
                                    if($row['boete'] >= 1) {
                                        echo 'Boete: €'.$row['boete'];
                                    }
                                    if($row['maanden'] >= 1) {
                                        echo '  Hechtenis: '.$row['maanden'];
                                        echo ' Maanden';
                                    }
                                    echo '</div>';


                                    echo '</div>';
                                }
                            }
                            ?>
                        </div>
                    </div>


                    <div class="punishmentsInfo">
                        <h2 id="selectedFineTitles">Geselecteerde boetes:</h2><br>
                        <div class="selectedFineNames"></div>
                        <br>
                        <div class="bottomrowPunishments">
                            <span id="totalMaanden" class="months">Hechtenis: 0</span>
                            <span id="totalBoetes" class="Boetes">Boetes: €0</span>
                        </div>
                    </div>
                </section>
        </div>
    </div>
</body>
</html>
<script>
    document.getElementById('ice-cream-choice').addEventListener('change', function() {
        var selectedIndex = this.selectedIndex;
        var selectedOption = this.options[selectedIndex];
        var dataIdentifier = selectedOption.getAttribute('data-identifier');
        document.getElementById('data-identifier').value = dataIdentifier;
    });
</script>
<script src="/js/iceCreamChoice.js"></script>
<script src="/js/loader.js"></script>
<script src="/js/charcterscounter.js"></script>
<script src="/js/main.js"></script>
<script src="/js/giveFineReport.js"></script>
<script src="/js/searchfunctions/searchfilter.js"></script>
<script src="/js/modal-popups/giveFine.js"></script>
<script src="/js/secondDropdown.js"></script>