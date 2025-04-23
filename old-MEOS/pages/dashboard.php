<?php
session_start();
if (!isset($_SESSION['username'])) {
  header('location: ../../index.php');
}

$koppel = $_SESSION['koppeling'];
?>
<?php include('../config.php');?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <script src="https://kit.fontawesome.com/47a8d14326.js" crossorigin="anonymous"></script>
    <link rel="icon" type="/images/fslogo.png" sizes="32x32" href="/images/fslogo.png">
    <link rel="stylesheet" href="../css/main.css">
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/straffen.css">
    <link rel="stylesheet" href="../css/newrapport.css">
    <title>MEOS | Dashboard</title>
</head>
<body>
    <main>
          <?php include 'main/sidebar.php'; ?>
        <div class="content">
          <div class="all-content">
            <div class="dashboard-container">
              <div class="dashboard-row left-top">
                <div class="dashboard-content-wrapper">
                  <div class="dashboard-content-header">
                    <div class="dashboard-text-container blue-background">
                    <?php
                        $usernamee = $_SESSION['username'];
                        $sql = "SELECT * FROM users WHERE username='$usernamee' AND koppeling='$koppel'";
                        $result = $conn->query($sql);
                        if ($result->num_rows > 0) {
                          while($row = $result->fetch_assoc()) {
                                echo '<h2 class="dashboard-text-line">Hallo '.$row['name'].'</h2>';
                            }
                        } else {
                            echo "401 error";
                        }
                        ?>
                        <p class="dashboard-text-line">Bekijk je voortgang binnen het korps</p>
                    </div>
                  </div>
                    <div class="progress-bar-container">
                      <div class="progress">
                      </div>
                      <div class="steps">
                      <?php
                          $usernamee = $_SESSION['username'];
                          $sql = "SELECT * FROM users WHERE username='$usernamee' AND koppeling='$koppel'";
                          $result = $conn->query($sql);
                          if ($result->num_rows > 0) {
                            while($row = $result->fetch_assoc()) {
                              $ranks = [
                                'Aspirant' => 0,
                                'Surveillant' => 1,
                                'Agent' => 2,
                                'Hoofdagent' => 3,
                                'Brigadier' => 4,
                                'Inspecteur' => 5, 
                                'Hoofd inspecteur' => 6,
                                'Commissaris' => 7,
                                'Hoofd Commissaris' => 8,
                                'Eerste Hoofd Commissaris' => 9,
                            ];
                            
                            $rank = $row['rank'];
                            
                            foreach ($ranks as $key => $value) {
                                $completedClass = ($value <= $ranks[$rank]) ? ' completed' : '';
                                echo "<div class='step$completedClass' id='$value'><img src='/images/badge/badge$value.png' alt=''></div>";
                            }
                              }
                            }
                          ?>
                      </div>
                  </div>
                </div>
              </div>
  
              <!-- Documenten  -->
            <div class="dashboard-row right-top">
              <div class="dashboard-content-wrapper">
                <div class="dashboard-content-header bottom-content-here">
                  <div class="left-top-container tasrsty">
                      <h2>Trainingen</h2>
                      <p>Vraag nu je training aan voor een nieuwe specialisatie</p>
                  </div>
                  <div class="left-top-container">
                    <button class="getTrainingButton">Aanvragen</button>
                  </div>
                </div>   
              </div>
            </div>
  
              <!-- Arrestiebevelen -->
              <div class="dashboard-row left-bottom">
                <div class="dashboard-content-wrapper">
                  <div class="dashboard-content-header">
                    <i class="fas fa-asterisk dashboard-icon"></i>
                    <div class="dashboard-text-container">
                      <h2 class="dashboard-text-line">Open arrestiebevelen</h2>
                      <p class="dashboard-text-line">Arrestiebevelen die momenteel openstaan</p>
                    </div>
                  </div>
                  <div class="arrest-container">   
                <?php
                    $sql = "SELECT * FROM arrestatiebevelen WHERE koppeling='$koppel' and afgehandeld='0' LIMIT 4";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while($row = $result->fetch_assoc()) {                     
                          echo '<div class="arrest-column"> ';
                          echo $row['naam'];
                          echo '<a style="text-decoration: none; color: white;" href="arrestiebevelenInformation.php?id='.$row['id'].'"><i class="fas fa-info arrest-icon"></i></a>';
                          echo '<div class="searched-for-icons">';
                            if($row['vuurwapen'] == '1') {
                              echo '<svg  class="searched-for-icon" cxmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">';
                              echo ' <path fill="#ffffff" d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v8H32C14.3 64 0 78.3 0 96V208c0 17.7 14.3 32 32 32H42c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480h96c14.7 0 27.5-10 31-24.2L217 352H321.4c23.7 0 44.8-14.9 52.7-37.2L400.9 240H432c8.5 0 16.6-3.4 22.6-9.4L477.3 208H544c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H528V56zM321.4 304H229l16-64h105l-21 58.7c-1.1 3.2-4.2 5.3-7.5 5.3zM80 128H464c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>';
                              echo '</svg>';
                            }
                            if($row['steekwapen'] == '1') {
                              echo '<div  class="searched-for-icon">';
                              echo ' <i class="fa-solid fa-hammer"></i>';
                              echo '</div>';
                            }
                            if($row['drugs'] == '1') {
                              echo '<div  class="searched-for-icon">';
                              echo ' <i class="fa-solid fa-pills"></i>';
                              echo '</div>';
                            }
                          echo '</div>';
                          echo '</div>';
                        }
                    } else {
                      echo '<span style="color: black;">Geen arrestatiebevelen gevonden</span>';
                  }
                    ?>
                </div>
                </div>
              </div>
  
              <!-- Rapporten -->
              <div class="dashboard-row center-bottom">
                <div class="dashboard-content-wrapper">
                  <div class="dashboard-content-header">
                    <i class="fas fa-sticky-note dashboard-icon"></i>
                    <div class="dashboard-text-container">
                        <h2 class="dashboard-text-line">Recent rapport</h2>
                        <p class="dashboard-text-line">De laatste opgegeven rapportage</p>
                    </div>
                  </div>
                  <?php
                    $sql = "SELECT * FROM rapporten WHERE koppeling='$koppel' ORDER BY id DESC LIMIT 1";
                    $result = $conn->query($sql);
                    if ($result->num_rows > 0) {
                        // output data of each row
                        while($row = $result->fetch_assoc()) {                         
                          echo '<a class="recent-rapport" href=reportitself.php?id='.$row['id']. '>';
                          echo '<a class="recent-rapport-title" href=reportitself.php?id='.$row['id']. '> '.$row["title"]. '</a>';
                          echo '<div><a class="rapport-label" href=reportitself.php?id='.$row['id']. '><br>Zaaknummer:</a><span class="rapport-info">#'.$row['id']. '</span></div>';
                          echo '<div><a class="rapport-label" href=reportitself.php?id='.$row['id']. '>Agenten:</a><span class="rapport-info">'.$row['agent'].'. - '.$row['helpers'].'</span></div>';
                          echo '<div><a class="rapport-label" href=reportitself.php?id='.$row['id']. '>Verdachte:</a><span class="rapport-info">'.$row['verdachte'].'</span></div>';
                          echo '<div><a class="rapport-label" href=reportitself.php?id='.$row['id']. '>Type:</a><span class="rapport-info">'.$row['type'].'</span></div>';
                          echo '</a>';
                          echo '<br>';
                        }
                    } else {
                      echo '<span style="color: black;">Geen rapportages gevonden</span>';
                    }
                    ?>
                  </div>
              </div>
  
              <!-- Collega's -->
              <div class="dashboard-row right-bottom">
                <div class="dashboard-content-wrapper">
                  <a href="collega.php" style="color: black;">
                    <div class="dashboard-content-header">
                      <i class="fas fa-users dashboard-icon"></i>
                      <div class="dashboard-text-container">
                          <h2 class="dashboard-text-line">Bekijk collega's</h2>
                          <p class="dashboard-text-line">Bekijk wie er in je korps zit</p>
                      </div>
                    </div>

                    <?php
                      $sql = "SELECT * FROM users WHERE koppeling='$koppel' and serverowner='0' LIMIT 3";
                      $result = $conn->query($sql);
                      if ($result->num_rows > 0) {
                          // output data of each row
                          while($row = $result->fetch_assoc()) {                         
                            echo '<div class="user-card">';
                            echo '<div class="user-avatar"><img src="'.$row['img'].'"></div>';
                            echo '<div class="user-info">';
                            echo '<span class="user-id">'.$row['roepnummer'].' - '.$row['name'].'</span> ';
                            echo '<div class="user-role">'.$row['rank'].'</div>';
                            echo '</div>';
                            echo '</div>';
                          }
                      } else {
                        echo '<span style="color: black;">Geen gebruikers gevonden</span>';
                      }
                      ?>
                      </a>
               </div>
              </div>
            </div>    
            </div>
          </div>
        </div>
        <div id="popup-straffen" class="modal">
            <div class="straffen-pop-up">
                <span class="close"><i class="fa-solid fa-xmark"></i></span>
                <div id="straffen-content-pop-up">Aan het laden</div>
            </div>
        </div>
      </main>

      <div class="popup-training">
          <div class="test12400">
              <div class="top-container-buttons">
                  <h1>Training aanvragen</h1>
              </div>
  
                <form id="ibtform" class="rapport-wrapper" method="POST" action="phpfunctions/trainingaanvraag.php" style="gap: 20px !important;">
                  <div class="report-section">
                  <?php
                      $sql = "SELECT * FROM users WHERE username='$usernamee' AND koppeling='$koppel'";
                      $result = $conn->query($sql);
                      if ($result->num_rows > 0) {
                        while($row = $result->fetch_assoc()) {
                          echo '<div class="input-container">';
                          echo '    <label for="roepNummer">Roepnummer + Naam</label>';
                          echo '    <input id="roepNummer" name="roepNummer" class="input-with-border-label" type="text" value="'.$row['roepnummer'].' '.$row['name'].'" readonly/>';
                          echo '</div>';
                          
                          echo '<div class="input-container">';
                          echo '    <label for="rang">Rang</label>';
                          echo '    <input id="rang" name="rang" class="input-with-border-label" type="text" value="'.$row['rank'].'" readonly/>';
                          echo '</div>';
                          }
                      } else {
                          echo "0 documenten gevonden";
                      }
                      ?>         
                  </div>
          
                  <div class="report-section">
                      <!-- =----= Welke training =----= -->
                      <div class="input-container">
                          <label for="trainingName">Welke training wil je aanvragen?</label>
                          <input id="trainingName" name="trainingName" class="input-with-border-label" type="text" maxlength="10" required/>
                      </div>
          
                      <!-- =----= Information =----= -->
                      <div class="input-container">
                          <label for="specialInfo">Speciale informatie?</label>
                          <input id="specialInfo" name="specialInfo" class="input-with-border-label" type="text" maxlength="100" required/>
                      </div>
                  </div>
              </form>
              <div class="versturenWrapperButton">
                  <button class="getTrainingButton versturenTrainingButton" type="submit" form="ibtform">Versturen</button>
              </div>
          </div>
        </div>
</body>
</html>
<script src="../js/main.js"></script>
<script src="../js/loader.js"></script>
<script src="../js/straffenPopUp.js"></script>
<script src="../js/progressbar.js"></script>
<script src="../js/modal-popups/trainingModalPopup.js"></script>
<style>
    .thankYouMessage, #thankYouMessage {
    font-size: 50px;
    color: black;
    align-items: center;
    margin: 0 auto;

  }
</style>