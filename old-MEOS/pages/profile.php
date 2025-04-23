<?php
session_start();
if (!isset($_SESSION['username'])) {
    header('location: ../../index.php');
}
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
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/newrapport.css">
    <link rel="stylesheet" href="/css/serverconsole.css">
    <title>MEOS | Profiel</title>
</head>

<body>
  <main>
        <?php include 'main/sidebar.php'; ?>
    <div class="content">

        <!-- =----= Buttons on top =----= -->
      <div class="top-container-buttons">
        <h1>Profiel</h1>
      </div>

      <form id="reportForm" class="rapport-wrapper" method="POST" action="phpfunctions/updateprofile.php" style="gap: 250px !important;">
        <div class="management-section">

        <?php
          $koppel = $_SESSION['koppeling'];
          $id = $_GET['id'];
          $sql = "SELECT * FROM users WHERE id='$id' AND koppeling='$koppel'";
          $result = $conn->query($sql);
          if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo '<h1 style="font-size: 20px;">Gebruiker</h1>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Username</label>';
                echo '    <input id="titelDocument" name="username" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['username'].'" maxlength="20" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Password</label>';
                echo '    <input id="titelDocument" name="pass" class="input-with-border-label-management" style="color: black;" type="password" value="'.$row['pass'].'" maxlength="40" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Naam</label>';
                echo '    <input id="titelDocument" name="name" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['name'].'" maxlength="20"/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Roepnummer</label>';
                echo '    <input id="titelDocument" name="roepnummer" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['roepnummer'].'" maxlength="10" required/>';
                echo '</div>';
                echo '<div class="input-container-management">';
                echo '    <label for="titelDocument">Profielfoto</label>';
                echo '    <input id="titelDocument" name="profilepic" class="input-with-border-label-management" style="color: black;" type="text" value="'.$row['img'].'" required/>';
                echo '</div>';
              }
          } else {
              echo "0 documenten gevonden";
          }
          ?>
        <div class="serverconsole-savebuttons">
            <button type="submit" form="reportForm" class="save-button"> Gegevens opslaan </button>
      </div>
        </div>
    </form>
    </div>
</main>
</body>
</html>
<script src="/js/loader.js"></script>
<script src="/js/charcterscounter.js"></script>
<script src="/js/main.js"></script>