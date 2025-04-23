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
    <title>MEOS | Rapport bewerken</title>
</head>

<?php
    $koppeling = $_SESSION['koppeling'];
    $id = $_GET['id'];
    $sql7 = "SELECT * FROM rapporten WHERE koppeling='$koppeling' AND id='$id'";
    $result7 = $conn->query($sql7);
    $row7 = $result7->fetch_assoc()
?>
<body>
  <main>
        <?php include 'main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <h1>Rapport bewerken</h1>
        <button type="submit" name="submit" form="reportForm" value="indienen" class="black-button">Rapport opslaan </button>
        <button type="submit" name="submit" form="reportForm" value="indienen" class="black-button"><a href="phpfunctions/publishreport.php?id=<?php echo $row7['id'];?>" class="deleteclass">Rapport publiceren </a></button>
      </div>

      <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/changereport.php" onsubmit="return validateForm()">
        <div class="report-section">

            <!-- =----= Title =----= -->
            <div class="input-container">
                <label for="rapportTitle" >Rapport titel</label>
                <input id="rapportTitle" name="title" class="input-with-border-label" type="text" value="<?php echo $row7['title'];?>"required/>
            </div>  

            <?php
            if(isset($_GET['error']) && $_GET['error'] == 'invalid_agent') {
                echo '<p style="color: red;">Ongeldige agent!</p>';
            }
            ?>

            <?php
            if(isset($_GET['error']) && $_GET['error'] == 'invalid_helper') {
                echo '<p style="color: red;">Ongeldige Gekoppelde-agent!</p>';
            }
            ?>

            Zaaknummer: #<input type="hidden" name="finesHTML" id="finesHTMLInput" value="<?php echo $row7['id']; ?>"><?php echo $row7['id']; ?></input>
            <!-- =----= Box information =----= -->
            <div class="input-container text-information" id="editableContainer">
            <label for="supportAgents">Beschrijving</label>
                <div class="counts-container">
                    <span id="wordCount">0 woorden</span> | <span id="charCount">0 karakters</span>
                </div>
                <textarea id="extraInformation"class="input-with-border-label" oninput="countWordsAndCharacters()" name="extraInformation"><?php echo $row7['text'];?></textarea>
            </div>
        </div>

        <!-- =----= Rapport type =----= -->
        <div class="report-section">
            <div class="input-container">
                <label for="reportType">Rapport type</label>
                <select id="reportType" class="input-with-border-label" name="reportType" required>
                    <option value="<?php echo $row7['type'];?>" selected ><?php echo $row7['type'];?></option>
                    <option value="Opiumwet">Opiumwet</option>
                    <option value="Verkeerswet">Verkeerswet</option>
                    <option value="Strafrecht">Strafrecht</option>
                    <option value="Arrestatiebevel">Arrestatiebevel</option>
                </select>
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
        </div>
    </div>
</body>
</html>
<script src="/js/iceCreamChoice.js"></script>
<script src="/js/loader.js"></script>
<script src="/js/charcterscounter.js"></script>
<script src="/js/main.js"></script>
<script src="/js/giveFineReport.js"></script>
<script src="/js/searchfunctions/searchfilter.js"></script>
<script src="/js/modal-popups/giveFine.js"></script>