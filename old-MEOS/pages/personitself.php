<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/personsearch.css">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="../css/newrapport.css">
    <title>MEOS | Persoon zelf</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
        <?php
            $identifiertable = $_SESSION['dbuseridentifiers'];
            $identifier = $_GET['identifier'];
            $usertable = $_SESSION['dbuserstable'];
            $vehiclestable = $_SESSION['dbvehiclestable'];
            $licensestable = $_SESSION['dblicensestable'];
            $phonetable = $_SESSION['dbphonecolumn'];
            $licenseidcolumn = $_SESSION['dblicensesidcolumn'];
            $sql = "SELECT * FROM $usertable INNER JOIN job_grades ON job=job_name WHERE $identifiertable='$identifier' LIMIT 1";
            $result = $conn2->query($sql);
            if ($result->num_rows > 0) {
              while($row = $result->fetch_assoc()) {
                echo '<div class="header-buttons">';
                if($row['arrestatiebevel'] > 0) {
                  echo '<button class="wanted-button normal-button right-none">PERSOON WORDT GEZOCHT!</button>';
                } else {
                  echo '<button class="normal-button">Persoon wordt niet gezocht</button>';
                }
                echo '<a href="newrapport.php" id="maakRapportButton" class="normal-button" style="text-align: center; color: black; font-weight: 500;">Maak rapport over persoon</a>';
                echo '<button class="normal-button right-none" onclick="ShowUpload()">Foto toevoegen</button>';
                echo '</div>';

                echo '<div class="person-container">';
                echo '    <div class="aboutPerson1Container">';
                echo '<img src="' .$row['image']. '" class="photoOfPerson">';
                echo '<h3 style="margin-bottom: 20px;">UWV Status</h3>';
                $labelname = $row['job'];
                $grade = $row['job_grade'];
                $sql10 = "SELECT * FROM job_grades WHERE job_name='$labelname' and grade='$grade'";
                $result10 = $conn2->query($sql10);
                while($row10 = $result10->fetch_assoc()) {
                  echo '<span class="jobInformation">'.$row10['label'].'</span>';
                }
                echo '<br><br>';
                 /* VOERTUIGEN */
                 echo '        <h3 style="margin-bottom: 20px;">Voertuigen</h3>';
                 echo '<div class="carlist">';
                 $ownertable = $_SESSION['dbvehownercolumn'];
                 $platetable = $_SESSION['dbplatecolumn'];
                  $sql2 = "SELECT * FROM $vehiclestable WHERE $ownertable='$identifier'";
                  $result2 = $conn2->query($sql2);
                  if ($result2->num_rows > 0) {
                    while($row2 = $result2->fetch_assoc()) {
                      echo '<span class="jobInformation">'.$row2[$platetable].'</span>';
                    }
                  } else {
                    echo '<span class="jobInformation">Geen voertuigen gevonden</span>';
                  }
                  echo '</div>';
                  echo '</div>';

                echo '<div class="aboutPerson2Container">';
                echo '<div class="inner-information">';
                echo '<h3>Naam</h3>';
                echo '<p>'.$row['firstname']. ' ' .$row['lastname']. '</p>';
                echo '</div>';

                echo '<div class="inner-information">';
                echo '<h3>Lengte</h3>';
                echo '<p>'.$row['height'].' cm</p>';
                echo '</div>';

                echo '<div class="inner-information">';
                echo '<h3>Geslacht</h3>';
                echo '<p>'.$row['sex'].'</p>';
                echo '</div>';

                echo '<div class="inner-information">';
                echo '<h3>Geboorte datum</h3>';
                echo '<p>'.$row['dateofbirth'].'</p>';
                echo '</div>';

                /* HIER NOG LICENSES (voor elke een paragraph) */
                echo '<div class="inner-information">';
                echo '<h3>Rijbewijzen</h3>';
                $sql3 = "SELECT * FROM $licensestable WHERE $licenseidcolumn='$identifier'";
                $result3 = $conn2->query($sql3);
                if ($result3->num_rows > 0) {
                  while($row3 = $result3->fetch_assoc()) {
                    echo '<p>- '.$row3['type'].'</p>';
                  }
                } else {
                  echo '<p>Geen rijbewijzen in bezit</p>';
                }
                echo '</div>';

                echo '<div class="inner-information">';
                echo '<h3>Telefoonnummer</h3>';
                echo '<p>'.$row[$phonetable].'</p>';
                echo '</div>';

                echo '</div>';




                echo '<div class="aboutPerson2Container">';
                echo '<div class="inner-information">';

                echo '<div class="crinialRecordContainer">';
                echo '<h3>Strafblad</h3>';
                echo '<div class="searched-for-container">';
                $koppel = $_SESSION['koppeling'];
                $sql4 = "SELECT * FROM rapporten WHERE verdachteidentifier='$identifier' and koppeling='$koppel'";
                $result4 = $conn->query($sql4);
                if ($result4->num_rows > 0) {
                  while($row4 = $result4->fetch_assoc()) {
                    echo '<a class="searched-for" href=reportitself.php?id='.$row4['id']. '>Zaaknummer: #'.$row4['id'].'</a>';
                  }
                } else {
                  echo '<p>Geen zaak gevonden</p>';
                }
                echo '</div>';
                echo '</div>';
                echo '</div>';
              }
            } else {
              echo "0 info gevonden";
            }
          ?>
    </main>


    <div class="popup-training" id="photoPopup">
          <div class="test12400">
              <div class="top-container-buttons">
                  <h1>Mugshot uploaden</h1>
              </div>
  
                <form id="pictureform" class="rapport-wrapper" method="POST" action="phpfunctions/personpicture.php?id=<?php echo $identifier; ?>" style="gap: 20px !important;">
          
                  <div class="report-section">
                      <!-- =----= Welke training =----= -->
                      <div class="input-container">
                          <label for="url">URL</label>
                          <input id="url" name="url" class="input-with-border-label" type="text" required/>
                      </div>
                  </div>
              </form>
              <div class="versturenWrapperButton">
                  <button class="getTrainingButton versturenTrainingButton" type="submit" form="pictureform" style="margin: auto; margin-top: 10px;">Versturen</button>
              </div>
              <span class="close"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>
</body>
</html>
<script>

var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    HideUpload()
  }
    function ShowUpload() {
        document.getElementById("photoPopup").style.display = "block";
    }

    function HideUpload() {
        document.getElementById("photoPopup").style.display = "none";
    }
    </script>
<script src="/js/iceCreamChoice.js"></script>
<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>