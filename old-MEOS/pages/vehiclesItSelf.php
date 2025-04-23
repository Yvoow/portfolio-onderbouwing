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
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/personsearch.css">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="../css/newrapport.css">
    <title>MEOS | Over voertuig</title>
</head>
<body>
    <main>
            <?php include 'main/sidebar.php'; ?>
        <div class="content">
                <?php
                $plate = $_GET['plate'];
                $ownedvehicles = $_SESSION['dbvehiclestable'];
                $identifiertable = $_SESSION['dbuseridentifiers'];
                $ownertable = $_SESSION['dbvehownercolumn'];
                $platetable = $_SESSION['dbplatecolumn'];
                $sql = "SELECT * FROM $ownedvehicles INNER JOIN users ON $ownertable=$identifiertable WHERE $platetable='$plate'";
                $result = $conn2->query($sql);
                if ($result->num_rows > 0) {
                    while($row = $result->fetch_assoc()) {
                        echo '<div class="header-buttons">';
                        if ($row['gezocht'] > 0) {
                            echo '<button class="wanted-button normal-button right-none">VOERTUIG WORD GEZOCHT!</button>';
                            echo '<button class="normal-button right-none"><a href="phpfunctions/markasfound.php?plate='.$row['plate'].'" style="color: black; text-decoration: none;">Markeren als gevonden</a></button>';
                        } else {
                            echo '<button class="normal-button right-none"><a href="phpfunctions/markasgezocht.php?plate='.$row['plate'].'" style="color: black; text-decoration: none;">Markeren als gezocht</a></button>';
                        }
                        echo '<button class="normal-button right-none" onclick="ShowUpload()">Foto toevoegen</button>';
                        echo '<a href="personitself.php?identifier=' . $row['owner'] . '" class="normal-button" style="text-align: center; color: black;">Eigenaar van voertuig</a>';
                        echo '</div>';
                        echo '<div class="vehicle-wrapper">';
                        echo '<div class="Information">';
                        echo '<div class="inner-information">';
                        echo '<h3>Type</h3>';
                        echo '<p>'.$row['type'].'</p>';
                        echo '</div>';

                        echo '<div class="inner-information">';
                        echo '<h3>Kenteken</h3>';
                        echo '<p>'.$row['plate'].'</p>';
                        echo '</div>';

                        echo '<div class="inner-information">';
                        echo '<h3>Eigenaar</h3>';
                        echo '<p>'.$row['firstname'].' '.$row['lastname'].'</p>';
                        echo '</div>';

                        echo '<div class="inner-information">';
                        echo '<h3>Gekocht op</h3>';
                        echo '<p>'.$row['verkocht'].'</p>';
                        echo '</div>';

                        echo '<div class="inner-information">';
                        echo '<h3>Garage</h3>';
                        echo '<p>'.$row['stored'].'</p>';
                        echo '</div>';
                        echo '</div>';

                        echo '<img src="'.$row['image'].'" alt="" style="width: 50%; max-height: 250px;">';
                        echo '</div>';
                        echo '</div>';
                    }
                } else {
                echo "0 voertuigen gevonden";
                }
            ?>
        </div>
    </main>

    <div class="popup-training" id="photoPopup">
          <div class="test12400">
              <div class="top-container-buttons">
                  <h1>Foto uploaden</h1>
              </div>
  
                <form id="pictureform" class="rapport-wrapper" method="POST" action="phpfunctions/picture.php?plate=<?php echo $plate; ?>" style="gap: 20px !important;">
          
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

<script src="/js/loader.js"></script>
<script src="/js/main.js"></script>
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
</body>
</html>

<style>
    .vehicle-wrapper {  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "Information Searched"
    ". ."
    ". .";
}
.inner-information {
    margin-bottom: 30px;
}

.Information { grid-area: Information; }

.Searched { grid-area: Searched; }
.interacties {
    display: flex;
    gap: 30px;
}
</style>