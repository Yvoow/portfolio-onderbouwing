<?php
include('../config.php');

if (!isset($_GET['id'])) {
    echo "Agent ID not specified.";
    exit;
}
?>
    <link rel="stylesheet" href="../css/newrapport.css">
    <link rel="stylesheet" href="/css/index.css">
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
<div class="test">
    <!-- =----= Als je op agent klikt informatie over die agent =----= -->
    <?php
    $agent_id = $_GET['id'];
    $sql = "SELECT * FROM users WHERE id = " . $agent_id;
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $ibt = $row['ibt'];
            $roepnummer = $row['roepnummer'];
            $rang = $row['rank'];
            echo '<div class="collega-container agent-info left-div">';
            echo '    <div class="photoOfPersonWrapper"><img src="' . $row['img'] . '" alt="Avatar" class="imageItSelf"></div>';
            echo '    <div class="inner-information middle-section">';
            echo '        <p><h3>Naam:</h3>' . $row['name'] . '</p>';
            echo '    </div>';
            echo '    <div class="inner-information middle-section">';
            echo '        <p><h3>Rang:</h3>' . $row['rank'] . '</p>';
            echo '    </div>';
            echo '    <div class="inner-information middle-section">';
            echo '        <h3>Roepnummer:</h3>';
            echo '        <p>' . $row['roepnummer'] . '</p>';
            echo '    </div>';
            echo '    <div class="inner-information middle-section">';
            echo '        <h3>Laatste inlog:</h3>';
            echo '        <p>' . $row['lastlogin'] . '</p>';
            echo '    </div>';
            echo '</div>';
            echo '    <div class="inner-information middle-section">';
            echo '<div class="header-buttons">';


            // IDK WAT DEZE BUTTONS MOETEN ZEGGEN
            echo '<a href="phpfunctions/firecop.php?id='.$row['id'].'"><button class="normal-button">Medewerker ontslaan</button></a>';
            echo '<button class="normal-button" onclick="ShowUpload()">Details aanpassen</button>';
            echo '</div>';

            // echo '        <h3>Specalicaties:</h3>';
            // echo '        <p>' . $row['specialisaties'] . '</p>';
            echo '    </div>';
            echo '</div>';
        }
    } else {
        echo "No agent found with ID " . $agent_id;
    }

    $agent = $result->fetch_assoc();
    ?>
</div>

<div class="popup-training" id="photoPopup">
          <div class="test12400">
              <div class="top-container-buttons">
                  <h1>Medewerker aanpassen</h1>
              </div>
  
                <form id="pictureform" class="rapport-wrapper" method="POST" action="phpfunctions/changeroepnummer.php?id=<?php echo $agent_id; ?>" style="gap: 20px !important;">
          
                  <div class="report-section">
                      <!-- =----= Welke training =----= -->
                      <div class="input-container">
                          <label for="url">Roepnummer</label>
                          <input id="url" name="url" class="input-with-border-label" type="text" required value="<?php echo $roepnummer; ?>"/>
                      </div>
                      <div class="input-container">
                          <label for="url">IBT toegang</label>
                          <select id="ibt" name="ibt" class="input-with-border-label" type="text" required>
                            <?php 
                            if ($ibt == 1) { 
                                echo   '<option value="1" selected>Ja</option>';
                                echo   '<option value="0">Nee</option>';
                            } else { 
                                echo   '<option value="1">Ja</option>';
                                echo   '<option value="0" selected>Nee</option>';
                            }
                            ?>
                          </select>
                      </div>

                      <div class="input-container">
                          <label for="url">Rang</label>
                          <select id="rank" name="rank" class="input-with-border-label" type="text" required>
                            <option value="<?php echo $rang; ?>"><?php echo $rang; ?></option>
                            <option value="Aspirant">Aspirant</option>
                            <option value="Surveillant">Surveillant</option>
                            <option value="Agent">Agent</option>
                            <option value="Hoofdagent">Hoofdagent</option>
                            <option value="Brigadier">Brigadier</option>
                            <option value="Inspecteur">Inspecteur</option>
                            <option value="Hoofd Inspecteur">Hoofd Inspecteur</option>
                            <option value="Commissaris">Commissaris</option>
                            <option value="Hoofd Commissaris">Hoofd Commissaris</option>
                            <option value="Eerste Hoofd Commissaris">Eerste Hoofd Commissaris</option>
                          </select>
                      </div>
                  </div>
              </form>
              <div class="versturenWrapperButton">
                  <button class="getTrainingButton versturenTrainingButton" type="submit" form="pictureform" style="margin: auto; margin-top: 10px;">Versturen</button>
              </div>
              <span class="close"><i class="fa-solid fa-xmark"></i></span>
          </div>
        </div>

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
